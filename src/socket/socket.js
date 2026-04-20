import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false, // هنفتحه بعد اللوجين
});

export default socket;