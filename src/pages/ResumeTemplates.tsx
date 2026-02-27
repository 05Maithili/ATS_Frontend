import { motion } from "framer-motion";
import { 
  FileText, 
  Briefcase, 
  GraduationCap, 
  BookOpen, 
  Cpu, 
  Sparkles,
  Shield,
  PenTool,
  Users,
  Target,
  ScrollText,
  Layout
} from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";

const templates = [
  {
    id: "modern-cv",
    name: "ModernCV",
    category: "Contemporary",
    icon: FileText,
    description: "Clean two-column layout with colored sidebar, popular in academia",
    color: "from-blue-600 to-cyan-600",
  },
  {
    id: "classic-thesis",
    name: "Classic Thesis",
    category: "Academic",
    icon: BookOpen,
    description: "Traditional academic format with publications and research sections",
    color: "from-amber-700 to-orange-800",
  },
  {
    id: "executive-pro",
    name: "Executive Pro",
    category: "Professional",
    icon: Briefcase,
    description: "Elegant serif format designed for senior executives and directors",
    color: "from-slate-800 to-slate-900",
  },
  {
    id: "harvard-academic",
    name: "Harvard Style",
    category: "Academic",
    icon: GraduationCap,
    description: "Ivy League inspired CV format used in top universities",
    color: "from-red-800 to-red-900",
  },
  {
    id: "engineering-tech",
    name: "Engineering Tech",
    category: "Technical",
    icon: Cpu,
    description: "Clean technical format with skills matrix and project highlights",
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: "minimal-french",
    name: "Minimal French",
    category: "Minimal",
    icon: Layout,
    description: "French-inspired minimalist design with elegant spacing",
    color: "from-gray-700 to-gray-900",
  },
  {
    id: "consulting-firm",
    name: "Consulting Firm",
    category: "Business",
    icon: Target,
    description: "McKinsey-style impact format with key metrics and achievements",
    color: "from-indigo-700 to-purple-700",
  },
  {
    id: "research-pub",
    name: "Research Publication",
    category: "Academic",
    icon: ScrollText,
    description: "Publication-focused CV with citation metrics and research grants",
    color: "from-amber-800 to-yellow-800",
  },
  {
    id: "deedy-cv",
    name: "Deedy Style",
    category: "Modern",
    icon: FileText,
    description: "Popular two-column format with clean typography",
    color: "from-cyan-700 to-blue-800",
  },
  {
    id: "twenty-seconds",
    name: "Twenty Seconds",
    category: "Creative",
    icon: Sparkles,
    description: "Modern design with visual hierarchy and clean sections",
    color: "from-purple-600 to-pink-600",
  },
  {
    id: "awesome-cv",
    name: "Awesome CV",
    category: "Professional",
    icon: Shield,
    description: "Feature-rich template with multiple section types",
    color: "from-green-700 to-emerald-800",
  },
  {
    id: "alta-cv",
    name: "Alta CV",
    category: "Creative",
    icon: PenTool,
    description: "Elegant alternative layout with unique section styling",
    color: "from-fuchsia-600 to-pink-600",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const categories = ["All"];

export default function ResumeTemplates() {
  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={item} className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">
            LaTeX <span className="text-gradient">Templates</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Choose from 12 professionally designed templates inspired by Overleaf and LaTeX.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div variants={item} className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                i === 0
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Template Grid */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {templates.map((template) => (
            <Link
              key={template.id}
              to={`/templates/${template.id}`}
              className="group bg-card rounded-xl border border-border shadow-card hover:shadow-elevated hover:border-primary/20 transition-all duration-300 overflow-hidden"
            >
              {/* Preview Thumbnail - More realistic template preview */}
              <div className={`h-44 bg-gradient-to-br ${template.color} relative flex items-center justify-center overflow-hidden`}>
                {/* Template preview pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px'
                  }} />
                </div>
                
                {/* Template icon with styling */}
                <div className="relative z-10 text-center">
                  <template.icon className="w-12 h-12 text-white mx-auto mb-2" />
                  <div className="w-24 h-16 bg-white/20 backdrop-blur-sm rounded-md mx-auto p-2">
                    <div className="w-full h-1 bg-white/60 rounded mb-1"></div>
                    <div className="w-3/4 h-1 bg-white/40 rounded mb-1"></div>
                    <div className="w-1/2 h-1 bg-white/20 rounded"></div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary-foreground text-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-elevated">
                    Preview Template
                  </span>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-primary/80">{template.category}</span>
                  <span className="text-[10px] text-muted-foreground">LaTeX</span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{template.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                
                {/* Template features tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">ATS-Friendly</span>
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">PDF Ready</span>
                </div>
                
                <span className="inline-block mt-3 text-sm font-medium text-primary group-hover:underline">
                  Use Template →
                </span>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.div variants={item} className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            All templates are inspired by popular Overleaf and LaTeX designs. 
            Each template features unique layouts for different professional needs.
          </p>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}