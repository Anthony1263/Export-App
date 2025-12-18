
import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Filter, CheckCircle, Clock, X, User as UserIcon, Check, ShieldCheck, Zap, FileText } from 'lucide-react';
import { User, SupportTicket } from '../types';
import { USERS } from '../constants';

interface SupportModuleProps {
  user: User;
  tickets: SupportTicket[];
  onAddTicket: (ticket: Omit<SupportTicket, 'id' | 'status' | 'date' | 'userId'>) => void;
  onResolveTicket?: (id: string, note: string) => void; 
}

export const SupportModule: React.FC<SupportModuleProps> = ({ user, tickets, onAddTicket, onResolveTicket }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', priority: 'Medium' as 'High' | 'Medium' | 'Low' });
  const [filter, setFilter] = useState('All');
  
  // Resolution Modal State
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [ticketToResolve, setTicketToResolve] = useState<SupportTicket | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const isStaff = user.role === 'gepa_staff' || user.role === 'admin';
  const myTickets = isStaff ? tickets : tickets.filter(t => t.userId === user.id);
  const filteredTickets = filter === 'All' ? myTickets : myTickets.filter(t => t.status === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTicket(newTicket);
    setNewTicket({ subject: '', message: '', priority: 'Medium' });
    setIsModalOpen(false);
  };

  const initiateResolve = (ticket: SupportTicket) => {
    setTicketToResolve(ticket);
    setResolutionNote('');
    setIsResolveModalOpen(true);
  };

  const confirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketToResolve && onResolveTicket) {
      onResolveTicket(ticketToResolve.id, resolutionNote);
      setIsResolveModalOpen(false);
      setTicketToResolve(null);
    }
  };

  const getUserName = (id: string) => USERS.find(u => u.id === id)?.companyName || 'Unknown User';

  return (
    <div className="space-y-6 pb-20 animate-fade-in transition-colors">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-jungle dark:text-white tracking-tighter uppercase transition-colors">Support Center</h2>
          <p className="text-brand-hooker dark:text-brand-lightgray/60 mt-1 font-medium italic transition-colors">
            {isStaff ? 'Staff Helpdesk' : 'User Support'}
          </p>
        </div>
        {!isStaff && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-hooker dark:hover:bg-white transition-all shadow-brand flex items-center justify-center gap-2 w-full md:w-auto"
          >
            <Plus size={18} /> New Ticket
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white dark:bg-brand-darksurface p-8 rounded-[3rem] shadow-soft border border-brand-lightgray/20 dark:border-white/10 h-fit transition-colors">
           <h3 className="font-black text-[10px] text-brand-jungle dark:text-white uppercase tracking-[0.3em] mb-6 transition-colors">Ticket Status</h3>
           <div className="space-y-3">
             {['All', 'Open', 'Resolved'].map(status => (
               <button 
                 key={status}
                 onClick={() => setFilter(status)}
                 className={`w-full text-left px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex justify-between items-center transition-all ${filter === status ? 'bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle shadow-brand' : 'text-brand-hooker dark:text-brand-lightgray/60 hover:bg-brand-lightgray/5 dark:hover:bg-white/5 hover:text-brand-jungle dark:hover:text-white'}`}
               >
                 {status}
                 <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black transition-colors ${filter === status ? 'bg-brand-pistachio dark:bg-brand-jungle text-brand-jungle dark:text-brand-pistachio shadow-pistachio-glow' : 'bg-brand-lightgray/20 dark:bg-white/10 text-brand-hooker dark:text-brand-lightgray/40'}`}>
                   {status === 'All' ? myTickets.length : myTickets.filter(t => t.status === status).length}
                 </span>
               </button>
             ))}
           </div>
           
           <div className="mt-10 pt-8 border-t border-brand-lightgray/10 dark:border-white/5">
             <h3 className="font-black text-[10px] text-brand-jungle dark:text-white uppercase tracking-[0.3em] mb-6 transition-colors">Emergency Contacts</h3>
             <div className="text-[11px] font-bold text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-widest space-y-4 transition-colors">
               <div className="flex items-center gap-3 transition-colors"><Zap size={14} className="text-brand-pistachio" /> Hotline: +233 30 274 0260</div>
               <div className="flex items-center gap-3 transition-colors"><ShieldCheck size={14} className="text-brand-pistachio" /> support@gepa.gov.gh</div>
               <div className="flex items-center gap-3 transition-colors"><Clock size={14} /> Mon-Fri, 08:00 - 17:00</div>
             </div>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {filteredTickets.length > 0 ? filteredTickets.map(ticket => (
            <div key={ticket.id} className="bg-white dark:bg-brand-darksurface p-8 rounded-[3rem] shadow-soft border border-brand-lightgray/10 dark:border-white/10 hover:shadow-brand transition-all relative overflow-hidden">
              <div className="flex justify-between items-start mb-6 gap-4">
                 <div className="flex items-start gap-5 flex-1 min-w-0">
                    {isStaff && ticket.status !== 'Resolved' ? (
                       <button 
                         onClick={() => initiateResolve(ticket)}
                         className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all bg-brand-lightgray/10 border-brand-lightgray/30 dark:border-white/10 dark:bg-white/5 hover:bg-brand-pistachio hover:border-brand-pistachio hover:text-brand-jungle dark:hover:bg-brand-pistachio dark:hover:border-brand-pistachio dark:hover:text-brand-jungle shrink-0"
                         title="Resolve Ticket"
                       >
                         <Check size={24} className="stroke-[3px]" />
                       </button>
                    ) : (
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors shrink-0 ${ticket.status === 'Resolved' ? 'bg-brand-pistachio/10 text-brand-pistachio border border-brand-pistachio/20' : 'bg-brand-pewter/10 text-brand-pewter border border-brand-pewter/20'}`}>
                        {ticket.status === 'Resolved' ? <CheckCircle size={24} /> : <Clock size={24} />}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-brand-jungle dark:text-white text-lg uppercase tracking-tight leading-tight transition-colors break-words">{ticket.subject}</h4>
                      <div className="text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-[0.2em] mt-2 flex flex-wrap items-center gap-2 transition-colors">
                        <span>Ref: {ticket.id}</span>
                        <span className="opacity-30">•</span>
                        <span>{ticket.date}</span>
                        {isStaff && (
                           <>
                             <span className="opacity-30">•</span>
                             <span className="flex items-center gap-1 text-brand-jungle dark:text-brand-pistachio transition-colors truncate"><UserIcon size={12}/> {getUserName(ticket.userId)}</span>
                           </>
                        )}
                      </div>
                    </div>
                 </div>
                 <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm transition-colors shrink-0 ${
                   ticket.priority === 'High' ? 'bg-red-50 dark:bg-red-500/10 text-red-500 border-red-100 dark:border-red-500/20 shadow-red-500/10' :
                   'bg-brand-lightgray/10 dark:bg-white/5 text-brand-hooker dark:text-brand-lightgray/40 border-brand-lightgray/30 dark:border-white/10'
                 }`}>
                   {ticket.priority} Priority
                 </span>
              </div>
              <div className="pl-0 sm:pl-[68px]">
                <div className="text-sm font-medium text-brand-jungle dark:text-white bg-brand-lightgray/5 dark:bg-white/5 p-6 rounded-[2rem] border border-brand-lightgray/10 dark:border-white/5 leading-relaxed italic transition-colors">
                  "{ticket.message}"
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-24 bg-white dark:bg-brand-darksurface rounded-[3rem] border border-brand-lightgray/10 dark:border-white/10 shadow-soft transition-colors">
               <MessageSquare size={48} className="mx-auto text-brand-lightgray/30 dark:text-white/10 mb-6" />
               <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-lightgray dark:text-white/20">Operational Inbox Clear</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-jungle/60 z-[150] flex items-center justify-center p-6 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-brand-darksurface rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-brand-lightgray/20 dark:border-white/10 animate-modal-in transition-colors">
            <div className="px-10 py-8 border-b border-brand-lightgray/10 dark:border-white/5 flex justify-between items-center bg-brand-lightgray/5 dark:bg-white/5 transition-colors">
              <h3 className="font-black text-brand-jungle dark:text-white text-xl uppercase tracking-tight transition-colors">Create Support Ticket</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-brand-hooker dark:text-brand-lightgray hover:text-brand-jungle dark:hover:text-white transition-colors">
                <X size={28} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-[0.2em] ml-1 transition-colors">Subject</label>
                <input 
                  type="text" required value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  className="w-full bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-14 px-6 text-sm font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio text-brand-jungle dark:text-white transition-all"
                  placeholder="e.g. HS Code Discrepancy"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-[0.2em] ml-1 transition-colors">Priority</label>
                <select 
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                  className="w-full bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-14 px-6 text-sm font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio text-brand-jungle dark:text-white transition-all"
                >
                  <option value="Low">Low - Inquiry</option>
                  <option value="Medium">Medium - Operational</option>
                  <option value="High">High - Critical Blocker</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-[0.2em] ml-1 transition-colors">Description</label>
                <textarea 
                  required value={newTicket.message}
                  onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                  className="w-full bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl p-6 text-sm font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio text-brand-jungle dark:text-white transition-all h-40 resize-none placeholder:text-brand-hooker/30 dark:placeholder:text-white/20"
                  placeholder="Provide detailed context for the facilitating officer..."
                />
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-hooker dark:text-brand-lightgray/60 hover:bg-brand-lightgray/5 dark:hover:bg-white/5 transition-all">Abort</button>
                <button type="submit" className="flex-1 py-4 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-hooker dark:hover:bg-white shadow-brand transition-all">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 bg-brand-jungle/60 z-[160] flex items-center justify-center p-6 backdrop-blur-md animate-fade-in">
           <div className="bg-white dark:bg-brand-darksurface rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-brand-lightgray/20 dark:border-white/10 animate-modal-in">
              <div className="p-8 border-b border-brand-lightgray/10 dark:border-white/5 bg-brand-lightgray/5 dark:bg-white/5">
                 <h3 className="font-black text-brand-jungle dark:text-white text-lg uppercase tracking-tight flex items-center gap-3">
                   <FileText size={20} className="text-brand-pistachio" /> Resolve Ticket
                 </h3>
                 <p className="text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-widest mt-2">Ref: {ticketToResolve?.id}</p>
              </div>
              <form onSubmit={confirmResolve} className="p-8 space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/60 uppercase tracking-[0.2em] ml-1 mb-2">Resolution Note (Required)</label>
                    <textarea 
                       required
                       value={resolutionNote}
                       onChange={(e) => setResolutionNote(e.target.value)}
                       className="w-full bg-brand-lightgray/5 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl p-6 text-sm font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio text-brand-jungle dark:text-white transition-all h-32 resize-none placeholder:text-brand-hooker/30 dark:placeholder:text-white/20"
                       placeholder="Enter official resolution details for the exporter..."
                    />
                 </div>
                 <div className="flex gap-4">
                    <button type="button" onClick={() => setIsResolveModalOpen(false)} className="flex-1 py-4 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-hooker dark:text-brand-lightgray/60 hover:bg-brand-lightgray/5 dark:hover:bg-white/5 transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-4 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-hooker dark:hover:bg-white shadow-brand transition-all">Close Ticket</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
