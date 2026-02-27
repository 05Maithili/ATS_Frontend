import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Upload, 
  BarChart3, 
  Search, 
  Filter, 
  Building2, 
  ArrowRight 
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const jobListings = [
  { 
    id: 1, 
    title: "Senior Frontend Developer", 
    company: "Google", 
    location: "Bangalore, KA", 
    type: "Full-time", 
    salary: "₹35L – ₹50L", 
    salaryRange: { min: 3500000, max: 5000000 },
    posted: "2 days ago", 
    description: "We're looking for a Senior Frontend Developer with 5+ years of experience in React, TypeScript, and modern web technologies. You'll work on large-scale applications serving millions of users.", 
    skills: ["React", "TypeScript", "Next.js", "GraphQL", "CSS-in-JS", "Testing"], 
    logo: "G" 
  },
  { 
    id: 2, 
    title: "Data Scientist", 
    company: "Meta", 
    location: "Remote (India)", 
    type: "Full-time", 
    salary: "₹30L – ₹45L", 
    salaryRange: { min: 3000000, max: 4500000 },
    posted: "1 day ago", 
    description: "Join our data science team to build ML models for content recommendation. Experience with Python, TensorFlow, and large-scale data processing required.", 
    skills: ["Python", "TensorFlow", "SQL", "Statistics", "A/B Testing", "Spark"], 
    logo: "M" 
  },
  { 
    id: 3, 
    title: "Backend Engineer", 
    company: "Amazon", 
    location: "Hyderabad, TS", 
    type: "Full-time", 
    salary: "₹32L – ₹48L", 
    salaryRange: { min: 3200000, max: 4800000 },
    posted: "3 days ago", 
    description: "Design and build scalable microservices on AWS. Strong experience with Java, distributed systems, and cloud architecture needed.", 
    skills: ["Java", "AWS", "Microservices", "Docker", "Kubernetes", "DynamoDB"], 
    logo: "A" 
  },
  { 
    id: 4, 
    title: "UX/UI Designer", 
    company: "Apple", 
    location: "Mumbai, MH", 
    type: "Full-time", 
    salary: "₹28L – ₹42L", 
    salaryRange: { min: 2800000, max: 4200000 },
    posted: "5 days ago", 
    description: "Create beautiful, intuitive interfaces for iOS and macOS applications. Must have a strong portfolio demonstrating user-centered design.", 
    skills: ["Figma", "Sketch", "Prototyping", "User Research", "Design Systems", "SwiftUI"], 
    logo: "A" 
  },
  { 
    id: 5, 
    title: "DevOps Engineer", 
    company: "Netflix", 
    location: "Remote (India)", 
    type: "Full-time", 
    salary: "₹34L – ₹50L", 
    salaryRange: { min: 3400000, max: 5000000 },
    posted: "1 week ago", 
    description: "Manage CI/CD pipelines and cloud infrastructure at scale. Experience with Kubernetes, Terraform, and monitoring tools required.", 
    skills: ["Kubernetes", "Terraform", "CI/CD", "AWS", "Monitoring", "Linux"], 
    logo: "N" 
  },
  { 
    id: 6, 
    title: "Full Stack Developer", 
    company: "Stripe", 
    location: "Gurgaon, HR", 
    type: "Full-time", 
    salary: "₹30L – ₹45L", 
    salaryRange: { min: 3000000, max: 4500000 },
    posted: "4 days ago", 
    description: "Build payment infrastructure used by millions of businesses. Strong skills in Ruby, React, and API design are essential.", 
    skills: ["Ruby", "React", "PostgreSQL", "API Design", "Redis", "TypeScript"], 
    logo: "S" 
  },
  { 
    id: 7, 
    title: "Machine Learning Engineer", 
    company: "OpenAI", 
    location: "Bangalore, KA", 
    type: "Full-time", 
    salary: "₹45L – ₹70L", 
    salaryRange: { min: 4500000, max: 7000000 },
    posted: "Just now", 
    description: "Research and deploy cutting-edge AI models. Deep expertise in PyTorch, transformers, and distributed training required.", 
    skills: ["PyTorch", "Transformers", "Python", "CUDA", "Distributed Systems", "NLP"], 
    logo: "O" 
  },
  { 
    id: 8, 
    title: "Product Manager", 
    company: "Microsoft", 
    location: "Noida, UP", 
    type: "Full-time", 
    salary: "₹32L – ₹48L", 
    salaryRange: { min: 3200000, max: 4800000 },
    posted: "6 days ago", 
    description: "Lead product strategy for Azure cloud services. Experience with B2B SaaS products and agile methodologies required.", 
    skills: ["Product Strategy", "Agile", "Data Analysis", "User Stories", "Roadmapping", "Stakeholder Mgmt"], 
    logo: "M" 
  },
  {
    id: 9,
    title: "Senior Android Developer",
    company: "Flipkart",
    location: "Bangalore, KA",
    type: "Full-time",
    salary: "₹28L – ₹42L",
    salaryRange: { min: 2800000, max: 4200000 },
    posted: "3 days ago",
    description: "Build innovative shopping experiences for millions of users. Expertise in Kotlin, Jetpack Compose, and modern Android development required.",
    skills: ["Kotlin", "Jetpack Compose", "Android SDK", "MVVM", "Coroutines", "Room"],
    logo: "F"
  },
  {
    id: 10,
    title: "DevOps Lead",
    company: "Paytm",
    location: "Noida, UP",
    type: "Full-time",
    salary: "₹40L – ₹55L",
    salaryRange: { min: 4000000, max: 5500000 },
    posted: "1 week ago",
    description: "Lead the DevOps team to build scalable infrastructure for fintech applications. Experience with Kubernetes, Terraform, and cloud platforms essential.",
    skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Python", "Monitoring"],
    logo: "P"
  }
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<typeof jobListings[0] | null>(null);
  const [showApply, setShowApply] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [atsChecked, setAtsChecked] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const { toast } = useToast();

  const filtered = jobListings.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleATSCheck = () => {
    if (!resumeFile) {
      toast({ title: "Upload Resume", description: "Please upload your resume first.", variant: "destructive" });
      return;
    }
    setChecking(true);
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 55;
      setAtsScore(score);
      setAtsChecked(true);
      setChecking(false);
    }, 2000);
  };

  const handleApply = () => {
    toast({ 
      title: "Application Submitted! 🎉", 
      description: `Your application for ${selectedJob?.title} at ${selectedJob?.company} has been sent.` 
    });
    setShowApply(false);
    setResumeFile(null);
    setAtsChecked(false);
    setAtsScore(null);
  };

  const formatSalaryInRupees = (salary: string) => {
    return salary;
  };

  const scoreColor = (s: number) => (s >= 70 ? "text-score-green" : s >= 40 ? "text-score-yellow" : "text-score-red");

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={item} className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Job <span className="text-gradient">Board</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse jobs at top Indian tech hubs, check your ATS score, and apply directly.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div variants={item} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search jobs, companies, or skills..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </motion.div>

        {/* Job Grid */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((job) => (
            <motion.div
              key={job.id}
              variants={item}
              className="group bg-card rounded-xl border border-border shadow-card hover:shadow-elevated hover:border-primary/20 transition-all duration-300 p-5 cursor-pointer"
              onClick={() => { 
                setSelectedJob(job); 
                setShowApply(true); 
                setAtsChecked(false); 
                setAtsScore(null); 
                setResumeFile(null); 
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-display font-bold text-lg">
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />{job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />{job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5" />{job.salary}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.skills.slice(0, 4).map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {s}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs">
                        +{job.skills.length - 4}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />{job.posted}
                    </span>
                    <span className="text-sm font-medium text-primary group-hover:underline flex items-center gap-1">
                      Apply Now <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No results message */}
        {filtered.length === 0 && (
          <motion.div variants={item} className="text-center py-12">
            <p className="text-muted-foreground">No jobs found matching your search.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Apply Dialog */}
      <Dialog open={showApply} onOpenChange={setShowApply}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Apply to {selectedJob?.title}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {selectedJob?.company} · {selectedJob?.location} · {selectedJob?.type}
            </p>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Job Details Card */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Job Description</h4>
              <p className="text-sm text-muted-foreground">{selectedJob?.description}</p>
              
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  <span className="font-medium">Salary Range:</span>
                  <span className="text-primary">{selectedJob?.salary} per annum</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {selectedJob?.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Upload Resume</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/40 transition-colors bg-muted/30">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground text-center">
                  {resumeFile ? resumeFile.name : "Drop PDF/DOCX here or click to browse"}
                </span>
                <input 
                  type="file" 
                  accept=".pdf,.docx" 
                  className="hidden" 
                  onChange={(e) => { 
                    setResumeFile(e.target.files?.[0] || null); 
                    setAtsChecked(false); 
                    setAtsScore(null); 
                  }} 
                />
              </label>
            </div>

            {/* ATS Check */}
            <Button 
              variant="outline" 
              className="w-full gap-2" 
              onClick={handleATSCheck} 
              disabled={checking}
            >
              <BarChart3 className="w-4 h-4" />
              {checking ? "Checking ATS Score..." : "Check ATS Score for this Job"}
            </Button>

            {/* ATS Score Result */}
            {atsChecked && atsScore !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-card border border-border rounded-xl p-4 text-center"
              >
                <p className="text-sm text-muted-foreground mb-1">Your ATS Score for this Job</p>
                <p className={`text-4xl font-display font-bold ${scoreColor(atsScore)}`}>{atsScore}%</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {atsScore >= 70 
                    ? "✅ Great match! You're ready to apply." 
                    : atsScore >= 50 
                    ? "⚠️ Consider optimizing your resume for better results." 
                    : "❌ Your resume needs significant improvement for this role."}
                </p>
                
                {atsScore < 70 && (
                  <div className="mt-3">
                    <Button size="sm" variant="outline" className="gap-2" onClick={() => window.location.href = "/optimize"}>
                      <BarChart3 className="w-3 h-3" /> Optimize Resume
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Apply Button */}
            <Button 
              className="w-full gap-2 gradient-primary text-primary-foreground border-0" 
              onClick={handleApply}
            >
              <Briefcase className="w-4 h-4" /> Submit Application
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By applying, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}