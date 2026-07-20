import { io } from "socket.io-client";

let socket = null;

function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_BASE_URL, {
      transports: ["websocket"],
    });
  }
  return socket;
}

export function subscribeToDataUpdates(callback) {
  const activeSocket = getSocket();
  activeSocket.on("data-updated", callback);
  return () => activeSocket.off("data-updated", callback);
}
