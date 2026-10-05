const URL_API = 'https://fakestoreapi.com';

export async function solicitarApi(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${URL_API}/${ruta}`, {
      ...opciones,
      signal: AbortSignal.timeout(15000)
    });
  } catch (error) {
    if (error.name === 'TimeoutError') throw new Error('La API tardó más de 15 segundos en responder.');
    throw new Error('No se pudo conectar con FakeStore. Revisa tu conexión e inténtalo nuevamente.');
  }
  if (!respuesta.ok) throw new Error(`La API devolvió un error HTTP ${respuesta.status}.`);
  const texto = await respuesta.text();
  if (!texto.trim()) return null;
  try {
    return JSON.parse(texto);
  } catch {
    throw new Error('La API devolvió una respuesta que no es JSON válido.');
  }
}

export async function consultarProductos() {
  const productos = await solicitarApi('products');
  if (!Array.isArray(productos)) throw new Error('La API no devolvió una lista de productos.');
  return productos;
}

export async function consultarProducto(identificador) {
  const producto = await solicitarApi(`products/${identificador}`);
  if (!producto) throw new Error(`No existe el producto ${identificador}.`);
  return producto;
}

export async function crearProducto(producto) {
  const { titulo, precio, categoria } = producto;
  // La API requiere estas claves en inglés.
  const datos = { title: titulo, price: precio, category: categoria };
  return solicitarApi('products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...datos, description: '', image: '' })
  });
}

export async function eliminarProducto(identificador) {
  const producto = await solicitarApi(`products/${identificador}`, { method: 'DELETE' });
  if (!producto) throw new Error(`No existe el producto ${identificador}.`);
  return producto;
}

export async function ejecutarComando(comando) {
  const { metodo, identificador, producto } = comando;
  if (metodo === 'GET') return identificador ? consultarProducto(identificador) : consultarProductos();
  if (metodo === 'POST') return crearProducto(producto);
  if (metodo === 'DELETE') return eliminarProducto(identificador);
  throw new Error('Comando no compatible.');
}
