
import React from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, Download, Printer, X, Globe, Landmark, Shield } from 'lucide-react';
import { ShipmentDocument, User } from '../types';
import { GepaLogo } from './CustomIcons';

interface DigitalCertificateProps {
  doc: ShipmentDocument;
  exporter: User;
  onClose: () => void;
}

export const DigitalCertificate: React.FC<DigitalCertificateProps> = ({ doc, exporter, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 bg-black/80 z-[9999] overflow-y-auto backdrop-blur-sm animate-fade-in print:bg-white">
      <div className="min-h-full flex items-center justify-center p-4 md:p-10">
        <div className="max-w-4xl w-full bg-white dark:bg-brand-darksurface rounded-[2rem] shadow-2xl relative animate-modal-in overflow-hidden border border-white/20 transition-colors duration-300">
          
          {/* Actions Header */}
          <div className="absolute top-6 right-6 flex gap-3 z-30 print:hidden">
            <button 
              onClick={() => window.print()} 
              className="w-10 h-10 md:w-12 md:h-12 bg-brand-lightgray/10 hover:bg-brand-lightgray/20 dark:bg-white/5 dark:hover:bg-white/10 text-brand-jungle dark:text-brand-pistachio rounded-xl flex items-center justify-center transition-all border border-brand-lightgray/20 dark:border-white/10 active:scale-90"
              title="Print Certificate"
            >
              <Printer size={20} />
            </button>
            <button 
              onClick={onClose} 
              className="w-10 h-10 md:w-12 md:h-12 bg-white text-brand-jungle border border-brand-lightgray/20 rounded-xl flex items-center justify-center hover:bg-brand-lightgray/20 transition-all shadow-sm active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          {/* Certificate Content Wrapper */}
          <div className="p-8 md:p-16 border-[8px] md:border-[16px] border-brand-lightgray/10 dark:border-white/5 m-2 md:m-4 relative print:m-0 print:border-0 rounded-[1.5rem] transition-colors">
            
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.01] pointer-events-none overflow-hidden select-none">
               <GepaLogo size={600} />
            </div>

            <div className="relative z-10">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10 border-b-4 border-brand-jungle dark:border-brand-pistachio pb-10 mb-10 transition-colors">
                 <GepaLogo size={80} className="md:size-[100px] shrink-0" showText />
                 <div className="text-center md:text-right">
                    <h1 className="text-2xl md:text-4xl font-black text-brand-jungle dark:text-white tracking-tighter uppercase leading-none mb-2 transition-colors">Certificate of Origin</h1>
                    <p className="text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.4em] transition-colors">Republic of Ghana • Export Registry</p>
                    <div className="mt-4 md:mt-6 inline-flex items-center gap-2 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle px-5 py-2 rounded-lg font-mono text-[10px] md:text-xs tracking-widest uppercase shadow-brand transition-colors">
                      <Shield size={14} /> Ref: {doc.reference}
                    </div>
                 </div>
              </div>

              {/* Manifest Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-12">
                 <div className="space-y-8">
                    <div className="group break-words">
                      <h3 className="text-[9px] md:text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.3em] mb-3 border-b border-brand-lightgray/30 dark:border-white/5 pb-1 transition-colors">Exporter / Consignor</h3>
                      <p className="text-lg md:text-xl font-black text-brand-jungle dark:text-white uppercase tracking-tight transition-colors leading-tight">{exporter.companyName}</p>
                      <p className="text-xs md:text-sm font-medium text-brand-hooker dark:text-brand-lightgray/60 mt-1 transition-colors">Authorized Exporter: {exporter.name}</p>
                      <p className="text-[10px] text-brand-hooker/50 dark:text-brand-lightgray/30 uppercase font-black tracking-widest mt-1">Accra, Ghana • Export Tier 1</p>
                    </div>
                    <div className="break-words">
                      <h3 className="text-[9px] md:text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.3em] mb-3 border-b border-brand-lightgray/30 dark:border-white/5 pb-1 transition-colors">Consignee / Destination</h3>
                      <p className="text-lg md:text-xl font-black text-brand-jungle dark:text-white uppercase tracking-tight transition-colors leading-tight">{doc.destination}</p>
                      <p className="text-xs md:text-sm font-medium text-brand-hooker dark:text-brand-lightgray/60 mt-1 transition-colors">Trade Link Verified</p>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="break-words">
                      <h3 className="text-[9px] md:text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.3em] mb-3 border-b border-brand-lightgray/30 dark:border-white/5 pb-1 transition-colors">Product Details</h3>
                      <p className="text-lg md:text-xl font-black text-brand-jungle dark:text-white uppercase tracking-tight transition-colors leading-tight">{doc.product}</p>
                      <p className="text-xs md:text-sm font-medium text-brand-hooker dark:text-brand-lightgray/60 mt-1 transition-colors">HS Code Verified: 1801.00.00</p>
                    </div>
                    <div>
                      <h3 className="text-[9px] md:text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.3em] mb-3 border-b border-brand-lightgray/30 dark:border-white/5 pb-1 transition-colors">Authorization Date</h3>
                      <p className="text-lg md:text-xl font-black text-brand-jungle dark:text-white uppercase tracking-tight transition-colors">{new Date(doc.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</p>
                    </div>
                 </div>
              </div>

              {/* Verification Infrastructure - Mobile Optimized Grid */}
              <div className="bg-brand-lightgray/5 dark:bg-white/5 p-6 md:p-10 rounded-[2rem] border-2 border-brand-jungle/10 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-center transition-colors">
                 <div className="text-center md:text-left flex flex-col items-center md:items-start shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white p-2 border-4 border-brand-jungle/5 dark:border-white/5 shadow-sm rounded-lg overflow-hidden">
                       <div className="w-full h-full grid grid-cols-5 gap-0.5 opacity-80">
                          {Array.from({length: 25}).map((_, i) => (
                            <div key={i} className={`bg-brand-jungle ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-0'}`}></div>
                          ))}
                       </div>
                    </div>
                    <p className="text-[8px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.3em] mt-3 transition-colors">Scan to Verify</p>
                 </div>
                 
                 <div className="md:col-span-2 space-y-6 min-w-0">
                    <div className="flex items-start gap-4">
                       <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-pistachio/10 flex items-center justify-center shrink-0 transition-colors">
                          <ShieldCheck className="text-brand-pistachio" size={20} />
                       </div>
                       <div className="min-w-0 flex-1">
                          <p className="text-[9px] md:text-[10px] font-black text-brand-jungle dark:text-white uppercase tracking-widest transition-colors leading-tight">Digital Signature</p>
                          <p className="text-[8px] md:text-[9px] font-mono text-brand-hooker dark:text-brand-lightgray/40 break-all mt-1 uppercase leading-normal transition-colors">SHA-256: 8f2b3c1a9d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-pewter/10 flex items-center justify-center shrink-0 transition-colors">
                          <Landmark className="text-brand-pewter" size={20} />
                       </div>
                       <div className="min-w-0 flex-1">
                          <p className="text-[9px] md:text-[10px] font-black text-brand-jungle dark:text-white uppercase tracking-widest transition-colors leading-tight">Regulatory Authorization</p>
                          <p className="text-[9px] font-bold text-brand-hooker dark:text-brand-lightgray/60 uppercase mt-1 leading-normal transition-colors">Authenticated by Registry System</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Signature Block */}
              <div className="mt-12 md:mt-20 flex flex-col sm:flex-row justify-between gap-10 md:gap-12 items-center sm:items-end transition-all">
                 <div className="text-center sm:text-left w-full sm:w-auto">
                    <div className="font-serif italic text-xl md:text-2xl mb-2 text-brand-jungle dark:text-white opacity-80 transition-colors">{exporter.name}</div>
                    <div className="w-40 md:w-48 h-px bg-brand-lightgray dark:bg-white/20 mb-2 mx-auto sm:mx-0 transition-colors"></div>
                    <p className="text-[8px] md:text-[9px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.2em] transition-colors">Authorized Exporter Signature</p>
                 </div>
                 <div className="text-center sm:text-right w-full sm:w-auto">
                    <div className="text-brand-jungle dark:text-brand-pistachio font-black text-base md:text-lg mb-2 uppercase tracking-tighter transition-colors">Verified by GEPA System</div>
                    <div className="w-40 md:w-48 h-px bg-brand-lightgray dark:bg-white/20 mb-2 mx-auto sm:ml-auto transition-colors"></div>
                    <p className="text-[8px] md:text-[9px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.2em] transition-colors">Electronic Regulatory Seal</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
