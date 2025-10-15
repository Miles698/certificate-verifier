import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 font-sans">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700 text-center flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-white mb-8 tracking-wide">
          Welcome
        </h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg border-none cursor-pointer transition-colors duration-200 hover:bg-gray-700"
          >
            Admin Panel
          </button>

          <button
            onClick={() => navigate('/verify')}
            className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg border-none cursor-pointer transition-colors duration-200 hover:bg-red-700"
          >
            Verify Certificate
          </button>
        </div>
      </div>
    </div>
  )
}
