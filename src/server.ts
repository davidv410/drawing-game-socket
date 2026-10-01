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
  console.log("a client connected:", socket.id)
})

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})