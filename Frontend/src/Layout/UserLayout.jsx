import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

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
      <main className="site-main"><Outlet /></main>
      <Footer />
    </>
  )
}
