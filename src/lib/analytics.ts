import { Transaction } from './types';

export function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

export function getKPIs(txns: Transaction[]) {
  const successful = txns.filter(t => t.status === 'SUCCESS');
  const totalTxns = txns.length;
  const totalGMV = successful.reduce((s, t) => s + t.transactionAmount, 0);
  const erpRevenue = successful.reduce((s, t) => s + t.erpRevenue, 0);
  const edvironNet = successful.reduce((s, t) => s + t.edvironNetRevenue, 0);
  const edvironGross = successful.reduce((s, t) => s + t.edvironGrossRevenue, 0);
  const pendingExposure = txns.filter(t => t.captureStatus === 'PENDING').reduce((s, t) => s + t.transactionAmount, 0);
  const uniqueStudents = new Set(txns.map(t => t.studentName)).size;

  const studentFreq: Record<string, number> = {};
  successful.forEach(t => { studentFreq[t.studentName] = (studentFreq[t.studentName] || 0) + 1; });
  const avgFrequency = Object.keys(studentFreq).length > 0
    ? +(Object.values(studentFreq).reduce((a, b) => a + b, 0) / Object.keys(studentFreq).length).toFixed(1)
    : 0;

  return { totalTxns, totalGMV, erpRevenue, edvironNet, edvironGross, pendingExposure, uniqueStudents, avgFrequency };
}

export function getMonthlyTrend(txns: Transaction[]) {
  const map: Record<string, { month: string; erpRevenue: number; edvironNet: number; gmv: number }> = {};
  txns.filter(t => t.status === 'SUCCESS').forEach(t => {
    const m = t.date.substring(0, 7);
    if (!map[m]) map[m] = { month: m, erpRevenue: 0, edvironNet: 0, gmv: 0 };
    map[m].erpRevenue += t.erpRevenue;
    map[m].edvironNet += t.edvironNetRevenue;
    map[m].gmv += t.transactionAmount;
  });
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
}

export function getGatewayBreakdown(txns: Transaction[]) {
  const map: Record<string, { gateway: string; volume: number; revenue: number; success: number; failed: number }> = {};
  txns.forEach(t => {
    if (!map[t.bankGateway]) map[t.bankGateway] = { gateway: t.bankGateway, volume: 0, revenue: 0, success: 0, failed: 0 };
    map[t.bankGateway].volume += t.transactionAmount;
    map[t.bankGateway].revenue += t.edvironGrossRevenue;
    if (t.status === 'SUCCESS') map[t.bankGateway].success++;
    if (t.status === 'FAILED') map[t.bankGateway].failed++;
  });
  return Object.values(map);
}

export function getPaymentMethodMix(txns: Transaction[]) {
  const map: Record<string, number> = {};
  txns.filter(t => t.status === 'SUCCESS').forEach(t => {
    map[t.paymentMethod] = (map[t.paymentMethod] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function getPartnerPerformance(txns: Transaction[]) {
  const map: Record<string, { partner: string; txnCount: number; erpRevenue: number; edvironRevenue: number; gmv: number }> = {};
  txns.filter(t => t.status === 'SUCCESS').forEach(t => {
    if (!map[t.partnerName]) map[t.partnerName] = { partner: t.partnerName, txnCount: 0, erpRevenue: 0, edvironRevenue: 0, gmv: 0 };
    map[t.partnerName].txnCount++;
    map[t.partnerName].erpRevenue += t.erpRevenue;
    map[t.partnerName].edvironRevenue += t.edvironNetRevenue;
    map[t.partnerName].gmv += t.transactionAmount;
  });
  return Object.values(map);
}

export function getRevenueSplit(txns: Transaction[]) {
  const successful = txns.filter(t => t.status === 'SUCCESS');
  const erp = successful.reduce((s, t) => s + t.erpRevenue, 0);
  const edviron = successful.reduce((s, t) => s + t.edvironNetRevenue, 0);
  return [
    { name: 'Edviron Net', value: edviron },
    { name: 'ERP Revenue', value: erp },
  ];
}

export function getStatusDistribution(txns: Transaction[]) {
  const s = txns.filter(t => t.status === 'SUCCESS').length;
  const f = txns.filter(t => t.status === 'FAILED').length;
  const p = txns.filter(t => t.status === 'PENDING').length;
  return [
    { name: 'Success', value: s },
    { name: 'Failed', value: f },
    { name: 'Pending', value: p },
  ];
}
