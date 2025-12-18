
import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

/**
 * GepaLogo - Ghana Export Promotion Authority Brand Identity
 */
export const GepaLogo = ({ className, size = 120, showText = false }: IconProps) => {
  const green = "#125B34";
  const orange = "#E68A2E";

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          {`
            @keyframes drawPath { to { stroke-dashoffset: 0; } }
            @keyframes fillIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            .animate-draw {
              stroke-dasharray: 800;
              stroke-dashoffset: 800;
              animation: drawPath 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            .animate-fill {
              opacity: 0;
              animation: fillIn 0.8s ease-out forwards;
              animation-delay: 1s;
            }
          `}
        </style>
        
        {/* Main G Shell */}
        <path 
          d="M110 115C110 135 95 150 75 150C55 150 40 135 40 115C40 95 55 80 75 80C85 80 95 85 102 92L125 55" 
          stroke={green} strokeWidth="12" strokeLinecap="round" className="animate-draw"
        />
        
        {/* Inner Orange Core */}
        <circle cx="75" cy="115" r="22" fill={orange} className="animate-fill" />
        
        {/* The Arrow Swoosh */}
        <path 
          d="M85 130L170 108L155 125M170 108L150 95" 
          stroke={green} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" className="animate-draw" style={{ animationDelay: '0.5s' }}
        />

        {/* The Pod / Leaf */}
        <path 
          d="M115 130C115 130 118 170 145 170C172 170 150 130 150 130" 
          stroke={green} strokeWidth="8" strokeLinecap="round" className="animate-draw" style={{ animationDelay: '0.8s' }}
        />
        <path 
          d="M132 135V160M125 140V155M140 140V155" 
          stroke={orange} strokeWidth="4" strokeLinecap="round" className="animate-draw" style={{ animationDelay: '1.2s' }}
        />
      </svg>
      {showText && (
        <div className="mt-6 text-center animate-fill" style={{ animationDelay: '1.8s' }}>
          <div className="text-2xl font-black tracking-tight" style={{ color: green }}>
            GHANA <span style={{ color: orange }}>EXPORT</span>
          </div>
          <div className="text-[10px] font-black tracking-[0.4em] uppercase opacity-60" style={{ color: green }}>
            PROMOTION AUTHORITY
          </div>
        </div>
      )}
    </div>
  );
};

export const IllusDashboard = ({ className, size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 6C4 4.89543 4.89543 4 6 4H10C11.1046 4 12 4.89543 12 6V10C12 11.1046 11.1046 12 10 12H6C4.89543 12 4 11.1046 4 10V6Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M14 6C14 4.89543 14.8954 4 16 4H18C19.1046 4 20 4.89543 20 6V10C20 11.1046 19.1046 12 18 12H16C14.8954 12 14 11.1046 14 10V6Z" fill="currentColor" fillOpacity="0.1" />
    <path d="M4 14C4 12.8954 4.89543 12 6 12H18C19.1046 12 20 12.8954 20 14V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V14Z" fill="currentColor" fillOpacity="0.15" />
    <path d="M6 4H10M16 4H18M6 12H18M12 4V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IllusChart = ({ className, size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 20L10 14L14 18L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 12V16M20 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="4" cy="20" r="1.5" fill="currentColor" />
    <circle cx="10" cy="14" r="1.5" fill="currentColor" />
    <circle cx="14" cy="18" r="1.5" fill="currentColor" />
    <circle cx="20" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

export const IllusBank = ({ className, size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M5 21V10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M19 21V10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 21V10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 10L12 3L22 10H2Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const IllusDoc = ({ className, size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 13H16M8 17H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IllusSettings = ({ className, size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 2V4M12 20V22M4 12H2M22 12H20M5 5L6.5 6.5M17.5 17.5L19 19M5 19L6.5 17.5M17.5 6.5L19 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IllusGlobe = ({ className, size = 64 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" />
    <path d="M10 50H90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
    <path d="M50 10V90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
    <ellipse cx="50" cy="50" rx="20" ry="40" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const IllusShield = ({ className, size = 64 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15L85 30V55C85 75 70 90 50 95C30 90 15 75 15 55V30L50 15Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="3" />
    <path d="M35 55L45 65L65 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
