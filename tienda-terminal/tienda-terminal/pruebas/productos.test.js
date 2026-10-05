import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpretarComando } from '../src/comandos.js';
import { ejecutarComando } from '../src/productos.js';

test('valida comandos y rechaza datos incorrectos', () => {
  assert.equal(interpretarComando(['GET', 'products/15']).identificador, 15);
  assert.deepEqual(interpretarComando(['POST', 'products', ' Camiseta ', '300', ' remeras ']).producto,
    { titulo: 'Camiseta', precio: 300, categoria: 'remeras' });
  for (const argumentos of [ ['GET', 'products/0'], ['POST', 'products', 'A', '-1', 'B'],
    ['POST', 'products', 'A', 'abc', 'B'], ['DELETE', 'products'], ['GET', 'products', 'extra'] ]) {
    assert.throws(() => interpretarComando(argumentos));
  }
});

test('envía los cuatro comandos a la API y controla sus errores', async (contexto) => {
  const peticiones = [];
  let estado = 200;
  let contenido = [{ id: 1, title: 'Prueba' }];
  contexto.mock.method(globalThis, 'fetch', async (url, opciones) => {
    peticiones.push({ url, opciones });
    return new Response(JSON.stringify(contenido), { status: estado });
  });
  assert.equal((await ejecutarComando(interpretarComando(['GET', 'products']))).length, 1);
  contenido = { id: 15, title: 'Prueba' };
  assert.equal((await ejecutarComando(interpretarComando(['GET', 'products/15']))).id, 15);
  await ejecutarComando(interpretarComando(['POST', 'products', 'Camiseta', '300', 'remeras']));
  assert.equal(peticiones[2].opciones.method, 'POST');
  assert.deepEqual(JSON.parse(peticiones[2].opciones.body), {
    title: 'Camiseta', price: 300, category: 'remeras', description: '', image: ''
  });
  await ejecutarComando(interpretarComando(['DELETE', 'products/7']));
  assert.equal(peticiones[3].opciones.method, 'DELETE');
  assert.equal(peticiones[3].url, 'https://fakestoreapi.com/products/7');
  contenido = null;
  await assert.rejects(ejecutarComando(interpretarComando(['GET', 'products/999'])), /No existe/);
  estado = 500;
  await assert.rejects(ejecutarComando(interpretarComando(['GET', 'products'])), /HTTP 500/);
  contexto.mock.method(globalThis, 'fetch', async () => { throw new TypeError('fetch failed'); });
  await assert.rejects(ejecutarComando(interpretarComando(['GET', 'products'])), /conectar/);
});
