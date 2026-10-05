import { interpretarComando, AYUDA } from './src/comandos.js';
import { ejecutarComando } from './src/productos.js';

try {
  const comando = interpretarComando(process.argv.slice(2));
  if (comando.ayuda) {
    console.log(AYUDA);
  } else {
    const resultado = await ejecutarComando(comando);
    console.log(JSON.stringify(resultado, null, 2));
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
