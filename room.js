navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true, audio: false}, handleVideo, videoError);
}

function handleVideo(stream) {
  var video = document.getElementById('videoElementLittle')
  video.src = window.URL.createObjectURL(stream)
}

function videoError(e) {
    console.log(e)
}


navigator.getUserMedia({video: true, audio: true}, function(stream){
  var socket = io();
  var Peer = require('simple-peer')
  var servers = {
    iceServers: [
      {url:'stun:stun01.sipphone.com'},
      {url:'stun:stun.ekiga.net'},
      {url:'stun:stun.fwdnet.net'},
      {url:'stun:stun.ideasip.com'},
      {url:'stun:stun.iptel.org'},
      {url:'stun:stun2.l.google.com:19302'},
      {url:'stun:stun3.l.google.com:19302'},
      {url:'stun:stun4.l.google.com:19302'},
      {url:'stun:stunserver.org'},
      {url:'stun:stun.softjoys.com'},
      {url:'stun:stun.voiparound.com'},
      {url:'stun:stun.voipbuster.com'},
      {url:'stun:stun.voipstunt.com'},
      {url:'stun:stun.voxgratia.org'},
      {url:'stun:stun.xten.com'},
      {
        url: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
      }
    ]
  };

socket.emit('url', window.location.href.split('/')[3])

document.getElementById('welcome').innerHTML = 'Welcome to room, ' + window.location.href.split('/')[3]

socket.on('initiator', function(data){
  var peer = new Peer({
    initiator: data.init,
    trickle: false,
    stream: stream,
    config:  servers ,
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
    var send = [window.location.href.split('/')[3], data]
    socket.emit('mainId', send)
  })

  peer.on('data', function(data){
    document.getElementById('messages').innerHTML += '<li><b>' + 'Guest: ' + data + '</b></li>'
  })

  peer.on('stream', function(stream){
    var video = document.createElement('video')
    document.getElementById('big-video').appendChild(video)
    video.src = window.URL.createObjectURL(stream)
    video.play()
  })
})


}, function(err) {
  console.error(err)
})
