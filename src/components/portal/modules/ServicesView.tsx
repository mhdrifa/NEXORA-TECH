import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";

interface ServiceRecord {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  iconName: string;
}

interface ServicesViewProps {
  token: string;
  currentUser: any;
}

export default function ServicesView({ token, currentUser }: ServicesViewProps) {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formLongDesc, setFormLongDesc] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formIcon, setFormIcon] = useState("Cpu");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      // Fetch public/private service listings
      const res = await fetch("/api/cms/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formTitle,
      description: formDesc,
      longDescription: formLongDesc,
      features: formFeatures.split(",").map(f => f.trim()).filter(Boolean),
      iconName: formIcon
    };

    if (editingService) {
      // UPDATE
      try {
        await fetch(`/api/services/${editingService.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } catch (err) {}
      setServices(services.map(s => s.id === editingService.id ? { ...s, ...payload } : s));
    } else {
      // CREATE
      try {
        await fetch("/api/cms/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } catch (err) {}
      
      const mock: ServiceRecord = {
        id: `srv-${Math.random().toString(36).substring(2, 6)}`,
        ...payload
      };
      setServices([...services, mock]);
    }

    setIsFormOpen(false);
    setEditingService(null);
    resetForm();
  };

  const triggerEdit = (s: ServiceRecord) => {
    setEditingService(s);
    setFormTitle(s.title);
    setFormDesc(s.description);
    setFormLongDesc(s.longDescription);
    setFormFeatures(s.features.join(", "));
    setFormIcon(s.iconName);
    setIsFormOpen(true);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to prune this catalog solution?")) return;
    try {
      await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
    } catch (e) {}

    setServices(services.filter(s => s.id !== id));
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDesc("");
    setFormLongDesc("");
    setFormFeatures("");
    setFormIcon("Cpu");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-black font-sans uppercase tracking-widest text-[#00D4FF]">
            NEXORA solutions service catalog
          </h4>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
            Maintain active capabilities listed on our landing pages. Total offerings: {services.length}
          </p>
        </div>

        {currentUser.role !== "client" && (
          <button
            onClick={() => {
              setEditingService(null);
              resetForm();
              setIsFormOpen(true);
            }}
            className="px-3.5 py-2 text-[10px] bg-[#0066FF] hover:bg-blue-500 font-mono font-bold text-white rounded-lg uppercase tracking-wide cursor-pointer transition flex items-center gap-1"
          >
            <LucideIcon name="Plus" className="w-3.5 h-3.5" />
            <span>Launch Service</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase animate-pulse text-slate-500">
          Syncing portal catalog listings...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px]">
          {services.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/40 hover:border-slate-800 transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="p-2.5 rounded-xl bg-slate-950 text-[#00D4FF] border border-slate-850">
                    <LucideIcon name={s.iconName || "Cpu"} className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-600 uppercase">SYS-ID: {s.id}</span>
                </div>

                <div className="space-y-1">
                  <h5 className="text-xs font-black font-sans text-slate-250 uppercase tracking-tight">
                    {s.title}
                  </h5>
                  <p className="text-[9px] text-slate-400 leading-relaxed font-mono">
                    {s.description}
                  </p>
                </div>

                <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-[8px] text-slate-500 font-black uppercase">Core deliverable parameters</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {s.features.map((f, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 text-[8px] border border-slate-850">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {currentUser.role !== "client" && (
                <div className="mt-5 pt-3 border-t border-slate-800/40 flex justify-end gap-1.5">
                  <button
                    onClick={() => triggerEdit(s)}
                    className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white"
                    title="Edit Service"
                  >
                    <LucideIcon name="Edit" className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(s.id)}
                    className="p-1 rounded bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-white"
                    title="Delete Catalog Item"
                  >
                    <LucideIcon name="Trash2" className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CATALOG FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h5 className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
                {editingService ? "Update Catalog Solution" : "Launch Catalog Solution"}
              </h5>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <LucideIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3 font-mono text-[10px]">
              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Service Title Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cybersecurity Vulnerability Shielding"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-650 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Overview Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Production grade, automated perimeter penetration audits."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Detailed description</label>
                <textarea
                  rows={2.5}
                  placeholder="Describe pipeline constraints, cloud environments, technical scopes..."
                  value={formLongDesc}
                  onChange={(e) => setFormLongDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Core features deliverables (Comma list)</label>
                <input
                  type="text"
                  placeholder="e.g. Penetration Check, SSL Audits, Threat Detection Matrix"
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[#9CA3AF] uppercase tracking-wide">Lucide Icon Selection</label>
                <select
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="Cpu">Cpu Shield</option>
                  <option value="ShieldAlert">Shield Secure</option>
                  <option value="Cloud">Cloud Cluster</option>
                  <option value="Database">Database Cluster</option>
                  <option value="Network">Secure Network</option>
                  <option value="Terminal">DevOps Terminal</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="w-1/2 py-2 border border-slate-800 text-slate-400 hover:text-white uppercase font-bold rounded cursor-pointer transition"
                >
                  DISCARD
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#0066FF] hover:bg-blue-500 text-white font-bold uppercase rounded cursor-pointer transition"
                >
                  {editingService ? "COMMIT SAVES" : "LAUNCH Solutions"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
