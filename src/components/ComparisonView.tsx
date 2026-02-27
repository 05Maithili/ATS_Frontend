import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ComparisonViewProps {
  beforeScore: number;
  afterScore: number;
  beforeKeywords: string[];
  afterKeywords: string[];
  keywordImprovement: number;
}

export function ComparisonView({
  beforeScore,
  afterScore,
  beforeKeywords,
  afterKeywords,
  keywordImprovement,
}: ComparisonViewProps) {
  const scoreDiff = afterScore - beforeScore;
  const isImproved = scoreDiff > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border shadow-card p-6"
    >
      <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Optimization Results
      </h3>

      {/* Score Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Before Card */}
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Before Optimization</p>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold text-red-500">{Math.round(beforeScore)}%</span>
            {!isImproved && <ArrowDown className="w-5 h-5 text-red-500" />}
          </div>
          <Progress value={beforeScore} className="h-2 bg-red-100" indicatorClassName="bg-red-500" />
        </div>

        {/* After Card */}
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-2">After Optimization</p>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold text-green-500">{Math.round(afterScore)}%</span>
            {isImproved && <ArrowUp className="w-5 h-5 text-green-500" />}
          </div>
          <Progress value={afterScore} className="h-2 bg-green-100" indicatorClassName="bg-green-500" />
        </div>
      </div>

      {/* Improvement Stats */}
      {isImproved && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Score Improvement</p>
              <p className="text-2xl font-bold text-green-500">+{scoreDiff.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Keywords Added</p>
              <p className="text-2xl font-bold text-green-500">+{keywordImprovement}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Keywords Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Missing Keywords (Before)</p>
          <div className="flex flex-wrap gap-2">
            {beforeKeywords.slice(0, 8).map((kw, i) => (
              <span key={i} className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                {kw}
              </span>
            ))}
            {beforeKeywords.length > 8 && (
              <span className="text-xs text-muted-foreground">+{beforeKeywords.length - 8} more</span>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Added Keywords (After)</p>
          <div className="flex flex-wrap gap-2">
            {afterKeywords.slice(0, 8).map((kw, i) => (
              <span key={i} className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                {kw}
              </span>
            ))}
            {afterKeywords.length > 8 && (
              <span className="text-xs text-muted-foreground">+{afterKeywords.length - 8} more</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}