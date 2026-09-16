# Guía de despliegue — Web de privacidad (Pulso)

Documento paso a paso para desplegar la web de privacidad construida con Astro
de forma **independiente** del proyecto de la app. Al final, la URL pública es:

```
https://pulsoapp.web.app/privacidad/
```

---

## 0. Qué vamos a hacer y por qué

La web vive en su propio repo (`PulsoLegalWeb`) y su propio proyecto de Firebase
(`pulsoappgrab`, cuyo hosting se llama `pulsoapp`). La app (`appPeriodism`)
tiene su propio proyecto (`app-periodisimo`).

El objetivo es que la web se despliegue **sola**, sin tener que tocar el repo de
la app. Así, cuando mañana añadas una página a la web, solo trabajas y despliegas
desde `PulsoLegalWeb`.

Para eso necesitamos dos archivos de configuración en el repo de la web:

- `firebase.json` → le dice a Firebase **qué** desplegar (la carpeta `dist/`).
- `.firebaserc` → le dice a Firebase **en qué proyecto** desplegar.

Sin esos archivos, el comando `firebase deploy` no sabe ni qué subir ni adónde.

---

## 1. Prerrequisitos (comprobar una vez)

Abre una terminal y verifica que tienes:

```bash
node --version      # debe dar algo como v20 o superior
npm --version
firebase --version  # debe dar 10 o superior
```

Si `firebase` no existe, instálalo:
```bash
npm install -g firebase-tools
```

Y comprueba que estás logueado:
```bash
firebase login
```
Esto abre el navegador para que inicies sesión con la cuenta de Google que
creó el proyecto `pulsoappgrab`.

---

## 2. Entender la estructura del repo de la web

```
PulsoLegalWeb/
└── web/
    ├── src/                ← código fuente Astro (layouts, componentes, páginas)
    ├── dist/               ← salida del build (lo que se sube a Firebase)
    ├── astro.config.mjs
    ├── package.json
    ├── firebase.json       ← LO CREARÁS EN EL PASO 3
    └── .firebaserc         ← LO CREARÁS EN EL PASO 4
```

Importante: `dist/` es el resultado de `npm run build`. Firebase Hosting sirve
**exactamente** lo que hay dentro de `dist/`, así que todo lo que quieras ver en
la web debe estar generado ahí.

---

## 3. Crear `firebase.json` (decide qué se sube)

Crea el archivo `PulsoLegalWeb/web/firebase.json` con este contenido:

```json
{
  "hosting": {
    "site": "pulsoapp",
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}
```

Explicación campo a campo:

| Campo | Qué significa |
|---|---|
| `hosting` | Configuración del servicio Firebase Hosting. |
| `site` | El identificador del sitio hosting. Es `pulsoapp`, el que creaste en el proyecto `pulsoappgrab`. Debe coincidir exactamente con el que aparece en la consola de Firebase. |
| `public` | La carpeta que se sube tal cual. Como Astro genera en `dist/`, apuntamos ahí. |
| `ignore` | Archivos que Firebase ignora al subir (nunca subir `firebase.json` ni `node_modules`). |

> Nota: `"site"` solo se usa cuando el proyecto tiene varios sitios hosting.
> Como el proyecto `pulsoappgrab` tiene el sitio `pulsoapp`, hay que indicarlo
> para que no intente usar el sitio por defecto.

---

## 4. Crear `.firebaserc` (decide a qué proyecto se sube)

Crea el archivo `PulsoLegalWeb/web/.firebaserc`:

```json
{
  "projects": {
    "default": "pulsoappgrab"
  }
}
```

Explicación:

- `default` es el proyecto que se usará cuando ejecutes `firebase deploy` sin
  indicar `--project`.
- El ID es `pulsoappgrab` (el proyecto que creaste llamado "pulso"). Puedes
  comprobarlo con `firebase projects:list`.

Con esto, desplegar desde esta carpeta siempre subirá al proyecto correcto sin
tener que escribirlo en cada comando.

---

## 5. Generar el build (crear `dist/`)

Antes de desplegar hay que construir la web. Desde la carpeta del proyecto Astro:

