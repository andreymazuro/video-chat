var app = require('express')();
var express = require('express')
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('assets'))



app.get('/', function(req, res){
  res.sendfile('assets/views/main.html');
});

app.get('*', function(req,res){
  res.sendfile('assets/views/room.html')
})

var count = {}
var rooms = {}
var komn = []

io.on('connection', function(socket){
  console.log('user connected')


  io.sockets.emit('rooms', {rooms: komn})


  socket.on('newRoom', function(data){
    komn.push(data)
    io.sockets.emit('rooms', {rooms: komn})
  })


  socket.on('url', function(data){

    socket.on('disconnect', function(){
      var roomname = data
      delete rooms[roomname]
      delete count[roomname]
      komn.map(function(item,index){
        if (item == roomname){
          komn.splice(index,1)
        }
      })
      io.sockets.emit('rooms', {rooms: komn})

    })


    socket.join(data);
    if (!count[data]) {
      count[data] = [1]
    } else {
      count[data] = [2]
    }


    if (count[data] == 1) {
      socket.emit('initiator', {init: true})
    } else {
      socket.emit('initiator', {init: false})
    }

    if (count[data] == 2) {
      if (rooms[data] !== undefined) {
        socket.emit('firstId', {id:rooms[data][0]})
      }
    }


})



  socket.on('mainId', function(id){

    var roomname = id[0]
    var signal = id[1]
      if (rooms[roomname]) {
        rooms[roomname].push(signal)
      } else {
        rooms[roomname] = [signal]
      }

      if (rooms[roomname].length == 1 && count[roomname] == 2){
        socket.in(roomname).broadcast.emit('firstId', {id:rooms[roomname][0]})
      }


      if (rooms[roomname].length == 2) {
         socket.in(roomname).broadcast.emit('firstId', {id:rooms[roomname][1]})
         komn.map(function(item,index){
           if (item == roomname){
             komn.splice(index,1)
           }
         })
         delete rooms[roomname]
         delete count[roomname]
         io.sockets.emit('rooms', {rooms: komn})
      }

       })



  })


var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on localhost:3000');
});
