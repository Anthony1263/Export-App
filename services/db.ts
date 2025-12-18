
import { LoanApplication, ShipmentDocument, SupportTicket, AuditLog, BroadcastMessage } from '../types';
import { INITIAL_LOANS, INITIAL_DOCUMENTS, INITIAL_TICKETS } from '../constants';

const LATENCY = 300; // Slightly reduced latency for snappier feel
const DB_VERSION = 'v2'; // Bump version to force fresh data load
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const storage = {
  get: <T>(key: string, fallback: T): T => {
    const data = localStorage.getItem(`gepa_db_${DB_VERSION}_${key}`);
    return data ? JSON.parse(data) : fallback;
  },
  set: <T>(key: string, value: T) => {
    localStorage.setItem(`gepa_db_${DB_VERSION}_${key}`, JSON.stringify(value));
  }
};

export const db = {
  loans: {
    list: async () => { await delay(LATENCY); return storage.get('loans', INITIAL_LOANS); },
    create: async (l: LoanApplication) => { const loans = storage.get('loans', INITIAL_LOANS); storage.set('loans', [l, ...loans]); },
    update: async (id: string, u: Partial<LoanApplication>) => {
      const loans = storage.get('loans', INITIAL_LOANS);
      storage.set('loans', loans.map(l => l.id === id ? { ...l, ...u } : l));
    }
  },
  documents: {
    list: async () => { await delay(LATENCY); return storage.get('documents', INITIAL_DOCUMENTS); },
    create: async (d: ShipmentDocument) => { const docs = storage.get('documents', INITIAL_DOCUMENTS); storage.set('documents', [d, ...docs]); },
    update: async (id: string, u: Partial<ShipmentDocument>) => {
      const docs = storage.get('documents', INITIAL_DOCUMENTS);
      storage.set('documents', docs.map(d => d.id === id ? { ...d, ...u } : d));
    }
  },
  broadcasts: {
    list: async () => { await delay(LATENCY / 2); return storage.get('broadcasts', []); },
    create: async (b: BroadcastMessage) => { const bcs = storage.get('broadcasts', []); storage.set('broadcasts', [b, ...bcs]); }
  },
  tickets: {
    list: async () => { await delay(LATENCY); return storage.get('tickets', INITIAL_TICKETS); },
    create: async (t: SupportTicket) => { const ts = storage.get('tickets', INITIAL_TICKETS); storage.set('tickets', [t, ...ts]); },
    update: async (id: string, u: Partial<SupportTicket>) => {
      const ts = storage.get('tickets', INITIAL_TICKETS);
      storage.set('tickets', ts.map(t => t.id === id ? { ...t, ...u } : t));
    }
  },
  audit: {
    list: async () => { await delay(LATENCY / 4); return storage.get('audit', []); },
    push: async (log: AuditLog) => { const logs = storage.get('audit', []); storage.set('audit', [log, ...logs]); }
  }
};
