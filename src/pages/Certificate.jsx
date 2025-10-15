import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import CertificateCard from '../components/CertificateCard'

export default function Certificate(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      setLoading(true)
      try{
        const ref = doc(db, 'User Data', id)
        const snap = await getDoc(ref)
        if(!snap.exists()){
          setData(null)
        } else {
          setData({ id: snap.id, ...snap.data() })
        }
      }catch(e){
        console.error(e)
        setData(null)
      }finally{
        setLoading(false)
      }
    }
    load()
  },[id])

  if(loading) return <p>Loading…</p>
  if(!data) return <p>Certificate not found or invalid ID.</p>

  return <CertificateCard data={data} />
}
