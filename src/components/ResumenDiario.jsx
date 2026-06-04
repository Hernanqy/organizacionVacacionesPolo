import { useState } from "react"
import { fechas } from "../data/fechas"
import { lugaresGuardia } from "../data/lugares"

const colores = [
  "turquesa",
  "amarillo",
  "naranja",
  "fucsia",
  "violeta",
  "azul",
  "verde",
  "rojo",
  "celeste",
  "morado",
  "lima",
  "coral"
]

const iconos = ["💡", "📅", "🚀", "⭐", "📈", "🎯", "🧭", "🌿", "🦉", "🎨", "🧩", "☀️"]

export default function ResumenDiario({ actividades, guardias }) {
  const [fechaActiva, setFechaActiva] = useState(null)

  const fecha = fechas.find((item) => item.id === fechaActiva)

  function obtenerResponsables(actividad) {
    if (Array.isArray(actividad.responsables)) return actividad.responsables
    if (actividad.responsable) return [actividad.responsable]
    return []
  }

  if (!fechaActiva) {
    return (
      <section className="cronograma-infografia-page">
        <header className="cronograma-infografia-header">
          <span>Polo La Máxima</span>
          <h2>Cronograma</h2>
        </header>

        <div className="cronograma-infografia-lista">
          {fechas.map((fecha, index) => {
            const actividadesDia = actividades.filter(
              (actividad) => actividad.fechaId === fecha.id
            )

            const guardiasDia = guardias[fecha.id] || {}
            const cantidadGuardias = Object.values(guardiasDia).filter(Boolean).length
            const numero = String(index + 1).padStart(2, "0")
            const color = colores[index % colores.length]

            return (
              <button
                key={fecha.id}
                className={`cronograma-barra cronograma-${color}`}
                onClick={() => setFechaActiva(fecha.id)}
              >
                <div className="cronograma-circulo">
                  <span>{iconos[index % iconos.length]}</span>
                </div>

                <div className="cronograma-numero">{numero}</div>

                <div className="cronograma-texto">
                  <strong>{fecha.etiqueta} · {fecha.dia}</strong>
                  <small>
                    {fecha.publico} · {actividadesDia.length} actividades · {cantidadGuardias} guardias
                  </small>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    )
  }

  const actividadesDelDia = actividades
    .filter((actividad) => actividad.fechaId === fechaActiva)
    .sort((a, b) => (a.horario || "").localeCompare(b.horario || ""))

  const guardiasDelDia = guardias[fechaActiva] || {}

  return (
    <section className="cronograma-dia-page">
      <button className="cronograma-volver" onClick={() => setFechaActiva(null)}>
        ← Cronograma
      </button>

      <header className="cronograma-dia-header">
        <div className="cronograma-dia-numero">
          <strong>{fecha.etiqueta}</strong>
          <span>{fecha.dia}</span>

          <div className="cronograma-dia-mini-datos">
            <article>
              <small>Público</small>
              <b>{fecha.publico}</b>
            </article>

            <article>
              <small>Personal</small>
              <b>{fecha.personal}</b>
            </article>
          </div>
        </div>
      </header>

      <div className="cronograma-dia-grid">
        <section className="cronograma-dia-bloque">
          <div className="cronograma-bloque-titulo azul">
            <h3>Actividades del Polo</h3>
            <span>{actividadesDelDia.length}</span>
          </div>

          {actividadesDelDia.length === 0 ? (
            <div className="cronograma-vacio">Sin actividades cargadas</div>
          ) : (
            <div className="cronograma-agenda">
              {actividadesDelDia.map((actividad) => {
                const responsablesActividad = obtenerResponsables(actividad)

                return (
                  <article key={actividad.id} className="cronograma-actividad">
                    <div className="cronograma-hora">
                      {actividad.horario || "--:--"}
                    </div>

                    <div>
                      <h4>{actividad.titulo || "Actividad sin título"}</h4>

                      <div className="cronograma-tags">
                        <span>{actividad.espacio || "Sin lugar"}</span>

                        {actividad.espacioDetalle && (
                          <span>{actividad.espacioDetalle}</span>
                        )}

                        {responsablesActividad.map((responsable) => (
                          <span key={responsable}>Resp. {responsable}</span>
                        ))}
                      </div>

                      {actividad.observaciones && <p>{actividad.observaciones}</p>}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <section className="cronograma-dia-bloque">
          <div className="cronograma-bloque-titulo naranja">
            <h3>Seguridad</h3>
            <span>{Object.values(guardiasDelDia).filter(Boolean).length}</span>
          </div>

          <div className="cronograma-seguridad">
            {lugaresGuardia.map((lugar) => (
              <article key={lugar} className="cronograma-zona">
                <small>{lugar}</small>
                <strong>{guardiasDelDia[lugar] || "Sin asignar"}</strong>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
