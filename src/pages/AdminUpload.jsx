// src/pages/AdminUpload.jsx
import React, { useState, useRef } from 'react'
import { collection, setDoc, doc } from 'firebase/firestore'
import { db, storage, auth } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'react-qr-code'
import { saveAs } from 'file-saver'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { PDFDownloadLink } from '@react-pdf/renderer'
import CertificatePDF from '../components/CertificatePDF'
import CertificateCard from '../components/CertificateCard'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'

export default function AdminUpload() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const [name, setName] = useState('')
  const [program, setProgram] = useState('')
  const [mentor, setMentor] = useState('Arsal Khan')
  const [duration, setDuration] = useState('July 2025 - September 2025')
  const [bio, setBio] = useState('')
  const [headshot, setHeadshot] = useState(null)
  const [portfolio, setPortfolio] = useState(null)

  const [headshotPreview, setHeadshotPreview] = useState(null)
  const [portfolioName, setPortfolioName] = useState('')

  const [generatedId, setGeneratedId] = useState(null)
  const [qrValue, setQrValue] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [headshotUrl, setHeadshotUrl] = useState(null)
  const [portfolioUrl, setPortfolioUrl] = useState(null)

  const qrRef = useRef(null)

  // Admin Login
  async function onLogin(e) {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setLoggedIn(true)
      toast.success('Login successful!')
    } catch (err) {
      toast.error('Login failed: ' + err.message)
    }
  }

  // Certificate creation
  async function onCreate(e) {
    e.preventDefault()
    if (!name || !program) return toast.warning('Name and program required')
    setUploading(true)

    const certId = `IBT2025-${uuidv4().split('-')[0].toUpperCase()}`

    try {
      let hUrl = null
      let pUrl = null

      if (headshot) {
        const href = ref(storage, `headshots/${certId}_${headshot.name}`)
        await uploadBytes(href, headshot)
        hUrl = await getDownloadURL(href)
        setHeadshotUrl(hUrl)
      }
      if (portfolio) {
        const pref = ref(storage, `portfolios/${certId}_${portfolio.name}`)
        await uploadBytes(pref, portfolio)
        pUrl = await getDownloadURL(pref)
        setPortfolioUrl(pUrl)
      }

      const docRef = doc(collection(db, 'certificates'), certId)
      await setDoc(docRef, {
        name,
        program,
        mentor,
        duration,
        bio,
        headshotUrl: hUrl,
        portfolioUrl: pUrl,
        status: 'Verified',
        issueDate: new Date().toISOString(),
      })

      const url = `${window.location.origin}/certificate/${certId}`
      setGeneratedId(certId)
      setQrValue(url)
      toast.success('Certificate created successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Error creating certificate: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  // QR download as PNG
  function downloadQR() {
    if (!qrRef.current) return toast.error('QR not ready')
    const svg = qrRef.current.querySelector('svg')
    if (!svg) return toast.error('QR not ready')
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    img.onload = function () {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(function (blob) {
        saveAs(blob, `${generatedId}_qr.png`)
        toast.success('QR downloaded successfully!')
      })
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  function handleHeadshotChange(file) {
    setHeadshot(file)
    if (file) setHeadshotPreview(URL.createObjectURL(file))
  }

  function handlePortfolioChange(file) {
    setPortfolio(file)
    if (file) setPortfolioName(file.name)
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 to-gray-800 p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 bg-gray-900 rounded-3xl shadow-2xl border border-gray-700"
        >
          <h2 className="text-3xl font-bold mb-6 text-white text-center">Admin Login</h2>
          <form onSubmit={onLogin} className="space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              className="w-full p-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white hover:scale-105 transition-transform shadow-lg"
            >
              Login
            </button>
          </form>
        </motion.div>
        <ToastContainer position="top-right" autoClose={2500} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-6">
      <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
        Create Certificate
      </h1>

      <motion.form
        onSubmit={onCreate}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-3xl shadow-2xl space-y-4 border border-gray-700"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full p-3 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          required
        />
        <input
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          placeholder="Program / Title"
          className="w-full p-3 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          required
        />
        <input
          value={mentor}
          onChange={(e) => setMentor(e.target.value)}
          placeholder="Mentor"
          className="w-full p-3 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration"
          className="w-full p-3 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Short bio / notes"
          className="w-full p-3 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1 text-gray-300">Headshot (jpg/png)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleHeadshotChange(e.target.files[0])}
            />
            {headshotPreview && (
              <motion.img
                src={headshotPreview}
                alt="preview"
                className="mt-2 w-24 h-24 object-cover rounded-full border-2 border-purple-500"
                whileHover={{ scale: 1.1 }}
              />
            )}
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-gray-300">Portfolio (pdf)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handlePortfolioChange(e.target.files[0])}
            />
            {portfolioName && <p className="mt-1 text-gray-400">Selected: {portfolioName}</p>}
          </div>
        </div>

        <button
          disabled={uploading}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition-transform"
        >
          {uploading ? 'Uploading...' : 'Create & Generate QR'}
        </button>
      </motion.form>

      {/* Generated Certificate Section */}
      {generatedId && qrValue && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mt-10 flex flex-col items-center gap-6"
        >
          <CertificateCard
            data={{
              id: generatedId,
              name,
              program,
              mentor,
              duration,
              bio,
              headshotUrl,
              portfolioUrl,
              status: 'Verified'
            }}
            qrUrl={qrValue}
          />

          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <div ref={qrRef} className="p-4 bg-gray-800 rounded-2xl shadow-lg border border-purple-500">
              <QRCode value={qrValue} size={160} />
            </div>

            <button
              onClick={downloadQR}
              className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-500 hover:text-white transition"
            >
              Download QR
            </button>

            <PDFDownloadLink
              document={
                <CertificatePDF
                  data={{
                    name,
                    program,
                    mentor,
                    duration,
                    bio,
                    headshotUrl,
                    portfolioUrl,
                    status: 'Verified'
                  }}
                  qrUrl={qrValue}
                />
              }
              fileName={`${generatedId}_certificate.pdf`}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition-transform"
            >
              {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF')}
            </PDFDownloadLink>

            <button
              onClick={() => {
                navigator.clipboard.writeText(qrValue)
                toast.success('Certificate URL copied!')
              }}
              className="px-6 py-3 border border-pink-500 rounded-xl hover:bg-pink-500 hover:text-white transition"
            >
              Copy URL
            </button>
          </div>
        </motion.div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
