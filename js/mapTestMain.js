var game = new Phaser.Game(window.innerWidth-20, window.innerHeight-20, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });


function preload() {
    game.load.tilemap('map', 'assets/Map/lev1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/Spritesheet/roguelikeSheet_transparent.png');


    game.load.spritesheet('{"armor":"none","weapon":"none"}', 'assets/Spritesheet/player/default.png', 64, 64);
    game.load.spritesheet('{"armor":"leather","weapon":"none"}', 'assets/Spritesheet/player/armor0.png', 64, 64);
    game.load.spritesheet('{"armor":"plate","weapon":"none"}', 'assets/Spritesheet/player/armor1.png', 64, 64);
    game.load.spritesheet('{"armor":"gold","weapon":"none"}', 'assets/Spritesheet/player/armor2.png', 64, 64);

    game.load.spritesheet('spider', 'assets/Spritesheet/monsters/spider.png', 35, 35);
}

var map;
var layer1,layer2,layer3,layer4,layer5;
var cursors, wasd, melee;
var player;
var playerHealth, playerMaxHealth; playerHealth = playerMaxHealth = 10;
var player_dir = 'down';
var dir = playerFrames.default.down.walk[0];
var equip = {
    armor: "none",
    weapon: "none",
}
var spiders;

function create() {   

    $(window).resize(function(){
        game.scale.setGameSize(window.innerWidth-20, window.innerHeight-20);
    });

    map = game.add.tilemap('map');   
    map.addTilesetImage('roguelikeSheet_transparent','tiles');  

    Phaser.Canvas.setSmoothingEnabled(this.game.context, false);

    layer1 = map.createLayer(0); layer1.smoothed = false; layer1.setScale(3);
    layer2 = map.createLayer(1); layer2.smoothed = false; layer2.setScale(3);     
    layer3 = map.createLayer(2); layer3.smoothed = false; layer3.setScale(3);
    layer4 = map.createLayer(3); layer4.smoothed = false; layer4.setScale(3);    
        
    spiders = game.add.group();
    spiders.enableBody = true;
    spiders.physicsBodyType = Phaser.Physics.ARCADE;
    createSpiders();

    player = game.add.sprite(2400, 2400, JSON.stringify(equip), playerFrames.default.down.walk[0]);

    layer5 = map.createLayer(4); layer5.smoothed = false; layer5.setScale(3);


    layer1.resizeWorld();   

    map.setCollisionByExclusion(stand,true,layer1);      
    map.setCollisionByExclusion(stand,true,layer2);  
    map.setCollisionByExclusion(stand,true,layer3);  
    map.setCollisionByExclusion(stand,true,layer4);  
    map.setCollisionByExclusion(stand,true,layer5);

    player.scale.set(1);
    player.anchor.setTo(0.5,0.5);

    player.animations.add('down', playerFrames.default.down.walk, 10, false);
    player.animations.add('left', playerFrames.default.left.walk, 10, false);    
    player.animations.add('right', playerFrames.default.right.walk, 10, false);
    player.animations.add('up', playerFrames.default.up.walk, 10, false); 

    player.animations.add('down_melee', playerFrames.default.down.attack, 15, false);
    player.animations.add('left_melee', playerFrames.default.left.attack, 15, false);    
    player.animations.add('right_melee', playerFrames.default.right.attack, 15, false);
    player.animations.add('up_melee', playerFrames.default.up.attack, 15, false); 

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.setSize(25, 15,20, 40);    



    cursors = game.input.keyboard.createCursorKeys(); 
    wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        E: game.input.keyboard.addKey(Phaser.Keyboard.E),
        Q: game.input.keyboard.addKey(Phaser.Keyboard.Q),
    };
    game.input.mouse.capture = true;

    wasd.E.onDown.add(function(){
        equip.armor = "plate";
        player.loadTexture(JSON.stringify(equip), dir, true);
    });

    wasd.Q.onDown.add(function(){
        equip.armor = "none";
        player.loadTexture(JSON.stringify(equip), dir, true);
    });
    
    game.camera.follow(player);
}


