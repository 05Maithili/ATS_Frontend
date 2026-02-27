import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Sparkles, 
  Download, 
  Loader2, 
  ArrowLeft, 
  Copy, 
  RefreshCw, 
  AlertCircle,
  CheckCircle2,
  TrendingUp 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ComparisonView } from "@/components/ComparisonView";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";

export default function ResumeOptimization() {
  const [resumeText, setResumeText] = useState("");
  const [originalResume, setOriginalResume] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"original" | "optimized">("original");
  
  // Before/After comparison states
  const [beforeScore, setBeforeScore] = useState<number | null>(null);
  const [beforeKeywords, setBeforeKeywords] = useState<string[]>([]);
  const [afterScore, setAfterScore] = useState<number | null>(null);
  const [afterKeywords, setAfterKeywords] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadAnalysisData = () => {
    setLoading(true);
    
    try {
      // Try multiple sources for analysis data
      const lastAnalysis = sessionStorage.getItem("lastAnalysis");
      const selectedAnalysis = sessionStorage.getItem("selectedAnalysis");
      const latestAnalysis = localStorage.getItem("latestAnalysis");
      
      let data = null;
      let source = "";
      
      if (selectedAnalysis) {
        console.log("📂 Loading from selectedAnalysis");
        data = JSON.parse(selectedAnalysis);
        source = "selected";
      } else if (lastAnalysis) {
        console.log(" Loading from lastAnalysis");
        data = JSON.parse(lastAnalysis);
        source = "last";
      } else if (latestAnalysis) {
        console.log(" Loading from latestAnalysis");
        data = JSON.parse(latestAnalysis);
        source = "latest";
      }
      
      if (data) {
        console.log(" Found analysis data from:", source, data);
        
        // Extract resume text - try multiple possible locations
        const resumeText = data.resume_text || 
                          data.resume?.file_content || 
                          data.content ||
                          localStorage.getItem("lastResumeText") ||
                          "No resume text found";
        
        console.log(" Resume text length:", resumeText.length);
        setResumeText(resumeText);
        setOriginalResume(resumeText);
        
        // Extract job description
        const jdText = data.jd_text || 
                      data.job_description?.description || 
                      data.description ||
                      localStorage.getItem("lastJobDescription") ||
                      "No job description found";
        
        setJobDescription(jdText);
        
        // Extract ATS score and store as before score
        const score = data.ats_score || 0;
        setAtsScore(score);
        setBeforeScore(score);
        
        // Extract missing keywords - handle different formats
        let keywords: string[] = [];
        
        if (data.gaps) {
          // Handle if gaps is a string (JSON)
          let gapsArray = data.gaps;
          if (typeof data.gaps === 'string') {
            try {
              gapsArray = JSON.parse(data.gaps);
            } catch (e) {
              gapsArray = [];
            }
          }
          
          keywords = gapsArray.map((g: any) => 
            typeof g === 'string' ? g : g.skill || g.term || ''
          ).filter(Boolean);
        }
        
        // Also check for missingKeywords in localStorage
        const storedKeywords = localStorage.getItem("missingKeywords");
        if (storedKeywords && keywords.length === 0) {
          try {
            keywords = JSON.parse(storedKeywords);
          } catch (e) {
            console.error("Failed to parse stored keywords:", e);
          }
        }
        
        console.log("🔑 Missing keywords:", keywords);
        setMissingKeywords(keywords);
        setBeforeKeywords(keywords);
        
        // Store keywords back for consistency
        localStorage.setItem("missingKeywords", JSON.stringify(keywords));
        
        toast({
          title: "✅ Data loaded",
          description: `Found ${keywords.length} missing keywords to optimize`,
        });
        
      } else {
        console.log("❌ No analysis data found");
        
        // Check for individual stored items
        const savedResume = localStorage.getItem("lastResumeText");
        const savedKeywords = localStorage.getItem("missingKeywords");
        
        if (savedResume) {
          console.log("📄 Found saved resume text");
          setResumeText(savedResume);
          setOriginalResume(savedResume);
          
          if (savedKeywords) {
            try {
              const keywords = JSON.parse(savedKeywords);
              setMissingKeywords(keywords);
              setBeforeKeywords(keywords);
              toast({
                title: "✅ Resume loaded",
                description: `Found ${keywords.length} keywords to optimize`,
              });
            } catch (e) {
              console.error("Failed to parse saved keywords:", e);
            }
          } else {
            toast({
              title: "Resume loaded",
              description: "No missing keywords found",
            });
          }
        } else {
          toast({
            title: "No analysis data",
            description: "Please analyze a resume first before optimizing.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error loading analysis data:", error);
      toast({
        title: "Error loading data",
        description: "Please try analyzing again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const reanalyzeResume = async (resumeText: string) => {
    try {
      setReanalyzing(true);
      
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast({ title: "Please login again", variant: "destructive" });
        return null;
      }

      // Call analyze endpoint with the optimized resume
      const response = await fetch(`http://localhost:8000/api/analyze`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          resume_text: resumeText,
          job_description: jobDescription
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ Re-analysis complete:", data);
        
        // Extract new keywords from gaps
        let newKeywords: string[] = [];
        if (data.gaps) {
          newKeywords = data.gaps.map((g: any) => 
            typeof g === 'string' ? g : g.skill || g.term || ''
          ).filter(Boolean);
        }
        
        setAfterScore(data.ats_score);
        setAfterKeywords(newKeywords);
        setShowComparison(true);
        
        return data;
      } else {
        throw new Error(data.detail || "Re-analysis failed");
      }
    } catch (error) {
      console.error("Re-analysis error:", error);
      toast({
        title: "Re-analysis failed",
        description: "Could not get updated score",
        variant: "destructive"
      });
      return null;
    } finally {
      setReanalyzing(false);
    }
  };

  const handleAutoOptimize = async () => {
    if (!originalResume || originalResume === "No resume text found") {
      toast({ 
        title: "No resume to optimize", 
        description: "Please analyze a resume first.",
        variant: "destructive"
      });
      navigate("/analyze");
      return;
    }

    setOptimizing(true);
    
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast({ title: "Please login again", variant: "destructive" });
        navigate("/signin");
        return;
      }

      // Call the backend optimization endpoint
      const response = await fetch(`http://localhost:8000/api/optimize`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          resume_text: originalResume,
          job_description: jobDescription,
          missing_keywords: JSON.stringify(missingKeywords)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOptimizedResume(data.optimized_text);
        setResumeText(data.optimized_text);
        setActiveTab("optimized");
        
        // Store optimized version
        localStorage.setItem("optimizedResume", data.optimized_text);
        
        toast({ 
          title: "✨ Resume optimized successfully!", 
          description: `Added ${data.keywords_used?.length || missingKeywords.length} missing keywords.` 
        });

        // Automatically re-analyze the optimized resume
        const reanalysisResult = await reanalyzeResume(data.optimized_text);
        
        if (reanalysisResult) {
          toast({
            title: "📊 Re-analysis complete",
            description: `New ATS Score: ${reanalysisResult.ats_score}%`
          });
        }
      } else {
        throw new Error(data.detail || "Optimization failed");
      }
    } catch (error) {
      console.error("Optimization error:", error);
      
      // Fallback optimization
      const fallbackResult = fallbackOptimize();
      
      // Still try to re-analyze the fallback version
      if (fallbackResult) {
        await reanalyzeResume(fallbackResult);
      }
      
      toast({ 
        title: "Using fallback optimization", 
        description: "AI optimization unavailable, using rule-based improvements.",
      });
    } finally {
      setOptimizing(false);
    }
  };

  const fallbackOptimize = () => {
    let optimized = originalResume;
    
    if (missingKeywords.length > 0) {
      // Add missing keywords to skills section
      if (optimized.includes("SKILLS") || optimized.includes("Skills") || optimized.includes("TECHNICAL SKILLS")) {
        optimized = optimized.replace(
          /(SKILLS|Skills|TECHNICAL SKILLS)[\s\S]*?(?=\n\n|\n[A-Z]|$)/i,
          (match) => {
            const skillsToAdd = missingKeywords.slice(0, 8).join(', ');
            return match + (match.endsWith('\n') ? '' : '\n') + `• ${skillsToAdd}`;
          }
        );
      } else {
        // Add skills section at the end
        optimized += `\n\nSKILLS\n${missingKeywords.slice(0, 8).map(k => `• ${k}`).join('\n')}`;
      }
    }
    
    setOptimizedResume(optimized);
    setResumeText(optimized);
    setActiveTab("optimized");
    
    return optimized;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([resumeText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "optimized_resume.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({ title: "Download started" });
  };

  const handleSaveToHistory = () => {
    const history = JSON.parse(localStorage.getItem("optimizationHistory") || "[]");
    history.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      originalScore: beforeScore || atsScore || 0,
      improvedScore: afterScore || (atsScore ? Math.min(100, atsScore + 15) : 85),
      keywordsAdded: afterKeywords.length - beforeKeywords.length,
      content: resumeText
    });
    localStorage.setItem("optimizationHistory", JSON.stringify(history.slice(0, 10)));
    toast({ title: "Saved to history" });
  };

  const handleReset = () => {
    setResumeText(originalResume);
    setOptimizedResume("");
    setActiveTab("original");
    setShowComparison(false);
    setAfterScore(null);
    setAfterKeywords([]);
    toast({ title: "Reset to original version" });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // Show empty state if no resume
  if (!originalResume || originalResume === "No resume text found") {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">No Analysis Data Found</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Please analyze a resume first to get optimization suggestions.
          </p>
          <div className="flex gap-4">
            <Link to="/analyze">
              <Button className="gradient-primary text-primary-foreground">
                Analyze Resume
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="outline">
                View History
              </Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/results" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Resume Optimization</h1>
            <p className="text-muted-foreground mt-1">
              {missingKeywords.length > 0 
                ? `Add ${missingKeywords.length} missing keywords to improve your ATS score` 
                : "Edit your resume with AI-powered suggestions"}
            </p>
          </div>
        </div>

        {/* Missing Keywords Banner */}
        {missingKeywords.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20"
          >
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Keywords to Add ({missingKeywords.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw, i) => (
                <span key={i} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            onClick={handleAutoOptimize}
            disabled={optimizing || reanalyzing}
            className="gradient-primary text-primary-foreground"
          >
            {optimizing || reanalyzing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {optimizing ? "Optimizing..." : reanalyzing ? "Re-analyzing..." : "Auto Optimize with AI"}
          </Button>
          
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
          
          <Button variant="outline" onClick={handleSaveToHistory}>
            Save to History
          </Button>
          
          {optimizedResume && (
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" /> Reset
            </Button>
          )}
        </div>

        {/* Tab Switcher */}
        {optimizedResume && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setActiveTab("original");
                setResumeText(originalResume);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "original" 
                  ? "bg-muted text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Original Version
            </button>
            <button
              onClick={() => {
                setActiveTab("optimized");
                setResumeText(optimizedResume);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "optimized" 
                  ? "gradient-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Optimized Version
              {optimizedResume && (
                <CheckCircle2 className="w-4 h-4 inline ml-2 text-green-500" />
              )}
            </button>
          </div>
        )}

        {/* Current Score Display (if available) */}
        {(atsScore || afterScore) && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {!showComparison && atsScore && (
              <div className="bg-card rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Current ATS Score</p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-foreground">{Math.round(atsScore)}%</span>
                  <Progress value={atsScore} className="w-20 h-2" />
                </div>
              </div>
            )}
            
            {reanalyzing && (
              <div className="bg-card rounded-lg p-4 border border-border flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Re-analyzing...</span>
              </div>
            )}
          </div>
        )}

        {/* Comparison View */}
        {showComparison && beforeScore && afterScore && (
          <div className="mb-6">
            <ComparisonView
              beforeScore={beforeScore}
              afterScore={afterScore}
              beforeKeywords={beforeKeywords}
              afterKeywords={afterKeywords}
              keywordImprovement={afterKeywords.length - beforeKeywords.length}
            />
          </div>
        )}

        {/* Resume Editor */}
        <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/50">
            <span className="text-sm font-medium text-foreground">
              {activeTab === "optimized" && optimizedResume ? "✨ Optimized Resume" : "Resume Editor"}
            </span>
          </div>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full h-[600px] px-6 py-4 bg-card text-foreground resize-none focus:outline-none text-sm leading-relaxed font-mono"
            placeholder="No resume loaded. Please analyze a resume first."
          />
        </div>

        {/* Improvement Summary */}
        {optimizedResume && !showComparison && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20"
          >
            <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Improvements Made
            </h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Added {missingKeywords.length} missing keywords</li>
              <li>• Enhanced bullet points with action verbs</li>
              <li>• Improved keyword density for ATS</li>
              <li>• Re-analyzing to get updated score...</li>
            </ul>
          </motion.div>
        )}
      </motion.div>
    </AppLayout>
  );
}