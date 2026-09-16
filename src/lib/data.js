// RLens — Mock Data Layer
// In production, this connects to your backend API

export const COUNTRIES = {
  AE: { name: 'UAE', nameAr: 'الإمارات', currency: 'AED', maxDSR: 0.50, minSalary: 5000, regulator: 'CBUAE', bureau: 'AECB' },
  SA: { name: 'KSA', nameAr: 'السعودية', currency: 'SAR', maxDSR: 0.55, minSalary: 4000, regulator: 'SAMA', bureau: 'SIMAH' },
  QA: { name: 'Qatar', nameAr: 'قطر', currency: 'QAR', maxDSR: 0.50, minSalary: 4000, regulator: 'QCB', bureau: 'QCB' },
  BH: { name: 'Bahrain', nameAr: 'البحرين', currency: 'BHD', maxDSR: 0.50, minSalary: 4000, regulator: 'CBB', bureau: 'BENEFIT' },
  KW: { name: 'Kuwait', nameAr: 'الكويت', currency: 'KWD', maxDSR: 0.40, minSalary: 4000, regulator: 'CBK', bureau: 'Ci-Net' },
  OM: { name: 'Oman', nameAr: 'عمان', currency: 'OMR', maxDSR: 0.50, minSalary: 3500, regulator: 'CBO', bureau: 'CBO' },
}

export const APPLICATIONS = [
  { id: 'AE-2026-1234', applicantName: 'Ahmed Al-Mansouri', applicantNameAr: 'أحمد المنصوري', type: 'RETAIL', product: 'Personal Loan', amount: 50000, currency: 'AED', requestedTenor: 48, salary: 12000, score: 580, grade: 'BB-', status: 'REFERRED', dsr: 0.52, existingEmis: 2200, country: 'AE', employer: 'Government', tenureMonths: 8, creditHistoryMonths: 18, lastUpdated: '2026-09-16T10:30:00Z' },
  { id: 'AE-2026-1235', applicantName: 'Fatima Al-Khalifa', applicantNameAr: 'فاطمة الخليفة', type: 'RETAIL', product: 'Credit Card', amount: 25000, currency: 'AED', requestedTenor: 0, salary: 18000, score: 742, grade: 'B+', status: 'APPROVED', dsr: 0.38, existingEmis: 1800, country: 'AE', employer: 'Multinational', tenureMonths: 24, creditHistoryMonths: 36, lastUpdated: '2026-09-15T14:20:00Z' },
  { id: 'AE-2026-1236', applicantName: 'Mohammed Al-Rashid', applicantNameAr: 'محمد الراشد', type: 'RETAIL', product: 'Auto Loan', amount: 120000, currency: 'AED', requestedTenor: 60, salary: 15000, score: 695, grade: 'BBB', status: 'SCORED', dsr: 0.44, existingEmis: 3200, country: 'AE', employer: 'Oil & Gas', tenureMonths: 36, creditHistoryMonths: 48, lastUpdated: '2026-09-16T09:15:00Z' },
  { id: 'SA-2026-0891', applicantName: 'Khalid Al-Otaibi', applicantNameAr: 'خالد العتيبي', type: 'RETAIL', product: 'Personal Loan', amount: 80000, currency: 'SAR', requestedTenor: 48, salary: 22000, score: 812, grade: 'AA', status: 'APPROVED', dsr: 0.32, existingEmis: 1500, country: 'SA', employer: 'Finance', tenureMonths: 60, creditHistoryMonths: 72, lastUpdated: '2026-09-14T16:45:00Z' },
  { id: 'AE-2026-1237', applicantName: 'Sara Al-Nuaimi', applicantNameAr: 'سارة النعيمي', type: 'RETAIL', product: 'BNPL', amount: 5000, currency: 'AED', requestedTenor: 12, salary: 8000, score: 390, grade: 'C', status: 'DECLINED', dsr: 0.61, existingEmis: 3800, country: 'AE', employer: 'Retail', tenureMonths: 4, creditHistoryMonths: 12, lastUpdated: '2026-09-16T08:00:00Z' },
  { id: 'AE-2026-1238', applicantName: 'Gulf Trading LLC', applicantNameAr: 'الخليج للتجارة ش.م.م', type: 'SME', product: 'Working Capital', amount: 500000, currency: 'AED', requestedTenor: 24, revenue: 2400000, profitMargin: 0.12, sector: 'Trade', yearsInBusiness: 5, employeeCount: 12, score: 685, grade: 'BBB', status: 'REFERRED', dsr: 0.45, country: 'AE', lastUpdated: '2026-09-16T11:00:00Z' },
  { id: 'QA-2026-0456', applicantName: 'Al-Doha Logistics', applicantNameAr: 'الدوحة للخدمات اللوجستية', type: 'SME', product: 'Trade Finance', amount: 1200000, currency: 'QAR', requestedTenor: 36, revenue: 5200000, profitMargin: 0.08, sector: 'Logistics', yearsInBusiness: 8, employeeCount: 28, score: 720, grade: 'A-', status: 'SCORED', dsr: 0.35, country: 'QA', lastUpdated: '2026-09-15T10:30:00Z' },
  { id: 'AE-2026-1239', applicantName: 'Noura Al-Harthi', applicantNameAr: 'نoura الحارثي', type: 'RETAIL', product: 'Home Loan', amount: 850000, currency: 'AED', requestedTenor: 240, salary: 25000, score: 765, grade: 'A', status: 'SCORED', dsr: 0.34, existingEmis: 2800, country: 'AE', employer: 'Education', tenureMonths: 48, creditHistoryMonths: 60, lastUpdated: '2026-09-16T13:20:00Z' },
  { id: 'BH-2026-0102', applicantName: 'Khalid Al-Waleed', applicantNameAr: 'خالد الوليد', type: 'RETAIL', product: 'Auto Loan', amount: 45000, currency: 'BHD', requestedTenor: 48, salary: 8000, score: 634, grade: 'BB', status: 'REFERRED', dsr: 0.48, existingEmis: 1200, country: 'BH', employer: 'Construction', tenureMonths: 18, creditHistoryMonths: 24, lastUpdated: '2026-09-14T11:00:00Z' },
  { id: 'KW-2026-0334', applicantName: 'Salim Al-Fahad', applicantNameAr: 'سالم الفهد', type: 'RETAIL', product: 'Personal Loan', amount: 30000, currency: 'KWD', requestedTenor: 36, salary: 1200, score: 698, grade: 'BBB', status: 'SCORED', dsr: 0.42, existingEmis: 400, country: 'KW', employer: 'Government', tenureMonths: 36, creditHistoryMonths: 30, lastUpdated: '2026-09-16T07:45:00Z' },
]

