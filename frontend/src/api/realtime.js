import { io } from "socket.io-client";

let socket = null;

function getSocket() {
  if (!socket) {
    socket = io("/", {
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

export function subscribeToConnectionStatus(callback) {
  const activeSocket = getSocket();
  const handleConnect = () => callback(true);
  const handleDisconnect = () => callback(false);
  activeSocket.on("connect", handleConnect);
  activeSocket.on("disconnect", handleDisconnect);
  callback(activeSocket.connected);
  return () => {
    activeSocket.off("connect", handleConnect);
    activeSocket.off("disconnect", handleDisconnect);
  };
}
