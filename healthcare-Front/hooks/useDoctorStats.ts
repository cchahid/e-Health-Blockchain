"use client"

import { useState, useEffect, useCallback } from "react"
import type { MedicalRecord } from "../types"
import { blockchainService } from "../services/blockchain"

interface DoctorStats {
  totalRecords: number
  patientsServed: number
  recordsThisMonth: number
  averageRecordsPerDay: number
  recentRecords: MedicalRecord[]
}

export const useDoctorStats = (doctorAddress: string | null) => {
  const [stats, setStats] = useState<DoctorStats>({
    totalRecords: 0,
    patientsServed: 0,
    recordsThisMonth: 0,
    averageRecordsPerDay: 0,
    recentRecords: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStats = useCallback(async () => {
    if (!doctorAddress) return

    setIsLoading(true)
    setError(null)

    try {
      const doctorStats = await blockchainService.getDoctorStats(doctorAddress)
      setStats(doctorStats)
    } catch (err: any) {
      setError(err.message)
      console.error("Error loading doctor stats:", err)
    } finally {
      setIsLoading(false)
    }
  }, [doctorAddress])

  // Load stats on mount and when doctor address changes
  useEffect(() => {
    loadStats()
  }, [loadStats])

  const refreshStats = useCallback(() => {
    loadStats()
  }, [loadStats])

  return {
    stats,
    isLoading,
    error,
    refreshStats,
  }
}
