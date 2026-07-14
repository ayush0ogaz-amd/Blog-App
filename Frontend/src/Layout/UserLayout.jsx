import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Components/Navbar'

export default function UserLayout() {
  return (
    <>
      {/* ==========================================
          GLOBAL CORE APPLICAION NAVIGATION LAYOUT
         ========================================== */}
      <Navbar />

      {/* ==========================================
          NESTED USER ROUTE COMPONENT VIEWPORT
         ========================================== */}
      <Outlet />
    </>
  )
}
