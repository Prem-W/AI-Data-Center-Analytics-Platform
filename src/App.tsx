import { Routes, Route } from 'react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import DashboardLayout from './components/DashboardLayout'
import ExecutiveOverview from './pages/ExecutiveOverview'
import InfrastructureMonitoring from './pages/InfrastructureMonitoring'
import AIWorkloadAnalytics from './pages/AIWorkloadAnalytics'
import EnergySustainability from './pages/EnergySustainability'
import FinancialDashboard from './pages/FinancialDashboard'
import PredictiveAnalytics from './pages/PredictiveAnalytics'

export default function App() {
  return (
    <SidebarProvider>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<ExecutiveOverview />} />
          <Route path="/infrastructure" element={<InfrastructureMonitoring />} />
          <Route path="/workloads" element={<AIWorkloadAnalytics />} />
          <Route path="/energy" element={<EnergySustainability />} />
          <Route path="/financial" element={<FinancialDashboard />} />
          <Route path="/predictive" element={<PredictiveAnalytics />} />
        </Routes>
      </DashboardLayout>
    </SidebarProvider>
  )
}
