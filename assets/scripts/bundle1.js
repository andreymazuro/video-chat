(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var socket = io();


if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true, audio: false}, handleVideo, videoError);
}

function handleVideo(stream) {
  var video = document.getElementById('videoElement')
  video.src = window.URL.createObjectURL(stream)
}

function videoError(e) {
    console.log(e)
}


socket.on('rooms', function(data){
  document.getElementById('roomslist').innerHTML = ''
  data.rooms.map(function(item){
    var roomslist = document.getElementById('roomslist')
    var room = document.createElement('li')
    var name = document.createElement('a')
    name.innerHTML = item
    name.href = window.location.href + item
    name.className = "list-group-item list-group-item-action list-group-item-success"
    room.appendChild(name)
    roomslist.appendChild(room)
  })
})


window.onload=function(){

  document.getElementById('addroom').addEventListener('click', function(){
    var roomName = document.getElementById('roomname').value
    window.location.href =  window.location.href + roomName
    document.getElementById('roomname').value = ''
    socket.emit('newRoom', roomName)
  })

  document.getElementById('roomname').addEventListener('keypress', function(e){
    var key = e.which || e.keyCode;
    if (key === 13) {
    var roomName = document.getElementById('roomname').value
    window.location.href =  window.location.href + roomName
    document.getElementById('roomname').value = ''
    socket.emit('newRoom', roomName)
    }
  })

}

},{}]},{},[1]);
