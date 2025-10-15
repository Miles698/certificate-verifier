import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Verify() {
  const [id, setId] = useState('')
  const navigate = useNavigate()

  function onSubmit(e) {
    e.preventDefault()
    if (!id) return alert('Enter certificate ID or QR code')
    const parsed = id.trim().split('/').pop()
    navigate(`/certificate/${parsed}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 font-[Inter]">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 text-center flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-white mb-6 tracking-wide">
          Verify Certificate
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            value={id}
            onChange={e => setId(e.target.value)}
            placeholder="Enter Certificate ID or scan QR code"
            className="w-[100%] mx-auto p-3 bg-gray-700 text-white border border-gray-600 rounded-lg outline-none text-base placeholder-gray-300 focus:ring-2 focus:ring-red-600"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-lg border-none cursor-pointer transition-colors duration-200 hover:bg-red-700"
            >
              Verify
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-3 px-4 bg-gray-600 text-white font-semibold rounded-lg border-none cursor-pointer transition-colors duration-200 hover:bg-gray-700"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
