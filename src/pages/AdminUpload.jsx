import React, {useState} from 'react'
import { collection, setDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
//import { db, storage, auth } from '../firebase'
import { db, auth } from '../firebase'
//import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'react-qr-code'
import { saveAs } from 'file-saver'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function AdminUpload(){
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
  //  const [headshot, setHeadshot] = useState(null)
  //  const [portfolio, setPortfolio] = useState(null)
  const [generatedId, setGeneratedId] = useState(null)
  const [qrValue, setQrValue] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [adminMode, setAdminMode] = useState('menu') // 'menu' | 'create' | 'edit'
  const [editCertId, setEditCertId] = useState('')
  const [loadingExisting, setLoadingExisting] = useState(false)

  function resetForm(){
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

  function handleBack(){
    resetForm()
    setAdminMode('menu')
  }

  async function onLogin(e){
    e.preventDefault()
    try{
      await signInWithEmailAndPassword(auth, email, password)
      setLoggedIn(true)
    }catch(err){
      alert('Login failed: '+err.message)
    }
  }

  async function onCreate(e){
    e.preventDefault()
    if(!name || !program) return alert('Name and program required')
    setUploading(true)
    const certId = `IBT2025-${uuidv4().split('-')[0].toUpperCase()}`

    //let headshotUrl = null
    //let portfolioUrl = null

    try{
      //      if(headshot){
      //        const href = ref(storage, `headshots/${certId}_${headshot.name}`)
      //        await uploadBytes(href, headshot)
      //        headshotUrl = await getDownloadURL(href)
      //      }
      //      if(portfolio){
      //        const pref = ref(storage, `portfolios/${certId}_${portfolio.name}`)
      //        await uploadBytes(pref, portfolio)
      //        portfolioUrl = await getDownloadURL(pref)
      //      }

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
        //      headshotUrl,
        //      portfolioUrl,
        status: 'Verified',
        issueDate: new Date().toISOString()
      })

      const url = `${window.location.origin}/certificate/${certId}`
      setGeneratedId(certId)
      setQrValue(url)
    }catch(err){
      console.error(err)
      alert('Error creating certificate: '+err.message)
    }finally{
      setUploading(false)
    }
  }

  function downloadQR(){
    const canvas = document.getElementById('qr-canvas')
    if(!canvas) return alert('QR not ready')
    // convert SVG to PNG using canvas
    const svg = document.querySelector('#qr-render svg')
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'})
    const url = URL.createObjectURL(svgBlob)
    img.onload = function(){
      const canvasEl = document.createElement('canvas')
      canvasEl.width = img.width
      canvasEl.height = img.height
      const ctx = canvasEl.getContext('2d')
      ctx.drawImage(img,0,0)
      canvasEl.toBlob(function(blob){
        saveAs(blob, `${generatedId}_qr.png`)
      })
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  async function loadExistingForEdit(){
    if(!editCertId) return alert('Enter a certificate ID')
    setLoadingExisting(true)
    try{
      const refDoc = doc(collection(db, 'User Data'), editCertId)
      const snap = await getDoc(refDoc)
      if(!snap.exists()){
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
    }catch(err){
      console.error(err)
      alert('Failed to load certificate: '+err.message)
    }finally{
      setLoadingExisting(false)
    }
  }

  async function onUpdate(e){
    e.preventDefault()
    if(!editCertId) return alert('Missing certificate ID')
    if(!name || !program) return alert('Name and program required')
    setUploading(true)
    try{
      const refDoc = doc(collection(db, 'User Data'), editCertId)
      await setDoc(refDoc, {
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
      }, { merge: true })
      setGeneratedId(editCertId)
      setQrValue(`${window.location.origin}/certificate/${editCertId}`)
      alert('Certificate updated')
    }catch(err){
      console.error(err)
      alert('Error updating certificate: '+err.message)
    }finally{
      setUploading(false)
    }
  }

  if(!loggedIn){
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1f2937, #111827)',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}>
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '1.5rem',
            color: '#111827'
          }}>Admin Login</h2>
          <form onSubmit={onLogin} className="space-y-3" style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            <input 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="Admin email" 
              className="w-full p-2 border rounded"
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '1rem',
              }}
            />
            <input 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              placeholder="Password" 
              className="w-full p-2 border rounded"
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '1rem',
              }}
            />
            <button 
              className="px-3 py-2"
              style={{
                background: '#111827',
                color: 'white',
                borderRadius: '8px',
                padding: '0.75rem',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#374151'}
              onMouseOut={e => e.currentTarget.style.background = '#111827'}
            >
              Login
            </button>
          </form>
          {/*<p style={{marginTop:12, color:'#6b7280'}}>Create the admin user via Firebase Console (Authentication → Users)</p>*/}
          <p style={{
            marginTop: '1rem',
            color: '#6b7280',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            Authorized admin access only
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f3f4f6',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '4rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem 2.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '750px',
        marginBottom: '4rem'
      }}>
        {adminMode === 'menu' && (
          <div>
            <h1 style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              textAlign: 'center',
              color: '#111827'
            }}>Admin Actions</h1>
            <div style={{display:'flex', gap:'1rem', justifyContent:'center'}}>
              <button onClick={()=>{ resetForm(); setAdminMode('create') }}
                style={{
                  background:'#111827', color:'#fff', borderRadius:'8px', padding:'0.75rem 1rem', fontWeight:600, cursor:'pointer'
                }}>Create new certificate</button>
              <button onClick={()=>{ setAdminMode('lookup'); }}
                style={{
                  background:'#ef4444', color:'#fff', borderRadius:'8px', padding:'0.75rem 1rem', fontWeight:600, cursor:'pointer'
                }}>Edit existing certificate</button>
            </div>
          </div>
        )}

        {adminMode === 'lookup' && (
          <div>
            <h1 style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              marginBottom: '1rem',
              textAlign: 'center',
              color: '#111827'
            }}>Enter Certificate ID</h1>
            <div style={{display:'flex', gap:'0.75rem', justifyContent:'center'}}>
              <input value={editCertId} onChange={e=>setEditCertId(e.target.value)} placeholder="IBT2025-XXXX"
                style={{ padding:'0.6rem 0.75rem', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'1rem', minWidth:'260px' }} />
              <button onClick={loadExistingForEdit}
                disabled={loadingExisting}
                style={{ background:'#111827', color:'#fff', borderRadius:'8px', padding:'0.6rem 0.9rem', fontWeight:600, cursor:'pointer' }}>
                {loadingExisting ? 'Loading…' : 'Load'}
              </button>
              <button onClick={handleBack}
                style={{ background:'#6b7280', color:'#fff', borderRadius:'8px', padding:'0.6rem 0.9rem', fontWeight:600, cursor:'pointer' }}>
                Back
              </button>
            </div>
          </div>
        )}

        {(adminMode === 'create' || adminMode === 'edit') && (
          <h1 style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            textAlign: 'center',
            color: '#111827'
          }}>{adminMode === 'create' ? 'Create Certificate' : `Edit Certificate (${generatedId || editCertId})`}</h1>
        )}

        {(adminMode === 'create' || adminMode === 'edit') && (
        <form onSubmit={adminMode === 'create' ? onCreate : onUpdate} className="space-y-3" style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-2 border rounded"
            style={{
              padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'1rem'
            }} />
          <input value={program} onChange={e=>setProgram(e.target.value)} placeholder="Program / Title" className="w-full p-2 border rounded"
            style={{
              padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'1rem'
            }} />
          <input value={mentor} onChange={e=>setMentor(e.target.value)} placeholder="Mentor" className="w-full p-2 border rounded"
            style={{
              padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'1rem'
            }} />
          <input value={duration} onChange={e=>setDuration(e.target.value)} placeholder="Duration" className="w-full p-2 border rounded"
            style={{
              padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'1rem'
            }} />
          <input value={completiondate} onChange={e=>setCompletionDate(e.target.value)} placeholder="Completion Date" className="w-full p-2 border rounded"
            style={{
              padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'1rem'
            }} /> 
          <input value={universityName} onChange={e=>setUniversityName(e.target.value)} placeholder="Name of University" className="w-full p-2 border rounded"
            style={{
              padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'1rem'
            }} />
          <input value={cgpa} onChange={e=>setCgpa(e.target.value)} placeholder="Current CGPA" className="w-full p-2 border rounded"
            style={{
              padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'1rem'
            }} />
            <input value={skills} onChange={e=>setSkills(e.target.value)} placeholder="Skills" className="w-full p-2 border rounded"
            style={{
              padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'1rem'
            }} />
          <input value={internshipType} onChange={e=>setInternshipType(e.target.value)} placeholder="Internship Type" className="w-full p-2 border rounded"
            style={{
              padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'1rem'
            }} />
          <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Short bio / notes" className="w-full p-2 border rounded"
            style={{
              padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'1rem', minHeight:'120px'
            }} />
{/*
          <div>
            <label className="block text-sm">Headshot (jpg/png)</label>
            <input type="file" accept="image/*" onChange={e=>setHeadshot(e.target.files[0])} />
         </div>

          <div>
            <label className="block text-sm">Portfolio (pdf)</label>
            <input type="file" accept="application/pdf" onChange={e=>setPortfolio(e.target.files[0])} />
          </div>
*/}
          <div style={{display:'flex', gap:'0.75rem', alignItems:'center'}}>
          <button disabled={uploading} className="px-4 py-2" 
            style={{
              background:'#111827',
              color:'white',
              borderRadius:'8px',
              padding:'0.75rem',
              fontWeight:600,
              fontSize:'1rem',
              cursor:'pointer',
              transition:'background 0.2s ease'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#374151'}
            onMouseOut={e => e.currentTarget.style.background = '#111827'}
          >
            {adminMode === 'create' ? (uploading ? 'Creating...' : 'Create & Generate QR') : (uploading ? 'Saving...' : 'Save changes')}
          </button>
          <button type="button" onClick={handleBack}
            style={{
              background:'#6b7280', color:'#fff', borderRadius:'8px', padding:'0.75rem 1rem', fontWeight:600, cursor:'pointer'
            }}>Back</button>
          </div>
        </form>
        )}

        {generatedId && (
          <div style={{
            marginTop:'2rem',
            background:'#f9fafb',
            border:'1px solid #e5e7eb',
            borderRadius:'10px',
            padding:'1.5rem'
          }}>
            <h3 style={{fontWeight:700, marginBottom:'0.5rem'}}>Generated</h3>
            <p>Certificate ID: <strong>{generatedId}</strong></p>
            {/*<p>URL: <a href={qrValue} target="_blank" rel="noreferrer" style={{color:'#ef4444'}}>{qrValue}</a></p>*/}

            <div style={{marginTop:12, background:'#fff', padding:12, display:'inline-block', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
              <div id="qr-render"><QRCode value={qrValue} size={200} /></div>
            </div>

            <div style={{marginTop:12}}>
              <button onClick={downloadQR} className="px-3 py-1" style={{
                border:'1px solid #e5e7eb',
                borderRadius:'6px',
                padding:'0.5rem 1rem',
                background:'#fff',
                cursor:'pointer',
                transition:'all 0.2s ease'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'}
              onMouseOut={e => e.currentTarget.style.background = '#fff'}
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