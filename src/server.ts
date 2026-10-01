import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const server = express()
const httpServer = createServer(server)
const io = new Server(httpServer, {
  cors: { origin: "*" }
})

const PORT = process.env.PORT || 5000

server.use(express.json())

io.on("connection", (socket) => {
  const roomId = socket.handshake.query.roomId as string
  socket.join(roomId)
  console.log(`socket ${socket.id} joined room: ${roomId}`)
})

server.post("/broadcast", (req, res) => {
  const secret = req.headers["socket-secret"]
  if (secret !== process.env.SOCKET_SECRET) {
    return res.status(401).json({ error: "unauthorized" })
  }

  const { roomId, event, payload } = req.body
  if (!roomId || !event) {
    return res.status(400).json({ error: "roomId and event are required" })
  }

  io.to(roomId).emit(event, payload)
  res.json({ ok: true })
})

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})