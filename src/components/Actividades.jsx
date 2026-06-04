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
    "Exterior",
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
  const agentes = [...personas, ...extras].filter(
    (persona, index, array) =>
      persona?.nombre &&
      array.findIndex((item) => item.nombre === persona.nombre) === index
  )

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
        responsables: [],
        observaciones: ""
      }
    ])
  }

  function normalizarResponsables(actividad) {
    if (Array.isArray(actividad.responsables)) {
      return actividad.responsables
    }

    if (actividad.responsable) {
      return [actividad.responsable]
    }

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

  function agregarResponsable(id, nombreResponsable) {
    if (!nombreResponsable) return

    setActividades((actual) =>
      actual.map((actividad) => {
        if (actividad.id !== id) return actividad

        const responsablesActuales = normalizarResponsables(actividad)

        if (responsablesActuales.includes(nombreResponsable)) {
          return actividad
        }

        return {
          ...actividad,
          responsables: [...responsablesActuales, nombreResponsable],
          responsable: ""
        }
      })
    )
  }

  function quitarResponsable(id, nombreResponsable) {
    setActividades((actual) =>
      actual.map((actividad) => {
        if (actividad.id !== id) return actividad

        const responsablesActuales = normalizarResponsables(actividad)

        return {
          ...actividad,
          responsables: responsablesActuales.filter(
            (nombre) => nombre !== nombreResponsable
          ),
          responsable: ""
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
          const responsablesActividad = normalizarResponsables(actividad)

          const cargada = Boolean(
            actividad.titulo?.trim() ||
            actividad.horario?.trim() ||
            responsablesActividad.length > 0 ||
            actividad.observaciones?.trim()
          )

          const opcionesEspacioDetalle =
            espaciosPorLugar[actividad.espacio] || ["A definir"]

          const agentesDisponibles = agentes.filter(
            (persona) => !responsablesActividad.includes(persona.nombre)
          )

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
                      value=""
                      onChange={(e) =>
                        agregarResponsable(actividad.id, e.target.value)
                      }
                    >
                      <option value="" disabled hidden>
                        Seleccionar
                      </option>

                      {agentesDisponibles.map((persona) => (
                        <option key={persona.id} value={persona.nombre}>
                          {persona.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {responsablesActividad.length > 0 && (
                  <div className="responsables-seleccionados">
                    {responsablesActividad.map((nombre) => (
                      <button
                        key={nombre}
                        type="button"
                        onClick={() => quitarResponsable(actividad.id, nombre)}
                      >
                        {nombre}
                        <span>×</span>
                      </button>
                    ))}
                  </div>
                )}

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
