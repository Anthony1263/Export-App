
import { CommodityPrice, Buyer, LoanApplication, ShipmentDocument, CreditScoreHistory, User, SupportTicket, CreditScoreFactor } from './types';

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Kwaku Mensah',
    email: 'admin@kwakuexports.com',
    companyName: 'Kwaku Exports Ltd',
    tier: 'Tier 1',
    avatarInitials: 'KE',
    creditScore: 720,
    role: 'exporter'
  },
  {
    id: 'u2',
    name: 'Sarah Johnson',
    email: 'sarah@cocoapro.com',
    companyName: 'Cocoa Processing Co',
    tier: 'Tier 2',
    avatarInitials: 'CP',
    creditScore: 650,
    role: 'exporter'
  },
  {
    id: 'b1',
    name: 'Kwame Osei',
    email: 'kwame.osei@eximbank.gh',
    companyName: 'Exim Bank Ghana',
    tier: 'Credit Officer',
    avatarInitials: 'KO',
    role: 'bank'
  },
  {
    id: 'g1',
    name: 'Yaw Adjei',
    email: 'yaw.adjei@gra.gov.gh',
    companyName: 'Ghana Revenue Authority',
    tier: 'Customs Officer',
    avatarInitials: 'YA',
    role: 'government',
    agency: 'Customs'
  },
  {
    id: 'g2',
    name: 'Amara Okafor',
    email: 'amara.okafor@fda.gov.gh',
    companyName: 'Food & Drugs Authority',
    tier: 'Senior Inspector',
    avatarInitials: 'AO',
    role: 'government',
    agency: 'FDA'
  },
  {
    id: 's1',
    name: 'Esi Mansa',
    email: 'esi.mansa@gepa.gov.gh',
    companyName: 'GEPA HQ',
    tier: 'Exporter Services',
    avatarInitials: 'EM',
    role: 'gepa_staff'
  }
];

export const COMMODITY_DATA: CommodityPrice[] = [
  { date: 'Mon', cocoa: 2400, cashew: 1200, sheaButter: 800, mango: 150 },
  { date: 'Tue', cocoa: 2420, cashew: 1180, sheaButter: 810, mango: 155 },
  { date: 'Wed', cocoa: 2450, cashew: 1210, sheaButter: 805, mango: 152 },
  { date: 'Thu', cocoa: 2480, cashew: 1225, sheaButter: 820, mango: 160 },
  { date: 'Fri', cocoa: 2460, cashew: 1240, sheaButter: 830, mango: 165 },
  { date: 'Sat', cocoa: 2500, cashew: 1235, sheaButter: 825, mango: 162 },
  { date: 'Sun', cocoa: 2510, cashew: 1250, sheaButter: 840, mango: 170 },
];

export const FORECAST_DATA = [
  { date: 'Next Wk', cocoa: 2540, cashew: 1260, sheaButter: 845, mango: 175 },
  { date: 'Week 2', cocoa: 2580, cashew: 1270, sheaButter: 850, mango: 180 },
  { date: 'Week 3', cocoa: 2620, cashew: 1285, sheaButter: 855, mango: 182 },
  { date: 'Month 1', cocoa: 2650, cashew: 1300, sheaButter: 860, mango: 190 },
];

export const RISK_DISTRIBUTION = [
  { name: 'Low Risk', value: 65, color: '#10b981' },
  { name: 'Medium Risk', value: 25, color: '#f59e0b' },
  { name: 'High Risk', value: 10, color: '#ef4444' },
];

export const SECTOR_EXPOSURE = [
  { name: 'Cocoa', value: 45 },
  { name: 'Cashew', value: 30 },
  { name: 'Shea', value: 15 },
  { name: 'Horticulture', value: 10 },
];

