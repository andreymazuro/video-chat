navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

navigator.getUserMedia({video: true, audio: true}, function(stream){
  var socket = io();
  var Peer = require('simple-peer')
  var peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false,
    stream: stream
  })

  socket.on('firstId', function(data){
    peer.signal(data.id)
   })

  peer.on('signal', function(data){
    socket.emit('mainId', JSON.stringify(data))
  })

  peer.on('stream', function(stream){
    var video = document.createElement('video')
    document.body.appendChild(video)
    video.src = window.URL.createObjectURL(stream)
    video.play()
  })
}, function(err) {
  console.error(err)
})
