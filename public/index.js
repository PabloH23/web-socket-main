

$(() => {
  const socket = io()

  $("form").submit(() => {
      socket.emit("message",  $("#texto").val())
       return false
  })
  socket.on( 'message',(texto) => $('#messagens').append($('<li>').text(texto)) )



  let lastTime = new Date().getTime()
  $("#texto").keydown(() => {
    const interval = new Date().getTime() - lastTime
    if(interval > 800){

      socket.emit("status",  "Usuário está digitando")
      console.log("Usuário está digitando")
      lastTime = new Date().getTime()
    }

  })
  $("#texto").keyup(() => setTimeout (()  =>  socket.emit("status",  ""),  500 ))


  socket.on( "status",(texto) => $("#status").html(texto ))



})
