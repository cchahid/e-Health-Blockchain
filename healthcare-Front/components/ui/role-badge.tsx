import { Badge } from "@/components/ui/badge"
import { Shield, Stethoscope, User } from "lucide-react"
import type { UserRole } from "../../types"
import { ROLE_COLORS } from "../../constants/ui"

interface RoleBadgeProps {
  role: UserRole
  size?: "sm" | "md" | "lg"
}

export const RoleBadge = ({ role, size = "md" }: RoleBadgeProps) => {
  const getRoleIcon = (role: UserRole) => {
    const iconSize = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-4 h-4"

    switch (role) {
      case "Owner":
        return <Shield className={iconSize} />
      case "Doctor":
        return <Stethoscope className={iconSize} />
      case "Patient":
        return <User className={iconSize} />
      default:
        return <User className={iconSize} />
    }
  }

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  }

  return (
    <Badge className={`${ROLE_COLORS[role]} ${sizeClasses[size]} font-medium`}>
      <div className="flex items-center gap-2">
        {getRoleIcon(role)}
        {role}
      </div>
    </Badge>
  )
}
