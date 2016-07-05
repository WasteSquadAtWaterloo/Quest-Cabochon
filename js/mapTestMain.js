var game = new Phaser.Game(window.innerWidth - 20, window.innerHeight -20, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/Map/sample_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/Spritesheet/roguelikeSheet_transparent.png');
    game.load.spritesheet('player', 'assets/Spritesheet/player1_weapon.png', 48, 48, 12);

}

var map;
var groundLayer,layer2,layer3,layer4,layer5;
var cursors;
var player;

function create() {

    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
    Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
    map = game.add.tilemap('map');    
    map.addTilesetImage('Roguelike','tiles'); 
    map.setCollisionByExclusion([63]);   
    //map.scale = {x:4, y:4};

    groundLayer = map.createLayer(0); groundLayer.smoothed = false;groundLayer.setScale(3);
    layer2 = map.createLayer(1); layer2.smoothed = false; layer2.setScale(3);
    layer3 = map.createLayer(2); layer3.smoothed = false; layer3.setScale(3);
    layer4 = map.createLayer(3); layer4.smoothed = false; layer4.setScale(3);
    layer5 = map.createLayer(4); layer5.smoothed = false; layer5.setScale(3);

    
    groundLayer.resizeWorld(); 
    //fixedToCamera = true;

    player = game.add.sprite(0,0, 'player', 1);    
    player.smoothed = false;
    player.scale.set(1);

    player.animations.add('down', [0,1,2], 5, true);
    player.animations.add('left', [3,4,5], 5, true);    
    player.animations.add('right', [6,7,8], 5, true);
    player.animations.add('up', [9,10,11], 5, true);    

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.setSize(20,10, 15, 40);
    game.camera.follow(player);
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {    
    game.physics.arcade.collide(player, groundLayer);

    player.body.velocity.set(0);

    if (cursors.left.isDown){
        player.body.velocity.x = -100;
        player.play('left');
    }
    else if (cursors.right.isDown){
        player.body.velocity.x = 100;
        player.play('right');
    }
    else if (cursors.up.isDown){
        player.body.velocity.y = -100;
        player.play('up');
    }
    else if (cursors.down.isDown){
        player.body.velocity.y = 100;
        player.play('down');
    }
    else {
        player.animations.stop();
    }

}

function render() {

}