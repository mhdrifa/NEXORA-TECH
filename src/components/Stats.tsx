import React, { useEffect, useState } from "react";
import { statsData } from "../data";
import LucideIcon from "./LucideIcon";

interface CounterProp {
  target: number;
  suffix: string;
}

function Counter({ target, suffix }: CounterProp) {
  const [count, setCount] = useState(Math.max(0, target - 45));

  useEffect(() => {
    let start = Math.max(0, target - 45);
    if (start === target) return;

    const duration = 2000; // ms
    const range = target - start;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= target) {
        clearInterval(timer);
      }
    }, Math.max(stepTime, 20));

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

interface StatsProps {
  isDarkMode: boolean;
}

export default function Stats({ isDarkMode }: StatsProps) {
  return (
    <section 
      id="about" 
      className={`py-12 md:py-16 select-none transition-colors duration-300 border-b ${
        isDarkMode 
          ? "bg-gradient-to-b from-[#030610] to-[#050816] border-slate-900" 
          : "bg-gradient-to-b from-white to-slate-50 border-slate-250"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Core Corporate Overview Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <span className="text-xs font-bold font-mono tracking-widest text-[#00D4FF] uppercase">
              // CORPORATE POSTURE
            </span>
            <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight mt-2 uppercase ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              DELIVERING SYSTEM SCALE WITH METRIC INTEGRITY
            </h2>
          </div>
          <div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nexora Tech drives operations via objective performance signals. We integrate specialized cloud frameworks, AI systems, and automated defense networks to unlock multi-million dollar annual productivity growth.
            </p>
          </div>
        </div>

        {/* Counter Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {statsData.map((stat) => {
            // Pick corresponding status color metrics
            let valueColor = "text-[#00D4FF]";
            if (stat.id === "projects") valueColor = "text-blue-500";
            if (stat.id === "satisfaction") valueColor = "text-emerald-500";
            if (stat.id === "support") valueColor = "text-purple-500";

            return (
              <div 
                key={stat.id}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                  isDarkMode 
                    ? "bg-[#0b101c]/45 border-slate-900 shadow-black/20" 
                    : "bg-white border-slate-200 shadow-slate-100"
                }`}
              >
                <div className="text-slate-500 font-mono text-[10px] uppercase flex items-center justify-between">
                  <span>SEC-{stat.id.toUpperCase()}</span>
                  <span className="text-emerald-500 animate-pulse">● LIVE</span>
                </div>
                
                {/* Simulated Real Numeric Incrementor */}
                <h3 className={`text-3xl md:text-4.5xl font-black font-mono tracking-tight mt-4 ${valueColor}`}>
                  <Counter target={stat.value} suffix={stat.suffix} />
                </h3>

                <p className={`text-xs font-semibold mt-2 ${isDarkMode ? "text-white" : "text-slate-700"}`}>
                  {stat.label}
                </p>

                <div className="mt-3 pt-3 border-t dark:border-slate-900/60 border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-450">
                  <span>VELOCITY</span>
                  <span className="text-[#00D4FF]">{stat.growth}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
