import { useEffect, useState } from "react"
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
  const [vista, setVistaBase] = useState("resumen")
  const [estadoSync, setEstadoSync] = useState("Listo")
  const [hayCambiosSinGuardar, setHayCambiosSinGuardar] = useState(false)
  const [cargandoDatos, setCargandoDatos] = useState(true)

  const [disponibilidad, setDisponibilidadBase] = useState(() =>
    leerLS("polo-disponibilidad", {})
  )

  const [actividades, setActividadesBase] = useState(() =>
    leerLS("polo-actividades", actividadesBase)
  )

  const [guardias, setGuardiasBase] = useState(() =>
    leerLS("polo-guardias", {})
  )

  const [extras, setExtrasBase] = useState(() =>
    leerLS("polo-extras", [])
  )

  function marcarCambio() {
    if (!cargandoDatos) {
      setHayCambiosSinGuardar(true)
      setEstadoSync("Cambios sin guardar")
    }
  }

  function setDisponibilidad(valor) {
    setDisponibilidadBase(valor)
    marcarCambio()
  }

  function setActividades(valor) {
    setActividadesBase(valor)
    marcarCambio()
  }

  function setGuardias(valor) {
    setGuardiasBase(valor)
    marcarCambio()
  }

  function setExtras(valor) {
    setExtrasBase(valor)
    marcarCambio()
  }

  function cambiarVista(nuevaVista) {
    if (
      vista === "organizacion" &&
      nuevaVista !== "organizacion" &&
      hayCambiosSinGuardar
    ) {
      const confirmar = confirm(
        "Tenés cambios sin guardar. Si salís de Organización, pueden no subirse al cronograma compartido. ¿Salir igual?"
      )

      if (!confirmar) return
    }

    setVistaBase(nuevaVista)
  }

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

  useEffect(() => {
    function advertirSalida(evento) {
      if (!hayCambiosSinGuardar) return

      evento.preventDefault()
      evento.returnValue = ""
    }

    window.addEventListener("beforeunload", advertirSalida)

    return () => {
      window.removeEventListener("beforeunload", advertirSalida)
    }
  }, [hayCambiosSinGuardar])

  function aplicarDatosFirebase(datos) {
    if (!datos) return

    setCargandoDatos(true)

    setDisponibilidadBase(datos.disponibilidad || {})
    setActividadesBase(datos.actividades || actividadesBase)
    setGuardiasBase(datos.guardias || {})
    setExtrasBase(datos.extras || [])

    guardarLS("polo-disponibilidad", datos.disponibilidad || {})
    guardarLS("polo-actividades", datos.actividades || actividadesBase)
    guardarLS("polo-guardias", datos.guardias || {})
    guardarLS("polo-extras", datos.extras || [])

    setHayCambiosSinGuardar(false)

    setTimeout(() => {
      setCargandoDatos(false)
    }, 300)
  }

  async function actualizarDesdeFirebase({ silencioso = false, forzar = false } = {}) {
    if (!forzar && vista !== "resumen") return

    try {
      if (!silencioso) {
        setEstadoSync("Actualizando...")
      }

      const datos = await cargarOrganizacion()

      if (!datos) {
        if (!silencioso) setEstadoSync("Sin datos")
        setCargandoDatos(false)
        return
      }

      aplicarDatosFirebase(datos)

      setEstadoSync(silencioso ? "Actualizado" : "Sincronizado")
    } catch (error) {
      console.error(error)
      setCargandoDatos(false)

      if (!silencioso) {
        setEstadoSync("Error al actualizar")
      }
    }
  }

  async function actualizarManual() {
    if (hayCambiosSinGuardar) {
      const confirmar = confirm(
        "Tenés cambios sin guardar. Actualizar traerá la última versión de Firebase y puede reemplazarlos. ¿Continuar?"
      )

      if (!confirmar) return
    }

    await actualizarDesdeFirebase({ silencioso: false, forzar: true })
  }

  useEffect(() => {
    actualizarDesdeFirebase({ silencioso: true, forzar: true })
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (vista === "resumen" && document.visibilityState === "visible") {
        actualizarDesdeFirebase({ silencioso: true })
      }
    }, 60000)

    return () => clearInterval(intervalo)
  }, [vista])

  useEffect(() => {
    function alVolverVisible() {
      if (document.visibilityState === "visible" && vista === "resumen") {
        actualizarDesdeFirebase({ silencioso: true })
      }
    }

    function alVolverAFoco() {
      if (vista === "resumen") {
        actualizarDesdeFirebase({ silencioso: true })
      }
    }

    function alVolverDesdeCelular() {
      if (vista === "resumen") {
        actualizarDesdeFirebase({ silencioso: true })
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

  async function guardarAhora() {
    try {
      setEstadoSync("Guardando...")

      await guardarOrganizacion({
        disponibilidad,
        actividades,
        guardias,
        extras
      })

      setHayCambiosSinGuardar(false)
      setEstadoSync("Guardado")
    } catch (error) {
      console.error(error)
      setEstadoSync("Error")
    }
  }

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
          <h1>Vacaciones de Invierno 2026</h1>
        </div>

        {vista === "organizacion" && (
          <div className="hero-actions">
            <span className={hayCambiosSinGuardar ? "sync-pill pendiente" : "sync-pill"}>
              {estadoSync}
            </span>

            <button className="boton-secundario" onClick={actualizarManual}>
              Actualizar
            </button>

            <button className="boton-secundario guardar-cambios" onClick={guardarAhora}>
              Guardar cambios
            </button>

            <button className="boton-secundario" onClick={exportarDatos}>
              Exportar
            </button>
          </div>
        )}
      </header>

      <MenuPrincipal vista={vista} setVista={cambiarVista} />

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
