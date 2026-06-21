import React, { useState, useEffect, useRef } from "react";
import LucideIcon from "../../LucideIcon";

export function ClientDashboardView({ token, isDarkMode }: any) {
  const [data, setData] = useState<any>({ projects: [], invoices: [] });

  useEffect(() => {
    // We can fetch a summary or multiple endpoints.
    // Let's just fetch all needed for a dashboard summary.
    Promise.all([
      fetch("/api/client/projects", { headers: { "Authorization": `Bearer ${token}` } }).then(r => r.json()),
      fetch("/api/client/invoices", { headers: { "Authorization": `Bearer ${token}` } }).then(r => r.json())
    ]).then(([projectsData, invoicesData]) => {
      setData({ 
        projects: Array.isArray(projectsData) ? projectsData : [], 
        invoices: Array.isArray(invoicesData) ? invoicesData : [] 
      });
    }).catch(console.error);
  }, [token]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black font-mono uppercase tracking-widest text-[#00D4FF]">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
          <h3 className="text-sm font-bold font-mono text-slate-500 uppercase">Active Projects</h3>
          <p className="text-4xl font-black mt-2">{data.projects.filter((p: any) => p.status === 'Active').length}</p>
        </div>
        <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
          <h3 className="text-sm font-bold font-mono text-slate-500 uppercase">Unpaid Invoices</h3>
          <p className="text-4xl font-black mt-2">{data.invoices.filter((i: any) => i.status !== 'Paid').length}</p>
        </div>
      </div>
    </div>
  );
}

export function ClientProjectsView({ token, isDarkMode }: any) {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch("/api/client/projects", { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json()).then(data => setProjects(Array.isArray(data) ? data : [])).catch(console.error);
  }, [token]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-mono text-[#00D4FF]">My Projects</h2>
      <div className="grid gap-4">
        {projects.length === 0 ? <p className="text-slate-500 font-mono text-sm">No active projects found.</p> : null}
        {projects.map((p: any) => (
          <div key={p.id} className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">{p.projectName}</h3>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-mono">{p.status}</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">{p.description}</p>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
              <div className="bg-[#00D4FF] h-2 rounded-full" style={{ width: `${p.progressPercentage || 0}%` }}></div>
            </div>
            <p className="text-xs text-right font-mono text-slate-500">{p.progressPercentage || 0}% Complete</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClientInvoicesView({ token, isDarkMode }: any) {
  const [invoices, setInvoices] = useState([]);
  useEffect(() => {
    fetch("/api/client/invoices", { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json()).then(data => setInvoices(Array.isArray(data) ? data : [])).catch(console.error);
  }, [token]);

  const handlePay = async (invoiceId: number, amount: number) => {
    // Mock payment trigger
    await fetch("/api/client/payments", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId, amount, paymentMethod: 'Stripe' })
    });
    alert("Payment submitted successfully via Gateway.");
    fetch("/api/client/invoices", { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json()).then(data => setInvoices(Array.isArray(data) ? data : []));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-mono text-[#00D4FF]">Invoices & Billing</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className={`text-xs font-mono uppercase ${isDarkMode ? "text-slate-500 bg-slate-900" : "bg-slate-50 text-slate-500"}`}>
            <tr>
              <th className="p-4 rounded-tl-lg">Invoice #</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-slate-500">No invoices.</td></tr>
            )}
            {invoices.map((i: any) => (
              <tr key={i.id} className={`border-b ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
                <td className="p-4 font-mono">{i.invoiceNumber}</td>
                <td className="p-4">${parseFloat(i.amount).toFixed(2)}</td>
                <td className="p-4">{i.dueDate ? new Date(i.dueDate).toLocaleDateString() : 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-mono ${
                    i.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>{i.status}</span>
                </td>
                <td className="p-4">
                  {i.status !== 'Paid' && (
                    <button onClick={() => handlePay(i.id, i.amount)} className="px-3 py-1 bg-[#00D4FF] text-black font-bold uppercase tracking-widest text-[10px] rounded">
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ClientPaymentsView({ token, isDarkMode }: any) {
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    fetch("/api/client/payments", { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json()).then(data => setPayments(Array.isArray(data) ? data : [])).catch(console.error);
  }, [token]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-mono text-[#00D4FF]">Payment History</h2>
      {payments.map((p: any) => (
        <div key={p.id} className={`flex justify-between items-center p-4 rounded-xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
          <div>
            <p className="font-mono text-sm">TXN: {p.transactionId}</p>
            <p className="text-xs text-slate-500">{new Date(p.paidAt).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">${parseFloat(p.amount).toFixed(2)}</p>
            <p className="text-xs text-green-500 font-mono uppercase">{p.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ClientSupportView({ token, isDarkMode }: any) {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");

  const fetchTickets = () => {
    fetch("/api/client/support-tickets", { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json()).then(data => setTickets(Array.isArray(data) ? data : [])).catch(console.error);
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const submitTicket = async (e: any) => {
    e.preventDefault();
    await fetch("/api/client/support-tickets", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ subject, description: desc })
    });
    setSubject("");
    setDesc("");
    fetchTickets();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold font-mono text-[#00D4FF]">Support Tickets</h2>
      
      <form onSubmit={submitTicket} className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <h3 className="font-bold font-mono text-sm uppercase">Open New Ticket</h3>
        <input 
          required 
          placeholder="Subject" 
          value={subject} onChange={e => setSubject(e.target.value)}
          className={`w-full p-3 rounded-lg text-sm font-mono border outline-none transition ${isDarkMode ? "bg-slate-950 border-slate-800 focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"}`} 
        />
        <textarea 
          required 
          placeholder="Description" 
          rows={3}
          value={desc} onChange={e => setDesc(e.target.value)}
          className={`w-full p-3 rounded-lg text-sm font-mono border outline-none transition ${isDarkMode ? "bg-slate-950 border-slate-800 focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"}`} 
        />
        <button type="submit" className="px-4 py-2 bg-[#00D4FF] text-black font-bold uppercase tracking-widest text-[10px] rounded">
          Submit Ticket
        </button>
      </form>

      <div className="space-y-4">
        {tickets.map((t: any) => (
          <div key={t.id} className={`p-4 rounded-xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex justify-between">
              <span className="font-bold">{t.subject}</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px] uppercase">{t.status}</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClientFilesView({ token, isDarkMode }: any) {
  const [files, setFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState<any>(null);

  const fetchFiles = () => {
    fetch("/api/files", { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setFiles(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchFiles();
  }, [token]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    Array.from(e.target.files).forEach(f => {
      formData.append("files", f);
    });

    try {
      // Simulate progress since fetch doesn't natively support upload progress well
      const interval = setInterval(() => setUploadProgress(p => Math.min(p + 10, 90)), 200);
      
      const res = await fetch("/api/files/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      clearInterval(interval);
      setUploadProgress(100);
      
      if (res.ok) {
        fetchFiles();
      } else {
        const err = await res.json();
        alert("Upload failed: " + err.error);
      }
    } catch(err) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/files/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchFiles();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-mono text-[#00D4FF]">Enterprise File Management</h2>
      </div>

      {/* Upload Zone */}
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
          isDarkMode ? "border-slate-800 hover:border-[#00D4FF] bg-slate-900/50" : "border-slate-300 hover:border-blue-500 bg-slate-50"
        }`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileSelect} 
        />
        {isUploading ? (
          <div>
            <LucideIcon name="UploadCloud" className="w-10 h-10 mx-auto text-[#00D4FF] mb-4 animate-bounce" />
            <p className="font-mono text-sm font-bold text-[#00D4FF]">Uploading... {uploadProgress}%</p>
            <div className="w-full max-w-md mx-auto bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-[#00D4FF] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        ) : (
          <div>
            <LucideIcon name="UploadCloud" className="w-10 h-10 mx-auto text-slate-500 mb-4" />
            <p className="font-bold text-lg">Click to Upload Files</p>
            <p className="text-sm font-mono text-slate-500 mt-2">Images, Docs, PDFs, Zips (Max 50MB)</p>
          </div>
        )}
      </div>

      {/* Files Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.length === 0 && !isUploading && (
          <div className="col-span-full p-8 text-center text-slate-500 font-mono text-sm border border-dashed rounded-xl border-slate-700">
            <LucideIcon name="Folder" className="w-8 h-8 opacity-50 mx-auto mb-2" />
            <p>No files uploaded yet.</p>
          </div>
        )}
        
        {files.map(f => (
          <div key={f.id} className={`group relative flex flex-col p-4 rounded-xl border transition-all ${isDarkMode ? "bg-slate-900 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:shadow-md"}`}>
            <div className="flex-1 flex flex-col items-center justify-center p-4">
               {f.fileFormat?.match(/jpg|jpeg|png|webp|gif/i) ? (
                 <img src={f.url} alt={f.fileName} className="w-20 h-20 object-cover rounded shadow-lg" loading="lazy" />
               ) : (
                 <LucideIcon name="File" className="w-16 h-16 text-slate-400" />
               )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-800/50">
               <p className="font-bold text-sm truncate" title={f.fileName}>{f.fileName}</p>
               <div className="flex justify-between items-center mt-1">
                 <p className="text-[10px] font-mono text-slate-500 uppercase">{formatSize(f.fileSize)} • {f.fileFormat}</p>
               </div>
            </div>

            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
               <button onClick={() => setPreviewFile(f)} className="p-2 bg-[#00D4FF]/20 text-[#00D4FF] hover:bg-[#00D4FF] hover:text-black rounded transition">
                  <LucideIcon name="Eye" className="w-4 h-4" />
               </button>
               <a href={f.url} target="_blank" rel="noreferrer" download className="p-2 bg-slate-800 text-white hover:bg-slate-700 rounded transition">
                  <LucideIcon name="Download" className="w-4 h-4" />
               </a>
               <button onClick={() => handleDelete(f.id)} className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded transition">
                  <LucideIcon name="Trash2" className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>

      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewFile(null)}>
           <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col ${isDarkMode ? "bg-slate-900" : "bg-white"}`} onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center p-4 border-b border-slate-800/50">
                 <h3 className="font-bold font-mono text-sm truncate">{previewFile.fileName}</h3>
                 <button onClick={() => setPreviewFile(null)} className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                    <LucideIcon name="X" className="w-4 h-4" />
                 </button>
              </div>
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/20">
                 {previewFile.fileFormat?.match(/jpg|jpeg|png|webp|gif/i) ? (
                   <img src={previewFile.url} alt={previewFile.fileName} className="max-w-full max-h-[70vh] object-contain rounded" />
                 ) : previewFile.fileFormat?.match(/pdf/i) ? (
                   <iframe src={previewFile.url} title={previewFile.fileName} className="w-full h-[70vh] rounded" />
                 ) : (
                   <div className="text-center font-mono">
                      <LucideIcon name="File" className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      <p>Preview not available for this file type.</p>
                      <a href={previewFile.url} target="_blank" download rel="noreferrer" className="mt-4 inline-block px-4 py-2 bg-[#00D4FF] text-black font-bold uppercase tracking-widest text-xs rounded">Download Instead</a>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export function ClientProfileView({ token, isDarkMode, currentUser }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-mono text-[#00D4FF]">Profile Settings</h2>
      <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <div>
          <p className="text-xs text-slate-500 font-mono uppercase">Full Name</p>
          <p className="text-lg">{currentUser.fullName || "Update your name"}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-mono uppercase">Email</p>
          <p className="text-lg font-mono">{currentUser.email}</p>
        </div>
      </div>
    </div>
  );
}
