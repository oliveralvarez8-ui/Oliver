# SneakVault — Estado del proyecto

**Última actualización: 28 de agosto de 2026.** Pega este documento entero como primer mensaje en un chat nuevo para retomar el proyecto sin perder contexto.

---

## 1. Qué es esto

**SneakVault** es una app móvil (iOS, Expo/React Native) para coleccionistas de sneakers: el usuario hace una foto de una zapatilla, una IA (Claude) la identifica (marca/modelo/colorway) y busca su precio de reventa real en internet, y la app la guarda en una colección personal local. Tiene un paywall de suscripción (SneakVault Pro) y ya tiene documentos legales + una página web pública lista para App Store Connect.

**Dos proyectos separados en el mismo Mac:**

| Carpeta | Qué es |
|---|---|
| `/Users/oli/claude code/SneakVault` | La app móvil (Expo/React Native) |
| `/Users/oli/claude code/sneakvault-server` | El backend Node/Express que habla con la API de Claude (la clave de API vive aquí, **nunca** en la app) |

---

## 2. Stack técnico exacto

- **Expo SDK 54** (¡importante! No SDK 57 — se bajó a propósito, ver sección 8).
- React Native 0.81.5, React 19.1.0, TypeScript.
- Navegación: `@react-navigation` (bottom tabs + native-stack).
- Almacenamiento local: `@react-native-async-storage/async-storage` (colección y flags, todo en el dispositivo).
- Backend: Node.js + Express 5, SDK oficial `@anthropic-ai/sdk`, modelo **`claude-sonnet-5`** (se cambió desde `claude-opus-5` para abaratar costes).
- Markdown en la app: `react-native-markdown-display`.
- Node se instaló vía **nvm** (no había Node en el sistema al empezar). Para usar `node`/`npm`/`npx` en una Terminal nueva, si no carga solo:
  ```bash
  export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  ```

---

## 3. Cómo arrancar todo desde cero

**Backend** (una Terminal, déjala abierta):
```bash
cd "/Users/oli/claude code/sneakvault-server"
npm run dev
```
Necesita el archivo `.env` con `ANTHROPIC_API_KEY=sk-ant-...` (ya existe y ya tiene la clave real puesta). Escucha en el puerto **3001**.

**App** (otra Terminal):
```bash
cd "/Users/oli/claude code/SneakVault"
npx expo start --ios
```
Esto abre el simulador de iOS automáticamente. Para probarlo en un iPhone físico con Expo Go: escanea el QR con la app **Cámara** del iPhone (no con Expo Go — en iOS no tiene escáner propio), y toca "Abrir en Expo Go".

⚠️ **Antes de probar en el móvil físico**, comprueba la IP de tu Mac (cambia si cambias de red/WiFi/hotspot):
```bash
ipconfig getifaddr en0
```
y actualiza `constants/config.ts` → `API_BASE_URL` con esa IP + `:3001`. **Ahora mismo está puesta en `http://172.20.10.5:3001`** (la actualicé al escribir este documento porque había cambiado). Si vuelve a fallar la conexión desde el móvil, es casi siempre por esto.

---

## 4. Qué se ha construido (fase por fase)

### Fase 1 — App base (modo demo)
3 pantallas: Inicio, Colección, Escáner. Catálogo mock local en `data/sneakers.ts` (18 sneakers con foto/precio inventados) usado solo como fallback de año/precio original cuando no hay coincidencia real.

### Fase 2 — Backend conectado a la API de Claude
`sneakvault-server/index.js`: endpoint único `POST /identify`. Recibe `{ image (base64), mediaType }`, identifica la zapatilla con Claude, devuelve `{ es_zapatilla, marca, modelo, colorway, confianza }`. Maneja errores tipados (sin clave, sin crédito, rate limit, sin conexión).

### Fase 3 — Pantalla de Planes (paywall)
`screens/PlansScreen.tsx` + `data/plans.ts`. Dos planes (Mensual $6,99, Anual $49,99 con 7 días de prueba gratis). Se abre sola la primera vez que se abre la app (guardado en AsyncStorage, clave `@sneakvault/ya_vio_planes`) y también desde el botón **PRO** de Inicio. El botón "Empezar prueba gratis" **no cobra nada real todavía** — solo `console.log`. Conectar RevenueCat/pagos reales de Apple es una fase futura no empezada.

### Fase 4 — Identificación + precio con búsqueda web
El backend ahora usa la herramienta `web_search` de Claude **en la misma llamada** que identifica la foto: Claude puede corregirse a sí mismo si la búsqueda contradice lo que creyó ver. Prioriza StockX y GOAT. Nuevos campos en la respuesta: `precio_estimado`, `fuente_precio`, `fecha_consulta` (esta última la calcula el propio backend, nunca Claude). Si no encuentra nada fiable, usa su propia estimación marcada exactamente como `"Estimación de Claude (no confirmada)"`.

**Caché de precios en memoria** (`sneakvault-server/index.js`): por marca+modelo+colorway normalizados, 24h de validez, se vacía al reiniciar el backend (es solo un `Map` en memoria, sin base de datos). Ahorra búsquedas repetidas del mismo modelo el mismo día.

**Coste real medido** (con `claude-opus-5`, antes del cambio a Sonnet): ~$0,01-0,015 por escaneo sin búsqueda, hasta ~$0,39 con búsqueda completa (4 búsquedas + tokens). Con Sonnet 5 el coste baja ~2,5x. La caché reduce mucho el coste en modelos populares repetidos.

