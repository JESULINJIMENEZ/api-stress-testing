
**Proyecto de Pruebas de Carga**
- **Descripción**: Conjunto de scripts de `k6` para ejecutar pruebas de carga simples contra endpoints públicos y de login.

**Archivos**
- **`index.js`**: Prueba de carga sencilla que realiza peticiones `GET` a `https://mi.dominio.com/`.
	- **Importes**: `http` y `sleep` desde `k6`.
	- **Opciones**: `stages` define la rampa de usuarios:
		- `{ duration: "30s", target: 50 }` — subir hasta 50 usuarios durante 30s.
		- `{ duration: "1m", target: 200 }` — subir hasta 200 usuarios en 1 minuto.
		- `{ duration: "30s", target: 0 }` — bajar la carga a 0 en 30s.
	- **Función por defecto**: hace `http.get("https://mi.dominio.com/")` y espera `sleep(1)`.
	- **Uso**: Ejecuta la prueba con:

```bash
k6 run index.js
```

- **`loginTest.js`**: Prueba de carga que simula intentos de login POST a `https://mi.dominio.com/login`.
	- **Importes**: `http`, `check` y `sleep` desde `k6`.
	- **Opciones**:
		- `stages` — rampa de usuarios: 10 → 30 → 50 → 0 con duraciones especificadas en el script.
		- `thresholds` — reglas de aceptación:
			- `http_req_duration: ["p(95)<1500"]` — el 95% de las solicitudes debe completarse en <1.5s.
			- `http_req_failed: ["rate<0.05"]` — menos del 5% de fallos permitidos.
	- **Función por defecto**:
		- Construye un objeto `data` con `email` y `password` y lo envía con `http.post`.
		- Verifica el resultado con `check(res, { 'success login': (r) => r.status === 200 })`.
		- Llamada a `sleep(0.3)` entre iteraciones.
	- **Notas sobre el body**: al pasar un objeto como segundo parámetro, `k6` envía por defecto `application/x-www-form-urlencoded`. Si la API espera JSON, use `JSON.stringify(data)` y añada el header `Content-Type: application/json`.
	- **Uso**: Ejecuta la prueba con:

```bash
k6 run loginTest.js
```

**Prerrequisitos**
- **`k6`**: en macOS puede instalarse con Homebrew:

```bash
brew install k6
```

**Comandos útiles**
- Ejecutar un script concreto:

```bash
k6 run index.js
k6 run loginTest.js
```
- Guardar salida en JSON para análisis posterior:

```bash
k6 run --out json=results.json loginTest.js
```

**Recomendaciones y buenas prácticas**
- **Credenciales**: no almacenar credenciales en texto plano para repositorios públicos; usar variables de entorno y `__ENV` de `k6`:

```js
const data = {
	email: __ENV.EMAIL || 'admin@test.local',
	password: __ENV.PASSWORD || 'admin1234'
}
```

- **Validar formato del payload**: adaptar headers si la API espera JSON.
- **Ajustes de ramp-up**: modifica `stages` para simular patrones de tráfico reales.

**Siguientes pasos**
- Ajustar `loginTest.js` para leer credenciales desde `__ENV` si quieres ejecutar pruebas con credenciales reales de forma segura.
- Puedo ejecutar una prueba local y recoger `results.json` si quieres que pruebe y comparta resultados.

Archivo actualizado: `readme.md`

