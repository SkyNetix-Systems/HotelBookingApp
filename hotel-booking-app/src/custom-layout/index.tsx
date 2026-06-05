'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import PrivateLayout from './private-layout'

function CustomLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Define private routes
  const privateRoutes = ['/owner', '/customer', '/admin']

  // Check if current path is a private route
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route))

  if (isPrivateRoute) {
    return <PrivateLayout>{children}</PrivateLayout>
  }

  // Public route - render children directly
  return <>{children}</>
}

export default CustomLayout