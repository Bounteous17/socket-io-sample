const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { Server } = require('socket.io');


const corsOptions = {
  origin: '*'
}

const app = express();
app.use(cors(corsOptions))

const httpServer = createServer(app)


const httpPort = 6868;

const ioServer = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

// Socket app msgs
ioServer.on('connection', (client) => {
  console.log(
    `User ${client.id} connected, there are currently ${ioServer.engine.clientsCount} users connected`
  )

  //Add a new client indexed by his id
  clients[client.id] = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  }

  ioServer.sockets.emit('move', clients)

  client.on('move', ({ id, rotation, position }) => {
    clients[id].position = position
    clients[id].rotation = rotation

    ioServer.sockets.emit('move', clients)
  })

  client.on('disconnect', () => {
    console.log(
      `User ${client.id} disconnected, there are currently ${ioServer.engine.clientsCount} users connected`
    )

    //Delete this client from the object
    delete clients[client.id]

    ioServer.sockets.emit('move', clients)
  })
});

const server = httpServer.listen(httpPort, () => {
  console.log(`Listening on port ${httpPort} ...`)
});
