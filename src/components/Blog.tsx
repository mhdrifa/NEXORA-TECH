import React, { useState } from "react";
import { blogPosts } from "../data";
import { BlogPost } from "../types";
import LucideIcon from "./LucideIcon";

interface BlogProps {
  isDarkMode: boolean;
}

export default function Blog({ isDarkMode }: BlogProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  const categories = [
    { id: "all", label: "All Insights" },
    { id: "AI News", label: "AI News" },
    { id: "Cloud Engineering", label: "Cloud Engineering" },
    { id: "Cybersecurity", label: "Cybersecurity" },
    { id: "Insights", label: "Technology Insights" }
  ];

  const filteredPosts = activeTab === "all"
    ? blogPosts
    : blogPosts.filter((post) => post.category === activeTab);

  return (
    <section 
      id="blog" 
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
              // ADVISORY & PUBLICATIONS
            </span>
            <h2 className={`text-3xl md:text-5xl font-black tracking-tight uppercase mt-4 leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              NEXORA RESEARCH BULLETIN
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-sm text-slate-400 leading-relaxed">
              We actively publish research on multi-tenant cloud mesh performance, neural transformer parameters, and defensive threat vectors. Explore papers filtered below.
            </p>
          </div>
        </div>

        {/* Categories Tab selector Row */}
        <div className="flex flex-wrap items-center justify-start gap-1.5 mb-10 border-b dark:border-slate-800 border-slate-200 pb-3">
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider duration-150 rounded-lg cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : isDarkMode
                      ? "text-slate-450 hover:text-white hover:bg-slate-905"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Blog Post List Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPosts.map((post) => {
            return (
              <div 
                key={post.id}
                className={`rounded-2xl border overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                  isDarkMode 
                    ? "bg-[#0b101c]/45 border-slate-900 shadow-black/20" 
                    : "bg-white border-slate-200 hover:border-slate-350"
                }`}
              >
                <div>
                  {/* Photo Frame */}
                  <div className="h-40 w-full overflow-hidden relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-[0.8]"
                    />
                    <span className="absolute bottom-3 left-3 text-[8px] font-mono font-bold uppercase tracking-wider bg-slate-950/80 text-white border border-slate-800 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 text-left">
                    <span className="text-[9px] font-mono text-slate-500">{post.publishedAt} — {post.readTime}</span>
                    <h3 className={`text-xs md:text-sm font-black uppercase tracking-tight leading-snug duration-150 ${
                      isDarkMode ? "text-white group-hover:text-[#00D4FF]" : "text-slate-900 group-hover:text-blue-600"
                    }`}>
                      {post.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                </div>

                {/* Footer read trigger */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => setReadingPost(post)}
                    className="text-[10px] font-bold font-mono tracking-widest uppercase text-[#00D4FF] hover:text-white duration-150 pt-2 border-t dark:border-slate-900 border-slate-100 flex items-center gap-1 group/btn cursor-pointer w-full"
                  >
                    <span>READ FULL PAPER</span>
                    <LucideIcon name="ChevronRight" className="w-3.5 h-3.5 translate-x-0 group-hover/btn:translate-x-1 duration-150" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Expanded Article reading overlay pane */}
      {readingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setReadingPost(null)}
          />

          <div className={`relative w-full max-w-2xl rounded-2xl border p-6 md:p-8 overflow-hidden z-10 ${
            isDarkMode 
              ? "bg-[#0b0f19] border-slate-800 text-white" 
              : "bg-white border-slate-200 text-slate-800"
          } shadow-2xl`}>
            
            <button 
              onClick={() => setReadingPost(null)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
              }`}
              aria-label="Close dialog"
            >
              <LucideIcon name="X" className="w-5 h-5" />
            </button>

            {/* Info tags and metadata */}
            <div className="flex flex-wrap items-center gap-3 text-slate-500 font-mono text-[10px] mb-4">
              <span className="text-white bg-blue-600 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[8px]">
                {readingPost.category}
              </span>
              <span>{readingPost.publishedAt}</span>
              <span>•</span>
              <span>{readingPost.readTime}</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4 leading-snug">
              {readingPost.title}
            </h3>

            {/* Banner visual */}
            <div className="h-52 rounded-xl overflow-hidden mb-6">
              <img 
                src={readingPost.image} 
                alt={readingPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.75]"
              />
            </div>

            {/* Blog body markdown simulation text */}
            <div className="space-y-4 mb-8 text-left leading-relaxed max-h-[160px] overflow-y-auto p-1.5 dark:bg-slate-950/80 rounded border dark:border-slate-900 border-slate-100">
              <p className="text-xs md:text-sm text-slate-350">
                {readingPost.summary}
              </p>
              <p className="text-xs md:text-sm text-slate-400 font-sans">
                {readingPost.content}
              </p>
              <p className="text-xs text-slate-500 font-sans italic border-t dark:border-slate-900 border-slate-100 pt-3">
                Disclaimer: The opinions, standards, and metrics outlined in this analytical overview represent the active, audited methodologies validated in current Nexora Tech projects.
              </p>
            </div>

            {/* Author layout block */}
            <div className="flex items-center gap-3.5 border-t dark:border-slate-900 border-slate-100 pt-5 mb-6 text-left">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-[#00D4FF] flex items-center justify-center border border-blue-500/20 font-black font-sans select-none text-sm">
                {readingPost.author.name[0]}
              </div>
              <div className="leading-tight">
                <h4 className="text-xs font-bold uppercase">{readingPost.author.name}</h4>
                <p className="text-[10px] font-mono text-slate-500">{readingPost.author.role}</p>
              </div>
            </div>

            {/* Actions button */}
            <button
              onClick={() => setReadingPost(null)}
              className={`w-full py-3 text-xs font-bold tracking-widest uppercase rounded-lg border transition-all font-mono cursor-pointer ${
                isDarkMode ? "bg-slate-950 text-slate-400 border-slate-800 hover:text-white" : "bg-slate-100 text-slate-755 border-slate-205 hover:bg-slate-200"
              }`}
            >
              CLOSE READER
            </button>

          </div>
        </div>
      )}
    </section>
  );
}
