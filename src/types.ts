/**
 * TypeScript Type Definitions for Nexora Tech
 */

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  iconName: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  growth: string;
}

export interface FeatureKey {
  title: string;
  description: string;
  iconName: string;
}

export interface SolutionItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: string;
  benefits: string[];
  gradient: string;
  iconName: string;
}

export interface TechItem {
  name: string;
  category: "frontend" | "backend" | "database" | "cloud" | "devops";
  iconName: string;
  proficiency: number;
  description: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: "web" | "mobile" | "cloud" | "ai" | "enterprise";
  description: string;
  details: string;
  image: string;
  tech: string[];
  metrics: string;
  demoUrl: string;
}

export interface CaseStudyItem {
  id: string;
  title: string;
  client: string;
  challenge: string;
  solution: string;
  result: string;
  metrics: string;
  industry: string;
  duration: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  stars: number;
  image: string;
}

export interface WorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  details: string;
  milestone: string;
  iconName: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  iconName: string;
  linkedin: string;
  expertise: string[];
  photoSeed: string; // Used to fetch or build beautiful visual identity fallback
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: "AI News" | "Cloud Engineering" | "Cybersecurity" | "Insights";
  summary: string;
  content: string;
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
  };
  image: string;
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-Time" | "Part-Time" | "Contract" | "Internship";
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
}
