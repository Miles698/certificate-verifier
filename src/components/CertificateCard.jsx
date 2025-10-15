import React from 'react'

export default function CertificateCard({ data }) {
  if (!data) return null

  return (
    <div
      className="border border-gray-200 rounded-2xl p-8 bg-white max-w-[750px] mx-auto mt-10 shadow-[0_6px_20px_rgba(0,0,0,0.08)] font-[Inter,sans-serif]"
    >
      {/* Header Section */}
      <div className="flex gap-6 items-center border-b border-gray-100 pb-4">
        {data.headshotUrl && (
          <img
            src={data.headshotUrl}
            alt="headshot"
            className="w-[110px] h-[110px] object-cover rounded-full border-[3px] border-gray-100"
          />
        )}
        <div>
          <p className="font-semibold text-gray-900 text-[20px]">
            Name:{' '}
            <span className="text-gray-700 font-bold">
              {data.name || '—'}
            </span>
          </p>
          <p className="font-semibold text-gray-900">
            Program:{' '}
            <span className="text-gray-700">{data.program || '—'}</span>
          </p>
          <p className="font-semibold text-gray-900">
            Mentor:{' '}
            <span className="text-gray-700">{data.mentor || '—'}</span>
          </p>
          <p className="font-semibold text-gray-900">
            Duration:{' '}
            <span className="text-gray-700">{data.duration || '—'}</span>
          </p>
          <p className="font-semibold text-gray-900">
            Internship Type:{' '}
            <span className="text-gray-700">
              {data.internshipType || '—'}
            </span>
          </p>
          <p className="font-semibold text-gray-900">
            Completion Date:{' '}
            <span className="text-gray-700">
              {data.completiondate || '—'}
            </span>
          </p>
        </div>
      </div>

      {/* University Section */}
      <div className="mt-6">
        <h3 className="font-bold text-[18px] mb-2.5 text-gray-900 border-b border-gray-100 pb-1.5">
          University Details
        </h3>
        <p>
          <span className="font-semibold text-gray-900 mr-1.5">University:</span>
          <span className="text-gray-700">{data.universityName || '—'}</span>
        </p>
        <p>
          <span className="font-semibold text-gray-900 mr-1.5">CGPA:</span>
          <span className="text-gray-700">{data.cgpa || '—'}</span>
        </p>
        <p>
          <span className="font-semibold text-gray-900 mr-1.5">Skills:</span>
          <span className="text-gray-700">{data.skills || '—'}</span>
        </p>
      </div>

      {/* About Section */}
      <div className="mt-6">
        <h3 className="font-bold text-[18px] mb-2.5 text-gray-900 border-b border-gray-100 pb-1.5">
          About
        </h3>
        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {data.bio || '—'}
        </p>
      </div>

      {/* Portfolio */}
      {data.portfolioUrl && (
        <div className="mt-4">
          <a
            href={data.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="text-red-500 font-semibold no-underline"
          >
            🔗 View Portfolio
          </a>
        </div>
      )}

      {/* Footer */}
      <div className="mt-7 pt-3 border-t border-gray-100 text-gray-500 text-sm flex justify-between flex-wrap">
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
