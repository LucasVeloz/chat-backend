import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

interface Props {
  id: string;
  hour: Date;
  message: string;
}


const app = express();

app.get('/', (_, response) => response.send({
  message: 'deu bom'
}))

const serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

const chat: Props[] = [];
const users: String[] = []


io.on('connection', (socket) => {
  socket.on('connected', data => {
    socket.join('conversation');
    if (!users.find(element => element === data)) {
      users.push(data);
    };
  });

  socket.on('message', data => {
    if (users.find(element => element === data.id)) {
      chat.push(data);
      io.to('conversation').emit("chat", data);
    }
  })
})



serverHttp.listen(3333, () => console.log('Server is running! 🚀'))