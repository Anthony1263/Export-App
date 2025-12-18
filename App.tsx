
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from './components/Layout';
import { LoginPage } from './components/LoginPage';
import { DashboardHome } from './components/DashboardHome';
import { BankDashboardHome } from './components/BankDashboardHome';
import { GovernmentDashboard } from './components/GovernmentDashboard';
import { GepaDashboard } from './components/GepaDashboard';
import { RemipModule } from './components/RemipModule';
import { IfcmsModule } from './components/IfcmsModule';
import { BankIfcmsModule } from './components/BankIfcmsModule';
import { DedcpModule } from './components/DedcpModule';
import { SettingsModule } from './components/SettingsModule';
import { SupportModule } from './components/SupportModule';
import { AIAssistant } from './components/AIAssistant';
import { db } from './services/db';
import { SystemModule, User, LoanApplication, ShipmentDocument, AuditLog, GovernmentAgency, SupportTicket, ToastMessage, BroadcastMessage, Notification } from './types';
import { USERS } from './constants';
import { Loader2, Globe, Activity, Building2 } from 'lucide-react';

interface SocialProof {
  id: number;
  text: string;
  type: 'trade' | 'finance' | 'market';
  company: string;
}

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('gepa_current_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [activeModule, setActiveModule] = useState<SystemModule>('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [documents, setDocuments] = useState<ShipmentDocument[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [socialProof, setSocialProof] = useState<SocialProof | null>(null);
  
  const [connectedBuyers, setConnectedBuyers] = useState<string[]>(() => {
    const stored = localStorage.getItem('gepa_connected_buyers');
    return stored ? JSON.parse(stored) : [];
  });
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [processingText, setProcessingText] = useState('Hashing Record...');
  const [isProcessing, setIsProcessing] = useState(false);

  // Ref for simulation loop to access latest state without resetting interval
  const stateRef = useRef({ loans, documents, currentUser, broadcasts });
  
  // Keep ref synchronized
  useEffect(() => {
    stateRef.current = { loans, documents, currentUser, broadcasts };
  }, [loans, documents, currentUser, broadcasts]);

  useEffect(() => {
    const initData = async () => {
      try {
        const [l, d, t, a, b] = await Promise.all([
          db.loans.list(),
          db.documents.list(),
          db.tickets.list(),
          db.audit.list(),
          db.broadcasts.list()
        ]);
        setLoans(l);
        setDocuments(d);
        setTickets(t);
        setAuditLogs(a);
        setBroadcasts(b);
      } catch (err) {
        console.error("Database initialization failed", err);
      } finally {
        setIsInitializing(false);
      }
    };
    initData();
  }, []);

  const pushAudit = useCallback(async (action: string, resourceId: string, details: string, actor?: User) => {
    const target = actor || stateRef.current.currentUser;
    if (!target) return;
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random()*10000)}`,
      timestamp: new Date().toISOString(),
      actorId: target.id,
      actorName: target.name,
      action,
      resourceId,
      details
    };
    await db.audit.push(newLog);
    setAuditLogs(prev => [newLog, ...prev]);
  }, []);

  const addNotification = useCallback((text: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      text,
      time: 'Just now',
      isNew: true,
      type
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const triggerSocialProof = (text: string, type: SocialProof['type'], company: string) => {
    setSocialProof({ id: Date.now(), text, type, company });
    // Clear after 5 seconds
    setTimeout(() => setSocialProof(prev => prev && prev.text === text ? null : prev), 5000);
  };

  // --- ACTOR-AWARE ECOSYSTEM SIMULATION ---
  useEffect(() => {
    const simulationInterval = setInterval(async () => {
      const { currentUser, loans, documents, broadcasts } = stateRef.current;
      if (!currentUser) return;

      // 1. SIMULATE OTHER EXPORTERS GENERATING WORKLOAD (SOCIAL PROOF)
      const exporters = USERS.filter(u => u.role === 'exporter' && u.id !== currentUser?.id);
      
      // Chance to generate work from other users
      if (exporters.length > 0 && Math.random() > 0.6) {
        const randomExporter = exporters[Math.floor(Math.random() * exporters.length)];
        const actionType = Math.random() > 0.5 ? 'LOAN' : 'DOC';

        if (actionType === 'LOAN') {
          // Check if this exporter already has too many pending loans to avoid spam
          const pendingCount = loans.filter(l => l.userId === randomExporter.id && l.status === 'Pending').length;
          if (pendingCount < 3) {
             const newLoan: LoanApplication = {
              id: `LN-SIM-${Date.now()}-${Math.floor(Math.random()*1000)}`,
              userId: randomExporter.id,
              status: 'Pending',
              date: new Date().toISOString().split('T')[0],
              amount: [25000, 50000, 75000, 150000, 200000][Math.floor(Math.random()*5)],
              type: 'Working Capital',
              institution: 'Exim Bank Ghana',
              interestRate: 18.5,
              termMonths: 24
            };
            await db.loans.create(newLoan);
            setLoans(prev => [newLoan, ...prev]);
            
            triggerSocialProof(`Applied for GH₵${newLoan.amount.toLocaleString()} capital`, 'finance', randomExporter.companyName);

            // Only notify if relevant to current user
            if (currentUser.role === 'bank' || currentUser.role === 'gepa_staff') {
              addNotification(`New capital request protocol initiated by ${randomExporter.companyName}`, 'finance');
            }
          }
        } else {
           // Check pending docs
           const pendingDocs = documents.filter(d => d.userId === randomExporter.id && d.status !== 'Approved').length;
           if (pendingDocs < 3) {
             const newDoc: ShipmentDocument = {
              id: `SHP-SIM-${Date.now()}-${Math.floor(Math.random()*1000)}`,
              userId: randomExporter.id,
              status: 'Agency Review',
              progress: 25,
              date: new Date().toISOString().split('T')[0],
              reference: `EXP-AUTO-${Math.floor(Math.random()*100000)}`,
              product: ['Shea Butter', 'Cocoa Powder', 'Cashews', 'Dried Mango'][Math.floor(Math.random()*4)],
              destination: ['Germany', 'USA', 'China', 'Japan', 'UK'][Math.floor(Math.random()*5)],
              approvals: [{ agency: 'Customs', status: 'Pending' }, { agency: 'FDA', status: 'Pending' }]
            };
            await db.documents.create(newDoc);
            setDocuments(prev => [newDoc, ...prev]);
            
            triggerSocialProof(`Initiated manifest for ${newDoc.product} to ${newDoc.destination}`, 'trade', randomExporter.companyName);

            if (currentUser.role === 'government' || currentUser.role === 'gepa_staff') {
               addNotification(`Manifest ${newDoc.reference} transmitted for review`, 'trade');
            }
           }
        }
      }

      // 2. SIMULATE BROADCASTS (Market News)
      if (Math.random() > 0.9) {
         const marketNews = [
            { t: 'market', c: 'Global Cocoa prices surged 2.4% in London trading session.' },
            { t: 'alert', c: 'Port Authority: New digital scanning protocol active at Terminal 3.' },
            { t: 'update', c: 'BoG Update: Export retention quota adjusted for non-traditional exports.' },
            { t: 'market', c: 'High demand for Cashew reported in Vietnam market.' },
            { t: 'update', c: 'GEPA Alert: Shea butter conference registration closes tomorrow.' }
         ];
         const news = marketNews[Math.floor(Math.random() * marketNews.length)];
         
         // Don't repeat the last broadcast
         if (broadcasts.length === 0 || broadcasts[0].content !== news.c) {
            const newB: BroadcastMessage = {
                id: `BRC-AUTO-${Date.now()}`,
                sender: 'System Node',
                content: news.c,
                type: news.t as any,
                timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
            await db.broadcasts.create(newB);
            setBroadcasts(prev => [newB, ...prev]);
            addNotification(`Broadcast: ${news.c}`, 'market');
         }
      }

      // 3. SIMULATE BACKGROUND DECISIONS ON USER ITEMS (If current user is exporter)
      // This simulates "the system" responding to the user's actions
      if (currentUser.role === 'exporter' && Math.random() > 0.8) {
        // Handle Loan Decisions (Simulate Bank Officer)
        const myPendingLoan = loans.find(l => l.userId === currentUser.id && l.status === 'Pending');
        if (myPendingLoan) {
          const decision = Math.random() > 0.3 ? 'Approved' : 'Rejected';
          const interest = decision === 'Approved' ? 17.5 : undefined;
          
          await db.loans.update(myPendingLoan.id, { status: decision, interestRate: interest });
          setLoans(prev => prev.map(l => l.id === myPendingLoan.id ? { ...l, status: decision, interestRate: interest } : l));
          
          addNotification(`Financial Node Response: Your loan ${myPendingLoan.id} has been ${decision.toUpperCase()}.`, 'finance');
          showToast(`Finance Update: ${myPendingLoan.id} finalized as ${decision}.`, decision === 'Approved' ? 'success' : 'error');
        }

        // Handle Doc Reviews (Simulate Gov Officer)
        const myPendingDoc = documents.find(d => d.userId === currentUser.id && d.status === 'Agency Review');
        if (myPendingDoc) {
          const updates = { status: 'Approved' as any, progress: 100 };
          await db.documents.update(myPendingDoc.id, updates);
          setDocuments(prev => prev.map(d => d.id === myPendingDoc.id ? { ...d, ...updates } : d));
          
          addNotification(`Sovereign Authorization: Manifest ${myPendingDoc.reference} has cleared all agency protocols.`, 'trade');
          showToast(`Trade Clearance: ${myPendingDoc.reference} verified.`, 'success');
        }
      }

    }, 12000); // 12-second pulse for ecosystem logic

    return () => clearInterval(simulationInterval);
  }, [addNotification, showToast]); // Empty dependencies for currentUser/loans/docs because we use stateRef

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('gepa_current_user', JSON.stringify(user));
    setActiveModule('dashboard');
    showToast(`Terminal Authorized. Welcome, ${user.name}.`, 'success');
    addNotification(`Authentication handshake successful. Role: ${user.role.toUpperCase()} initialized.`, 'system');
    pushAudit('AUTH_LOGIN', user.id, `User session initialized from terminal node.`, user);
  };

  const handleSignOut = () => {
    pushAudit('AUTH_LOGOUT', currentUser?.id || 'unknown', `User session terminated.`);
    setCurrentUser(null);
    localStorage.removeItem('gepa_current_user');
    localStorage.removeItem('gepa_connected_buyers');
    setConnectedBuyers([]);
    setActiveModule('dashboard');
    setNotifications([]);
  };

  const handleAddLoan = async (data: any) => {
    if (!currentUser) return;
    setProcessingText('Verifying Creditworthiness...');
    setIsProcessing(true);
    const newLoan: LoanApplication = {
      id: `LN-${Date.now().toString().slice(-6)}`,
      userId: currentUser.id,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      interestRate: 19.0, // Initial estimate
      termMonths: 12,
      ...data
    };
    await db.loans.create(newLoan);
    setLoans(prev => [newLoan, ...prev]);
    addNotification(`Financial application ${newLoan.id} for GH₵ ${newLoan.amount.toLocaleString()} is now in the vetting queue.`, 'finance');
    await pushAudit('FINANCE_APPLY', newLoan.id, `Application for GH₵ ${newLoan.amount.toLocaleString()} submitted to ${newLoan.institution}.`);
    showToast('Credit application synchronized.', 'success');
    setIsProcessing(false);
  };

  const handleBankDecision = async (loanId: string, decision: 'Approved' | 'Rejected', notes: string) => {
    setProcessingText('Committing Decision to Ledger...');
    setIsProcessing(true);
    await db.loans.update(loanId, { status: decision, decisionNotes: notes });
    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: decision, decisionNotes: notes } : l));
    
    const targetLoan = loans.find(l => l.id === loanId);
    if (targetLoan) {
        const applicant = USERS.find(u => u.id === targetLoan.userId);
        addNotification(`Protocol finalized: ${decision} loan for ${applicant?.companyName || 'Unknown Entity'}.`, 'finance');
    }
    
    await pushAudit('FINANCE_DECISION', loanId, `Loan ${decision.toUpperCase()} by officer ${currentUser?.name}. Notes: ${notes}`);
    showToast(`Decision protocol concluded.`, 'success');
    setIsProcessing(false);
  };

  const handleAddDocument = async (data: any) => {
    if (!currentUser) return;
    setProcessingText('Transmitting Manifest Data...');
    setIsProcessing(true);
    const required: GovernmentAgency[] = ['Customs', 'Port Authority'];
    if (data.product.toLowerCase().includes('cocoa')) required.push('FDA');

    const newDoc: ShipmentDocument = {
      id: `SHP-${Date.now().toString().slice(-4)}`,
      userId: currentUser.id,
      status: 'Agency Review',
      progress: 25,
      date: new Date().toISOString().split('T')[0],
      approvals: required.map(agency => ({ agency, status: 'Pending' })),
      ...data
    };
    await db.documents.create(newDoc);
    setDocuments(prev => [newDoc, ...prev]);
    addNotification(`Trade manifest ${newDoc.reference} distributed to ${required.length} regulatory nodes.`, 'trade');
    await pushAudit('TRADE_MANIFEST_NEW', newDoc.reference, `New shipment manifest initialized for ${newDoc.product} to ${newDoc.destination}.`);
    showToast(`Manifest ${newDoc.reference} transmitted.`, 'success');
    setIsProcessing(false);
  };

  const handleGovernmentDecision = async (docId: string, decision: 'Approved' | 'Rejected' | 'Action Required', notes: string) => {
    if (!currentUser) return;
    setProcessingText('Authorizing Regulatory Seal...');
    setIsProcessing(true);
    const agency = currentUser.agency!;
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    const updatedApprovals = doc.approvals.map(a => a.agency === agency ? {
      ...a, status: decision, officerName: currentUser.name, timestamp: new Date().toISOString(), notes
    } : a);

    let masterStatus = doc.status;
    const allApproved = updatedApprovals.every(a => a.status === 'Approved');
    if (updatedApprovals.some(a => a.status === 'Rejected')) masterStatus = 'Rejected';
    else if (updatedApprovals.some(a => a.status === 'Action Required')) masterStatus = 'Compliance Check';
    else if (allApproved) masterStatus = 'Approved';

    const updates = { approvals: updatedApprovals, status: masterStatus, progress: allApproved ? 100 : Math.min(95, doc.progress + 20) };
    await db.documents.update(docId, updates);
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, ...updates } : d));
    
    addNotification(`Agency Clearance: ${agency} has marked manifest ${doc.reference} as ${decision.toUpperCase()}.`, 'trade');
    await pushAudit('GOV_AUTH', doc.reference, `${agency} decision: ${decision}. Action taken by ${currentUser.name}.`);
    showToast(`${agency} authorization recorded.`, 'success');
    setIsProcessing(false);
  };

  const handleSendBroadcast = async (broadcast: Omit<BroadcastMessage, 'id' | 'timestamp'>) => {
    const newB: BroadcastMessage = {
      id: `BRC-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...broadcast
    };
    await db.broadcasts.create(newB);
    setBroadcasts(prev => [newB, ...prev]);
    addNotification(`Market Pulse: HQ has issued a strategic broadcast concerning ${broadcast.type.toUpperCase()}.`, 'market');
    await pushAudit('HQ_BROADCAST', newB.id, `Global transmission sent: ${broadcast.content.substring(0, 30)}...`);
    showToast('Strategic broadcast transmitted.', 'success');
  };

  const handleConnectBuyer = (name: string) => {
    setConnectedBuyers(prev => {
      if (prev.includes(name)) return prev;
      const next = [...prev, name];
      localStorage.setItem('gepa_connected_buyers', JSON.stringify(next));
      return next;
    });
    addNotification(`Market Link Established: Real-time demand sync initialized with ${name}.`, 'market');
    showToast(`Transmission node linked with ${name}.`, 'success');
    pushAudit('BUYER_CONNECT', name, `Established secure handshake with international buyer node: ${name}`);
  };

  if (isInitializing) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-brand-darkbg">
      <Loader2 className="animate-spin text-brand-jungle dark:text-brand-pistachio mb-4" size={48} />
      <h1 className="text-xl font-black text-brand-jungle dark:text-white uppercase tracking-tighter">Initializing GEPA Core...</h1>
    </div>
  );

  if (!currentUser) return <LoginPage onLogin={handleLogin} />;

  return (
    <Layout 
      activeModule={activeModule} 
      onNavigate={setActiveModule}
      currentUser={currentUser}
      onSignOut={handleSignOut}
      notifications={notifications}
      recentBroadcast={broadcasts[0]}
    >
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 pointer-events-none items-center w-full max-w-md px-6">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className="pointer-events-auto bg-white dark:bg-brand-darksurface border border-brand-lightgray/20 dark:border-white/10 text-brand-jungle dark:text-white px-6 py-4 rounded-2xl shadow-brand text-[11px] font-bold flex items-center gap-4 animate-toast-in w-full transition-colors"
          >
            <div className={`w-3 h-3 rounded-full shrink-0 ${t.type === 'success' ? 'bg-brand-pistachio shadow-pistachio-glow' : t.type === 'error' ? 'bg-red-500 shadow-lg' : 'bg-brand-pewter'}`} />
            <span className="leading-snug tracking-tight uppercase font-black">{t.message}</span>
          </div>
        ))}
      </div>

      {socialProof && (
        <div className="fixed bottom-6 left-6 z-40 bg-white dark:bg-brand-darksurface border border-brand-lightgray/20 dark:border-white/10 text-brand-jungle dark:text-white p-4 rounded-2xl shadow-brand flex items-center gap-4 animate-slide-up max-w-xs transition-colors">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${socialProof.type === 'finance' ? 'bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle' : 'bg-brand-pewter text-white'}`}>
             {socialProof.type === 'finance' ? <Activity size={18} /> : <Globe size={18} />}
          </div>
          <div>
             <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5">{socialProof.company}</p>
             <p className="text-[10px] font-bold leading-tight">{socialProof.text}</p>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-brand-jungle/40 z-[400] flex items-center justify-center cursor-wait animate-fade-in">
          <div className="bg-white dark:bg-brand-darksurface text-brand-jungle dark:text-white px-10 py-6 rounded-2xl shadow-brand flex items-center gap-6 border border-brand-lightgray/10 dark:border-white/5 animate-modal-in transition-colors">
            <div className="w-8 h-8 border-4 border-brand-jungle/10 dark:border-white/10 border-t-brand-jungle dark:border-t-brand-pistachio rounded-full animate-spin"></div>
            <span className="text-sm font-black uppercase tracking-[0.2em]">{processingText}</span>
          </div>
        </div>
      )}

      <AIAssistant 
        isOpen={isAIAssistantOpen} 
        onToggle={() => setIsAIAssistantOpen(!isAIAssistantOpen)} 
        user={currentUser} 
        activeModule={activeModule}
      />

      {activeModule === 'dashboard' && (
        currentUser.role === 'bank' ? (
          <BankDashboardHome onNavigate={setActiveModule} user={currentUser} loans={loans} onShowToast={showToast} />
        ) : currentUser.role === 'government' ? (
          <GovernmentDashboard user={currentUser} documents={documents} onDecision={handleGovernmentDecision} onShowToast={showToast} />
        ) : currentUser.role === 'gepa_staff' ? (
          <GepaDashboard users={USERS} loans={loans} documents={documents} tickets={tickets} onNavigate={setActiveModule} broadcasts={broadcasts} onSendBroadcast={handleSendBroadcast} />
        ) : (
          <DashboardHome onNavigate={setActiveModule} user={currentUser} loans={loans.filter(l => l.userId === currentUser.id)} documents={documents.filter(d => d.userId === currentUser.id)} onShowToast={showToast} />
        )
      )}
      
      {activeModule === 'remip' && <RemipModule onShowToast={showToast} connectedBuyers={connectedBuyers} onConnect={handleConnectBuyer} userRole={currentUser.role} />}
      {activeModule === 'ifcms' && (currentUser.role === 'bank' ? <BankIfcmsModule user={currentUser} loans={loans} onDecideLoan={handleBankDecision} /> : <IfcmsModule user={currentUser} loans={loans.filter(l => l.userId === currentUser.id)} onAddLoan={handleAddLoan} onShowToast={showToast} />)}
      {activeModule === 'dedcp' && <DedcpModule 
          documents={currentUser.role === 'exporter' ? documents.filter(d => d.userId === currentUser.id) : documents} 
          onAddDocument={handleAddDocument} 
          onShowToast={showToast} 
          userRole={currentUser.role} 
          user={currentUser} 
      />}
      {activeModule === 'settings' && <SettingsModule user={currentUser} auditLogs={auditLogs} />}
      {activeModule === 'support' && <SupportModule user={currentUser} tickets={tickets} onResolveTicket={async (id, note) => {
          await db.tickets.update(id, { status: 'Resolved' });
          setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
          showToast(`Resolved: Ticket ${id}`, 'success');
          addNotification(`Support Protocol Finalized: Incident ${id} resolved. Note: "${note}"`, 'system');
          pushAudit('SUPPORT_RESOLVE', id, `Ticket resolved by ${currentUser.name}. Note: ${note}`);
      }} onAddTicket={async (t) => {
        if (!currentUser) return;
        const nt = { id: `TKT-${Date.now().toString().slice(-4)}`, userId: currentUser.id, status: 'Open', date: new Date().toISOString().split('T')[0], ...t } as SupportTicket;
        await db.tickets.create(nt);
        setTickets(prev => [nt, ...prev]);
        showToast('Support ticket logged.', 'success');
        addNotification(`New support inquiry transmitted: ${t.subject}. Ref: ${nt.id}`, 'system');
      }} />}
    </Layout>
  );
}
