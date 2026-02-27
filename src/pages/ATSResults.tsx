// Replace the ATSResults.tsx with this improved version

import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Loader2,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AnalysisData {
  ats_score?: number;
  score?: number;
  subscores?: Record<string, number>;
  missing_keywords?: string[];
  missingKeywords?: Array<string | { skill?: string; term?: string; impact?: string }>;
  gaps?: Array<string | { skill?: string; term?: string; impact?: string }>;
  recommendations?: Array<string | { suggestion?: string; skill?: string }>;
  suggestions?: Array<string | { suggestion?: string; skill?: string }>;
  matches?: Array<string | { requirement?: string; matched_bullet?: string }>;
  strong_matches?: Array<string | { requirement?: string; matched_bullet?: string }>;
}

function getScoreColor(score: number) {
  if (score >= 70) return "text-green-500";
  if (score >= 40) return "text-yellow-500";
  return "text-red-500";
}

function getScoreBg(score: number) {
  if (score >= 70) return "stroke-green-500";
  if (score >= 40) return "stroke-yellow-500";
  return "stroke-red-500";
}

function CircularProgress({ score }: { score: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-48 h-48">
      <svg className="w-48 h-48 -rotate-90" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} fill="none" strokeWidth="12" className="stroke-muted" />
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          className={getScoreBg(score)}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5 }}
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
          {Math.round(score)}%
        </span>
        <span className="text-sm text-muted-foreground">ATS Score</span>
      </div>
    </div>
  );
}

export default function ATSResults() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const lastAnalysis = sessionStorage.getItem("lastAnalysis");
      const selectedAnalysis = sessionStorage.getItem("selectedAnalysis");

      if (lastAnalysis) {
        const parsed = JSON.parse(lastAnalysis);
        console.log("Last analysis:", parsed);
        setAnalysisData(parsed);
        sessionStorage.removeItem("lastAnalysis");
      } else if (selectedAnalysis) {
        const parsed = JSON.parse(selectedAnalysis);
        console.log("Selected analysis:", parsed);

        // Parse JSON strings if coming from DB history
        if (typeof parsed.gaps === 'string') {
          try {
            parsed.gaps = JSON.parse(parsed.gaps);
          } catch (e) {
            parsed.gaps = [];
          }
        }
        if (typeof parsed.matches === 'string') {
          try {
            parsed.matches = JSON.parse(parsed.matches);
          } catch (e) {
            parsed.matches = [];
          }
        }
        if (typeof parsed.recommendations === 'string') {
          try {
            parsed.recommendations = JSON.parse(parsed.recommendations);
          } catch (e) {
            parsed.recommendations = [];
          }
        }

        setAnalysisData(parsed);
        sessionStorage.removeItem("selectedAnalysis");
      }

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!analysisData) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">No Analysis Found</h2>
          <Link to="/analyze" className="text-primary hover:underline">
            Analyze Resume
          </Link>
        </div>
      </AppLayout>
    );
  }

  const score = analysisData.ats_score || 0;
  const subscores = analysisData.subscores || {};
  
  // Handle different data structures
  const missingKeywords = analysisData.gaps || [];
  const matches = analysisData.matches || [];
  const recommendations = analysisData.recommendations || [];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header with Optimize Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display font-bold">Analysis Results</h1>
          <Link to="/optimize">
            <Button className="gradient-primary text-primary-foreground">
              <Sparkles className="w-4 h-4 mr-2" />
              Optimize Resume
            </Button>
          </Link>
        </div>

        {/* Score Card */}
        <div className="bg-card rounded-xl p-8 shadow border flex flex-col items-center">
          <h3 className="font-semibold mb-6">Overall ATS Score</h3>
          <CircularProgress score={score} />
          <p className={`mt-4 font-medium ${getScoreColor(score)}`}>
            {score >= 70
              ? "Excellent Match!"
              : score >= 50
              ? "Good Match - Room for Improvement"
              : "Needs Significant Improvement"}
          </p>
        </div>

        {/* Subscores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(subscores).map(([key, value]: [string, number]) => (
            <div key={key} className="bg-card rounded-xl p-4 shadow border text-center">
              <p className="text-sm text-muted-foreground mb-1">
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              <p className={`text-2xl font-bold ${getScoreColor(value)}`}>
                {Math.round(value)}%
              </p>
            </div>
          ))}
        </div>

        {/* Missing Keywords Section */}
        {missingKeywords.length > 0 && (
          <div className="bg-card rounded-xl p-6 shadow border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Missing Keywords ({missingKeywords.length})
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {missingKeywords.slice(0, 20).map((item: string | { skill?: string; term?: string; impact?: string }, i: number) => {
                const keyword = typeof item === 'string' ? item : item.skill || item.term || '';
                const itemObj = typeof item === 'string' ? null : item;
                return (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  >
                    {keyword}
                    {itemObj?.impact && (
                      <span className="ml-1 text-xs font-bold text-green-600 dark:text-green-400">
                        {itemObj.impact}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            
            {missingKeywords.length > 20 && (
              <p className="text-sm text-muted-foreground">
                +{missingKeywords.length - 20} more keywords
              </p>
            )}
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-card rounded-xl p-6 shadow border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Optimization Suggestions
            </h3>

            <ul className="space-y-3">
              {recommendations.slice(0, 8).map((rec: string | { suggestion?: string; skill?: string }, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm p-3 bg-muted/30 rounded-lg">
                  <span className="font-bold text-primary mt-0.5">{i + 1}.</span>
                  <span className="text-foreground">
                    {typeof rec === 'string' ? rec : rec.suggestion || rec.skill}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Matches Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-6 shadow border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Strong Matches
            </h3>
            <ul className="space-y-2">
              {matches.length > 0 ? (
                matches.slice(0, 8).map((m: string | { requirement?: string; matched_bullet?: string }, i: number) => {
                  const text = typeof m === 'string' ? m : m.requirement || m.matched_bullet || '';
                  return (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{text}</span>
                    </li>
                  );
                })
              ) : (
                <li className="text-sm text-muted-foreground">No strong matches detected</li>
              )}
            </ul>
          </div>

          <div className="bg-card rounded-xl p-6 shadow border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              Areas to Improve
            </h3>
            <ul className="space-y-2">
              {missingKeywords.length > 0 ? (
                missingKeywords.slice(0, 8).map((item: string | { skill?: string; term?: string; impact?: string }, i: number) => {
                  const keyword = typeof item === 'string' ? item : item.skill || item.term || '';
                  return (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-muted-foreground">Missing: {keyword}</span>
                    </li>
                  );
                })
              ) : (
                <li className="text-sm text-muted-foreground">No major gaps found</li>
              )}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <Link to="/analyze">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              New Analysis
            </Button>
          </Link>
          <Link to="/optimize">
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Sparkles className="w-4 h-4" />
              Optimize Resume
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}