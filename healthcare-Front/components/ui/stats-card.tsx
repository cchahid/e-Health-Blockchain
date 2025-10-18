import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { formatNumber } from "../../utils/format"

interface StatsCardProps {
  title: string
  value: number
  description: string
  icon: LucideIcon
  iconColor?: string
}

export const StatsCard = ({ title, value, description, icon: Icon, iconColor = "text-gray-400" }: StatsCardProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(value)}</div>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  )
}
