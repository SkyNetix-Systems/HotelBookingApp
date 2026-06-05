'use client'

import React from 'react'

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary border-r-primary animate-spin"></div>
        </div>
        {/* Loading text */}
        <p className="text-gray-600 text-sm font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default Spinner