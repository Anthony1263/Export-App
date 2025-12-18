
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { USERS } from '../constants';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { IllusGlobe, IllusBank, IllusShield, IllusDashboard, GepaLogo } from './CustomIcons';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const ONBOARDING_SLIDES = [
  {
    id: 'exporter',
    role: 'Exporters',
    Illustration: IllusGlobe,
    title: 'Find Global Buyers',
    description: 'Connect directly with international markets. Access real-time demand data and secure your next big contract.',
    color: 'text-brand-jungle dark:text-brand-pistachio'
  },
  {
    id: 'bank',
    role: 'Financial Institutions',
    Illustration: IllusBank,
    title: 'Risk-Free Financing',
    description: 'Lend with confidence using AI-driven credit scoring and verifiable trade history.',
    color: 'text-brand-hooker dark:text-brand-lightgray'
  },
  {
    id: 'government',
    role: 'Government Agencies',
    Illustration: IllusShield,
    title: 'Digital Compliance',
    description: 'Streamline regulatory oversight. Issue e-certificates and manage inspections through a unified workflow.',
    color: 'text-brand-pistachio dark:text-brand-pistachio'
  },
  {
    id: 'gepa_staff',
    role: 'GEPA Administration',
    Illustration: IllusDashboard,
    title: 'Ecosystem Oversight',
    description: 'Gain a bird\'s-eye view of national export performance and drive strategic growth from one center.',
    color: 'text-brand-pewter dark:text-brand-pewter'
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [view, setView] = useState<'splash' | 'onboarding' | 'login'>('splash');
  const [slideIndex, setSlideIndex] = useState(0);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemoCreds, setShowDemoCreds] = useState(false);

  useEffect(() => {
    if (view === 'splash') {
      const timer = setTimeout(() => setView('onboarding'), 3000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const activeSlide = ONBOARDING_SLIDES[slideIndex];

  const handleNext = () => {
    if (slideIndex < ONBOARDING_SLIDES.length - 1) {
      setSlideIndex(prev => prev + 1);
    } else {
      setView('login');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials. Check demo accounts below.');
    }
  };

  const fillCredentials = (user: User) => {
    setEmail(user.email);
    setPassword('password123');
    setError('');
  };

  if (view === 'splash') {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-brand-darkbg p-6 animate-fade-in transition-colors duration-500">
        <GepaLogo size={200} showText />
        <p className="mt-12 text-[10px] font-black tracking-[0.4em] uppercase text-brand-jungle dark:text-brand-pistachio opacity-40 animate-pulse transition-colors">
          Initializing System...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full font-sans overflow-x-hidden text-brand-jungle dark:text-white transition-colors duration-300">
       {view === 'onboarding' ? (
         <div className="min-h-screen w-full flex flex-col bg-white dark:bg-brand-darkbg relative transition-colors duration-500">
            <div className="flex-1 flex flex-col p-6 md:p-12 lg:p-16 max-w-7xl mx-auto w-full justify-between relative z-10">
                <div className="flex justify-between items-center shrink-0">
                    <GepaLogo size={48} />
                    <button onClick={() => setView('login')} className="text-[11px] font-black text-brand-jungle/40 dark:text-white/40 hover:text-brand-jungle dark:hover:text-white transition-colors tracking-widest px-6 py-2.5 rounded-xl border border-brand-lightgray/30 dark:border-white/10 uppercase transition-all">Skip Intro</button>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center max-w-2xl mx-auto w-full py-8 md:py-0">
                     <div key={slideIndex} className="mb-12 transition-all duration-700 relative flex items-center justify-center">
                          <activeSlide.Illustration 
                            className={`${activeSlide.color} transition-all duration-700 animate-in fade-in zoom-in-95 w-48 h-48 md:w-80 md:h-80 relative z-10`} 
                          />
                     </div>
                     
                     <h2 key={`title-${slideIndex}`} className="text-4xl md:text-6xl font-black text-brand-jungle dark:text-white mb-6 tracking-tighter leading-none animate-in slide-in-from-bottom-2 duration-500 uppercase transition-colors">
                         {activeSlide.title}
                     </h2>
                     <p key={`desc-${slideIndex}`} className="text-brand-hooker dark:text-brand-lightgray/60 text-base md:text-lg leading-relaxed max-w-lg mx-auto px-4 animate-in fade-in slide-in-from-bottom-2 duration-700 font-medium transition-colors">
                         {activeSlide.description}
                     </p>
                </div>

                <div className="w-full max-w-md mx-auto space-y-8 shrink-0 pb-12">
                    <div className="flex justify-center gap-3">
                        {ONBOARDING_SLIDES.map((_, idx) => (
                            <div key={idx} className={`h-2 rounded-full transition-all duration-500 ${idx === slideIndex ? 'w-12 bg-brand-jungle dark:bg-brand-pistachio shadow-brand' : 'w-2 bg-brand-lightgray dark:bg-white/10'}`} />
                        ))}
                    </div>
                    <button onClick={handleNext} className="w-full bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle py-5 rounded-2xl font-black text-base tracking-widest shadow-brand hover:bg-brand-hooker dark:hover:bg-white transition-all active:scale-[0.98] uppercase">
                        {slideIndex === ONBOARDING_SLIDES.length - 1 ? 'Enter Portal' : 'Next Step'}
                    </button>
                </div>
            </div>
         </div>
       ) : (
         <div className="min-h-screen w-full flex flex-col md:flex-row animate-fade-in transition-colors duration-300">
            {/* Split Screen Side - Solid Jungle */}
            <div className="w-full md:w-5/12 lg:w-4/12 bg-brand-jungle text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden shrink-0 border-r border-white/5 transition-colors">
               <div className="absolute inset-0 opacity-10 pointer-events-none">
                  {/* Subtle geometric pattern */}
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
               </div>
               <div className="relative z-10 py-8 md:py-0">
                 <button onClick={() => setView('onboarding')} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 text-[10px] font-black uppercase tracking-[0.3em] group w-fit">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Introduction
                 </button>
                 <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-10 shadow-2xl p-3 border border-white/20 transform -rotate-3 transition-all backdrop-blur-sm">
                    <GepaLogo size={64} />
                 </div>
                 <h1 className="text-5xl md:text-7xl font-black leading-[0.9] mb-6 tracking-tighter uppercase transition-colors">Authorized<br/>Access.</h1>
                 <p className="text-brand-pistachio/80 text-sm md:text-base leading-relaxed max-w-xs font-medium transition-colors">Verify your credentials to initialize system access.</p>
               </div>
               <div className="relative z-10 hidden md:block">
                  <div className="flex items-center gap-3 text-[9px] font-black tracking-[0.4em] uppercase text-brand-hooker transition-colors">
                     <div className="w-1.5 h-1.5 rounded-full bg-brand-pistachio animate-pulse shadow-pistachio-glow"></div>
                     System v2.5.6
                  </div>
               </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 bg-[#F0F4F1] dark:bg-brand-darkbg relative transition-colors duration-500">
               <div className="w-full max-w-sm space-y-10 pt-8 md:pt-0 relative z-10">
                  <div className="bg-white/70 dark:bg-brand-darksurface/70 backdrop-blur-xl p-10 rounded-[2rem] shadow-brand space-y-10 border border-brand-lightgray/20 dark:border-white/10 transition-all duration-300">
                      <div className="text-center md:text-left">
                        <h3 className="text-3xl font-black text-brand-jungle dark:text-white mb-2 uppercase tracking-tight transition-colors">Secure Login</h3>
                        <p className="text-brand-hooker dark:text-brand-lightgray/40 text-xs font-black uppercase tracking-widest opacity-60 transition-colors">GEPA Portal</p>
                      </div>
                      
                      <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-widest ml-1 transition-colors">Official ID / Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-hooker/30 dark:text-white/20 transition-colors" size={18} />
                            <input 
                              type="email" 
                              value={email} 
                              onChange={(e) => setEmail(e.target.value)} 
                              className="w-full bg-brand-lightgray/10 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-14 pl-12 pr-4 text-sm font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio focus:bg-white dark:focus:bg-brand-darksurface transition-all text-brand-jungle dark:text-white placeholder:text-brand-hooker/30 dark:placeholder:text-white/20" 
                              placeholder="officer@gepa.gov.gh" 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center ml-1">
                            <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-widest transition-colors">Password</label>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-hooker/30 dark:text-white/20 transition-colors" size={18} />
                            <input 
                              type={showPassword ? "text" : "password"} 
                              value={password} 
                              onChange={(e) => setPassword(e.target.value)} 
                              className="w-full bg-brand-lightgray/10 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-14 pl-12 pr-12 text-sm font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio focus:bg-white dark:focus:bg-brand-darksurface transition-all text-brand-jungle dark:text-white placeholder:text-brand-hooker/30 dark:placeholder:text-white/20" 
                              placeholder="••••••••" 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-hooker/30 dark:text-white/20 hover:text-brand-jungle dark:hover:text-white transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                          </div>
                        </div>
                        {error && (
                          <div className="text-red-500 text-[9px] font-black uppercase tracking-widest bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-200 dark:border-red-500/20 flex items-center gap-3 transition-all">
                            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 shadow-lg animate-pulse"></div>
                            {error}
                          </div>
                        )}
                        <button type="submit" className="w-full h-14 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-2xl font-black text-sm tracking-[0.2em] shadow-brand hover:bg-brand-hooker dark:hover:bg-white transition-all active:scale-[0.98] uppercase">Sign In</button>
                      </form>

                      <div className="pt-6 border-t border-brand-lightgray/20 dark:border-white/5 transition-colors">
                          <button onClick={() => setShowDemoCreds(!showDemoCreds)} className="flex items-center justify-between w-full text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 hover:text-brand-jungle dark:hover:text-white transition-colors uppercase tracking-widest"><span>Demo Accounts</span>{showDemoCreds ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
                          {showDemoCreds && (
                            <div className="mt-6 grid grid-cols-1 gap-2 animate-slide-up">
                              {USERS.slice(0, 4).map(u => (
                                <div key={u.id} onClick={() => fillCredentials(u)} className="flex items-center justify-between p-3 rounded-xl border border-brand-lightgray/20 dark:border-white/10 bg-brand-lightgray/5 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-brand-pistachio dark:hover:border-brand-pistachio transition-all cursor-pointer group">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-brand-jungle dark:bg-brand-pistachio text-brand-pistachio dark:text-brand-jungle flex items-center justify-center text-[9px] font-black shrink-0 uppercase shadow-sm group-hover:shadow-brand transition-all">{u.avatarInitials}</div>
                                      <div className="truncate">
                                        <div className="text-[8px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase opacity-60 transition-colors">{u.role}</div>
                                        <div className="text-[11px] font-bold text-brand-jungle dark:text-white truncate transition-colors">{u.email}</div>
                                      </div>
                                   </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                  </div>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};
