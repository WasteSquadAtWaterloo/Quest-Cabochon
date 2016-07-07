var game = new Phaser.Game(window.innerWidth-20, window.innerHeight-20, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });


function preload() {
    game.load.tilemap('map', 'assets/Map/lev1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/Spritesheet/roguelikeSheet_transparent.png');
    
    game.load.image('attackBox', 'assets/blank.png');
    game.load.image('characterHud', 'assets/HUD/character_hud.png');
    game.load.image('emptySlot', 'assets/HUD/empty_slot.png');

    game.load.spritesheet('{"armor":"none","weapon":"none"}', 'assets/Spritesheet/player/default.png', 64, 64);
    game.load.spritesheet('{"armor":"leather","weapon":"none"}', 'assets/Spritesheet/player/armor0.png', 64, 64);
    game.load.spritesheet('{"armor":"plate","weapon":"none"}', 'assets/Spritesheet/player/armor1.png', 64, 64);
    game.load.spritesheet('{"armor":"gold","weapon":"none"}', 'assets/Spritesheet/player/armor2.png', 64, 64);



    game.load.spritesheet('spider', 'assets/Spritesheet/monsters/spider.png', 35, 35);
}

var map;
var inventory, inventoryDisplayed; inventoryDisplayed = false;
var inventorySlots = [];
var buttonCreated = 0;
var layer1,layer2,layer3,layer4,layer5;
var cursors, wasd, melee;
var damageTime = 0, atkTime = 0;
var player;
var player_dir = 'down';
var dir = playerFrames.down.walk[0];
var equip = {
    armor: "none",
    weapon: "none",
}
var playerAtk = 3;
var spiders;
var atkBox;
var atkOpts = {
    "up": {x:-2.5, y:-30},
    "down": {x:-2.5, y:15},
    "right": {x:25, y:-12.5},
    "left": {x:-25, y:-12.5}
};

var dmgTxtStyle = {
    font: "bold 18px Courier",
    fill: "red",
};

