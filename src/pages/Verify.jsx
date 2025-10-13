import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Verify() {
  const [id, setId] = useState('')
  const navigate = useNavigate()

  function onSubmit(e) {
    e.preventDefault()
    if (!id) return alert('Enter certificate ID or URL')

    // Agar user ne full URL diya ho, sirf last segment extract karein
    const parsed = id.trim().split('/').pop()
    navigate(`/certificate/${parsed}`)
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Verify Certificate</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder="Enter Certificate ID or paste URL / scan QR"
          style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
        />
        <button type="submit" style={{ padding: 10, background: '#111827', color: 'white', borderRadius: 6 }}>
          Verify
        </button>
      </form>
      <p style={{ marginTop: 12, color: '#6b7280', fontSize: 14 }}>
        Tip: Scan the QR code on certificate or paste full URL
      </p>
    </div>
  )
}
