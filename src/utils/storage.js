export function guardarLS(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos))
}

export function leerLS(clave, valorInicial) {
  const guardado = localStorage.getItem(clave)

  if (!guardado) {
    return valorInicial
  }

  try {
    return JSON.parse(guardado)
  } catch {
    return valorInicial
  }
}
