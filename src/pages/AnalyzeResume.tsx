import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, ClipboardPaste, X, Loader2, CheckCircle2, BarChart3 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api, { AnalyzeResult } from "@/lib/api";
import mammoth from "mammoth";

export default function AnalyzeResume() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [jdMode, setJdMode] = useState<"upload" | "paste">("paste");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResult | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Extract text from file - supports both .txt and .docx
  const extractTextFromFile = async (file: File): Promise<string> => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'txt') {
      return await file.text();
    }
    
    if (extension === 'docx') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } catch (error) {
        console.error("Error extracting text from DOCX:", error);
        toast({ 
          title: "Error reading file", 
          description: "Could not extract text from the DOCX file. Please paste the content manually.",
          variant: "destructive"
        });
        return "";
      }
    }
    
    // For PDF, show message to paste manually
    toast({ 
      title: "File format note", 
      description: "For PDF files, please paste the text content manually for now.",
      variant: "default"
    });
    return "";
  };

  const handleDrop = useCallback((e: React.DragEvent, setter: (f: File) => void) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setter(file);
  }, []);

  const handleAnalyze = async () => {
  // Check authentication first
  const token = localStorage.getItem("access_token");
  if (!token) {
    toast({ 
      title: "Not authenticated", 
      description: "Please login first",
      variant: "destructive" 
    });
    navigate("/signin");
    return;
  }

  // Get resume text - either from uploaded file or manual input
  let finalResumeText = resumeText;
  
  if (resumeFile && !finalResumeText) {
    finalResumeText = await extractTextFromFile(resumeFile);
    if (!finalResumeText) {
      toast({ title: "Could not extract text from file", variant: "destructive" });
      return;
    }
  }

  if (!finalResumeText) {
    toast({ title: "Please enter your resume text", variant: "destructive" });
    return;
  }

  // Get JD text
  let finalJdText = jdText;
  
  if (jdFile && jdMode === "upload" && !finalJdText) {
    finalJdText = await extractTextFromFile(jdFile);
    if (!finalJdText) {
      toast({ title: "Could not extract text from job description file", variant: "destructive" });
      return;
    }
  }

  if (!finalJdText) {
    if (jdFile && jdMode === "paste") {
      toast({ title: "Please switch to Upload File mode or paste your job description", variant: "destructive" });
    } else {
      toast({ title: "Please provide a job description", variant: "destructive" });
    }
    return;
  }

  setAnalyzing(true);
  setAnalysisResult(null);

  try {
    console.log("🚀 Sending analysis request...");
    const result = await api.analyzeResume(finalResumeText, finalJdText);
    
    if (result.error) {
      console.error("❌ Analysis error:", result.error);
      
      if (result.status === 401) {
        toast({ 
          title: "Session expired", 
          description: "Please login again",
          variant: "destructive" 
        });
        navigate("/signin");
      } else {
        toast({ 
          title: "Analysis failed", 
          description: result.error, 
          variant: "destructive" 
        });
      }
    } else if (result.data) {
      console.log("✅ Analysis successful:", result.data);
      
      // Store analysis data for optimization
      const analysisData = {
        ...result.data,
        timestamp: new Date().toISOString(),
        resume_text: finalResumeText,
        jd_text: finalJdText,
        gaps: result.data.gaps || [],
        matches: result.data.matches || [],
        recommendations: result.data.recommendations || []
      };
      
      // Store in multiple places for redundancy
      sessionStorage.setItem("lastAnalysis", JSON.stringify(analysisData));
      localStorage.setItem("latestAnalysis", JSON.stringify(analysisData));
      localStorage.setItem("lastResumeText", finalResumeText);
      localStorage.setItem("lastJobDescription", finalJdText);
      
      // Store missing keywords separately for easy access
      if (result.data.gaps) {
        const keywords = result.data.gaps.map((g: any) => 
          typeof g === 'string' ? g : g.skill || g.term || ''
        ).filter(Boolean);
        localStorage.setItem("missingKeywords", JSON.stringify(keywords));
      }
      
      setAnalysisResult(result.data);
      
      toast({ 
        title: "✅ Analysis complete!", 
        description: `ATS Score: ${result.data.ats_score}%` 
      });
      
      // Navigate to results page
      setTimeout(() => navigate("/results"), 1000);
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    toast({ 
      title: "Error", 
      description: error instanceof Error ? error.message : "Failed to analyze resume", 
      variant: "destructive" 
    });
  } finally {
    setAnalyzing(false);
  }
};

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Analyze Resume</h1>
        <p className="text-muted-foreground mb-8">Upload your resume and job description to get your ATS compatibility score.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Uploads */}
          <div className="space-y-6">
            {/* Resume Input */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Resume
              </h3>
              
              {/* File Upload */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, setResumeFile)}
                className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors cursor-pointer relative mb-4"
                onClick={() => document.getElementById("resume-input")?.click()}
              >
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-score-green" />
                    <span className="font-medium text-foreground text-sm">{resumeFile.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); setResumeFile(null); }} className="text-muted-foreground hover:text-destructive">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground justify-center">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Drop resume file (optional)</span>
                  </div>
                )}
                <input
                  id="resume-input"
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setResumeFile(e.target.files[0])}
                />
              </div>

              {/* Manual Text Input */}
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Or paste your resume text here..."
                className="w-full h-40 px-4 py-3 rounded-lg border border-input bg-background text-foreground resize-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all outline-none text-sm"
              />
            </div>

            {/* Job Description */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <ClipboardPaste className="w-5 h-5 text-secondary" /> Job Description
              </h3>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setJdMode("paste")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    jdMode === "paste" ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Paste Text
                </button>
                <button
                  onClick={() => setJdMode("upload")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    jdMode === "upload" ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Upload File
                </button>
              </div>

              {jdMode === "paste" ? (
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-40 px-4 py-3 rounded-lg border border-input bg-background text-foreground resize-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all outline-none text-sm"
                />
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, setJdFile)}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-secondary/40 transition-colors cursor-pointer"
                  onClick={() => document.getElementById("jd-input")?.click()}
                >
                  {jdFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-score-green" />
                      <span className="font-medium text-foreground">{jdFile.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); setJdFile(null); }} className="text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-foreground font-medium">Upload job description file</p>
                    </>
                  )}
                  <input
                    id="jd-input"
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && setJdFile(e.target.files[0])}
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full gradient-primary text-primary-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-elevated disabled:opacity-60"
            >
              {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {analyzing ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>

          {/* Right - Status */}
          <div className="flex items-center justify-center">
            <AnimatePresence mode="wait">
              {analyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 rounded-full gradient-primary mx-auto flex items-center justify-center animate-pulse-glow mb-6">
                    <Loader2 className="w-12 h-12 text-primary-foreground animate-spin" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">Analyzing Your Resume</h3>
                  <p className="text-muted-foreground">Comparing keywords, skills, and formatting...</p>
                </motion.div>
              ) : analysisResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 rounded-full gradient-primary mx-auto flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">Analysis Complete!</h3>
                  <p className="text-3xl font-bold text-score-green mb-2">{analysisResult.ats_score}%</p>
                  <p className="text-muted-foreground">Click to view detailed results</p>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center max-w-sm"
                >
                  <div className="w-32 h-32 rounded-full bg-muted mx-auto flex items-center justify-center mb-6">
                    <BarChart3 className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground">Upload your resume and job description, then click analyze to get your ATS score.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
