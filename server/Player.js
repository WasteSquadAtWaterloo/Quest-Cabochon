var Player = function(id, x, y, map, initPack){
	var self = {
		x: x,
		y: y,
		map: map,		
		id: id,
		HP: 20,
		maxHP: 20,		
		anim: null,
	};

	self.update = function(){
		//map portals	
		if (self.map==="map0"){
	        if ((self.y>=227 && self.y<=303) && self.x<95){	        	
	        	self.x = 1728; self.y = 2088; self.map = 'map1';	            
	        }
	        else if ((self.x>=828 && self.x<=947) && self.y>1275){
	            self.x = 2616; self.y = 216; self.map = 'map2';
	        }
	    }
	    else if (self.map==='map1'){
	        if ((self.y>=2051 && self.y<=2127) && self.x>1780){
	            self.x = 96, self.y = 264; self.map = 'map0';
	        }
	    }
	    else if (self.map==='map2'){
	        if ((self.x>=2556 && self.x<=2675) && self.y<200){
	            self.x = 888; self.y = 1248; self.map = 'map0';
	        } 
	        else if ((self.x>=2076 && self.x<=2243) && self.y>1900){
	            self.x = 1274; self.y = 0; self.map = 'map3';
	        }
	        else if ((self.y>=630 && self.y<=735) && self.x>3360){
	            self.x = 8; self.y = 3407; self.map = 'map4';
	        }
	    }
	    else if (self.map==='map3'){
	        if (self.y<0){
	            self.x = 2160; self.y = 1872; self.map = 'map2';
	        }
	    }
	    else if (self.map==="map4"){
	        if ((self.y>=3347 && self.y<=3471) && self.x<0){
	            self.x = 3344; self.y = 672; self.map = 'map2';
	        }
	        else if ((self.x>=1548 && self.x<=1667) && self.y<0){
	            self.x = 480; self.y = 928; self.map = 'map5';
	        }
	    }
	    else if (self.map==="map5"){
	        if (self.y>960){
	            self.x = 1612, self.y = 35; self.map = 'map4';
	        }
	    }
	}

	self.getInitPack = function(){
		return {
			id: self.id,
			x: self.x, 
			y: self.y,
			HP: self.HP,
			maxHP: self.maxHP,
			map: self.map,				
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
			map: self.map,
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
		player.dir = data.anim;
	});

	socket.emit('init', {
		selfId: socket.id,
		players: Player.getAllInitPack(),
	});
		
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