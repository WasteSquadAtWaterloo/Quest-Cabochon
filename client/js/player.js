var Player = function(initPack, selfId){	
	var self = {
		id: initPack.id,
		x: initPack.x, 
		y: initPack.y,
		HP: initPack.HP,
		maxHP: initPack.maxHP,
		map: initPack.map,
		dir: 'down',
	};

	//setup player properties	
	self.sprite = game.add.sprite(self.x, self.y, JSON.stringify(equip), playerFrames[self.dir].walk[0]);
	self.sprite.kill();
	
	self.sprite.anchor.setTo(0.5,0.5);
    game.physics.enable(self.sprite, Phaser.Physics.ARCADE);
    self.sprite.body.setSize(25, 20, 20, 45);

    //loading animations
    var dirs = ['down', 'up', 'left', 'right'];
    var acts = ['_melee', '_spell'];

    for (var dir in dirs){
        self.sprite.animations.add(dirs[dir], playerFrames[dirs[dir]].walk, 10, false);

        for (var act in acts){
            self.sprite.animations.add(dirs[dir]+acts[act], playerFrames[dirs[dir]][acts[act].slice(1)], 15, false);
        }

        for (var wp=1; wp<=3; wp++){
            self.sprite.animations.add(dirs[dir]+"_meleeOS"+wp, playerFrames[dirs[dir]]['attackOS'+wp], 15, false).onComplete.add(function(){
                self.sprite.loadTexture(JSON.stringify(equip), playerFrames[player_dir].walk[0]);
                self.sprite.body.setSize(25, 20, 19, 43);                
            });
        }
    }
    self.sprite.animations.add('dead', playerFrames.dead, 5, false);    

    if (selfId!==undefined) game.camera.follow(self.sprite);

    self.update = function(){
    	self.sprite.x = self.x;
    	self.sprite.y = self.y;     	
    }

    self.load = function(){
    	self.sprite.revive();
    	self.sprite.bringToTop();
    	loadLastLayer();
    }

    Player.list[self.id] = self;
    return self;
}
Player.list = {};

Player.update = function(){	
	for (var i in Player.list){
		if (Player.list[i].id !== selfId) Player.list[i].update();
	}
}

Player.loadAllOnMap = function(key){
	for (var i in Player.list){		
   		for (var i in Player.list){   			
   			if (Player.list[i].map === key){
   				game.add.existing(Player.list[i].sprite);
   			}   			
   		}
   		Player.list[selfId].sprite.bringToTop();
	}
	loadLastLayer();
}