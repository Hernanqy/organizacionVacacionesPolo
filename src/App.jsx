import { useEffect, useState } from "react"
import "./styles/app.css"

import MenuPrincipal from "./components/MenuPrincipal"
import Organizacion from "./components/Organizacion"
import ResumenDiario from "./components/ResumenDiario"

import { actividadesBase } from "./data/actividadesBase"
import { leerLS, guardarLS } from "./utils/storage"

export default function App() {
  const [vista, setVista] = useState("resumen")

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

  function borrarTodo() {
    const confirmar = confirm("¿Borrar toda la información cargada?")
    if (!confirmar) return

    localStorage.removeItem("polo-disponibilidad")
    localStorage.removeItem("polo-actividades")
    localStorage.removeItem("polo-guardias")
    localStorage.removeItem("polo-extras")

    setDisponibilidad({})
    setActividades(actividadesBase)
    setGuardias({})
    setExtras([])
    setVista("resumen")
  }

  return (
    <main className="app">
      <header className="hero hero-compacto">
        <div>
          <p className="eyebrow">Polo La Máxima</p>
          <h1>Invierno 2026</h1>
        </div>

        <div className="hero-actions">
          <button className="boton-secundario" onClick={exportarDatos}>
            Exportar
          </button>
          <button className="boton-peligro" onClick={borrarTodo}>
            Borrar
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
