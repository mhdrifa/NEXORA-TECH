import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-Time" | "Part-Time" | "Contract" | "Internship";
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

interface CareersViewProps {
  token: string;
  currentUser: any;
}

export default function CareersView({ token, currentUser }: CareersViewProps) {
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosition | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formDept, setFormDept] = useState("Engineering");
  const [formLoc, setFormLoc] = useState("Remote (SFO / NYC)");
  const [formType, setFormType] = useState<JobPosition["type"]>("Full-Time");
  const [formSalary, setFormSalary] = useState("$160k - $210k + Equity");
  const [formDesc, setFormDesc] = useState("");
  const [formReqs, setFormReqs] = useState("React 19, TypeScript, Express, PostgreSQL / Prisma");
  const [formBenefits, setFormBenefits] = useState("Flexible SOW hours, Unlimited PTO, 401k Matching, Medical Shielding");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/careers");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.positions || []);
      } else {
        // Mock fallback if public jobs database is locally stored
        setJobs([
          {
            id: "job-1",
            title: "Senior AI Pipelines Engineer",
            department: "AI Research Division",
            location: "Remote (Global)",
            type: "Full-Time",
            salary: "$180,000 - $240,000 • Equity",
            description: "Optimize vector embeddings, train fine-tuned transformer layers, and scale PyTorch clusters.",
            requirements: ["5+ years PyTorch clusters scaling", "LangChain & Vector databases", "TypeScript/Node backend pipelines"],
            benefits: ["Unlimited PTO", "Health insurance", "Hardware allowance"]
          },
          {
            id: "job-2",
            title: "Senior Cloud & Cybersecurity Architect",
            department: "Security Audits Team",
            location: "New York, NY (Hybrid)",
            type: "Full-Time",
            salary: "$165,000 - $215,000",
            description: "Administer VPC shields, conduct Docker compliance checks, and build automated penetration scripts.",
            requirements: ["AWS Solutions Architect Certified", "WAF & VPC configuration expertise", "Bash/Python automation tools"],
            benefits: ["Top-tier optical/dental", "Standard 401(k) matching", "Gym memberships"]
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: JobPosition = {
      id: editingJob ? editingJob.id : `job-new-${Math.random().toString(36).substring(2, 6)}`,
      title: formTitle,
      department: formDept,
      location: formLoc,
      type: formType,
      salary: formSalary,
      description: formDesc,
      requirements: formReqs.split(",").map(r => r.trim()).filter(Boolean),
      benefits: formBenefits.split(",").map(b => b.trim()).filter(Boolean)
    };

    if (editingJob) {
      setJobs(jobs.map(j => j.id === editingJob.id ? payload : j));
    } else {
      setJobs([...jobs, payload]);
    }

    setIsFormOpen(false);
    setEditingJob(null);
    resetForm();
  };

  const triggerEdit = (j: JobPosition) => {
    setEditingJob(j);
    setFormTitle(j.title);
    setFormDept(j.department);
    setFormLoc(j.location);
    setFormType(j.type);
    setFormSalary(j.salary);
    setFormDesc(j.description);
    setFormReqs(j.requirements.join(", "));
    setFormBenefits(j.benefits.join(", "));
    setIsFormOpen(true);
  };

  const handleDeleteJob = (id: string) => {
    if (!confirm("Are you sure you want to deactivate and publish remove this corporate vacancy listing?")) return;
    setJobs(jobs.filter(j => j.id !== id));
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDept("Engineering");
    setFormLoc("Remote (SFO / NYC)");
    setFormType("Full-Time");
    setFormSalary("$160k - $210k + Equity");
    setFormDesc("");
    setFormReqs("React 19, TypeScript, Express, PostgreSQL / Prisma");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-black font-sans uppercase tracking-widest text-[#00D4FF]">
            Corporate career listings & vacancies
          </h4>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
            Administer live vacancies displayed on landing portals. Active recruitment nodes: {jobs.length}
          </p>
        </div>

        {currentUser.role !== "client" && (
          <button
            onClick={() => {
              setEditingJob(null);
              resetForm();
              setIsFormOpen(true);
            }}
            className="px-3.5 py-2 text-[10px] bg-[#0066FF] hover:bg-blue-500 text-white font-mono font-bold rounded-lg uppercase tracking-wide cursor-pointer transition flex items-center gap-1"
          >
            <LucideIcon name="Plus" className="w-3.5 h-3.5" />
            <span>Launch Position</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase animate-pulse text-slate-500">
          Syncing open vacancies records...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-[10px]">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/40 hover:border-slate-800 transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-black font-sans text-slate-200 tracking-tight leading-tight uppercase">
                      {j.title}
                    </h5>
                    <span className="text-[8px] text-[#00D4FF] font-extrabold tracking-wide uppercase">
                      DEPT: {j.department}
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[7px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase shrink-0">
                    {j.type}
                  </span>
                </div>

                <p className="text-[9.5px] leading-relaxed text-slate-400 italic">
                  "{j.description}"
                </p>

                <div className="grid grid-cols-2 gap-3 text-[9px] bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                  <div>
                    <span className="text-[8px] text-slate-500 block uppercase">SALARY RANGE</span>
                    <span className="font-bold text-emerald-400">{j.salary}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 block uppercase">WORK ENVIRONMENT</span>
                    <span className="font-bold text-slate-300">{j.location}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[8px] text-slate-500 font-black uppercase">Technical Entry Criteria</span>
                  <div className="flex flex-wrap gap-1">
                    {j.requirements.map((req, rIdx) => (
                      <span key={rIdx} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-350 text-[8px] border border-slate-850">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {currentUser.role !== "client" && (
                <div className="mt-5 pt-3 border-t border-slate-800/40 flex justify-end gap-1.5">
                  <button
                    onClick={() => triggerEdit(j)}
                    className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white"
                    title="Edit vacancy parameters"
                  >
                    <LucideIcon name="Edit" className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(j.id)}
                    className="p-1 rounded bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-white"
                    title="Decommission Vacancy"
                  >
                    <LucideIcon name="Trash2" className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* VACANCY CREATOR MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h5 className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider font-sans">
                {editingJob ? "Adjust Job Vacancy specifications" : "Publish Live recruitment Opening"}
              </h5>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <LucideIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-3 font-mono text-[10px]">
              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Vacancy Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Cybersecurity Penetration Specialist"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">Recruiting Department</label>
                  <input
                    type="text"
                    required
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">Environment Location</label>
                  <input
                    type="text"
                    required
                    value={formLoc}
                    onChange={(e) => setFormLoc(e.target.value)}
                    className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">Type Term</label>
                  <select
                    value={formType}
                    onChange={(e: any) => setFormType(e.target.value)}
                    className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Full-Time">Full-Time (W2)</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">SOW Contract (1099)</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">Salary Tier Range</label>
                  <input
                    type="text"
                    required
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Introductory Summary Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summarize engineering responsibilities, target systems and codebases..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Mandatory skills criteria (comma separated list)</label>
                <input
                  type="text"
                  value={formReqs}
                  onChange={(e) => setFormReqs(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Corporate Perks & Benefits list (comma list)</label>
                <input
                  type="text"
                  value={formBenefits}
                  onChange={(e) => setFormBenefits(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
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
                  {editingJob ? "SAVE ADJS" : "PUBLISH VACANCY"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
