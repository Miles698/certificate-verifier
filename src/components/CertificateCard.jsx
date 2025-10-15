import React from 'react'

export default function CertificateCard({ data }) {
  if (!data) return null

  const labelStyle = {
    fontWeight: 600,
    color: '#111827',
    marginRight: 6,
  }

  const valueStyle = {
    color: '#374151',
  }

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 16,
        padding: 32,
        background: '#fff',
        maxWidth: 750,
        margin: '40px auto',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          borderBottom: '1px solid #f3f4f6',
          paddingBottom: 16,
        }}
      >
        {data.headshotUrl && (
          <img
            src={data.headshotUrl}
            alt="headshot"
            style={{
              width: 110,
              height: 110,
              objectFit: 'cover',
              borderRadius: '50%',
              border: '3px solid #f3f4f6',
            }}
          />
        )}
        <div>
          <p style={{ ...labelStyle, fontSize: 20 }}>
            Name:{' '}
            <span style={{ ...valueStyle, fontWeight: 700 }}>
              {data.name || '—'}
            </span>
          </p>
          <p style={{ ...labelStyle }}>
            Program:{' '}
            <span style={valueStyle}>{data.program || '—'}</span>
          </p>
          <p style={{ ...labelStyle }}>
            Mentor:{' '}
            <span style={valueStyle}>{data.mentor || '—'}</span>
          </p>
          <p style={{ ...labelStyle }}>
            Duration:{' '}
            <span style={valueStyle}>{data.duration || '—'}</span>
          </p>
          <p style={{ ...labelStyle }}>
            Internship Type:{' '}
            <span style={valueStyle}>{data.internshipType || '—'}</span>
          </p>
          <p style={{ ...labelStyle }}>
            Completion Date:{' '}
            <span style={valueStyle}>{data.completiondate || '—'}</span>
          </p>
        </div>
      </div>

      {/* University Section */}
      <div style={{ marginTop: 24 }}>
        <h3
          style={{
            fontWeight: 700,
            fontSize: 18,
            marginBottom: 10,
            color: '#111827',
            borderBottom: '1px solid #f3f4f6',
            paddingBottom: 6,
          }}
        >
          University Details
        </h3>
        <p>
          <span style={labelStyle}>University:</span>
          <span style={valueStyle}>{data.universityName || '—'}</span>
        </p>
        <p>
          <span style={labelStyle}>CGPA:</span>
          <span style={valueStyle}>{data.cgpa || '—'}</span>
        </p>
        <p>
          <span style={labelStyle}>Skills:</span>
          <span style={valueStyle}>{data.skills || '—'}</span>
        </p>
      </div>

      {/* About Section */}
      <div style={{ marginTop: 24 }}>
        <h3
          style={{
            fontWeight: 700,
            fontSize: 18,
            marginBottom: 10,
            color: '#111827',
            borderBottom: '1px solid #f3f4f6',
            paddingBottom: 6,
          }}
        >
          About
        </h3>
        <p
          style={{
            whiteSpace: 'pre-wrap',
            color: '#374151',
            lineHeight: 1.6,
          }}
        >
          {data.bio || '—'}
        </p>
      </div>

      {/* Portfolio */}
      {data.portfolioUrl && (
        <div style={{ marginTop: 16 }}>
          <a
            href={data.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#ef4444',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            🔗 View Portfolio
          </a>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: 28,
          paddingTop: 12,
          borderTop: '1px solid #f3f4f6',
          color: '#6b7280',
          fontSize: 14,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <span>
          <strong>Status:</strong> {data.status || 'Verified'}
        </span>
        {data.issueDate && (
          <span>
            <strong>Issued:</strong>{' '}
            {new Date(data.issueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}
