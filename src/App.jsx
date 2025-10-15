import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Verify from './pages/Verify'
import Certificate from './pages/Certificate'
import AdminUpload from './pages/AdminUpload'

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/verify" element={<Verify/>} />
      <Route path="/certificate/:id" element={
        <div className="min-h-screen bg-white text-gray-900">
          <main className="max-w-5xl mx-auto p-6">
            <Certificate/>
          </main>
        </div>
      } />
      <Route path="/admin" element={<AdminUpload/>} />
    </Routes>
  )
}
