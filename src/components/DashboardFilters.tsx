import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarDays, X } from 'lucide-react';

interface DashboardFiltersProps {
  partners: { id: string; name: string }[];
  gateways: string[];
  paymentMethods: string[];
  selectedPartner: string | null;
  selectedGateway: string | null;
  selectedMethod: string | null;
  onPartnerChange: (v: string | null) => void;
  onGatewayChange: (v: string | null) => void;
  onMethodChange: (v: string | null) => void;
  dateRange: string;
  onDateRangeChange: (v: string) => void;
}

export function DashboardFilters({
  partners, gateways, paymentMethods,
  selectedPartner, selectedGateway, selectedMethod,
  onPartnerChange, onGatewayChange, onMethodChange,
  dateRange, onDateRangeChange,
}: DashboardFiltersProps) {
  const hasFilters = selectedPartner || selectedGateway || selectedMethod || dateRange !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <CalendarDays className="w-4 h-4" />
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[140px] h-8 text-xs bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="2025-01">Jan 2025</SelectItem>
            <SelectItem value="2025-02">Feb 2025</SelectItem>
            <SelectItem value="2025-03">Mar 2025</SelectItem>
            <SelectItem value="2025-04">Apr 2025</SelectItem>
            <SelectItem value="2025-05">May 2025</SelectItem>
            <SelectItem value="2025-06">Jun 2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select value={selectedPartner || 'all'} onValueChange={v => onPartnerChange(v === 'all' ? null : v)}>
        <SelectTrigger className="w-[140px] h-8 text-xs bg-secondary border-border">
          <SelectValue placeholder="All Partners" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Partners</SelectItem>
          {partners.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={selectedGateway || 'all'} onValueChange={v => onGatewayChange(v === 'all' ? null : v)}>
        <SelectTrigger className="w-[130px] h-8 text-xs bg-secondary border-border">
          <SelectValue placeholder="All Gateways" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Gateways</SelectItem>
          {gateways.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={selectedMethod || 'all'} onValueChange={v => onMethodChange(v === 'all' ? null : v)}>
        <SelectTrigger className="w-[140px] h-8 text-xs bg-secondary border-border">
          <SelectValue placeholder="All Methods" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Methods</SelectItem>
          {paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground"
          onClick={() => { onPartnerChange(null); onGatewayChange(null); onMethodChange(null); onDateRangeChange('all'); }}
        >
          <X className="w-3 h-3 mr-1" /> Clear
        </Button>
      )}
    </div>
  );
}
