
import React, { useState } from 'react';
import { User, CreditCard, Bell, Lock, Mail, ShieldAlert, ShieldCheck, CheckCircle, Activity } from 'lucide-react';
import { User as UserType, AuditLog } from '../types';
import { AuditLogViewer } from './AuditLogViewer';

interface SettingsProps {
  user: UserType;
  auditLogs?: AuditLog[];
}

export const SettingsModule: React.FC<SettingsProps> = ({ user, auditLogs = [] }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'audit'>('profile');

  const tabClass = (tab: typeof activeTab) => 
    `w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 flex items-center gap-4 text-[11px] font-black uppercase tracking-widest ${
      activeTab === tab 
      ? 'bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle shadow-brand scale-[1.02]' 
      : 'text-brand-hooker dark:text-brand-lightgray/60 hover:bg-brand-lightgray/10 dark:hover:bg-white/10 hover:text-brand-jungle dark:hover:text-white'
    }`;

  return (
    <div className="space-y-8 pb-20 animate-fade-in transition-colors">
      <div>
        <h2 className="text-3xl font-black text-brand-jungle dark:text-white tracking-tighter uppercase transition-colors">Settings</h2>
        <p className="text-brand-hooker dark:text-brand-lightgray/60 mt-1 font-medium italic transition-colors">User Account: <span className="font-bold text-brand-jungle dark:text-brand-pistachio transition-colors">{user.name}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3 space-y-3">
           <button onClick={() => setActiveTab('profile')} className={tabClass('profile')}>
             <User size={18} /> Profile
           </button>
           <button onClick={() => setActiveTab('security')} className={tabClass('security')}>
             <Lock size={18} /> Security
           </button>
           <button onClick={() => setActiveTab('audit')} className={tabClass('audit')}>
             <ShieldAlert size={18} /> Audit Logs
           </button>
           
           <div className="mt-10 p-6 bg-brand-pistachio/5 dark:bg-white/5 rounded-[2rem] border border-brand-pistachio/20 dark:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-4 text-brand-pistachio">
                 <ShieldCheck size={20} />
                 <span className="text-[10px] font-black uppercase tracking-widest transition-colors">Verification Status</span>
              </div>
              <p className="text-[11px] font-bold text-brand-jungle dark:text-white uppercase tracking-widest transition-colors">Verified Entity</p>
              <div className="mt-4 flex items-center gap-2">
                 <div className="flex-1 h-1.5 bg-brand-pistachio/20 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-pistachio w-full shadow-pistachio-glow"></div>
                 </div>
                 <span className="text-[9px] font-black text-brand-pistachio uppercase">100%</span>
              </div>
           </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-brand-darksurface p-10 rounded-[3rem] border border-brand-lightgray/10 dark:border-white/10 shadow-soft animate-slide-up transition-colors">
              <div className="flex items-center gap-8 mb-10 pb-10 border-b border-brand-lightgray/10 dark:border-white/5 transition-colors">
                 <div className="w-24 h-24 rounded-3xl bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle flex items-center justify-center text-3xl font-black shadow-brand relative group cursor-pointer overflow-hidden transition-colors">
                   <span className="group-hover:opacity-0 transition-opacity">{user.avatarInitials}</span>
                   <div className="absolute inset-0 bg-brand-pistachio/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Activity size={32} className="text-brand-jungle" />
                   </div>
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-brand-jungle dark:text-white uppercase tracking-tight mb-2 transition-colors">Profile Details</h3>
                   <button className="text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 border-2 border-brand-lightgray/30 dark:border-white/10 px-6 py-2 rounded-xl hover:border-brand-jungle dark:hover:border-brand-pistachio hover:text-brand-jungle dark:hover:text-brand-pistachio transition-all uppercase tracking-widest">Change Avatar</button>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-widest ml-1 transition-colors">Company Name</label>
                  <input type="text" value={user.companyName} readOnly className="w-full bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-14 px-6 text-sm font-bold text-brand-hooker dark:text-brand-lightgray/60 outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-widest ml-1 transition-colors">Full Name</label>
                  <input type="text" value={user.name} readOnly className="w-full bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-14 px-6 text-sm font-bold text-brand-hooker dark:text-brand-lightgray/60 outline-none transition-colors" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-widest ml-1 transition-colors">Email Address</label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-lightgray dark:text-white/20 transition-colors" />
                    <input type="email" value={user.email} readOnly className="w-full bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-14 pl-14 pr-4 text-sm font-bold text-brand-hooker dark:text-brand-lightgray/60 outline-none transition-colors" />
                  </div>
                </div>
              </div>
              
              <div className="mt-12 flex justify-end">
                 <button className="bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-brand-hooker dark:hover:bg-white transition-all shadow-brand">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
             <div className="animate-slide-up transition-colors">
               <AuditLogViewer logs={auditLogs} />
             </div>
          )}

          {activeTab === 'security' && (
             <div className="bg-white dark:bg-brand-darksurface p-10 rounded-[3rem] border border-brand-lightgray/10 dark:border-white/10 shadow-soft space-y-10 animate-slide-up transition-colors">
                <div>
                   <h3 className="text-xl font-black text-brand-jungle dark:text-white uppercase tracking-tight mb-2 transition-colors">Security Settings</h3>
                   <p className="text-sm text-brand-hooker dark:text-brand-lightgray/60 font-medium transition-colors">Manage encryption keys and access protocols.</p>
                </div>
                
                <div className="space-y-4">
                   <div className="flex justify-between items-center p-6 bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/10 dark:border-white/5 rounded-[2rem] hover:border-brand-jungle/20 dark:hover:border-brand-pistachio/20 transition-all group">
                      <div>
                        <div className="text-sm font-black text-brand-jungle dark:text-white uppercase tracking-tight transition-colors">Two-Factor Authentication</div>
                        <div className="text-[10px] text-brand-hooker dark:text-brand-lightgray/60 font-bold uppercase tracking-widest mt-1 transition-colors">Two-factor authentication enabled</div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-brand-pistachio uppercase tracking-widest bg-brand-pistachio/10 px-4 py-2 rounded-xl border border-brand-pistachio/20 transition-colors">
                         <CheckCircle size={14} /> ACTIVE
                      </div>
                   </div>

                   <div className="flex justify-between items-center p-6 bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/10 dark:border-white/5 rounded-[2rem] hover:border-brand-jungle/20 dark:hover:border-brand-pistachio/20 transition-all group">
                      <div>
                        <div className="text-sm font-black text-brand-jungle dark:text-white uppercase tracking-tight transition-colors">Session Timeout</div>
                        <div className="text-[10px] text-brand-hooker dark:text-brand-lightgray/60 font-bold uppercase tracking-widest mt-1 transition-colors">Automatically log out inactive users</div>
                      </div>
                      <select className="bg-white dark:bg-brand-darkbg border-2 border-brand-lightgray/20 dark:border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio text-brand-jungle dark:text-white transition-colors">
                        <option>15 mins</option>
                        <option>30 mins</option>
                        <option>1 hour</option>
                      </select>
                   </div>
                   
                   <div className="flex justify-between items-center p-6 bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/10 dark:border-white/5 rounded-[2rem] hover:border-brand-jungle/20 dark:hover:border-brand-pistachio/20 transition-all group">
                      <div>
                        <div className="text-sm font-black text-brand-jungle dark:text-white uppercase tracking-tight transition-colors">Rotate API Keys</div>
                        <div className="text-[10px] text-brand-hooker dark:text-brand-lightgray/60 font-bold uppercase tracking-widest mt-1 transition-colors">Regularly update access tokens</div>
                      </div>
                      <button className="text-[10px] font-black text-brand-jungle dark:text-brand-pistachio border-2 border-brand-jungle dark:border-brand-pistachio px-5 py-2 rounded-xl hover:bg-brand-jungle dark:hover:bg-brand-pistachio hover:text-white dark:hover:text-brand-jungle transition-all uppercase tracking-widest">Initialize</button>
                   </div>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