function create() {   

    $(window).resize(function(){
        game.scale.setGameSize(window.innerWidth-20, window.innerHeight-20);
    });

    map = game.add.tilemap('map');   
    map.addTilesetImage('roguelikeSheet_transparent','tiles');  

    Phaser.Canvas.setSmoothingEnabled(this.game.context, false);

    atkBox = game.add.sprite(2388,2383, "attackBox");
    game.physics.enable(atkBox, Phaser.Physics.ARCADE);

    layer1 = map.createLayer(0); layer1.smoothed = false; layer1.setScale(3);
    layer2 = map.createLayer(1); layer2.smoothed = false; layer2.setScale(3);     
    layer3 = map.createLayer(2); layer3.smoothed = false; layer3.setScale(3);
    layer4 = map.createLayer(3); layer4.smoothed = false; layer4.setScale(3);    
        
    spiders = game.add.group();
    spiders.enableBody = true;
    spiders.physicsBodyType = Phaser.Physics.ARCADE;
    createSpiders();

    player = game.add.sprite(2400, 2400, JSON.stringify(equip), playerFrames.down.walk[0]);        

    player.setHealth(100);

    layer5 = map.createLayer(4); layer5.smoothed = false; layer5.setScale(3);

    layer1.resizeWorld();   


    //Adding inventory
    inventory = game.add.sprite((window.innerWidth)+200, (window.innerHeight)+200, 'characterHud');
    inventory.fixedToCamera = true;
    //var inventorySlots = game.add.group();

    for (var i=0; i<4; i++){
        for (var j=0; j<6; j++){
            var givenFunction = inventoryCreator();
            inventorySlots[buttonCreated] = game.make.button(i*36+34, j*36+94, "emptySlot", givenFunction, this);
            inventory.addChild(inventorySlots[buttonCreated]);
            buttonCreated += 1
        }
    }

    



    map.setCollisionByExclusion(stand,true,layer1);      
    map.setCollisionByExclusion(stand,true,layer2);  
    map.setCollisionByExclusion(stand,true,layer3);  
    map.setCollisionByExclusion(stand,true,layer4);  
    map.setCollisionByExclusion(stand,true,layer5);

    player.scale.set(1);
    player.anchor.setTo(0.5,0.5);

    player.animations.add('down', playerFrames.down.walk, 10, false);
    player.animations.add('left', playerFrames.left.walk, 10, false);    
    player.animations.add('right', playerFrames.right.walk, 10, false);
    player.animations.add('up', playerFrames.up.walk, 10, false); 

    player.animations.add('down_melee', playerFrames.down.attack, 15, false);
    player.animations.add('left_melee', playerFrames.left.attack, 15, false);    
    player.animations.add('right_melee', playerFrames.right.attack, 15, false);
    player.animations.add('up_melee', playerFrames.up.attack, 15, false); 

    player.animations.add('dead', playerFrames.dead, 5, false); 

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.setSize(25, 20, 20, 45);

    cursors = game.input.keyboard.createCursorKeys(); 
    wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        E: game.input.keyboard.addKey(Phaser.Keyboard.E),
        Q: game.input.keyboard.addKey(Phaser.Keyboard.Q),
        C: game.input.keyboard.addKey(Phaser.Keyboard.C)
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
    wasd.C.onDown.add(function(){
        if (inventoryDisplayed){
            inventory.fixedToCamera = false;
            inventory.x = (window.innerWidth)+200;
            inventory.y =  (window.innerHeight)+200;
            inventoryDisplayed = false;
            inventory.fixedToCamera = true;
        }
        else {
            inventory.fixedToCamera = false;
            inventory.x = (window.innerWidth/2)-200;
            inventory.y = (window.innerHeight/2)-200;
            inventoryDisplayed = true;
            inventory.fixedToCamera = true;
        }
    });
    
    game.camera.follow(player);
    updateHealthBar();
}


function update() { 

    if (player.alive){     
        game.physics.arcade.collide(player, layer1);
        game.physics.arcade.collide(player, layer2);
        game.physics.arcade.collide(player, layer3);
        game.physics.arcade.collide(player, layer4);
        game.physics.arcade.collide(player, layer5);     

        player.body.velocity.set(0);

        if (player.animations.currentAnim.isFinished || player.animations.currentAnim.name.indexOf("melee") === -1){
            if (cursors.left.isDown || wasd.left.isDown){
                player.body.velocity.x = -500;
                player.play('left');                
                player_dir = 'left';
            }
            else if (cursors.right.isDown || wasd.right.isDown){
                player.body.velocity.x = 500;
                player.play('right');                
                player_dir = 'right';
            }
            else if (cursors.up.isDown || wasd.up.isDown){
                player.body.velocity.y = -500;
                player.play('up');                
                player_dir = 'up';
            }
            else if (cursors.down.isDown || wasd.down.isDown){
                player.body.velocity.y = 500;
                player.play('down');                
                player_dir = 'down';
            }
        }
        


        if (game.input.activePointer.leftButton.isDown){   

            melee_animation_is_playing = false;

            //Calculate direction        
            var player_screen_x = player.position.x - game.camera.x;
            var player_screen_y = player.position.y - game.camera.y;
            var dif_x = game.input.mousePointer.x - player_screen_x;
            var dif_y = game.input.mousePointer.y - player_screen_y;

            if (Math.abs(dif_x) >= Math.abs(dif_y)){
                player_dir = dif_x>=0 ? 'right' : 'left';
            }
            else{
                player_dir = dif_y>=0 ? 'down' : 'up';
            }            

            player.play(player_dir+"_melee");            
        } 

        if(player.animations.currentAnim.name.indexOf("melee") != -1 && !player.animations.currentAnim.isFinished){
            atkBox.x = player.body.x+atkOpts[player_dir].x;
            atkBox.y = player.body.y+atkOpts[player_dir].y;
        }else{
            atkBox.x = -100;
            atkBox.y = -100; 
        }  
            
        if (player.animations.currentAnim.isFinished){        
            player.frame = playerFrames[player_dir].walk[0];
        }       

        //Put all damage/collision detection in this if statement
        if (game.time.now - damageTime > 300){
            game.physics.arcade.overlap(player, spiders, enemyCollisionHandler, null, this);            
        }

        if(game.time.now - atkTime > 500){
            game.physics.arcade.overlap(atkBox, spiders, attackCollisionHandler, null, spiders);
        }
    }
}

