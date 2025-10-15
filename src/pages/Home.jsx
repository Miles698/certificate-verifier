import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

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
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '2rem',
          letterSpacing: '0.025em'
        }}>
          Welcome
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={() => navigate('/admin')}
            style={{
              width: '100%',
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
            Admin Panel
          </button>

          <button
            onClick={() => navigate('/verify')}
            style={{
              width: '100%',
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
            Verify Certificate
          </button>
        </div>
      </div>
    </div>
  )
}
