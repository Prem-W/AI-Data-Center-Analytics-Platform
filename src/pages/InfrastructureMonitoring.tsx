import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import {
  Server, Cpu, HardDrive, CheckCircle2, XCircle, Clock, Gauge
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import { useDashboardData } from '@/hooks/useDashboardData'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899']

export default function InfrastructureMonitoring() {
  const data = useDashboardData()

  const latestHour = useMemo(() => data?.infrastructureHourly[data.infrastructureHourly.length - 1], [data])

  const hourlyTrend = useMemo(() => {
    if (!data) return []
    return data.infrastructureHourly.slice(-168) // Last 7 days
  }, [data])

  const gpuRadarData = useMemo(() => {
    if (!data) return []
    return data.gpuBreakdown.map(g => ({
      gpu: g.gpu_type.split(' ').slice(0, 2).join(' '),
      utilization: g.utilization,
      health: g.health_score,
      availability: g.availability,
      fullMark: 100
    }))
  }, [data])

  if (!data || !latestHour) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading infrastructure data...</div>
      </div>
    )
  }

  const serverStatus = [
    { name: 'Active', value: latestHour.active_servers, color: '#10b981', icon: CheckCircle2 },
    { name: 'Idle', value: latestHour.idle_servers, color: '#f59e0b', icon: Clock },
    { name: 'Failed', value: latestHour.failed_servers, color: '#ef4444', icon: XCircle },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="CPU Utilization"
          value={`${latestHour.cpu_utilization}%`}
          change={1.2}
          changeLabel="vs last hour"
          icon={<Cpu className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="GPU Utilization"
          value={`${latestHour.gpu_utilization}%`}
          change={2.3}
          changeLabel="vs last hour"
          icon={<Gauge className="w-5 h-5" />}
          color="green"
        />
        <KPICard
          title="Memory Usage"
          value={`${latestHour.memory_usage}%`}
          change={-0.8}
          changeLabel="vs last hour"
          icon={<HardDrive className="w-5 h-5" />}
          color="purple"
        />
        <KPICard
          title="Storage Capacity"
          value={`${latestHour.storage_capacity}%`}
          change={0.5}
          changeLabel="vs last hour"
          icon={<Server className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Server Status & Resource Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Server Status */}
        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Server Status</h3>
          <div className="flex items-center gap-6 mb-4">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={serverStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                  {serverStatus.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {serverStatus.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  <div>
                    <p className="text-xs text-muted-foreground">{s.name}</p>
                    <p className="text-sm font-semibold text-white">{s.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-white/5">
            <p className="text-xs text-muted-foreground">Failed Rate: <span className="text-red-400 font-medium">{(latestHour.failed_servers / (latestHour.active_servers + latestHour.idle_servers + latestHour.failed_servers) * 100).toFixed(1)}%</span></p>
          </div>
        </div>

        {/* Resource Utilization Trend */}
        <div className="lg:col-span-2 glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Resource Utilization Trend (7 Days)</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />CPU</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" />GPU</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Memory</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />Storage</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={hourlyTrend}>
              <defs>
                <linearGradient id="cpuGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gpuGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="datetime" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="cpu_utilization" stroke="#3b82f6" strokeWidth={1.5} fill="url(#cpuGrad2)" name="CPU" />
              <Area type="monotone" dataKey="gpu_utilization" stroke="#8b5cf6" strokeWidth={1.5} fill="url(#gpuGrad2)" name="GPU" />
              <Area type="monotone" dataKey="memory_usage" stroke="#10b981" strokeWidth={1.5} fill="none" name="Memory" />
              <Area type="monotone" dataKey="storage_capacity" stroke="#f59e0b" strokeWidth={1.5} fill="none" name="Storage" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GPU Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* GPU Breakdown Table */}
        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">GPU Cluster Analytics</h3>
          <div className="space-y-3">
            {data.gpuBreakdown.map((gpu, i) => (
              <div key={gpu.gpu_type} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${COLORS[i]}20` }}>
                  <Cpu className="w-4 h-4" style={{ color: COLORS[i] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white truncate">{gpu.gpu_type}</p>
                    <span className="text-xs text-muted-foreground">{gpu.total_count.toLocaleString()} units</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${gpu.utilization}%`, backgroundColor: COLORS[i] }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: COLORS[i] }}>{gpu.utilization}%</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Health: <span className="text-emerald-400">{gpu.health_score}%</span></span>
                    <span>Avail: <span className="text-blue-400">{gpu.availability}%</span></span>
                    <span>Failure: <span className="text-red-400">{gpu.failure_rate}%</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GPU Radar Chart */}
        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">GPU Performance Matrix</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={gpuRadarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="gpu" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="Utilization" dataKey="utilization" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Health" dataKey="health" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Utilization</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Health</span>
          </div>
        </div>
      </div>

      {/* Server Status by Location */}
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Server Status by Location</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Location</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Active</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Idle</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Failed</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Utilization</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.execRegion.slice(0, 10).map((dc) => (
                <tr key={dc.data_center} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 px-3 text-white font-medium">{dc.data_center}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400">{Math.floor(dc.server_count * 0.85).toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-amber-400">{Math.floor(dc.server_count * 0.12).toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-red-400">{Math.floor(dc.server_count * 0.03).toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${dc.utilization}%` }} />
                      </div>
                      <span className="text-white">{dc.utilization}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Healthy
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
