import { Server } from 'socket.io'
import { config } from 'dotenv'

const votes = { vue: 0, react: 0, blazor: 0 }

config()

const corsOrigins = [
  'http://localhost:5173',
  process.env.ORIGIN1 || '',
  process.env.ORIGIN2 || '',
]

type Who = 'vue' | 'react' | 'blazor';

const io = new Server({ cors: { origin: corsOrigins } },)
io.on('connection', function (socket) {

  io.emit('votes', votes)

  socket.on('disconnect', function () {
    console.log('disconnect: '.concat(socket.id))
  })

  socket.on('vote', (who: Who) => {
    votes[who]++
    socket.broadcast.emit('votes', votes)
    // io.emit('votes', votes)
  })

  socket.on('unvote', (who: Who) => {
    votes[who]--
    socket.broadcast.emit('votes', votes)
    // io.emit('votes', votes)
  })
})
io.listen(Number(process.env.PORT) || 3005)
