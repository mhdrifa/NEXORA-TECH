import React from "react";
import { teamMembers } from "../data";
import LucideIcon from "./LucideIcon";

interface TeamProps {
  isDarkMode: boolean;
}

export default function Team({ isDarkMode }: TeamProps) {
  // Mapping custom photos based on seeds dynamically to beautiful fallback images
  const getCorporatePhoto = (seed: string) => {
    switch (seed) {
      case "evelyn":
        return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80";
      case "victor":
        return "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80";
      case "sarah":
        return "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80";
      case "arthur":
        return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80";
      case "nico":
        return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";
      default:
        return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80";
    }
  };

  return (
    <section 
      id="team" 
      className={`py-16 md:py-24 transition-colors duration-300 border-b relative ${
        isDarkMode 
          ? "bg-[#050816]" 
          : "bg-white"
      }`}
    >
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold font-mono tracking-widest text-[#00D4FF] uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            // EXECUTIVE COMMANDEERS
          </span>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tight uppercase mt-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            OUR PRINCIPAL ARCHITECTS
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            Cohesive, certified specialists carrying deep technical knowledge across global multi-hyperscaler frameworks and secure neural setups.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {teamMembers.map((member) => {
            const photoUrl = getCorporatePhoto(member.photoSeed);
            return (
              <div 
                key={member.id}
                className={`rounded-2xl border flex flex-col justify-between overflow-hidden group transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                  isDarkMode 
                    ? "bg-[#0b101c]/45 border-slate-900 shadow-black/20" 
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  {/* Photo Frame */}
                  <div className="relative h-44 md:h-48 w-full overflow-hidden">
                    <img 
                      src={photoUrl} 
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 duration-300 transition-all select-none"
                    />
                    
                    {/* LinkedIn overlay hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 duration-300 transition-all flex items-center justify-center pointer-events-none">
                      <div className="p-2.5 rounded-full bg-blue-600 text-white shadow shadow-blue-500/40 pointer-events-auto">
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`View ${member.name}'s professional profile on LinkedIn`}>
                          <LucideIcon name="Linkedin" className="w-4 h-4 text-white" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Core Details */}
                  <div className="p-4 space-y-2 text-left">
                    <h3 className={`text-xs md:text-sm font-black uppercase tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {member.name}
                    </h3>
                    <p className="text-[10px] font-mono text-[#00D4FF] uppercase tracking-wide leading-tight min-h-[30px]">
                      {member.role}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-3">
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* Badges footer */}
                <div className="p-4 pt-0">
                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t dark:border-slate-900 border-slate-100">
                    {member.expertise.map((exp) => (
                      <span 
                        key={exp}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                          isDarkMode 
                            ? "bg-slate-950 text-slate-400 border border-slate-900" 
                            : "bg-white text-slate-600 border border-slate-200"
                        }`}
                      >
                        {exp}
                      </span>
                    ))}
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
