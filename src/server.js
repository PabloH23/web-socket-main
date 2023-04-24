
const express  = require('express')

const app = express()
app.use(express.static('public'))
const http  = require( 'http').createServer(app)

const serverSocket = require('socket.io')(http) 



const PORT = process.env.PORT || 8000

http.listen(PORT, () => {
  console.log(`SERVER PORT ${PORT}`)
})

app.get("/" , (require  , response) => {
  response.sendFile(__dirname + '/page/index.html')
})

serverSocket.on('connection' , (socket => {
  console.log(`Cliente ${socket.id} conectado`)

  socket.on("message", (texto) => {
    console.log(`Msg recebido de ${socket.id} : ${texto}`)
    serverSocket.emit('message', texto)
  } )

  socket.on("status", (texto) =>    socket.broadcast.emit("status", socket.login + " " + texto))

  socket.on("login", (login) => socket.login = login)


}))