"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "../types"
import { blockchainService } from "../services/blockchain"

export const useWallet = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize blockchain service
  useEffect(() => {
    blockchainService.initialize().catch((err) => {
      setError(err.message)
    })
  }, [])

  // Check if already connected on mount
  useEffect(() => {
    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      console.log("Accounts changed:", accounts)
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnect()
      } else if (user && accounts[0].toLowerCase() !== user.address.toLowerCase()) {
        // Account changed, reconnect with new account
        connectWallet()
      }
    }

    const handleChainChanged = () => {
      // Reload page on network change
      window.location.reload()
    }

    const handleDisconnect = () => {
      console.log("MetaMask disconnected")
      disconnect()
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)
    window.ethereum.on("disconnect", handleDisconnect)

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
        window.ethereum.removeListener("disconnect", handleDisconnect)
      }
    }
  }, [user])

  const checkConnection = async () => {
    if (!window.ethereum) return

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        // User is already connected, restore connection
        await connectWallet()
      }
    } catch (error) {
      console.error("Error checking connection:", error)
    }
  }

  const connectWallet = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const connectedUser = await blockchainService.connectWallet()
      setUser(connectedUser)
    } catch (err: any) {
      setError(err.message)
      console.error("Wallet connection error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      // Method 1: Try to disconnect using wallet_requestPermissions (clears permissions)
      if (window.ethereum?.request) {
        try {
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
          })
        } catch (error) {
          // This might fail, but that's okay - it means permissions are cleared
          console.log("Permissions cleared or user cancelled")
        }
      }

      // Method 2: Clear app state
      blockchainService.disconnect()
      setUser(null)
      setError(null)

      // Method 3: Try to revoke permissions (newer MetaMask versions)
      if (window.ethereum?.request) {
        try {
          await window.ethereum.request({
            method: "wallet_revokePermissions",
            params: [{ eth_accounts: {} }],
          })
        } catch (error) {
          // This method might not be supported in all versions
          console.log("Revoke permissions not supported or failed")
        }
      }

      console.log("Wallet disconnected successfully")
    } catch (error) {
      console.error("Error during disconnect:", error)
      // Even if there's an error, clear the app state
      blockchainService.disconnect()
      setUser(null)
      setError(null)
    }
  }, [])

  return {
    user,
    isLoading,
    error,
    connectWallet,
    disconnect,
    isConnected: !!user?.isConnected,
  }
}
