import React, { useState, useEffect } from "react";

export function HomepageView({ token }: any) {
  return <div className="p-6"><h2>Homepage Manager</h2></div>;
}

export function AboutView({ token }: any) {
  return <div className="p-6"><h2>About Manager</h2></div>;
}

export function TeamView({ token }: any) {
  return <div className="p-6"><h2>Team Manager</h2></div>;
}

export function ContactView({ token }: any) {
  return <div className="p-6"><h2>Contact Manager</h2></div>;
}

export function SEOView({ token }: any) {
  return <div className="p-6"><h2>SEO Manager</h2></div>;
}

export function MediaLibraryView({ token, isDarkMode }: any) {
  const [files, setFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
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
    Array.from(e.target.files).forEach(f => formData.append("files", f));

    try {
      const interval = setInterval(() => setUploadProgress(p => Math.min(p + 10, 90)), 200);
      const res = await fetch("/api/files/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      clearInterval(interval);
      setUploadProgress(100);
      if (res.ok) fetchFiles();
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-mono text-[#00D4FF]">Media Library</h2>
        <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-[#00D4FF] text-black font-bold uppercase tracking-widest text-[10px] rounded hover:bg-blue-400">
          Upload Files
        </button>
        <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
      </div>

      {isUploading && (
        <div className="p-4 bg-[#00D4FF]/10 text-[#00D4FF] font-mono text-sm rounded-lg border border-[#00D4FF]/30">
          Uploading... {uploadProgress}%
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.length === 0 && <p className="col-span-full text-slate-500 font-mono p-8 text-center border-2 border-dashed border-slate-700 rounded-xl">No files found.</p>}
        {files.map(f => (
          <div key={f.id} className={`group relative flex flex-col p-4 rounded-xl border transition-all ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 hover:shadow-md"}`}>
            <div className="flex-1 flex flex-col items-center justify-center p-4">
               {f.fileFormat?.match(/jpg|jpeg|png|webp|gif/i) ? (
                 <img src={f.url} alt={f.fileName} className="w-24 h-24 object-cover rounded shadow-lg" loading="lazy" />
               ) : (
                 <div className="w-24 h-24 flex items-center justify-center bg-slate-800 rounded">
                   <span className="font-mono text-xs text-slate-400 uppercase">{f.fileFormat || 'FILE'}</span>
                 </div>
               )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-800/50">
               <p className="font-bold text-xs truncate" title={f.fileName}>{f.fileName}</p>
               <div className="flex justify-between items-center mt-1">
                 <p className="text-[10px] font-mono text-slate-500 uppercase">{formatSize(f.fileSize)}</p>
                 <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-400 text-xs font-mono uppercase">Delete</button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WebsiteSettingsView({ token }: any) {
  return <div className="p-6"><h2>Website Settings</h2></div>;
}
