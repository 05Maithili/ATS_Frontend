import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  ArrowRight, 
  BarChart3, 
  Sparkles, 
  Upload, 
  CheckCircle2,
  Zap,
  Target,
  TrendingUp,
  Users,
  Award,
  Clock,
  Shield,
  Brain,
  Download,
  Edit,
  RefreshCw,
  Briefcase
} from "lucide-react";

const features = [
  { icon: Upload, title: "Upload Resume & JD", desc: "Drag & drop your resume and paste the job description" },
  { icon: BarChart3, title: "Get ATS Score", desc: "Instant keyword matching and compatibility analysis" },
  { icon: Sparkles, title: "AI Optimization", desc: "Smart suggestions to boost your resume score" },
];

const howItWorks = [
  {
    step: "01",
    title: "Upload Documents",
    description: "Upload your resume (PDF/DOCX) and paste the job description you're targeting.",
    icon: Upload,
    details: [
      "Supports multiple file formats",
      "Automatic text extraction",
      "Secure file handling"
    ]
  },
  {
    step: "02",
    title: "AI Analysis",
    description: "Our AI analyzes your resume against the job description using advanced algorithms.",
    icon: Brain,
    details: [
      "Keyword matching analysis",
      "Skills gap identification",
      "Semantic similarity scoring"
    ]
  },
  {
    step: "03",
    title: "Get ATS Score",
    description: "Receive your ATS compatibility score with detailed breakdown of each section.",
    icon: Target,
    details: [
      "Overall ATS score (0-100%)",
      "Keyword coverage analysis",
      "Skill overlap percentage"
    ]
  },
  {
    step: "04",
    title: "Review Recommendations",
    description: "Get actionable suggestions to improve your resume's ATS performance.",
    icon: TrendingUp,
    details: [
      "Missing keywords list",
      "Optimization suggestions",
      "Priority-based recommendations"
    ]
  },
  {
    step: "05",
    title: "Auto-Optimize",
    description: "Let AI automatically enhance your resume with missing keywords and better formatting.",
    icon: Zap,
    details: [
      "AI-powered rewrites",
      "Natural keyword integration",
      "Preserves your achievements"
    ]
  },
  {
    step: "06",
    title: "Download & Apply",
    description: "Download your optimized resume and apply with confidence.",
    icon: Download,
    details: [
      "Multiple format support",
      "ATS-friendly output",
      "Ready to use"
    ]
  }
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Higher Interview Rate",
    description: "Users report 3x more interview calls after optimizing with our AI"
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Get instant analysis instead of spending hours manually comparing"
  },
  {
    icon: Shield,
    title: "ATS-Proof",
    description: "Our templates are engineered to pass through any ATS system"
  },
   
];

 

const stats = [
  { value: "50K+", label: "Resumes Analyzed", icon: FileText },
  { value: "85%", label: "Avg Score Improvement", icon: TrendingUp },
  { value: "3x", label: "More Interview Calls", icon: Users },
  { value: "15min", label: "Average Time Saved", icon: Clock },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">ATS Analyzer</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="gradient-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-20 md:py-32 max-w-6xl mx-auto text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary rounded-full filter blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> AI-Powered Resume Analysis
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight mb-6">
            Land Your Dream Job with{" "}
            <span className="text-gradient">Perfect ATS Scores</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Upload your resume and job description to get instant ATS compatibility analysis, 
            missing keyword detection, and AI-powered optimization.  
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/signup"
              className="gradient-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-elevated group"
            >
              Start Free Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signin"
              className="bg-card border border-border text-foreground px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-muted transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Instant results</span>
            </div>
          </div>
        </motion.div>
      </section>

       

      {/* Features Grid */}
      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Why Choose <span className="text-gradient">ATS Analyzer</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines advanced AI with proven ATS optimization techniques to maximize your interview chances.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl p-6 shadow-card border border-border text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works - Detailed Section */}
      <section className="px-6 md:px-12 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Six simple steps to a perfectly optimized, ATS-friendly resume
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-elevated transition-all duration-300 relative group"
              >
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {step.description}
                </p>

                {/* Details List */}
                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Process Flow Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-card rounded-xl border border-border"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-4 text-center">
              Complete Optimization Flow
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2 bg-primary/10 rounded">Upload Resume</div>
              <div className="p-2 bg-primary/10 rounded">AI Analysis</div>
              <div className="p-2 bg-primary/10 rounded">Get Score</div>
              <div className="p-2 bg-primary/10 rounded">Optimize</div>
              <div className="p-2 bg-primary/10 rounded">Apply</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Why Job Seekers <span className="text-gradient">Love Us</span>
          </h2>
           
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3">
                <benefit.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
 

       
          

      {/* Footer */}
      <footer className="px-6 md:px-12 py-12 border-t border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-foreground">ATS Analyzer</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered resume optimization tool helping job seekers land their dream jobs.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/templates" className="text-muted-foreground hover:text-primary transition-colors">Templates</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ATS Analyzer. All rights reserved. Built with AI to help you succeed.</p>
        </div>
      </footer>
    </div>
  );
}