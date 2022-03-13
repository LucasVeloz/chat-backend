import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

interface Props {
  id: string;
  hour: Date;
  message: string;
}

const PORT = process.env.PORT || 3333;


const app = express();
app.use(express.json())

const serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

const chat: Props[] = [];
const users: String[] = []
const rooms: String[] = [];


app.get('/rooms', (_, response) => response.send(rooms))

app.post('/rooms', (request, response) => {
  const chat = request.body.chat;

  if(rooms.find(item => item === chat)) {
    response.status(400).send()
  }
  rooms.push(chat);

  response.status(201).send()
})

io.on('connection', (socket) => {
  socket.on('connected', data => {
    socket.join(data.room);
    if (!users.find(element => element === data.user)) {
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



serverHttp.listen(PORT, () => console.log('Server is running! 🚀'))