export const BUYERS: Buyer[] = [
  { id: '1', name: 'Global Foods Ltd', country: 'Germany', demandLevel: 'High', products: ['Cocoa', 'Shea'] },
  { id: '2', name: 'Organic US Imports', country: 'USA', demandLevel: 'High', products: ['Cashew', 'Mango'] },
  { id: '3', name: 'Asia Pacific Trade', country: 'China', demandLevel: 'Medium', products: ['Cocoa'] },
  { id: '4', name: 'EuroMarket Chains', country: 'France', demandLevel: 'Medium', products: ['Pineapple', 'Mango'] },
  { id: '5', name: 'Nordic Shea Hub', country: 'Sweden', demandLevel: 'High', products: ['Shea Butter'] },
  { id: '6', name: 'Tokyo Sweets', country: 'Japan', demandLevel: 'Low', products: ['Cocoa Powder'] },
];

export const INITIAL_LOANS: LoanApplication[] = [
  { id: 'LN-2025-001', userId: 'u1', amount: 50000, status: 'Approved', type: 'Working Capital', institution: 'Exim Bank Ghana', date: '2025-10-12', interestRate: 18, termMonths: 24 },
  { id: 'LN-2025-004', userId: 'u1', amount: 120000, status: 'Review', type: 'Export Goods', institution: 'GCB Bank', date: '2025-12-01', interestRate: 18, termMonths: 12 },
  { id: 'LN-2025-009', userId: 'u2', amount: 25000, status: 'Pending', type: 'Equipment', institution: 'GEPA Export Fund', date: '2025-12-20', interestRate: 20, termMonths: 36 },
  { id: 'LN-2025-015', userId: 'u1', amount: 75000, status: 'Pending', type: 'Working Capital', institution: 'Exim Bank Ghana', date: '2025-12-16', interestRate: 18, termMonths: 18 },
  { id: 'LN-2025-022', userId: 'u1', amount: 200000, status: 'Rejected', type: 'Equipment', institution: 'Stanbic Bank', date: '2025-09-15', interestRate: 22, termMonths: 48, decisionNotes: 'Insufficient collateral documentation provided.' },
  { id: 'LN-2025-028', userId: 'u2', amount: 45000, status: 'Approved', type: 'Trade Credit Insurance', institution: 'Exim Bank Ghana', date: '2025-11-05', interestRate: 15, termMonths: 12 },
  { id: 'LN-2025-033', userId: 'u1', amount: 15000, status: 'Approved', type: 'Working Capital', institution: 'Fidelity Bank', date: '2025-11-20', interestRate: 17.5, termMonths: 6 },
  { id: 'LN-2025-041', userId: 'u2', amount: 80000, status: 'Review', type: 'Equipment', institution: 'Ecobank Ghana', date: '2025-12-24', interestRate: 19, termMonths: 36 },
];

