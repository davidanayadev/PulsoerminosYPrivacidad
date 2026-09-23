// Variables centrales del sitio. Cámbialas aquí y se actualizarán
// en todas las páginas (landing, privacidad, términos, eliminación de datos).

export const appName = "Pulso";
export const tagline = "Graba. Transcribe. Verifica";
export const taglineFull = `${appName} — ${tagline}`;

export const description =
  "Aplicación móvil para profesionales de la información: graba entrevistas, transcríbelas en tu dispositivo y verifica tus fuentes con inteligencia artificial.";

export const ownerName = "David García Arranz";

// Correo canónico (el que aparece en la web desplegada).
export const supportEmail = "infoanayateam@gmail.com";

// URL de la app en la tienda. Todavía no está publicada: enlaza a '#'
// hasta que haya una URL real (Google Play / App Store).
export const storeUrl = "#";

export const legalUrls = {
  privacy: "/privacidad",
  terms: "/terminos",
  deletion: "/eliminacion-de-datos",
};

export default {
  appName,
  tagline,
  taglineFull,
  description,
  ownerName,
  supportEmail,
  storeUrl,
  legalUrls,
};