```bash
cd S:\AppPeriodism\PulsoLegalWeb\web
npm run build
```

Qué pasa aquí:

- Astro lee tu `src/`, ejecuta las páginas y escribe el HTML/CSS/JS estático
  en `dist/`.
- Verifica el resultado: debe existir
  `dist/privacidad/index.html`. Ese archivo es la URL `/privacidad/`.

Para ver el resultado en local antes de publicar:

```bash
npm run preview
```
Abre lo que te indique (normalmente `http://localhost:4321/`). Pruébalo: la raíz
debe redirigir a `/privacidad/`.

---

## 6. Desplegar

Con el build hecho y los dos archivos de configuración creados:

```bash
cd S:\AppPeriodism\PulsoLegalWeb\web
firebase deploy --only hosting
```

Explicación:

- `--only hosting` limita el despliegue a Hosting (no toca funciones, Firestore,
  etc., que este proyecto ni siquiera tiene).
- Firebase sube el contenido de `dist/` al sitio `pulsoapp` del proyecto
  `pulsoappgrab`.

Al terminar verás un mensaje con la URL pública, algo así como:

```
✔  Deploy complete!
Hosting URL: https://pulsoapp.web.app
```

---

## 7. Verificar en producción

Comprueba que la URL responde:

```bash
Invoke-WebRequest -Uri "https://pulsoapp.web.app/privacidad/" -UseBasicParsing
```

Debe devolver `StatusCode: 200`. También puedes abrirla en el navegador.

---

## 8. Siguientes cambios en la web (flujo normal)

Cuando mañana edites la web (añadir una página, cambiar texto, estilos):

```bash
cd S:\AppPeriodism\PulsoLegalWeb\web
npm run build        # regenera dist/
firebase deploy --only hosting
```

Solo tocas el repo de la web. La app no se ve afectada.

---

## 9. Actualizar la app (solo una vez)

La app (`appPeriodism`) apunta a la URL de privacidad. Hay que cambiarla a la
nueva:

1. Editar `src/services/legal.js`:
   ```js
   export const PRIVACY_POLICY_URL = 'https://pulsoapp.web.app/privacidad/';
   ```
2. Quitar el bloque `hosting` del `firebase.json` de la app, porque ahora el
   hosting lo gestiona la web. Si se dejara, el `site: pulsoapp` rompería el
   `firebase deploy` de la app (ese sitio no existe en `app-periodisimo`).

> La URL en Google Play / App Store (`privacyPolicyUrl`) también debería
> actualizarse a la nueva cuando toque.

---

## 10. Checklist de cierre

- [ ] `firebase login` iniciado.
- [ ] `PulsoLegalWeb/web/firebase.json` existe con `site: pulsoapp` y `public: dist`.
- [ ] `PulsoLegalWeb/web/.firebaserc` existe con `default: pulsoappgrab`.
- [ ] `npm run build` genera `dist/privacidad/index.html`.
- [ ] `firebase deploy --only hosting` termina con `Deploy complete`.
- [ ] `https://pulsoapp.web.app/privacidad/` responde 200.
- [ ] `legal.js` de la app actualizado a la nueva URL.
- [ ] Bloque `hosting` eliminado del `firebase.json` de la app.

---

## Conceptos clave (para aprender)

| Concepto | Idea |
|---|---|
| **Build** | Transformar el código fuente (Astro) en archivos estáticos listos para servir (`dist/`). |
| **Firebase Hosting** | Servicio que sirve archivos estáticos en una URL pública. |
| **Sitio hosting** | Identificador dentro de un proyecto (`pulsoapp`). Un proyecto puede tener varios sitios. |
| **Proyecto Firebase** | Contenedor de servicios (`pulsoappgrab`). El `site` vive *dentro* del proyecto. |
| **`firebase.json`** | Configuración local de qué servicios y qué carpetas desplegar. |
| **`.firebaserc`** | Configuración local de a qué proyecto apuntar por defecto. |
| **`--only hosting`** | Limita el deploy a un solo servicio (más rápido y seguro). |