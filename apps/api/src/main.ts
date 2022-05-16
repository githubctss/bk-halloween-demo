import * as http from 'http';
import * as express from 'express';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: '/device/socket.io/',
  cors: {
    origin: '*',
    allowedHeaders: ['my-custom-header'],
  },
});
const port = process.env.port || 3333;

app.get('/api', (req, res) => {
  res.sendStatus(200);
});

io.on('connection', (socket) => {
  socket.on('DEVICE_JOIN', (data) => {
    console.log('>>> Data recieved')
    io.emit('DEVICE_SENSOR_INFO', data);
  })
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
