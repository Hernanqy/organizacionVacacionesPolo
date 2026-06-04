import { fechas } from "../data/fechas"
import { personas } from "../data/personas"
import { seguridad } from "../data/seguridad"

export default function Disponibilidad({
  disponibilidad,
  setDisponibilidad,
  extras = []
}) {
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

  const seguridadComoPersonas = seguridad.map((agente) => ({
    ...agente,
    area: "Seguridad"
  }))

  const todasLasPersonas = [
    ...personas,
    ...seguridadComoPersonas,
    ...extras
  ]

  const grupos = [
    { nombre: "Museo", clase: "museo" },
    { nombre: "Bioparque", clase: "bioparque" },
    { nombre: "CIIT", clase: "ciit" },
    { nombre: "Coordinación", clase: "coordinacion" },
    { nombre: "Seguridad", clase: "seguridad" }
  ]

  return (
    <section className="seccion-infografia">
      <header className="seccion-header">
        <span>Polo La Máxima</span>
        <h2>Disponibilidad</h2>
      </header>

      <div className="disponibilidad-lista">
        {grupos.map((grupo) => {
          const personasDelGrupo = todasLasPersonas.filter(
            (persona) => persona.area === grupo.nombre
          )

          if (personasDelGrupo.length === 0) return null

          return (
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
                      {personasDelGrupo.map((persona) => (
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
          )
        })}
      </div>
    </section>
  )
}
