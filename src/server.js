
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

function recebeConexaoUsuario(socket) {
    socket.on('login', (nickname) => registraLoginUsuario(socket, nickname))
    socket.on('disconnect', () => console.log('Cliente desconectado: ' + socket.nickname))
    socket.on('chat msg', (msg) => encaminhaMsgsUsuarios(socket, msg))
    socket.on('status', (msg) => encaminhaMsgStatus(socket, msg))
}

function encaminhaMsgStatus(socket, msg) {
    console.log(msg)
    socket.broadcast.emit('status', msg)
}

function encaminhaMsgsUsuarios(socket, msg) {
    serverSocket.emit('chat msg', `${socket.nickname} diz: ${msg}`)
}

function registraLoginUsuario(socket, nickname) {
    socket.nickname = nickname
    const msg = nickname + ' conectou'
    console.log(msg)
    serverSocket.emit('chat msg', msg)
}

serverSocket.on('connect', recebeConexaoUsuario)

serverSocket.on('connection' , (socket => {
  console.log(`Cliente ${socket.id} conectado`)

  socket.on("message", (texto) => {
    console.log(`Msg recebido de ${socket.id} : ${texto}`)
    serverSocket.emit('message', texto)
  } )

  socket.on("status", (texto) =>    socket.broadcast.emit("status", socket.login + " " + texto))

  socket.on("login", (login) => socket.login = login)


}))
