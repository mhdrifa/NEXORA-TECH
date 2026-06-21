import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";

interface PortfolioPost {
  id: string;
  title: string;
  category: "web" | "mobile" | "cloud" | "ai" | "enterprise";
  description: string;
  details: string;
  image: string;
  tech: string[];
  metrics: string;
}

interface PortfolioViewProps {
  token: string;
  currentUser: any;
}

export default function PortfolioView({ token, currentUser }: PortfolioViewProps) {
  const [items, setItems] = useState<PortfolioPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioPost | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<PortfolioPost["category"]>("ai");
  const [formDesc, setFormDesc] = useState("");
  const [formDetails, setFormDetails] = useState("");
  const [formImg, setFormImg] = useState("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800");
  const [formTech, setFormTech] = useState("React, Tailwind, Kubernetes");
  const [formMetrics, setFormMetrics] = useState("99.9% SRE Audited uptime");

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/portfolio");
      if (res.ok) {
        const data = await res.json();
        // Fallback or map from public projects
        const publicOnly = (data.projects || []).map((p: any, idx: number) => ({
          id: p.id || `p-${idx}`,
          title: p.name || p.title,
          category: p.category || (idx % 2 === 0 ? "ai" : "cloud"),
          description: p.description,
          details: p.details || "Integrated secure high-performance API gateways with redundant clusters.",
          image: p.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
          tech: p.assignedTeam || ["Express.js", "PostgreSQL", "Docker"],
          metrics: p.metrics || "Reduced cold start by 300ms."
        }));
        setItems(publicOnly);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePortfolio = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: PortfolioPost = {
      id: editingItem ? editingItem.id : `port-new-${Math.random().toString(36).substring(2, 6)}`,
      title: formTitle,
      category: formCategory,
      description: formDesc,
      details: formDetails,
      image: formImg,
      tech: formTech.split(",").map(t => t.trim()).filter(Boolean),
      metrics: formMetrics
    };

    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? payload : i));
    } else {
      setItems([...items, payload]);
    }

    setIsFormOpen(false);
    setEditingItem(null);
    resetForm();
  };

  const triggerEdit = (item: PortfolioPost) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormDesc(item.description);
    setFormDetails(item.details);
    setFormImg(item.image);
    setFormTech(item.tech.join(", "));
    setFormMetrics(item.metrics);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio showcase element?")) return;
    setItems(items.filter(i => i.id !== id));
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDesc("");
    setFormDetails("");
    setFormTech("React, Tailwind, Kubernetes");
    setFormMetrics("99.9% SRE Audited uptime");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-black font-sans uppercase tracking-widest text-[#00D4FF]">
            NEXORA Showcase Portfolio records
          </h4>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
            Administer public case study screenshots, tech categories, and validated project metrics. Showcases: {items.length}
          </p>
        </div>

        {currentUser.role !== "client" && (
          <button
            onClick={() => {
              setEditingItem(null);
              resetForm();
              setIsFormOpen(true);
            }}
            className="px-3.5 py-2 text-[10px] bg-[#0066FF] hover:bg-blue-500 text-white font-mono font-bold rounded-lg uppercase tracking-wide cursor-pointer transition flex items-center gap-1"
          >
            <LucideIcon name="Plus" className="w-3.5 h-3.5" />
            <span>Launch Case Study</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase animate-pulse text-slate-500">
          Syncing public case showcases...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px]">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-2xl bg-slate-900/30 border border-slate-800/40 hover:border-slate-800 transition duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <img
                  referrerPolicy="no-referrer"
                  src={it.image}
                  alt={it.title}
                  className="h-40 w-full object-cover select-none border-b border-slate-850"
                />
                
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="px-1.5 py-0.5 rounded text-[8px] bg-slate-950 font-bold text-[#0066FF] border border-slate-800 uppercase">
                      {it.category}
                    </span>
                    <span className="text-[8px] text-slate-550">SHOW-ID: {it.id}</span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-[11px] font-black font-sans text-white uppercase tracking-tight leading-tight">
                      {it.title}
                    </h5>
                    <p className="text-[9px] text-slate-400 font-mono leading-relaxed">
                      {it.description}
                    </p>
                  </div>

                  {/* Tech specs */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {it.tech.map((t, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-[#111827] text-slate-300 text-[8px] border border-slate-850">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Impact metric */}
                  <div className="p-2 bg-emerald-500/5 rounded border border-emerald-500/20 text-emerald-400 font-bold block text-[8.5px]">
                    Impact Metric: {it.metrics}
                  </div>
                </div>
              </div>

              {currentUser.role !== "client" && (
                <div className="p-4 pt-0 border-t border-slate-850 flex justify-end gap-1.5">
                  <button
                    onClick={() => triggerEdit(it)}
                    className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white"
                    title="Edit Case Showcase"
                  >
                    <LucideIcon name="Edit" className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(it.id)}
                    className="p-1 rounded bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-white"
                    title="Delete Showcase Item"
                  >
                    <LucideIcon name="Trash2" className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PORTFOLIO EDITOR MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h5 className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider font-sans">
                {editingItem ? "Adjust Case Study specifications" : "Publish Public Showcase Case Study"}
              </h5>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <LucideIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePortfolio} className="space-y-3 font-mono text-[10px]">
              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Showcase Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Initech LLM Rerouting Pipelines"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-650 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Tech Category Category</label>
                <select
                  value={formCategory}
                  onChange={(e: any) => setFormCategory(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="web">Web Architectures</option>
                  <option value="mobile">Mobile Systems</option>
                  <option value="cloud">Cloud DevOps</option>
                  <option value="ai">AI Solutions</option>
                  <option value="enterprise">Enterprise SRE</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">One Sentence Showcase Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scaled transformer embeddings from 1B queries to 10B..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Screenshot Mock Image URL</label>
                <input
                  type="text"
                  required
                  value={formImg}
                  onChange={(e) => setFormImg(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Showcase Technologies used (comma separated)</label>
                <input
                  type="text"
                  value={formTech}
                  onChange={(e) => setFormTech(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Showcase Impact Metric (e.g. Reduced SRE cold starts by 30%)</label>
                <input
                  type="text"
                  required
                  value={formMetrics}
                  onChange={(e) => setFormMetrics(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="w-1/2 py-2 border border-slate-800 text-slate-400 uppercase font-bold rounded cursor-pointer transition"
                >
                  ABORT
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#0066FF] hover:bg-blue-500 text-white font-bold uppercase rounded cursor-pointer transition"
                >
                  {editingItem ? "SAVE UPDATE" : "PUBLISH SHOWCASE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
