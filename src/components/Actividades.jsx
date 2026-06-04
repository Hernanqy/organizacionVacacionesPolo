import { fechas } from "../data/fechas"
import { lugares } from "../data/lugares"
import { personas } from "../data/personas"

export default function Actividades({ actividades, setActividades, extras }) {
  const agentes = [...personas, ...extras]

  function agregarActividad() {
    setActividades((actual) => [
      ...actual,
      {
        id: crypto.randomUUID(),
        fechaId: fechas[0].id,
        horario: "",
        titulo: "",
        espacio: "Museo",
        responsable: "",
        apoyo: "",
        observaciones: ""
      }
    ])
  }

  function actualizarActividad(id, campo, valor) {
    setActividades((actual) =>
      actual.map((actividad) =>
        actividad.id === id ? { ...actividad, [campo]: valor } : actividad
      )
    )
  }

  function eliminarActividad(id) {
    setActividades((actual) => actual.filter((actividad) => actividad.id !== id))
  }

  return (
    <section className="seccion-infografia actividades-section">
      <div className="barra-accion-superior">
        <div>
          <span>Actividades cargadas</span>
          <strong>{actividades.length}</strong>
        </div>

        <button className="boton-nueva-actividad" onClick={agregarActividad}>
          <span>+</span>
          Nueva actividad
        </button>
      </div>

      <div className="cards-grid">
        {actividades.map((actividad, index) => (
          <article key={actividad.id} className="form-card actividad">
            <div className="form-numero azul">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="form-cuerpo">
              <div className="grid-form">
                <label>
                  Día
                  <select
                    value={actividad.fechaId}
                    onChange={(e) =>
                      actualizarActividad(actividad.id, "fechaId", e.target.value)
                    }
                  >
                    {fechas.map((fecha) => (
                      <option key={fecha.id} value={fecha.id}>
                        {fecha.etiqueta} · {fecha.dia}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Hora
                  <input
                    value={actividad.horario}
                    placeholder="14:00"
                    onChange={(e) =>
                      actualizarActividad(actividad.id, "horario", e.target.value)
                    }
                  />
                </label>

                <label>
                  Lugar
                  <select
                    value={actividad.espacio}
                    onChange={(e) =>
                      actualizarActividad(actividad.id, "espacio", e.target.value)
                    }
                  >
                    {lugares.map((lugar) => (
                      <option key={lugar} value={lugar}>
                        {lugar}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Responsable
                  <select
                    value={actividad.responsable}
                    onChange={(e) =>
                      actualizarActividad(
                        actividad.id,
                        "responsable",
                        e.target.value
                      )
                    }
                  >
                    <option value="">-</option>
                    {agentes.map((persona) => (
                      <option key={persona.id} value={persona.nombre}>
                        {persona.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid-form dos">
                <label>
                  Actividad
                  <input
                    value={actividad.titulo}
                    placeholder="Nombre"
                    onChange={(e) =>
                      actualizarActividad(actividad.id, "titulo", e.target.value)
                    }
                  />
                </label>

                <label>
                  Apoyo
                  <select
                    value={actividad.apoyo || ""}
                    onChange={(e) =>
                      actualizarActividad(actividad.id, "apoyo", e.target.value)
                    }
                  >
                    <option value="">-</option>
                    {agentes.map((persona) => (
                      <option key={persona.id} value={persona.nombre}>
                        {persona.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Nota
                <textarea
                  value={actividad.observaciones}
                  placeholder="Opcional"
                  onChange={(e) =>
                    actualizarActividad(
                      actividad.id,
                      "observaciones",
                      e.target.value
                    )
                  }
                />
              </label>

              <div className="acciones-tarjeta">
                <button
                  className="boton-mini"
                  onClick={() => eliminarActividad(actividad.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
