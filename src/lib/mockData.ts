import { Transaction } from './types';

const partners = [
  { id: 'ERP001', name: 'SchoolPad' },
  { id: 'ERP002', name: 'EduTrack' },
  { id: 'ERP003', name: 'CampusFlow' },
  { id: 'ERP004', name: 'LearnLink' },
];

const schools = [
  'Delhi Public School', 'St. Xavier\'s', 'Kendriya Vidyalaya',
  'Ryan International', 'Mount Carmel', 'Cambridge School',
  'Amity International', 'DAV Public School', 'Bal Bharati',
  'Modern School',
];

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Ananya', 'Diya', 'Ishaan', 'Kavya', 'Rohan', 'Priya', 'Arjun', 'Neha', 'Siddharth', 'Meera', 'Rahul', 'Sneha'];
const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Jain', 'Verma', 'Mehta', 'Reddy', 'Nair'];

const paymentMethods: Transaction['paymentMethod'][] = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'];
const gateways: Transaction['bankGateway'][] = ['Razorpay', 'PayU', 'Cashfree', 'CCAvenue'];
const statuses: Transaction['status'][] = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'SUCCESS', 'SUCCESS', 'SUCCESS', 'SUCCESS', 'FAILED', 'PENDING'];

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]): T { return arr[rand(0, arr.length - 1)]; }

function generateTransaction(index: number): Transaction {
  const date = new Date(2025, rand(0, 5), rand(1, 28));
  const amount = rand(500, 150000);
  const partner = pick(partners);
  const status = pick(statuses);

  const pType = Math.random() > 0.4 ? 'percentage' : 'flat' as const;
  const mType = Math.random() > 0.4 ? 'percentage' : 'flat' as const;
  const eType = Math.random() > 0.5 ? 'percentage' : 'flat' as const;

  const pVal = pType === 'percentage' ? +(Math.random() * 1.5 + 0.5).toFixed(2) : rand(10, 50);
  const mVal = mType === 'percentage' ? +(Math.random() * 2 + 1).toFixed(2) : rand(20, 80);
  const eVal = eType === 'percentage' ? +(Math.random() * 0.8 + 0.2).toFixed(2) : rand(5, 30);

  const partnerAbs = pType === 'percentage' ? +(amount * pVal / 100).toFixed(2) : pVal;
  const merchantAbs = mType === 'percentage' ? +(amount * mVal / 100).toFixed(2) : mVal;
  const edvironAbs = eType === 'percentage' ? +(amount * eVal / 100).toFixed(2) : eVal;

  const erpRev = +(merchantAbs - partnerAbs).toFixed(2);
  const edvNet = +(partnerAbs - edvironAbs).toFixed(2);
  const edvGross = +(erpRev + edvNet).toFixed(2);

  return {
    orderId: `ORD${String(index + 1).padStart(6, '0')}`,
    date: date.toISOString().split('T')[0],
    transactionAmount: amount,
    paymentMethod: pick(paymentMethods),
    bankGateway: pick(gateways),
    studentName: `${pick(firstNames)} ${pick(lastNames)}`,
    schoolName: pick(schools),
    partnerId: partner.id,
    partnerName: partner.name,
    vendorAmount: +(amount - merchantAbs).toFixed(2),
    partnerPricingType: pType,
    partnerPricingValue: pVal,
    merchantPricingType: mType,
    merchantPricingValue: mVal,
    edvironBuyingType: eType,
    edvironBuyingValue: eVal,
    status,
    captureStatus: status === 'SUCCESS' ? (Math.random() > 0.15 ? 'CAPTURED' : 'PENDING') : status === 'FAILED' ? 'FAILED' : 'PENDING',
    erpCommission: erpRev > 0 ? erpRev : 0,
    partnerPricingAbs: partnerAbs,
    merchantPricingAbs: merchantAbs,
    edvironBuyingAbs: edvironAbs,
    erpRevenue: Math.max(erpRev, 0),
    edvironNetRevenue: Math.max(edvNet, 0),
    edvironGrossRevenue: Math.max(edvGross, 0),
    amountPayableToErp: Math.max(erpRev, 0),
    amountRetainedByEdviron: Math.max(edvNet, 0),
  };
}

export const transactions: Transaction[] = Array.from({ length: 500 }, (_, i) => generateTransaction(i));

export const uniquePartners = partners;
export const uniqueGateways = gateways;
export const uniquePaymentMethods = paymentMethods;
