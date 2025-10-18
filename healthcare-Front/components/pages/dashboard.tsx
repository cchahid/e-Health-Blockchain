"use client"

import { DoctorDashboard } from "./doctor-dashboard"
import { PatientDashboard } from "./patient-dashboard"
import { OwnerDashboard } from "./owner-dashboard"
import type { User } from "../../types"

interface DashboardProps {
  user: User
  onNavigate: (view: string) => void
}

export const Dashboard = ({ user, onNavigate }: DashboardProps) => {
  switch (user.role) {
    case "Owner":
      return <OwnerDashboard onNavigate={onNavigate} />
    case "Doctor":
      return <DoctorDashboard />
    case "Patient":
      return <PatientDashboard user={user} />
    default:
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Unknown user role. Please reconnect your wallet.</p>
        </div>
      )
  }
}
