// Get Current Environment And Set BaseUrl
// export function baseUrlHandler() {
//   return JSON.parse(import.meta.env.VITE_PRODUCTION_ENV)
//     ? import.meta.env.VITE_BACKEND_BASE
//     : import.meta.env.VITE_BACKEND_BASE_LOCAL;
// }


export const baseUrlHandler = () =>
  import.meta.env.VITE_PRODUCTION_ENV === "true"
    ? import.meta.env.VITE_BACKEND_BASE
    : import.meta.env.VITE_BACKEND_BASE_LOCAL;


