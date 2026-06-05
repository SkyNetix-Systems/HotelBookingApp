import { UsersStore, useUsersStore } from '@/store/users-store';
import { Menu } from 'lucide-react';
import React, { useState } from 'react'
import SidebarMenu from '@/components/sidebar-menu'

function Header() {
  const {loggedInUser}:UsersStore = useUsersStore();
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div className='flex justify-between items-center bg-primary px-7 py-6'>
          <h1 className="text-xl font-bold text-white">
              Next-Hotels
          </h1>

          <div className='flex gap-5 items-center'>
            <h1 className="text-m text-white text-sm">
              {loggedInUser?.name} ({loggedInUser?.role})
            </h1>
            <Menu
              size={14}
              className='text-white cursor-pointer text-sm'
              onClick={() => setSidebarOpen(true)}
            />
          </div>
      </div>

      <SidebarMenu
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
    </>
  )
}

export default Header