import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'cyan'
  subtitle?: string
}

const colorMap = {
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
  green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
  amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
  red: 'from-red-500/20 to-red-600/5 border-red-500/20',
  purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
  cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
}

const iconColorMap = {
  blue: 'text-blue-400 bg-blue-500/10',
  green: 'text-emerald-400 bg-emerald-500/10',
  amber: 'text-amber-400 bg-amber-500/10',
  red: 'text-red-400 bg-red-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
  cyan: 'text-cyan-400 bg-cyan-500/10',
}

export default function KPICard({ title, value, change, changeLabel, icon, color = 'blue', subtitle }: KPICardProps) {
  const isPositive = change !== undefined && change >= 0
  const isNeutral = change !== undefined && change === 0

  return (
    <div className={`relative overflow-hidden rounded-lg border bg-gradient-to-br ${colorMap[color]} p-4 transition-all hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">{title}</p>
          <p className="mt-1 text-2xl font-bold text-white tracking-tight">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {isNeutral ? (
                <Minus className="w-3 h-3 text-muted-foreground" />
              ) : isPositive ? (
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
              <span className={`text-xs font-medium ${isNeutral ? 'text-muted-foreground' : isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{change}%
              </span>
              {changeLabel && <span className="text-xs text-muted-foreground ml-1">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className={`flex-shrink-0 p-2 rounded-lg ${iconColorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
