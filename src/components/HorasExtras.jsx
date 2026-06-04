import { useState } from "react"

export default function HorasExtras({ extras, setExtras }) {
  const [nombre, setNombre] = useState("")
  const [area, setArea] = useState("Museo")
  const [telefono, setTelefono] = useState("")
  const [nota, setNota] = useState("")

  function agregarExtra() {
    if (!nombre.trim()) return

    setExtras((actual) => [
      ...actual,
      {
        id: crypto.randomUUID(),
        nombre: nombre.trim(),
        area,
        telefono: telefono.trim(),
        nota: nota.trim()
      }
    ])

    setNombre("")
    setArea("Museo")
    setTelefono("")
    setNota("")
  }

  function eliminarExtra(id) {
    setExtras((actual) => actual.filter((extra) => extra.id !== id))
  }

  return (
    <section className="seccion-infografia">
      <header className="seccion-header">
        <span>Polo La Máxima</span>
        <h2>Horas extras</h2>
      </header>

      <article className="form-card extra-principal">
        <div className="form-numero violeta">+</div>

        <div className="form-cuerpo">
          <div className="grid-form">
            <label>
              Nombre
              <input
                value={nombre}
                placeholder="Agente"
                onChange={(e) => setNombre(e.target.value)}
              />
            </label>

            <label>
              Área
              <select value={area} onChange={(e) => setArea(e.target.value)}>
                <option value="Museo">Museo</option>
                <option value="Bioparque">Bioparque</option>
                <option value="CIIT">CIIT</option>
                <option value="Coordinación">Coordinación</option>
                <option value="Seguridad">Seguridad</option>
              </select>
            </label>

            <label>
              Teléfono
              <input
                value={telefono}
                placeholder="Opcional"
                onChange={(e) => setTelefono(e.target.value)}
              />
            </label>

            <label>
              Nota
              <input
                value={nota}
                placeholder="Opcional"
                onChange={(e) => setNota(e.target.value)}
              />
            </label>
          </div>

          <div className="acciones-tarjeta">
            <button className="boton-infografia violeta" onClick={agregarExtra}>
              + Agregar
            </button>
          </div>
        </div>
      </article>

      <div className="extras-grid">
        {extras.map((extra, index) => (
          <article key={extra.id} className="extra-card-nueva">
            <div className="extra-top">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{extra.area}</strong>
            </div>

            <h3>{extra.nombre}</h3>

            {extra.telefono && <p>{extra.telefono}</p>}
            {extra.nota && <small>{extra.nota}</small>}

            <button onClick={() => eliminarExtra(extra.id)}>Eliminar</button>
          </article>
        ))}
      </div>
    </section>
  )
}
