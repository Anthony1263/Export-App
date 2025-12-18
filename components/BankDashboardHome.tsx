
import React, { useState } from 'react';
import { LayoutDashboard, AlertCircle, CheckCircle, Clock, PieChart as PieIcon, BarChart3, ArrowRight, ShieldCheck, Zap, TrendingUp, Landmark, Calendar, FileText } from 'lucide-react';
import { User, LoanApplication } from '../types';
import { RISK_DISTRIBUTION, SECTOR_EXPOSURE } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface BankDashboardProps {
  onNavigate: (mod: any) => void;
  user: User;
  loans: LoanApplication[];
  onShowToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const BankDashboardHome: React.FC<BankDashboardProps> = ({ onNavigate, user, loans, onShowToast }) => {
  const [viewMode, setViewMode] = useState<'overview' | 'risk'>('overview');

  const bankLoans = loans.filter(l => l.institution === user.companyName);
  const pendingLoans = bankLoans.filter(l => l.status === 'Pending' || l.status === 'Review');
  const portfolioValue = bankLoans.filter(l => l.status === 'Approved').reduce((sum, loan) => sum + loan.amount, 0);

  const handleExportAudit = () => {
    onShowToast("Audit logs exported.", 'success');
  };

  const getSLAColor = (date: string) => {
      // Simulate SLA calculation
      const isUrgent = Math.random() > 0.7;
      return isUrgent ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-brand-pistachio bg-brand-pistachio/10 border-brand-pistachio/20';
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in transition-colors">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-brand-jungle dark:text-white tracking-tighter uppercase leading-none transition-colors">
             {viewMode === 'overview' ? 'Loan Operations' : 'Risk Analysis'}
          </h2>
          <p className="text-brand-hooker dark:text-brand-lightgray/60 mt-2 font-medium italic transition-colors">Institution: <span className="text-brand-jungle dark:text-brand-pistachio font-bold transition-colors">{user.companyName}</span></p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setViewMode(viewMode === 'overview' ? 'risk' : 'overview')}
             className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-soft flex items-center gap-3 ${viewMode === 'risk' ? 'bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle shadow-brand' : 'bg-white dark:bg-brand-darksurface border border-brand-lightgray/30 dark:border-white/10 text-brand-hooker dark:text-brand-lightgray/60 hover:text-brand-jungle dark:hover:text-white'}`}
           >
             {viewMode === 'overview' ? <PieIcon size={16} /> : <LayoutDashboard size={16} />}
             {viewMode === 'overview' ? 'Risk Dashboard' : 'Dashboard'}
           </button>
           <button 
             onClick={handleExportAudit}
             className="px-6 py-4 bg-white dark:bg-brand-darksurface border border-brand-lightgray/30 dark:border-white/10 text-brand-hooker dark:text-brand-lightgray/60 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-brand-jungle dark:hover:text-white transition-all shadow-soft flex items-center gap-3"
           >
             <ShieldCheck size={16} /> Audit Logs
           </button>
        </div>
      </div>

      {viewMode === 'overview' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div onClick={() => onNavigate('ifcms')} className="bg-white dark:bg-brand-darksurface p-8 rounded-[3rem] border border-brand-lightgray/20 dark:border-white/10 shadow-soft hover:border-brand-jungle dark:hover:border-brand-pistachio transition-all cursor-pointer group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pewter/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-brand-pewter/10 transition-colors"></div>
               <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 bg-brand-jungle dark:bg-white/10 text-brand-pistachio rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-rotate-3 transition-transform">
                     <Clock size={28} />
                  </div>
                  <span className="text-[9px] font-black bg-brand-lightgray/10 dark:bg-white/5 text-brand-jungle dark:text-brand-pistachio px-4 py-2 rounded-full uppercase tracking-widest border border-brand-lightgray/20 dark:border-white/10 transition-colors">Pending Decisions</span>
               </div>
               <div className="text-6xl font-black text-brand-jungle dark:text-white tracking-tighter mb-2 leading-none transition-colors">{pendingLoans.length}</div>
               <div className="text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.3em]">Pending Loans</div>
            </div>

            <div className="bg-white dark:bg-brand-darksurface p-8 rounded-[3rem] border border-brand-lightgray/20 dark:border-white/10 shadow-soft relative overflow-hidden transition-colors">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pistachio/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
               <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 bg-brand-pistachio text-brand-jungle rounded-2xl flex items-center justify-center shadow-pistachio-glow">
                     <Landmark size={28} />
                  </div>
               </div>
               <div className="text-5xl font-black text-brand-jungle dark:text-white tracking-tighter mb-2 leading-none transition-colors">GH₵ {(portfolioValue / 1000000).toFixed(1)}M</div>
               <div className="text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.3em]">Total Portfolio Value</div>
            </div>

            <div className="bg-white dark:bg-brand-darksurface p-8 rounded-[3rem] shadow-brand relative overflow-hidden border border-brand-lightgray/20 dark:border-white/10 transition-colors">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pistachio/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
               <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 bg-brand-jungle dark:bg-white/10 text-white dark:text-brand-pistachio rounded-2xl flex items-center justify-center shadow-lg">
                     <Zap size={28} />
                  </div>
                  <span className="text-[9px] font-black bg-brand-pistachio text-brand-jungle px-4 py-2 rounded-full uppercase tracking-widest shadow-pistachio-glow animate-pulse">SLA Status</span>
               </div>
               <div className="text-6xl font-black tracking-tighter mb-2 leading-none text-brand-jungle dark:text-white">98.5%</div>
               <div className="text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.3em]">SLA Compliance</div>
            </div>
          </div>

          <div className="bg-white dark:bg-brand-darksurface rounded-[3rem] border border-brand-lightgray/20 dark:border-white/10 shadow-soft overflow-hidden transition-colors">
            <div className="p-10 border-b border-brand-lightgray/10 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-brand-lightgray/5 dark:bg-white/5">
              <h3 className="font-black text-xl text-brand-jungle dark:text-white uppercase tracking-tight flex items-center gap-4 transition-colors">
                  <div className="w-2 h-2 bg-brand-pistachio rounded-full shadow-pistachio-glow"></div>
                  Priority Loan Queue
              </h3>
              <button onClick={() => onNavigate('ifcms')} className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-jungle dark:text-brand-pistachio hover:underline border-2 border-brand-jungle/10 dark:border-brand-pistachio/20 px-6 py-3 rounded-2xl hover:bg-brand-jungle/5 dark:hover:bg-brand-pistachio/5 transition-all">View All</button>
            </div>
            
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-brand-lightgray/5 dark:bg-white/5 text-brand-hooker dark:text-brand-lightgray/60 text-[10px] font-black uppercase tracking-[0.4em] border-b border-brand-lightgray/10 dark:border-white/5 transition-colors">
                  <tr>
                    <th className="px-10 py-6">Loan ID</th>
                    <th className="px-10 py-6">Exporter</th>
                    <th className="px-10 py-6">Amount</th>
                    <th className="px-10 py-6">Date</th>
                    <th className="px-10 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-lightgray/5 dark:divide-white/5">
                  {pendingLoans.length > 0 ? pendingLoans.slice(0, 5).map(loan => (
                    <tr key={loan.id} className="hover:bg-brand-lightgray/5 dark:hover:bg-white/5 cursor-pointer transition-colors group" onClick={() => onNavigate('ifcms')}>
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white dark:bg-white/10 border border-brand-lightgray/20 dark:border-white/10 text-brand-jungle dark:text-brand-pistachio">
                               <FileText size={16} />
                            </div>
                            <span className="font-mono text-[11px] font-black text-brand-hooker dark:text-brand-lightgray/40 group-hover:text-brand-jungle dark:group-hover:text-white transition-colors tracking-widest">{loan.id}</span>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="text-sm font-black text-brand-jungle dark:text-white uppercase tracking-tight group-hover:underline transition-colors">
                          {loan.userId === 'u1' ? 'Kwaku Exports Ltd' : 'Cocoa Processing Co'}
                        </div>
                        <div className="text-[9px] text-brand-hooker dark:text-brand-lightgray/40 font-bold uppercase tracking-widest mt-1 opacity-60">Registered Exporter</div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="text-sm font-black text-brand-jungle dark:text-white tracking-tighter transition-colors">GH₵ {loan.amount.toLocaleString()}</div>
                         <div className="text-[9px] text-brand-hooker dark:text-brand-lightgray/60 font-bold uppercase tracking-widest mt-1">{loan.type}</div>
                      </td>
                      <td className="px-10 py-8">
                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getSLAColor(loan.date)}`}>
                            <Clock size={12} /> Pending
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-brand-lightgray/10 dark:bg-white/5 text-brand-jungle dark:text-white border border-brand-lightgray/20 dark:border-white/10 shadow-sm group-hover:bg-brand-jungle dark:group-hover:bg-brand-pistachio group-hover:text-white dark:group-hover:text-brand-jungle transition-all">
                          Review <ArrowRight size={14} />
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-10 py-24 text-center">
                         <div className="flex flex-col items-center gap-6">
                            <ShieldCheck size={64} className="text-brand-lightgray/20 dark:text-white/10" />
                            <p className="text-xs font-black uppercase tracking-[0.5em] text-brand-lightgray dark:text-white/20">No pending items</p>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white dark:bg-brand-darksurface p-12 rounded-[3.5rem] border border-brand-lightgray/20 dark:border-white/10 shadow-soft transition-colors">
             <h3 className="font-black text-xl text-brand-jungle dark:text-white uppercase tracking-tight mb-10 flex items-center gap-4 transition-colors">
               <PieIcon size={28} className="text-brand-pistachio" /> Portfolio Risk Distribution
             </h3>
             <div className="h-80 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={RISK_DISTRIBUTION}
                      innerRadius={90}
                      outerRadius={120}
                      paddingAngle={10}
                      dataKey="value"
                    >
                      {RISK_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '24px', border: 'none', backgroundColor: '#122B1D', color: '#fff', boxShadow: '0 10px 25px rgba(18, 43, 29, 0.1)', fontWeight: 'black', fontSize: '12px', textTransform: 'uppercase'}} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-3 gap-4 mt-10">
               {RISK_DISTRIBUTION.map((item) => (
                 <div key={item.name} className="flex flex-col items-center gap-2 p-6 bg-brand-lightgray/5 dark:bg-white/5 rounded-3xl border border-brand-lightgray/10 dark:border-white/10 transition-colors">
                   <div className="w-3 h-3 rounded-full shadow-lg" style={{backgroundColor: item.color}}></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-brand-hooker dark:text-brand-lightgray/60">{item.name}</span>
                   <span className="text-xl font-black text-brand-jungle dark:text-white transition-colors">{item.value}%</span>
                 </div>
               ))}
             </div>
           </div>

           <div className="bg-white dark:bg-brand-darksurface p-12 rounded-[3.5rem] border border-brand-lightgray/20 dark:border-white/10 shadow-soft transition-colors flex flex-col">
             <h3 className="font-black text-xl text-brand-jungle dark:text-white uppercase tracking-tight mb-10 flex items-center gap-4 transition-colors">
               <BarChart3 size={28} className="text-brand-pewter" /> Sector Exposure
             </h3>
             <div className="h-80 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SECTOR_EXPOSURE} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10, fontWeight: 900, fill: '#537E72', textTransform: 'uppercase'}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'rgba(18, 43, 29, 0.05)', radius: 12}} contentStyle={{borderRadius: '20px', border: 'none', backgroundColor: '#122B1D', color: '#fff', boxShadow: '0 10px 25px rgba(18, 43, 29, 0.1)'}} />
                    <Bar dataKey="value" fill="#9CC97F" radius={[0, 16, 16, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
             {/* Changed from solid green to lighter background for balance */}
             <div className="mt-8 p-8 bg-brand-lightgray/20 dark:bg-white/5 rounded-[2.5rem] border border-brand-lightgray/30 dark:border-white/10 relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-pistachio/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="flex items-start gap-6 relative z-10">
                   <AlertCircle size={28} className="text-brand-jungle dark:text-brand-pistachio shrink-0" />
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 text-brand-jungle dark:text-brand-pistachio">Risk Alert</p>
                      <p className="text-sm font-bold leading-relaxed text-brand-hooker dark:text-brand-lightgray/80">Concentration risk detected in the Cocoa sector (45%). Recommendation: Incentivize applications for Shea and Horticulture to rebalance portfolio stability.</p>
                   </div>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
