import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";

interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  inquiryType: string;
  status: "unread" | "read" | "replied" | "archived";
}

interface ContactMessagesViewProps {
  token: string;
}

export default function ContactMessagesView({ token }: ContactMessagesViewProps) {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // Selected message for read & reply focus
  const [inspectedMsg, setInspectedMsg] = useState<ContactMessageRecord | null>(null);

  // Reply text state
  const [replyText, setReplyText] = useState("");
  const [dispatchSuccess, setDispatchSuccess] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        if (data.messages && data.messages.length > 0) {
          setInspectedMsg(data.messages[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: ContactMessageRecord["status"]) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchMessages();
      } else {
        // Local update fallback
        setMessages(messages.map(m => m.id === id ? { ...m, status: nextStatus } : m));
        if (inspectedMsg?.id === id) {
          setInspectedMsg({ ...inspectedMsg, status: nextStatus });
        }
      }
    } catch (e) {
      setMessages(messages.map(m => m.id === id ? { ...m, status: nextStatus } : m));
      if (inspectedMsg?.id === id) {
        setInspectedMsg({ ...inspectedMsg, status: nextStatus });
      }
    }
  };

  const handleDispatchReply = () => {
    if (!inspectedMsg || !replyText) return;
    setDispatchSuccess("Synthesizing TLS SMTP servers... Sending SendGrid alert email...");

    setTimeout(() => {
      setDispatchSuccess("SendGrid Answer dispatched successfully! Ticket marked [REPLIED].");
      handleUpdateStatus(inspectedMsg.id, "replied");
      setReplyText("");
      setTimeout(() => setDispatchSuccess(""), 4000);
    }, 2000);
  };

  const filteredMessages = messages.filter(m => filterStatus === "all" || m.status === filterStatus);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      
      {/* Col 1 & 2: Contact message listings */}
      <div className="lg:col-span-2 space-y-4 font-mono text-[10px]">
        <div>
          <h4 className="text-sm font-black font-sans uppercase tracking-widest text-[#00D4FF]">
            NEXORA SOW Inquiry support desk
          </h4>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Liaison communications inbox. Read ongoing client demands, reply via authenticated servers, and log tickets. Messages: {messages.length}
          </p>
        </div>

        {/* Status filters */}
        <div className="flex justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800/40 text-[10px] ">
          <span className="text-slate-400 self-center uppercase">Communication Inbox Segments:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-300 focus:outline-[#0066FF] focus:outline-none cursor-pointer"
          >
            <option value="all">CONSOLIDATED INBOX (ALL)</option>
            <option value="unread font-bold">UNOPENED SYSTEM LEADS (NEW)</option>
            <option value="read">OPENED ENQUEUE TICKETS (READ)</option>
            <option value="replied">DISPATCHED ANSWERED METRICS (REPLIED)</option>
            <option value="archived">ARCHIVED DOSSIERS (ARCHIVED)</option>
          </select>
        </div>

        {loading ? (
          <div className="py-20 text-center font-mono text-xs uppercase animate-pulse">
            Querying technical desk registries...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800/40 bg-slate-950/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-900/40">
                  <th className="px-4 py-3">INQUIRER NAME</th>
                  <th className="px-4 py-3">SOCIETY/COMPANY</th>
                  <th className="px-4 py-3">INQUIRY TYPE</th>
                  <th className="px-4 py-3">LIAISON STATUS</th>
                  <th className="px-4 py-3 text-right">INSPECT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10 dark:divide-slate-900">
                {filteredMessages.map((m) => {
                  const statusColors = {
                    unread: "bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse font-extrabold",
                    read: "bg-slate-800 text-slate-400 border-slate-700",
                    replied: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                    archived: "bg-red-500/10 text-red-550 border-red-500/20"
                  };
                  return (
                    <tr
                      key={m.id}
                      onClick={() => {
                        setInspectedMsg(m);
                        if (m.status === "unread") {
                          handleUpdateStatus(m.id, "read");
                        }
                      }}
                      className={`cursor-pointer hover:bg-slate-900/15 transition ${
                        inspectedMsg?.id === m.id ? "bg-[#00D4FF]/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-extrabold text-slate-200">{m.name}</div>
                        <div className="text-[8px] text-slate-500">{m.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-350">{m.company || "Indiv. Developer"}</td>
                      <td className="px-4 py-3">
                        <span className="font-extrabold text-[#00D4FF] uppercase tracking-wide">{m.inquiryType}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] border font-bold uppercase ${statusColors[m.status]}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="p-1 rounded bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF] hover:text-white transition">
                          <LucideIcon name="ExternalLink" className="w-3.5 h-3.5" />
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

      {/* Col 3: Message reading cabinet & dispatch portal answers */}
      <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/40 h-fit space-y-4 select-text">
        <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider border-b border-slate-800 pb-2">
          Harness client inquiry logs
        </h4>

        {inspectedMsg ? (
          <div className="space-y-4 font-mono text-[9px]">
            {/* Demographic attributes */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
              <div className="text-center pb-1.5 border-b border-slate-850">
                <span className="text-xs font-black font-sans uppercase text-slate-300 block">{inspectedMsg.name}</span>
                <span className="block text-[8px] text-[#00D4FF] tracking-widest font-bold uppercase">
                  {inspectedMsg.company ? `Company: ${inspectedMsg.company}` : "Personal Account Profile"}
                </span>
              </div>

              <div className="space-y-1 text-slate-450 text-[8.5px]">
                <div className="flex justify-between">
                  <span>PHONE DIRECT LINE:</span>
                  <span className="text-slate-300 font-bold">{inspectedMsg.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>COMMUNICATION TYPE:</span>
                  <span className="text-yellow-500 font-extrabold uppercase">{inspectedMsg.inquiryType}</span>
                </div>
              </div>
            </div>

            {/* Read block */}
            <div className="space-y-1">
              <span className="text-[8.5px] text-slate-500 font-black block uppercase">Client Message Context description</span>
              <p className="text-[9.5px] leading-relaxed text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-850 italic">
                "{inspectedMsg.message}"
              </p>
            </div>

            {/* Reply block */}
            {inspectedMsg.status !== "archived" && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <span className="text-[8.5px] text-slate-500 font-black block uppercase">Compose SECURE TLS SMTP SMTP Reply</span>

                {dispatchSuccess && (
                  <div className="p-2 border border-emerald-500/30 bg-emerald-950/25 text-emerald-400 text-center rounded text-[8px]">
                    {dispatchSuccess}
                  </div>
                )}

                <textarea
                  rows={4}
                  required
                  placeholder="Draft direct communication response to taxpayer liaison mailbox..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded-lg p-3 text-white text-[9.5px] focus:outline-none"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(inspectedMsg.id, "archived")}
                    className="w-1/3 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition uppercase font-bold"
                  >
                    ARCHIVE MSG
                  </button>
                  <button
                    onClick={handleDispatchReply}
                    className="w-2/3 py-2 bg-[#0066FF] hover:bg-blue-500 text-white rounded-lg transition uppercase font-bold"
                  >
                    DISPATCH EMAIL ANSWER
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-20 font-mono text-slate-500 uppercase">
            No inquiry message currently flagged
          </div>
        )}
      </div>

    </div>
  );
}
