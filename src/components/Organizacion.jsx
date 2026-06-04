import { useState } from "react"

import Disponibilidad from "./Disponibilidad"
import Actividades from "./Actividades"
import Guardias from "./Guardias"
import HorasExtras from "./HorasExtras"

export default function Organizacion({
  disponibilidad,
  setDisponibilidad,
  actividades,
  setActividades,
  guardias,
  setGuardias,
  extras,
  setExtras
}) {
  const [seccion, setSeccion] = useState(null)

  const items = [
    { id: "actividades", label: "Actividades", icono: "★" },
    { id: "guardias", label: "Seguridad", icono: "●" },
    { id: "extras", label: "Horas extras", icono: "+" },
    { id: "disponibilidad", label: "Disponibilidad", icono: "✓" }
  ]

  function volver() {
    setSeccion(null)
  }

  if (seccion === "actividades") {
    return (
      <section className="pantalla-organizacion">
        <button className="volver-cronograma" onClick={volver}>
          ← Organización
        </button>

        <Actividades
          actividades={actividades}
          setActividades={setActividades}
          extras={extras}
        />
      </section>
    )
  }

  if (seccion === "guardias") {
    return (
      <section className="pantalla-organizacion">
        <button className="volver-cronograma" onClick={volver}>
          ← Organización
        </button>

        <Guardias
          guardias={guardias}
          setGuardias={setGuardias}
          extras={extras}
        />
      </section>
    )
  }

  if (seccion === "extras") {
    return (
      <section className="pantalla-organizacion">
        <button className="volver-cronograma" onClick={volver}>
          ← Organización
        </button>

        <HorasExtras extras={extras} setExtras={setExtras} />
      </section>
    )
  }

  if (seccion === "disponibilidad") {
    return (
      <section className="pantalla-organizacion">
        <button className="volver-cronograma" onClick={volver}>
          ← Organización
        </button>

        <Disponibilidad
          disponibilidad={disponibilidad}
          setDisponibilidad={setDisponibilidad}
          extras={extras}
        />
      </section>
    )
  }

  return (
    <section className="organizacion-page">
      <header className="organizacion-header">
        <div>
          <span>Polo La Máxima</span>
          <h2>Organización</h2>
        </div>
      </header>

      <nav className="organizacion-tabs organizacion-tabs-home">
        {items.map((item) => (
          <button
            key={item.id}
            className="org-tab"
            onClick={() => setSeccion(item.id)}
          >
            <span>{item.icono}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </section>
  )
}
