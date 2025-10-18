"use client"

import { useState } from "react"
import { useWallet } from "./hooks/useWallet"
import { useNotification } from "./hooks/useNotification"
import { WalletConnect } from "./components/pages/wallet-connect"
import { Dashboard } from "./components/pages/dashboard"
import { ManageDoctors } from "./components/pages/manage-doctors"
import { Sidebar } from "./components/layout/sidebar"
import { Header } from "./components/layout/header"
import { NotificationToast } from "./components/ui/notification-toast"
import { ROUTES } from "./constants/ui"

// Contract configuration
const contractAddress = "0xfd3872b1be34a16faf637e4091793fdd4c0d75bf"
const contractABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "doctorAddress", type: "address" }],
    name: "DoctorAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "doctorAddress", type: "address" }],
    name: "DoctorRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "patientAddress", type: "address" },
      { indexed: true, internalType: "address", name: "doctorAddress", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "RecordAdded",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "_doctorAddress", type: "address" }],
    name: "addDoctor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_patientAddress", type: "address" },
      { internalType: "string", name: "_diagnosis", type: "string" },
      { internalType: "string", name: "_prescription", type: "string" },
    ],
    name: "addMedicalRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_patientAddress", type: "address" }],
    name: "getPatientRecords",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "string", name: "diagnosis", type: "string" },
          { internalType: "string", name: "prescription", type: "string" },
          { internalType: "address", name: "doctor", type: "address" },
        ],
        internalType: "struct EHealth.MedicalRecord[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_patientAddress", type: "address" }],
    name: "getRecordsCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_patientAddress", type: "address" }],
    name: "hasMedicalHistory",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isDoctor",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "records",
    outputs: [
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "string", name: "diagnosis", type: "string" },
      { internalType: "string", name: "prescription", type: "string" },
      { internalType: "address", name: "doctor", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_doctorAddress", type: "address" }],
    name: "removeDoctor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

interface Notification {
  show: boolean
  message: string
  type: "success" | "error" | "info" | "warning"
}

const App = () => {
  const { user, isLoading, error, connectWallet, disconnect } = useWallet()
  const { notifications, removeNotification, showNotification } = useNotification()
  const [activeView, setActiveView] = useState(ROUTES.DASHBOARD)

  // Show wallet connect screen if not connected
  if (!user?.isConnected) {
    return (
      <>
        {notifications.map((notification) => (
          <NotificationToast key={notification.id} {...notification} onClose={removeNotification} />
        ))}
        <WalletConnect onConnect={connectWallet} isLoading={isLoading} error={error} />
      </>
    )
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      showNotification("Wallet disconnected successfully!", "success")
    } catch (error) {
      showNotification("Error disconnecting wallet", "error")
    }
  }

  const renderMainContent = () => {
    switch (activeView) {
      case ROUTES.DASHBOARD:
        return <Dashboard user={user} onNavigate={setActiveView} />
      case ROUTES.MANAGE_DOCTORS:
        return <ManageDoctors />
      case ROUTES.MEDICAL_RECORDS:
        return <div className="p-8">Medical Records - Coming Soon</div>
      case ROUTES.ANALYTICS:
        return <div className="p-8">Analytics - Coming Soon</div>
      default:
        return <Dashboard user={user} onNavigate={setActiveView} />
    }
  }

  const getPageTitle = () => {
    switch (activeView) {
      case ROUTES.DASHBOARD:
        return `${user.role} Dashboard`
      case ROUTES.MANAGE_DOCTORS:
        return "Manage Doctors"
      case ROUTES.MEDICAL_RECORDS:
        return "Medical Records"
      case ROUTES.ANALYTICS:
        return "Analytics"
      default:
        return `${user.role} Dashboard`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Notifications */}
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} {...notification} onClose={removeNotification} />
      ))}

      {/* Sidebar */}
      <Sidebar user={user} activeView={activeView} onViewChange={setActiveView} onDisconnect={handleDisconnect} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header user={user} title={getPageTitle()} onDisconnect={handleDisconnect} />

        {/* Main Content Area */}
        <div className="flex-1 p-8">{renderMainContent()}</div>
      </div>
    </div>
  )
}

export default App
