var DEBUG = true;

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
	res.sendFile(__dirname+'/client/index.html');
});

app.use('/client', express.static(__dirname+'/client'));

serv.listen(process.env.PORT || 5550);
console.log('Server Initialized');

var Player = require('./server/Player');

var initPack = {players:[]};
var removePack = {players:[]};

var SOCKET_LIST = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	console.log(socket.id.toString().substring(0,5)+" connected");
	SOCKET_LIST[socket.id] = socket;

	Player.onConnect(socket, 100/*1152*/, 100/*624*/, 'map0', initPack);

	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket, removePack);
		console.log(socket.id.toString().substring(0,5)+" disconncted");
	});

	socket.on('sendCmdToServer', function(data){
		if (!DEBUG) 
			return;
		var res = eval(data);
		socket.emit('addToConsole', res);
	});

});

setInterval(function(){
	var pack = {
		players: Player.update(),
	};

	for (var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('init', initPack);
		socket.emit('update', pack);
		socket.emit('remove', removePack);
	}

	for (var i in initPack)
		initPack[i] = [];
	for (var i in removePack)
		removePack[i] = [];
}, 10);