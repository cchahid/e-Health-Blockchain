"use client"

import { useState, useCallback } from "react"
import type { Notification } from "../types"
import { generateId } from "../utils/format"
import { NOTIFICATION_DURATION } from "../constants/ui"

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback(
    (message: string, type: Notification["type"] = "info", duration: number = NOTIFICATION_DURATION.MEDIUM) => {
      const id = generateId()
      const notification: Notification = {
        id,
        show: true,
        message,
        type,
        duration,
      }

      setNotifications((prev) => [...prev, notification])

      // Auto-remove notification
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }, duration)
    },
    [],
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    showNotification,
    removeNotification,
    clearAllNotifications,
  }
}
