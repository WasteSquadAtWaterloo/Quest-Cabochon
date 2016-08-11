var Player = function(id, x, y, map, initPack){
	var self = {
		x: x,
		y: y,
		map: map,		
		id: id,
		HP: 20,
		maxHP: 20,	
		dir: 'down',
		anim: null,
	};

	self.update = function(){	
		return;
	}

	self.getInitPack = function(){
		return {
			id: self.id,
			x: self.x, 
			y: self.y,
			HP: self.HP,
			maxHP: self.maxHP,	
			dir: self.dir,
			anim: self.anim,					
		};
	}

	self.getUpdatePack = function(){
		var animation = self.anim;
		self.anim = null;
		return {
			x: self.x,
			y: self.y,
			id: self.id,			
			HP: self.HP,
			maxHP: self.maxHP,
			dir: self.dir,
			anim: animation,
		};
	}

	Player.list[id] = self;
	initPack.players.push(self.getInitPack());
	return self;
}
Player.list = {};

Player.getAllInitPack = function(){
	var players = [];
	for (var i in Player.list)
		players.push(Player.list[i].getInitPack());
	return players;
}

Player.onConnect = function(socket, x, y, map, initPack){
	var player = Player(socket.id, x, y, map, initPack);

	socket.on('updatePos', function(data){
		player.x = data.x;
		player.y = data.y;
	});

	socket.on('playAnim', function(data){
		player.anim = data.anim;
	});

	setTimeout(function(){
		socket.emit('init', {
			selfId: socket.id,
			players: Player.getAllInitPack(),
		});
	}, 1000);	
}


Player.onDisconnect = function (socket, removePack){	
	delete Player.list[socket.id];
	removePack.players.push(socket.id);
}

Player.update = function(){
	var pack = [];
	for (var i in Player.list){
		var player = Player.list[i];
		player.update();
		pack.push(player.getUpdatePack());
	}
	return pack;
}

module.exports = Player;