export interface Transaction {
  orderId: string;
  date: string;
  transactionAmount: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Wallet';
  bankGateway: 'Razorpay' | 'PayU' | 'Cashfree' | 'CCAvenue';
  studentName: string;
  schoolName: string;
  partnerId: string;
  partnerName: string;
  vendorAmount: number;
  partnerPricingType: 'flat' | 'percentage';
  partnerPricingValue: number;
  merchantPricingType: 'flat' | 'percentage';
  merchantPricingValue: number;
  edvironBuyingType: 'flat' | 'percentage';
  edvironBuyingValue: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  captureStatus: 'CAPTURED' | 'PENDING' | 'FAILED';
  erpCommission: number;
  // Computed
  partnerPricingAbs: number;
  merchantPricingAbs: number;
  edvironBuyingAbs: number;
  erpRevenue: number;
  edvironNetRevenue: number;
  edvironGrossRevenue: number;
  amountPayableToErp: number;
  amountRetainedByEdviron: number;
}

export interface DashboardFilters {
  dateRange: [Date, Date];
  partner: string | null;
  gateway: string | null;
  paymentMethod: string | null;
}
