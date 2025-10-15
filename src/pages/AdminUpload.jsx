import React, { useState } from 'react'
import { collection, setDoc, doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'react-qr-code'
import { saveAs } from 'file-saver'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function AdminUpload() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const [name, setName] = useState('')
  const [program, setProgram] = useState('')
  const [mentor, setMentor] = useState('')
  const [duration, setDuration] = useState('')
  const [completiondate, setCompletionDate] = useState('')

  const [universityName, setUniversityName] = useState('')
  const [cgpa, setCgpa] = useState('')
  const [skills, setSkills] = useState('')
  const [internshipType, setInternshipType] = useState('')
  const [bio, setBio] = useState('')
  // const [headshot, setHeadshot] = useState(null)
  // const [portfolio, setPortfolio] = useState(null)
  const [generatedId, setGeneratedId] = useState(null)
  const [qrValue, setQrValue] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [adminMode, setAdminMode] = useState('menu') // 'menu' | 'create' | 'edit'
  const [editCertId, setEditCertId] = useState('')
  const [loadingExisting, setLoadingExisting] = useState(false)

  function resetForm() {
    setName('')
    setProgram('')
    setMentor('')
    setDuration('')
    setCompletionDate('')
    setUniversityName('')
    setCgpa('')
    setSkills('')
    setInternshipType('')
    setBio('')
    setGeneratedId(null)
    setQrValue(null)
    setEditCertId('')
  }

  function handleBack() {
    resetForm()
    setAdminMode('menu')
  }

  async function onLogin(e) {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setLoggedIn(true)
    } catch (err) {
      alert('Login failed: ' + err.message)
    }
  }

  async function onCreate(e) {
    e.preventDefault()
    if (!name || !program) return alert('Name and program required')
    setUploading(true)
    const certId = `IBT2025-${uuidv4().split('-')[0].toUpperCase()}`

    try {
      const docRef = doc(collection(db, 'User Data'), certId)
      await setDoc(docRef, {
        name,
        program,
        mentor,
        duration,
        completiondate,
        universityName,
        cgpa,
        skills,
        internshipType,
        bio,
        // headshotUrl,
        // portfolioUrl,
        status: 'Verified',
        issueDate: new Date().toISOString(),
      })

      const url = `${window.location.origin}/certificate/${certId}`
      setGeneratedId(certId)
      setQrValue(url)
    } catch (err) {
      console.error(err)
      alert('Error creating certificate: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  function downloadQR() {
    const canvas = document.getElementById('qr-canvas')
    if (!canvas) return alert('QR not ready')
    const svg = document.querySelector('#qr-render svg')
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    img.onload = function () {
      const canvasEl = document.createElement('canvas')
      canvasEl.width = img.width
      canvasEl.height = img.height
      const ctx = canvasEl.getContext('2d')
      ctx.drawImage(img, 0, 0)
      canvasEl.toBlob(function (blob) {
        saveAs(blob, `${generatedId}_qr.png`)
      })
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  async function loadExistingForEdit() {
    if (!editCertId) return alert('Enter a certificate ID')
    setLoadingExisting(true)
    try {
      const refDoc = doc(collection(db, 'User Data'), editCertId)
      const snap = await getDoc(refDoc)
      if (!snap.exists()) {
        alert('No certificate found for that ID')
        return
      }
      const data = snap.data()
      setName(data.name || '')
      setProgram(data.program || '')
      setMentor(data.mentor || '')
      setDuration(data.duration || '')
      setCompletionDate(data.completiondate || '')
      setUniversityName(data.universityName || '')
      setCgpa(data.cgpa || '')
      setSkills(data.skills || '')
      setInternshipType(data.internshipType || '')
      setBio(data.bio || '')
      setGeneratedId(editCertId)
      setQrValue(`${window.location.origin}/certificate/${editCertId}`)
      setAdminMode('edit')
    } catch (err) {
      console.error(err)
      alert('Failed to load certificate: ' + err.message)
    } finally {
      setLoadingExisting(false)
    }
  }

  async function onUpdate(e) {
    e.preventDefault()
    if (!editCertId) return alert('Missing certificate ID')
    if (!name || !program) return alert('Name and program required')
    setUploading(true)
    try {
      const refDoc = doc(collection(db, 'User Data'), editCertId)
      await setDoc(
        refDoc,
        {
          certId: editCertId,
          name,
          program,
          mentor,
          duration,
          completiondate,
          universityName,
          cgpa,
          skills,
          internshipType,
          bio,
          status: 'Verified',
        },
        { merge: true }
      )
      setGeneratedId(editCertId)
      setQrValue(`${window.location.origin}/certificate/${editCertId}`)
      alert('Certificate updated')
    } catch (err) {
      console.error(err)
      alert('Error updating certificate: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-gray-900 font-inter">
        <div className="bg-white p-10 rounded-xl w-full max-w-sm shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Admin Login
          </h2>
          <form onSubmit={onLogin} className="flex flex-col gap-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none text-base"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none text-base"
            />
            <button
              className="bg-gray-900 text-white rounded-lg py-3 font-semibold text-base hover:bg-gray-700 transition"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-gray-500 text-sm text-center">
            Authorized admin access only
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-16 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl mb-16">
        {adminMode === 'menu' && (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
              Admin Actions
            </h1>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  resetForm()
                  setAdminMode('create')
                }}
                className="bg-gray-900 text-white rounded-lg px-4 py-3 font-semibold hover:bg-gray-800 transition"
              >
                Create new certificate
              </button>
              <button
                onClick={() => {
                  setAdminMode('lookup')
                }}
                className="bg-red-500 text-white rounded-lg px-4 py-3 font-semibold hover:bg-red-600 transition"
              >
                Edit existing certificate
              </button>
            </div>
          </div>
        )}

        {adminMode === 'lookup' && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">
              Enter Certificate ID
            </h1>
            <div className="flex gap-3 justify-center">
              <input
                value={editCertId}
                onChange={(e) => setEditCertId(e.target.value)}
                placeholder="IBT2025-XXXX"
                className="px-3 py-2 border border-gray-300 rounded-lg text-base min-w-[260px]"
              />
              <button
                onClick={loadExistingForEdit}
                disabled={loadingExisting}
                className="bg-gray-900 text-white rounded-lg px-3 py-2 font-semibold hover:bg-gray-800 transition disabled:opacity-70"
              >
                {loadingExisting ? 'Loading…' : 'Load'}
              </button>
              <button
                onClick={handleBack}
                className="bg-gray-500 text-white rounded-lg px-3 py-2 font-semibold hover:bg-gray-600 transition"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {(adminMode === 'create' || adminMode === 'edit') && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
              {adminMode === 'create'
                ? 'Create Certificate'
                : `Edit Certificate (${generatedId || editCertId})`}
            </h1>

            <form
              onSubmit={adminMode === 'create' ? onCreate : onUpdate}
              className="flex flex-col gap-4"
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="p-3 border border-gray-300 rounded-lg text-base"
              />
              <input
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                placeholder="Program / Title"
                className="p-3 border border-gray-300 rounded-lg text-base"
              />
              <input
                value={mentor}
                onChange={(e) => setMentor(e.target.value)}
                placeholder="Mentor"
                className="p-3 border border-gray-300 rounded-lg text-base"
              />
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duration"
                className="p-3 border border-gray-300 rounded-lg text-base"
              />
              <input
                value={completiondate}
                onChange={(e) => setCompletionDate(e.target.value)}
                placeholder="Completion Date"
                className="p-3 border border-gray-300 rounded-lg text-base"
              />
              <input
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                placeholder="Name of University"
                className="p-3 border border-gray-300 rounded-lg text-base"
              />
              <input
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="Current CGPA"
                className="p-3 border border-gray-300 rounded-lg text-base"
              />
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Skills"
                className="p-3 border border-gray-300 rounded-lg text-base"
              />
              <input
                value={internshipType}
                onChange={(e) => setInternshipType(e.target.value)}
                placeholder="Internship Type"
                className="p-3 border border-gray-300 rounded-lg text-base"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short bio / notes"
                className="p-3 border border-gray-300 rounded-lg text-base min-h-[120px]"
              />

              {/*
              <div>
                <label className="block text-sm">Headshot (jpg/png)</label>
                <input type="file" accept="image/*" onChange={e => setHeadshot(e.target.files[0])} />
              </div>

              <div>
                <label className="block text-sm">Portfolio (pdf)</label>
                <input type="file" accept="application/pdf" onChange={e => setPortfolio(e.target.files[0])} />
              </div>
              */}

              <div className="flex gap-3 items-center">
                <button
                  disabled={uploading}
                  className="bg-gray-900 text-white rounded-lg py-3 px-4 font-semibold text-base hover:bg-gray-700 transition disabled:opacity-70"
                >
                  {adminMode === 'create'
                    ? uploading
                      ? 'Creating...'
                      : 'Create & Generate QR'
                    : uploading
                      ? 'Saving...'
                      : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-500 text-white rounded-lg py-3 px-4 font-semibold hover:bg-gray-600 transition"
                >
                  Back
                </button>
              </div>
            </form>
          </>
        )}

        {generatedId && (
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold mb-2">Generated</h3>
            <p>
              Certificate ID: <strong>{generatedId}</strong>
            </p>
            {/*<p>URL: <a href={qrValue} target="_blank" rel="noreferrer" className="text-red-500">{qrValue}</a></p>*/}
            <div className="mt-3 bg-white p-3 inline-block rounded-lg shadow-md">
              <div id="qr-render">
                <QRCode value={qrValue} size={200} />
              </div>
            </div>

            <div className="mt-3">
              <button
                onClick={downloadQR}
                className="border border-gray-200 rounded-md px-4 py-2 bg-white hover:bg-gray-100 transition"
              >
                Download QR (PNG)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
