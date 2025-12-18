
import React, { useState, useEffect } from 'react';
import { Users, FileText, Landmark, AlertCircle, Search, Activity, ShieldCheck, Zap, Send, Megaphone, ArrowUpRight, Globe, TrendingUp, TrendingDown, BarChart3, Database } from 'lucide-react';
import { User, LoanApplication, ShipmentDocument, SupportTicket, BroadcastMessage } from '../types';

interface GepaDashboardProps {
  users: User[];
  loans: LoanApplication[];
  documents: ShipmentDocument[];
  tickets: SupportTicket[];
  broadcasts: BroadcastMessage[];
  onNavigate: (module: any) => void;
  onSendBroadcast: (broadcast: Omit<BroadcastMessage, 'id' | 'timestamp'>) => void;
}

export const GepaDashboard: React.FC<GepaDashboardProps> = ({ users, loans, documents, tickets, broadcasts, onNavigate, onSendBroadcast }) => {
  const [newContent, setNewContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const exporters = users.filter(u => u.role === 'exporter');
  const totalLoanValue = loans.reduce((acc, curr) => acc + curr.amount, 0);
  const openTickets = tickets.filter(t => t.status === 'Open').length;
  const pendingDocs = documents.filter(d => d.status === 'Agency Review').length;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    onSendBroadcast({ content: newContent, sender: 'GEPA Admin', type: 'alert' });
    setNewContent('');
  };

  const filteredExporters = exporters.filter(e => 
    e.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.tier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const marketTicks = [
    { label: "COCOA/USD", val: "2,510", change: "+2.4%", up: true },
    { label: "CASHEW/GH₵", val: "1,250", change: "-0.8%", up: false },
    { label: "SHEA/USD", val: "840", change: "+1.2%", up: true },
    { label: "MANGO/EU", val: "170", change: "+0.5%", up: true },
    { label: "GOLD/OZ", val: "1,945", change: "+0.1%", up: true },
    { label: "OIL/BBL", val: "82.50", change: "-1.1%", up: false },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Real-time Ticker */}
      <div className="bg-brand-jungle border-y border-white/5 dark:border-white/10 py-4 overflow-hidden relative shadow-brand rounded-2xl mx-1">
         <div className="flex gap-16 animate-infinite-scroll whitespace-nowrap">
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className="flex gap-16">
                 {marketTicks.map((tick, idx) => (
                   <div key={`${i}-${idx}`} className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-brand-pistachio/60 uppercase tracking-widest">{tick.label}</span>
                      <span className="text-sm font-black text-white">{tick.val}</span>
                      <span className={`text-[10px] font-bold flex items-center gap-1 ${tick.up ? 'text-brand-pistachio' : 'text-red-400'}`}>
                         {tick.up ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {tick.change}
                      </span>
                   </div>
                 ))}
              </div>
            ))}
         </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-brand-jungle dark:text-white tracking-tighter uppercase leading-none transition-colors">GEPA Overview</h2>
          <p className="text-brand-hooker dark:text-brand-lightgray/60 mt-2 font-medium italic transition-colors">National Export System Oversight</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-brand-pistachio/10 rounded-2xl border border-brand-pistachio/20 shadow-soft">
           <div className="w-2 h-2 rounded-full bg-brand-pistachio shadow-pistachio-glow animate-pulse"></div>
           <span className="text-[10px] font-black text-brand-jungle dark:text-brand-pistachio uppercase tracking-[0.3em]">System Active</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Exporter Card - Changed from solid green to neutral */}
        <div 
           onClick={() => onNavigate('dashboard')}
           className="bg-white dark:bg-brand-darksurface p-8 rounded-[2.5rem] shadow-soft relative overflow-hidden border border-brand-lightgray/20 dark:border-white/10 cursor-pointer hover:border-brand-jungle dark:hover:border-brand-pistachio transition-all active:scale-[0.98] group"
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-brand-jungle/5 dark:bg-brand-pistachio/5 rounded-full blur-2xl -mr-16 -mt-16 transition-colors"></div>
           <div className="flex items-center gap-3 mb-8 text-brand-hooker dark:text-brand-lightgray/60 group-hover:text-brand-jungle dark:group-hover:text-white transition-colors relative z-10">
             <Users size={20} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Total Exporters</span>
           </div>
           <div className="text-6xl font-black text-brand-jungle dark:text-white relative z-10 tracking-tighter leading-none transition-colors">{exporters.length}</div>
           <div className="text-[10px] text-brand-hooker/60 dark:text-white/20 mt-3 font-black uppercase tracking-widest relative z-10">Registered Companies</div>
        </div>

        {/* Financing Card */}
        <div 
           onClick={() => onNavigate('ifcms')}
           className="bg-white dark:bg-brand-darksurface p-8 rounded-[2.5rem] border border-brand-lightgray/20 dark:border-white/10 shadow-soft cursor-pointer hover:border-brand-pistachio transition-all active:scale-[0.98] group relative overflow-hidden"
        >
           <div className="flex items-center gap-3 mb-8 text-brand-hooker dark:text-brand-lightgray/60 group-hover:text-brand-jungle dark:group-hover:text-white transition-colors">
             <Landmark size={20} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Total Financing</span>
           </div>
           <div className="text-5xl font-black text-brand-jungle dark:text-white tracking-tighter leading-none transition-colors">GH₵ {(totalLoanValue / 1000000).toFixed(1)}M</div>
           <div className="text-[10px] text-brand-hooker/60 dark:text-white/20 mt-3 font-black uppercase tracking-widest">Loans Disbursed</div>
        </div>

        {/* Regulatory Card */}
        <div 
           onClick={() => onNavigate('dedcp')}
           className="bg-white dark:bg-brand-darksurface p-8 rounded-[2.5rem] border border-brand-lightgray/20 dark:border-white/10 shadow-soft cursor-pointer hover:border-brand-pistachio transition-all active:scale-[0.98] group"
        >
           <div className="flex items-center gap-3 mb-8 text-brand-hooker dark:text-brand-lightgray/60 group-hover:text-brand-jungle dark:group-hover:text-white transition-colors">
             <FileText size={20} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Pending Approvals</span>
           </div>
           <div className="text-6xl font-black text-brand-jungle dark:text-white tracking-tighter leading-none transition-colors">{pendingDocs}</div>
           <div className="text-[10px] text-brand-hooker/60 dark:text-white/20 mt-3 font-black uppercase tracking-widest">Shipments Pending</div>
        </div>

        {/* Tickets Card */}
        <div className="bg-white dark:bg-brand-darksurface p-8 rounded-[2.5rem] border border-brand-lightgray/20 dark:border-white/10 shadow-soft cursor-pointer hover:border-red-500 dark:hover:border-red-500/50 transition-all active:scale-[0.98] group" onClick={() => onNavigate('support')}>
           <div className="flex items-center gap-3 mb-8 text-brand-hooker dark:text-brand-lightgray/60 group-hover:text-red-500 transition-colors">
             <AlertCircle size={20} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Support Tickets</span>
           </div>
           <div className="text-6xl font-black text-red-500 tracking-tighter leading-none">{openTickets}</div>
           <div className="text-[10px] text-brand-hooker/60 dark:text-white/20 mt-3 font-black uppercase tracking-widest">Open Issues</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Broadcast System */}
        <div className="lg:col-span-8 bg-white dark:bg-brand-darksurface rounded-[3.5rem] border border-brand-lightgray/20 dark:border-white/10 shadow-soft overflow-hidden flex flex-col h-[650px] transition-colors">
           <div className="p-10 border-b border-brand-lightgray/10 dark:border-white/5 flex justify-between items-center bg-brand-lightgray/5 dark:bg-white/5">
             <h3 className="font-black text-xl text-brand-jungle dark:text-white uppercase tracking-tight flex items-center gap-4 transition-colors">
               <Megaphone size={24} className="text-brand-pistachio" /> Announcements
             </h3>
             <Activity size={20} className="text-brand-hooker dark:text-brand-lightgray animate-pulse" />
           </div>
           <div className="p-10 overflow-y-auto no-scrollbar flex-1 space-y-10">
              <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] shadow-brand relative overflow-hidden border border-brand-lightgray/20 dark:border-white/10 transition-colors">
                 <h4 className="text-[11px] font-black text-brand-jungle dark:text-brand-pistachio uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                   <Zap size={18} /> New Announcement
                 </h4>
                 <form onSubmit={handleBroadcast} className="flex flex-col sm:flex-row gap-4 relative z-10">
                    <input 
                      type="text" 
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Enter announcement text..."
                      className="flex-1 bg-brand-lightgray/10 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-[1.5rem] h-16 px-6 text-sm font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio transition-all text-brand-jungle dark:text-white placeholder:text-brand-hooker/30 dark:placeholder:text-white/20"
                    />
                    <button type="submit" className="bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle px-10 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-hooker dark:hover:bg-white transition-all flex items-center gap-3 shadow-brand h-16 shrink-0 active:scale-95">
                       <Send size={18} /> Send
                    </button>
                 </form>
              </div>

              <div className="space-y-6">
                 <h4 className="text-[11px] font-black text-brand-jungle dark:text-white uppercase tracking-[0.4em] ml-2 transition-colors">History</h4>
                 {broadcasts.length > 0 ? broadcasts.map(b => (
                    <div key={b.id} className="p-8 rounded-[2rem] bg-brand-lightgray/5 dark:bg-white/5 border border-brand-lightgray/20 dark:border-white/10 hover:border-brand-jungle/20 dark:hover:border-brand-pistachio/20 transition-all flex justify-between items-start group">
                       <div className="flex items-start gap-6">
                          <div className="w-14 h-14 bg-white dark:bg-brand-jungle text-brand-jungle dark:text-brand-pistachio rounded-2xl flex items-center justify-center shrink-0 border border-brand-lightgray/10 dark:border-white/10 shadow-sm group-hover:scale-110 transition-transform">
                             <Megaphone size={24} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-brand-jungle dark:text-white leading-relaxed">{b.content}</p>
                             <div className="flex items-center gap-3 mt-3">
                                <span className="text-[9px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-widest">{b.timestamp}</span>
                                <span className="w-1 h-1 rounded-full bg-brand-lightgray dark:bg-white/20"></span>
                                <span className="text-[9px] font-black text-brand-pistachio uppercase tracking-widest">{b.sender}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 )) : (
                    <div className="text-center py-10 opacity-40">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em]">No broadcast history</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Active Exporters List */}
        <div className="lg:col-span-4 bg-white dark:bg-brand-darksurface rounded-[3.5rem] border border-brand-lightgray/20 dark:border-white/10 shadow-soft overflow-hidden flex flex-col h-[650px] transition-colors">
           <div className="p-10 border-b border-brand-lightgray/10 dark:border-white/5 bg-brand-lightgray/5 dark:bg-white/5">
             <h3 className="font-black text-xl text-brand-jungle dark:text-white uppercase tracking-tight mb-6 transition-colors">Registered Entities</h3>
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-hooker/40 dark:text-white/20" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search companies..." 
                  className="w-full pl-12 h-14 bg-white dark:bg-white/5 border border-brand-lightgray/20 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio transition-all text-brand-jungle dark:text-white"
                />
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {filteredExporters.map(user => (
                 <div key={user.id} className="p-6 rounded-[2rem] border border-brand-lightgray/20 dark:border-white/10 hover:border-brand-jungle dark:hover:border-brand-pistachio transition-all flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-2xl flex items-center justify-center font-black text-xs uppercase shadow-lg">
                          {user.avatarInitials}
                       </div>
                       <div>
                          <h4 className="font-black text-brand-jungle dark:text-white text-xs uppercase tracking-tight transition-colors">{user.companyName}</h4>
                          <p className="text-[9px] font-bold text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-widest mt-1 transition-colors">{user.tier} • Score: {user.creditScore}</p>
                       </div>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-brand-lightgray/20 dark:border-white/10 flex items-center justify-center text-brand-hooker dark:text-brand-lightgray/40 group-hover:bg-brand-jungle dark:group-hover:bg-brand-pistachio group-hover:text-white dark:group-hover:text-brand-jungle transition-all">
                       <ArrowUpRight size={16} />
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
