import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Eye, 
  Calendar, 
  Briefcase, 
  Loader2, 
  Sparkles,
  Trash2,
  AlertTriangle,
  Download,
  Filter,
  Search,
  ChevronDown,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api, { Analysis } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const container = { 
  hidden: {}, 
  show: { transition: { staggerChildren: 0.05 } } 
};

const item = { 
  hidden: { opacity: 0, y: 10 }, 
  show: { opacity: 1, y: 0 } 
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-500 bg-green-500/10";
  if (score >= 60) return "text-yellow-500 bg-yellow-500/10";
  return "text-red-500 bg-red-500/10";
};

const getScoreBg = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

export default function ReportHistory() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedScore, setSelectedScore] = useState<string>("all");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });
  const [deleting, setDeleting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyses();
  }, []);

  useEffect(() => {
    filterAnalyses();
  }, [analyses, searchQuery, selectedYear, selectedScore]);

  const fetchAnalyses = async () => {
    setLoading(true);
    const result = await api.getAnalyses();
    if (result.data) {
      console.log("📊 Fetched analyses:", result.data);
      setAnalyses(result.data);
      setFilteredAnalyses(result.data);
    }
    setLoading(false);
  };

  const filterAnalyses = () => {
    let filtered = [...analyses];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.job_description?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.resume?.filename?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear !== "all") {
      filtered = filtered.filter((a) => {
        const year = new Date(a.created_at).getFullYear().toString();
        return year === selectedYear;
      });
    }

    // Filter by score range
    if (selectedScore !== "all") {
      filtered = filtered.filter((a) => {
        if (selectedScore === "high") return a.ats_score >= 80;
        if (selectedScore === "medium") return a.ats_score >= 60 && a.ats_score < 80;
        if (selectedScore === "low") return a.ats_score < 60;
        return true;
      });
    }

    setFilteredAnalyses(filtered);
  };

  const handleDeleteAnalysis = async (id: number) => {
    setDeleting(true);
    try {
      // Call backend API to delete
      const result = await api.deleteAnalysis(id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Update both states using functional updates to ensure latest state
      setAnalyses(prevAnalyses => {
        const updated = prevAnalyses.filter(a => a.id !== id);
        console.log("📝 Updated analyses:", updated);
        return updated;
      });
      
      setFilteredAnalyses(prevFiltered => {
        const updated = prevFiltered.filter(a => a.id !== id);
        console.log("📝 Updated filtered analyses:", updated);
        return updated;
      });
      
      toast({ 
        title: "✅ Analysis deleted", 
        description: "The analysis has been permanently removed from your history." 
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({ 
        title: "❌ Failed to delete", 
        description: "Please try again later.",
        variant: "destructive" 
      });
    } finally {
      setDeleting(false);
      setDeleteDialog({ open: false, id: null });
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(analyses, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `ats-analyses-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({ title: "📥 Data exported successfully" });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedYear("all");
    setSelectedScore("all");
  };

  const handleViewReport = (analysis: Analysis) => {
    const processedAnalysis = {
      ...analysis,
      gaps: typeof analysis.gaps === 'string' ? JSON.parse(analysis.gaps) : analysis.gaps,
      matches: typeof analysis.matches === 'string' ? JSON.parse(analysis.matches) : analysis.matches,
      recommendations: typeof analysis.recommendations === 'string' ? JSON.parse(analysis.recommendations) : analysis.recommendations,
    };
    
    sessionStorage.setItem("selectedAnalysis", JSON.stringify(processedAnalysis));
    navigate("/results");
  };

  const handleOptimizeFromHistory = (analysis: Analysis) => {
    const processedAnalysis = {
      ...analysis,
      gaps: typeof analysis.gaps === 'string' ? JSON.parse(analysis.gaps) : analysis.gaps,
      matches: typeof analysis.matches === 'string' ? JSON.parse(analysis.matches) : analysis.matches,
      recommendations: typeof analysis.recommendations === 'string' ? JSON.parse(analysis.recommendations) : analysis.recommendations,
    };
    
    sessionStorage.setItem("selectedAnalysis", JSON.stringify(processedAnalysis));
    sessionStorage.setItem("lastAnalysis", JSON.stringify(processedAnalysis));
    localStorage.setItem("latestAnalysis", JSON.stringify(processedAnalysis));
    
    if (analysis.resume?.file_content) {
      localStorage.setItem("lastResumeText", analysis.resume.file_content);
    }
    
    if (analysis.job_description?.description) {
      localStorage.setItem("lastJobDescription", analysis.job_description.description);
    }
    
    const gaps = processedAnalysis.gaps || [];
    const keywords = gaps.map((g: any) => 
      typeof g === 'string' ? g : g.skill || g.term || ''
    ).filter(Boolean);
    localStorage.setItem("missingKeywords", JSON.stringify(keywords));
    
    navigate("/optimize");
  };

  // Get unique years for filter
  const years = ["all", ...new Set(analyses.map(a => 
    new Date(a.created_at).getFullYear().toString()
  ))];

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={item} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Report History
              </h1>
              <p className="text-muted-foreground mt-1">
                View and manage all your previously analyzed resumes.
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData} className="gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={item} className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title or resume..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Year Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectedYear === "all" ? "All Years" : selectedYear}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {years.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year === "all" ? "All Years" : year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Score Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {selectedScore === "all" ? "All Scores" : 
                   selectedScore === "high" ? "High (80%+)" :
                   selectedScore === "medium" ? "Medium (60-80%)" : "Low (<60%)"}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedScore("all")}>
                  All Scores
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedScore("high")}>
                  High (80%+)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedScore("medium")}>
                  Medium (60-80%)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedScore("low")}>
                  Low (&lt;60%)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {(searchQuery || selectedYear !== "all" || selectedScore !== "all") && (
              <Button variant="ghost" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredAnalyses.length} of {analyses.length} analyses
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : analyses.length === 0 ? (
          <motion.div variants={item} className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">
              No analyses yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start by analyzing your first resume against a job description.
            </p>
            <Link to="/analyze">
              <Button className="gradient-primary text-primary-foreground">
                Analyze Your First Resume
              </Button>
            </Link>
          </motion.div>
        ) : filteredAnalyses.length === 0 ? (
          <motion.div variants={item} className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">
              No matches found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search query.
            </p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div variants={item} className="space-y-4">
            {filteredAnalyses.map((analysis) => (
              <motion.div
                key={analysis.id}
                variants={item}
                className="bg-card rounded-xl border border-border shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground">
                          {analysis.job_description?.title || "General Analysis"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {analysis.resume?.filename || "Resume"} • {new Date(analysis.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(analysis.ats_score)}`}>
                      {Math.round(analysis.ats_score)}%
                    </div>
                  </div>

                  {/* Score Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">ATS Score</span>
                      <span className="font-medium">{Math.round(analysis.ats_score)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.ats_score}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full ${getScoreBg(analysis.ats_score)}`}
                      />
                    </div>
                  </div>

                  {/* Missing Skills */}
                  {(() => {
                    try {
                      const gapsArray = typeof analysis.gaps === 'string' 
                        ? JSON.parse(analysis.gaps || '[]') 
                        : analysis.gaps || [];
                      return gapsArray.length > 0 ? (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-2">Missing Keywords:</p>
                          <div className="flex flex-wrap gap-2">
                            {gapsArray.slice(0, 5).map((gap: any, index: number) => (
                              <Badge key={index} variant="secondary" className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                {gap.skill || gap}
                              </Badge>
                            ))}
                            {gapsArray.length > 5 && (
                              <Badge variant="secondary" className="bg-muted">
                                +{gapsArray.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      ) : null;
                    } catch (e) {
                      return null;
                    }
                  })()}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewReport(analysis)}
                      className="gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      View Report
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOptimizeFromHistory(analysis)}
                      className="gap-1.5 text-secondary hover:text-secondary"
                    >
                      <Sparkles className="w-4 h-4" />
                      Optimize
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog({ open: true, id: analysis.id })}
                      className="gap-1.5 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog 
          open={deleteDialog.open} 
          onOpenChange={(open) => setDeleteDialog({ open, id: null })}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Delete Analysis
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this analysis? This action cannot be undone
                and will permanently remove this report from your history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteDialog.id && handleDeleteAnalysis(deleteDialog.id)}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AppLayout>
  );
}