### Fase 5 — Documentos legales (RGPD, España)
`legal/privacidad.md`, `legal/terminos.md` (y `legal/contenido.ts`, la misma copia en TypeScript porque Metro no puede importar `.md` directamente — **si editas uno, edita el otro también**, está anotado en ambos archivos). Accesibles desde la app vía `screens/LegalScreen.tsx` (enlazado desde Inicio y desde Planes).

**Datos del responsable ya puestos:** Óliver Álvarez Pérez · Xosé María Cao, C.P. 27891, España (⚠️ falta número y localidad para estar completa) · sneakersupport@gmail.com (⚠️ pendiente de crear de verdad).

**Puntos marcados 🔴 para revisar con un abogado antes de cobrar a usuarios reales** (resumen, el detalle completo está dentro de los documentos):
1. Transferencia internacional a Anthropic (DPA/Cláusulas Contractuales Tipo) — el más delicado.
2. Confirmar forma jurídica (autónomo/sociedad) y si hace falta NIF/CIF.
3. Completar la dirección de contacto.
4. Descargo de responsabilidad sobre precios/identificación — suficiente frente a normativa de consumidores.
5. Cláusula de jurisdicción — compatibilidad con normativa UE de consumidores.
6. Interacción entre el derecho de desistimiento de 14 días y la prueba gratuita de 7 días.
7. Crear y verificar el email de contacto.

### Fase 6 — Página web pública
`docs/index.html`: página única (HTML+CSS sin build tools), estética oscura (`#14151A` + acento `#FF5A1F`), con logo real (ver más abajo), secciones con anclas: Inicio, Qué ofrece, Contacto, Privacidad (completa), Términos (completo). Pensada para publicarse gratis con GitHub Pages y usarse como Support URL / Marketing URL / Privacy Policy URL en App Store Connect.

**Logo:** viene de un proyecto de Claude Design importado (`DesignSync`), un símbolo original de bota/zapatilla (sin texto, no reproduce ninguna marca real). Está embebido como SVG inline en `docs/index.html`. La app móvil en sí **todavía usa el icono azul genérico por defecto de Expo** (nunca se generaron los PNG del icono real de la app a partir de este logo — pendiente si se quiere).

**Copia de seguridad:** la página está publicada como Artifact privado en `https://claude.ai/code/artifact/40a0fdc1-6305-4abf-9a84-7baeade78ac3` (por si se pierde el acceso al repo). Se actualiza sola si vuelvo a publicar el mismo archivo en una conversación futura.

---

## 5. Estado de GitHub — pendiente de resolver

- Repo creado: **`https://github.com/oliveralvarez8-ui/Oliver.git`** (nota: se llama "Oliver", no "sneakvault" — el usuario lo creó así).
- Remoto ya conectado en local (`git remote -v` lo confirma) y hay **1 commit local** con todo el proyecto, listo para subir.
- `git push` está **fallando por autenticación**: varios intentos con Personal Access Token (fine-grained) de GitHub han dado `Invalid username or token` / `invalid credentials`. El usuario decidió borrar el token y retomarlo otro día.
- **Siguiente paso pendiente:** generar un token nuevo (classic o fine-grained con permiso `repo`/`Contents: Read and write` y acceso al repo `Oliver`), y ejecutar en su Terminal:
  ```bash
  cd "/Users/oli/claude code/SneakVault"
  git remote set-url origin https://oliveralvarez8-ui:TOKEN_AQUI@github.com/oliveralvarez8-ui/Oliver.git
  git push -u origin main
  git remote set-url origin https://github.com/oliveralvarez8-ui/Oliver.git
  ```
  (El token nunca se ha pasado por este chat — el usuario lo pega directamente en su propia Terminal.)
- Después del push: activar **Settings → Pages → Source: rama `main`, carpeta `/docs`** en GitHub para conseguir la URL pública.
- Hay un cambio sin commitear ahora mismo: `docs/index.html` (ajuste menor del `<title>`). Conviene hacer `git add -A && git commit` antes del próximo push.

---

## 6. Cosas importantes que no hay que olvidar

- **La clave de la API de Claude vive solo en `sneakvault-server/.env`**, nunca en el código de la app ni en el repo de GitHub (el `.gitignore` de `sneakvault-server` la excluye, y esa carpeta ni siquiera es parte del repo de `SneakVault`).
- **`API_BASE_URL` en `constants/config.ts` depende de la IP local del Mac** — cambia si cambia de red. Es la causa más probable si la app deja de conectar con el backend.
- **Expo Go de App Store solo soporta hasta SDK 54 ahora mismo** (SDK 57, el que se usó al principio, todavía no está aprobado en el App Store — por eso se bajó el proyecto entero de SDK 57 a SDK 54). Si en el futuro Apple aprueba una versión más nueva de Expo Go, se podría volver a subir de SDK.
- **RevenueCat está declarado en la política de privacidad pero no está integrado en el código todavía** (decisión explícita del usuario: declararlo ya para no tener que republicar el documento luego). Cuando se integre de verdad, revisar que la política siga siendo precisa.
- El logo real de la app (bota/zapatilla) solo se ha usado en la web; los iconos de la app móvil (`assets/icon.png` etc.) siguen siendo el placeholder de Expo.

## 7. Preferencias de trabajo del usuario (para la siguiente sesión)

- Le gusta que se le hagan las preguntas de aclaración **antes** de escribir código cuando la tarea es ambigua o tiene varias decisiones de producto/negocio (se ha usado así en cada fase).
- Prefiere confirmaciones explícitas antes de acciones irreversibles o que tocan cuentas externas (pagos, git push, tokens).
- Está aprendiendo a programar — el código está comentado explicando el porqué, no solo el qué.
