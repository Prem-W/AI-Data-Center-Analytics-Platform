import { useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import {
  Building2, Server, Cpu, Zap, DollarSign, Leaf,
  TrendingUp, AlertTriangle, CheckCircle2
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function ExecutiveOverview() {
  const data = useDashboardData()

  const latest = useMemo(() => data?.executiveDaily[data.executiveDaily.length - 1], [data])
  const prev = useMemo(() => data?.executiveDaily[data.executiveDaily.length - 2], [data])

  const regionStats = useMemo(() => {
    if (!data) return []
    const stats: Record<string, { servers: number; gpus: number; power: number; count: number }> = {}
    data.execRegion.forEach(r => {
      if (!stats[r.region]) stats[r.region] = { servers: 0, gpus: 0, power: 0, count: 0 }
      stats[r.region].servers += r.server_count
      stats[r.region].gpus += r.gpu_count
      stats[r.region].power += r.power_capacity_mw
      stats[r.region].count += 1
    })
    return Object.entries(stats).map(([region, s]) => ({
      region,
      servers: s.servers,
      gpus: s.gpus,
      power: Math.round(s.power * 10) / 10,
      centers: s.count
    }))
  }, [data])

  const serverStatus = useMemo(() => {
    if (!data) return []
    const latestHour = data.infrastructureHourly[data.infrastructureHourly.length - 1]
    return [
      { name: 'Active', value: latestHour?.active_servers || 13247, color: '#10b981' },
      { name: 'Idle', value: latestHour?.idle_servers || 2021, color: '#f59e0b' },
      { name: 'Failed', value: latestHour?.failed_servers || 362, color: '#ef4444' },
    ]
  }, [data])

  if (!data || !latest || !prev) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading dashboard data...</div>
      </div>
    )
  }

  const gpuChange = ((latest.gpu_utilization - prev.gpu_utilization) / prev.gpu_utilization * 100).toFixed(1)
  const powerChange = ((latest.power_consumption_mw - prev.power_consumption_mw) / prev.power_consumption_mw * 100).toFixed(1)
  const carbonChange = ((latest.carbon_emissions_tco2e - prev.carbon_emissions_tco2e) / prev.carbon_emissions_tco2e * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Data Centers"
          value={latest.total_data_centers.toString()}
          change={9.1}
          changeLabel="vs last month"
          icon={<Building2 className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Total Servers"
          value={latest.total_servers.toLocaleString()}
          change={8.7}
          changeLabel="vs last month"
          icon={<Server className="w-5 h-5" />}
          color="purple"
        />
        <KPICard
          title="GPU Utilization"
          value={`${latest.gpu_utilization}%`}
          change={parseFloat(gpuChange)}
          changeLabel="vs yesterday"
          icon={<Cpu className="w-5 h-5" />}
          color="green"
        />
        <KPICard
          title="Power Consumption"
          value={`${latest.power_consumption_mw} MW`}
          change={parseFloat(powerChange)}
          changeLabel="vs yesterday"
          icon={<Zap className="w-5 h-5" />}
          color="amber"
        />
        <KPICard
          title="Operational Cost"
          value={`$${latest.operational_cost_m}M`}
          change={3.6}
          changeLabel="vs last month"
          icon={<DollarSign className="w-5 h-5" />}
          color="red"
        />
        <KPICard
          title="Carbon Emissions"
          value={`${latest.carbon_emissions_tco2e.toLocaleString()} tCO₂e`}
          change={parseFloat(carbonChange)}
          changeLabel="vs yesterday"
          icon={<Leaf className="w-5 h-5" />}
          color="cyan"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Utilization Trend */}
        <div className="lg:col-span-2 glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Utilization Trend (Overall)</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />GPU Utilization</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />CPU Utilization</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.executiveDaily}>
              <defs>
                <linearGradient id="gpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="gpu_utilization" stroke="#3b82f6" strokeWidth={2} fill="url(#gpuGrad)" name="GPU Utilization" />
              <Area type="monotone" dataKey="avg_utilization" stroke="#10b981" strokeWidth={2} fill="url(#cpuGrad)" name="CPU Utilization" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Server Status */}
        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Server Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={serverStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                {serverStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {serverStatus.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="text-white font-medium">{s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Data Centers by Region */}
        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Infrastructure by Region</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={regionStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis dataKey="region" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={120} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="servers" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Servers" />
              <Bar dataKey="gpus" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="GPUs" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PUE & Carbon Trend */}
        <div className="glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">PUE & Carbon Trend</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />PUE</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Carbon (tCO₂e)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.executiveDaily}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis yAxisId="left" domain={[1.0, 1.5]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Line yAxisId="left" type="monotone" dataKey="pue_global" stroke="#f59e0b" strokeWidth={2} dot={false} name="PUE" />
              <Line yAxisId="right" type="monotone" dataKey="carbon_emissions_tco2e" stroke="#10b981" strokeWidth={2} dot={false} name="Carbon (tCO₂e)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">System Health</p>
            <p className="text-lg font-bold text-emerald-400">98.7%</p>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </div>
        </div>
        <div className="glass-card rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">GPU Efficiency</p>
            <p className="text-lg font-bold text-blue-400">91.2%</p>
            <p className="text-xs text-muted-foreground">Above target (85%)</p>
          </div>
        </div>
        <div className="glass-card rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Active Alerts</p>
            <p className="text-lg font-bold text-amber-400">12</p>
            <p className="text-xs text-muted-foreground">3 high priority</p>
          </div>
        </div>
      </div>
    </div>
  )
}
