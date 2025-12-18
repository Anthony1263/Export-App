
import React from 'react';
import { LogOut, X, HelpCircle, Cloud, CloudOff } from 'lucide-react';
import { SystemModule, UserRole } from '../types';
import { IllusDashboard, IllusChart, IllusBank, IllusDoc, IllusSettings, GepaLogo } from './CustomIcons';
import { isDatabaseConfigured } from '../lib/supabase';

interface SidebarProps {
  activeModule: SystemModule;
  onNavigate: (module: SystemModule) => void;
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onNavigate, isOpen, onClose, userRole }) => {
  const isCloudActive = isDatabaseConfigured();

  const navItemClass = (module: SystemModule) =>
    `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 cursor-pointer text-sm font-bold tracking-tight uppercase tracking-widest text-[11px] ${
      activeModule === module
        ? 'bg-brand-pistachio text-brand-jungle shadow-pistachio-glow scale-[1.02]'
        : 'text-brand-lightgray/60 hover:text-white hover:bg-white/10'
    }`;

  const handleNavClick = (module: SystemModule) => {
    onNavigate(module);
    onClose();
  };

  const handleSignOut = () => {
    if (confirm("Sign out of GEPA Portal?")) {
      localStorage.removeItem('gepa_current_user');
      window.location.reload();
    }
  };

  const renderNavItems = () => {
    switch (userRole) {
      case 'gepa_staff':
      case 'admin':
        return (
          <>
            <div className="text-[10px] font-black text-brand-hooker uppercase tracking-[0.3em] mb-4 px-6 opacity-70">Administration</div>
            <div onClick={() => handleNavClick('dashboard')} className={navItemClass('dashboard')}>
              <IllusDashboard size={20} />
              <span>Dashboard</span>
            </div>
            <div onClick={() => handleNavClick('support')} className={navItemClass('support')}>
              <HelpCircle size={20} className="stroke-[2.5px]" />
              <span>Support</span>
            </div>
          </>
        );
      case 'bank':
        return (
          <>
            <div className="text-[10px] font-black text-brand-hooker uppercase tracking-[0.3em] mb-4 px-6 opacity-70">Financial Ops</div>
            <div onClick={() => handleNavClick('dashboard')} className={navItemClass('dashboard')}>
              <IllusDashboard size={20} />
              <span>Risk Dashboard</span>
            </div>
            <div onClick={() => handleNavClick('ifcms')} className={navItemClass('ifcms')}>
              <IllusBank size={20} />
              <span>Loan Applications</span>
            </div>
            <div onClick={() => handleNavClick('dedcp')} className={navItemClass('dedcp')}>
              <IllusDoc size={20} />
              <span>Trade Registry</span>
            </div>
          </>
        );
      case 'government':
        return (
          <>
            <div className="text-[10px] font-black text-brand-hooker uppercase tracking-[0.3em] mb-4 px-6 opacity-70">Regulatory Ops</div>
            <div onClick={() => handleNavClick('dashboard')} className={navItemClass('dashboard')}>
              <IllusDashboard size={20} />
              <span>Agency Oversight</span>
            </div>
            <div onClick={() => handleNavClick('dedcp')} className={navItemClass('dedcp')}>
              <IllusDoc size={20} />
              <span>Shipment Registry</span>
            </div>
          </>
        );
      default: // Exporter
        return (
          <>
            <div className="text-[10px] font-black text-brand-hooker uppercase tracking-[0.3em] mb-4 px-6 opacity-70">Main Menu</div>
            <div onClick={() => handleNavClick('dashboard')} className={navItemClass('dashboard')}>
              <IllusDashboard size={20} />
              <span>Overview</span>
            </div>

            <div className="text-[10px] font-black text-brand-hooker uppercase tracking-[0.3em] mb-4 px-6 mt-10 opacity-70">Modules</div>
            <div onClick={() => handleNavClick('remip')} className={navItemClass('remip')}>
              <IllusChart size={20} />
              <span>Market Data</span>
            </div>
            <div onClick={() => handleNavClick('ifcms')} className={navItemClass('ifcms')}>
              <IllusBank size={20} />
              <span>Finance & Loans</span>
            </div>
            <div onClick={() => handleNavClick('dedcp')} className={navItemClass('dedcp')}>
              <IllusDoc size={20} />
              <span>Documents</span>
            </div>
          </>
        );
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-brand-jungle/60 z-40 md:hidden transition-opacity backdrop-blur-sm" onClick={onClose} />
      )}

      <div className={`
        w-72 bg-brand-jungle text-white h-screen fixed left-0 top-0 flex flex-col z-50
        transition-transform duration-500 ease-in-out border-r border-white/5 dark:border-white/10
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center p-2 border border-white/10 shadow-brand">
               <GepaLogo size={32} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white leading-none">GEPA</h1>
              <p className="text-[10px] text-brand-pistachio font-black tracking-[0.2em] uppercase mt-1">Ecosystem</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-brand-lightgray hover:text-white"><X size={24} /></button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4 no-scrollbar">
          {renderNavItems()}
        </nav>

        <div className="p-8 border-t border-white/5 space-y-2 bg-black/5 shrink-0">
          <div onClick={() => handleNavClick('settings')} className={navItemClass('settings')}>
            <IllusSettings size={20} />
            <span className="text-sm font-semibold">Profile</span>
          </div>
          <div onClick={handleSignOut} className="flex items-center gap-4 px-6 py-4 text-brand-hooker hover:text-brand-pistachio cursor-pointer transition-colors rounded-2xl hover:bg-white/10 mt-4 group">
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest text-[11px]">Sign Out</span>
          </div>
          
          <div className="mt-4 px-6 py-2 flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${isCloudActive ? 'bg-brand-pistachio shadow-[0_0_8px_#9CC97F]' : 'bg-brand-hooker/30'}`}></div>
             <span className="text-[10px] font-black text-brand-hooker/60 uppercase tracking-widest flex items-center gap-1.5">
               {isCloudActive ? <Cloud size={10} /> : <CloudOff size={10} />}
               {isCloudActive ? 'Online' : 'Offline'}
             </span>
          </div>
        </div>
      </div>
    </>
  );
};
