# Pulso — Web de Privacidad

Web estática de la política de privacidad de la app **Pulso** (Grabadora
Periodista), construida con **Astro**. Se despliega en Firebase Hosting y se
sirve en:

- **URL:** `https://app-periodisimo.web.app/privacidad`
- **Referencia en la app:** `src/services/legal.js` (`PRIVACY_POLICY_URL`)

## Comandos

```bash
npm install      # instala dependencias
npm run dev      # servidor de desarrollo (http://localhost:4321)
npm run build    # build estático en web/dist/
npm run preview  # previsualiza el build localmente
```

## Despliegue

```bash
npm run build
firebase deploy --only hosting
```

`firebase.json` de la raíz apunta su `hosting.public` a `web/dist`.

## Estructura

```
web/
├── src/
│   ├── layouts/Layout.astro    # shell común (head, meta, header, footer)
│   ├── components/             # Header.astro y Footer.astro
│   ├── pages/privacidad.astro  # la política de privacidad
│   └── styles/global.css       # variables y estilos base
├── public/                     # estáticos (favicon, robots.txt…)
├── astro.config.mjs
└── package.json
```

## Notas

- La URL `/privacidad` se mantiene estable; no cambiar `legal.js` ni el
  `privacyPolicyUrl` de las tiendas sin desplegar antes.
- La carpeta `public/` de la raíz del repo (con `privacidad/` antiguo) se
  retira solo después de desplegar el nuevo build.