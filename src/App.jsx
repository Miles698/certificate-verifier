import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Verify from './pages/Verify'
import Certificate from './pages/Certificate'
import AdminUpload from './pages/AdminUpload'


export default function App(){
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header style={{borderBottom:'1px solid #e5e7eb'}} className="max-w-5xl mx-auto p-6 flex justify-between items-center">
        <div>
          <Link to="/" style={{fontWeight:600}}>Aykays — Certificate Verifier</Link>
        </div>
        <nav>
          <Link to="/admin" className="ml-4 text-sm">Admin</Link>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Verify/>} />
          <Route path="/certificate/:id" element={<Certificate/>} />
          <Route path="/admin" element={<AdminUpload/>} />
        </Routes>
      </main>
    </div>
  )
}
