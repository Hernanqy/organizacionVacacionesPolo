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
  const [seccion, setSeccion] = useState("actividades")

  const items = [
    { id: "actividades", label: "Actividades", icono: "★" },
    { id: "guardias", label: "Seguridad", icono: "●" },
    { id: "extras", label: "Horas extras", icono: "+" },
    { id: "disponibilidad", label: "Disponibilidad", icono: "✓" }
  ]

  return (
    <section className="organizacion-page">
      <header className="organizacion-header">
        <div>
          <span>Polo La Máxima</span>
          <h2>Organización</h2>
        </div>
      </header>

      <nav className="organizacion-tabs">
        {items.map((item) => (
          <button
            key={item.id}
            className={seccion === item.id ? "org-tab activa" : "org-tab"}
            onClick={() => setSeccion(item.id)}
          >
            <span>{item.icono}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="organizacion-contenido">
        {seccion === "actividades" && (
          <Actividades
            actividades={actividades}
            setActividades={setActividades}
            extras={extras}
          />
        )}

        {seccion === "guardias" && (
          <Guardias
            guardias={guardias}
            setGuardias={setGuardias}
            extras={extras}
          />
        )}

        {seccion === "extras" && (
          <HorasExtras extras={extras} setExtras={setExtras} />
        )}

        {seccion === "disponibilidad" && (
          <Disponibilidad
            disponibilidad={disponibilidad}
            setDisponibilidad={setDisponibilidad}
          />
        )}
      </div>
    </section>
  )
}
