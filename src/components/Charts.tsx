import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { formatINR } from '@/lib/analytics';

const COLORS = {
  edviron: 'hsl(174, 62%, 47%)',
  erp: 'hsl(38, 92%, 55%)',
  success: 'hsl(152, 60%, 48%)',
  failed: 'hsl(0, 72%, 55%)',
  pending: 'hsl(38, 70%, 55%)',
  methods: ['hsl(174, 62%, 47%)', 'hsl(38, 92%, 55%)', 'hsl(270, 60%, 60%)', 'hsl(200, 70%, 55%)', 'hsl(340, 65%, 55%)'],
};

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="glass-card p-4 lg:p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

const customTooltipStyle = {
  backgroundColor: 'hsl(220, 18%, 12%)',
  border: '1px solid hsl(220, 14%, 22%)',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'hsl(210, 20%, 92%)',
};

export function RevenueTrendChart({ data }: { data: { month: string; erpRevenue: number; edvironNet: number }[] }) {
  return (
    <ChartCard title="Revenue Trend (Monthly)">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradEdviron" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.edviron} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.edviron} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradErp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.erp} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.erp} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="hsl(215, 12%, 40%)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(215, 12%, 40%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => formatINR(v)} />
          <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => formatINR(v)} />
          <Area type="monotone" dataKey="edvironNet" name="Edviron Net" stroke={COLORS.edviron} fill="url(#gradEdviron)" strokeWidth={2} />
          <Area type="monotone" dataKey="erpRevenue" name="ERP Revenue" stroke={COLORS.erp} fill="url(#gradErp)" strokeWidth={2} />
          <Legend wrapperStyle={{ fontSize: '12px', color: 'hsl(215, 12%, 50%)' }} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RevenueSplitChart({ data }: { data: { name: string; value: number }[] }) {
  const cols = [COLORS.edviron, COLORS.erp];
  return (
    <ChartCard title="Revenue Split">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" stroke="none" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
            {data.map((_, i) => <Cell key={i} fill={cols[i]} />)}
          </Pie>
          <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => formatINR(v)} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function GatewayChart({ data }: { data: { gateway: string; volume: number; success: number; failed: number }[] }) {
  return (
    <ChartCard title="Gateway-wise Volume">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <XAxis dataKey="gateway" stroke="hsl(215, 12%, 40%)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(215, 12%, 40%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => formatINR(v)} />
          <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => formatINR(v)} />
          <Bar dataKey="volume" name="Volume" fill={COLORS.edviron} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function PaymentMethodChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ChartCard title="Payment Method Mix">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value" stroke="none" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
            {data.map((_, i) => <Cell key={i} fill={COLORS.methods[i % COLORS.methods.length]} />)}
          </Pie>
          <Tooltip contentStyle={customTooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function StatusChart({ data }: { data: { name: string; value: number }[] }) {
  const cols = [COLORS.success, COLORS.failed, COLORS.pending];
  return (
    <ChartCard title="Transaction Status">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" stroke="none" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
            {data.map((_, i) => <Cell key={i} fill={cols[i]} />)}
          </Pie>
          <Tooltip contentStyle={customTooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function PartnerTable({ data }: { data: { partner: string; txnCount: number; erpRevenue: number; edvironRevenue: number; gmv: number }[] }) {
  return (
    <ChartCard title="Partner (ERP) Performance">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 font-medium">Partner</th>
              <th className="text-right py-2 font-medium">Txns</th>
              <th className="text-right py-2 font-medium">GMV</th>
              <th className="text-right py-2 font-medium">ERP Rev</th>
              <th className="text-right py-2 font-medium">Edviron Rev</th>
              <th className="text-right py-2 font-medium">Take Rate</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d.partner} className="border-b border-border/40 hover:bg-secondary/50 transition-colors">
                <td className="py-2.5 font-medium text-foreground">{d.partner}</td>
                <td className="text-right py-2.5 font-mono-num">{d.txnCount}</td>
                <td className="text-right py-2.5 font-mono-num">{formatINR(d.gmv)}</td>
                <td className="text-right py-2.5 font-mono-num text-accent">{formatINR(d.erpRevenue)}</td>
                <td className="text-right py-2.5 font-mono-num text-primary">{formatINR(d.edvironRevenue)}</td>
                <td className="text-right py-2.5 font-mono-num">{d.gmv > 0 ? ((d.edvironRevenue / d.gmv) * 100).toFixed(2) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}
