export default function MenuPrincipal({ vista, setVista }) {
  const items = [
    { id: "resumen", label: "Cronograma", icono: "▣" },
    { id: "organizacion", label: "Organización", icono: "⚙" }
  ]

  return (
    <nav className="menu-app menu-principal-simple">
      {items.map((item) => (
        <button
          key={item.id}
          className={vista === item.id ? "menu-item activo" : "menu-item"}
          onClick={() => setVista(item.id)}
        >
          <span>{item.icono}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
