import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  stars: number;
  image: string;
  isApproved: boolean;
}

interface TestimonialsViewProps {
  token: string;
}

export default function TestimonialsView({ token }: TestimonialsViewProps) {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("VP of Infrastructure");
  const [formCompany, setFormCompany] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formStars, setFormStars] = useState(5);
  const [formImg, setFormImg] = useState("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100");
  const [formApp, setFormApp] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/testimonials");
      if (res.ok) {
        const data = await res.json();
        const fallbackApproved = (data.testimonials || []).map((t: any) => ({
          ...t,
          isApproved: t.isApproved !== undefined ? t.isApproved : true
        }));
        setItems(fallbackApproved);
      } else {
        // High fidelity fallback values
        setItems([
          {
            id: "t-1",
            name: "Bertram Gilfoyle",
            role: "Chief Systems Officer",
            company: "Pied Piper Systems",
            content: "NEXORA's multi-cluster VPC shielding setup is surprisingly robust. It resolved our server communication latencies with no downtime.",
            stars: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
            isApproved: true
          },
          {
            id: "t-2",
            name: "Erlich Bachman",
            role: "Founder & Incubator Manager",
            company: "Aviato Labs",
            content: "A stellar, world-class dashboard cockpit! My companies are instantly launching SOW metrics inside this system.",
            stars: 5,
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
            isApproved: false
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: TestimonialItem = {
      id: editingItem ? editingItem.id : `test-new-${Math.random().toString(36).substring(2, 6)}`,
      name: formName,
      role: formRole,
      company: formCompany,
      content: formContent,
      stars: Number(formStars),
      image: formImg,
      isApproved: formApp
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

  const toggleApproval = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, isApproved: !i.isApproved } : i));
  };

  const triggerEdit = (t: TestimonialItem) => {
    setEditingItem(t);
    setFormName(t.name);
    setFormRole(t.role);
    setFormCompany(t.company);
    setFormContent(t.content);
    setFormStars(t.stars);
    setFormImg(t.image);
    setFormApp(t.isApproved);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this customer feedback record?")) return;
    setItems(items.filter(i => i.id !== id));
  };

  const resetForm = () => {
    setFormName("");
    setFormCompany("");
    setFormContent("");
    setFormStars(5);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-black font-sans uppercase tracking-widest text-[#00D4FF]">
            NEXORA client feedback governance
          </h4>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
            Audit testimonials, ratings stats, and toggled approval flags for landing portal displays. Feedback entries: {items.length}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            resetForm();
            setIsFormOpen(true);
          }}
          className="px-3.5 py-2 text-[10px] bg-[#0066FF] hover:bg-blue-500 text-white font-mono font-bold rounded-lg uppercase tracking-wide cursor-pointer transition flex items-center gap-1"
        >
          <LucideIcon name="Plus" className="w-3.5 h-3.5" />
          <span>Onboard Testimonial</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase animate-pulse text-slate-500">
          Syncing client testimonials reviews...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-[10px]">
          {items.map((it) => (
            <div
              key={it.id}
              className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/40 hover:border-slate-850 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img
                      referrerPolicy="no-referrer"
                      src={it.image}
                      alt={it.name}
                      className="w-9 h-9 rounded-full object-cover select-none border border-slate-800"
                    />
                    <div>
                      <h5 className="font-sans font-black text-slate-205 text-[11px] leading-tight">{it.name}</h5>
                      <span className="text-[7.5px] text-[#00D4FF] uppercase tracking-wide">{it.role} • {it.company}</span>
                    </div>
                  </div>

                  <div className="flex cursor-pointer" onClick={() => toggleApproval(it.id)}>
                    <span className={`px-1.5 py-0.5 rounded text-[7px] border font-black uppercase flex items-center gap-1 ${
                      it.isApproved ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${it.isApproved ? "bg-emerald-400" : "bg-red-500 animate-pulse"}`} />
                      <span>{it.isApproved ? "Approved" : "Pending Sandbox"}</span>
                    </span>
                  </div>
                </div>

                <p className="text-[9.5px] leading-relaxed text-slate-400 italic">
                  "{it.content}"
                </p>

                {/* Stars */}
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <LucideIcon
                      key={i}
                      name="Star"
                      className={`w-3.5 h-3.5 ${i < it.stars ? "fill-amber-400 mr-0.5 text-amber-400" : "text-slate-600"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/40 flex justify-between items-center">
                <span className="text-slate-600 block text-[7px]">SYS-ID: {it.id}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => triggerEdit(it)}
                    className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400"
                    title="Edit testimonial"
                  >
                    <LucideIcon name="Edit" className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(it.id)}
                    className="p-1 rounded bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white"
                    title="Delete feedback log"
                  >
                    <LucideIcon name="Trash2" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FEEDBACK EDITOR MODAL OVERLAY */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h5 className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider font-sans">
                {editingItem ? "Update Client feedback details" : "Acknowledge client feedback log"}
              </h5>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <LucideIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-3 font-mono text-[10px]">
              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Customer Liaison Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Richard Hendricks"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">Payer Role Profile</label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">Corporate Title Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Initech"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Review Content Quote</label>
                <textarea
                  rows={2.5}
                  required
                  placeholder="Paste direct endorsement context quote..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-450 uppercase tracking-wide">Star Rating Scale</label>
                  <select
                    value={formStars}
                    onChange={(e) => setFormStars(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-white focus:outline-none"
                  >
                    <option value="5">5 Stars (Excellent SRE)</option>
                    <option value="4">4 Stars (Good SOW)</option>
                    <option value="3">3 Stars (Average)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-450 uppercase tracking-wide">Liaison Face Shot URL</label>
                  <input
                    type="text"
                    required
                    value={formImg}
                    onChange={(e) => setFormImg(e.target.value)}
                    className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-1.5 text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 font-mono">
                <span className="uppercase text-[9px] text-[#9CA3AF]">Mark Approved immediately</span>
                <input
                  type="checkbox"
                  checked={formApp}
                  onChange={(e) => setFormApp(e.target.checked)}
                  className="rounded text-[#0066FF] focus:ring-[#0066FF]"
                />
              </div>

              <div className="flex gap-2 pt-1 font-mono">
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
                  {editingItem ? "COMMIT FEEDBACK" : "ONBOARD LOG"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
