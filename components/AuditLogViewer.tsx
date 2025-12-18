
import React, { useState } from 'react';
import { AuditLog } from '../types';
import { Search, Shield, Filter, Activity, Clock } from 'lucide-react';

interface AuditLogViewerProps {
  logs: AuditLog[];
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resourceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-brand-darksurface rounded-[3rem] shadow-soft border border-brand-lightgray/10 dark:border-white/10 overflow-hidden flex flex-col h-[600px] transition-colors duration-300">
       <div className="p-8 border-b border-brand-lightgray/10 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 bg-brand-lightgray/5 dark:bg-white/5 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-jungle dark:bg-brand-pistachio text-brand-pistachio dark:text-brand-jungle rounded-2xl flex items-center justify-center shadow-lg border border-brand-jungle/10 dark:border-brand-pistachio/20 transition-colors">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-black text-brand-jungle dark:text-white text-lg uppercase tracking-tight leading-none transition-colors">Immutable Audit Record</h3>
              <div className="flex items-center gap-2 mt-2">
                 <div className="w-1.5 h-1.5 bg-brand-pistachio rounded-full shadow-pistachio-glow animate-pulse"></div>
                 <p className="text-[9px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.2em] transition-colors">End-to-End Encryption Verified</p>
              </div>
            </div>
          </div>
          <div className="relative w-full sm:w-auto">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-hooker/40 dark:text-white/20 transition-colors" size={18} />
             <input 
               type="text" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Filter Registry ID..." 
               className="w-full sm:w-72 pl-12 pr-4 h-12 bg-white dark:bg-white/5 border border-brand-lightgray/20 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio transition-all text-brand-jungle dark:text-white"
             />
          </div>
       </div>
       
       <div className="overflow-x-auto flex-1 no-scrollbar transition-colors">
          <table className="w-full text-[10px] text-left">
            <thead className="text-brand-hooker dark:text-brand-lightgray/60 font-black uppercase tracking-[0.3em] bg-brand-lightgray/10 dark:bg-white/5 border-b border-brand-lightgray/10 dark:border-white/5 sticky top-0 z-10 backdrop-blur-md transition-colors">
               <tr>
                 <th className="px-8 py-5">Global Timestamp</th>
                 <th className="px-8 py-5">Authorized Actor</th>
                 <th className="px-8 py-5">Protocol Action</th>
                 <th className="px-8 py-5">Resource Link</th>
                 <th className="px-8 py-5">Technical Detail</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-brand-lightgray/5 dark:divide-white/5">
              {filteredLogs.length > 0 ? filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-brand-lightgray/5 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-brand-hooker dark:text-brand-lightgray/40 group-hover:text-brand-jungle dark:group-hover:text-white font-bold transition-colors">
                       <Clock size={12} />
                       {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black text-brand-jungle dark:text-white uppercase tracking-tight text-xs transition-colors">{log.actorName}</div>
                    <div className="text-[8px] font-bold text-brand-hooker dark:text-brand-lightgray/20 opacity-40 uppercase tracking-widest mt-1 transition-colors">ID: {log.actorId}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-lg border bg-white dark:bg-white/5 border-brand-lightgray/20 dark:border-white/10 font-black text-brand-jungle dark:text-brand-pistachio uppercase tracking-widest shadow-sm group-hover:border-brand-jungle/30 dark:group-hover:border-brand-pistachio/30 transition-all">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-mono font-bold text-brand-hooker dark:text-brand-lightgray/40 tracking-widest transition-colors">{log.resourceId}</td>
                  <td className="px-8 py-6">
                     <p className="text-brand-hooker dark:text-brand-lightgray/60 font-medium italic group-hover:text-brand-jungle dark:group-hover:text-white transition-colors truncate max-w-xs transition-colors" title={log.details}>
                        "{log.details}"
                     </p>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={5} className="text-center py-24 transition-colors">
                      <div className="flex flex-col items-center gap-6">
                         <Activity size={48} className="text-brand-lightgray/20 dark:text-white/5 animate-pulse transition-colors" />
                         <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-lightgray dark:text-white/10 transition-colors">No Protocol entries found</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
       </div>
       
       <div className="p-6 border-t border-brand-lightgray/10 dark:border-white/5 bg-brand-lightgray/5 dark:bg-white/5 text-center transition-colors shrink-0">
          <p className="text-[9px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.4em] transition-colors">Audit node synchronized with Blockchain Ledger v1.0.2</p>
       </div>
    </div>
  );
};
