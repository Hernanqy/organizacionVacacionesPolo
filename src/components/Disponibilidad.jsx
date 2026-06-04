import { fechas } from "../data/fechas"
import { personas } from "../data/personas"

export default function Disponibilidad({ disponibilidad, setDisponibilidad }) {
  function cambiarDisponibilidad(personaId, fechaId) {
    setDisponibilidad((actual) => {
      const persona = actual[personaId] || {}

      return {
        ...actual,
        [personaId]: {
          ...persona,
          [fechaId]: !persona[fechaId]
        }
      }
    })
  }

  const grupos = [
    { nombre: "Museo", clase: "museo" },
    { nombre: "Bioparque", clase: "bioparque" },
    { nombre: "CIIT", clase: "ciit" },
    { nombre: "Coordinación", clase: "coordinacion" }
  ]

  return (
    <section className="seccion-infografia">
      <header className="seccion-header">
        <span>Polo La Máxima</span>
        <h2>Disponibilidad</h2>
      </header>

      <div className="disponibilidad-lista">
        {grupos.map((grupo) => (
          <article key={grupo.nombre} className={`modulo-card ${grupo.clase}`}>
            <div className="modulo-lateral sin-numero">
              <span>{grupo.nombre}</span>
            </div>

            <div className="modulo-contenido">
              <div className="tabla-scroll tabla-moderna">
                <table className="tabla">
                  <thead>
                    <tr>
                      <th>Agente</th>
                      {fechas.map((fecha) => (
                        <th key={fecha.id}>
                          <span>{fecha.etiqueta}</span>
                          <small>{fecha.dia}</small>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {personas
                      .filter((persona) => persona.area === grupo.nombre)
                      .map((persona) => (
                        <tr key={persona.id}>
                          <td>
                            <strong>{persona.nombre}</strong>
                          </td>

                          {fechas.map((fecha) => {
                            const activo = disponibilidad[persona.id]?.[fecha.id]

                            return (
                              <td key={fecha.id}>
                                <button
                                  className={activo ? "check activo" : "check"}
                                  onClick={() =>
                                    cambiarDisponibilidad(persona.id, fecha.id)
                                  }
                                >
                                  {activo ? "✓" : ""}
                                </button>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
