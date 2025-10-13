// src/components/CertificatePDF.jsx
import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica'
  },
  container: {
    border: '2px solid #111827',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  headshot: { width: 80, height: 80, borderRadius: 40, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 16 },
  section: { fontSize: 14, marginBottom: 8, width: '100%' },
  qr: { width: 100, height: 100, position: 'absolute', bottom: 24, right: 24 }
})

export default function CertificatePDF({ data, qrUrl }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Headshot */}
          {data.headshotUrl && <Image src={data.headshotUrl} style={styles.headshot} />}

          {/* Name & Program */}
          <Text style={styles.title}>{data.name}</Text>
          <Text style={styles.subtitle}>{data.program}</Text>

          {/* Mentor & Duration */}
          <Text style={styles.section}>Mentor: {data.mentor}</Text>
          <Text style={styles.section}>Duration: {data.duration}</Text>

          {/* Bio */}
          <Text style={styles.section}>Bio: {data.bio}</Text>

          {/* Status */}
          <Text style={styles.section}>Status: {data.status || 'Verified'}</Text>

          {/* QR Code */}
          {qrUrl && <Image src={qrUrl} style={styles.qr} />}
        </View>
      </Page>
    </Document>
  )
}
