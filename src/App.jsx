import { useEffect, useRef, useState } from "react"
import "./styles/app.css"

import MenuPrincipal from "./components/MenuPrincipal"
import Organizacion from "./components/Organizacion"
import ResumenDiario from "./components/ResumenDiario"

import { actividadesBase } from "./data/actividadesBase"
import { leerLS, guardarLS } from "./utils/storage"
import {
  cargarOrganizacion,
  guardarOrganizacion
} from "./services/poloFirestore"

export default function App() {
  const [vista, setVista] = useState("resumen")
  const [estadoSync, setEstadoSync] = useState("")

  const [disponibilidad, setDisponibilidad] = useState(() =>
    leerLS("polo-disponibilidad", {})
  )

  const [actividades, setActividades] = useState(() =>
    leerLS("polo-actividades", actividadesBase)
  )

  const [guardias, setGuardias] = useState(() =>
    leerLS("polo-guardias", {})
  )

  const [extras, setExtras] = useState(() =>
    leerLS("polo-extras", [])
  )

  const cargaInicialLista = useRef(false)
  const aplicandoDatosFirebase = useRef(false)
  const temporizadorGuardado = useRef(null)

  useEffect(() => {
    guardarLS("polo-disponibilidad", disponibilidad)
  }, [disponibilidad])

  useEffect(() => {
    guardarLS("polo-actividades", actividades)
  }, [actividades])

  useEffect(() => {
    guardarLS("polo-guardias", guardias)
  }, [guardias])

  useEffect(() => {
    guardarLS("polo-extras", extras)
  }, [extras])

  function aplicarDatosFirebase(datos) {
    if (!datos) return

    aplicandoDatosFirebase.current = true

    setDisponibilidad(datos.disponibilidad || {})
    setActividades(datos.actividades || actividadesBase)
    setGuardias(datos.guardias || {})
    setExtras(datos.extras || [])

    guardarLS("polo-disponibilidad", datos.disponibilidad || {})
    guardarLS("polo-actividades", datos.actividades || actividadesBase)
    guardarLS("polo-guardias", datos.guardias || {})
    guardarLS("polo-extras", datos.extras || [])

    setTimeout(() => {
      aplicandoDatosFirebase.current = false
    }, 500)
  }

  async function actualizarAutomaticamente() {
    if (vista !== "resumen") return

    try {
      const datos = await cargarOrganizacion()

      if (datos) {
        aplicarDatosFirebase(datos)
      }
    } catch (error) {
      console.error("No se pudo actualizar automáticamente:", error)
    }
  }

  useEffect(() => {
    async function actualizarAlAbrir() {
      try {
        const datos = await cargarOrganizacion()

        if (datos) {
          aplicarDatosFirebase(datos)
        }
      } catch (error) {
        console.error("No se pudo actualizar al abrir:", error)
      } finally {
        setTimeout(() => {
          cargaInicialLista.current = true
        }, 700)
      }
    }

    actualizarAlAbrir()
  }, [])

  useEffect(() => {
    if (vista === "resumen") {
      actualizarAutomaticamente()
    }
  }, [vista])

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (vista === "resumen" && document.visibilityState === "visible") {
        actualizarAutomaticamente()
      }
    }, 60000)

    return () => clearInterval(intervalo)
  }, [vista])

  useEffect(() => {
    function alVolverVisible() {
      if (document.visibilityState === "visible" && vista === "resumen") {
        actualizarAutomaticamente()
      }
    }

    function alVolverAFoco() {
      if (vista === "resumen") {
        actualizarAutomaticamente()
      }
    }

    function alVolverDesdeCelular() {
      if (vista === "resumen") {
        actualizarAutomaticamente()
      }
    }

    document.addEventListener("visibilitychange", alVolverVisible)
    window.addEventListener("focus", alVolverAFoco)
    window.addEventListener("pageshow", alVolverDesdeCelular)

    return () => {
      document.removeEventListener("visibilitychange", alVolverVisible)
      window.removeEventListener("focus", alVolverAFoco)
      window.removeEventListener("pageshow", alVolverDesdeCelular)
    }
  }, [vista])

  useEffect(() => {
    if (!cargaInicialLista.current) return
    if (aplicandoDatosFirebase.current) return

    setEstadoSync("Cambios sin guardar")

    if (temporizadorGuardado.current) {
      clearTimeout(temporizadorGuardado.current)
    }

    temporizadorGuardado.current = setTimeout(async () => {
      try {
        setEstadoSync("Guardando...")

        await guardarOrganizacion({
          disponibilidad,
          actividades,
          guardias,
          extras
        })

        setEstadoSync("Guardado automático")

        setTimeout(() => {
          setEstadoSync("")
        }, 1800)
      } catch (error) {
        console.error(error)
        setEstadoSync("Error al guardar")
      }
    }, 2000)

    return () => {
      if (temporizadorGuardado.current) {
        clearTimeout(temporizadorGuardado.current)
      }
    }
  }, [disponibilidad, actividades, guardias, extras])

  function exportarDatos() {
    const datos = {
      disponibilidad,
      actividades,
      guardias,
      extras,
      exportado: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(datos, null, 2)], {
      type: "application/json"
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "organizacion-polo-vacaciones.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="app">
      <header className="hero hero-compacto">
        <div>
          <p className="eyebrow">Polo La Máxima</p>
          <h1>Invierno 2026</h1>
        </div>

        <div className="hero-actions">
          {estadoSync && <span className="sync-pill">{estadoSync}</span>}

          <button className="boton-secundario" onClick={exportarDatos}>
            Exportar
          </button>
        </div>
      </header>

      <MenuPrincipal vista={vista} setVista={setVista} />

      {vista === "resumen" && (
        <ResumenDiario actividades={actividades} guardias={guardias} />
      )}

      {vista === "organizacion" && (
        <Organizacion
          disponibilidad={disponibilidad}
          setDisponibilidad={setDisponibilidad}
          actividades={actividades}
          setActividades={setActividades}
          guardias={guardias}
          setGuardias={setGuardias}
          extras={extras}
          setExtras={setExtras}
        />
      )}
    </main>
  )
}
