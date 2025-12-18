
import React, { useState, useEffect } from 'react';
import { Check, X, Search, FileText, Building2, User as UserIcon, AlertTriangle, Clock, ShieldCheck, Zap, ArrowUpRight, TrendingUp } from 'lucide-react';
import { LoanApplication, User } from '../types';
import { USERS, CREDIT_FACTORS } from '../constants';
import { CreditScoreBreakdown } from './CreditScoreBreakdown';

interface BankIfcmsProps {
  user: User;
  loans: LoanApplication[];
  onDecideLoan: (loanId: string, decision: 'Approved' | 'Rejected', notes: string) => void;
}

export const BankIfcmsModule: React.FC<BankIfcmsProps> = ({ user, loans, onDecideLoan }) => {
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [notes, setNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');

  const bankLoans = loans.filter(l => l.institution === user.companyName);
  const filteredLoans = bankLoans.filter(l => 
    filterStatus === 'All' ? true : 
    filterStatus === 'Pending' ? (l.status === 'Pending' || l.status === 'Review') :
    l.status === filterStatus
  );

  const getApplicant = (userId: string) => USERS.find(u => u.id === userId);

  const handleDecision = (decision: 'Approved' | 'Rejected') => {
    if (!selectedLoan) return;
    onDecideLoan(selectedLoan.id, decision, notes);
    setSelectedLoan(null);
    setNotes('');
  };

  const getSLAStatus = (dateStr: string) => {
    const elapsed = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60);
    const remaining = 24 - elapsed;
    if (remaining < 4) return { label: 'CRITICAL', color: 'text-red-500 bg-red-50 dark:bg-red-500/10', timeLeft: `${Math.max(0, Math.floor(remaining))}h` };
    if (remaining < 12) return { label: 'URGENT', color: 'text-brand-pewter bg-brand-pewter/10', timeLeft: `${Math.floor(remaining)}h` };
    return { label: 'NORMAL', color: 'text-brand-hooker dark:text-brand-lightgray/40 bg-brand-lightgray/20 dark:bg-white/5', timeLeft: `${Math.floor(remaining)}h` };
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in transition-colors">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-brand-jungle dark:text-white tracking-tighter uppercase transition-colors">Credit Decision Dashboard</h2>
          <p className="text-brand-hooker dark:text-brand-lightgray/60 mt-1 font-medium italic transition-colors">Officer: {user.name} ({user.tier})</p>
        </div>
        
        <div className="flex flex-wrap gap-1 bg-white dark:bg-brand-darksurface rounded-2xl p-1 border border-brand-lightgray/20 dark:border-white/10 shadow-soft transition-colors">
          {(['Pending', 'Approved', 'Rejected', 'All'] as const).map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-4 md:px-5 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                filterStatus === status ? 'bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle shadow-brand' : 'text-brand-hooker dark:text-brand-lightgray/60 hover:text-brand-jungle dark:hover:text-white hover:bg-brand-lightgray/5 dark:hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white dark:bg-brand-darksurface rounded-[2.5rem] shadow-soft border border-brand-lightgray/10 dark:border-white/10 overflow-hidden flex flex-col h-[400px] lg:h-[700px] transition-colors">
           <div className="p-6 border-b border-brand-lightgray/10 dark:border-white/5 bg-brand-lightgray/5 dark:bg-white/5 transition-colors">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-hooker dark:text-brand-lightgray/40 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search Loan ID..." 
                  className="w-full pl-12 pr-4 h-12 bg-white dark:bg-white/5 border border-brand-lightgray/20 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio transition-all text-brand-jungle dark:text-white"
                />
             </div>
           </div>
           <div className="overflow-y-auto flex-1 p-2 space-y-2 no-scrollbar">
             {filteredLoans.length > 0 ? filteredLoans.map(loan => {
               const applicant = getApplicant(loan.userId);
               const sla = getSLAStatus(loan.date);
               const isSelected = selectedLoan?.id === loan.id;
               
               return (
                 <div 
                    key={loan.id} 
                    onClick={() => { setSelectedLoan(loan); setNotes(''); }}
                    className={`p-5 rounded-[2rem] border-2 transition-all cursor-pointer group ${
                      isSelected 
                        ? 'bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle border-brand-jungle dark:border-brand-pistachio shadow-brand' 
                        : 'bg-white dark:bg-brand-darksurface border-transparent dark:border-white/5 hover:border-brand-jungle/20 dark:hover:border-brand-pistachio/20 hover:bg-neutral-50 dark:hover:bg-white/5'
                    }`}
                 >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[9px] font-black tracking-widest uppercase transition-colors ${isSelected ? 'text-white/40 dark:text-brand-jungle/40' : 'text-brand-hooker/40 dark:text-brand-lightgray/20'}`}>{loan.id}</span>
                      {loan.status === 'Pending' || loan.status === 'Review' ? (
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border shadow-sm transition-colors ${sla.color} flex items-center gap-1`}>
                          <Clock size={10} /> {sla.timeLeft}
                        </span>
                      ) : (
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border shadow-sm transition-colors ${
                          loan.status === 'Approved' ? 'bg-brand-pistachio/10 text-brand-pistachio border-brand-pistachio/20' : 'bg-red-50 dark:bg-red-500/10 text-red-500 border-red-100 dark:border-red-500/20'
                        }`}>
                          {loan.status}
                        </span>
                      )}
                    </div>
                    <div className="font-black text-base uppercase tracking-tight leading-tight mb-1 transition-colors break-words">{applicant?.companyName}</div>
                    <div className={`text-[10px] font-bold flex items-center gap-2 transition-colors ${isSelected ? 'text-white/60 dark:text-brand-jungle/60' : 'text-brand-hooker dark:text-brand-lightgray/40'}`}>
                      <Zap size={12} className={isSelected ? 'text-brand-pistachio dark:text-brand-jungle/60' : 'text-brand-pewter'} />
                      GH₵ {loan.amount.toLocaleString()} <span className="opacity-40">•</span> {loan.type}
                    </div>
                 </div>
               );
             }) : (
               <div className="text-center py-20 text-brand-hooker dark:text-white/20 text-xs font-black uppercase tracking-widest px-8">
                 <ShieldCheck size={48} className="mx-auto mb-4 text-brand-lightgray/30 dark:text-white/10" />
                 No loans found
               </div>
             )}
           </div>
        </div>

        <div className="lg:col-span-8 bg-white dark:bg-brand-darksurface rounded-[2.5rem] shadow-soft border border-brand-lightgray/10 dark:border-white/10 flex flex-col min-h-[500px] lg:h-[700px] overflow-hidden relative transition-colors">
          {selectedLoan ? (
            <div className="flex flex-col h-full animate-slide-up">
              <div className="p-6 md:p-8 border-b border-brand-lightgray/10 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-brand-lightgray/5 dark:bg-white/5">
                 <div className="flex items-center gap-4 md:gap-5 w-full sm:w-auto">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-jungle dark:bg-brand-pistachio text-brand-pistachio dark:text-brand-jungle rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                       <FileText size={24} className="md:size-28" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex flex-wrap items-center gap-2 md:gap-3">
                          <h3 className="text-base md:text-xl font-black text-brand-jungle dark:text-white uppercase tracking-tight truncate transition-colors">Loan Application</h3>
                          <span className="bg-brand-lightgray/20 dark:bg-white/5 text-brand-jungle dark:text-brand-lightgray px-2 py-0.5 rounded-lg text-[8px] md:text-[10px] font-black font-mono border border-brand-lightgray/20 dark:border-white/10 tracking-widest shrink-0 transition-colors">{selectedLoan.id}</span>
                       </div>
                       <p className="text-brand-hooker dark:text-brand-lightgray/40 text-[10px] md:text-xs font-medium mt-1 truncate transition-colors">Submitted on {selectedLoan.date}</p>
                    </div>
                 </div>
                 <div className="text-left sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-brand-lightgray/10 dark:border-white/5 transition-colors">
                    <div className="text-2xl md:text-3xl font-black text-brand-jungle dark:text-white tracking-tighter leading-none transition-colors">GH₵ {selectedLoan.amount.toLocaleString()}</div>
                    <div className="text-[9px] md:text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-[0.2em] mt-1 transition-colors">
                        Est. {selectedLoan.interestRate}% APR • {selectedLoan.termMonths} Mo.
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-brand-lightgray/5 dark:bg-white/5 p-6 rounded-[2rem] border border-brand-lightgray/10 dark:border-white/10 transition-colors">
                    <h4 className="text-[10px] font-black text-brand-jungle dark:text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-3 transition-colors">
                      <Building2 size={16} className="text-brand-hooker dark:text-brand-lightgray" /> Applicant Details
                    </h4>
                    {(() => {
                      const applicant = getApplicant(selectedLoan.userId);
                      return applicant ? (
                        <div className="space-y-5">
                          <div>
                            <span className="block text-[9px] text-brand-hooker dark:text-brand-lightgray/40 font-black uppercase tracking-widest mb-1 opacity-60">Company</span>
                            <span className="font-black text-brand-jungle dark:text-white text-base uppercase tracking-tight transition-colors break-words">{applicant.companyName}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-brand-hooker dark:text-brand-lightgray/40 font-black uppercase tracking-widest mb-1 opacity-60">Representative</span>
                            <span className="font-bold text-brand-jungle dark:text-white transition-colors">{applicant.name}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                             <div className="p-4 bg-white dark:bg-brand-darksurface rounded-2xl border border-brand-lightgray/10 dark:border-white/10 shadow-sm transition-colors">
                                <span className="block text-[8px] text-brand-hooker dark:text-brand-lightgray/60 font-black uppercase tracking-widest mb-1 transition-colors">Credit Score</span>
                                <div className="flex items-center gap-2">
                                   <span className={`text-xl font-black ${applicant.creditScore && applicant.creditScore > 700 ? 'text-brand-pistachio' : 'text-brand-pewter'}`}>{applicant.creditScore}</span>
                                   <TrendingUp size={14} className="text-brand-pistachio" />
                                </div>
                             </div>
                             <div className="p-4 bg-white dark:bg-brand-darksurface rounded-2xl border border-brand-lightgray/10 dark:border-white/10 shadow-sm transition-colors">
                                <span className="block text-[8px] text-brand-hooker dark:text-brand-lightgray/60 font-black uppercase tracking-widest mb-1 transition-colors">Tier</span>
                                <span className="font-black text-brand-jungle dark:text-white text-xs uppercase tracking-widest transition-colors">{applicant.tier}</span>
                             </div>
                          </div>
                        </div>
                      ) : <div className="text-red-500 font-black uppercase text-[10px]">Entity Data Corrupted</div>
                    })()}
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-brand-jungle dark:text-white uppercase tracking-[0.3em] mb-4 flex items-center gap-3 transition-colors">
                      <AlertTriangle size={16} className="text-brand-pewter" /> Credit Risk Factors
                    </h4>
                    {(() => {
                      const applicant = getApplicant(selectedLoan.userId);
                      return applicant ? (
                         <div className="scale-95 origin-top-left">
                            <CreditScoreBreakdown score={applicant.creditScore || 0} factors={CREDIT_FACTORS} />
                         </div>
                      ) : null;
                    })()}
                  </div>
                </div>

                {(selectedLoan.status === 'Pending' || selectedLoan.status === 'Review') && (
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-brand-jungle dark:text-white uppercase tracking-[0.3em] ml-1 transition-colors">Decision Notes</label>
                    <textarea 
                      className="w-full bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/10 dark:border-white/10 rounded-[2rem] p-6 text-sm font-medium focus:border-brand-jungle dark:focus:border-brand-pistachio focus:bg-white dark:focus:bg-white/10 outline-none transition-all h-32 resize-none text-brand-jungle dark:text-white placeholder:text-brand-hooker/30 dark:placeholder:text-white/20"
                      placeholder="Input justification for protocol override or approval..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                )}
              </div>

              {(selectedLoan.status === 'Pending' || selectedLoan.status === 'Review') ? (
                <div className="p-6 md:p-8 border-t border-brand-lightgray/10 dark:border-white/5 bg-brand-lightgray/5 dark:bg-white/5 flex flex-col sm:flex-row gap-4 md:gap-5 transition-colors">
                  <button 
                    type="button"
                    onClick={() => handleDecision('Rejected')}
                    className="flex-1 py-4 border-2 border-red-500 text-red-500 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <X size={18} className="stroke-[3px]" /> Reject Application
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDecision('Approved')}
                    className="flex-1 py-4 md:py-5 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-hooker dark:hover:bg-white transition-all flex items-center justify-center gap-3 shadow-brand active:scale-[0.98]"
                  >
                    <Check size={20} className="stroke-[3px]" /> Approve Loan
                  </button>
                </div>
              ) : (
                <div className="p-10 border-t border-brand-lightgray/10 dark:border-white/5 bg-brand-lightgray/5 dark:bg-white/5 text-center transition-colors">
                   <div className="flex items-center justify-center gap-3 mb-2">
                      <div className={`w-2 h-2 rounded-full ${selectedLoan.status === 'Approved' ? 'bg-brand-pistachio' : 'bg-red-500'}`}></div>
                      <p className="text-[11px] text-brand-hooker dark:text-brand-lightgray font-black uppercase tracking-[0.4em] transition-colors">
                        Status: <span className={selectedLoan.status === 'Approved' ? 'text-brand-pistachio' : 'text-red-500'}>{selectedLoan.status}</span>
                      </p>
                   </div>
                   <p className="text-[10px] text-brand-hooker/60 dark:text-white/20 font-bold uppercase tracking-widest italic mt-2 transition-colors">No further administrative actions permitted for this session.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 transition-colors">
               <div className="w-24 h-24 bg-brand-jungle/5 dark:bg-white/5 text-brand-jungle/10 dark:text-white/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-brand-lightgray/20 dark:border-white/10">
                 <ShieldCheck size={48} className="animate-pulse" />
               </div>
               <h3 className="text-2xl font-black text-brand-jungle dark:text-white uppercase tracking-tight transition-colors">Ready</h3>
               <p className="text-brand-hooker dark:text-brand-lightgray/60 max-w-sm mx-auto mt-4 text-sm font-medium leading-relaxed transition-colors">Select a loan from the list to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
