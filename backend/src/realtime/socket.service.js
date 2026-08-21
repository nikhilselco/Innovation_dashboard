const { Server } = require("socket.io");

let io = null;

function initSocket(server, allowedOrigins) {
  io = new Server(server, {
  path: "/innovation/socket.io",
  cors: { origin: allowedOrigins },
});

  io.on("connection", (socket) => {
    console.log(`[socket] client connected: ${socket.id}`);
    socket.on("disconnect", () => {
      console.log(`[socket] client disconnected: ${socket.id}`);
    });
  });

  return io;
}

function emitDataUpdated(payload) {
  if (io) io.emit("data-updated", payload);
}

module.exports = {
  initSocket,
  emitDataUpdated,
};
