import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import LucideIcon from "./LucideIcon";

interface HeroProps {
  isDarkMode: boolean;
  onConsultationClick: () => void;
}

export default function Hero({ isDarkMode, onConsultationClick }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 600);
    let height = (canvas.height = canvas.offsetHeight || 500);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      glowColor: string;
    }> = [];

    const particleCount = 40;
    const colors = isDarkMode 
      ? ["rgba(0, 102, 255, 0.6)", "rgba(0, 212, 255, 0.6)", "rgba(139, 92, 246, 0.6)"]
      : ["rgba(0, 102, 255, 0.4)", "rgba(0, 212, 255, 0.4)", "rgba(139, 92, 246, 0.4)"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 3 + 2,
        glowColor: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background glow grid lines dynamically
      ctx.strokeStyle = isDarkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)";
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw active network nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor;
        ctx.fill();

        // Connect particles within proximity
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.25;
            ctx.strokeStyle = isDarkMode 
              ? `rgba(0, 212, 255, ${alpha})`
              : `rgba(0, 102, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  const brands = [
    { name: "NVIDIA", icon: "Cpu", style: "border-emerald-500/10 text-emerald-500" },
    { name: "MICROSOFT", icon: "Building", style: "border-blue-500/10 text-blue-500" },
    { name: "AMAZON AWS", icon: "Cloud", style: "border-amber-500/10 text-amber-500" },
    { name: "OPENAI", icon: "Bot", style: "border-purple-500/10 text-purple-500" },
    { name: "VERCEL", icon: "Terminal", style: "border-slate-500/10 text-slate-400" }
  ];

  const scrollDown = () => {
    const nextSection = document.getElementById("about");
    if (nextSection) {
      window.scrollTo({
        top: nextSection.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <section 
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24"
    >
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-5000" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse duration-6000" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 py-12">
        
        {/* Left Copy block Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Elite tag badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border dark:border-blue-500/20 dark:bg-blue-950/20 border-slate-200 bg-blue-50 text-xs font-semibold tracking-wider font-mono text-blue-500 uppercase"
          >
            <LucideIcon name="Sparkles" className="w-3.5 h-3.5 animate-spin duration-3000 text-[#00D4FF]" />
            <span>EXCELLENCE GUARANTEED BY CERTIFIED ARCHITECTS</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase font-sans ${isDarkMode ? "text-white" : "text-slate-900"}`}
          >
            Empowering Businesses Through <span className="bg-gradient-to-r from-blue-500 via-[#00D4FF] to-[#8B5CF6] text-transparent bg-clip-text">AI, Cloud</span> & Digital Innovation
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-slate-400 max-w-xl font-normal leading-relaxed"
          >
            We build intelligent software, secure enterprise infrastructure, and scalable cloud networks that transform businesses worldwide into autonomous machines of scale.
          </motion.p>

          {/* Action Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <button
              onClick={() => {
                const servicesSec = document.getElementById("services");
                if (servicesSec) {
                  window.scrollTo({ top: servicesSec.offsetTop - 80, behavior: "smooth" });
                }
              }}
              className="px-8 py-3.5 text-xs font-bold tracking-widest text-white uppercase bg-gradient-to-r from-blue-600 via-[#0066FF] to-indigo-600 hover:from-blue-500 hover:to-indigo-500 duration-200 rounded-lg shadow-lg shadow-blue-500/10 cursor-pointer flex items-center gap-2 border border-blue-500/40 font-mono"
            >
              <span>GET STARTED</span>
              <LucideIcon name="ChevronRight" className="w-4 h-4" />
            </button>
            <button
              onClick={onConsultationClick}
              className={`px-8 py-3.5 text-xs font-bold tracking-widest uppercase rounded-lg border transition-all duration-200 font-mono flex items-center gap-2 cursor-pointer ${
                isDarkMode 
                  ? "bg-slate-950 text-slate-100 border-slate-800 hover:bg-slate-900 hover:text-white" 
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>SCHEDULE CONSULTATION</span>
              <LucideIcon name="Fingerprint" className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Right Dynamic Interactive Node Network Column */}
        <div className="lg:col-span-5 relative w-full h-[350px] md:h-[450px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-sky-500/5 select-none"
          >
            {/* Real-time network dynamic canvas element */}
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full"
            />
            
            {/* Superimposed holographic glass card centered */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl border backdrop-blur-md max-w-[280px] w-full text-left font-mono pointer-events-none ${
              isDarkMode 
                ? "bg-[#0b0f19]/60 border-slate-800/80 text-white" 
                : "bg-white/60 border-slate-200 text-slate-800"
            }`}>
              <div className="flex justify-between items-center text-[10px] text-slate-400 border-b pb-2 mb-3">
                <span>NEXORA_CORE</span>
                <span className="text-[#00D4FF] animate-pulse">● CORE_ONLINE</span>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2 items-start">
                  <div className="p-1 rounded bg-[#00D4FF]/10 text-[#00D4FF]">
                    <LucideIcon name="Brain" className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans uppercase">Cognitive Array</h4>
                    <p className="text-[9px] text-slate-400">98.2% Auto alignment</p>
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <div className="p-1 rounded bg-[#8B5CF6]/10 text-[#8B5CF6]">
                    <LucideIcon name="Cloud" className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans uppercase">SRE Cluster</h4>
                    <p className="text-[9px] text-slate-400">Zero downtime posture</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trusted By logo section block */}
      <div className={`border-y py-6 md:py-8 select-none transition-colors duration-300 ${isDarkMode ? "bg-slate-950/20 border-white/5" : "bg-slate-50/40 border-slate-200/60"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            RECOGNIZED & TRUSTED BY GLOBAL ENTERPRISES
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5 items-center justify-center">
            {brands.map((brand, bIdx) => (
              <div 
                key={brand.name}
                className={`py-3.5 px-4 rounded-xl border flex items-center justify-center gap-2 group hover:scale-[1.03] transition-all duration-300 pointer-events-none select-none ${
                  isDarkMode 
                    ? "bg-[#0b101c]/45 border-slate-900/60 text-slate-400" 
                    : "bg-white border-slate-150 text-slate-500"
                }`}
              >
                <LucideIcon name={brand.icon} className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider font-mono">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