export const FRAUD_ALERTS = [
  { id: 'FA-001', customerName: 'Unknown Card Holder', type: 'VELOCITY', severity: 'CRITICAL', details: '12 transactions in 5 minutes across 3 countries', timeAgo: '2 min ago', status: 'NEW', assignedTo: null, amount: null },
  { id: 'FA-002', customerName: 'Ahmed Al-Mahmoud', type: 'SANCTIONS', severity: 'CRITICAL', details: 'Near-match on OFAC sanctions list (92% confidence)', timeAgo: '15 min ago', status: 'ASSIGNED', assignedTo: 'Maria Garcia', amount: null },
  { id: 'FA-003', customerName: 'Gulf Trading LLC', type: 'AMOUNT', severity: 'HIGH', details: 'Transfer of 890,000 AED — 5x normal daily volume', timeAgo: '1 hour ago', status: 'INVESTIGATING', assignedTo: 'James Wilson', amount: 890000 },
  { id: 'FA-004', customerName: 'Fatima K.', type: 'GEOLOCATION', severity: 'MEDIUM', details: 'Transaction from Nigeria — customer has no travel history', timeAgo: '3 hours ago', status: 'NEW', assignedTo: null, amount: 15000 },
  { id: 'FA-005', customerName: 'ABC Construction', type: 'PATTERN', severity: 'MEDIUM', details: 'Circular fund flow detected between 3 related accounts', timeAgo: '5 hours ago', status: 'ASSIGNED', assignedTo: 'Sarah Chen', amount: 250000 },
  { id: 'FA-006', customerName: 'Mohammed Al-Rashid', type: 'VELOCITY', severity: 'LOW', details: '3 credit card applications in 24 hours', timeAgo: '8 hours ago', status: 'NEW', assignedTo: null, amount: null },
  { id: 'FA-007', customerName: 'Al-Doha Logistics', type: 'DOCUMENT', severity: 'HIGH', details: 'Trade license expiry within 30 days — verification required', timeAgo: '1 day ago', status: 'INVESTIGATING', assignedTo: 'Ahmed Hassan', amount: null },
]

export const KPI_DATA = {
  totalApplications: APPLICATIONS.length,
  approved: APPLICATIONS.filter(a => a.status === 'APPROVED').length,
  pending: APPLICATIONS.filter(a => ['REFERRED', 'SCORED', 'SUBMITTED'].includes(a.status)).length,
  declined: APPLICATIONS.filter(a => a.status === 'DECLINED').length,
  avgScore: Math.round(APPLICATIONS.reduce((s, a) => s + a.score, 0) / APPLICATIONS.length),
  totalPortfolio: APPLICATIONS.reduce((s, a) => s + (a.amount || 0), 0),
  nplRatio: 0.024,
  activeAlerts: FRAUD_ALERTS.length,
  highRiskApplications: APPLICATIONS.filter(a => a.score < 600).length,
}

export const SECTOR_EXPOSURE = [
  { sector: 'Trade & Retail', exposure: 32, risk: 'medium', color: 'var(--accent-amber)' },
  { sector: 'Construction', exposure: 22, risk: 'high', color: 'var(--accent-rose)' },
  { sector: 'Technology', exposure: 18, risk: 'low', color: 'var(--accent-emerald)' },
  { sector: 'Real Estate', exposure: 15, risk: 'medium', color: 'var(--accent-amber)' },
  { sector: 'Oil & Gas', exposure: 8, risk: 'low', color: 'var(--accent-emerald)' },
  { sector: 'Other', exposure: 5, risk: 'low', color: 'var(--accent-cyan)' },
]

export const REGULATORY_DOCS = [
  { id: 'REG-001', title: 'CBUAE Retail Credit Scoring Guidelines', type: 'regulation', country: 'AE', updated: '2026-08-15', excerpt: 'Guidelines for retail credit scoring and DSR calculation in the UAE...' },
  { id: 'REG-002', title: 'SAMA SME Lending Framework', type: 'regulation', country: 'SA', updated: '2026-07-20', excerpt: 'SAMA framework for SME lending including collateral requirements...' },
  { id: 'POL-001', title: 'Internal Credit Policy v3.2', type: 'policy', country: 'AE', updated: '2026-09-01', excerpt: 'RLens internal credit policy — risk grades, approval limits, exceptions...' },
  { id: 'POL-002', title: 'AML/Sanctions Screening Procedure', type: 'policy', country: 'AE', updated: '2026-08-10', excerpt: 'Procedure for sanctions screening and AML case management...' },
  { id: 'GUI-001', title: 'GCC KYC Standards', type: 'guideline', country: 'AE', updated: '2026-06-25', excerpt: 'KYC requirements for retail and SME customers across GCC...' },
]
