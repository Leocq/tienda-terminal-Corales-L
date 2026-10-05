# Tienda desde la terminal

Preentrega Node.js: consulta, creación y eliminación de productos mediante FakeStore API. Usa ES Modules, `process.argv` y `fetch` nativo. No necesita paquetes externos.

## Requisitos

Node.js 22 o superior, npm y conexión a Internet para consultar la API real.

## Empezar

1. Descomprime el ZIP.
2. Abre una terminal dentro de la carpeta `tienda-terminal`.
3. Ejecuta `npm install`.
4. Prueba los comandos siguientes.

```bash
npm run start GET products
npm run start GET products/15
npm run start POST products T-Shirt-Rex 300 remeras
npm run start DELETE products/7
```

Si el título o la categoría tienen espacios, usa comillas:

```bash
npm start -- POST products "Camiseta nueva" 29.90 "men's clothing"
```

El separador `--` es una alternativa explícita para pasar argumentos a npm.

```bash
npm start -- --help
npm test
```

Los resultados se muestran completos en JSON. Los errores se muestran en español y terminan el programa con código 1. Se validan método, ruta, cantidad de argumentos, ID y precio antes de llamar a la API. Cada petición tiene un límite de 15 segundos.

## Estructura

```text
tienda-terminal/
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
├── src/
│   ├── comandos.js
│   └── productos.js
└── pruebas/
    └── productos.test.js
```

- `index.js`: entrada y salida por consola.
- `src/comandos.js`: interpretación y validación de argumentos.
- `src/productos.js`: peticiones HTTP y operaciones.
- `pruebas/`: pruebas con respuestas simuladas, sin depender de Internet.

Las funciones y variables propias están en español. Las claves como `title`, `price`, `category`, `method` y `headers` conservan los nombres exigidos por la API o JavaScript.

## Limitación de FakeStore

FakeStore es una API de demostración: las altas y bajas se simulan y no quedan guardadas permanentemente. Después de crear un producto, no esperes encontrarlo en una consulta posterior. No se incluye una base de datos local porque la consigna pide trabajar con esta API.

Documentación de referencia: https://fakestoreapi.com/docs

## Subir a GitHub

Crea un repositorio vacío y sube el contenido de `tienda-terminal`, incluidos los archivos ocultos como `.gitignore`. No subas el ZIP como sustituto del código ni la carpeta `node_modules`.
