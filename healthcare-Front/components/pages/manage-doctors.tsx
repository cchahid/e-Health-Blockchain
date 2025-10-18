"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Stethoscope, User, X, ChevronUp } from "lucide-react"
import { useDoctors } from "../../hooks/useDoctors"
import { useNotification } from "../../hooks/useNotification"
import { isValidAddress } from "../../utils/address"
import type { DoctorRegistration } from "../../types"

export const ManageDoctors = () => {
  const { doctors, isLoading, addDoctor, removeDoctor, totalDoctors } = useDoctors()
  const { showNotification } = useNotification()

  // Form visibility states
  const [showAddForm, setShowAddForm] = useState(false)
  const [showRemoveForm, setShowRemoveForm] = useState(false)

  const [newDoctor, setNewDoctor] = useState<DoctorRegistration>({
    address: "",
    name: "",
  })
  const [removeDoctorAddress, setRemoveDoctorAddress] = useState("")
  const [isAddingDoctor, setIsAddingDoctor] = useState(false)
  const [isRemovingDoctor, setIsRemovingDoctor] = useState(false)

  const handleAddDoctor = async () => {
    if (!newDoctor.address || !newDoctor.name) {
      showNotification("Please enter both doctor address and name.", "warning")
      return
    }

    if (!isValidAddress(newDoctor.address)) {
      showNotification("Please enter a valid Ethereum address.", "error")
      return
    }

    if (newDoctor.name.trim().length < 2) {
      showNotification("Doctor name must be at least 2 characters long.", "error")
      return
    }

    setIsAddingDoctor(true)
    try {
      const success = await addDoctor(newDoctor)
      if (success) {
        showNotification(`Dr. ${newDoctor.name} added successfully!`, "success")
        setNewDoctor({ address: "", name: "" })
        setShowAddForm(false) // Hide form after successful addition
      } else {
        showNotification("Failed to add doctor.", "error")
      }
    } catch (error) {
      showNotification("Failed to add doctor.", "error")
    } finally {
      setIsAddingDoctor(false)
    }
  }

  const handleRemoveDoctor = async (address?: string) => {
    const addressToRemove = address || removeDoctorAddress

    if (!addressToRemove) {
      showNotification("Please enter a doctor address to remove.", "warning")
      return
    }

    if (!isValidAddress(addressToRemove)) {
      showNotification("Please enter a valid Ethereum address.", "error")
      return
    }

    // Find doctor name for confirmation
    const doctor = doctors.find((d) => d.address.toLowerCase() === addressToRemove.toLowerCase())
    const doctorName = doctor?.name || "this doctor"

    if (!window.confirm(`Are you sure you want to remove ${doctorName}?`)) {
      return
    }

    setIsRemovingDoctor(true)
    try {
      const success = await removeDoctor(addressToRemove)
      if (success) {
        showNotification(`${doctorName} removed successfully!`, "success")
        setRemoveDoctorAddress("")
        if (!address) setShowRemoveForm(false) // Hide form after successful removal (only if not from list)
      } else {
        showNotification("Failed to remove doctor.", "error")
      }
    } catch (error) {
      showNotification("Failed to remove doctor.", "error")
    } finally {
      setIsRemovingDoctor(false)
    }
  }

  const handleCancelAdd = () => {
    setNewDoctor({ address: "", name: "" })
    setShowAddForm(false)
  }

  const handleCancelRemove = () => {
    setRemoveDoctorAddress("")
    setShowRemoveForm(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Manage Doctors</h2>
        <p className="text-gray-600">Add or remove doctors from the e-Health system</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          {showAddForm ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? "Hide Add Form" : "Add Doctor"}
        </Button>

        <Button
          onClick={() => setShowRemoveForm(!showRemoveForm)}
          variant="destructive"
          className="flex items-center gap-2"
        >
          {showRemoveForm ? <ChevronUp className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
          {showRemoveForm ? "Hide Remove Form" : "Remove Doctor"}
        </Button>
      </div>

      {/* Add Doctor Form */}
      {showAddForm && (
        <Card className="bg-white shadow-sm border border-green-200 border-l-4 border-l-green-500">
          <CardHeader className="bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Plus className="w-5 h-5" />
                  Add New Doctor
                </CardTitle>
                <CardDescription>Register a new doctor in the system</CardDescription>
              </div>
              <Button onClick={handleCancelAdd} variant="ghost" size="sm" className="text-green-600">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doctorName" className="text-sm font-medium text-gray-700">
                  Doctor Name *
                </Label>
                <Input
                  id="doctorName"
                  placeholder="Dr. John Smith"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="addDoctorAddress" className="text-sm font-medium text-gray-700">
                  Doctor Wallet Address *
                </Label>
                <Input
                  id="addDoctorAddress"
                  placeholder="0x..."
                  value={newDoctor.address}
                  onChange={(e) => setNewDoctor({ ...newDoctor, address: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button onClick={handleCancelAdd} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={handleAddDoctor}
                disabled={isAddingDoctor || !newDoctor.address || !newDoctor.name}
                className="bg-green-600 hover:bg-green-700"
              >
                {isAddingDoctor ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Doctor
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Remove Doctor Form */}
      {showRemoveForm && (
        <Card className="bg-white shadow-sm border border-red-200 border-l-4 border-l-red-500">
          <CardHeader className="bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Trash2 className="w-5 h-5" />
                  Remove Doctor
                </CardTitle>
                <CardDescription>Remove a doctor from the system</CardDescription>
              </div>
              <Button onClick={handleCancelRemove} variant="ghost" size="sm" className="text-red-600">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <Label htmlFor="removeDoctorAddress" className="text-sm font-medium text-gray-700">
                Doctor Wallet Address *
              </Label>
              <Input
                id="removeDoctorAddress"
                placeholder="0x... or select from list below"
                value={removeDoctorAddress}
                onChange={(e) => setRemoveDoctorAddress(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button onClick={handleCancelRemove} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => handleRemoveDoctor()}
                disabled={isRemovingDoctor || !removeDoctorAddress}
                variant="destructive"
              >
                {isRemovingDoctor ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Removing...
                  </div>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Doctor
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registered Doctors List */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Registered Doctors ({totalDoctors})</CardTitle>
          <CardDescription>
            List of all doctors registered in the system
            {showRemoveForm && " - Click the remove button next to any doctor to remove them"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-8">
              <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No doctors registered yet.</p>
              <p className="text-sm text-gray-400 mt-2">Click "Add Doctor" to register the first doctor.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.map((doctor, index) => (
                <div
                  key={doctor.address}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    showRemoveForm ? "bg-red-50 border border-red-100 hover:bg-red-100" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        showRemoveForm ? "bg-red-100" : "bg-blue-100"
                      }`}
                    >
                      <Stethoscope className={`w-5 h-5 ${showRemoveForm ? "text-red-600" : "text-blue-600"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {doctor.name ? (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-gray-500" />
                            <p className="font-medium text-gray-900">{doctor.name}</p>
                          </div>
                        ) : (
                          <p className="font-medium text-gray-900">Doctor #{index + 1}</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Registered Doctor</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemoveDoctor(doctor.address)}
                    disabled={isRemovingDoctor}
                    variant={showRemoveForm ? "destructive" : "outline"}
                    size="sm"
                    className={showRemoveForm ? "" : "opacity-60 hover:opacity-100"}
                  >
                    <Trash2 className="w-4 h-4" />
                    {showRemoveForm && <span className="ml-2">Remove</span>}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