function update() {    
    game.physics.arcade.collide(player, layer1);
    game.physics.arcade.collide(player, layer2);
    game.physics.arcade.collide(player, layer3);
    game.physics.arcade.collide(player, layer4);
    game.physics.arcade.collide(player, layer5);     

    player.body.velocity.set(0);
    
    if (cursors.left.isDown || wasd.left.isDown){
        player.body.velocity.x = -500;
        player.play('left');
        //dir = playerFrames.default.left.walk[0];
        player_dir = 'left';
    }
    else if (cursors.right.isDown || wasd.right.isDown){
        player.body.velocity.x = 500;
        player.play('right');
        //dir = playerFrames.default.right.walk[0];
        player_dir = 'right';
    }
    else if (cursors.up.isDown || wasd.up.isDown){
        player.body.velocity.y = -500;
        player.play('up');
        //dir = playerFrames.default.up.walk[0];
        player_dir = 'up';
    }
    else if (cursors.down.isDown || wasd.down.isDown){
        player.body.velocity.y = 500;
        player.play('down');
        //dir = playerFrames.default.down.walk[0];
        player_dir = 'down';
    }

    else if (game.input.activePointer.leftButton.isDown){ //else if (melee_animation_is_playing){ //melee.isDown
        melee_animation_is_playing = false;

        //Calculate direction        
        var player_screen_x = player.position.x - game.camera.x;
        var player_screen_y = player.position.y - game.camera.y;
        var dif_x = game.input.mousePointer.x - player_screen_x;
        var dif_y = game.input.mousePointer.y - player_screen_y;

        if (Math.abs(dif_x) >= Math.abs(dif_y)){
            player_dir = dif_x>=0 ? 'right' : 'left';
        }
        else if (Math.abs(dif_x) <= Math.abs(dif_y)){
            player_dir = dif_y>=0 ? 'down' : 'up';
        }
        player.play(player_dir+"_melee");
    }
    else if (player.animations.currentAnim.isFinished){        
        player.frame = playerFrames.default[player_dir].walk[0];
    }       


    game.physics.arcade.overlap(player, spiders, spiderCollisionHandler, null, this);
}

function render() {
    spiders.forEach(function(mob){
        //game.debug.body(mob);
    });
}

function createSpiders(){

    for (var i=1; i<=2; i++){
        for (var j=1; j<=2; j++){
            var spider = spiders.create(Math.random()*480+480*i, Math.random()*480+480*j, "spider");
            spider.anchor.setTo(0.5, 0.5);     
            spider.scale.set(1.5);       
            spider.animations.add('move', enemyFrames.spider.down.walk, 10, true);              
            spider.play('move');
            spider.body.moves = false;
        }
    }

    spiders.x = 480;
    spiders.y = 480;
    spiders.forEach(function(mob){
        game.add.tween(mob).to( { x: Math.random()*200 }, Math.random()*5000+5000, Phaser.Easing.Linear.None, true, 0, 1000, true);        
        
    });
    
}

function meleeAnimation() {
    // if (player_dir === 'down'){
    //     player.play('down_melee');
    //     console.log(player_dir);

    // }
    // else if (player_dir === 'left'){
    //     player.play('left_melee');
    //     console.log(player_dir);

    // }
    // else if (player_dir === 'right'){
    //     player.play('right_melee');
    //     console.log(player_dir);

    // }
    // else if (player_dir === 'up'){
    //     player.play('up_melee');
    //     console.log(player_dir);  

    // }
    melee_animation_is_playing = true;

}
function spiderCollisionHandler(player, spider) {
    spider.kill();
    playerHealth -= 3;
    if (playerHealth <= 0) {
        playerDied();
    }
}
function playerDied() {
    player.kill()
    
}

