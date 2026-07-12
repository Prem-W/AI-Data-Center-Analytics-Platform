import { useMemo, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import {
  Cpu, Zap, AlertTriangle, Gauge,
  Brain
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function PredictiveAnalytics() {
  const data = useDashboardData()
  const [forecastPeriod, setForecastPeriod] = useState<'3m' | '6m'>('6m')

  const latestPredictive = useMemo(() => {
    if (!data) return null
    return data.predictiveData[data.predictiveData.length - 1]
  }, [data])

  const firstForecast = useMemo(() => {
    if (!data) return null
    return data.predictiveData.find(d => d.is_forecast)
  }, [data])

  // Filter data based on forecast period
  const filteredData = useMemo(() => {
    if (!data) return []
    const days = forecastPeriod === '3m' ? 90 : 180
    return data.predictiveData.slice(-days)
  }, [data, forecastPeriod])

  // GPU Demand Forecast
  const gpuForecastData = useMemo(() => {
    if (!data) return []
    return filteredData.map(d => ({
      date: d.date,
      Forecast: d.is_forecast ? d.gpu_demand_forecast : null,
      Actual: !d.is_forecast ? d.gpu_demand_forecast : null,
    }))
  }, [data, filteredData])

  // Energy Demand Forecast
  const energyForecastData = useMemo(() => {
    if (!data) return []
    return filteredData.map(d => ({
      date: d.date,
      Forecast: d.is_forecast ? d.energy_demand_forecast_mw : null,
      Actual: !d.is_forecast ? d.energy_demand_forecast_mw : null,
    }))
  }, [data, filteredData])

  // Failure Prediction
  const failureData = useMemo(() => {
    if (!data) return []
    return filteredData.map(d => ({
      date: d.date,
      probability: d.failure_probability,
      threshold: 3.0,
    }))
  }, [data, filteredData])

  // Capacity Utilization Forecast
  const capacityData = useMemo(() => {
    if (!data) return []
    return filteredData.map(d => ({
      date: d.date,
      Forecast: d.is_forecast ? d.capacity_utilization_forecast : null,
      Actual: !d.is_forecast ? d.capacity_utilization_forecast : null,
      target: 85,
    }))
  }, [data, filteredData])

  // Cost Forecast
  const costData = useMemo(() => {
    if (!data) return []
    return filteredData.map(d => ({
      date: d.date,
      Forecast: d.is_forecast ? d.cost_forecast_m : null,
      Actual: !d.is_forecast ? d.cost_forecast_m : null,
    }))
  }, [data, filteredData])

  if (!data || !latestPredictive || !firstForecast) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading predictive data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Forecast Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">AI-Powered Forecasting</span>
          <span className="text-xs text-muted-foreground">Using Prophet + ARIMA models</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Forecast Period:</span>
          <div className="flex rounded-lg bg-white/5 border border-white/10 overflow-hidden">
            <button
              onClick={() => setForecastPeriod('3m')}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${forecastPeriod === '3m' ? 'bg-blue-500 text-white' : 'text-muted-foreground hover:text-white'}`}
            >
              3 Months
            </button>
            <button
              onClick={() => setForecastPeriod('6m')}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${forecastPeriod === '6m' ? 'bg-blue-500 text-white' : 'text-muted-foreground hover:text-white'}`}
            >
              6 Months
            </button>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Future GPU Demand"
          value={latestPredictive.gpu_demand_forecast.toLocaleString()}
          change={24.6}
          changeLabel="vs current"
          icon={<Cpu className="w-5 h-5" />}
          color="blue"
          subtitle="Predicted demand"
        />
        <KPICard
          title="Energy Forecast"
          value={`${latestPredictive.energy_demand_forecast_mw} MW`}
          change={12.8}
          changeLabel="vs current"
          icon={<Zap className="w-5 h-5" />}
          color="amber"
          subtitle="Predicted consumption"
        />
        <KPICard
          title="Failure Probability"
          value={`${latestPredictive.failure_probability}%`}
          change={-1.1}
          changeLabel="vs current"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="red"
          subtitle="Risk score"
        />
        <KPICard
          title="Capacity Forecast"
          value={`${latestPredictive.capacity_utilization_forecast}%`}
          change={7.3}
          changeLabel="vs current"
          icon={<Gauge className="w-5 h-5" />}
          color="green"
          subtitle="Utilization prediction"
        />
      </div>

      {/* GPU Demand Forecast */}
      <div className="glass-card rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">GPU Demand Forecast</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Actual</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Forecast</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={gpuForecastData}>
            <defs>
              <linearGradient id="gpuForecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
            <ReferenceLine x={firstForecast?.date} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Today', fill: '#f59e0b', fontSize: 11 }} />
            <Area type="monotone" dataKey="Actual" stroke="#3b82f6" strokeWidth={2} fill="none" connectNulls name="Actual" />
            <Area type="monotone" dataKey="Forecast" stroke="#10b981" strokeWidth={2} fill="url(#gpuForecastGrad)" connectNulls strokeDasharray="5 5" name="Forecast" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Energy & Failure Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Energy Demand Forecast */}
        <div className="glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Energy Consumption Forecast (MW)</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={energyForecastData}>
              <defs>
                <linearGradient id="energyForecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <ReferenceLine x={firstForecast?.date} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Today', fill: '#f59e0b', fontSize: 11 }} />
              <Area type="monotone" dataKey="Actual" stroke="#3b82f6" strokeWidth={2} fill="none" connectNulls name="Actual" />
              <Area type="monotone" dataKey="Forecast" stroke="#f59e0b" strokeWidth={2} fill="url(#energyForecastGrad)" connectNulls strokeDasharray="5 5" name="Forecast" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Failure Prediction */}
        <div className="glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Failure Prediction Trend</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400">Alert threshold: 3%</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={failureData}>
              <defs>
                <linearGradient id="failureGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis domain={[0, 5]} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <ReferenceLine y={3} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Threshold', fill: '#ef4444', fontSize: 10 }} />
              <Area type="monotone" dataKey="probability" stroke="#ef4444" strokeWidth={2} fill="url(#failureGrad)" name="Failure Probability %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Capacity & Cost Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Capacity Utilization Forecast */}
        <div className="glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Capacity Utilization Forecast</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">Target: 85%</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={capacityData}>
              <defs>
                <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis domain={[60, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <ReferenceLine x={firstForecast?.date} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Today', fill: '#f59e0b', fontSize: 11 }} />
              <ReferenceLine y={85} stroke="#10b981" strokeDasharray="5 5" label={{ value: 'Target', fill: '#10b981', fontSize: 10 }} />
              <Area type="monotone" dataKey="Actual" stroke="#3b82f6" strokeWidth={2} fill="none" connectNulls name="Actual" />
              <Area type="monotone" dataKey="Forecast" stroke="#8b5cf6" strokeWidth={2} fill="url(#capGrad)" connectNulls strokeDasharray="5 5" name="Forecast" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Forecast */}
        <div className="glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Future Cost Forecast</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={costData}>
              <defs>
                <linearGradient id="costForecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `$${v}M`} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <ReferenceLine x={firstForecast?.date} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Today', fill: '#f59e0b', fontSize: 11 }} />
              <Area type="monotone" dataKey="Actual" stroke="#3b82f6" strokeWidth={2} fill="none" connectNulls name="Actual" />
              <Area type="monotone" dataKey="Forecast" stroke="#ef4444" strokeWidth={2} fill="url(#costForecastGrad)" connectNulls strokeDasharray="5 5" name="Forecast" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Info */}
      <div className="glass-card rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Forecasting Model Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <p className="text-xs text-muted-foreground">Primary Model</p>
            <p className="text-sm font-medium text-white">Prophet (Meta)</p>
            <p className="text-xs text-muted-foreground mt-1">Seasonal decomposition</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <p className="text-xs text-muted-foreground">Secondary Model</p>
            <p className="text-sm font-medium text-white">ARIMA (5,1,0)</p>
            <p className="text-xs text-muted-foreground mt-1">Autoregressive integrated</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <p className="text-xs text-muted-foreground">Model Accuracy</p>
            <p className="text-sm font-medium text-emerald-400">94.2% MAPE</p>
            <p className="text-xs text-muted-foreground mt-1">Mean absolute % error</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <p className="text-xs text-muted-foreground">Last Retrained</p>
            <p className="text-sm font-medium text-white">May 31, 2024</p>
            <p className="text-xs text-muted-foreground mt-1">Daily auto-retrain</p>
          </div>
        </div>
      </div>
    </div>
  )
}
