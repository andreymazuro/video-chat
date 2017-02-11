navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

navigator.getUserMedia({video: true, audio: true}, function(stream){
  var socket = io();
  var Peer = require('simple-peer')
  var peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false,
    stream: stream,
    config: { iceServers: [ {  url: "stun:stun.l.google.com:19302"
  ,
    url: "stun.l.google.com:19302"
  ,
    url: "stun1.l.google.com:19302"
  ,
    url: "stun2.l.google.com:19302"
  ,
    url: "stun3.l.google.com:19302"
  ,
    url: "stun4.l.google.com:19302"
  ,
    url: "stun01.sipphone.com"
  ,
    url: "stun.ekiga.net"
  ,
    url: "stun.fwdnet.net"
  ,
    url: "stun.ideasip.com"
  ,
    url: "stun.iptel.org"
  ,
    url: "stun.rixtelecom.se"
  ,
    url: "stun.schlund.de"
  ,
    url: "stunserver.org"
  ,
    url: "stun.softjoys.com"
  ,
    url: "stun.voiparound.com"
  ,
    url: "stun.voipbuster.com"
  ,
    url: "stun.voipstunt.com"
  ,
    url: "stun.voxgratia.org"
  ,
    url: "stun.xten.com" } ] },
  })

  document.getElementById('send').addEventListener('click', function(){
    var yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)
    document.getElementById('messages').innerHTML += '<li><b>' + 'Me: ' + yourMessage + '</b></li>'
    document.getElementById('yourMessage').value = ''
    var objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
  })

  document.getElementById('yourMessage').addEventListener('keypress', function(e){
    var key = e.which || e.keyCode;
    if (key === 13) {
    var yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)
    document.getElementById('messages').innerHTML += '<li><b>' + 'Me: ' + yourMessage + '</b></li>'
    document.getElementById('yourMessage').value = ''
    var objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
  }
  })


  socket.on('firstId', function(data){
    peer.signal(data.id)
   })

  peer.on('signal', function(data){
    socket.emit('mainId', JSON.stringify(data))
  })

  peer.on('data', function(data){
    document.getElementById('messages').innerHTML += '<li><b>' + 'Guest: ' + data + '</b></li>'
  })

  peer.on('stream', function(stream){
    var video = document.createElement('video')
    document.getElementById('video').appendChild(video)
    video.src = window.URL.createObjectURL(stream)
    video.play()
  })
}, function(err) {
  console.error(err)
})
