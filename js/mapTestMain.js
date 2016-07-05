var game = new Phaser.Game(window.innerWidth-20, window.innerHeight-20, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });


function preload() {
    game.load.tilemap('map', 'assets/Map/sample_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/Spritesheet/roguelikeSheet_transparent.png');
    game.load.spritesheet('player', 'assets/Spritesheet/player1_weapon.png', 48, 48, 12);

}

var map;
var groundLayer,layer2,layer3,layer4,layer5;
var cursors;
var player;
var dir;

function create() {    
    map = game.add.tilemap('map');   
    map.addTilesetImage('Roguelike','tiles');  

    Phaser.Canvas.setSmoothingEnabled(this.game.context, false);

    groundLayer = map.createLayer(0); groundLayer.smoothed = false;groundLayer.setScale(3);
    layer2 = map.createLayer(1); layer2.smoothed = false; layer2.setScale(3);     
    layer3 = map.createLayer(2); layer3.smoothed = false; layer3.setScale(3);
    player = game.add.sprite(0,0, 'player', 1); 
    layer4 = map.createLayer(3); layer4.smoothed = false; layer4.setScale(3);
    layer5 = map.createLayer(4); layer5.smoothed = false; layer5.setScale(3);
    groundLayer.resizeWorld();

    var stand = [];
    for (var i=0; i<25; i++){
        for (var j=5; j<10; j++){
            stand.push(i*57+j+1);
        }
    }
    /*
    map.setCollisionByExclusion(stand,true,groundLayer);      
    map.setCollisionByExclusion(stand,true,layer2);  
    map.setCollisionByExclusion(stand,true,layer3);  
    map.setCollisionByExclusion(stand,true,layer4);  
    map.setCollisionByExclusion(stand,true,layer5); 
    */ 

    //fixedToCamera = true;

      
    player.smoothed = false;
    player.scale.set(1);

    player.animations.add('down', [0,1,2], 5, true);
    player.animations.add('left', [3,4,5], 5, true);    
    player.animations.add('right', [6,7,8], 5, true);
    player.animations.add('up', [9,10,11], 5, true);    

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.setSize(20,10, 15, 40);    
    cursors = game.input.keyboard.createCursorKeys();   
    
    game.camera.follow(player);
}


function update() {    
    game.physics.arcade.collide(player, groundLayer);
    game.physics.arcade.collide(player, layer2);
    game.physics.arcade.collide(player, layer3);
    game.physics.arcade.collide(player, layer4);
    game.physics.arcade.collide(player, layer5);

    player.body.velocity.set(0);

    if (cursors.left.isDown){
        player.body.velocity.x = -500;
        player.play('left');
        dir = 4;
    }
    else if (cursors.right.isDown){
        player.body.velocity.x = 500;
        player.play('right');
        dir = 7;
    }
    else if (cursors.up.isDown){
        player.body.velocity.y = -500;
        player.play('up');
        dir = 10;
    }
    else if (cursors.down.isDown){
        player.body.velocity.y = 500;
        player.play('down');
        dir = 1;
    }
    else {
        player.frame = dir;
    }

}

function render() {
    game.debug.body(player);
}