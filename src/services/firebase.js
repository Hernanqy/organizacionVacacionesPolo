import { initializeApp } from "firebase/app"
import { initializeFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBVYUEzpIenEMoF92Ft1llJtUVydp-iuro",
  authDomain: "polo-vacaciones-2026.firebaseapp.com",
  projectId: "polo-vacaciones-2026",
  storageBucket: "polo-vacaciones-2026.firebasestorage.app",
  messagingSenderId: "811895163748",
  appId: "1:811895163748:web:d97d6be53653577f05c871"
}

const app = initializeApp(firebaseConfig)

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false
})
