import { useState, useEffect } from 'react'

export interface ExecutiveDaily {
  date: string
  total_data_centers: number
  total_servers: number
  gpu_utilization: number
  power_consumption_mw: number
  operational_cost_m: number
  carbon_emissions_tco2e: number
  pue_global: number
  avg_utilization: number
}

export interface ExecRegion {
  region: string
  data_center: string
  server_count: number
  gpu_count: number
  power_capacity_mw: number
  utilization: number
}

export interface InfrastructureHourly {
  datetime: string
  cpu_utilization: number
  gpu_utilization: number
  memory_usage: number
  storage_capacity: number
  network_usage_gbps: number
  active_servers: number
  idle_servers: number
  failed_servers: number
}

export interface GPUBreakdown {
  gpu_type: string
  total_count: number
  utilization: number
  idle_count: number
  health_score: number
  failure_rate: number
  availability: number
}

export interface AIWorkloadsDaily {
  date: string
  ai_jobs_running: number
  training_jobs: number
  inference_jobs: number
  avg_training_hours: number
  success_rate: number
  models_trained: number
  compute_cost: number
  energy_cost: number
}

export interface ModelData {
  model_name: string
  training_hours: number
  gpu_hours: number
  cost_usd: number
  energy_kwh: number
  success_rate: number
  params_billions: number
  avg_gpu_utilization: number
}

export interface ProjectData {
  project_name: string
  gpu_hours: number
  cost_usd: number
  training_hours: number
  model_type: string
  status: string
}

export interface EnergyDaily {
  date: string
  pue: number
  renewable_energy_pct: number
  total_energy_mwh: number
  carbon_emissions_tco2e: number
  cooling_efficiency: number
  grid_energy_pct: number
  solar_energy_pct: number
  wind_energy_pct: number
  other_renewable_pct: number
}

export interface EnergyByRegion {
  region: string
  energy_consumption_mwh: number
  pue: number
  renewable_pct: number
  carbon_tco2e: number
  cooling_cost: number
}

export interface FinancialDaily {
  date: string
  operating_cost_m: number
  revenue_m: number
  cost_per_gpu_hour: number
  maintenance_expenses_m: number
  roi_ttm: number
  profit_margin: number
  infrastructure_cost_m: number
  power_cooling_cost_m: number
  personnel_cost_m: number
}

export interface PredictiveData {
  date: string
  is_forecast: boolean
  gpu_demand_forecast: number
  energy_demand_forecast_mw: number
  failure_probability: number
  capacity_utilization_forecast: number
  cost_forecast_m: number
}

interface DashboardData {
  executiveDaily: ExecutiveDaily[]
  execRegion: ExecRegion[]
  infrastructureHourly: InfrastructureHourly[]
  gpuBreakdown: GPUBreakdown[]
  aiWorkloadsDaily: AIWorkloadsDaily[]
  modelData: ModelData[]
  projectData: ProjectData[]
  energyDaily: EnergyDaily[]
  energyByRegion: EnergyByRegion[]
  financialDaily: FinancialDaily[]
  costBreakdown: Record<string, number>
  predictiveData: PredictiveData[]
}

export function useDashboardData(): DashboardData | null {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          executiveDaily,
          execRegion,
          infrastructureHourly,
          gpuBreakdown,
          aiWorkloadsDaily,
          modelData,
          projectData,
          energyDaily,
          energyByRegion,
          financialDaily,
          costBreakdown,
          predictiveData
        ] = await Promise.all([
          fetch('/data/executive_daily.json').then(r => r.json()),
          fetch('/data/exec_region_data.json').then(r => r.json()),
          fetch('/data/infrastructure_hourly.json').then(r => r.json()),
          fetch('/data/gpu_breakdown.json').then(r => r.json()),
          fetch('/data/ai_workloads_daily.json').then(r => r.json()),
          fetch('/data/model_data.json').then(r => r.json()),
          fetch('/data/project_data.json').then(r => r.json()),
          fetch('/data/energy_daily.json').then(r => r.json()),
          fetch('/data/energy_by_region.json').then(r => r.json()),
          fetch('/data/financial_daily.json').then(r => r.json()),
          fetch('/data/cost_breakdown.json').then(r => r.json()),
          fetch('/data/predictive_data.json').then(r => r.json()),
        ])

        setData({
          executiveDaily,
          execRegion,
          infrastructureHourly,
          gpuBreakdown,
          aiWorkloadsDaily,
          modelData,
          projectData,
          energyDaily,
          energyByRegion,
          financialDaily,
          costBreakdown,
          predictiveData
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }

    fetchData()
  }, [])

  return data
}
