
import React from 'react';
import { CreditScoreFactor } from '../types';
import { AlertTriangle, CheckCircle, TrendingUp, Info, Activity, ShieldCheck } from 'lucide-react';

interface CreditScoreBreakdownProps {
  score: number;
  factors: CreditScoreFactor[];
}

export const CreditScoreBreakdown: React.FC<CreditScoreBreakdownProps> = ({ score, factors }) => {
  return (
    <div className="space-y-8 p-6 md:p-0 transition-colors duration-300">
       <div className="flex items-center justify-between">
         <h4 className="text-[11px] font-black text-brand-jungle dark:text-white uppercase tracking-[0.3em] flex items-center gap-3 transition-colors">
           <Activity size={16} className="text-brand-pistachio" /> Credit Assessment
         </h4>
         <div className="text-[9px] bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle px-3 py-1 rounded-lg font-black tracking-widest uppercase shadow-brand border border-white/10 dark:border-brand-jungle/10 transition-colors">Version 2.5.11</div>
       </div>

       <div className="grid grid-cols-1 gap-5">
          {factors.map((factor, idx) => (
             <div key={idx} className="bg-brand-lightgray/5 dark:bg-white/5 rounded-3xl p-6 border border-brand-lightgray/10 dark:border-white/10 transition-all hover:border-brand-pistachio/30 group">
               <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-brand-jungle dark:text-white text-xs uppercase tracking-tight transition-colors">{factor.category}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg border shadow-sm transition-colors ${
                       factor.score >= 80 ? 'bg-brand-pistachio/10 text-brand-pistachio border-brand-pistachio/30 shadow-pistachio-glow' :
                       factor.score >= 60 ? 'bg-brand-hooker/10 text-brand-hooker dark:text-brand-lightgray border-brand-hooker/30' :
                       'bg-red-50 dark:bg-red-500/10 text-red-500 border-red-100 dark:border-red-500/20'
                    }`}>{factor.score} / 100</span>
                  </div>
               </div>
               
               <div className="w-full bg-brand-lightgray/20 dark:bg-white/5 h-2 rounded-full overflow-hidden mb-4 p-[1.5px] border border-brand-lightgray/20 dark:border-white/5 transition-colors">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      factor.score >= 80 ? 'bg-brand-pistachio shadow-pistachio-glow' :
                      factor.score >= 60 ? 'bg-brand-hooker shadow-lg' : 'bg-red-500 shadow-lg'
                    }`}
                    style={{width: `${factor.score}%`}}
                  ></div>
               </div>
               
               <div className="flex items-start gap-3">
                  {factor.score >= 80 ? (
                    <div className="w-4 h-4 rounded-full bg-brand-pistachio/20 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                       <CheckCircle size={12} className="text-brand-pistachio" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-brand-pewter/20 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                       <AlertTriangle size={12} className="text-brand-pewter dark:text-brand-lightgray/40" />
                    </div>
                  )}
                  <p className="text-[11px] text-brand-hooker dark:text-brand-lightgray/60 font-bold uppercase tracking-wide leading-tight transition-colors">{factor.details}</p>
               </div>
             </div>
          ))}
       </div>
       
       <div className="bg-brand-jungle dark:bg-white/5 p-6 rounded-[2rem] flex gap-4 items-start shadow-brand border border-white/5 dark:border-white/10 relative overflow-hidden transition-colors">
         <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pistachio/10 rounded-full blur-2xl -mr-16 -mt-16 transition-colors"></div>
         <div className="w-10 h-10 bg-white/10 dark:bg-brand-pistachio rounded-2xl flex items-center justify-center shrink-0 border border-white/20 dark:border-brand-jungle/10 relative z-10 transition-colors">
           <ShieldCheck size={20} className="text-brand-pistachio dark:text-brand-jungle" />
         </div>
         <div className="relative z-10">
           <h5 className="text-[10px] font-black text-brand-pistachio uppercase tracking-widest mb-1 transition-colors">Risk Analysis</h5>
           <p className="text-[11px] text-brand-lightgray dark:text-white/60 font-medium leading-relaxed transition-colors">
             Scoring shows high correlation with documentation precision. Achieving a <span className="text-white dark:text-brand-pistachio font-black underline decoration-brand-pistachio transition-colors">90% accuracy rate</span> on DEDCP filings will likely elevate overall tier status in 3 cycles.
           </p>
         </div>
       </div>
    </div>
  );
};
