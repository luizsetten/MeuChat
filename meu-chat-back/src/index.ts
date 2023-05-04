import express, { Request, Response } from "express";
import http from "http";
import * as WebSocket from "ws";
import * as uuid from "uuid";
import bodyParser from "body-parser";
import cors from "cors";

interface User {
  username: string;
  id: string;
}

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

let users: Array<User> = [];

app.post("/auth", (req: Request, res: Response) => {
  const { username } = req.body as { username: string };
  const usernameUsed = users.find((user) => user.username);

  if (usernameUsed)
    return res.status(400).send({
      message: `Nome de usuario ${username} não está disponível`,
    });

  const newUser = {
    username,
    id: uuid.v4(),
  };

  users.push(newUser);

  return res.send(newUser);
});

const wss = new WebSocket.Server({ server });

let sockets = [] as WebSocket[];

wss.on("connection", (socket: WebSocket) => {
  // Adicionamos cada nova conexão/socket ao array `sockets`
  sockets.push(socket);

  // Quando você receber uma mensagem, enviamos ela para todos os sockets
  socket.on("message", function (msg) {
    const { auth, message } = JSON.parse(msg.toString()) as {
      message: string;
      auth: string;
    };

    const userFound = users.find((user) => user.id === auth);
    if (!userFound) return;

    sockets.forEach((s) => s.send(`${userFound.username}: ${message}`));
  });

  // Quando a conexão de um socket é fechada/desconectada, removemos o socket do array
  socket.on("close", function () {
    sockets = sockets.filter((s) => s !== socket);
  });
});

server.listen(8080, () => {
  console.log(`Server started on port ws://localhost:8080 :)`);
});
