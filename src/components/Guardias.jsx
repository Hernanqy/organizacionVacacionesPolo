import { fechas } from "../data/fechas"
import { lugaresGuardia } from "../data/lugares"
import { seguridad } from "../data/seguridad"

export default function Guardias({ guardias, setGuardias, extras }) {
  const agentesSeguridad = [
    ...seguridad,
    ...extras.filter((extra) => extra.area === "Seguridad")
  ]

  function actualizarGuardia(fechaId, lugar, valor) {
    setGuardias((actual) => ({
      ...actual,
      [fechaId]: {
        ...(actual[fechaId] || {}),
        [lugar]: valor
      }
    }))
  }

  return (
    <section className="seccion-infografia">
      <header className="seccion-header">
        <span>Polo La Máxima</span>
        <h2>Seguridad</h2>
      </header>

      <div className="seguridad-shell">
        <aside className="agentes-panel">
          <div className="panel-numero naranja">S</div>
          <h3>Agentes</h3>

          <div className="chips-lista">
            {agentesSeguridad.map((agente) => (
              <span key={agente.id} className="chip chip-seguridad">
                {agente.nombre}
              </span>
            ))}
          </div>
        </aside>

        <div className="seguridad-dias">
          {fechas.map((fecha, index) => (
            <article key={fecha.id} className="seguridad-dia-card">
              <div className="seguridad-dia-head">
                <div>
                  <strong>{fecha.etiqueta}</strong>
                  <span>{fecha.dia}</span>
                </div>

                <small>{String(index + 1).padStart(2, "0")}</small>
              </div>

              <div className="grid-guardias">
                {lugaresGuardia.map((lugar) => (
                  <label key={lugar}>
                    {lugar}
                    <select
                      value={guardias[fecha.id]?.[lugar] || ""}
                      onChange={(e) =>
                        actualizarGuardia(fecha.id, lugar, e.target.value)
                      }
                    >
                      <option value="">-</option>
                      {agentesSeguridad.map((agente) => (
                        <option key={agente.id} value={agente.nombre}>
                          {agente.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
