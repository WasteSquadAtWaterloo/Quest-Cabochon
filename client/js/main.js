var socket = io();

var game = new Phaser.Game(window.innerWidth-20, window.innerHeight-20, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render }, false);//, false);

var map;
var layer1, layer2, layer3, layer4, layer5;
var cursors, wasd;

var equip = {
    armor: "none",    
    hat: "none"
}

var selfId = null;

function create(){	
	//game.time.desiredFps = 80;
	$(window).resize(resizeComponents);

	loadMap('map0', 1152, 624, true);

	socket.on('init', function(data){				
		if (data.selfId){			
			selfId = data.selfId;
		}

		if (data.players.length){
			for (var i=0; i<data.players.length; i++){		
				if (!Player.list[data.players[i].id]){					
					var player = new Player(data.players[i], data.selfId);
					console.log('NEW PLAYER',data.selfId, player.id);
					if (data.selfId || player.map === 'map0')
						player.load();										
				}				
			}
		}			
	});

	socket.on('update', function(data){
		for (var i=0; i<data.players.length; i++){
			var pack = data.players[i];
			var p = Player.list[pack.id];			
			if (p){				
				p.x = pack.x;
				p.y = pack.y;
				p.maxHP = pack.maxHP;
				if (pack.dir) p.dir = pack.dir;
				if (pack.anim) p.sprite.play(pack.anim);
				if (pack.map !== map.key){					
					if (pack.id === selfId)
						loadMap(pack.map, pack.x, pack.y, false);
					else if (p.sprite.alive)
						p.sprite.kill();
				}
				else if (pack.id !== selfId && !p.sprite.alive){
					p.load();
				}
			}			
		}
	});

	socket.on('remove', function(data){
		for (var i=0; i<data.players.length; i++){
			Player.list[data.players[i]].sprite.destroy();
			delete Player.list[data.players[i]];
		}
	});

	initInput();
	
	socket.emit('ready');
}

function update(){
	if (selfId){
		Player.update();

		var player = Player.list[selfId].sprite;

		game.physics.arcade.collide(player, layer1);
        game.physics.arcade.collide(player, layer2);
        game.physics.arcade.collide(player, layer3);
        game.physics.arcade.collide(player, layer4);
        //game.physics.arcade.collide(player, layer5); 

		player.body.velocity.set(0);

		if (cursors.left.isDown || wasd.left.isDown){
	        player.body.velocity.x = -750;	       
	        socket.emit('playAnim', {id:selfId, anim:'left'});
	    }
	    else if (cursors.right.isDown || wasd.right.isDown){
	        player.body.velocity.x = 750;	                       
	        socket.emit('playAnim', {id:selfId, anim: 'right'});
	    }
	    else if (cursors.up.isDown || wasd.up.isDown){
	        player.body.velocity.y = -750;	                      
	    	socket.emit('playAnim', {id:selfId, anim: 'up'});
	    }
	    else if (cursors.down.isDown || wasd.down.isDown){ 
	        player.body.velocity.y = 750;	                       
	        socket.emit('playAnim', {id:selfId, anim: 'down'});
	    }

	    socket.emit('updatePos', {id:selfId, x:player.x, y:player.y});    
	}
    
    for (var i in Player.list){
    	var pl = Player.list[i];
    	if (pl.sprite.animations.currentAnim.isFinished){    		
    		pl.sprite.frame = playerFrames[pl.dir].walk[0];
    	}
    }      
}

function render(){

}


function resizeComponents(){
    game.scale.setGameSize(window.innerWidth-20, window.innerHeight-20);
}

function initInput(){
    cursors = game.input.keyboard.createCursorKeys(); 
    wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        E: game.input.keyboard.addKey(Phaser.Keyboard.E),
        Q: game.input.keyboard.addKey(Phaser.Keyboard.Q),
        C: game.input.keyboard.addKey(Phaser.Keyboard.C),
        space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };
    game.input.mouse.capture = true;
}

socket.on('addToConsole', function(data){
	console.log(data);
});
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');
chatForm.onsubmit = function(e){
	e.preventDefault();	
	socket.emit('sendCmdToServer', chatInput.value);	
}