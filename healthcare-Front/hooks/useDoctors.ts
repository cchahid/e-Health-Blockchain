"use client"

import { useState, useEffect, useCallback } from "react"
import type { Doctor, DoctorRegistration } from "../types"
import { blockchainService } from "../services/blockchain"

// Local storage key for doctor names
const DOCTOR_NAMES_KEY = "ehealth_doctor_names"

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load doctor names from localStorage
  const getDoctorNames = useCallback((): Record<string, string> => {
    try {
      const stored = localStorage.getItem(DOCTOR_NAMES_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error("Error loading doctor names:", error)
      return {}
    }
  }, [])

  // Save doctor names to localStorage
  const saveDoctorNames = useCallback((names: Record<string, string>) => {
    try {
      localStorage.setItem(DOCTOR_NAMES_KEY, JSON.stringify(names))
    } catch (error) {
      console.error("Error saving doctor names:", error)
    }
  }, [])

  // Save doctor name
  const saveDoctorName = useCallback(
    (address: string, name: string) => {
      const names = getDoctorNames()
      names[address.toLowerCase()] = name
      saveDoctorNames(names)
    },
    [getDoctorNames, saveDoctorNames],
  )

  const loadDoctors = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const doctorsList = await blockchainService.getDoctors()
      const doctorNames = getDoctorNames()

      // Merge blockchain data with stored names
      const doctorsWithNames = doctorsList.map((doctor) => ({
        ...doctor,
        name: doctorNames[doctor.address.toLowerCase()] || undefined,
      }))

      setDoctors(doctorsWithNames)
    } catch (err: any) {
      setError(err.message)
      console.error("Error loading doctors:", err)
    } finally {
      setIsLoading(false)
    }
  }, [getDoctorNames])

  const addDoctor = useCallback(
    async (doctorData: DoctorRegistration) => {
      try {
        // Add doctor to blockchain
        await blockchainService.addDoctor(doctorData.address)

        // Save doctor name locally
        saveDoctorName(doctorData.address, doctorData.name)

        // Refresh list
        await loadDoctors()
        return true
      } catch (err: any) {
        setError(err.message)
        return false
      }
    },
    [loadDoctors, saveDoctorName],
  )

  const removeDoctor = useCallback(
    async (address: string) => {
      try {
        await blockchainService.removeDoctor(address)

        // Remove doctor name from local storage
        const names = getDoctorNames()
        delete names[address.toLowerCase()]
        saveDoctorNames(names)

        // Refresh list
        await loadDoctors()
        return true
      } catch (err: any) {
        setError(err.message)
        return false
      }
    },
    [loadDoctors, getDoctorNames, saveDoctorNames],
  )

  // Load doctors on mount
  useEffect(() => {
    loadDoctors()
  }, [loadDoctors])

  return {
    doctors,
    isLoading,
    error,
    loadDoctors,
    addDoctor,
    removeDoctor,
    totalDoctors: doctors.length,
  }
}
