import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  serverTimestamp
} from "firebase/firestore"

import { db } from "./firebase"

const POLO_DOC_PATH = ["polo", "vacaciones-invierno-2026"]

export async function cargarOrganizacion() {
  const ref = doc(db, ...POLO_DOC_PATH)
  const snapshot = await getDoc(ref)

  if (!snapshot.exists()) {
    return null
  }

  return snapshot.data()
}

export function escucharOrganizacion(callback, onError) {
  const ref = doc(db, ...POLO_DOC_PATH)

  return onSnapshot(
    ref,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }

      callback(snapshot.data())
    },
    (error) => {
      console.error("Error escuchando Firestore:", error)
      if (onError) onError(error)
    }
  )
}

export async function guardarOrganizacion(datos) {
  const ref = doc(db, ...POLO_DOC_PATH)

  await setDoc(
    ref,
    {
      ...datos,
      actualizado: serverTimestamp()
    },
    { merge: true }
  )
}
