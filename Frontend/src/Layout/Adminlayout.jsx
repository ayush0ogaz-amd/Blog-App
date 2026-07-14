import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Dashboard/Sidebar'
import Footer from '../Components/Footer'
import { useSelector } from 'react-redux'


export default function Adminlayout() {
  const user=useSelector((state)=>state.auth.user)

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  return (
    <>
    <Navbar/>
      <main className="dashboard-shell">
        <Sidebar />
        <div className="content flex-grow-1 p-4">
        
    <Outlet/>
       
      </div>
    </main>
    <Footer />
    
    
    
    </>
  )
}
