"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, X } from "lucide-react"
import type { Notification } from "../../types"

interface NotificationToastProps extends Notification {
  onClose: (id: string) => void
}

export const NotificationToast = ({ id, message, type, show, onClose }: NotificationToastProps) => {
  if (!show) return null

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />
      case "error":
        return <AlertCircle className="w-5 h-5" />
      case "warning":
        return <AlertCircle className="w-5 h-5" />
      default:
        return <AlertCircle className="w-5 h-5" />
    }
  }

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      default:
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg transition-all duration-300 transform ${
        show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${getColors()}`}
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <span className="font-medium">{message}</span>
        <Button variant="ghost" size="sm" onClick={() => onClose(id)} className="ml-2 h-6 w-6 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
