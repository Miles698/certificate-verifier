// src/components/CertificateCard.jsx
import React from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import CertificatePDF from './CertificatePDF'
import QRCode from 'react-qr-code'

export default function CertificateCard({ data, qrUrl }) {
  return (
    <div className="bg-white p-6 rounded shadow border border-gray-200 max-w-2xl mx-auto mt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {data.headshotUrl && (
          <img
            src={data.headshotUrl}
            alt="headshot"
            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full"
          />
        )}
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold">{data.name}</h2>
          <p className="text-gray-600">{data.program}</p>
          <p className="mt-1">Mentor: {data.mentor}</p>
          <p>Duration: {data.duration}</p>
        </div>
      </div>

      {/* About / Bio */}
      <div className="mt-4">
        <h3 className="font-semibold">About</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{data.bio}</p>
      </div>

      {/* Portfolio */}
      {data.portfolioUrl && (
        <div className="mt-2">
          <a
            href={data.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="text-red-500 underline"
          >
            View portfolio
          </a>
        </div>
      )}

      {/* Status */}
      <div className="mt-2 text-gray-500">Status: {data.status || 'Verified'}</div>

      {/* QR Code + PDF Download */}
      {qrUrl && (
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="inline-block p-2 bg-gray-50 rounded">
            <QRCode value={qrUrl} size={140} />
          </div>

          <PDFDownloadLink
            document={<CertificatePDF data={data} qrUrl={qrUrl} />}
            fileName={`${data.id || 'certificate'}_certificate.pdf`}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900 transition text-center"
          >
            {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF Certificate')}
          </PDFDownloadLink>
        </div>
      )}
    </div>
  )
}