export const INITIAL_DOCUMENTS: ShipmentDocument[] = [
  { 
    id: 'SHP-9921', 
    userId: 'u1', 
    reference: 'EXP-DE-2025-88', 
    destination: 'Germany', 
    product: 'Cocoa Beans', 
    status: 'Approved', 
    progress: 100, 
    date: '2025-12-10',
    approvals: [
      { agency: 'Customs', status: 'Approved', officerName: 'Yaw Adjei', timestamp: '2025-12-11T10:00:00' },
      { agency: 'FDA', status: 'Approved', officerName: 'Amara Okafor', timestamp: '2025-12-11T14:30:00' }
    ]
  },
  { 
    id: 'SHP-9922', 
    userId: 'u1', 
    reference: 'EXP-US-2025-41', 
    destination: 'USA', 
    product: 'Cashew Nuts', 
    status: 'Agency Review', 
    progress: 75, 
    date: '2025-12-14',
    approvals: [
      { agency: 'Customs', status: 'Approved', officerName: 'Yaw Adjei', timestamp: '2025-12-15T09:15:00' },
      { agency: 'FDA', status: 'Pending' }
    ]
  },
  { 
    id: 'SHP-9923', 
    userId: 'u1', 
    reference: 'EXP-CN-2025-09', 
    destination: 'China', 
    product: 'Shea Butter', 
    status: 'Compliance Check', 
    progress: 30, 
    date: '2025-12-16',
    approvals: [
      { agency: 'Customs', status: 'Action Required', notes: 'HS Code discrepancy detected in Section 4' }
    ]
  },
  { 
    id: 'SHP-9924', 
    userId: 'u2', 
    reference: 'EXP-UK-2025-11', 
    destination: 'UK', 
    product: 'Cocoa Powder', 
    status: 'Draft', 
    progress: 10, 
    date: '2025-12-22',
    approvals: []
  },
  { 
    id: 'SHP-9928', 
    userId: 'u2', 
    reference: 'EXP-JP-2025-55', 
    destination: 'Japan', 
    product: 'Dried Mango', 
    status: 'Agency Review', 
    progress: 60, 
    date: '2025-12-18',
    approvals: [
      { agency: 'Customs', status: 'Pending' }
    ]
  },
  { 
    id: 'SHP-9930', 
    userId: 'u1', 
    reference: 'EXP-FR-2025-02', 
    destination: 'France', 
    product: 'Pineapple Juice', 
    status: 'Approved', 
    progress: 100, 
    date: '2025-11-30',
    approvals: [
      { agency: 'Customs', status: 'Approved', officerName: 'Yaw Adjei', timestamp: '2025-12-01T09:00:00' },
      { agency: 'FDA', status: 'Approved', officerName: 'Amara Okafor', timestamp: '2025-12-01T11:00:00' }
    ]
  },
  { 
    id: 'SHP-9935', 
    userId: 'u1', 
    reference: 'EXP-SA-2025-14', 
    destination: 'South Africa', 
    product: 'Cocoa Paste', 
    status: 'Agency Review', 
    progress: 40, 
    date: '2025-12-25',
    approvals: [{ agency: 'Customs', status: 'Pending' }]
  },
  { 
    id: 'SHP-9939', 
    userId: 'u2', 
    reference: 'EXP-UAE-2025-07', 
    destination: 'UAE', 
    product: 'Fresh Pineapple', 
    status: 'Compliance Check', 
    progress: 20, 
    date: '2025-12-26',
    approvals: [{ agency: 'Customs', status: 'Action Required', notes: 'Phytosanitary certificate expired.' }]
  }
];

export const CREDIT_HISTORY: CreditScoreHistory[] = [
  { month: 'Jun', score: 580 },
  { month: 'Jul', score: 600 },
  { month: 'Aug', score: 620 },
  { month: 'Sep', score: 615 },
  { month: 'Oct', score: 650 },
  { month: 'Nov', score: 680 },
  { month: 'Dec', score: 720 },
];

export const CREDIT_FACTORS: CreditScoreFactor[] = [
  { category: 'Repayment History', score: 95, impact: 'High', details: 'No missed payments in last 24 months.' },
  { category: 'Export Consistency', score: 85, impact: 'High', details: 'Regular shipments (avg 2/month).' },
  { category: 'Doc Accuracy', score: 70, impact: 'Medium', details: 'Minor errors in DEDCP submissions.' },
  { category: 'Market Diversification', score: 60, impact: 'Medium', details: 'Concentrated in EU market only.' },
  { category: 'Credit Utilization', score: 90, impact: 'High', details: 'Using 45% of available credit limits.' }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  { id: 'TKT-1001', userId: 'u1', subject: 'HS Code Classification Help', message: 'I need clarification on the HS Code for Shea Butter processed vs raw.', status: 'Open', date: '2025-12-20', priority: 'Medium' },
  { id: 'TKT-1002', userId: 'u2', subject: 'Loan Application Error', message: 'Unable to upload tax clearance certificate on step 3.', status: 'Resolved', date: '2025-12-18', priority: 'High' },
  { id: 'TKT-1005', userId: 'u1', subject: 'System Latency', message: 'The DEDCP module is loading slowly during peak hours.', status: 'Open', date: '2025-12-23', priority: 'Low' },
  { id: 'TKT-1008', userId: 'u2', subject: 'Login Authentication Failure', message: 'Two-factor auth code not receiving via SMS provider.', status: 'Open', date: '2025-12-27', priority: 'High' }
];
