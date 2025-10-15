# aykays-verifier

A React + Firebase certificate verification app tailored for Aykays.

**Theme:** aykays.com white/black/gray with red accent  
**Auth:** Firebase Auth (email/password) for admin  
**QR output:** Downloadable PNG per certificate  
**Public URL pattern:** certificates.aykays.com/cert/{CERT_ID}

## Quick start

1. Copy `.env.example` to `.env.local` and fill your Firebase credentials.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Build and deploy to Firebase Hosting:
   ```bash
   npm run build
   npm i -g firebase-tools
   firebase login
   firebase init hosting
   # set public directory -> dist
   firebase deploy --only hosting
   ```

## Notes
- Admin routes require Firebase Auth. Create an admin user via Firebase Console (Authentication -> Users).
- Public certificate pages are readable without auth.
- After creating a certificate, admin can download a QR PNG which points to the unique URL.
