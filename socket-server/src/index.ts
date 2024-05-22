import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" }));
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

var users: any[] = [];

app.get("/", (req, res) => {
  return res.send(users);
});
app.post("/clean", (req, res) => {
  users = [];
  return res.send(users);
});

io.on("connection", (socket) => {
  socket.on("message", (e) => {
    socket.broadcast.emit("message", e);
  });

  socket.on("user-join", (e) => {
    socket.broadcast.emit("user-join", e);
    users.push(JSON.parse(e));
  });
  socket.on("user-move", (e) => {
    socket.broadcast.emit("user-move", e);
  });
  socket.on("user-left", (e) => {
    socket.broadcast.emit("user-left", e);
    const { id } = JSON.parse(e);
    const i = users.findIndex((v) => v.id == id);
    users.splice(i, 1);
  });
});

server.listen(3030, () => {
  console.log("Server running on port 3030");
});
