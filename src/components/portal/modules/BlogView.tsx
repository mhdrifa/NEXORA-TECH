import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";

interface CorporateBrief {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: "AI News" | "Cloud Engineering" | "Cybersecurity" | "Insights" | "General";
  tags?: string[];
  featuredImage: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  publishedAt?: string;
  authorId?: string;
}

interface BlogViewProps {
  token: string;
}

export default function BlogView({ token }: BlogViewProps) {
  const [posts, setPosts] = useState<CorporateBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CorporateBrief | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState<CorporateBrief["category"]>("AI News");
  const [formTags, setFormTags] = useState("AI, Tech, Cloud");
  const [formImg, setFormImg] = useState("https://images.unsplash.com/photo-1518770660439-4636190af475?w=800");
  const [formSeoTitle, setFormSeoTitle] = useState("");
  const [formSeoDesc, setFormSeoDesc] = useState("");
  const [formPublished, setFormPublished] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formTitle,
      summary: formSummary,
      content: formContent,
      category: formCategory,
      tags: formTags.split(",").map(t => t.trim()),
      featuredImage: formImg,
      seoTitle: formSeoTitle || formTitle,
      seoDescription: formSeoDesc || formSummary,
      isPublished: formPublished
    };

    if (editingPost) {
      try {
        const res = await fetch(`/api/blog/${editingPost.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          fetchPosts();
        } else {
          // Local fallback
          setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...payload } : p));
        }
      } catch (err) {
        setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...payload } : p));
      }
    } else {
      try {
        const res = await fetch("/api/cms/blog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          fetchPosts();
        } else {
          const mock: CorporateBrief = {
            id: `post-new-${Math.random().toString(36).substring(2, 6)}`,
            slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            publishedAt: new Date().toISOString(),
            ...payload
          };
          setPosts([...posts, mock]);
        }
      } catch (err) {
        const mock: CorporateBrief = {
          id: `post-new-${Math.random().toString(36).substring(2, 6)}`,
          slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          publishedAt: new Date().toISOString(),
          ...payload
        };
        setPosts([...posts, mock]);
      }
    }

    setIsFormOpen(false);
    setEditingPost(null);
    resetForm();
  };

  const triggerEdit = (p: CorporateBrief) => {
    setEditingPost(p);
    setFormTitle(p.title);
    setFormSummary(p.summary);
    setFormContent(p.content);
    setFormCategory(p.category);
    setFormTags(p.tags ? p.tags.join(", ") : "");
    setFormImg(p.featuredImage);
    setFormSeoTitle(p.seoTitle || "");
    setFormSeoDesc(p.seoDescription || "");
    setFormPublished(p.isPublished);
    setIsFormOpen(true);
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete and wipe this article node from corporate public index?")) return;
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchPosts();
      } else {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (e) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const resetForm = () => {
    setFormTitle("");
    setFormSummary("");
    setFormContent("");
    setFormTags("AI, Tech, Cloud");
    setFormSeoTitle("");
    setFormSeoDesc("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Title with Statistics */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-black font-sans uppercase tracking-widest text-[#00D4FF]">
            NEXORA technical briefs & briefs
          </h4>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
            Administer technical newsletters, SEO meta headers, and system blog posts. Live items: {posts.length}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPost(null);
            resetForm();
            setIsFormOpen(true);
          }}
          className="px-3.5 py-2 text-[10px] bg-[#0066FF] hover:bg-blue-500 font-mono font-bold text-white rounded-lg uppercase tracking-wide cursor-pointer transition flex items-center gap-1"
        >
          <LucideIcon name="PenTool" className="w-3.5 h-3.5" />
          <span>Write Technical Brief</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase animate-pulse text-slate-500">
          Syncing media brief databases...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px]">
          {posts.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-slate-900/30 border border-slate-800/40 hover:border-slate-800 transition duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-40 w-full overflow-hidden relative border-b border-slate-850">
                  <img
                    referrerPolicy="no-referrer"
                    src={p.featuredImage}
                    alt={p.title}
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[8px] font-bold bg-[#111827] text-cyan-400 border border-slate-800">
                    {p.category}
                  </div>
                  <div className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[8px] font-bold border ${
                    p.isPublished ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-slate-800 text-slate-400"
                  }`}>
                    {p.isPublished ? "PUBLISHED" : "DRAFT"}
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <div className="space-y-1">
                    <span className="text-[8px] text-slate-550 block">SLUG: /{p.slug}</span>
                    <h5 className="text-[11px] font-black font-sans leading-tight text-white uppercase tracking-tight">
                      {p.title}
                    </h5>
                    <p className="text-[9px] text-slate-400 font-mono leading-relaxed max-h-16 overflow-hidden">
                      {p.summary}
                    </p>
                  </div>

                  <div className="space-y-1 bg-slate-950/40 p-2 rounded-lg border border-slate-850">
                    <span className="text-[7.5px] text-indigo-400 font-bold block uppercase">Google Search Preview</span>
                    <span className="text-[9px] font-sans font-bold text-blue-400 hover:underline block truncate">
                      {p.seoTitle || p.title}
                    </span>
                    <p className="text-[8px] text-slate-500 font-sans leading-relaxed truncate">
                      {p.seoDescription || p.summary}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-850 flex justify-between items-center text-[8.5px]">
                <span className="text-slate-500 uppercase">{p.publishedAt ? p.publishedAt.split("T")[0] : "No date"}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => triggerEdit(p)}
                    className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-330 hover:text-white"
                    title="Edit article specs"
                  >
                    <LucideIcon name="Edit" className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(p.id)}
                    className="p-1 rounded bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white"
                    title="Delete Post"
                  >
                    <LucideIcon name="Trash2" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ARTICLE EDITOR MODAL OVERLAY */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h5 className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider font-sans">
                {editingPost ? "Update Corporate Article brief" : "Draft New Technical Brief"}
              </h5>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <LucideIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-3 font-mono text-[10px]">
              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Article Title Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Gen LLMs for Kubernetes DevOps Orchestration"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Category Category</label>
                <select
                  value={formCategory}
                  onChange={(e: any) => setFormCategory(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="AI News">AI News</option>
                  <option value="Cloud Engineering">Cloud Engineering</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Insights">Corporate Insights</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Summary (Landing Description)</label>
                <input
                  type="text"
                  required
                  placeholder="A brief 1-sentence abstract of the brief content..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Rich Text Content details (Markdown format supported)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write the newsletter context core details here..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              {/* SEO PREVIEW BLOCK SEGMENT */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                <span className="text-[8px] text-indigo-400 font-bold block uppercase">Google SEO Tuning Variables</span>
                
                <div className="space-y-1 text-[8px]">
                  <label className="block text-slate-450 uppercase">SEO Title Override</label>
                  <input
                    type="text"
                    placeholder="Auto falls back to title if vacant"
                    value={formSeoTitle}
                    onChange={(e) => setFormSeoTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 text-[8px]">
                  <label className="block text-slate-450 uppercase">SEO Description Override</label>
                  <input
                    type="text"
                    placeholder="Auto falls back to summary if vacant"
                    value={formSeoDesc}
                    onChange={(e) => setFormSeoDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                <span className="uppercase text-[9px] text-[#9CA3AF]">Publish immediately</span>
                <input
                  type="checkbox"
                  checked={formPublished}
                  onChange={(e) => setFormPublished(e.target.checked)}
                  className="rounded text-[#0066FF] focus:ring-[#0066FF]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="w-1/2 py-2 border border-slate-800 text-slate-400 uppercase font-bold rounded cursor-pointer transition"
                >
                  DISCARD
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#0066FF] hover:bg-blue-500 text-white font-bold uppercase rounded cursor-pointer transition"
                >
                  {editingPost ? "COMMIT OVERWRITES" : "PUBLISH POST"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
