import React, { useState } from "react";
import { techStackData } from "../data";
import LucideIcon from "./LucideIcon";

interface TechStackProps {
  isDarkMode: boolean;
}

export default function TechStack({ isDarkMode }: TechStackProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Frameworks" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "database", label: "Database" },
    { id: "cloud", label: "Cloud Networks" },
    { id: "devops", label: "DevOps & SRE" }
  ];

  const filteredTech = activeCategory === "all"
    ? techStackData
    : techStackData.filter((t) => t.category === activeCategory);

  // Mapping custom tech icons cleanly
  const getTechIcon = (name: string) => {
    switch (name) {
      case "React": return "Cpu";
      case "Next.js": return "Layers";
      case "Vue": return "Compass";
      case "Node.js (TS)": return "Terminal";
      case ".NET Core": return "Code";
      case "Python": return "Brain";
      case "PostgreSQL": return "Database";
      case "MongoDB": return "Layers";
      case "SQL Server": return "Briefcase";
      case "Microsoft Azure": return "Cloud";
      case "Amazon AWS": return "Server";
      case "Google Cloud (GCP)": return "Globe";
      case "Docker": return "Terminal";
      case "Kubernetes": return "RefreshCw";
      case "Terraform": return "Compass";
      default: return "Code";
    }
  };

  return (
    <section 
      id="technologies" 
      className={`py-16 md:py-24 transition-colors duration-300 border-b relative ${
        isDarkMode 
          ? "bg-[#030610] to-[#050816]" 
          : "bg-slate-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          <div className="lg:col-span-6">
            <span className="text-xs font-bold font-mono tracking-widest text-[#00D4FF] uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              // TECHNOLOGY RUNTIMES
            </span>
            <h2 className={`text-3xl md:text-5xl font-black tracking-tight uppercase mt-4 leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              OUR SANCTIONED TECH STACK
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-sm text-slate-400 leading-relaxed">
              We exclusively employ highly secure, type-safe, and actively maintained software environments. Filter by category to see our certified skill levels in these platforms.
            </p>
          </div>
        </div>

        {/* Categories Tab Bar Row */}
        <div className="flex flex-wrap items-center justify-start gap-1.5 mb-10 border-b dark:border-slate-800 border-slate-200 pb-3">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider duration-150 rounded-lg cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : isDarkMode
                      ? "text-slate-450 hover:text-white hover:bg-slate-900"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTech.map((tech) => {
            const iconKey = getTechIcon(tech.name);
            return (
              <div 
                key={tech.name}
                className={`p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                  isDarkMode 
                    ? "bg-[#0b101c]/45 border-slate-900 hover:border-slate-800" 
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Header Icon + Name */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-[#00D4FF] flex-shrink-0">
                    <LucideIcon name={iconKey} className="w-5 h-5 text-[#00D4FF]" />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold uppercase tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {tech.name}
                    </h3>
                    <span className="text-[9px] font-mono tracking-wider font-bold text-[#00D4FF] uppercase bg-sky-500/5 px-2 py-0.5 rounded border border-sky-500/10 inline-block mt-0.5">
                      {tech.category}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[36px]">
                  {tech.description}
                </p>

                {/* Proficiency Gauge indicator bar */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono mb-1.5 text-slate-500">
                    <span>UTILITY COEFFICIENT</span>
                    <span className="text-[#00D4FF] font-bold">{tech.proficiency}%</span>
                  </div>
                  
                  {/* Fill gauge */}
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-950" : "bg-slate-100"}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-[#00D4FF] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${tech.proficiency}%` }}
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
