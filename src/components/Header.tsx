import React, { useState, useEffect } from "react";
import LucideIcon from "./LucideIcon";

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onBookClick: () => void;
  onPortalClick?: () => void;
}

export default function Header({ isDarkMode, setIsDarkMode, onBookClick, onPortalClick }: HeaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const menuItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "solutions", label: "Solutions" },
    { id: "portfolio", label: "Portfolio" },
    { id: "case-studies", label: "Case Studies" },
    { id: "technologies", label: "Technologies" },
    { id: "blog", label: "Blog" },
    { id: "careers", label: "Careers" },
    { id: "contact", label: "Contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      } else {
        setScrollProgress(0);
      }

      // Check if scrolled past threshold
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Detect active anchor section
      const scrollPosition = window.scrollY + 120; // offset for header
      for (const item of menuItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(targetId);
    }
  };

  return (
    <>
      {/* Dynamic Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-gradient-to-r from-blue-500 via-[#00D4FF] to-accent bg-size-200 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <header 
        id="nexus-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-sans ${
          isScrolled 
            ? isDarkMode 
              ? "bg-slate-950/80 border-b border-white/5 backdrop-blur-xl shadow-lg shadow-black/20 py-3.5"
              : "bg-white/85 border-b border-slate-200/80 backdrop-blur-xl shadow-md py-3.5"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand */}
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, "home")}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 via-sky-400 to-[#8B5CF6] p-0.5 shadow-lg shadow-blue-500/10">
              <div className="w-full h-full rounded-md bg-[#050816] flex items-center justify-center text-white font-black text-lg select-none">
                N
              </div>
            </div>
            <span className="font-sans font-black tracking-widest text-[#00D4FF] text-lg lg:text-xl transition-all group-hover:text-white flex items-center">
              NEXORA<span className={`font-light ml-1 font-mono text-xs tracking-normal ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>TECH</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Desktop menu">
            {menuItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all uppercase duration-200 ${
                    active
                      ? isDarkMode
                        ? "bg-blue-600/10 text-[#00D4FF] border border-blue-500/20 shadow-sm"
                        : "bg-blue-50 text-blue-600 border border-blue-200/50"
                      : isDarkMode
                        ? "text-slate-350 hover:text-white hover:bg-slate-900/40"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Controls Row */}
          <div className="flex items-center gap-3">
            
            {/* Dark & Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isDarkMode 
                  ? "bg-slate-900/60 border-slate-800 text-yellow-400 hover:text-yellow-300 hover:bg-slate-800" 
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              }`}
              aria-label="Toggle theme color mode"
            >
              <LucideIcon name={isDarkMode ? "Sun" : "Moon"} className="w-4 h-4" />
            </button>

            {/* Enterprise Portal Gate */}
            {onPortalClick && (
              <button
                onClick={onPortalClick}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold tracking-wider text-white uppercase bg-gradient-to-r from-[#00D4FF]/20 to-blue-600/30 hover:from-[#00D4FF]/30 hover:to-blue-600/40 transition-all rounded-full border border-[#00D4FF]/30 shadow-md shadow-[#00D4FF]/5 cursor-pointer"
              >
                <LucideIcon name="Shield" className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>Enterprise Portal</span>
              </button>
            )}

            {/* Book Consultation (Modal trigger) */}
            <button
              onClick={onBookClick}
              className="hidden sm:flex px-5 py-2 text-xs font-semibold tracking-wider text-white uppercase bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all rounded-full border border-blue-500/20 shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Consultation
            </button>

            {/* Mobile Menu Toggle button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg border transition-colors cursor-pointer ${
                isDarkMode 
                  ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white" 
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
              aria-label="Toggle navigation map"
            >
              <LucideIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[60px] p-4 z-35 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className={`p-4 rounded-xl border shadow-xl ${
              isDarkMode 
                ? "bg-slate-950/98 border-slate-800 text-white" 
                : "bg-white/98 border-slate-200 text-slate-800"
            }`}>
              <div className="flex flex-col gap-1">
                {menuItems.map((item) => {
                  const active = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleNavClick(e, item.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${
                        active
                          ? isDarkMode
                            ? "bg-blue-600/10 text-[#00D4FF]"
                            : "bg-blue-50 text-blue-600"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>

              {/* Consultation trigger inside Mobile drawer */}
              <div className="mt-4 pt-4 border-t dark:border-slate-800 border-slate-100 space-y-2">
                {onPortalClick && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onPortalClick();
                    }}
                    className="w-full py-2.5 text-center text-xs font-mono font-bold tracking-widest text-[#00D4FF] uppercase bg-slate-900/40 hover:bg-slate-900/60 transition-all rounded-lg border border-[#00D4FF]/30 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LucideIcon name="Shield" className="w-4 h-4 text-[#00D4FF]" />
                    <span>ENTERPRISE PORTAL</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onBookClick();
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold tracking-widest text-slate-100 uppercase bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all rounded-lg border border-blue-500/35 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LucideIcon name="Rocket" className="w-4 h-4" />
                  <span>BOOK CONSULTATION</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
