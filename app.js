var app = require('express')();
var express = require('express')
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('assets'))



app.get('/', function(req, res){
  res.sendfile('index.html');
});

var users = []
var count = 0

io.on('connection', function(socket){
  console.log('user connected')
  count++
  socket.on('disconnect', function() {
    console.log('user disconnected')
    if (count !== 0) {   count-- }
    if (count == 0) { users = []}
  })

    socket.on('mainId', function(data){
    users.push(data)

    if (count == 2 && users[1] == undefined) {
      socket.broadcast.emit('firstId', {id:users[0]})
    }

    if (users.length == 2) {
       socket.broadcast.emit('firstId', {id:users[1]})
       users = []
       count = 0
    }
    })

    if (count == 2 && users[0] !== undefined) {
      socket.emit('firstId', {id:users[0]})
    }

  })

var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on localhost:3000');
});