function render() {
    spiders.forEach(function(mob){
        //game.debug.body(mob);
    });
    game.debug.body(atkBox);
    game.debug.body(player);
}

function createSpiders(){

    for (var i=1; i<=2; i++){
        for (var j=1; j<=2; j++){
            var spider = spiders.create(Math.random()*480+480*i, Math.random()*480+480*j, "spider");
            spider.setHealth(10);
            //spider.anchor.setTo(0.5, 0.5);  

            var madeBar = mobHealthBarManager(10, spider.health);
            var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
            spider.addChild(monHealthBar);

            spider.scale.set(1.5);       
            spider.animations.add('move', enemyFrames.spider.down.walk, 10, true);              
            spider.play('move');
            spider.body.moves = false;
            spider.atk = 5;
            
            game.add.tween(spider).to( { x: spider.x+(Math.random()*100+100)*randSign(), y: spider.y+(Math.random()*200-100)*randSign()}, 1000, null, true, Math.random()*5000, -1, true);
        }
    }

    spiders.x = 480;
    spiders.y = 480;

}

function updateHealthBar(){
    var pc = Math.ceil(player.health/player.maxHealth*10);

    $("#red-bars").empty();
    for (var i=0; i<pc; i++){
        var hp = $('<img />', {           
          src: 'assets/HUD/hp_bar.png'          
        });
        hp.appendTo($("#red-bars"));
    }
}
function inventoryCreator(){
    var id = buttonCreated;
    function generatedFunction(){
        try { //Removing an item/ equiping an item
            var item = inventorySlots[id].getChildAt(0);
            inventorySlots[id].removeChildAt(0);

        }
        catch(err){ //Adding an item
            console.log(err);

        }
    }

    return generatedFunction;
}

function mobHealthBarManager(mobMaxHealth, mobHealth){
    var bar = game.add.bitmapData(32,2);
    var barProgress = (mobHealth/mobMaxHealth)*32;
    bar.context.clearRect(0, 0, barProgress, 2);
    bar.context.fillStyle = '#f00';
    bar.context.fillRect(0, 0, barProgress, 2);

    return bar;
}

function enemyCollisionHandler(player, enemy) {
    game.camera.shake(0.003, 500, true);

    damageTime = game.time.now;
    if (enemy.atk >= player.health){
        player.alive = false;
        player.animations.play('dead');
        if (player.animations.currentAnim.isFinished); 
    }
    else player.damage(enemy.atk);
    
    updateHealthBar();   
}

function attackCollisionHandler(atkBox, enemy){
    //Damage TExt
    var dmgTxt = game.add.text(enemy.x+this.x, enemy.y+this.y, playerAtk.toString() ,dmgTxtStyle);
    game.add.tween(dmgTxt).to({y: dmgTxt.y-50}, 2000, Phaser.Easing.Default, true);
    var tweenTxt = game.add.tween(dmgTxt).to( { alpha: 0 }, 3000, "Linear", true);
    
    tweenTxt.onComplete.add(function(){
        dmgTxt.destroy();
    });

    atkTime = game.time.now;
    enemy.damage(playerAtk);
    var madeBar = mobHealthBarManager(10, enemy.health);
    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);

    enemy.removeChildAt(0);
    enemy.addChild(monHealthBar);    
}