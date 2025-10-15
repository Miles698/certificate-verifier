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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#111827',
      padding: '1rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        background: '#1f2937',
        padding: '2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '28rem',
        border: '1px solid #374151',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '1.5rem',
          letterSpacing: '0.025em'
        }}>
          Verify Certificate
        </h1>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            value={id}
            onChange={e => setId(e.target.value)}
            placeholder="Enter Certificate ID or scan QR code"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#374151',
              color: 'white',
              border: '1px solid #4b5563',
              borderRadius: '0.5rem',
              outline: 'none',
              fontSize: '1rem'
            }}
          />

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: '#dc2626',
                color: 'white',
                fontWeight: '600',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={e => e.target.style.background = '#b91c1c'}
              onMouseOut={e => e.target.style.background = '#dc2626'}
            >
              Verify
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: '#4b5563',
                color: 'white',
                fontWeight: '600',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={e => e.target.style.background = '#374151'}
              onMouseOut={e => e.target.style.background = '#4b5563'}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
