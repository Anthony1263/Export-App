
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, CheckCircle, Info, X, Building2, Calendar, CreditCard, ChevronRight, FileText, Zap, ShieldCheck } from 'lucide-react';
import { CREDIT_HISTORY, CREDIT_FACTORS } from '../constants';
import { User, LoanApplication, LoanPurpose } from '../types';
import { CreditScoreBreakdown } from './CreditScoreBreakdown';

interface IfcmsProps {
  user: User;
  loans: LoanApplication[];
  onAddLoan: (loan: Omit<LoanApplication, 'id' | 'userId' | 'status' | 'date' | 'interestRate'>) => void;
  onShowToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

const INSTITUTIONS = [
  'GEPA Export Fund',
  'Exim Bank Ghana',
  'GCB Bank',
  'Ecobank Ghana',
  'Fidelity Bank',
  'Stanbic Bank'
];

export const IfcmsModule: React.FC<IfcmsProps> = ({ user, loans, onAddLoan, onShowToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [showScoreDetails, setShowScoreDetails] = useState(false);
  
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState<LoanPurpose>('Working Capital');
  const [institution, setInstitution] = useState(INSTITUTIONS[0]);

  const currentScore = user.creditScore || 0;
  const maxScore = 900;
  const percentage = (currentScore / maxScore) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    onAddLoan({ amount: parseFloat(amount), type: purpose, institution: institution });
    setAmount('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 relative transition-colors duration-300 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-jungle dark:text-white tracking-tighter uppercase transition-colors">Finance Dashboard</h2>
          <p className="text-brand-hooker dark:text-brand-lightgray/60 mt-1 font-medium transition-colors">Manage credit and applications.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-hooker dark:hover:bg-white transition-all shadow-brand flex items-center justify-center gap-2 w-full md:w-auto active:scale-95"
        >
          <DollarSign size={16} /> New Application
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div 
          onClick={() => setShowScoreDetails(!showScoreDetails)}
          className="bg-white dark:bg-brand-darksurface p-8 rounded-[3rem] shadow-brand border border-brand-lightgray/30 dark:border-white/10 flex flex-col items-center justify-center relative overflow-hidden transition-all cursor-pointer hover:border-brand-pistachio active:scale-[0.98]"
        >
           <div className="absolute top-6 right-6 text-brand-hooker/40 dark:text-white/20">
             {showScoreDetails ? <X size={18} /> : <Info size={18} />}
           </div>
           
           {!showScoreDetails ? (
             <div className="animate-fade-in w-full flex flex-col items-center">
                <h3 className="text-brand-hooker dark:text-brand-lightgray/60 text-[10px] font-black uppercase tracking-[0.3em] mb-8 transition-colors text-center">Credit Score</h3>
                <div className="relative w-56 h-56 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" className="stroke-brand-lightgray/20 dark:stroke-white/5" strokeWidth="6" />
                      <circle 
                          cx="50" cy="50" r="45" fill="none" 
                          className="stroke-brand-pistachio"
                          strokeWidth="6" 
                          strokeDasharray={`${percentage * 2.83} 283`}
                          strokeLinecap="round"
                          style={{ filter: 'drop-shadow(0 0 4px #9CC97F55)' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-black text-brand-jungle dark:text-white tracking-tighter transition-colors">{currentScore}</span>
                      <span className="text-[10px] text-brand-hooker dark:text-brand-lightgray/60 font-black uppercase tracking-widest mt-1 transition-colors">{user.tier}</span>
                    </div>
                </div>
                <div className="w-full mt-10 space-y-4 bg-brand-lightgray/5 dark:bg-white/5 p-6 rounded-3xl border border-brand-lightgray/10 dark:border-white/10 transition-colors">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                      <span className="text-brand-hooker dark:text-brand-lightgray/40">Max Capacity</span>
                      <span className="text-brand-jungle dark:text-white">GH₵ 250,000</span>
                    </div>
                    <div className="w-full h-px bg-brand-lightgray/10 dark:bg-white/5"></div>
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                      <span className="text-brand-hooker dark:text-brand-lightgray/40">Interest Rate</span>
                      <span className="text-brand-pistachio">15-18%</span>
                    </div>
                </div>
                <div className="mt-6 text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 group-hover:text-brand-jungle dark:group-hover:text-white uppercase tracking-widest flex items-center gap-2">
                  View Breakdown <ChevronRight size={14} />
                </div>
             </div>
           ) : (
             <div className="w-full animate-fade-in transition-colors">
               <button onClick={(e) => { e.stopPropagation(); setShowScoreDetails(false); }} className="mb-8 text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 hover:text-brand-jungle dark:hover:text-white flex items-center gap-3 uppercase tracking-widest transition-colors">
                 <X size={14} /> Close
               </button>
               <div className="scale-95 origin-top-left">
                  <CreditScoreBreakdown score={currentScore} factors={CREDIT_FACTORS} />
               </div>
             </div>
           )}
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-brand-darksurface p-8 rounded-[3rem] shadow-brand border border-brand-lightgray/30 dark:border-white/10 transition-colors">
           <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-brand-jungle dark:text-white text-lg uppercase tracking-tight transition-colors">Score History</h3>
                <span className="text-[10px] text-brand-hooker dark:text-brand-lightgray/60 font-black px-4 py-1.5 bg-brand-lightgray/10 dark:bg-white/5 rounded-full uppercase tracking-widest transition-colors">Credit History</span>
           </div>
           
           <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CREDIT_HISTORY}>
                <defs>
                  <linearGradient id="colorScore" x1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9CC97F" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#9CC97F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(18, 43, 29, 0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CC97F', fontSize: 10, fontWeight: 900}} dy={10} />
                <YAxis domain={[500, 900]} axisLine={false} tickLine={false} tick={{fill: '#9CC97F', fontSize: 10, fontWeight: 900}} />
                <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', backgroundColor: '#122B1D', color: '#fff', boxShadow: '0 10px 25px rgba(18, 43, 29, 0.1)', fontWeight: 'black', fontSize: '12px'}}
                    cursor={{stroke: '#9CC97F', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="score" stroke="#9CC97F" fillOpacity={1} fill="url(#colorScore)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-brand-darksurface p-8 rounded-[3rem] shadow-brand border border-brand-lightgray/30 dark:border-white/10 transition-colors">
          <h3 className="font-black text-brand-jungle dark:text-white text-lg uppercase tracking-tight mb-8 transition-colors">Loan Applications</h3>
          <div className="space-y-4">
            {loans.length > 0 ? loans.map(loan => (
              <div 
                key={loan.id} 
                onClick={() => setSelectedLoan(loan)}
                className="border-2 border-brand-lightgray/10 dark:border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-jungle dark:hover:border-brand-pistachio hover:bg-brand-lightgray/5 dark:hover:bg-white/5 transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div className="flex gap-5 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-brand-lightgray/10 dark:bg-white/5 flex items-center justify-center text-brand-hooker dark:text-brand-lightgray/40 group-hover:bg-brand-jungle dark:group-hover:bg-brand-pistachio group-hover:text-white dark:group-hover:text-brand-jungle transition-colors">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-black text-brand-jungle dark:text-white uppercase tracking-tight transition-colors">{loan.institution}</div>
                        <div className="text-[10px] text-brand-hooker dark:text-brand-lightgray/40 font-bold uppercase tracking-widest mt-1 transition-colors">{loan.type} • {loan.date}</div>
                    </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                  <div className="font-black text-brand-jungle dark:text-white text-base transition-colors">GH₵ {loan.amount.toLocaleString()}</div>
                  <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest border transition-colors ${
                    loan.status === 'Approved' ? 'bg-brand-pistachio/10 text-brand-pistachio border-brand-pistachio/30 shadow-pistachio-glow' :
                    loan.status === 'Pending' ? 'bg-brand-lightgray/10 text-brand-hooker border-brand-lightgray/30' :
                    'bg-red-50 dark:bg-red-500/10 text-red-500 border-red-100 dark:border-red-500/30'
                  }`}>
                    {loan.status}
                  </span>
                </div>
              </div>
            )) : <div className="text-center py-12 text-brand-hooker dark:text-white/20 text-xs font-black uppercase tracking-widest transition-colors">No Active Loans.</div>}
          </div>
        </div>

        <div className="bg-brand-jungle dark:bg-brand-jungle/80 p-8 rounded-[3rem] shadow-brand border border-white/5 relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pistachio/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <h3 className="font-black text-white text-lg uppercase tracking-tight mb-8 relative z-10 transition-colors">Insights</h3>
          <div className="space-y-4 relative z-10">
            <div 
              onClick={() => onShowToast("Export consistency analyzed. Regular shipping provides 15% leverage.", "success")}
              className="flex gap-5 items-start p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <CheckCircle size={24} className="text-brand-pistachio mt-0.5 shrink-0 transition-transform group-hover:scale-110" />
              <div>
                <p className="text-xs font-black text-white uppercase tracking-[0.2em] transition-colors">Improve Credit Standing</p>
                <p className="text--[10px] text-brand-lightgray font-medium mt-2 leading-relaxed opacity-60 transition-colors">Regular shipments (avg 2/month) increase vetting reliability by ~15%.</p>
              </div>
            </div>
            <div 
              onClick={() => onShowToast("DEDCP accuracy check engaged. Zero-error status is within reach.", "success")}
              className="flex gap-5 items-start p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <CheckCircle size={24} className="text-brand-pistachio mt-0.5 shrink-0 transition-transform group-hover:scale-110" />
              <div>
                <p className="text-xs font-black text-white uppercase tracking-[0.2em] transition-colors">Documentation Quality</p>
                <p className="text-[10px] text-brand-lightgray font-medium mt-2 leading-relaxed opacity-60 transition-colors">Zero error rate in manifests over 60 days unlocks better funding rates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-jungle/60 z-50 flex items-center justify-center p-6 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-brand-darksurface rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-modal-in border border-brand-lightgray/20 dark:border-white/10 transition-colors">
            <div className="px-10 py-8 border-b border-brand-lightgray/10 dark:border-white/5 flex justify-between items-center bg-brand-lightgray/5 dark:bg-white/5 transition-colors">
              <h3 className="font-black text-brand-jungle dark:text-white text-xl uppercase tracking-tight transition-colors">New Application</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-brand-hooker dark:text-brand-lightgray/60 hover:text-brand-jungle dark:hover:text-white transition-colors">
                <X size={28} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-widest ml-1 mb-2 transition-colors">Financial Institution</label>
                <select 
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-14 px-6 text-sm font-bold text-brand-jungle dark:text-white outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio transition-all"
                >
                  {INSTITUTIONS.map(inst => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-widest ml-1 mb-2 transition-colors">Loan Amount (GH₵)</label>
                <input 
                  type="number" required value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-14 px-6 text-sm font-bold text-brand-jungle dark:text-white outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio transition-all placeholder:text-brand-hooker/20 dark:placeholder:text-white/10"
                  placeholder="e.g. 50000"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-widest ml-1 mb-2 transition-colors">Purpose</label>
                <select 
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as LoanPurpose)}
                  className="w-full bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-14 px-6 text-sm font-bold text-brand-jungle dark:text-white outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio transition-all"
                >
                  <option value="Working Capital">Working Capital</option>
                  <option value="Export Goods">Export Goods</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Trade Credit Insurance">Trade Credit Insurance</option>
                </select>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-hooker dark:text-brand-lightgray/60 hover:bg-brand-lightgray/5 dark:hover:bg-white/5 transition-all transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-hooker dark:hover:bg-white shadow-brand transition-all transition-colors active:scale-[0.98]">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Loan Detail Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-brand-jungle/60 z-[150] flex items-center justify-center p-6 backdrop-blur-md animate-fade-in">
           <div className="bg-white dark:bg-brand-darksurface rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-brand-lightgray/20 dark:border-white/10 animate-modal-in transition-colors">
              <div className="p-8 border-b border-brand-lightgray/10 dark:border-white/5 flex justify-between items-center bg-brand-lightgray/5 dark:bg-white/5">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-jungle dark:bg-brand-pistachio text-brand-pistachio dark:text-brand-jungle rounded-2xl flex items-center justify-center shadow-lg">
                       <FileText size={24} />
                    </div>
                    <div>
                       <h3 className="font-black text-brand-jungle dark:text-white text-lg uppercase tracking-tight leading-none">Loan Details</h3>
                       <p className="text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-widest mt-1.5">{selectedLoan.id}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedLoan(null)} className="text-brand-hooker dark:text-brand-lightgray/60 hover:text-brand-jungle dark:hover:text-white transition-colors">
                    <X size={28} />
                 </button>
              </div>
              
              <div className="p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brand-lightgray/5 dark:bg-white/5 p-4 rounded-2xl border border-brand-lightgray/10 dark:border-white/10">
                       <span className="text-[9px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-widest block mb-1">Status</span>
                       <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                           selectedLoan.status === 'Approved' ? 'bg-brand-pistachio/10 text-brand-pistachio border-brand-pistachio/30' : 
                           selectedLoan.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                           'bg-brand-lightgray/10 text-brand-hooker border-brand-lightgray/30'
                       }`}>
                          {selectedLoan.status === 'Approved' && <CheckCircle size={12} />}
                          {selectedLoan.status}
                       </div>
                    </div>
                    <div className="bg-brand-lightgray/5 dark:bg-white/5 p-4 rounded-2xl border border-brand-lightgray/10 dark:border-white/10">
                       <span className="text-[9px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-widest block mb-1">Loan Amount</span>
                       <span className="text-xl font-black text-brand-jungle dark:text-white tracking-tighter">GH₵ {selectedLoan.amount.toLocaleString()}</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border border-brand-lightgray/10 dark:border-white/5 rounded-2xl hover:bg-brand-lightgray/5 dark:hover:bg-white/5 transition-colors">
                       <Building2 size={20} className="text-brand-hooker dark:text-brand-lightgray" />
                       <div className="flex-1">
                          <p className="text-[9px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-widest">Bank</p>
                          <p className="font-bold text-brand-jungle dark:text-white">{selectedLoan.institution}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border border-brand-lightgray/10 dark:border-white/5 rounded-2xl hover:bg-brand-lightgray/5 dark:hover:bg-white/5 transition-colors">
                       <Calendar size={20} className="text-brand-hooker dark:text-brand-lightgray" />
                       <div className="flex-1">
                          <p className="text-[9px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-widest">Application Date</p>
                          <p className="font-bold text-brand-jungle dark:text-white">{selectedLoan.date}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border border-brand-lightgray/10 dark:border-white/5 rounded-2xl hover:bg-brand-lightgray/5 dark:hover:bg-white/5 transition-colors">
                       <Zap size={20} className="text-brand-hooker dark:text-brand-lightgray" />
                       <div className="flex-1">
                          <p className="text-[9px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-widest">Purpose</p>
                          <p className="font-bold text-brand-jungle dark:text-white">{selectedLoan.type}</p>
                       </div>
                    </div>
                 </div>

                 {selectedLoan.decisionNotes && (
                    <div className="bg-brand-lightgray/10 dark:bg-white/5 p-6 rounded-2xl border border-brand-lightgray/20 dark:border-white/10">
                       <h4 className="text-[9px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <ShieldCheck size={12} /> Officer Notes
                       </h4>
                       <p className="text-xs font-medium text-brand-jungle dark:text-white leading-relaxed italic">"{selectedLoan.decisionNotes}"</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
