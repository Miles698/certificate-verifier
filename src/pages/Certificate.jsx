import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import CertificateCard from '../components/CertificateCard'

export default function Certificate() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qrUrl, setQrUrl] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const ref = doc(db, 'certificates', id)
      const snap = await getDoc(ref)
      if (!snap.exists()) {
        setData(null)
      } else {
        const certData = { id: snap.id, ...snap.data() }
        setData(certData)

        // QR code ke liye URL
        const url = `${window.location.origin}/certificate/${snap.id}`
        setQrUrl(url)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <p>Loading…</p>
  if (!data) return <p>Certificate not found or invalid ID.</p>

  return <CertificateCard data={data} qrUrl={qrUrl} />
}
