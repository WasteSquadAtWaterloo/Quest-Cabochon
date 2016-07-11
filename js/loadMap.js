var map;
var NPC;
var healer, kid, storeClerk;
var healerBox, kidBox, storeClerkBox;

function loadMap(key, spawn_x, spawn_y, player_hp, bgn){
	if (!bgn){
        for (var enemy in enemys){
            enemys[enemy].destroy();
        }
		layer1.destroy();
		layer2.destroy();
		layer3.destroy();
		layer4.destroy();
		layer5.destroy();
		map.destroy();
	}

	map = game.add.tilemap(key);   
    map.addTilesetImage('roguelikeSheet_transparent','tiles');

    layer1 = map.createLayer(0); layer1.smoothed = false; layer1.setScale(3);
    layer2 = map.createLayer(1); layer2.smoothed = false; layer2.setScale(3);     
    layer3 = map.createLayer(2); layer3.smoothed = false; layer3.setScale(3);
    layer4 = map.createLayer(3); layer4.smoothed = false; layer4.setScale(3);

    initEnemys(key);
    initPlayer(spawn_x, spawn_y, player_hp);
    if (key=="map0"){
        NPC = game.add.group();
        NPC.enableBody = true;
        NPC.physicsBodyType = Phaser.Physics.ARCADE;

        healerBox =  game.add.sprite(-50, -50, "attackBox"); healerBox.scale.set(5); game.physics.enable(healerBox, Phaser.Physics.ARCADE); healerBox.name = "healerBox";
        kidBox =  game.add.sprite(-50, -50, "attackBox"); kidBox.scale.set(5); game.physics.enable(kidBox, Phaser.Physics.ARCADE); kidBox.name = "kidBox";
        storeClerkBox = game.add.sprite(-50, -50, "attackBox"); storeClerkBox.scale.set(5); game.physics.enable(storeClerkBox, Phaser.Physics.ARCADE); storeClerkBox.name = "storeClerkBox";
        
        healer = NPC.create(2790, 2050, 'healer'); healer.scale.set(1.2); healer.addChild(healerBox); 
        kid = NPC.create(3076, 2390, 'kid'); kid.scale.set(1.2); kid.addChild(kidBox);
        storeClerk = NPC.create(2264, 2580, 'clerk'); storeClerk.scale.set(1.2); storeClerk.addChild(storeClerkBox); 
    }

    layer5 = map.createLayer(4); layer5.smoothed = false; layer5.setScale(3);    
    layer1.resizeWorld(); 

    map.setCollisionByExclusion(stand,true,layer1);      
    map.setCollisionByExclusion(stand,true,layer2);  
    map.setCollisionByExclusion(stand,true,layer3);  
    map.setCollisionByExclusion(stand,true,layer4);  
    map.setCollisionByExclusion(stand,true,layer5);

}


function initPlayer(spawnX, spawnY, hp){
	player = game.add.sprite(spawnX, spawnY, JSON.stringify(equip), playerFrames.down.walk[0]);
    player.maxHealth = maxHealth;
    player.setHealth(hp);
    player.kill = function(){ 
        this.body.velocity.x = 0; this.body.velocity.y = 0;        
        this.alive = false;
        this.events.onKilled$dispatch(this);
        this.animations.play('dead');  

        return this
    }
    player.revive = function () {     
        this.x = spawn.x; this.y = spawn.y;

        this.alive = true;
        this.exists = true;
        this.visible = true;
        this.setHealth(this.maxHealth); 
        updateHealthBar();       

        if (this.events)
        {
            this.events.onRevived$dispatch(this);
        }

        return this;
    }

    player.anchor.setTo(0.5,0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.setSize(25, 20, 20, 45);

    player.animations.add('down', playerFrames.down.walk, 10, false);
    player.animations.add('left', playerFrames.left.walk, 10, false);    
    player.animations.add('right', playerFrames.right.walk, 10, false);
    player.animations.add('up', playerFrames.up.walk, 10, false); 

    player.animations.add('down_melee', playerFrames.down.attack, 15, false);
    player.animations.add('left_melee', playerFrames.left.attack, 15, false);    
    player.animations.add('right_melee', playerFrames.right.attack, 15, false);
    player.animations.add('up_melee', playerFrames.up.attack, 15, false); 

    player.animations.add('dead', playerFrames.dead, 5, false); 

    game.camera.follow(player);
}