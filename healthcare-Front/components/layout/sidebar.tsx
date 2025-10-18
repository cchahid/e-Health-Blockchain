"use client"

import { Button } from "@/components/ui/button"
import { Activity, Users, FileText, BarChart3, LogOut } from "lucide-react"
import type { User } from "../../types"
import { RoleBadge } from "../ui/role-badge"
import { ROUTES } from "../../constants/ui"

interface SidebarProps {
  user: User
  activeView: string
  onViewChange: (view: string) => void
  onDisconnect: () => void
}

export const Sidebar = ({ user, activeView, onViewChange, onDisconnect }: SidebarProps) => {
  const navigationItems = [
    {
      id: ROUTES.DASHBOARD,
      label: "Dashboard",
      icon: Activity,
      roles: ["Owner", "Doctor", "Patient"],
    },
    {
      id: ROUTES.MANAGE_DOCTORS,
      label: "Manage Doctors",
      icon: Users,
      roles: ["Owner"],
    },
    {
      id: ROUTES.MEDICAL_RECORDS,
      label: "Medical Records",
      icon: FileText,
      roles: ["Owner", "Doctor", "Patient"],
    },
    {
      id: ROUTES.ANALYTICS,
      label: "Analytics",
      icon: BarChart3,
      roles: ["Owner", "Doctor"],
    },
  ]

  const availableItems = navigationItems.filter((item) => item.roles.includes(user.role))

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* App Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">e-Health DApp</h1>
            <p className="text-sm text-gray-500">Medical Records</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
          <nav className="space-y-2">
            {availableItems.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{user.role.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <RoleBadge role={user.role} size="sm" />
            <p className="text-xs text-gray-500 mt-1">Connected</p>
          </div>
        </div>

        <Button onClick={onDisconnect} variant="outline" className="w-full text-sm">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect Wallet
        </Button>
      </div>
    </div>
  )
}
