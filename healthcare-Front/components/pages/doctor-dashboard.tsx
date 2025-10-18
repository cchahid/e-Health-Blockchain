"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  FileText,
  Users,
  Activity,
  Search,
  Calendar,
  Stethoscope,
  ClipboardList,
  TrendingUp,
  RefreshCw,
} from "lucide-react"
import { StatsCard } from "../ui/stats-card"
import { useNotification } from "../../hooks/useNotification"
import { useDoctorStats } from "../../hooks/useDoctorStats"
import { useWallet } from "../../hooks/useWallet"
import { blockchainService } from "../../services/blockchain"
import { isValidAddress } from "../../utils/address"
import { formatDate } from "../../utils/format"
import type { MedicalRecord } from "../../types"

export const DoctorDashboard = () => {
  const { user } = useWallet()
  const { showNotification } = useNotification()
  const { stats, isLoading: statsLoading, refreshStats } = useDoctorStats(user?.address || null)

  const [searchAddress, setSearchAddress] = useState("")
  const [searchResults, setSearchResults] = useState<MedicalRecord[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAddingRecord, setIsAddingRecord] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // New record form
  const [newRecord, setNewRecord] = useState({
    patientAddress: "",
    diagnosis: "",
    prescription: "",
  })

  const handleAddRecord = async () => {
    if (!newRecord.patientAddress || !newRecord.diagnosis || !newRecord.prescription) {
      showNotification("Please fill all fields.", "warning")
      return
    }

    if (!isValidAddress(newRecord.patientAddress)) {
      showNotification("Please enter a valid patient address.", "error")
      return
    }

    setIsAddingRecord(true)
    try {
      await blockchainService.addMedicalRecord(newRecord.patientAddress, newRecord.diagnosis, newRecord.prescription)

      showNotification("Medical record added successfully!", "success")
      setNewRecord({ patientAddress: "", diagnosis: "", prescription: "" })

      // Refresh stats after adding a record with longer delay
      showNotification("Refreshing statistics in 5 seconds...", "info")
      setTimeout(() => {
        refreshStats()
      }, 5000) // Wait 5 seconds for blockchain to update
    } catch (error) {
      console.error("Error adding record:", error)
      showNotification("Failed to add medical record.", "error")
    } finally {
      setIsAddingRecord(false)
    }
  }

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshStats()
      showNotification("Statistics refreshed!", "success")
    } catch (error) {
      showNotification("Failed to refresh statistics.", "error")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleSearchPatient = async () => {
    if (!searchAddress) {
      showNotification("Please enter a patient address.", "warning")
      return
    }

    if (!isValidAddress(searchAddress)) {
      showNotification("Please enter a valid patient address.", "error")
      return
    }

    setIsSearching(true)
    try {
      const records = await blockchainService.getPatientRecords(searchAddress)
      setSearchResults(records)

      if (records.length === 0) {
        showNotification("No medical records found for this patient.", "info")
      }
    } catch (error) {
      console.error("Error searching patient:", error)
      showNotification("Failed to search patient records.", "error")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Welcome, Doctor</h2>
              <p className="text-gray-600">Manage your patients and medical records</p>
            </div>
          </div>
          <Button
            onClick={handleManualRefresh}
            disabled={isRefreshing || statsLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Stats
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatsCard
              title="Total Records"
              value={stats.totalRecords}
              description="Records you've added"
              icon={FileText}
              iconColor="text-blue-500"
            />
            <StatsCard
              title="Patients Served"
              value={stats.patientsServed}
              description="Unique patients"
              icon={Users}
              iconColor="text-green-500"
            />
            <StatsCard
              title="This Month"
              value={stats.recordsThisMonth}
              description="Records added this month"
              icon={Calendar}
              iconColor="text-purple-500"
            />
            <StatsCard
              title="Daily Average"
              value={stats.averageRecordsPerDay}
              description="Records per day"
              icon={TrendingUp}
              iconColor="text-orange-500"
            />
          </>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="add-record" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add-record" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Record
          </TabsTrigger>
          <TabsTrigger value="search-patient" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search Patient
          </TabsTrigger>
          <TabsTrigger value="recent-activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Recent Activity ({stats.recentRecords.length})
          </TabsTrigger>
        </TabsList>

        {/* Add Medical Record */}
        <TabsContent value="add-record" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-600" />
                Add New Medical Record
              </CardTitle>
              <CardDescription>Create a new medical record for a patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="patientAddress" className="text-sm font-medium">
                      Patient Wallet Address *
                    </Label>
                    <Input
                      id="patientAddress"
                      placeholder="0x..."
                      value={newRecord.patientAddress}
                      onChange={(e) => setNewRecord({ ...newRecord, patientAddress: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="diagnosis" className="text-sm font-medium">
                      Diagnosis *
                    </Label>
                    <Textarea
                      id="diagnosis"
                      placeholder="Enter patient diagnosis..."
                      value={newRecord.diagnosis}
                      onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prescription" className="text-sm font-medium">
                      Prescription & Treatment *
                    </Label>
                    <Textarea
                      id="prescription"
                      placeholder="Enter prescription and treatment plan..."
                      value={newRecord.prescription}
                      onChange={(e) => setNewRecord({ ...newRecord, prescription: e.target.value })}
                      className="mt-1 min-h-[140px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleAddRecord}
                  disabled={isAddingRecord}
                  className="bg-green-600 hover:bg-green-700 px-8"
                >
                  {isAddingRecord ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding Record...
                    </div>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Medical Record
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Patient */}
        <TabsContent value="search-patient" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Search Patient Records
              </CardTitle>
              <CardDescription>Search for a patient's medical history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter patient wallet address (0x...)"
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                  />
                </div>
                <Button onClick={handleSearchPatient} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700">
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Medical Records ({searchResults.length})</h3>
                  <div className="space-y-4">
                    {searchResults.map((record, index) => (
                      <Card key={record.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Diagnosis</Label>
                              <p className="mt-1 text-sm">{record.diagnosis}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Prescription</Label>
                              <p className="mt-1 text-sm">{record.prescription}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Doctor</Label>
                              <p className="mt-1 text-sm">Dr. {user?.role === "Doctor" ? "You" : "Anonymous"}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Date</Label>
                              <p className="mt-1 text-sm">{formatDate(record.timestamp)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activity */}
        <TabsContent value="recent-activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your recent medical record additions</CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading recent activity...</p>
                </div>
              ) : stats.recentRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity to display.</p>
                  <p className="text-sm mt-2">Your recent medical record additions will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentRecords.map((record, index) => (
                    <Card key={record.id} className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              Recent #{index + 1}
                            </Badge>
                            <span className="text-sm text-gray-500">{formatDate(record.timestamp)}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Patient Record</p>
                            <p className="text-sm">Added by you</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Diagnosis</Label>
                            <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{record.diagnosis}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Prescription</Label>
                            <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{record.prescription}</p>
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
      </Tabs>
    </div>
  )
}
