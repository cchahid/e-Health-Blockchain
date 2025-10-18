"use client"

import { Button } from "@/components/ui/button"
import { Shield, LogOut } from "lucide-react"
import type { User } from "../../types"

interface HeaderProps {
  user: User
  title: string
  onDisconnect: () => void
}

export const Header = ({ user, title, onDisconnect }: HeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl font-semibold text-red-500">{title}</h1>
          </div>
          <div className="text-sm text-gray-600">
            <p>Logged in as {user.role}</p>
          </div>
        </div>

        <Button onClick={onDisconnect} variant="destructive" className="bg-red-500 hover:bg-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
    </div>
  )
}
