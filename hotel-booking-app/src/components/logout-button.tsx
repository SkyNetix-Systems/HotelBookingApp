'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { logoutUser } from '@/actions/users'
import { useUsersStore } from '@/store/users-store'

interface LogoutButtonProps {
  className?: string
  children?: React.ReactNode
}

function LogoutButton({ className = "bg-red-600 hover:bg-red-700 text-white", children }: LogoutButtonProps) {
  const router = useRouter()
  const { setLoggedInUser } = useUsersStore()

  const handleLogout = async () => {
    try {
      const result = await logoutUser()
      if (result.success) {
        // Clear user data from store
        setLoggedInUser(null)
        router.push('/login')
      } else {
        console.error('Logout failed:', result.message)
      }
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      className={className}
    >
      {children || 'Logout'}
    </Button>
  )
}

export default LogoutButton