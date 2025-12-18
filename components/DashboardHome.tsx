
import React from 'react';
import { ArrowRight, Download, MessageSquare, Plus, ShieldCheck, Activity, TrendingUp, Zap, Clock, FileText, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { COMMODITY_DATA } from '../constants';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { User, LoanApplication, ShipmentDocument } from '../types';
import { IllusBank, IllusDoc, IllusGlobe, IllusChart } from './CustomIcons';

interface DashboardHomeProps {
  onNavigate: (mod: any) => void;
  user: User;
  loans: LoanApplication[];
  documents: ShipmentDocument[];
  onShowToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate, user, loans, documents, onShowToast }) => {
  const activeShipmentsCount = documents.filter(d => d.status !== 'Approved' && d.status !== 'Rejected').length;
  const creditScore = user.creditScore || 0;
  const maxScore = 900;
  const scorePercent = (creditScore / maxScore) * 100;

  // Merge and sort activities for the timeline
  const activities = [
    ...loans.map(l => ({ 
      type: 'finance', 
      date: l.date, 
      id: l.id, 
      status: l.status, 
      title: `Loan Application: ${l.institution}`,
      amount: l.amount,
      desc: `${l.type} - ${l.termMonths} Mo.`
    })),
    ...documents.map(d => ({ 
      type: 'trade', 
      date: d.date, 
      id: d.reference, 
      status: d.status, 
      title: `Shipment: ${d.product}`,
      dest: d.destination,
      desc: `Dest: ${d.destination}`
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const handleExportReport = () => {
    onShowToast('Activity logs exported.', 'success');
  };

  const handleTimelineClick = (act: any) => {
    if (act.type === 'finance') {
        onShowToast(`Redirecting to Loan: ${act.id}`, 'info');
        onNavigate('ifcms');
    } else {
        onShowToast(`Redirecting to Shipment: ${act.id}`, 'info');
        onNavigate('dedcp');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Approved': return 'text-brand-pistachio bg-brand-pistachio/10 border-brand-pistachio/20';
        case 'Pending': 
        case 'Review': 
        case 'Agency Review': return 'text-brand-pewter bg-brand-pewter/10 border-brand-pewter/20';
        case 'Rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
        default: return 'text-brand-hooker bg-brand-lightgray/10 border-brand-lightgray/20';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Welcome Header - Glass */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/70 dark:bg-brand-darksurface/70 backdrop-blur-md p-8 rounded-[2rem] border border-brand-lightgray/30 dark:border-white/10 shadow-brand relative overflow-hidden transition-colors group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pistachio/5 rounded-full blur-3xl -mr-16 -mt-16 transition-colors opacity-0 group-hover:opacity-100 duration-1000"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
             <span className="text-[10px] font-black text-brand-pistachio uppercase tracking-[0.4em]">Session Active</span>
             <div className="w-1.5 h-1.5 bg-brand-pistachio rounded-full animate-pulse shadow-pistachio-glow"></div>
             <span className="text-[10px] font-black text-brand-hooker/40 dark:text-white/20 uppercase tracking-[0.2em] ml-2">Accra • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <h2 className="text-3xl font-black text-brand-jungle dark:text-white tracking-tighter uppercase leading-none transition-colors">Welcome, {user.name.split(' ')[0]}</h2>
          <p className="text-brand-hooker dark:text-brand-lightgray/60 mt-2 font-medium">Authorized Official for <span className="text-brand-jungle dark:text-brand-pistachio font-bold transition-colors">{user.companyName}</span></p>
        </div>
        <div className="flex gap-3 relative z-10">
           <button 
             onClick={handleExportReport}
             className="px-6 py-4 bg-brand-lightgray/20 dark:bg-white/5 text-brand-jungle dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-lightgray/30 dark:hover:bg-white/10 transition-all flex items-center gap-3 border border-brand-lightgray/30 dark:border-white/10"
           >
             <Download size={16} /> Export Logs
           </button>
           <button 
             onClick={() => onNavigate('support')}
             className="px-6 py-4 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-hooker dark:hover:bg-white transition-all shadow-brand flex items-center gap-3 active:scale-95"
           >
             <MessageSquare size={16} /> Support
           </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Credit Health */}
        <div 
           onClick={() => onNavigate('ifcms')}
           className="bg-white/70 dark:bg-brand-darksurface/70 backdrop-blur-md p-8 rounded-[2rem] border border-brand-lightgray/30 dark:border-white/10 shadow-soft cursor-pointer hover:border-brand-jungle dark:hover:border-brand-pistachio transition-all group group-active:scale-[0.98] relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="w-14 h-14 bg-brand-jungle dark:bg-white/10 text-brand-pistachio rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-rotate-3 transition-transform">
              <IllusBank size={32} />
            </div>
            <span className="text-[9px] font-black tracking-widest uppercase text-brand-jungle dark:text-brand-jungle bg-brand-pistachio px-3 py-1.5 rounded-full shadow-pistachio-glow">{user.tier}</span>
          </div>
          <h3 className="text-brand-hooker dark:text-brand-lightgray/40 text-[10px] font-black uppercase tracking-[0.3em] mb-2 relative z-10">Credit Score</h3>
          <div className="flex items-end gap-2 mb-6 relative z-10">
            <div className="text-6xl font-black text-brand-jungle dark:text-white tracking-tighter leading-none">{creditScore}</div>
            <div className="text-[10px] font-black text-brand-hooker/40 dark:text-white/20 uppercase tracking-widest mb-2">/ 900</div>
          </div>
          <div className="w-full bg-brand-jungle/10 dark:bg-white/5 h-2.5 rounded-full overflow-hidden mb-6 border border-brand-jungle/5 dark:border-white/5 p-[1.5px] relative z-10">
            <div className="bg-brand-pistachio h-full rounded-full transition-all duration-1000 shadow-pistachio-glow" style={{width: `${scorePercent}%`}}></div>
          </div>
          <div className="flex items-center text-[10px] font-black tracking-[0.2em] uppercase text-brand-jungle dark:text-brand-pistachio group-hover:gap-2 transition-all relative z-10">
            View Loans <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Regulatory Load */}
        <div 
          onClick={() => onNavigate('dedcp')}
          className="bg-white/70 dark:bg-brand-darksurface/70 backdrop-blur-md p-8 rounded-[2rem] border border-brand-lightgray/30 dark:border-white/10 shadow-soft cursor-pointer hover:border-brand-jungle dark:hover:border-brand-pistachio transition-all group group-active:scale-[0.98] relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="w-14 h-14 bg-brand-pewter text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-3 transition-transform">
              <IllusDoc size={32} />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-lightgray/20 dark:bg-white/5 rounded-full border border-brand-lightgray/30 dark:border-white/10">
               <div className={`w-1.5 h-1.5 rounded-full ${activeShipmentsCount > 0 ? 'bg-brand-pewter animate-pulse' : 'bg-brand-pistachio'}`}></div>
               <span className="text-[9px] font-black uppercase text-brand-jungle dark:text-white/60">{activeShipmentsCount > 0 ? 'Processing' : 'Idle'}</span>
            </div>
          </div>
          <h3 className="text-brand-hooker dark:text-brand-lightgray/40 text-[10px] font-black uppercase tracking-[0.3em] mb-2 relative z-10">Active Shipments</h3>
          <div className="flex items-end gap-2 mb-6 relative z-10">
            <div className="text-6xl font-black text-brand-jungle dark:text-white tracking-tighter leading-none">{activeShipmentsCount}</div>
            <div className="text-[10px] font-black text-brand-hooker/40 dark:text-white/20 uppercase tracking-widest mb-2">Items</div>
          </div>
          <div className="p-4 rounded-2xl bg-brand-lightgray/10 dark:bg-white/5 border border-brand-lightgray/20 dark:border-white/5 flex items-center justify-between relative z-10 group-hover:bg-brand-lightgray/20 dark:group-hover:bg-white/10 transition-colors">
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-hooker dark:text-brand-lightgray/40">Avg. Processing</span>
            <span className="text-[10px] font-black text-brand-jungle dark:text-white">2.4 Days</span>
          </div>
        </div>

        {/* Market Momentum */}
        <div 
          onClick={() => onNavigate('remip')}
          className="bg-brand-jungle/90 dark:bg-brand-jungle/80 backdrop-blur-md p-8 rounded-[2rem] shadow-brand cursor-pointer hover:shadow-2xl transition-all group relative overflow-hidden group-active:scale-[0.98] border border-white/5"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pistachio/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none group-hover:bg-brand-pistachio/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="w-14 h-14 bg-white/10 text-brand-pistachio rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <IllusChart size={32} />
            </div>
            <div className="flex items-center gap-1 text-brand-pistachio">
               <TrendingUp size={16} />
               <span className="text-xs font-black">+2.4%</span>
            </div>
          </div>
          <h3 className="text-brand-lightgray/40 text-[10px] font-black uppercase tracking-[0.3em] mb-2 relative z-10">Market Trends</h3>
          <div className="flex items-end gap-3 mb-6 relative z-10">
            <div className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Cocoa</div>
            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">/ USD</div>
          </div>
          <div className="h-20 w-full relative z-10 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={COMMODITY_DATA}>
                    <defs>
                      <linearGradient id="colorCocoa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9CC97F" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#9CC97F" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="cocoa" stroke="#9CC97F" strokeWidth={3} fill="url(#colorCocoa)" />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quick Actions & Timeline */}
          <div className="lg:col-span-8 space-y-8">
            <div>
               <h3 className="text-[11px] font-black text-brand-jungle dark:text-white uppercase tracking-[0.4em] mb-6 ml-2 opacity-60 flex items-center gap-2">
                  <Zap size={14} className="text-brand-pistachio" /> Quick Actions
               </h3>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {[
                   { mod: 'ifcms', icon: <IllusBank size={24} />, label: 'New\nLoan', bg: 'bg-brand-jungle/5 dark:bg-white/5 text-brand-jungle dark:text-brand-pistachio' },
                   { mod: 'dedcp', icon: <Plus size={24} className="stroke-[3px]" />, label: 'New\nShipment', bg: 'bg-brand-pewter/5 dark:bg-white/5 text-brand-pewter dark:text-brand-pewter' },
                   { mod: 'remip', icon: <IllusChart size={24} />, label: 'Market\nData', bg: 'bg-brand-hooker/5 dark:bg-white/5 text-brand-hooker dark:text-brand-hooker' },
                   { mod: 'remip', icon: <IllusGlobe size={40} />, label: 'Global\nDemand', bg: 'bg-brand-pistachio/10 dark:bg-white/5 text-brand-pistachio dark:text-brand-pistachio' }
                 ].map((btn, i) => (
                   <button 
                     key={i} 
                     onClick={() => onNavigate(btn.mod)} 
                     className="bg-white/70 dark:bg-brand-darksurface/70 backdrop-blur-md p-6 rounded-[2rem] border border-brand-lightgray/30 dark:border-white/10 shadow-brand hover:border-brand-jungle dark:hover:border-brand-pistachio transition-all group text-left flex flex-col justify-between aspect-square active:scale-[0.96]"
                   >
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${btn.bg} group-hover:scale-110 shadow-sm`}>
                       {btn.icon}
                     </div>
                     <div className="font-black text-brand-jungle dark:text-white text-xs leading-tight uppercase tracking-widest whitespace-pre-line transition-colors">{btn.label}</div>
                   </button>
                 ))}
               </div>
            </div>
            
            <div className="bg-white/70 dark:bg-brand-darksurface/70 backdrop-blur-md p-8 rounded-[2rem] border border-brand-lightgray/30 dark:border-white/10 shadow-soft transition-colors">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-brand-lightgray/20 dark:bg-white/5 text-brand-jungle dark:text-white rounded-xl flex items-center justify-center">
                     <Clock size={20} />
                  </div>
                  <h3 className="font-black text-brand-jungle dark:text-white text-lg uppercase tracking-tight transition-colors">Recent Activity</h3>
               </div>
               
               <div className="space-y-4">
                  {activities.length > 0 ? activities.map((act, idx) => (
                     <div 
                        key={idx} 
                        onClick={() => handleTimelineClick(act)}
                        className="flex items-start gap-4 p-4 rounded-2xl hover:bg-brand-lightgray/5 dark:hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-brand-lightgray/10 dark:hover:border-white/5 active:scale-[0.99]"
                     >
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${act.type === 'finance' ? 'bg-brand-jungle dark:bg-brand-pistachio' : 'bg-brand-pewter'}`}></div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start">
                              <h4 className="text-sm font-black text-brand-jungle dark:text-white uppercase tracking-tight truncate pr-4 group-hover:underline decoration-brand-pistachio underline-offset-4 decoration-2">{act.title}</h4>
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${getStatusColor(act.status)}`}>{act.status}</span>
                           </div>
                           <p className="text-[10px] text-brand-hooker dark:text-brand-lightgray/60 font-medium mt-1 truncate">{act.desc} • Ref: {act.id}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="text-[9px] font-bold text-brand-hooker/40 dark:text-white/20 uppercase tracking-widest whitespace-nowrap">{act.date}</div>
                            <ChevronRight size={14} className="text-brand-pistachio opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                        </div>
                     </div>
                  )) : (
                     <div className="text-center py-10 opacity-40">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Activity Logged</p>
                     </div>
                  )}
               </div>
            </div>
          </div>

          {/* System Status Node */}
          <div className="lg:col-span-4 bg-white/70 dark:bg-brand-darksurface/70 backdrop-blur-md p-8 rounded-[2rem] border border-brand-lightgray/30 dark:border-white/10 h-fit shadow-brand transition-colors sticky top-24">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-brand-jungle dark:bg-brand-pistachio text-brand-pistachio dark:text-brand-jungle rounded-2xl flex items-center justify-center shadow-lg animate-pulse-slow">
                   <Activity size={24} />
                </div>
                <div>
                   <h3 className="font-black text-brand-jungle dark:text-white text-lg uppercase tracking-tight transition-colors">System Status</h3>
                   <p className="text-[9px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-widest">Latency: 12ms</p>
                </div>
             </div>
             <div className="space-y-6">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-hooker dark:text-brand-lightgray/40">
                   <span>Authentication</span>
                   <span className="text-brand-pistachio flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-pistachio rounded-full shadow-pistachio-glow animate-pulse"></div> SECURE
                   </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-hooker dark:text-brand-lightgray/40">
                   <span>Data Sync</span>
                   <span className="text-brand-jungle dark:text-white font-bold transition-colors">VERIFIED</span>
                </div>
                <div className="pt-6 mt-2 border-t border-brand-lightgray/20 dark:border-white/5">
                   <div className="p-4 bg-brand-jungle dark:bg-white/5 text-white/80 dark:text-white/60 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed transition-colors border border-white/5 dark:border-white/10">
                      Connection is secure. All transmissions are hashed and verifiable on the GEPA Chain.
                   </div>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};
