
import React, { useState } from 'react';
import { ShieldCheck, Search, Activity, Check, X, Clock, ClipboardCheck, Landmark, ShieldAlert, History, Eye, User as UserIcon, Building2, FileCheck } from 'lucide-react';
import { User, ShipmentDocument } from '../types';
import { USERS } from '../constants';

interface GovernmentDashboardProps {
  user: User;
  documents: ShipmentDocument[];
  onDecision: (docId: string, status: 'Approved' | 'Rejected' | 'Action Required', notes: string) => void;
  onShowToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const GovernmentDashboard: React.FC<GovernmentDashboardProps> = ({ user, documents, onDecision, onShowToast }) => {
  const [selectedDoc, setSelectedDoc] = useState<ShipmentDocument | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({ docs: false, compliance: false, origin: false });
  const [search, setSearch] = useState('');
  
  const agency = user.agency || 'Government';
  const queue = documents.filter(d => 
    d.approvals.some(s => s.agency === agency && s.status !== 'Approved') &&
    (d.product.toLowerCase().includes(search.toLowerCase()) || d.reference.toLowerCase().includes(search.toLowerCase()))
  );

  const getSLA = (date: string) => {
    const elapsed = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60);
    const remaining = 24 - elapsed;
    if (remaining < 4) return { label: 'CRITICAL', color: 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-500/20', h: Math.floor(remaining) };
    return { label: 'NORMAL', color: 'text-brand-hooker dark:text-brand-lightgray/40 bg-brand-lightgray/10 dark:bg-white/5 border-brand-lightgray/20 dark:border-white/10', h: Math.floor(remaining) };
  };

  const handleAction = (status: 'Approved' | 'Rejected' | 'Action Required') => {
    if (!selectedDoc) return;
    if (status === 'Approved' && !Object.values(checklist).every(v => v)) {
      onShowToast("Audit checks incomplete. Verify all compliance nodes.", 'error');
      return;
    }
    if (status !== 'Approved' && !decisionNotes.trim()) {
      onShowToast("Rationale notes required for rejection/correction.", 'error');
      return;
    }
    onDecision(selectedDoc.id, status, decisionNotes);
    setSelectedDoc(null);
    setDecisionNotes('');
    setChecklist({ docs: false, compliance: false, origin: false });
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in transition-colors">
      {/* Agency Header Node */}
      <div className="bg-brand-jungle dark:bg-brand-jungle/80 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center text-white relative overflow-hidden shadow-brand border border-white/5 transition-colors">
         <div className="absolute top-0 right-0 w-64 h-full bg-brand-pistachio/5 blur-3xl" />
         <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-brand-pistachio text-brand-jungle rounded-2xl flex items-center justify-center shadow-pistachio-glow">
               <ShieldCheck size={32} />
            </div>
            <div>
               <h2 className="text-2xl font-black uppercase tracking-tighter">{agency} DASHBOARD</h2>
               <p className="text-brand-lightgray/60 text-[10px] font-black uppercase tracking-widest mt-1">Officer: {user.name}</p>
            </div>
         </div>
         <div className="flex gap-8 relative z-10 mt-6 md:mt-0">
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5">
               <p className="text-[10px] font-black text-brand-pistachio uppercase tracking-widest mb-1">Pending Items</p>
               <p className="text-2xl font-black">{queue.length}</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5">
               <p className="text-[10px] font-black text-brand-pistachio uppercase tracking-widest mb-1">Avg. Review Time</p>
               <p className="text-2xl font-black">2.1h</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Queue Column */}
        <div className="lg:col-span-4 space-y-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-hooker/40 dark:text-white/20 transition-colors" size={18} />
              <input 
                type="text" 
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Shipment ID..." 
                className="w-full pl-12 h-14 bg-white dark:bg-brand-darksurface border border-brand-lightgray/20 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio text-brand-jungle dark:text-white transition-all shadow-soft"
              />
           </div>
           <div className="bg-white dark:bg-brand-darksurface rounded-[2rem] border border-brand-lightgray/20 dark:border-white/10 shadow-soft h-[500px] lg:h-[600px] overflow-y-auto no-scrollbar p-3 space-y-3 transition-colors">
             {queue.length > 0 ? queue.map(doc => {
               const sla = getSLA(doc.date);
               const isSelected = selectedDoc?.id === doc.id;
               return (
                 <div 
                    key={doc.id} 
                    onClick={() => setSelectedDoc(doc)} 
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                        isSelected 
                        ? 'bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle border-brand-jungle dark:border-brand-pistachio shadow-brand' 
                        : 'bg-brand-lightgray/5 dark:bg-white/5 border-transparent dark:border-white/5 hover:border-brand-jungle/20 dark:hover:border-brand-pistachio/20'
                    }`}
                 >
                    <div className="flex justify-between mb-3 relative z-10">
                       <span className={`text-[9px] font-black tracking-widest uppercase transition-colors ${isSelected ? 'text-white/60 dark:text-brand-jungle/60' : 'text-brand-hooker/40 dark:text-brand-lightgray/40'}`}>{doc.reference}</span>
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 transition-colors ${sla.color} ${isSelected ? 'bg-white/20 border-white/20 text-white dark:text-brand-jungle' : ''}`}>
                           <Clock size={10} /> {sla.h}h
                       </span>
                    </div>
                    <div className="font-black text-sm uppercase tracking-tight transition-colors relative z-10 mb-1">{doc.product}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest relative z-10 flex items-center gap-1 ${isSelected ? 'text-brand-pistachio dark:text-brand-jungle' : 'text-brand-hooker dark:text-brand-lightgray/60'}`}>
                        <Building2 size={12} /> {doc.destination}
                    </div>
                 </div>
               );
             }) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-40">
                    <ClipboardCheck size={48} className="text-brand-lightgray mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">No items in queue</p>
                </div>
             )}
           </div>
        </div>

        {/* Inspection Panel */}
        <div className="lg:col-span-8">
           {selectedDoc ? (
             <div className="bg-white dark:bg-brand-darksurface rounded-[2.5rem] border border-brand-lightgray/20 dark:border-white/10 shadow-soft h-full min-h-[500px] lg:h-[664px] flex flex-col overflow-hidden animate-slide-up transition-colors">
                <div className="p-6 md:p-8 border-b border-brand-lightgray/10 dark:border-white/5 bg-brand-lightgray/5 dark:bg-white/5 flex justify-between items-center transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-colors">
                         <FileCheck size={24} />
                      </div>
                      <div>
                         <h3 className="text-sm md:text-lg font-black text-brand-jungle dark:text-white uppercase tracking-tight transition-colors">{selectedDoc.product} Protocol</h3>
                         <p className="text-[9px] md:text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-widest mt-1 transition-colors">Route: Ghana ⮕ {selectedDoc.destination}</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedDoc(null)} className="text-brand-hooker dark:text-brand-lightgray hover:text-brand-jungle dark:hover:text-white shrink-0 transition-colors"><X size={24} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:space-y-10 no-scrollbar">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <div className="bg-brand-jungle dark:bg-white/5 p-6 rounded-3xl text-white relative overflow-hidden border border-white/10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pistachio/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-pistachio mb-4 relative z-10">Compliance Checklist</h4>
                            <div className="space-y-2 relative z-10">
                                {Object.keys(checklist).map(k => (
                                    <button key={k} onClick={() => setChecklist(p => ({...p, [k]: !p[k]}))} className={`w-full flex justify-between items-center p-4 rounded-xl border transition-all ${checklist[k] ? 'bg-brand-pistachio text-brand-jungle border-brand-pistachio shadow-pistachio-glow' : 'bg-white/10 border-white/10 hover:bg-white/20 text-white'}`}>
                                    <span className="text-[10px] font-bold uppercase text-left">{k.replace(/([A-Z])/g, ' $1')} Integrity</span>
                                    {checklist[k] && <Check size={16} className="shrink-0" />}
                                    </button>
                                ))}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4 flex flex-col">
                         <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-jungle dark:text-white transition-colors">Review Notes</h4>
                            <span className="text-[9px] font-bold text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-widest">Mandatory for Rejection</span>
                         </div>
                         <textarea 
                           value={decisionNotes} onChange={(e) => setDecisionNotes(e.target.value)}
                           className="w-full flex-1 min-h-[120px] bg-brand-lightgray/5 dark:bg-white/5 border border-brand-lightgray/20 dark:border-white/10 rounded-3xl p-6 text-sm outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio text-brand-jungle dark:text-white resize-none transition-all placeholder:text-brand-hooker/30 dark:placeholder:text-white/20 font-medium"
                           placeholder="Enter official audit observations..."
                         />
                         <div className="grid grid-cols-2 gap-3 pt-4">
                            <button onClick={() => handleAction('Action Required')} className="py-4 border-2 border-brand-pewter dark:border-brand-pewter/40 text-brand-pewter dark:text-brand-pewter rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest leading-none hover:bg-brand-pewter hover:text-white transition-all">Request Changes</button>
                            <button onClick={() => handleAction('Rejected')} className="py-4 border-2 border-red-500 dark:border-red-500/40 text-red-500 dark:text-red-500 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest leading-none hover:bg-red-500 hover:text-white transition-all">Reject</button>
                            <button onClick={() => handleAction('Approved')} className="col-span-2 py-4 md:py-5 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-2xl font-black text-xs uppercase tracking-widest shadow-brand hover:bg-brand-hooker dark:hover:bg-white transition-all">Approve Shipment</button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full bg-brand-lightgray/5 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-brand-lightgray/20 dark:border-white/10 flex flex-col items-center justify-center text-brand-hooker/20 dark:text-white/10 uppercase font-black tracking-widest text-sm py-20 transition-colors">
                <Landmark size={64} className="mb-6 opacity-40" /> 
                Select a shipment to review
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
