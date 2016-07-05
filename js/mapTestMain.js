var game = new Phaser.Game(window.innerWidth-20, window.innerHeight-20, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });


function preload() {
    game.load.tilemap('map', 'assets/Map/level_1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/Spritesheet/roguelikeSheet_transparent.png');
    game.load.spritesheet('player', 'assets/Spritesheet/player/default.png', 64, 65);

}

var map;
var layer1,layer2,layer3,layer4,layer5;
var cursors;
var player;
var dir;

function create() {    
    map = game.add.tilemap('map');   
    map.addTilesetImage('roguelikeSheet_transparent','tiles');  

    Phaser.Canvas.setSmoothingEnabled(this.game.context, false);

    layer1 = map.createLayer(0); layer1.smoothed = false;layer1.setScale(2);
    layer2 = map.createLayer(1); layer2.smoothed = false; layer2.setScale(2);     
    layer3 = map.createLayer(2); layer3.smoothed = false; layer3.setScale(2);
    player = game.add.sprite(1600, 1600, 'player', playerFrames.default.down.walk[0]); 
    layer4 = map.createLayer(3); layer4.smoothed = false; layer4.setScale(2);  
    layer5 = map.createLayer(4); layer5.smoothed = false; layer5.setScale(2);      
    layer1.resizeWorld();

    var stand = [];
    for (var i=0; i<25; i++){
        for (var j=5; j<10; j++){
            stand.push(i*57+j+1);
        }
    }
    stand.push(541, 542, 543, 544, 545, 546, 547, 548, 549, 593, 650);
    
    map.setCollisionByExclusion(stand,true,layer1);      
    map.setCollisionByExclusion(stand,true,layer2);  
    map.setCollisionByExclusion(stand,true,layer3);  
    map.setCollisionByExclusion(stand,true,layer4);  
    map.setCollisionByExclusion(stand,true,layer5);     

    player.scale.set(1);

    player.animations.add('down', playerFrames.default.down.walk, 10, true);
    player.animations.add('left', playerFrames.default.left.walk, 10, true);    
    player.animations.add('right', playerFrames.default.right.walk, 10, true);
    player.animations.add('up', playerFrames.default.up.walk, 10, true);    

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.setSize(25, 15,20, 40);    
    cursors = game.input.keyboard.createCursorKeys();   
    
    game.camera.follow(player);
}


function update() {    
    game.physics.arcade.collide(player, layer1);
    game.physics.arcade.collide(player, layer2);
    game.physics.arcade.collide(player, layer3);
    game.physics.arcade.collide(player, layer4);
    game.physics.arcade.collide(player, layer5);

    player.body.velocity.set(0);

    if (cursors.left.isDown){
        player.body.velocity.x = -500;
        player.play('left');
        dir = playerFrames.default.left.walk[0];
    }
    else if (cursors.right.isDown){
        player.body.velocity.x = 500;
        player.play('right');
        dir = playerFrames.default.right.walk[0];
    }
    else if (cursors.up.isDown){
        player.body.velocity.y = -500;
        player.play('up');
        dir = playerFrames.default.up.walk[0];
    }
    else if (cursors.down.isDown){
        player.body.velocity.y = 500;
        player.play('down');
        dir = playerFrames.default.down.walk[0];
    }
    else {
        player.frame = dir;
    }

}

function render() {
    game.debug.body(player);
}