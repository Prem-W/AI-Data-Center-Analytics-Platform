import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Server,
  Brain,
  Zap,
  DollarSign,
  LineChart,
  Menu,
  X,
  Cpu,
  ChevronDown,
  Globe,
  Calendar,
  ArrowDownUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { path: '/', label: 'Executive Overview', icon: LayoutDashboard },
  { path: '/infrastructure', label: 'Infrastructure', icon: Server },
  { path: '/workloads', label: 'AI Workloads', icon: Brain },
  { path: '/energy', label: 'Energy & Sustainability', icon: Zap },
  { path: '/financial', label: 'Financial', icon: DollarSign },
  { path: '/predictive', label: 'Predictive Analytics', icon: LineChart },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [regionOpen, setRegionOpen] = useState(false)

  return (
    <div className="flex h-screen w-full bg-[#0a0f1a] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex-shrink-0 bg-[#0d1220] border-r border-white/5 transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">AI DATA CENTER</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Analytics</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5',
                  !sidebarOpen && 'justify-center px-2'
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className={cn('w-4 h-4 flex-shrink-0', isActive && 'text-blue-400')} />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Operational</span>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground/60">Last updated: {new Date().toLocaleString()}</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex-shrink-0 h-16 bg-[#0d1220]/80 backdrop-blur-sm border-b border-white/5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-white">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Live</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Region Filter */}
            <div className="relative">
              <button
                onClick={() => setRegionOpen(!regionOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Global</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {regionOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1f2e] border border-white/10 rounded-lg shadow-xl z-50 py-1">
                  {['Global', 'North America', 'Europe', 'Asia Pacific', 'South America', 'Middle East & Africa'].map(region => (
                    <button
                      key={region}
                      className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                      onClick={() => setRegionOpen(false)}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>1 May 2024 - 31 May 2024</span>
            </div>

            {/* Compare */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-muted-foreground">
              <ArrowDownUp className="w-3.5 h-3.5" />
              <span>vs Apr 2024</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
