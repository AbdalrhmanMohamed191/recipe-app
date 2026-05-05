import { io } from "socket.io-client";

const URL =
  import.meta.env.VITE_PRODUCTION_ENV === "true"
    ? import.meta.env.VITE_BACKEND_BASE
    : import.meta.env.VITE_BACKEND_BASE_LOCAL;

const socket = io(URL, {
  autoConnect: false,
  
  transports: ["websocket" , "polling"], // مهم للاستقرار في production
});

export default socket;