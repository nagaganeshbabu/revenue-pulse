import { ReactNode } from 'react';
import { formatINR } from '@/lib/analytics';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: number;
  format?: 'currency' | 'number' | 'decimal';
  variant?: 'primary' | 'accent' | 'default' | 'destructive';
  icon?: ReactNode;
  subLabel?: string;
}

export function KPICard({ label, value, format = 'currency', variant = 'default', icon, subLabel }: KPICardProps) {
  const formatted = format === 'currency' ? formatINR(value)
    : format === 'decimal' ? value.toFixed(1)
    : new Intl.NumberFormat('en-IN').format(value);

  const glowClass = variant === 'primary' ? 'kpi-glow-primary' : variant === 'accent' ? 'kpi-glow-accent' : '';
  const valueColor = variant === 'primary' ? 'text-primary'
    : variant === 'accent' ? 'text-accent'
    : variant === 'destructive' ? 'text-destructive'
    : 'text-foreground';

  return (
    <div className={`glass-card p-4 lg:p-5 ${glowClass} transition-all hover:scale-[1.02] duration-200`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className={`font-mono-num text-2xl lg:text-3xl font-semibold ${valueColor}`}>
        {formatted}
      </div>
      {subLabel && <p className="text-xs text-muted-foreground mt-1">{subLabel}</p>}
    </div>
  );
}
