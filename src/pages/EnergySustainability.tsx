import { useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import {
  Zap, Leaf, Droplets, TrendingDown,
  Gauge, Sun, Wind
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function EnergySustainability() {
  const data = useDashboardData()

  const latest = useMemo(() => data?.energyDaily[data.energyDaily.length - 1], [data])
  const prev = useMemo(() => data?.energyDaily[data.energyDaily.length - 2], [data])

  const energySourceData = useMemo(() => {
    if (!latest) return []
    return [
      { name: 'Grid', value: latest.grid_energy_pct, color: '#3b82f6' },
      { name: 'Solar', value: latest.solar_energy_pct, color: '#f59e0b' },
      { name: 'Wind', value: latest.wind_energy_pct, color: '#10b981' },
      { name: 'Other', value: latest.other_renewable_pct, color: '#8b5cf6' },
    ]
  }, [latest])

  const pueTrend = useMemo(() => {
    if (!data) return []
    return data.energyDaily.map(d => ({
      date: d.date,
      PUE: d.pue,
      target: 1.2
    }))
  }, [data])

  if (!data || !latest || !prev) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading energy data...</div>
      </div>
    )
  }

  const renewableChange = latest.renewable_energy_pct - prev.renewable_energy_pct
  const pueChange = ((latest.pue - prev.pue) / prev.pue * 100).toFixed(1)
  const energyChange = ((latest.total_energy_mwh - prev.total_energy_mwh) / prev.total_energy_mwh * 100).toFixed(1)
  const carbonChange = ((latest.carbon_emissions_tco2e - prev.carbon_emissions_tco2e) / prev.carbon_emissions_tco2e * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="PUE (Global Avg)"
          value={latest.pue.toFixed(2)}
          change={parseFloat(pueChange)}
          changeLabel="vs yesterday"
          icon={<Gauge className="w-5 h-5" />}
          color="blue"
          subtitle="Target: 1.20"
        />
        <KPICard
          title="Renewable Energy"
          value={`${latest.renewable_energy_pct}%`}
          change={parseFloat((renewableChange / prev.renewable_energy_pct * 100).toFixed(1))}
          changeLabel="vs yesterday"
          icon={<Leaf className="w-5 h-5" />}
          color="green"
          subtitle="Goal: 50% by 2025"
        />
        <KPICard
          title="Total Energy"
          value={`${latest.total_energy_mwh.toLocaleString()} MWh`}
          change={parseFloat(energyChange)}
          changeLabel="vs yesterday"
          icon={<Zap className="w-5 h-5" />}
          color="amber"
        />
        <KPICard
          title="Carbon Emissions"
          value={`${latest.carbon_emissions_tco2e.toLocaleString()} tCO₂e`}
          change={parseFloat(carbonChange)}
          changeLabel="vs yesterday"
          icon={<TrendingDown className="w-5 h-5" />}
          color="cyan"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Energy by Source */}
        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Energy by Source</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={energySourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                {energySourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {energySourceData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="text-white font-medium">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Consumption Trend */}
        <div className="lg:col-span-2 glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Energy Consumption Trend (MW)</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.energyDaily}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="total_energy_mwh" stroke="#f59e0b" strokeWidth={2} fill="url(#energyGrad)" name="Energy (MWh)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PUE Trend */}
        <div className="glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">PUE Trend</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">Target: 1.20</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={pueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis domain={[1.1, 1.5]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="PUE" stroke="#3b82f6" strokeWidth={2} dot={false} name="PUE" />
              <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Carbon Emissions Trend */}
        <div className="glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Carbon Emissions Trend</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">-12% vs last year</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.energyDaily}>
              <defs>
                <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="carbon_emissions_tco2e" stroke="#ef4444" strokeWidth={2} fill="url(#carbonGrad)" name="Carbon (tCO₂e)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Energy by Region */}
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Energy Consumption by Region</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.energyByRegion}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="region" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
            <Bar dataKey="energy_consumption_mwh" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Energy (MWh)" />
            <Bar dataKey="cooling_cost" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Cooling Cost ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sustainability Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10">
            <Sun className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Solar Generation</p>
            <p className="text-lg font-bold text-amber-400">{latest.solar_energy_pct}%</p>
            <p className="text-xs text-muted-foreground">of total energy mix</p>
          </div>
        </div>
        <div className="glass-card rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10">
            <Wind className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Wind Generation</p>
            <p className="text-lg font-bold text-emerald-400">{latest.wind_energy_pct}%</p>
            <p className="text-xs text-muted-foreground">of total energy mix</p>
          </div>
        </div>
        <div className="glass-card rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10">
            <Droplets className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cooling Efficiency</p>
            <p className="text-lg font-bold text-blue-400">{latest.cooling_efficiency}%</p>
            <p className="text-xs text-muted-foreground">Above industry avg (78%)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
