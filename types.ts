
export type SystemModule = 'dashboard' | 'remip' | 'ifcms' | 'dedcp' | 'settings' | 'support' | 'gepa_admin';

export type UserRole = 'exporter' | 'bank' | 'government' | 'gepa_staff' | 'admin';

export type GovernmentAgency = 'Customs' | 'FDA' | 'EPA' | 'Ministry' | 'Port Authority';

export type LoanPurpose = 'Working Capital' | 'Export Goods' | 'Equipment' | 'Trade Credit Insurance';

export interface User {
  id: string;
  name: string;
  email: string;
  companyName: string; 
  tier: string; 
  avatarInitials: string;
  creditScore?: number;
  role: UserRole;
  agency?: GovernmentAgency;
}

export interface BroadcastMessage {
  id: string;
  sender: string;
  content: string;
  type: 'alert' | 'update' | 'market';
  timestamp: string;
}

export interface Notification {
  id: string;
  text: string;
  time: string;
  isNew: boolean;
  type: 'finance' | 'trade' | 'market' | 'system';
}

export interface LoanApplication {
  id: string;
  userId: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Review' | 'Rejected';
  type: LoanPurpose;
  institution: string;
  date: string;
  interestRate?: number;
  termMonths?: number;
  decisionNotes?: string;
  auditTrail?: {
    step: string;
    timestamp: string;
    actor: string;
  }[];
}

export interface ApprovalStep {
  agency: GovernmentAgency;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Action Required';
  officerName?: string;
  timestamp?: string;
  notes?: string;
}

export interface ShipmentDocument {
  id: string;
  userId: string;
  reference: string;
  destination: string;
  product: string;
  status: 'Draft' | 'Compliance Check' | 'Agency Review' | 'Approved' | 'Rejected';
  progress: number;
  date: string;
  approvals: ApprovalStep[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: string;
  resourceId: string;
  details: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface CreditScoreFactor {
  category: string;
  score: number;
  impact: 'High' | 'Medium' | 'Low';
  details: string;
}

export interface CommodityPrice {
  date: string;
  cocoa: number;
  cashew: number;
  sheaButter: number;
  mango: number;
}

export interface Buyer {
  id: string;
  name: string;
  country: string;
  demandLevel: string;
  products: string[];
}

export interface CreditScoreHistory {
  month: string;
  score: number;
}
