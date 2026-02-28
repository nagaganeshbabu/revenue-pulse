import { useState, useMemo } from 'react';
import { transactions, uniquePartners, uniqueGateways, uniquePaymentMethods } from '@/lib/mockData';
import { getKPIs, getMonthlyTrend, getGatewayBreakdown, getPaymentMethodMix, getPartnerPerformance, getRevenueSplit, getStatusDistribution } from '@/lib/analytics';
import { KPICard } from '@/components/KPICard';
import { DashboardFilters } from '@/components/DashboardFilters';
import { RevenueTrendChart, RevenueSplitChart, GatewayChart, PaymentMethodChart, StatusChart, PartnerTable } from '@/components/Charts';
import { Activity, Users, AlertTriangle, DollarSign, BarChart3, Repeat } from 'lucide-react';

const Index = () => {
  const [partner, setPartner] = useState<string | null>(null);
  const [gateway, setGateway] = useState<string | null>(null);
  const [method, setMethod] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('all');

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (partner && t.partnerName !== partner) return false;
      if (gateway && t.bankGateway !== gateway) return false;
      if (method && t.paymentMethod !== method) return false;
      if (dateRange !== 'all' && !t.date.startsWith(dateRange)) return false;
      return true;
    });
  }, [partner, gateway, method, dateRange]);

  const kpis = useMemo(() => getKPIs(filtered), [filtered]);
  const trend = useMemo(() => getMonthlyTrend(filtered), [filtered]);
  const gateways = useMemo(() => getGatewayBreakdown(filtered), [filtered]);
  const methods = useMemo(() => getPaymentMethodMix(filtered), [filtered]);
  const partners = useMemo(() => getPartnerPerformance(filtered), [filtered]);
  const revSplit = useMemo(() => getRevenueSplit(filtered), [filtered]);
  const statusDist = useMemo(() => getStatusDistribution(filtered), [filtered]);

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground font-display">
              Revenue & Settlement Analytics
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Edviron Payment Processing Dashboard · {filtered.length} transactions</p>
          </div>
          <DashboardFilters
            partners={uniquePartners}
            gateways={[...uniqueGateways]}
            paymentMethods={[...uniquePaymentMethods]}
            selectedPartner={partner}
            selectedGateway={gateway}
            selectedMethod={method}
            onPartnerChange={setPartner}
            onGatewayChange={setGateway}
            onMethodChange={setMethod}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
        <KPICard label="Transactions" value={kpis.totalTxns} format="number" icon={<Activity className="w-4 h-4" />} />
        <KPICard label="Total GMV" value={kpis.totalGMV} variant="default" icon={<DollarSign className="w-4 h-4" />} />
        <KPICard label="ERP Revenue" value={kpis.erpRevenue} variant="accent" icon={<BarChart3 className="w-4 h-4" />} />
        <KPICard label="Edviron Net" value={kpis.edvironNet} variant="primary" icon={<BarChart3 className="w-4 h-4" />} />
        <KPICard label="Edviron Gross" value={kpis.edvironGross} variant="primary" icon={<DollarSign className="w-4 h-4" />} />
        <KPICard label="Pending Exposure" value={kpis.pendingExposure} variant="destructive" icon={<AlertTriangle className="w-4 h-4" />} />
        <KPICard label="Unique Users" value={kpis.uniqueStudents} format="number" icon={<Users className="w-4 h-4" />} />
        <KPICard label="Avg Frequency" value={kpis.avgFrequency} format="decimal" icon={<Repeat className="w-4 h-4" />} subLabel="payments/user" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <RevenueTrendChart data={trend} />
        </div>
        <RevenueSplitChart data={revSplit} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <GatewayChart data={gateways} />
        <PaymentMethodChart data={methods} />
        <StatusChart data={statusDist} />
      </div>

      {/* Partner Table */}
      <div className="mb-6">
        <PartnerTable data={partners} />
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground py-4 border-t border-border">
        Edviron Analytics Dashboard · Data auto-refreshes with filter changes · 500 sample transactions
      </div>
    </div>
  );
};

export default Index;
