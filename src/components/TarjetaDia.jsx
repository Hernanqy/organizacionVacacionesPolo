export default function TarjetaDia({ fecha, actividades, guardias }) {
  const actividadesDelDia = actividades.filter(
    (actividad) => actividad.fechaId === fecha.id
  )

  const guardiasDelDia = guardias[fecha.id] || {}

  return (
    <article className="tarjeta-dia color-resumen">
      <div className="titulo-dia">
        <div>
          <h3>{fecha.etiqueta}</h3>
          <p>{fecha.dia}</p>
        </div>
        <span>{fecha.publico}</span>
      </div>

      <div className="resumen-grid">
        <div className="resumen-bloque">
          <h4>Actividades</h4>

          {actividadesDelDia.length === 0 ? (
            <p className="vacio">-</p>
          ) : (
            <ul>
              {actividadesDelDia.map((actividad) => (
                <li key={actividad.id}>
                  <strong>{actividad.horario || "--:--"}</strong> ·{" "}
                  {actividad.titulo || "Sin título"} · {actividad.espacio}
                  {actividad.responsable && <> · {actividad.responsable}</>}
                  {actividad.observaciones && (
                    <small>{actividad.observaciones}</small>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="resumen-bloque">
          <h4>Seguridad</h4>

          {Object.keys(guardiasDelDia).length === 0 ? (
            <p className="vacio">-</p>
          ) : (
            <ul>
              {Object.entries(guardiasDelDia).map(([lugar, agente]) => (
                <li key={lugar}>
                  <strong>{lugar}</strong> · {agente || "-"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  )
}
