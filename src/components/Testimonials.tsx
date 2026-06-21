import React, { useState, useEffect } from "react";
import { testimonialsData } from "../data";
import LucideIcon from "./LucideIcon";

interface TestimonialsProps {
  isDarkMode: boolean;
}

export default function Testimonials({ isDarkMode }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Auto slide every 5 seconds
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const activeTestimonial = testimonialsData[activeIndex];

  return (
    <section 
      id="testimonials" 
      className={`py-16 md:py-24 transition-colors duration-300 border-b relative ${
        isDarkMode 
          ? "bg-[#050816]" 
          : "bg-white"
      }`}
    >
      <div className="absolute top-1/4 left-[5%] w-[320px] h-[320px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold font-mono tracking-widest text-[#00D4FF] uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            // CLIENT SENTIMENTS
          </span>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tight uppercase mt-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            REVIEWS FROM LEADING CORES
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            Read certified summaries of strategic milestones, technical integrations, and operating experiences recorded by global directors.
          </p>
        </div>

        {/* Carousel Holder */}
        <div className="max-w-4xl mx-auto relative px-4 md:px-12">
          
          {/* Main Card */}
          <div className={`p-6 md:p-10 rounded-3xl border relative transition-all duration-300 ${
            isDarkMode 
              ? "bg-[#0b101c]/60 border-slate-900 shadow-xl shadow-black/20" 
              : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              
              {/* Photo Avatar */}
              <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-blue-500/20 shadow-md">
                <img 
                  src={activeTestimonial.image} 
                  alt={activeTestimonial.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.95]"
                />
              </div>

              {/* Text content side */}
              <div className="flex-grow space-y-4 text-center md:text-left">
                
                {/* Star Ratings filled */}
                <div className="flex items-center justify-center md:justify-start gap-1">
                  {[...Array(activeTestimonial.stars)].map((_, sIdx) => (
                    <span key={sIdx}>
                      <LucideIcon name="Star" className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </span>
                  ))}
                </div>

                {/* Content quote */}
                <blockquote className={`text-sm md:text-base italic leading-relaxed ${isDarkMode ? "text-slate-250" : "text-slate-700"}`}>
                  "{activeTestimonial.content}"
                </blockquote>

                {/* Identity signature footer */}
                <div>
                  <h4 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {activeTestimonial.name}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {activeTestimonial.role} — <span className="text-[#00D4FF] font-semibold">{activeTestimonial.company}</span>
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* Nav buttons floating left/right */}
          <div className="flex justify-center md:justify-between items-center gap-4 mt-8 md:absolute md:inset-y-0 md:-left-4 md:-right-4 md:mt-0 md:pointer-events-none">
            
            {/* Prev */}
            <button
              onClick={handlePrev}
              className={`p-3 rounded-full border transition-all md:pointer-events-auto cursor-pointer ${
                isDarkMode 
                  ? "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 shadow-md" 
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-sm"
              }`}
              aria-label="Previous client review"
            >
              <LucideIcon name="ChevronLeft" className="w-5 h-5" />
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              className={`p-3 rounded-full border transition-all md:pointer-events-auto cursor-pointer ${
                isDarkMode 
                  ? "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 shadow-md" 
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-sm"
              }`}
              aria-label="Next client review"
            >
              <LucideIcon name="ChevronRight" className="w-5 h-5" />
            </button>

          </div>

          {/* Dots Indicator list below */}
          <div className="flex justify-center gap-1.5 mt-6">
            {testimonialsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-150 cursor-pointer ${
                  activeIndex === idx ? "bg-[#00D4FF] px-2.5" : "bg-slate-600/50"
                }`}
                aria-label={`Go to slider page ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
