import { fechas } from "../data/fechas"
import { lugares } from "../data/lugares"
import { personas } from "../data/personas"

const espaciosPorLugar = {
  Museo: [
    "Salas abajo",
    "Recepción",
    "Ludoteca",
    "Sala de ingenio",
    "Sala varieté",
    "Salas de arriba",
    "SUM",
    "Otro"
  ],
  Bioparque: [
    "Ingreso al Bioparque",
    "Casona",
    "Lago",
    "Condorera",
    "Recorrido general",
    "Aula / taller",
    "Entrada lateral",
    "Otro"
  ],
  CIIT: [
    "Sala CIIT",
    "Aula taller",
    "Espacio interactivo",
    "Otro"
  ],
  "Plaza del museo": [
    "Sector central",
    "Sector ingreso",
    "Sector juegos",
    "Otro"
  ],
  Lago: [
    "Orilla del lago",
    "Mirador",
    "Sendero",
    "Otro"
  ],
  Casona: [
    "Sala principal",
    "Galería",
    "Patio",
    "Otro"
  ],
  Otro: [
    "A definir"
  ]
}

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
        espacioDetalle: "Salas abajo",
        responsable: "",
        agentes: [],
        observaciones: ""
      }
    ])
  }

  function normalizarAgentes(actividad) {
    if (Array.isArray(actividad.agentes)) return actividad.agentes
    if (actividad.apoyo) return [actividad.apoyo]
    return []
  }

  function actualizarActividad(id, campo, valor) {
    setActividades((actual) =>
      actual.map((actividad) => {
        if (actividad.id !== id) return actividad

        if (campo === "espacio") {
          const opciones = espaciosPorLugar[valor] || ["A definir"]

          return {
            ...actividad,
            espacio: valor,
            espacioDetalle: opciones[0]
          }
        }

        return { ...actividad, [campo]: valor }
      })
    )
  }

  function cambiarAgenteActividad(id, nombreAgente) {
    setActividades((actual) =>
      actual.map((actividad) => {
        if (actividad.id !== id) return actividad

        const agentesActuales = normalizarAgentes(actividad)
        const yaExiste = agentesActuales.includes(nombreAgente)

        const nuevosAgentes = yaExiste
          ? agentesActuales.filter((nombre) => nombre !== nombreAgente)
          : [...agentesActuales, nombreAgente]

        return {
          ...actividad,
          agentes: nuevosAgentes,
          apoyo: ""
        }
      })
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
        {actividades.map((actividad, index) => {
          const agentesActividad = normalizarAgentes(actividad)

          const cargada = Boolean(
            actividad.titulo?.trim() ||
            actividad.horario?.trim() ||
            actividad.responsable?.trim() ||
            actividad.observaciones?.trim()
          )

          const opcionesEspacioDetalle =
            espaciosPorLugar[actividad.espacio] || ["A definir"]

          return (
            <article
              key={actividad.id}
              className={cargada ? "form-card actividad actividad-cargada" : "form-card actividad"}
            >
              <div className={cargada ? "form-numero verde" : "form-numero azul"}>
                {`A${index + 1}`}
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
                    Espacio
                    <select
                      value={actividad.espacioDetalle || opcionesEspacioDetalle[0]}
                      onChange={(e) =>
                        actualizarActividad(
                          actividad.id,
                          "espacioDetalle",
                          e.target.value
                        )
                      }
                    >
                      {opcionesEspacioDetalle.map((espacio) => (
                        <option key={espacio} value={espacio}>
                          {espacio}
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

                <div className="selector-agentes">
                  <div className="selector-agentes-head">
                    <span>Agentes de la actividad</span>
                    <strong>{agentesActividad.length}</strong>
                  </div>

                  <div className="agentes-checks">
                    {agentes.map((persona) => {
                      const activo = agentesActividad.includes(persona.nombre)

                      return (
                        <button
                          key={persona.id}
                          type="button"
                          className={activo ? "agente-chip activo" : "agente-chip"}
                          onClick={() =>
                            cambiarAgenteActividad(actividad.id, persona.nombre)
                          }
                        >
                          {persona.nombre}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <label>
                  Nota
                  <textarea
                    value={actividad.observaciones}
                    placeholder="Opcional"
                    onChange={(e) =>
                      actualizarActividad(actividad.id, "observaciones", e.target.value)
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
          )
        })}
      </div>
    </section>
  )
}
