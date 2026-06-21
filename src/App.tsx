import React, { useState, useEffect } from "react";
import { SEO } from "./components/SEO";
import { OrganizationStructuredData } from "./components/StructuredData";
import Header from "./components/Header";
import PortalView from "./components/portal/PortalView";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import Solutions from "./components/Solutions";
import TechStack from "./components/TechStack";
import Portfolio from "./components/Portfolio";
import CaseStudies from "./components/CaseStudies";
import Testimonials from "./components/Testimonials";
import Process from "./components/Process";
import Team from "./components/Team";
import Blog from "./components/Blog";
import Careers from "./components/Careers";
import Contact from "./components/Contact";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import ConsultationModal from "./components/ConsultationModal";
import LucideIcon from "./components/LucideIcon";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [view, setView] = useState<"public" | "portal">("public");

  // Trigger loading screen resolution
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  // Monitor scroll for back-to-top visibility
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (initialLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050816] text-white select-none">
        {/* Glowing holographic radar loader */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full border border-blue-500/20 blur-sm scale-110" />
          <div className="w-16 h-16 rounded-full border-2 border-[#00D4FF]/30 border-t-[#00D4FF] animate-spin" />
          <div className="absolute text-white font-black text-xl font-mono">
            N
          </div>
        </div>

        {/* Loading text messages */}
        <h2 className="text-sm font-bold tracking-widest font-mono text-[#00D4FF] uppercase animate-pulse">
          INITIALIZING NEXORA PORTAL...
        </h2>
        <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-wide">
          Securing credential nodes / SLA verified
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans antialiased overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? "bg-[#050816] text-white" 
        : "bg-white text-slate-800"
    }`}>
      
      <SEO 
        title="Software Engineering & Cloud Architecture"
        description="NEXORA TECH delivers enterprise-grade software development, cloud infrastructure, and AI integration services for modern businesses." 
      />
      <OrganizationStructuredData />

      {/* Sticky global navigation + consultation managers */}
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        onBookClick={() => setIsConsultationOpen(true)}
        onPortalClick={() => setView(view === "public" ? "portal" : "public")}
      />

      {view === "portal" ? (
        <main id="root-portal" className="pt-28 pb-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <PortalView isDarkMode={isDarkMode} onClose={() => setView("public")} />
          </div>
        </main>
      ) : (
        <>
          <main id="root-portal">
            {/* Section 1: Hero Segment */}
            <Hero 
              isDarkMode={isDarkMode} 
              onConsultationClick={() => setIsConsultationOpen(true)} 
            />

            {/* Section 2: Animated Stats counters */}
            <Stats isDarkMode={isDarkMode} />

            {/* Section 3: Nine Core Services */}
            <Services 
              isDarkMode={isDarkMode} 
              onConsultationClick={() => setIsConsultationOpen(true)} 
            />

            {/* Section 4: Vertical Timeline Advantages */}
            <WhyChooseUs isDarkMode={isDarkMode} />

            {/* Section 5: Interactive Solutions Switcher */}
            <Solutions 
              isDarkMode={isDarkMode} 
              onConsultationClick={() => setIsConsultationOpen(true)} 
            />

            {/* Section 6: Standardized Tech Stack proficiencies */}
            <TechStack isDarkMode={isDarkMode} />

            {/* Section 7: Six Core representative Portfolio alignments */}
            <Portfolio isDarkMode={isDarkMode} />

            {/* Section 8: Challenge Solution Case Studies */}
            <CaseStudies isDarkMode={isDarkMode} />

            {/* Section 9: Testimonials Carousels */}
            <Testimonials isDarkMode={isDarkMode} />

            {/* Section 10: Stepper process SLA cycle */}
            <Process isDarkMode={isDarkMode} />

            {/* Section 11: Team Specialist summaries */}
            <Team isDarkMode={isDarkMode} />

            {/* Section 12: Research Journals & Insights tabs */}
            <Blog isDarkMode={isDarkMode} />

            {/* Section 13: Hiring positions recruits */}
            <Careers isDarkMode={isDarkMode} />

            {/* Section 14: Secure Map & Coordinate contact panel */}
            <Contact isDarkMode={isDarkMode} />

            {/* Section 15: Glowing Call To Action */}
            <CTA 
              isDarkMode={isDarkMode} 
              onConsultationClick={() => setIsConsultationOpen(true)} 
            />
          </main>

          {/* Global general base footer */}
          <Footer 
            isDarkMode={isDarkMode} 
            onConsultationClick={() => setIsConsultationOpen(true)} 
          />
        </>
      )}

      {/* Floating back-to-top trigger button */}
      {showScrollTop && view === "public" && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full border transition-all shadow-xl hover:scale-105 duration-200 cursor-pointer animate-in fade-in slide-in-from-bottom-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-blue-500/30 text-white shadow-blue-500/10"
          aria-label="Scroll back up to the top of the page"
        >
          <LucideIcon name="ArrowUp" className="w-5 h-5" />
        </button>
      )}

      {/* Book Consultation Modal overlay */}
      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
