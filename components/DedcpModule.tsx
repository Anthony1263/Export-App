
import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle, RefreshCw, FileCheck, ArrowRight, X, Globe, MapPin, Lock, ShieldCheck, Building2, Landmark, Eye, FileDown, Info, Search } from 'lucide-react';
import { ShipmentDocument, UserRole, User } from '../types';
import { DigitalCertificate } from './DigitalCertificate';
import { USERS } from '../constants';

interface DedcpProps {
  documents: ShipmentDocument[];
  onAddDocument: (doc: Omit<ShipmentDocument, 'id' | 'userId' | 'status' | 'progress' | 'date' | 'approvals'>) => void;
  onShowToast: (msg: string, type: 'success' | 'info' | 'error') => void;
  userRole: UserRole;
  user: User;
}

export const DedcpModule: React.FC<DedcpProps> = ({ documents, onAddDocument, onShowToast, userRole, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ShipmentDocument | null>(null);
  const [showCertificate, setShowCertificate] = useState<ShipmentDocument | null>(null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Approved' | 'Review'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newDoc, setNewDoc] = useState({ product: '', destination: '', reference: '' });

  const isExporter = userRole === 'exporter';
  const isRegistryView = userRole === 'government' || userRole === 'bank' || userRole === 'gepa_staff';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.product || !newDoc.destination) return;
    
    const ref = newDoc.reference || `EXP-${newDoc.destination.substring(0,2).toUpperCase()}-2025-${Math.floor(Math.random()*100)}`;
    
    onAddDocument({
      product: newDoc.product,
      destination: newDoc.destination,
      reference: ref
    });
    setNewDoc({ product: '', destination: '', reference: '' });
    setIsModalOpen(false);
  };

  const getExporterName = (userId: string) => {
    return USERS.find(u => u.id === userId)?.companyName || 'Unknown Entity';
  };

  const processedCount = documents.filter(d => d.status !== 'Draft').length;
  const approvedCount = documents.filter(d => d.status === 'Approved').length;
  const complianceRate = processedCount > 0 ? ((approvedCount / processedCount) * 100).toFixed(1) : "100";

  const filteredDocs = documents.filter(doc => {
    const matchesFilter = filterStatus === 'All' ? true : 
                          filterStatus === 'Approved' ? doc.status === 'Approved' :
                          doc.status !== 'Approved' && doc.status !== 'Draft';
    
    const matchesSearch = doc.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          getExporterName(doc.userId).toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 relative pb-20 animate-fade-in transition-colors duration-300">
      {showCertificate && (
        <DigitalCertificate doc={showCertificate} exporter={USERS.find(u => u.id === showCertificate.userId) || user} onClose={() => setShowCertificate(null)} />
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-jungle dark:text-white tracking-tighter uppercase transition-colors">{isRegistryView ? 'National Export Registry' : 'Documentation'}</h2>
          <p className="text-brand-hooker dark:text-brand-lightgray/60 mt-1 font-medium transition-colors">{isRegistryView ? 'Centralized trade manifest database.' : 'Manage export documents and compliance.'}</p>
        </div>
        
        {isExporter && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-hooker dark:hover:bg-white transition-all shadow-brand flex items-center justify-center gap-2 w-full md:w-auto active:scale-95"
          >
            <Upload size={18} />
            Create Shipment
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clickable Active Filings Card */}
        <div 
          onClick={() => {
            setFilterStatus('All');
            onShowToast(isRegistryView ? "Displaying full national registry." : "Displaying all active trade protocols.", "info");
          }}
          className={`p-6 rounded-2xl shadow-brand border flex items-center gap-6 cursor-pointer transition-all active:scale-[0.98] ${filterStatus === 'All' ? 'bg-brand-jungle/90 dark:bg-brand-pistachio/90 backdrop-blur-md text-white dark:text-brand-jungle border-brand-jungle' : 'bg-white/70 dark:bg-brand-darksurface/70 backdrop-blur-md border-brand-lightgray/30 dark:border-white/10 text-brand-jungle dark:text-white hover:border-brand-pistachio'}`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${filterStatus === 'All' ? 'bg-white/10 text-white dark:text-brand-jungle' : 'bg-brand-jungle dark:bg-brand-pistachio/10 text-brand-pistachio'}`}>
            <FileText size={24} />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tighter">{processedCount}</div>
            <div className={`text-[10px] font-black uppercase tracking-widest ${filterStatus === 'All' ? 'opacity-60' : 'text-brand-hooker dark:text-brand-lightgray/40'}`}>Total Shipments</div>
          </div>
        </div>
        
        {/* Clickable Integrity Card */}
        <div 
          onClick={() => {
            setFilterStatus('Approved');
            onShowToast("Filtering for verified manifests.", "success");
          }}
          className={`p-6 rounded-2xl shadow-brand border flex items-center gap-6 cursor-pointer transition-all active:scale-[0.98] ${filterStatus === 'Approved' ? 'bg-brand-jungle/90 dark:bg-brand-pistachio/90 backdrop-blur-md text-white dark:text-brand-jungle border-brand-jungle' : 'bg-white/70 dark:bg-brand-darksurface/70 backdrop-blur-md border-brand-lightgray/30 dark:border-white/10 text-brand-jungle dark:text-white hover:border-brand-pistachio'}`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${filterStatus === 'Approved' ? 'bg-white/10 text-white dark:text-brand-jungle' : 'bg-brand-pistachio text-brand-jungle'}`}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tighter">{complianceRate}%</div>
            <div className={`text-[10px] font-black uppercase tracking-widest ${filterStatus === 'Approved' ? 'opacity-60' : 'text-brand-hooker dark:text-brand-lightgray/40'}`}>Approval Rate</div>
          </div>
        </div>

        {/* Clickable Transit Card */}
        <div 
          onClick={() => {
            onShowToast("Analyzing mean transit protocols. All nodes optimal.", "info");
          }}
          className="bg-white/70 dark:bg-brand-darksurface/70 backdrop-blur-md p-6 rounded-2xl shadow-brand border border-brand-lightgray/30 dark:border-white/10 flex items-center gap-6 cursor-pointer transition-all hover:border-brand-pistachio active:scale-[0.98]"
        >
          <div className="w-14 h-14 bg-brand-pewter text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <RefreshCw size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-brand-jungle dark:text-white tracking-tighter">3.2d</div>
            <div className="text-[10px] text-brand-hooker dark:text-brand-lightgray/40 font-black uppercase tracking-widest">Avg. Processing Time</div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-brand-darksurface/70 backdrop-blur-md rounded-[2rem] shadow-brand border border-brand-lightgray/30 dark:border-white/10 overflow-hidden transition-colors duration-300">
        <div className="p-6 md:p-8 border-b border-brand-lightgray/10 dark:border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-brand-lightgray/5 dark:bg-white/5 transition-colors">
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-hooker/40 dark:text-white/20" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Reference or Entity..." 
                  className="w-full pl-11 pr-4 h-10 bg-white dark:bg-white/5 border border-brand-lightgray/20 dark:border-white/10 rounded-xl text-[11px] font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio text-brand-jungle dark:text-white uppercase tracking-wider transition-all"
                />
             </div>
             {filterStatus !== 'All' && (
                <button 
                  onClick={() => setFilterStatus('All')}
                  className="px-3 py-1 bg-brand-pistachio/20 text-brand-jungle dark:text-brand-pistachio rounded-lg text-[9px] font-black uppercase tracking-widest border border-brand-pistachio/30 hover:bg-brand-pistachio hover:text-white transition-all whitespace-nowrap"
                >
                  Clear Filter
                </button>
             )}
          </div>
          <div className="flex items-center gap-3 px-4 py-1.5 bg-brand-pistachio/10 dark:bg-brand-pistachio/5 text-brand-jungle dark:text-brand-pistachio rounded-full border border-brand-pistachio/20 transition-colors shrink-0">
             <div className="w-1.5 h-1.5 rounded-full bg-brand-jungle dark:bg-brand-pistachio animate-pulse shadow-pistachio-glow"></div>
             <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
          </div>
        </div>
        
        <div className="divide-y divide-brand-lightgray/10 dark:divide-white/5">
          {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
            <div 
              key={doc.id} 
              className="p-8 hover:bg-brand-lightgray/5 dark:hover:bg-white/5 transition-all group cursor-pointer active:bg-brand-lightgray/10 dark:active:bg-white/10" 
              onClick={() => {
                if (doc.status === 'Approved') {
                  setShowCertificate(doc);
                } else {
                  onShowToast(`Shipment ${doc.reference} is currently in: ${doc.status} mode.`, "info");
                }
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div className="flex items-start gap-6">
                  <div className="bg-brand-jungle dark:bg-brand-pistachio/10 text-brand-pistachio p-4 rounded-2xl shadow-lg shrink-0 transform group-hover:-rotate-3 transition-transform duration-300">
                     <FileCheck size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-brand-jungle dark:text-white text-xl uppercase tracking-tight transition-colors flex items-center gap-3">
                      {doc.product} ⮕ {doc.destination}
                      {doc.status === 'Approved' && <ShieldCheck size={18} className="text-brand-pistachio" />}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-hooker dark:text-brand-lightgray/40 bg-brand-lightgray/10 dark:bg-white/5 px-3 py-1 rounded-lg border border-brand-lightgray/20 dark:border-white/10 transition-colors">Ref: {doc.reference}</span>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-pewter transition-colors">{doc.date}</span>
                       {isRegistryView && (
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-jungle dark:text-brand-pistachio flex items-center gap-1">
                             <Building2 size={10} /> {getExporterName(doc.userId)}
                          </span>
                       )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-right mr-4">
                     <div className="text-[9px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.3em] mb-2 transition-colors">Status</div>
                     <span className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] border shadow-sm transition-all ${
                        doc.status === 'Approved' ? 'bg-brand-pistachio text-brand-jungle border-brand-pistachio shadow-pistachio-glow' :
                        doc.status === 'Agency Review' ? 'bg-brand-pewter text-white border-brand-pewter' :
                        doc.status === 'Compliance Check' ? 'bg-brand-hooker text-white border-brand-hooker' :
                        'bg-white dark:bg-white/5 text-brand-hooker dark:text-brand-lightgray border-brand-lightgray/30 dark:border-white/10'
                      }`}>
                        {doc.status}
                      </span>
                   </div>
                  {doc.status === 'Approved' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowCertificate(doc); }}
                      className="h-12 px-6 rounded-2xl bg-brand-jungle dark:bg-brand-pistachio text-brand-pistachio dark:text-brand-jungle flex items-center justify-center hover:bg-brand-hooker dark:hover:bg-white transition-all shadow-brand gap-3 text-[10px] font-black uppercase tracking-widest active:scale-95"
                    >
                        <FileDown size={18} /> Certificate
                    </button>
                  )}
                </div>
              </div>

              <div className="relative pt-2">
                <div className="flex justify-between text-[9px] uppercase font-black tracking-[0.3em] mb-3 transition-colors">
                  <span className={doc.progress >= 20 ? 'text-brand-jungle dark:text-brand-pistachio' : 'text-brand-hooker/30 dark:text-white/10'}>Submission</span>
                  <span className={`hidden sm:inline ${doc.progress >= 50 ? 'text-brand-jungle dark:text-brand-pistachio' : 'text-brand-hooker/30 dark:text-white/10'}`}>Audit</span>
                  <span className={`hidden sm:inline ${doc.progress >= 80 ? 'text-brand-jungle dark:text-brand-pistachio' : 'text-brand-hooker/30 dark:text-white/10'}`}>Authorization</span>
                  <span className={doc.progress >= 100 ? 'text-brand-jungle dark:text-brand-pistachio' : 'text-brand-hooker/30 dark:text-white/10'}>Complete</span>
                </div>
                <div className="w-full bg-brand-lightgray/20 dark:bg-white/5 rounded-full h-2 overflow-hidden border border-brand-lightgray/20 dark:border-white/10 p-[1.5px] transition-colors">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                       doc.status === 'Approved' ? 'bg-brand-pistachio shadow-pistachio-glow' : 'bg-brand-jungle dark:bg-brand-pistachio shadow-brand'
                    }`} 
                    style={{width: `${doc.progress}%`}}
                  ></div>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-20 text-center flex flex-col items-center">
               <Info size={48} className="text-brand-hooker/20 dark:text-white/10 mb-6" />
               <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-hooker/40 dark:text-white/20">No manifests found in current protocol</p>
               <button onClick={() => { setFilterStatus('All'); setSearchQuery(''); }} className="mt-6 text-[10px] font-black uppercase tracking-widest text-brand-jungle dark:text-brand-pistachio hover:underline">Reset Filter</button>
            </div>
          )}
        </div>
      </div>

      {/* Initialize Modal (Only for Exporters) */}
      {isModalOpen && isExporter && (
        <div className="fixed inset-0 bg-brand-jungle/60 z-[150] flex items-center justify-center p-6 backdrop-blur-md animate-fade-in">
          <div className="bg-white/80 dark:bg-brand-darksurface/80 backdrop-blur-xl rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-brand-lightgray/20 dark:border-white/10 animate-modal-in transition-colors duration-300">
            <div className="px-10 py-8 border-b border-brand-lightgray/10 dark:border-white/5 flex justify-between items-center bg-brand-lightgray/5 dark:bg-white/5 transition-colors">
              <h3 className="font-black text-brand-jungle dark:text-white text-xl uppercase tracking-tight transition-colors">Create Export Shipment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-brand-hooker dark:text-brand-lightgray/60 hover:text-brand-jungle dark:hover:text-white transition-colors">
                <X size={28} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
               <div className="space-y-2">
                <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-[0.2em] ml-1 transition-colors">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={newDoc.product}
                  onChange={(e) => setNewDoc({...newDoc, product: e.target.value})}
                  className="w-full bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-14 px-6 text-sm font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio focus:bg-white dark:focus:bg-brand-darksurface transition-all text-brand-jungle dark:text-white placeholder:text-brand-hooker/30 dark:placeholder:text-white/20"
                  placeholder="e.g. Grade A Cocoa Beans"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-[0.2em] ml-1 transition-colors">Destination Country</label>
                <input 
                  type="text" 
                  required
                  value={newDoc.destination}
                  onChange={(e) => setNewDoc({...newDoc, destination: e.target.value})}
                  className="w-full bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-14 px-6 text-sm font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio focus:bg-white dark:focus:bg-brand-darksurface transition-all text-brand-jungle dark:text-white placeholder:text-brand-hooker/30 dark:placeholder:text-white/20"
                  placeholder="e.g. Netherlands"
                />
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-hooker dark:text-brand-lightgray/60 hover:bg-brand-lightgray/5 dark:hover:bg-white/5 transition-all transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-hooker dark:hover:bg-white shadow-brand transition-all transition-colors active:scale-[0.98]">Submit Shipment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
