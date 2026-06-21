import React from "react";
import { whyChooseUsData } from "../data";
import LucideIcon from "./LucideIcon";

interface WhyChooseUsProps {
  isDarkMode: boolean;
}

export default function WhyChooseUs({ isDarkMode }: WhyChooseUsProps) {
  return (
    <section 
      id="why-choose-us" 
      className={`py-16 md:py-24 transition-colors duration-300 border-b relative ${
        isDarkMode 
          ? "bg-[#030610] to-[#050816] border-slate-900" 
          : "bg-slate-50 border-slate-200"
      }`}
    >
      {/* Background glowing bubbles */}
      <div className="absolute top-1/4 right-[5%] w-[250px] h-[250px] bg-sky-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold font-mono tracking-widest text-[#00D4FF] uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              // CORPORATE ADVANTAGES
            </span>
            <h2 className={`text-3xl md:text-5xl font-black tracking-tight uppercase mt-4 leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              WHY PREMIER BRANDS PARTNER WITH NEXORA
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-sm md:text-base text-slate-400 leading-relaxed md:pt-4">
              We operate at the intersection of absolute zero-downtime scalability and rigid defensive protection frameworks. Our timeline highlights the structural standards integrated into every enterprise commitment.
            </p>
          </div>
        </div>

        {/* Timeline Layout */}
        <div className="relative max-w-4xl mx-auto mt-12 pl-4 md:pl-0">
          
          {/* Vertical central path line */}
          <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 transform md:-translate-x-1/2 ${
            isDarkMode ? "bg-slate-900/80" : "bg-slate-200"
          }`} />

          {/* Timeline Nodes */}
          <div className="space-y-12 relative">
            {whyChooseUsData.map((choice, index) => {
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={choice.title} 
                  className={`flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row-reverse" : ""
                  } relative`}
                >
                  
                  {/* Outer central indicator dot */}
                  <div className="absolute left-0 md:left-1/2 top-1.5 w-8 h-8 rounded-full flex items-center justify-center transform -translate-x-1/2 bg-slate-950 border-2 border-blue-600/60 shadow shadow-sky-500/40 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]" />
                  </div>

                  {/* Spacer or Empty Box for standard aligning */}
                  <div className="hidden md:block w-1/2" />

                  {/* Text Content bubble card */}
                  <div className={`w-full md:w-[45%] pl-8 md:pl-0 md:px-4 transition-all duration-300 hover:scale-[1.01]`}>
                    <div className={`p-5 rounded-2xl border flex items-start gap-4 hover:shadow-lg ${
                      isDarkMode 
                        ? "bg-[#0b101c]/45 border-slate-900/60 hover:border-slate-800" 
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}>
                      
                      {/* Left icon wrapper */}
                      <div className="p-2.5 rounded-lg bg-blue-500/10 text-[#00D4FF] flex-shrink-0">
                        <LucideIcon name={choice.iconName} className="w-5 h-5 text-[#00D4FF]" />
                      </div>

                      {/* Details */}
                      <div>
                        <h3 className={`text-base font-bold uppercase tracking-tight mb-1.5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                          {choice.title}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                          {choice.description}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
