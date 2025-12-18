
import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { SystemModule, User, Notification, BroadcastMessage } from '../types';
import { Bell, User as UserIcon, Menu, ChevronDown, LogOut, CreditCard, Sun, Moon, Zap, Globe, Landmark, Activity, Megaphone, X } from 'lucide-react';
import { GepaLogo } from './CustomIcons';

interface LayoutProps {
  children: ReactNode;
  activeModule: SystemModule;
  onNavigate: (module: SystemModule) => void;
  currentUser: User;
  onSignOut: () => void;
  notifications: Notification[];
  recentBroadcast?: BroadcastMessage | null;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeModule, 
  onNavigate, 
  currentUser,
  onSignOut,
  notifications,
  recentBroadcast
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('gepa_theme') as 'light' | 'dark') || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  
  const [showBroadcast, setShowBroadcast] = useState(true);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gepa_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gepa_theme', 'light');
    }
  }, [theme]);

  // Reset broadcast visibility when a new one arrives
  useEffect(() => {
    if (recentBroadcast) {
      setShowBroadcast(true);
    }
  }, [recentBroadcast?.id]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getModuleTitle = () => {
    switch(activeModule) {
      case 'dashboard': return 'System Overview';
      case 'remip': return 'Market Intelligence';
      case 'ifcms': return 'Finance Portal';
      case 'dedcp': return 'Documentation';
      case 'settings': return 'Account Settings';
      case 'support': return 'Support Hub';
      default: return 'Portal';
    }
  };

  const getNotifIcon = (type: Notification['type']) => {
    switch(type) {
      case 'finance': return <Landmark size={14} className="text-brand-pewter" />;
      case 'trade': return <Activity size={14} className="text-brand-pistachio" />;
      case 'market': return <Globe size={14} className="text-brand-hooker" />;
      default: return <Zap size={14} className="text-brand-pistachio" />;
    }
  };

  const handleNotificationClick = (n: Notification) => {
    setShowNotifications(false);
    
    // Robust switch for routing based on type
    switch (n.type) {
      case 'finance':
        onNavigate('ifcms');
        break;
      case 'trade':
        // Government agents work from Dashboard for approvals, others go to Documents
        if (currentUser.role === 'government') {
          onNavigate('dashboard');
        } else {
          onNavigate('dedcp');
        }
        break;
      case 'market':
        onNavigate('remip');
        break;
      case 'system':
        onNavigate('dashboard');
        break;
      default:
        // Fallback logic
        if (n.text.toLowerCase().includes('loan')) onNavigate('ifcms');
        else if (n.text.toLowerCase().includes('manifest')) onNavigate('dedcp');
        else onNavigate('dashboard');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F4F1] dark:bg-brand-darkbg text-brand-jungle dark:text-white transition-colors duration-300">
      <Sidebar 
        activeModule={activeModule} 
        onNavigate={onNavigate} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        userRole={currentUser.role}
      />
      
      <div className="flex-1 md:ml-72 flex flex-col transition-all duration-300 w-full relative">
        <header className="h-20 md:h-24 sticky top-0 z-30 px-6 md:px-10 flex items-center justify-between shrink-0 bg-white/80 dark:bg-brand-darkbg/80 backdrop-blur-xl border-b border-brand-lightgray/30 dark:border-white/10 transition-colors duration-300 supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-3 -ml-3 text-brand-jungle dark:text-white hover:bg-brand-jungle/5 dark:hover:bg-white/5 rounded-2xl shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-hooker dark:text-brand-lightgray/40 hidden xs:inline">GEPA Ecosystem</span>
              <span className="text-brand-jungle/20 dark:text-white/10 hidden md:inline">/</span>
              <span className="text-brand-jungle dark:text-white font-bold text-base md:text-lg leading-none uppercase tracking-tight">{getModuleTitle()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            <button 
              onClick={toggleTheme}
              className="p-3 text-brand-hooker dark:text-brand-lightgray/60 hover:text-brand-jungle dark:hover:text-white transition-all rounded-2xl hover:bg-brand-lightgray/5 dark:hover:bg-white/5"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-3 text-brand-hooker dark:text-brand-lightgray/60 hover:text-brand-jungle dark:hover:text-white transition-all rounded-2xl ${showNotifications ? 'bg-brand-lightgray/10 dark:bg-white/10 text-brand-jungle dark:text-white' : 'hover:bg-brand-lightgray/5 dark:hover:bg-white/5'}`}
              >
                <Bell size={20} />
                {notifications.some(n => n.isNew) && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-brand-pistachio rounded-full border-2 border-white dark:border-brand-darkbg shadow-pistachio-glow"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-72 md:w-80 bg-white/90 dark:bg-brand-darksurface/90 backdrop-blur-xl rounded-3xl shadow-brand border border-brand-lightgray/20 dark:border-white/10 overflow-hidden z-[200] animate-modal-in">
                  <div className="p-6 border-b border-brand-lightgray/10 dark:border-white/5 flex justify-between items-center bg-brand-lightgray/5 dark:bg-white/5">
                    <h3 className="font-black text-xs uppercase tracking-widest text-brand-jungle dark:text-white">Security Feed</h3>
                    <button onClick={() => notifications.forEach(n => n.isNew = false)} className="text-[10px] text-brand-hooker dark:text-brand-lightgray hover:text-brand-jungle dark:hover:text-white font-black uppercase tracking-widest">Mark Read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto no-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => handleNotificationClick(n)}
                          className={`p-6 border-b border-brand-lightgray/10 dark:border-white/5 hover:bg-brand-lightgray/5 dark:hover:bg-white/5 cursor-pointer transition-colors ${n.isNew ? 'bg-brand-pistachio/5 dark:bg-brand-pistachio/10' : ''}`}
                        >
                          <div className="flex gap-4">
                             <div className="mt-1">{getNotifIcon(n.type)}</div>
                             <div className="flex-1 min-w-0">
                                <p className={`text-xs leading-snug tracking-tight ${n.isNew ? 'font-black text-brand-jungle dark:text-brand-pistachio uppercase' : 'text-brand-hooker dark:text-brand-lightgray font-bold'}`}>{n.text}</p>
                                <p className="text-[9px] font-black text-brand-hooker/40 dark:text-white/20 uppercase tracking-[0.2em] mt-2">{n.time}</p>
                             </div>
                             {n.isNew && <span className="w-2.5 h-2.5 bg-brand-pistachio rounded-full shrink-0 mt-1 shadow-pistachio-glow"></span>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-16 text-center text-brand-hooker/30 dark:text-white/10 text-[10px] font-black uppercase tracking-[0.4em]">No Live Alerts</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative" ref={userRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-3 p-1.5 rounded-2xl border transition-all ${showUserMenu ? 'bg-white/50 dark:bg-white/10 border-brand-jungle dark:border-brand-pistachio' : 'bg-brand-lightgray/5 dark:bg-white/5 border-brand-lightgray/30 dark:border-white/10 hover:border-brand-jungle dark:hover:border-brand-pistachio'}`}
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-xl flex items-center justify-center p-1 shadow-brand">
                   <GepaLogo size={32} />
                </div>
                <div className="hidden sm:block text-left mr-1">
                  <div className="text-xs font-black text-brand-jungle dark:text-white leading-none truncate max-w-[100px] uppercase tracking-wider">{currentUser.companyName.split(' ')[0]}</div>
                </div>
                <ChevronDown size={14} className="text-brand-hooker dark:text-brand-lightgray/60 hidden xs:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-4 w-64 bg-white/90 dark:bg-brand-darksurface/90 backdrop-blur-xl rounded-3xl shadow-brand border border-brand-lightgray/20 dark:border-white/10 overflow-hidden z-[200] py-2 animate-modal-in">
                  <div className="px-8 py-6 border-b border-brand-lightgray/10 dark:border-white/5 mb-2 bg-brand-lightgray/5 dark:bg-white/5">
                    <p className="text-sm font-black text-brand-jungle dark:text-white uppercase tracking-wider">{currentUser.name}</p>
                    <p className="text-[10px] font-bold text-brand-hooker dark:text-brand-lightgray/60 mt-1 uppercase tracking-[0.2em]">{currentUser.role.replace('_', ' ')}</p>
                  </div>

                  <button onClick={() => { onNavigate('settings'); setShowUserMenu(false); }} className="w-full text-left px-8 py-4 text-xs font-black text-brand-hooker dark:text-brand-lightgray/60 hover:bg-brand-lightgray/10 dark:hover:bg-white/10 hover:text-brand-jungle dark:hover:text-white uppercase tracking-widest flex items-center gap-4 transition-all">
                    <UserIcon size={18} /> Profile Control
                  </button>
                  <button onClick={() => { onNavigate('settings'); setShowUserMenu(false); }} className="w-full text-left px-8 py-4 text-xs font-black text-brand-hooker dark:text-brand-lightgray/60 hover:bg-brand-lightgray/10 dark:hover:bg-white/10 hover:text-brand-jungle dark:hover:text-white uppercase tracking-widest flex items-center gap-4 transition-all">
                    <CreditCard size={18} /> Credentials
                  </button>
                  <div className="h-px bg-brand-lightgray/10 dark:bg-white/5 mx-8 my-2"></div>
                  <button onClick={() => { setShowUserMenu(false); onSignOut(); }} className="w-full text-left px-8 py-5 text-xs font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 uppercase tracking-widest flex items-center gap-4 transition-all">
                    <LogOut size={18} /> End Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 md:px-10 pb-24 md:pb-12 overflow-x-hidden w-full no-scrollbar pt-8">
          <div className="max-w-[1200px] mx-auto">
            {/* System Announcement Banner - Styled lighter with glass */}
            {recentBroadcast && showBroadcast && (
              <div className="mb-8 bg-white/70 dark:bg-brand-darksurface/70 backdrop-blur-md p-6 rounded-[1.5rem] shadow-soft relative overflow-hidden animate-slide-up border-l-4 border-brand-jungle dark:border-brand-pistachio flex items-start gap-5 ring-1 ring-black/5 dark:ring-white/10">
                 <div className="w-10 h-10 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-xl flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                    <Megaphone size={20} />
                 </div>
                 <div className="flex-1 pt-0.5">
                    <div className="flex justify-between items-start">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-jungle dark:text-brand-pistachio mb-1">System Announcement</h4>
                       <button onClick={() => setShowBroadcast(false)} className="text-brand-hooker dark:text-white/40 hover:text-brand-jungle dark:hover:text-white transition-colors"><X size={16} /></button>
                    </div>
                    <p className="text-sm font-bold leading-tight text-brand-jungle dark:text-white">{recentBroadcast.content}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-brand-hooker dark:text-brand-lightgray/40 mt-2">{recentBroadcast.timestamp} • Sender: {recentBroadcast.sender}</p>
                 </div>
              </div>
            )}

            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
