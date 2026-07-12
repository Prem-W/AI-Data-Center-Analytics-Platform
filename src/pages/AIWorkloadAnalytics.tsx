import { useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Line
} from 'recharts'
import {
  Brain, Clock, Zap, CheckCircle2,
  Layers, Target
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function AIWorkloadAnalytics() {
  const data = useDashboardData()

  const latest = useMemo(() => data?.aiWorkloadsDaily[data.aiWorkloadsDaily.length - 1], [data])
  const prev = useMemo(() => data?.aiWorkloadsDaily[data.aiWorkloadsDaily.length - 2], [data])

  const trainingVsInference = useMemo(() => {
    if (!data || !latest) return []
    const total = latest.training_jobs + latest.inference_jobs
    return [
      { name: 'Training', value: latest.training_jobs, percentage: ((latest.training_jobs / total) * 100).toFixed(1), color: '#3b82f6' },
      { name: 'Inference', value: latest.inference_jobs, percentage: ((latest.inference_jobs / total) * 100).toFixed(1), color: '#10b981' },
    ]
  }, [data, latest])

  const modelChartData = useMemo(() => {
    if (!data) return []
    return data.modelData.map(m => ({
      name: m.model_name,
      'GPU Hours': Math.round(m.gpu_hours / 1000),
      'Training Hours': Math.round(m.training_hours / 1000),
      'Cost ($K)': Math.round(m.cost_usd / 1000),
    }))
  }, [data])

  const workloadTrend = useMemo(() => {
    if (!data) return []
    return data.aiWorkloadsDaily
  }, [data])

  if (!data || !latest || !prev) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading workload data...</div>
      </div>
    )
  }

  const jobsChange = ((latest.ai_jobs_running - prev.ai_jobs_running) / prev.ai_jobs_running * 100).toFixed(1)
  const trainingChange = ((latest.training_jobs - prev.training_jobs) / prev.training_jobs * 100).toFixed(1)
  const inferenceChange = ((latest.inference_jobs - prev.inference_jobs) / prev.inference_jobs * 100).toFixed(1)
  const timeChange = ((latest.avg_training_hours - prev.avg_training_hours) / prev.avg_training_hours * 100).toFixed(1)
  const successChange = ((latest.success_rate - prev.success_rate) / prev.success_rate * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="AI Jobs Running"
          value={latest.ai_jobs_running.toLocaleString()}
          change={parseFloat(jobsChange)}
          changeLabel="vs yesterday"
          icon={<Brain className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Training Jobs"
          value={latest.training_jobs.toLocaleString()}
          change={parseFloat(trainingChange)}
          changeLabel="vs yesterday"
          icon={<Layers className="w-5 h-5" />}
          color="purple"
        />
        <KPICard
          title="Inference Jobs"
          value={latest.inference_jobs.toLocaleString()}
          change={parseFloat(inferenceChange)}
          changeLabel="vs yesterday"
          icon={<Zap className="w-5 h-5" />}
          color="green"
        />
        <KPICard
          title="Avg Training Time"
          value={`${latest.avg_training_hours} hrs`}
          change={parseFloat(timeChange)}
          changeLabel="vs yesterday"
          icon={<Clock className="w-5 h-5" />}
          color="amber"
        />
        <KPICard
          title="Success Rate"
          value={`${latest.success_rate}%`}
          change={parseFloat(successChange)}
          changeLabel="vs yesterday"
          icon={<Target className="w-5 h-5" />}
          color="cyan"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Training vs Inference */}
        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Training vs Inference Workloads</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={trainingVsInference} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                {trainingVsInference.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {trainingVsInference.map((s) => (
              <div key={s.name} className="text-center">
                <div className="flex items-center gap-1.5 justify-center">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-xs text-muted-foreground">{s.name}</span>
                </div>
                <p className="text-lg font-bold text-white">{s.percentage}%</p>
                <p className="text-xs text-muted-foreground">{s.value.toLocaleString()} jobs</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workload Trend */}
        <div className="lg:col-span-2 glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">AI Workloads Trend</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Jobs Running</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Training</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />Inference</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={workloadTrend}>
              <defs>
                <linearGradient id="jobsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="ai_jobs_running" stroke="#3b82f6" strokeWidth={2} fill="url(#jobsGrad)" name="Total Jobs" />
              <Line type="monotone" dataKey="training_jobs" stroke="#10b981" strokeWidth={2} dot={false} name="Training" />
              <Line type="monotone" dataKey="inference_jobs" stroke="#f59e0b" strokeWidth={2} dot={false} name="Inference" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Resource Consumption */}
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Resource Consumption by Model (GPU Hours - Thousands)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={modelChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} width={80} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
            <Bar dataKey="GPU Hours" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            <Bar dataKey="Training Hours" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Model Details Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Model Performance Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground uppercase">Model</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground uppercase">Params (B)</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground uppercase">GPU Util %</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground uppercase">Success %</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.modelData.map((model) => (
                  <tr key={model.model_name} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-2 text-white font-medium">{model.model_name}</td>
                    <td className="py-2.5 px-2 text-right text-muted-foreground">{model.params_billions}B</td>
                    <td className="py-2.5 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${model.avg_gpu_utilization}%` }} />
                        </div>
                        <span className="text-white">{model.avg_gpu_utilization}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right text-emerald-400">{model.success_rate}%</td>
                    <td className="py-2.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Projects */}
        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Resource-Consuming Projects</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground uppercase">Project</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground uppercase">GPU Hours</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground uppercase">Cost (USD)</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.projectData.map((project) => (
                  <tr key={project.project_name} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-2">
                      <div>
                        <p className="text-white font-medium">{project.project_name}</p>
                        <p className="text-xs text-muted-foreground">{project.model_type}</p>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right text-blue-400">{project.gpu_hours.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right text-emerald-400">${(project.cost_usd / 1000000).toFixed(2)}M</td>
                    <td className="py-2.5 px-2 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                        project.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                        project.status === 'Completed' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {project.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                        {project.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                        {project.status === 'In Progress' && <Clock className="w-3 h-3" />}
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
