import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, BarChart3, Sparkles, User, TrendingUp, FileCheck, Zap, LayoutTemplate, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import api, { Analysis, Resume } from "@/lib/api";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumesResult, analysesResult] = await Promise.all([
          api.getResumes(),
          api.getAnalyses()
        ]);

        if (resumesResult.data) {
          setResumes(resumesResult.data);
        }
        if (analysesResult.data) {
          setAnalyses(analysesResult.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats from real data
  const totalResumes = resumes.length;
  const totalAnalyses = analyses.length;
  const latestScore = analyses.length > 0 ? Math.round(analyses[0].ats_score) : null;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-score-green";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getStrengthLabel = (score: number | null) => {
    if (score === null) return "N/A";
    if (score >= 80) return "Strong";
    if (score >= 60) return "Moderate";
    return "Needs Work";
  };

  const stats = [
    { label: "Latest ATS Score", value: latestScore ? `${latestScore}%` : "N/A", icon: TrendingUp, color: latestScore ? getScoreColor(latestScore) : "text-muted-foreground" },
    { label: "Resumes Uploaded", value: totalResumes.toString(), icon: FileCheck, color: "text-primary" },
    { label: "Resume Strength", value: getStrengthLabel(latestScore), icon: Zap, color: latestScore ? getScoreColor(latestScore) : "text-muted-foreground" },
  ];

  const features = [
    {
      title: "Analyze Resume",
      description: "Upload your resume and job description to get an instant ATS compatibility score.",
      icon: Upload,
      url: "/analyze",
      cta: "Start Analysis",
    },
    {
      title: "View ATS Reports",
      description: "Access detailed breakdowns of keyword matches, skill gaps, and formatting scores.",
      icon: BarChart3,
      url: "/history",
      cta: "View Reports",
    },
    {
      title: "Optimize Resume",
      description: "Get AI-powered suggestions to improve your resume and boost your ATS score.",
      icon: Sparkles,
      url: "/optimize",
      cta: "Optimize Now",
    },
    {
      title: "Profile Settings",
      description: "Manage your account, update preferences, and view your analysis history.",
      icon: User,
      url: "/profile",
      cta: "Go to Profile",
    },
    {
      title: "Resume Templates",
      description: "Browse professional templates optimized for ATS systems and customize them.",
      icon: LayoutTemplate,
      url: "/templates",
      cta: "Browse Templates",
    },
    {
      title: "AI Career Assistant",
      description: "Chat with our AI for resume tips, keyword suggestions, and career guidance.",
      icon: MessageSquare,
      url: "#chatbot",
      cta: "Start Chat",
    },
  ];

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Welcome */}
        <motion.div variants={item} className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome back, <span className="text-gradient">{user?.name || "User"}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your resume performance.</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-5 shadow-card border border-border flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-display font-bold ${stat.color}`}>{loading ? "..." : stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent Analyses */}
        {analyses.length > 0 && (
          <motion.div variants={item} className="mb-8">
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">Recent Analyses</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Score</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Job Title</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Resume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {analyses.slice(0, 5).map((analysis) => (
                      <tr key={analysis.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground">
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-semibold ${getScoreColor(analysis.ats_score)}`}>
                            {Math.round(analysis.ats_score)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {analysis.job_description?.title || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {analysis.resume?.filename || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Feature Cards */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feat) => (
            <Link
              key={feat.title}
              to={feat.url}
              className="group bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-elevated hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                <feat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-1">{feat.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{feat.description}</p>
              <span className="text-sm font-medium text-primary group-hover:underline">{feat.cta} →</span>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
