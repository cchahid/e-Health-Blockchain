"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Activity } from "lucide-react"

interface WalletConnectProps {
  onConnect: () => void
  isLoading: boolean
  error?: string | null
}

export const WalletConnect = ({ onConnect, isLoading, error }: WalletConnectProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <Card className="text-center shadow-lg">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">e-Health DApp</CardTitle>
            <CardDescription className="text-base text-gray-600">Medical Records on Blockchain</CardDescription>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Button
              onClick={onConnect}
              disabled={isLoading}
              className="w-full py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
