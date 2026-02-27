import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Mail, Phone, MapPin, Globe, Github, Linkedin, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

// Type definition for the resume form with flexible skills
interface ResumeForm {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  summary: string;
  experience: Array<{
    id: number;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    achievements: string[];
  }>;
  education: Array<{
    id: number;
    degree: string;
    institution: string;
    location: string;
    year: string;
    gpa: string;
    thesis?: string;
    advisor?: string;
    honors?: string;
  }>;
  skills: Record<string, string[]>;
  publications: Array<{
    id: number;
    title: string;
    authors: string;
    journal: string;
    year: string;
    citations: number;
  }>;
  projects: Array<{
    id: number;
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
}

const templateData: Record<string, {
  name: string;
  category: string;
  description: string;
  style: string;
}> = {
  "modern-cv": { 
    name: "ModernCV", 
    category: "Contemporary",
    description: "Clean two-column layout with colored sidebar",
    style: "modern"
  },
  "classic-thesis": { 
    name: "Classic Thesis", 
    category: "Academic",
    description: "Traditional academic format with publications",
    style: "classic"
  },
  "executive-pro": { 
    name: "Executive Pro", 
    category: "Professional",
    description: "Elegant serif format for senior roles",
    style: "executive"
  },
  "harvard-academic": { 
    name: "Harvard Academic", 
    category: "Academic",
    description: "Ivy League inspired CV format",
    style: "harvard"
  },
  "engineering-tech": { 
    name: "Engineering Tech", 
    category: "Technical",
    description: "Clean technical format with skills matrix",
    style: "engineering"
  },
  "minimal-fr": { 
    name: "Minimal Fr", 
    category: "Minimal",
    description: "French-inspired minimalist design",
    style: "minimal"
  },
  "consulting-firm": { 
    name: "Consulting Firm", 
    category: "Business",
    description: "McKinsey-style impact format",
    style: "consulting"
  },
  "research-publication": { 
    name: "Research Publication", 
    category: "Academic",
    description: "Publication-focused research CV",
    style: "research"
  },
  "deedy-cv": { 
    name: "Deedy CV", 
    category: "Modern",
    description: "Popular Deedy-style two-column format",
    style: "deedy"
  },
  "twenty-seconds": { 
    name: "Twenty Seconds", 
    category: "Creative",
    description: "Clean, modern design with visual elements",
    style: "twenty"
  },
  "awesome-cv": { 
    name: "Awesome CV", 
    category: "Professional",
    description: "Feature-rich LaTeX template",
    style: "awesome"
  },
  "alta-cv": { 
    name: "Alta CV", 
    category: "Creative",
    description: "Elegant alternative layout",
    style: "alta"
  },
};

const sections = [
  "Personal Info", "Professional Summary", "Experience", 
  "Education", "Skills", "Publications", "Projects"
] as const;

export default function TemplatePreview() {
  const { templateId } = useParams();
  const [selectedTemplate, setSelectedTemplate] = useState(templateId || "modern-cv");
  const [activeSection, setActiveSection] = useState<string>("Personal Info");
  
  const template = templateData[selectedTemplate] || templateData["modern-cv"];

  const [form, setForm] = useState<ResumeForm>({
    // Personal Info
    fullName: "Dr. James Wilson",
    title: "Senior Machine Learning Researcher",
    email: "james.wilson@email.com",
    phone: "+1 (415) 555-0123",
    location: "San Francisco, CA",
    website: "jameswilson.dev",
    github: "github.com/jameswilson",
    linkedin: "linkedin.com/in/jameswilson",
    
    // Professional Summary
    summary: "Innovative Machine Learning Researcher with 8+ years of experience in developing AI solutions. Ph.D. in Computer Science with 20+ peer-reviewed publications and 2000+ citations. Passionate about bridging the gap between research and production.",
    
    // Experience
    experience: [
      {
        id: 1,
        title: "Senior Machine Learning Researcher",
        company: "Google AI",
        location: "Mountain View, CA",
        startDate: "2021",
        endDate: "Present",
        achievements: [
          "Led research team developing foundation models serving 100M+ users",
          "Published 5 papers at NeurIPS, ICML with 500+ citations",
          "Filed 3 patents in efficient deep learning architectures"
        ]
      },
      {
        id: 2,
        title: "Research Scientist",
        company: "Stanford AI Lab",
        location: "Stanford, CA",
        startDate: "2018",
        endDate: "2021",
        achievements: [
          "Developed novel few-shot learning algorithms improving accuracy by 35%",
          "Collaborated with cross-functional teams on 10+ research projects",
          "Supervised 5 Ph.D. students and 3 postdoctoral fellows"
        ]
      },
      {
        id: 3,
        title: "Machine Learning Engineer",
        company: "Microsoft Research",
        location: "Redmond, WA",
        startDate: "2015",
        endDate: "2018",
        achievements: [
          "Built scalable ML pipelines for Azure Cognitive Services",
          "Optimized distributed training reducing costs by 40%",
          "Received Outstanding Contributor Award"
        ]
      }
    ],
    
    // Education
    education: [
      {
        id: 1,
        degree: "Ph.D. in Computer Science",
        institution: "Stanford University",
        location: "Stanford, CA",
        year: "2018",
        gpa: "4.0",
        thesis: "Efficient Deep Learning Architectures for Few-Shot Learning",
        advisor: "Prof. Andrew Ng"
      },
      {
        id: 2,
        degree: "M.S. in Computer Science",
        institution: "Stanford University",
        location: "Stanford, CA",
        year: "2015",
        gpa: "3.95"
      },
      {
        id: 3,
        degree: "B.S. in Computer Engineering",
        institution: "UC Berkeley",
        location: "Berkeley, CA",
        year: "2013",
        gpa: "3.9",
        honors: "Summa Cum Laude"
      }
    ],
    
    // Skills
    skills: {
      "Machine Learning": ["Deep Learning", "Reinforcement Learning", "NLP", "Computer Vision"],
      "Frameworks": ["TensorFlow", "PyTorch", "JAX", "Keras"],
      "Programming": ["Python", "C++", "Julia", "R", "SQL"],
      "Research": ["Experimental Design", "Statistical Analysis", "Paper Writing", "Peer Review"]
    },
    
    // Publications
    publications: [
      {
        id: 1,
        title: "Efficient Few-Shot Learning via Meta-Learning",
        authors: "Wilson, J., Kumar, A., Smith, J.",
        journal: "Neural Information Processing Systems (NeurIPS)",
        year: "2023",
        citations: 145
      },
      {
        id: 2,
        title: "Distributed Training of Large Language Models",
        authors: "Wilson, J., Chen, S., Li, F.",
        journal: "International Conference on Machine Learning (ICML)",
        year: "2022",
        citations: 278
      },
      {
        id: 3,
        title: "Adaptive Learning Rates in Deep Networks",
        authors: "Wilson, J., Zhang, Y.",
        journal: "International Conference on Learning Representations (ICLR)",
        year: "2021",
        citations: 512
      }
    ],
    
    // Projects
    projects: [
      {
        id: 1,
        name: "Distributed ML Training Framework",
        description: "Open-source framework reducing training time by 80%",
        technologies: "Python, PyTorch, Kubernetes, AWS",
        link: "github.com/jameswilson/distributed-ml"
      },
      {
        id: 2,
        name: "Few-Shot Learning Library",
        description: "Library with 3K+ stars on GitHub",
        technologies: "Python, PyTorch, CUDA",
        link: "github.com/jameswilson/few-shot"
      }
    ]
  });

  // Helper functions for adding/removing items
  const addExperience = () => {
    const newId = Math.max(...form.experience.map(e => e.id), 0) + 1;
    setForm({
      ...form,
      experience: [...form.experience, {
        id: newId,
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        achievements: [""]
      }]
    });
  };

  const removeExperience = (id: number) => {
    setForm({
      ...form,
      experience: form.experience.filter(e => e.id !== id)
    });
  };

  const addAchievement = (expId: number) => {
    setForm({
      ...form,
      experience: form.experience.map(exp => 
        exp.id === expId 
          ? { ...exp, achievements: [...exp.achievements, ""] }
          : exp
      )
    });
  };

  const removeAchievement = (expId: number, index: number) => {
    setForm({
      ...form,
      experience: form.experience.map(exp =>
        exp.id === expId
          ? { ...exp, achievements: exp.achievements.filter((_, i) => i !== index) }
          : exp
      )
    });
  };

  const addEducation = () => {
    const newId = Math.max(...form.education.map(e => e.id), 0) + 1;
    setForm({
      ...form,
      education: [...form.education, {
        id: newId,
        degree: "",
        institution: "",
        location: "",
        year: "",
        gpa: ""
      }]
    });
  };

  const removeEducation = (id: number) => {
    setForm({
      ...form,
      education: form.education.filter(e => e.id !== id)
    });
  };

  const addPublication = () => {
    const newId = Math.max(...form.publications.map(p => p.id), 0) + 1;
    setForm({
      ...form,
      publications: [...form.publications, {
        id: newId,
        title: "",
        authors: "",
        journal: "",
        year: "",
        citations: 0
      }]
    });
  };

  const removePublication = (id: number) => {
    setForm({
      ...form,
      publications: form.publications.filter(p => p.id !== id)
    });
  };

  const addProject = () => {
    const newId = Math.max(...form.projects.map(p => p.id), 0) + 1;
    setForm({
      ...form,
      projects: [...form.projects, {
        id: newId,
        name: "",
        description: "",
        technologies: "",
        link: ""
      }]
    });
  };

  const removeProject = (id: number) => {
    setForm({
      ...form,
      projects: form.projects.filter(p => p.id !== id)
    });
  };

  const addSkillCategory = () => {
    const newCategory = "New Category";
    setForm({
      ...form,
      skills: {
        ...form.skills,
        [newCategory]: [""]
      }
    });
  };

  const addSkill = (category: string) => {
    setForm({
      ...form,
      skills: {
        ...form.skills,
        [category]: [...form.skills[category as keyof typeof form.skills], ""]
      }
    });
  };

  const updateSkill = (category: string, index: number, value: string) => {
    const updatedSkills = { ...form.skills };
    updatedSkills[category as keyof typeof updatedSkills][index] = value;
    setForm({ ...form, skills: updatedSkills });
  };

  const removeSkill = (category: string, index: number) => {
    const updatedSkills = { ...form.skills };
    updatedSkills[category as keyof typeof updatedSkills] = 
      updatedSkills[category as keyof typeof updatedSkills].filter((_, i) => i !== index);
    setForm({ ...form, skills: updatedSkills });
  };

  const updateSimpleField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateNestedField = (section: string, id: number, field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [section]: (prev[section as keyof typeof prev] as any[]).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const renderTemplate = () => {
    switch(selectedTemplate) {
      case "modern-cv": return <ModernCVTemplate form={form} />;
      case "classic-thesis": return <ClassicThesisTemplate form={form} />;
      case "executive-pro": return <ExecutiveProTemplate form={form} />;
      case "harvard-academic": return <HarvardAcademicTemplate form={form} />;
      case "engineering-tech": return <EngineeringTechTemplate form={form} />;
      case "minimal-fr": return <MinimalFRTemplate form={form} />;
      case "consulting-firm": return <ConsultingFirmTemplate form={form} />;
      case "research-publication": return <ResearchPublicationTemplate form={form} />;
      case "deedy-cv": return <DeedyCVTemplate form={form} />;
      case "twenty-seconds": return <TwentySecondsTemplate form={form} />;
      case "awesome-cv": return <AwesomeCVTemplate form={form} />;
      case "alta-cv": return <AltaCVTemplate form={form} />;
      default: return <ModernCVTemplate form={form} />;
    }
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link to="/templates" className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">{template.name}</h1>
              <p className="text-sm text-muted-foreground">{template.category} • {template.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
        </div>

        {/* Template Grid Selection */}
        {/* <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Choose Template Style</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Object.entries(templateData).map(([id, t]) => (
              <button
                key={id}
                onClick={() => setSelectedTemplate(id)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedTemplate === id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                }`}
              >
                <p className="text-xs font-medium text-center">{t.name}</p>
                <p className="text-[10px] text-muted-foreground text-center mt-1">{t.category}</p>
              </button>
            ))}
          </div>
        </div> */}

        {/* Two-column editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Editor */}
          <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-4 max-h-[800px] overflow-y-auto">
            <h2 className="font-display font-semibold text-foreground mb-2 sticky top-0 bg-card pt-2 z-10">Edit Resume</h2>

            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2 sticky top-12 bg-card pb-2 z-10">
              {sections.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSection(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeSection === s
                      ? "gradient-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Dynamic Fields - All Sections Now Editable */}
            <div className="space-y-3 pt-2">
              {/* Personal Info Section */}
              {activeSection === "Personal Info" && (
                <div className="space-y-3">
                  <Input 
                    placeholder="Full Name" 
                    value={form.fullName} 
                    onChange={(e) => updateSimpleField("fullName", e.target.value)} 
                  />
                  <Input 
                    placeholder="Professional Title" 
                    value={form.title} 
                    onChange={(e) => updateSimpleField("title", e.target.value)} 
                  />
                  <Input 
                    placeholder="Email" 
                    value={form.email} 
                    onChange={(e) => updateSimpleField("email", e.target.value)} 
                  />
                  <Input 
                    placeholder="Phone" 
                    value={form.phone} 
                    onChange={(e) => updateSimpleField("phone", e.target.value)} 
                  />
                  <Input 
                    placeholder="Location" 
                    value={form.location} 
                    onChange={(e) => updateSimpleField("location", e.target.value)} 
                  />
                  <Input 
                    placeholder="Website" 
                    value={form.website} 
                    onChange={(e) => updateSimpleField("website", e.target.value)} 
                  />
                  <Input 
                    placeholder="GitHub" 
                    value={form.github} 
                    onChange={(e) => updateSimpleField("github", e.target.value)} 
                  />
                  <Input 
                    placeholder="LinkedIn" 
                    value={form.linkedin} 
                    onChange={(e) => updateSimpleField("linkedin", e.target.value)} 
                  />
                </div>
              )}

              {/* Professional Summary Section */}
              {activeSection === "Professional Summary" && (
                <div className="space-y-3">
                  <Textarea 
                    placeholder="Professional Summary" 
                    value={form.summary} 
                    onChange={(e) => updateSimpleField("summary", e.target.value)} 
                    rows={8}
                    className="text-sm"
                  />
                </div>
              )}

              {/* Experience Section */}
              {activeSection === "Experience" && (
                <div className="space-y-4">
                  {form.experience.map((exp) => (
                    <Card key={exp.id} className="p-4 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-destructive"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="space-y-3">
                        <Input
                          placeholder="Job Title"
                          value={exp.title}
                          onChange={(e) => updateNestedField("experience", exp.id, "title", e.target.value)}
                        />
                        <Input
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => updateNestedField("experience", exp.id, "company", e.target.value)}
                        />
                        <Input
                          placeholder="Location"
                          value={exp.location}
                          onChange={(e) => updateNestedField("experience", exp.id, "location", e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Start Date"
                            value={exp.startDate}
                            onChange={(e) => updateNestedField("experience", exp.id, "startDate", e.target.value)}
                          />
                          <Input
                            placeholder="End Date"
                            value={exp.endDate}
                            onChange={(e) => updateNestedField("experience", exp.id, "endDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Achievements</label>
                          {exp.achievements.map((ach: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                value={ach}
                                onChange={(e) => {
                                  const newAchievements = [...exp.achievements];
                                  newAchievements[idx] = e.target.value;
                                  updateNestedField("experience", exp.id, "achievements", newAchievements);
                                }}
                                placeholder={`Achievement ${idx + 1}`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-destructive"
                                onClick={() => removeAchievement(exp.id, idx)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addAchievement(exp.id)}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add Achievement
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addExperience} className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Experience
                  </Button>
                </div>
              )}

              {/* Education Section */}
              {activeSection === "Education" && (
                <div className="space-y-4">
                  {form.education.map((edu) => (
                    <Card key={edu.id} className="p-4 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-destructive"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="space-y-3">
                        <Input
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => updateNestedField("education", edu.id, "degree", e.target.value)}
                        />
                        <Input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => updateNestedField("education", edu.id, "institution", e.target.value)}
                        />
                        <Input
                          placeholder="Location"
                          value={edu.location}
                          onChange={(e) => updateNestedField("education", edu.id, "location", e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Year"
                            value={edu.year}
                            onChange={(e) => updateNestedField("education", edu.id, "year", e.target.value)}
                          />
                          <Input
                            placeholder="GPA"
                            value={edu.gpa}
                            onChange={(e) => updateNestedField("education", edu.id, "gpa", e.target.value)}
                          />
                        </div>
                        <Input
                          placeholder="Thesis (Optional)"
                          value={edu.thesis || ""}
                          onChange={(e) => updateNestedField("education", edu.id, "thesis", e.target.value)}
                        />
                        <Input
                          placeholder="Advisor (Optional)"
                          value={edu.advisor || ""}
                          onChange={(e) => updateNestedField("education", edu.id, "advisor", e.target.value)}
                        />
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addEducation} className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Education
                  </Button>
                </div>
              )}

              {/* Skills Section */}
              {activeSection === "Skills" && (
                <div className="space-y-4">
                  {Object.entries(form.skills).map(([category, skills]: [string, any]) => (
                    <Card key={category} className="p-4">
                      <h3 className="font-medium mb-2">{category}</h3>
                      <div className="space-y-2">
                        {skills.map((skill: string, idx: number) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={skill}
                              onChange={(e) => updateSkill(category, idx, e.target.value)}
                              placeholder="Skill"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 text-destructive"
                              onClick={() => removeSkill(category, idx)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addSkill(category)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" /> Add Skill to {category}
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addSkillCategory} className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Skill Category
                  </Button>
                </div>
              )}

              {/* Publications Section */}
              {activeSection === "Publications" && (
                <div className="space-y-4">
                  {form.publications.map((pub) => (
                    <Card key={pub.id} className="p-4 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-destructive"
                        onClick={() => removePublication(pub.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="space-y-3">
                        <Input
                          placeholder="Title"
                          value={pub.title}
                          onChange={(e) => updateNestedField("publications", pub.id, "title", e.target.value)}
                        />
                        <Input
                          placeholder="Authors"
                          value={pub.authors}
                          onChange={(e) => updateNestedField("publications", pub.id, "authors", e.target.value)}
                        />
                        <Input
                          placeholder="Journal/Conference"
                          value={pub.journal}
                          onChange={(e) => updateNestedField("publications", pub.id, "journal", e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Year"
                            value={pub.year}
                            onChange={(e) => updateNestedField("publications", pub.id, "year", e.target.value)}
                          />
                          <Input
                            placeholder="Citations"
                            value={pub.citations}
                            onChange={(e) => updateNestedField("publications", pub.id, "citations", e.target.value)}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addPublication} className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Publication
                  </Button>
                </div>
              )}

              {/* Projects Section */}
              {activeSection === "Projects" && (
                <div className="space-y-4">
                  {form.projects.map((proj) => (
                    <Card key={proj.id} className="p-4 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-destructive"
                        onClick={() => removeProject(proj.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="space-y-3">
                        <Input
                          placeholder="Project Name"
                          value={proj.name}
                          onChange={(e) => updateNestedField("projects", proj.id, "name", e.target.value)}
                        />
                        <Input
                          placeholder="Technologies Used"
                          value={proj.technologies}
                          onChange={(e) => updateNestedField("projects", proj.id, "technologies", e.target.value)}
                        />
                        <Textarea
                          placeholder="Description"
                          value={proj.description}
                          onChange={(e) => updateNestedField("projects", proj.id, "description", e.target.value)}
                          rows={3}
                        />
                        <Input
                          placeholder="Project Link (Optional)"
                          value={proj.link || ""}
                          onChange={(e) => updateNestedField("projects", proj.id, "link", e.target.value)}
                        />
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addProject} className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Project
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="bg-card rounded-xl border border-border shadow-card p-4 max-h-[800px] overflow-y-auto">
            <h2 className="font-display font-semibold text-foreground mb-4 sticky top-0 bg-card pt-2 z-10">Live Preview</h2>
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-border overflow-hidden shadow-lg">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

// ==================== ALL TEMPLATE COMPONENTS GO HERE ====================
// (All 12 template components from your original code remain exactly the same)
// ModernCVTemplate, ClassicThesisTemplate, ExecutiveProTemplate, etc.
// I'm not repeating them here to save space, but they stay identical to your original code

// [All your existing template components remain unchanged]

// ==================== TEMPLATE 1: ModernCV (Two-Column with Sidebar) ====================
const ModernCVTemplate = ({ form }: any) => (
  <div className="grid grid-cols-3 min-h-full font-sans">
    {/* Sidebar */}
    <div className="col-span-1 bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-white">
          <span className="text-3xl font-light">
            {form.fullName.split(' ').map((n: string) => n[0]).join('')}
          </span>
        </div>
        <h2 className="text-xl font-light mb-1">{form.fullName}</h2>
        <p className="text-sm text-white/80 font-light">{form.title}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold tracking-wider text-white/70 mb-2">CONTACT</h3>
          <div className="space-y-2 text-xs text-white/80">
            <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> {form.email}</p>
            <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {form.phone}</p>
            <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {form.location}</p>
            <p className="flex items-center gap-2"><Globe className="w-3 h-3" /> {form.website}</p>
          </div>
        </div>

        <Separator className="bg-white/20" />

        <div>
          <h3 className="text-xs font-semibold tracking-wider text-white/70 mb-2">SKILLS</h3>
          <div className="space-y-3">
            {Object.entries(form.skills).map(([category, skills]: [string, any]) => (
              <div key={category}>
                <p className="text-xs font-medium text-white/90 mb-1">{category}</p>
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 3).map((skill: string, i: number) => (
                    <span key={i} className="text-[10px] bg-white/20 px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="col-span-2 p-6">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wider mb-2">Professional Summary</h2>
        <p className="text-sm text-gray-700 leading-relaxed">{form.summary}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wider mb-3">Experience</h2>
        {form.experience.map((exp: any, idx: number) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                <p className="text-sm text-blue-700">{exp.company}</p>
              </div>
              <p className="text-xs text-gray-500">{exp.startDate}—{exp.endDate}</p>
            </div>
            <ul className="mt-2 space-y-1">
              {exp.achievements.slice(0, 2).map((ach: string, i: number) => (
                <li key={i} className="text-xs text-gray-600 flex gap-2">
                  <span className="text-blue-700">•</span>
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wider mb-3">Education</h2>
        {form.education.map((edu: any) => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between">
              <h3 className="font-medium text-gray-900">{edu.degree}</h3>
              <p className="text-xs text-gray-500">{edu.year}</p>
            </div>
            <p className="text-sm text-blue-700">{edu.institution}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ==================== TEMPLATE 2: Classic Thesis (Academic) ====================
const ClassicThesisTemplate = ({ form }: any) => (
  <div className="p-8 max-w-3xl mx-auto font-serif">
    <div className="text-center mb-8 border-b border-gray-300 pb-4">
      <h1 className="text-3xl font-bold text-gray-900">{form.fullName}</h1>
      <p className="text-lg text-gray-600 mt-1">{form.title}</p>
      <div className="flex justify-center gap-4 mt-3 text-sm text-gray-500">
        <span>{form.email}</span> • <span>{form.phone}</span> • <span>{form.location}</span>
      </div>
    </div>

    <div className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">EDUCATION</h2>
      {form.education.map((edu: any) => (
        <div key={edu.id} className="mb-4">
          <div className="flex justify-between">
            <span className="font-bold">{edu.degree}</span>
            <span className="text-gray-600">{edu.year}</span>
          </div>
          <div className="text-gray-700">{edu.institution}</div>
          {edu.thesis && <div className="text-sm italic mt-1">Thesis: "{edu.thesis}"</div>}
          {edu.advisor && <div className="text-sm text-gray-600">Advisor: {edu.advisor}</div>}
        </div>
      ))}
    </div>

    <div className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">RESEARCH EXPERIENCE</h2>
      {form.experience.map((exp: any) => (
        <div key={exp.id} className="mb-4">
          <div className="flex justify-between">
            <span className="font-bold">{exp.company}</span>
            <span className="text-gray-600">{exp.startDate}–{exp.endDate}</span>
          </div>
          <div className="italic text-gray-700">{exp.title}</div>
          <ul className="list-disc list-inside mt-2 text-sm">
            {exp.achievements.map((ach: string, i: number) => (
              <li key={i}>{ach}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div>
      <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">SELECTED PUBLICATIONS</h2>
      {form.publications.map((pub: any) => (
        <div key={pub.id} className="mb-3 text-sm">
          <span className="font-bold">{pub.title}</span>
          <div className="text-gray-700">{pub.authors}</div>
          <div className="text-gray-600 italic">{pub.journal} ({pub.year}) • Cited by {pub.citations}</div>
        </div>
      ))}
    </div>
  </div>
);

// ==================== TEMPLATE 3: Executive Pro (Serif Professional) ====================
const ExecutiveProTemplate = ({ form }: any) => (
  <div className="p-8 max-w-3xl mx-auto font-serif">
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{form.fullName}</h1>
      <p className="text-xl text-gray-600 mt-1">{form.title}</p>
      <div className="flex gap-4 mt-3 text-sm text-gray-500 border-t border-gray-200 pt-3">
        <span>{form.email}</span> • <span>{form.phone}</span> • <span>{form.location}</span>
      </div>
    </div>

    <div className="mb-6">
      <h2 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-3">Professional Summary</h2>
      <p className="text-gray-700 leading-relaxed">{form.summary}</p>
    </div>

    <div className="mb-6">
      <h2 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-3">Professional Experience</h2>
      {form.experience.map((exp: any) => (
        <div key={exp.id} className="mb-5">
          <div className="flex justify-between items-baseline">
            <h3 className="font-bold text-gray-900">{exp.title}</h3>
            <span className="text-sm text-gray-500">{exp.startDate} — {exp.endDate}</span>
          </div>
          <p className="text-gray-600 italic mb-2">{exp.company}</p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {exp.achievements.map((ach: string, i: number) => (
              <li key={i}>{ach}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-3">Education</h2>
        {form.education.map((edu: any) => (
          <div key={edu.id} className="mb-3">
            <div className="font-bold text-gray-900">{edu.degree}</div>
            <div className="text-gray-700">{edu.institution}</div>
            <div className="text-sm text-gray-500">{edu.year}</div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-3">Core Skills</h2>
        {Object.entries(form.skills).map(([category, skills]: [string, any]) => (
          <div key={category} className="mb-2">
            <div className="text-sm font-semibold text-gray-700">{category}</div>
            <div className="text-sm text-gray-600">{skills.slice(0, 4).join(' • ')}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ==================== TEMPLATE 4: Harvard Academic ====================
const HarvardAcademicTemplate = ({ form }: any) => (
  <div className="p-8 max-w-3xl mx-auto">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-serif font-bold text-gray-900">{form.fullName}</h1>
      <p className="text-lg text-gray-600 mt-1">{form.title}</p>
      <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
        <span>{form.email}</span> | <span>{form.phone}</span> | <span>{form.location}</span>
      </div>
    </div>

    <div className="mb-6">
      <h2 className="text-base font-serif font-bold border-b border-gray-300 pb-1 mb-3">EDUCATION</h2>
      {form.education.map((edu: any) => (
        <div key={edu.id} className="mb-3">
          <div className="flex justify-between">
            <span className="font-serif font-bold">{edu.degree}</span>
            <span className="text-gray-600">{edu.year}</span>
          </div>
          <div className="text-gray-700">{edu.institution}</div>
          {edu.gpa && <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>}
        </div>
      ))}
    </div>

    <div className="mb-6">
      <h2 className="text-base font-serif font-bold border-b border-gray-300 pb-1 mb-3">RESEARCH & TEACHING</h2>
      {form.experience.map((exp: any) => (
        <div key={exp.id} className="mb-4">
          <div className="flex justify-between">
            <span className="font-serif font-bold">{exp.company}</span>
            <span className="text-sm text-gray-600">{exp.startDate}–{exp.endDate}</span>
          </div>
          <div className="italic text-gray-700">{exp.title}</div>
        </div>
      ))}
    </div>

    <div className="mb-6">
      <h2 className="text-base font-serif font-bold border-b border-gray-300 pb-1 mb-3">PUBLICATIONS</h2>
      {form.publications.slice(0, 3).map((pub: any, i: number) => (
        <div key={pub.id} className="mb-2 text-sm">
          <span className="font-serif">{pub.authors}. </span>
          <span className="italic">"{pub.title}"</span>
          <span className="text-gray-600"> {pub.journal} ({pub.year}).</span>
        </div>
      ))}
    </div>

    <div>
      <h2 className="text-base font-serif font-bold border-b border-gray-300 pb-1 mb-3">HONORS & AWARDS</h2>
      <div className="text-sm text-gray-700">
        • Google Ph.D. Fellowship (2016-2018)<br />
        • Best Paper Award, NeurIPS 2023<br />
        • NSF Graduate Research Fellowship (2015)
      </div>
    </div>
  </div>
);

// ==================== TEMPLATE 5: Engineering Tech ====================
const EngineeringTechTemplate = ({ form }: any) => (
  <div className="p-8 font-mono text-sm">
    <div className="mb-6 border-b-2 border-gray-300 pb-3">
      <h1 className="text-3xl font-bold text-gray-900">{form.fullName}</h1>
      <p className="text-blue-600 mt-1">{form.title}</p>
      <div className="flex gap-4 mt-2 text-gray-600">
        <span>{form.email}</span> • <span>{form.github}</span> • <span>{form.location}</span>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1 space-y-4">
        <div className="border p-3">
          <h2 className="font-bold mb-2">TECH STACK</h2>
          {Object.entries(form.skills).map(([category, skills]: [string, any]) => (
            <div key={category} className="mb-2">
              <div className="text-xs text-gray-500">{category}:</div>
              <div className="text-xs">{skills.slice(0, 3).join(', ')}</div>
            </div>
          ))}
        </div>

        <div className="border p-3">
          <h2 className="font-bold mb-2">EDUCATION</h2>
          {form.education.map((edu: any) => (
            <div key={edu.id} className="mb-2 text-xs">
              <div className="font-bold">{edu.degree}</div>
              <div>{edu.institution} • {edu.year}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2">
        <div className="border p-3 mb-4">
          <h2 className="font-bold mb-2">EXPERIENCE</h2>
          {form.experience.map((exp: any) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-bold">{exp.company}</span>
                <span className="text-xs text-gray-500">{exp.startDate}-{exp.endDate}</span>
              </div>
              <div className="text-xs text-blue-600 mb-1">{exp.title}</div>
              <ul className="list-disc list-inside text-xs">
                {exp.achievements.slice(0, 2).map((ach: string, i: number) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border p-3">
          <h2 className="font-bold mb-2">PROJECTS</h2>
          {form.projects.map((proj: any) => (
            <div key={proj.id} className="mb-2 text-xs">
              <span className="font-bold">{proj.name}</span> - {proj.technologies}<br />
              <span className="text-gray-600">{proj.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ==================== TEMPLATE 6: Minimal FR (French Style) ====================
const MinimalFRTemplate = ({ form }: any) => (
  <div className="p-10 max-w-2xl mx-auto font-light">
    <div className="mb-10 text-center">
      <h1 className="text-4xl font-thin text-gray-800 tracking-wide">{form.fullName}</h1>
      <p className="text-sm text-gray-500 tracking-widest uppercase mt-2">{form.title}</p>
      <div className="flex justify-center space-x-4 text-xs text-gray-400 mt-4">
        <span>{form.email}</span> • <span>{form.phone}</span> • <span>{form.location}</span>
      </div>
    </div>

    <div className="mb-8 text-center max-w-xl mx-auto">
      <p className="text-gray-600 text-sm leading-relaxed">{form.summary}</p>
    </div>

    <div className="mb-8">
      <h2 className="text-xs font-semibold text-gray-400 tracking-widest text-center mb-6">EXPÉRIENCE</h2>
      {form.experience.map((exp: any) => (
        <div key={exp.id} className="grid grid-cols-4 gap-4 mb-5">
          <div className="col-span-1 text-right">
            <p className="text-xs text-gray-400">{exp.startDate} – {exp.endDate}</p>
          </div>
          <div className="col-span-3">
            <p className="font-medium text-gray-800">{exp.title}</p>
            <p className="text-xs text-gray-500 mb-1">{exp.company}</p>
            <p className="text-xs text-gray-600">{exp.achievements[0]}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-8">
      <div>
        <h2 className="text-xs font-semibold text-gray-400 tracking-widest mb-4">FORMATION</h2>
        {form.education.map((edu: any) => (
          <div key={edu.id} className="mb-3">
            <p className="text-sm font-medium">{edu.degree}</p>
            <p className="text-xs text-gray-500">{edu.institution}, {edu.year}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xs font-semibold text-gray-400 tracking-widest mb-4">COMPÉTENCES</h2>
        <div className="space-y-2">
          {Object.entries(form.skills).map(([category, skills]: [string, any]) => (
            <div key={category}>
              <p className="text-xs text-gray-500">{category}</p>
              <p className="text-xs text-gray-700">{skills.slice(0, 3).join(' • ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ==================== TEMPLATE 7: Consulting Firm ====================
const ConsultingFirmTemplate = ({ form }: any) => (
  <div className="p-8 max-w-3xl mx-auto">
    <div className="flex justify-between items-start mb-6 border-b pb-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{form.fullName}</h1>
        <p className="text-blue-600 text-lg">{form.title}</p>
      </div>
      <div className="text-right text-sm text-gray-500">
        <p>{form.email}</p>
        <p>{form.phone}</p>
        <p>{form.location}</p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 p-3 text-center rounded">
        <div className="text-2xl font-bold text-blue-600">8+</div>
        <div className="text-xs text-gray-600">Years Experience</div>
      </div>
      <div className="bg-blue-50 p-3 text-center rounded">
        <div className="text-2xl font-bold text-blue-600">$50M+</div>
        <div className="text-xs text-gray-600">Revenue Impact</div>
      </div>
      <div className="bg-blue-50 p-3 text-center rounded">
        <div className="text-2xl font-bold text-blue-600">20+</div>
        <div className="text-xs text-gray-600">Clients Served</div>
      </div>
    </div>

    <div className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Executive Summary</h2>
      <p className="text-gray-700 leading-relaxed">{form.summary}</p>
    </div>

    <div className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Selected Engagements</h2>
      {form.experience.slice(0, 2).map((exp: any) => (
        <div key={exp.id} className="mb-4">
          <div className="flex justify-between">
            <h3 className="font-bold text-gray-900">{exp.company}</h3>
            <span className="text-sm text-gray-500">{exp.startDate}–{exp.endDate}</span>
          </div>
          <p className="text-blue-600 text-sm mb-1">{exp.title}</p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {exp.achievements.slice(0, 2).map((ach: string, i: number) => (
              <li key={i}>{ach}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Core Competencies</h2>
        {Object.entries(form.skills).map(([category, skills]: [string, any]) => (
          <div key={category} className="mb-2">
            <p className="text-xs text-gray-500">{category}</p>
            <p className="text-sm text-gray-700">{skills.slice(0, 3).join(' • ')}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Education</h2>
        {form.education.map((edu: any) => (
          <div key={edu.id} className="mb-2">
            <p className="font-bold text-gray-900">{edu.degree}</p>
            <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ==================== TEMPLATE 8: Research Publication ====================
const ResearchPublicationTemplate = ({ form }: any) => (
  <div className="p-8 max-w-3xl mx-auto">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{form.fullName}</h1>
      <p className="text-lg text-gray-600 mt-1">{form.title}</p>
      <p className="text-sm text-gray-500 mt-2">{form.email} | Google Scholar: 2000+ citations</p>
    </div>

    <div className="mb-8">
      <h2 className="text-base font-bold border-b border-gray-300 pb-1 mb-4">RESEARCH INTERESTS</h2>
      <p className="text-gray-700">Machine Learning, Deep Learning, Computer Vision, Natural Language Processing, Few-Shot Learning</p>
    </div>

    <div className="mb-8">
      <h2 className="text-base font-bold border-b border-gray-300 pb-1 mb-4">PUBLICATIONS</h2>
      {form.publications.map((pub: any, idx: number) => (
        <div key={pub.id} className="mb-3 text-sm">
          <span className="font-bold">[{idx+1}]</span> {pub.authors}. <span className="italic">"{pub.title}"</span>. <span className="font-medium">{pub.journal}</span>, {pub.year}. <span className="text-gray-500">Citations: {pub.citations}</span>
        </div>
      ))}
    </div>

    <div className="mb-8">
      <h2 className="text-base font-bold border-b border-gray-300 pb-1 mb-4">RESEARCH EXPERIENCE</h2>
      {form.experience.map((exp: any) => (
        <div key={exp.id} className="mb-4">
          <div className="flex justify-between">
            <h3 className="font-bold text-gray-900">{exp.company}</h3>
            <span className="text-sm text-gray-500">{exp.startDate}–{exp.endDate}</span>
          </div>
          <p className="text-gray-700 italic">{exp.title}</p>
        </div>
      ))}
    </div>

    <div>
      <h2 className="text-base font-bold border-b border-gray-300 pb-1 mb-4">EDUCATION</h2>
      {form.education.map((edu: any) => (
        <div key={edu.id} className="mb-3">
          <div className="flex justify-between">
            <span className="font-bold text-gray-900">{edu.degree}</span>
            <span className="text-sm text-gray-500">{edu.year}</span>
          </div>
          <p className="text-gray-700">{edu.institution}</p>
          {edu.thesis && <p className="text-sm text-gray-600 italic">Thesis: {edu.thesis}</p>}
        </div>
      ))}
    </div>
  </div>
);

// ==================== TEMPLATE 9: Deedy CV (Popular Two-Column) ====================
const DeedyCVTemplate = ({ form }: any) => (
  <div className="p-6 font-sans">
    <div className="flex justify-between items-center mb-6 border-b-2 border-gray-300 pb-3">
      <h1 className="text-3xl font-bold text-gray-900">{form.fullName}</h1>
      <div className="text-right text-sm">
        <p>{form.email}</p>
        <p>{form.phone}</p>
        <p>{form.location}</p>
        <p>{form.github}</p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-1">
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Education</h2>
          {form.education.map((edu: any) => (
            <div key={edu.id} className="mb-3">
              <p className="font-bold text-sm">{edu.institution}</p>
              <p className="text-xs text-gray-600">{edu.degree}</p>
              <p className="text-xs text-gray-400">{edu.year}</p>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Skills</h2>
          {Object.entries(form.skills).map(([category, skills]: [string, any]) => (
            <div key={category} className="mb-2">
              <p className="text-xs font-medium">{category}</p>
              <p className="text-xs text-gray-600">{skills.slice(0, 4).join(' • ')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2">
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Experience</h2>
          {form.experience.map((exp: any) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <p className="font-bold text-sm">{exp.company}</p>
                <p className="text-xs text-gray-500">{exp.startDate} – {exp.endDate}</p>
              </div>
              <p className="text-xs text-gray-600 italic mb-1">{exp.title}</p>
              <ul className="list-disc list-inside text-xs text-gray-600">
                {exp.achievements.slice(0, 2).map((ach: string, i: number) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Publications</h2>
          {form.publications.slice(0, 2).map((pub: any) => (
            <p key={pub.id} className="text-xs mb-1">{pub.authors}. <span className="italic">"{pub.title}"</span>. {pub.journal} {pub.year}.</p>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ==================== TEMPLATE 10: Twenty Seconds ====================
const TwentySecondsTemplate = ({ form }: any) => (
  <div className="p-8 max-w-3xl mx-auto">
    <div className="flex items-center gap-6 mb-8">
      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
        {form.fullName.split(' ').map((n: string) => n[0]).join('')}
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{form.fullName}</h1>
        <p className="text-lg text-blue-600">{form.title}</p>
        <div className="flex gap-3 mt-1 text-sm text-gray-500">
          <span>{form.email}</span> • <span>{form.phone}</span> • <span>{form.location}</span>
        </div>
      </div>
    </div>

    <div className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Profile</h2>
      <p className="text-gray-700 leading-relaxed">{form.summary}</p>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Work Experience</h2>
        {form.experience.slice(0, 2).map((exp: any) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-bold text-gray-900">{exp.company}</h3>
              <span className="text-xs text-gray-500">{exp.startDate}-{exp.endDate}</span>
            </div>
            <p className="text-blue-600 text-sm mb-1">{exp.title}</p>
            <p className="text-xs text-gray-600">{exp.achievements[0]}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Education</h2>
        {form.education.map((edu: any) => (
          <div key={edu.id} className="mb-3">
            <h3 className="font-bold text-gray-900">{edu.degree}</h3>
            <p className="text-sm text-gray-600">{edu.institution}, {edu.year}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {Object.values(form.skills).flat().slice(0, 12).map((skill: any, i: number) => (
          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{skill}</span>
        ))}
      </div>
    </div>
  </div>
);

// ==================== TEMPLATE 11: Awesome CV ====================
const AwesomeCVTemplate = ({ form }: any) => (
  <div className="p-8 max-w-3xl mx-auto">
    <div className="text-center mb-6">
      <h1 className="text-4xl font-bold text-gray-900">{form.fullName}</h1>
      <p className="text-xl text-blue-600 mt-1">{form.title}</p>
      <div className="flex justify-center gap-4 mt-3 text-sm text-gray-500">
        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {form.email}</span>
        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {form.phone}</span>
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {form.location}</span>
      </div>
    </div>

    <div className="mb-6">
      <h2 className="text-base font-bold border-l-4 border-blue-600 pl-2 mb-3">Professional Summary</h2>
      <p className="text-gray-700 leading-relaxed">{form.summary}</p>
    </div>

    <div className="mb-6">
      <h2 className="text-base font-bold border-l-4 border-blue-600 pl-2 mb-3">Work Experience</h2>
      {form.experience.map((exp: any) => (
        <div key={exp.id} className="mb-4">
          <div className="flex justify-between">
            <h3 className="font-bold text-gray-900">{exp.title}</h3>
            <span className="text-sm text-gray-500">{exp.startDate} – {exp.endDate}</span>
          </div>
          <p className="text-blue-600 text-sm mb-2">{exp.company}</p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {exp.achievements.slice(0, 2).map((ach: string, i: number) => (
              <li key={i}>{ach}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-base font-bold border-l-4 border-blue-600 pl-2 mb-3">Education</h2>
        {form.education.map((edu: any) => (
          <div key={edu.id} className="mb-3">
            <h3 className="font-bold text-gray-900">{edu.degree}</h3>
            <p className="text-sm text-gray-600">{edu.institution}</p>
            <p className="text-xs text-gray-400">{edu.year}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-base font-bold border-l-4 border-blue-600 pl-2 mb-3">Skills</h2>
        {Object.entries(form.skills).map(([category, skills]: [string, any]) => (
          <div key={category} className="mb-2">
            <p className="text-sm font-medium text-gray-700">{category}</p>
            <p className="text-xs text-gray-600">{skills.slice(0, 4).join(' • ')}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ==================== TEMPLATE 12: Alta CV ====================
const AltaCVTemplate = ({ form }: any) => (
  <div className="p-8 max-w-3xl mx-auto">
    <div className="flex items-center gap-6 mb-8">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
        {form.fullName.split(' ').map((n: string) => n[0]).join('')}
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{form.fullName}</h1>
        <p className="text-lg text-purple-600">{form.title}</p>
        <div className="flex gap-3 mt-1 text-sm text-gray-500">
          <span>{form.email}</span> • <span>{form.phone}</span> • <span>{form.location}</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-1 space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Skills</h2>
          {Object.entries(form.skills).map(([category, skills]: [string, any]) => (
            <div key={category} className="mb-2">
              <p className="text-xs font-medium text-gray-500">{category}</p>
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 2).map((skill: string, i: number) => (
                  <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Languages</h2>
          <div className="text-sm">English (Native)</div>
          <div className="text-sm">Spanish (Fluent)</div>
        </div>
      </div>

      <div className="col-span-2">
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">About</h2>
          <p className="text-sm text-gray-700">{form.summary}</p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Experience</h2>
          {form.experience.map((exp: any) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <h3 className="font-bold text-sm text-gray-900">{exp.company}</h3>
                <span className="text-xs text-gray-500">{exp.startDate}–{exp.endDate}</span>
              </div>
              <p className="text-purple-600 text-xs mb-1">{exp.title}</p>
              <p className="text-xs text-gray-600">{exp.achievements[0]}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Education</h2>
          {form.education.map((edu: any) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold text-sm text-gray-900">{edu.institution}</span>
                <span className="text-xs text-gray-500">{edu.year}</span>
              </div>
              <p className="text-xs text-gray-600">{edu.degree}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);