import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import {
  DollarSign, TrendingUp, TrendingDown, Wallet, Wrench,
  Target
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import { useDashboardData } from '@/hooks/useDashboardData'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function FinancialDashboard() {
  const data = useDashboardData()

  const latest = useMemo(() => data?.financialDaily[data.financialDaily.length - 1], [data])
  const prev = useMemo(() => data?.financialDaily[data.financialDaily.length - 2], [data])

  const costBreakdownData = useMemo(() => {
    if (!data?.costBreakdown) return []
    return Object.entries(data.costBreakdown).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      color: COLORS[Object.keys(data.costBreakdown).indexOf(key) % COLORS.length]
    }))
  }, [data])

  const revenueCostTrend = useMemo(() => {
    if (!data) return []
    return data.financialDaily.map(d => ({
      date: d.date,
      Revenue: d.revenue_m,
      'Operating Cost': d.operating_cost_m,
      'Maintenance': d.maintenance_expenses_m,
    }))
  }, [data])

  const roiTrend = useMemo(() => {
    if (!data) return []
    return data.financialDaily.map(d => ({
      date: d.date,
      ROI: d.roi_ttm,
      'Profit Margin': d.profit_margin,
    }))
  }, [data])

  const costBreakdownDaily = useMemo(() => {
    if (!data) return []
    return data.financialDaily.map(d => ({
      date: d.date,
      Infrastructure: d.infrastructure_cost_m,
      'Power & Cooling': d.power_cooling_cost_m,
      Personnel: d.personnel_cost_m,
    }))
  }, [data])

  if (!data || !latest || !prev) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading financial data...</div>
      </div>
    )
  }

  const revenueChange = ((latest.revenue_m - prev.revenue_m) / prev.revenue_m * 100).toFixed(1)
  const costChange = ((latest.operating_cost_m - prev.operating_cost_m) / prev.operating_cost_m * 100).toFixed(1)
  const gpuCostChange = ((latest.cost_per_gpu_hour - prev.cost_per_gpu_hour) / prev.cost_per_gpu_hour * 100).toFixed(1)
  const maintChange = ((latest.maintenance_expenses_m - prev.maintenance_expenses_m) / prev.maintenance_expenses_m * 100).toFixed(1)
  const roiChange = ((latest.roi_ttm - prev.roi_ttm) / prev.roi_ttm * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Operating Cost"
          value={`$${latest.operating_cost_m}M`}
          change={parseFloat(costChange)}
          changeLabel="vs yesterday"
          icon={<Wallet className="w-5 h-5" />}
          color="red"
        />
        <KPICard
          title="Revenue Generated"
          value={`$${latest.revenue_m}M`}
          change={parseFloat(revenueChange)}
          changeLabel="vs yesterday"
          icon={<DollarSign className="w-5 h-5" />}
          color="green"
        />
        <KPICard
          title="Cost per GPU Hour"
          value={`$${latest.cost_per_gpu_hour}`}
          change={parseFloat(gpuCostChange)}
          changeLabel="vs yesterday"
          icon={<Target className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Maintenance"
          value={`$${latest.maintenance_expenses_m}M`}
          change={parseFloat(maintChange)}
          changeLabel="vs yesterday"
          icon={<Wrench className="w-5 h-5" />}
          color="amber"
        />
        <KPICard
          title="ROI (TTM)"
          value={`${latest.roi_ttm}%`}
          change={parseFloat(roiChange)}
          changeLabel="vs yesterday"
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cost Breakdown */}
        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={costBreakdownData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                {costBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {costBreakdownData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
                <span className="text-white font-medium">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue vs Cost Trend */}
        <div className="lg:col-span-2 glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Revenue vs Cost Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueCostTrend}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `$${v}M`} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
              <Area type="monotone" dataKey="Operating Cost" stroke="#ef4444" strokeWidth={2} fill="url(#costGrad)" name="Operating Cost" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ROI Trend */}
        <div className="glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">ROI Trend (TTM)</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">+4.6% this month</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={roiTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="ROI" stroke="#8b5cf6" strokeWidth={2} dot={false} name="ROI %" />
              <Line type="monotone" dataKey="Profit Margin" stroke="#3b82f6" strokeWidth={2} dot={false} name="Profit Margin %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Breakdown Trend */}
        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Cost Component Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={costBreakdownDaily}>
              <defs>
                <linearGradient id="infraGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `$${v}M`} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="Infrastructure" stroke="#3b82f6" strokeWidth={2} fill="url(#infraGrad)" name="Infrastructure" />
              <Area type="monotone" dataKey="Power & Cooling" stroke="#f59e0b" strokeWidth={2} fill="url(#powerGrad)" name="Power & Cooling" />
              <Line type="monotone" dataKey="Personnel" stroke="#10b981" strokeWidth={2} dot={false} name="Personnel" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Monthly Financial Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { label: 'Revenue', value: `$${latest.revenue_m}M`, change: `+${revenueChange}%`, positive: true },
            { label: 'OpEx', value: `$${latest.operating_cost_m}M`, change: `${costChange}%`, positive: parseFloat(costChange) < 0 },
            { label: 'GPU/Hour', value: `$${latest.cost_per_gpu_hour}`, change: `${gpuCostChange}%`, positive: parseFloat(gpuCostChange) < 0 },
            { label: 'Maintenance', value: `$${latest.maintenance_expenses_m}M`, change: `${maintChange}%`, positive: parseFloat(maintChange) < 0 },
            { label: 'ROI', value: `${latest.roi_ttm}%`, change: `+${roiChange}%`, positive: true },
            { label: 'Margin', value: `${latest.profit_margin}%`, change: '+2.1%', positive: true },
            { label: 'Net Profit', value: `$${(latest.revenue_m - latest.operating_cost_m).toFixed(2)}M`, change: '+5.3%', positive: true },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 rounded-lg bg-white/[0.02]">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-bold text-white mt-1">{item.value}</p>
              <p className={`text-xs mt-1 ${item.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.positive ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
                {item.change}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
