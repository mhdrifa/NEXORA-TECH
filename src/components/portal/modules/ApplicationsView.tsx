import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";

interface CandidateRecord {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  githubUrl?: string;
  resumeUrl: string;
  resumeText?: string;
  status: "applied" | "reviewing" | "interview" | "accepted" | "rejected";
}

interface ApplicationsViewProps {
  token: string;
}

export default function ApplicationsView({ token }: ApplicationsViewProps) {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // Inspected candidate profile
  const [inspectedCandidate, setInspectedCandidate] = useState<CandidateRecord | null>(null);

  // Simulated ATS form states
  const [interviewDate, setInterviewDate] = useState("2026-07-10");
  const [interviewTime, setInterviewTime] = useState("14:00");
  const [schedMessage, setSchedMessage] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/careers", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.applications || []);
        if (data.applications && data.applications.length > 0) {
          setInspectedCandidate(data.applications[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: CandidateRecord["status"]) => {
    try {
      const res = await fetch(`/api/careers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchCandidates();
      } else {
        // Fallback local update
        setCandidates(candidates.map(c => c.id === id ? { ...c, status: nextStatus } : c));
        if (inspectedCandidate?.id === id) {
          setInspectedCandidate({ ...inspectedCandidate, status: nextStatus });
        }
      }
    } catch (err) {
      setCandidates(candidates.map(c => c.id === id ? { ...c, status: nextStatus } : c));
      if (inspectedCandidate?.id === id) {
        setInspectedCandidate({ ...inspectedCandidate, status: nextStatus });
      }
    }
  };

  const triggerScheduleInterview = () => {
    setSchedMessage(`Interview scheduled! calendar invitation dispatched for ${interviewDate} at ${interviewTime} UTC.`);
    setTimeout(() => setSchedMessage(""), 4000);
  };

  const filteredCandidates = candidates.filter(c => filterStatus === "all" || c.status === filterStatus);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Col 1 & 2: Candidates listing */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h4 className="text-sm font-black font-sans uppercase tracking-widest text-[#00D4FF]">
            ATS Candidate Tracking & resumes
          </h4>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
            Recruitment pipeline nodes. Review applicants files context, download resumes, and manage interview blocks. Total leads: {candidates.length}
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800/40 text-[10px] font-mono">
          <span className="text-slate-400 self-center">PIPELINE STAGE CLUSTERS:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-300 focus:outline-[#0066FF] focus:outline-none cursor-pointer"
          >
            <option value="all">CONSOLIDATED PIPELINES (ALL)</option>
            <option value="applied">INITIAL APPLICATION DISPATCHED (NEW)</option>
            <option value="reviewing">PORTAL PORTFOLIO REVIEWING</option>
            <option value="interview">SANDBOX CODE INTERVIEW SCHEDULED</option>
            <option value="accepted">ACCEPTED ENTRANT LOGGED</option>
            <option value="rejected">ARCHIVED ARCHIVES (REJECTED)</option>
          </select>
        </div>

        {loading ? (
          <div className="py-20 text-center font-mono text-xs uppercase animate-pulse">
            Querying corporate HR datastore...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800/40 bg-slate-950/20 text-[10px] font-mono">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-900/40">
                  <th className="px-4 py-3">CANDIDATE FULL NAME</th>
                  <th className="px-4 py-3">TARGET RECRUIT ROLE</th>
                  <th className="px-4 py-3">CONTACT EMAIL</th>
                  <th className="px-4 py-3">PORTAL PIPELINE STATUS</th>
                  <th className="px-4 py-3 text-right">INSPECT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10 dark:divide-slate-900">
                {filteredCandidates.map((c) => {
                  const statusStyles = {
                    applied: "bg-blue-500/10 text-blue-400 border-blue-500/30",
                    reviewing: "bg-purple-500/10 text-purple-400 border-purple-500/30 animate-pulse",
                    interview: "bg-amber-500/10 text-amber-500 border-amber-500/30",
                    accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                    rejected: "bg-red-500/10 text-red-500 border-red-500/25"
                  };
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setInspectedCandidate(c)}
                      className={`cursor-pointer hover:bg-slate-900/15 transition ${
                        inspectedCandidate?.id === c.id ? "bg-[#00D4FF]/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-extrabold text-slate-200">{c.fullName}</td>
                      <td className="px-4 py-3 text-slate-450 uppercase">{c.jobId.replace("job-", "Role ")}</td>
                      <td className="px-4 py-3 text-[#00D4FF] hover:underline">{c.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] border font-bold uppercase ${statusStyles[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400">
                          <LucideIcon name="ShieldAlert" className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Col 3: Detailed Profile Viewer & Resume sandbox */}
      <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/40 h-fit space-y-4">
        <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider border-b border-slate-800 pb-2">
          Harness ATS Candidate dossier
        </h4>

        {inspectedCandidate ? (
          <div className="space-y-4 font-mono text-[9px]">
            {/* Summary */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/60 text-center space-y-1">
              <span className="text-xs uppercase font-sans font-black text-white block">
                {inspectedCandidate.fullName}
              </span>
              <span className="text-[8px] text-slate-500 block uppercase">
                Applied for vacancy: {inspectedCandidate.jobId}
              </span>
              <div className="pt-2 border-t border-slate-850 flex justify-center gap-2">
                <a
                  href={inspectedCandidate.githubUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 text-slate-300 flex items-center gap-1 border border-slate-800"
                >
                  <LucideIcon name="Github" className="w-3 h-3 text-slate-400" />
                  <span>GitHub Node</span>
                </a>
                <a
                  href={inspectedCandidate.resumeUrl || "#"}
                  download
                  className="px-2.5 py-1 rounded bg-[#0066FF] hover:bg-blue-500 font-bold text-white flex items-center gap-1"
                >
                  <LucideIcon name="Download" className="w-3 h-3" />
                  <span>Resume PDF</span>
                </a>
              </div>
            </div>

            {/* Dossier status controller */}
            <div className="space-y-1.5 p-3 rounded-lg bg-[#111827] border border-slate-800">
              <span className="text-[8.5px] text-slate-500 font-extrabold uppercase block">Transition pipeline status</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleUpdateStatus(inspectedCandidate.id, "reviewing")}
                  className={`py-1.5 rounded uppercase font-bold text-center cursor-pointer ${
                    inspectedCandidate.status === "reviewing" ? "bg-purple-600 text-white" : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  Reviewing
                </button>
                <button
                  onClick={() => handleUpdateStatus(inspectedCandidate.id, "interview")}
                  className={`py-1.5 rounded uppercase font-bold text-center cursor-pointer ${
                    inspectedCandidate.status === "interview" ? "bg-amber-600 text-white" : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  Interview
                </button>
                <button
                  onClick={() => handleUpdateStatus(inspectedCandidate.id, "accepted")}
                  className={`py-1.5 rounded uppercase font-bold text-center cursor-pointer ${
                    inspectedCandidate.status === "accepted" ? "bg-emerald-700 text-white" : "bg-slate-950 text-slate-450 hover:text-white"
                  }`}
                >
                  Hired SOW
                </button>
                <button
                  onClick={() => handleUpdateStatus(inspectedCandidate.id, "rejected")}
                  className={`py-1.5 rounded uppercase font-bold text-center cursor-pointer ${
                    inspectedCandidate.status === "rejected" ? "bg-red-850 text-white animate-pulse" : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  Archive
                </button>
              </div>
            </div>

            {/* Interactive text Resume viewer */}
            <div className="space-y-1">
              <span className="text-[8.5px] text-slate-500 uppercase font-black tracking-wide">
                Candidate resume text content bio
              </span>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 max-h-36 overflow-y-auto leading-relaxed text-slate-300">
                {inspectedCandidate.resumeText ? inspectedCandidate.resumeText : (
                  "Corporate candidate files mounted. Core skill specifications: Node Express TS PostgreSQL APIs. Work Term History: Senior Architect at Initech (2020-2025)."
                )}
              </div>
            </div>

            {/* Interactive Interview scheduler */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <span className="text-[8.5px] text-slate-500 uppercase font-black block">
                Schedule Candidate interview
              </span>

              {schedMessage && (
                <div className="p-2 border border-emerald-500/30 bg-emerald-950/25 text-emerald-400 text-center rounded">
                  {schedMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white focus:outline-none"
                />
                <input
                  type="time"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={triggerScheduleInterview}
                className="w-full py-1.5 bg-[#0066FF] hover:bg-blue-500 text-white font-bold rounded uppercase cursor-pointer"
              >
                DISPATCH SCHEDULER CALENDAR INVITE
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-20 font-mono text-slate-500 uppercase">
            No applicant currently flagged
          </div>
        )}
      </div>

    </div>
  );
}
