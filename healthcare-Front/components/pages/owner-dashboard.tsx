"use client"
import { Stethoscope, Users } from "lucide-react"
import { StatsCard } from "../ui/stats-card"
import { useDoctors } from "../../hooks/useDoctors"

interface OwnerDashboardProps {
  onNavigate: (view: string) => void
}

export const OwnerDashboard = ({ onNavigate }: OwnerDashboardProps) => {
  const { doctors, totalDoctors } = useDoctors()

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Total Doctors"
          value={totalDoctors}
          description="Active medical professionals"
          icon={Stethoscope}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Total Patients"
          value={0}
          description="Registered patients"
          icon={Users}
          iconColor="text-green-500"
        />
      </div>
    </div>
  )
}
