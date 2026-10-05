export const AYUDA = `Gestión de productos — FakeStore

Comandos:
  npm run start GET products
  npm run start GET products/15
  npm run start POST products "Camiseta nueva" 300 remeras
  npm run start DELETE products/7

También puedes usar npm start -- seguido del comando.
Los títulos y categorías con espacios deben ir entre comillas.`;

export function interpretarComando(argumentos) {
  if (argumentos.length === 0 || (argumentos.length === 1 && ['--help', '-h'].includes(argumentos[0]))) {
    return { ayuda: true };
  }
  const [metodoOriginal, ruta, ...datos] = argumentos;
  const metodo = metodoOriginal.toUpperCase();
  if (!['GET', 'POST', 'DELETE'].includes(metodo)) {
    throw new Error('Método inválido. Usa GET, POST o DELETE.');
  }
  const coincidencia = /^products(?:\/([1-9]\d*))?$/.exec(ruta ?? '');
  if (!coincidencia || (coincidencia[1] && !Number.isSafeInteger(Number(coincidencia[1])))) {
    throw new Error('Ruta inválida. Usa products o products/ID con un ID entero positivo.');
  }
  const identificador = coincidencia[1] ? Number(coincidencia[1]) : undefined;
  if (metodo === 'GET' && datos.length === 0) return { metodo, ruta, identificador };
  if (metodo === 'DELETE' && identificador && datos.length === 0) return { metodo, ruta, identificador };
  if (metodo === 'POST' && !identificador && datos.length === 3) {
    const [tituloOriginal, precioOriginal, categoriaOriginal] = datos;
    const titulo = tituloOriginal.trim();
    const categoria = categoriaOriginal.trim();
    const precio = Number(precioOriginal);
    if (!titulo || !categoria || !precioOriginal.trim() || !Number.isFinite(precio) || precio < 0) {
      throw new Error('Título y categoría son obligatorios; el precio debe ser un número mayor o igual a cero.');
    }
    return { metodo, ruta, producto: { titulo, precio, categoria } };
  }
  throw new Error(`Argumentos incorrectos.\n${AYUDA}`);
}
