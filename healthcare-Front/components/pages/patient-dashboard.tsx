"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Heart,
  Calendar,
  Download,
  Shield,
  Activity,
  Clock,
  User,
  Stethoscope,
  AlertCircle,
} from "lucide-react"
import { StatsCard } from "../ui/stats-card"
import { useNotification } from "../../hooks/useNotification"
import { blockchainService } from "../../services/blockchain"
import { truncateAddress } from "../../utils/address"
import { formatDate } from "../../utils/format"
import type { MedicalRecord, User as UserType } from "../../types"

interface PatientStats {
  totalRecords: number
  lastVisit: number | null
  doctorsConsulted: number
  recordsThisYear: number
}

interface PatientDashboardProps {
  user: UserType
}

export const PatientDashboard = ({ user }: PatientDashboardProps) => {
  const { showNotification } = useNotification()
  const [stats, setStats] = useState<PatientStats>({
    totalRecords: 0,
    lastVisit: null,
    doctorsConsulted: 0,
    recordsThisYear: 0,
  })
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user.address) {
      loadPatientData()
    }
  }, [user.address])

  const loadPatientData = async () => {
    setIsLoading(true)
    try {
      const records = await blockchainService.getPatientRecords(user.address)
      setMedicalRecords(records)

      // Calculate stats
      const uniqueDoctors = new Set(records.map((record) => record.doctorAddress)).size
      const currentYear = new Date().getFullYear()
      const recordsThisYear = records.filter(
        (record) => new Date(record.timestamp * 1000).getFullYear() === currentYear,
      ).length
      const lastVisit = records.length > 0 ? Math.max(...records.map((r) => r.timestamp)) : null

      setStats({
        totalRecords: records.length,
        lastVisit,
        doctorsConsulted: uniqueDoctors,
        recordsThisYear,
      })
    } catch (error) {
      console.error("Error loading patient data:", error)
      showNotification("Failed to load medical records.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const exportRecords = () => {
    if (medicalRecords.length === 0) {
      showNotification("No records to export.", "info")
      return
    }

    const csvContent = [
      "Date,Doctor,Diagnosis,Prescription",
      ...medicalRecords.map(
        (record) =>
          `"${formatDate(record.timestamp)}","${record.doctorAddress}","${record.diagnosis}","${record.prescription}"`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `medical-records-${user.address.slice(0, 8)}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    showNotification("Medical records exported successfully!", "success")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your medical records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500 rounded-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Your Health Dashboard</h2>
            <p className="text-gray-600">View and manage your medical records securely</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Records"
          value={stats.totalRecords}
          description="Medical records on file"
          icon={FileText}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Doctors Consulted"
          value={stats.doctorsConsulted}
          description="Healthcare providers"
          icon={Stethoscope}
          iconColor="text-green-500"
        />
        <StatsCard
          title="This Year"
          value={stats.recordsThisYear}
          description="Records added this year"
          icon={Calendar}
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Last Visit"
          value={stats.lastVisit ? new Date(stats.lastVisit * 1000).toLocaleDateString() : "Never"}
          description="Most recent record"
          icon={Clock}
          iconColor="text-orange-500"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="records" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="records" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Medical Records
          </TabsTrigger>
          <TabsTrigger value="health-summary" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Health Summary
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacy & Security
          </TabsTrigger>
        </TabsList>

        {/* Medical Records */}
        <TabsContent value="records" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Your Medical Records ({stats.totalRecords})
                  </CardTitle>
                  <CardDescription>Complete history of your medical consultations and treatments</CardDescription>
                </div>
                {medicalRecords.length > 0 && (
                  <Button onClick={exportRecords} variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Records
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {medicalRecords.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medical Records</h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any medical records yet. When a doctor adds a record for you, it will appear here.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">How to get medical records:</p>
                        <p>
                          Visit a registered doctor who will add your medical records to the blockchain after
                          consultation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {medicalRecords
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((record, index) => (
                      <Card key={record.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Record #{medicalRecords.length - index}
                              </Badge>
                              <span className="text-sm text-gray-500">{formatDate(record.timestamp)}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Doctor</p>
                              <p className="text-sm font-mono">{truncateAddress(record.doctorAddress)}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-500" />
                                Diagnosis
                              </h4>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{record.diagnosis}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <Heart className="w-4 h-4 text-red-500" />
                                Prescription & Treatment
                              </h4>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{record.prescription}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Summary */}
        <TabsContent value="health-summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Health Summary
              </CardTitle>
              <CardDescription>Overview of your health data and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                  {stats.lastVisit ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">Last Medical Visit</span>
                      </div>
                      <p className="text-sm text-green-700">{formatDate(stats.lastVisit)}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600">No recent medical visits recorded.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Healthcare Providers</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Doctors Consulted</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">{stats.doctorsConsulted}</p>
                    <p className="text-sm text-blue-600">Healthcare professionals</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy & Security */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Your medical data is secured on the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Blockchain Security</h3>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    Your medical records are stored securely on the blockchain, ensuring immutability and transparency.
                  </p>
                  <ul className="text-sm text-green-600 space-y-1">
                    <li>• Encrypted data storage</li>
                    <li>• Immutable record history</li>
                    <li>• Decentralized access control</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">Access Control</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Only authorized doctors can add records to your medical history.
                  </p>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Doctor verification required</li>
                    <li>• Patient consent protocols</li>
                    <li>• Audit trail maintained</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Important Privacy Information</h3>
                    <p className="text-sm text-yellow-700 mb-2">
                      Your wallet address:{" "}
                      <code className="bg-yellow-100 px-1 rounded">{truncateAddress(user.address)}</code>
                    </p>
                    <p className="text-sm text-yellow-700">
                      Keep your private keys secure. Never share them with anyone. Your medical records are tied to your
                      wallet address.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
