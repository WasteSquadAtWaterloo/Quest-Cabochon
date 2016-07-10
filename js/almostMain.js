var game = new Phaser.Game(window.innerWidth-20, window.innerHeight-20, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });


function preload() {
    game.load.tilemap('map', 'assets/Map/level_1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/Spritesheet/roguelikeSheet_transparent.png');
    
    game.load.image('attackBox', 'assets/blank.png');
    game.load.image('characterHud', 'assets/HUD/character_hud.png');
    game.load.image('emptySlot', 'assets/HUD/empty_slot.png');
    game.load.image('helmetSlot', 'assets/HUD/helmet_slot.png');
    game.load.image('chestSlot', 'assets/HUD/chest_slot.png');
    game.load.image('swordSlot', 'assets/HUD/sword_slot.png');
    game.load.image('goldIcon', 'assets/goldIcon.png');

    game.load.image('healer', 'assets/Spritesheet/NPC/healer.png')
    game.load.image('kid', 'assets/Spritesheet/NPC/kid.png')
    game.load.image('clerk', 'assets/Spritesheet/NPC/storeClerk.png')


    game.load.spritesheet('{"armor":"none","weapon":"none"}', 'assets/Spritesheet/player/default.png', 64, 64);
    game.load.spritesheet('{"armor":"leather","weapon":"none"}', 'assets/Spritesheet/player/armor0.png', 64, 64);
    game.load.spritesheet('{"armor":"plate","weapon":"none"}', 'assets/Spritesheet/player/armor1.png', 64, 64);
    game.load.spritesheet('{"armor":"gold","weapon":"none"}', 'assets/Spritesheet/player/armor2.png', 64, 64);

    game.load.spritesheet('spider', 'assets/Spritesheet/monsters/spider.png', 35, 35);
    game.load.spritesheet('scorpion', 'assets/Spritesheet/monsters/scorpion.png', 32, 33);
    game.load.spritesheet('snail', 'assets/Spritesheet/monsters/snail1.png', 50, 50);

    game.load.spritesheet('items', 'assets/Spritesheet/items.png', 34, 34);

    //game.load.spritesheet('NPCs', 'assets/Spritesheet/NPC/npc_spritesheet.png', 40, 48);
}

var map;
var NPC;
var playerGold = 100; var gold, goldText;
var inventory, inventoryDisplayed; inventoryDisplayed = false;
var inventorySlots = [];
var inventoryAvailability = [];
var helmet_slot, sword_slot, chest_slot;
var helmetAvailability, swordAvailability, chestAvailability; helmetAvailability = chestAvailability = swordAvailability = true;

for (var i=0;i<24;i++){
    inventoryAvailability[i] = true;
}

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
var enemys = {};
var atkBox, NPCBox;
var atkOpts = {
    "up": {x:-2.5, y:-30},
    "down": {x:-2.5, y:15},
    "right": {x:25, y:-12.5},
    "left": {x:-25, y:-12.5}
};
var items = {};
var dmgTxtStyle = {
    font: "bold 18px Courier",
    fill: "red",
};
var spawn = {x:2400, y:2400};

function create() {   

    $(window).resize(function(){
        game.scale.setGameSize(window.innerWidth-20, window.innerHeight-20);
    });

    map = game.add.tilemap('map');   
    map.addTilesetImage('roguelikeSheet_transparent','tiles');  

    Phaser.Canvas.setSmoothingEnabled(this.game.context, false);

    atkBox = game.add.sprite(spawn.x-12,spawn.y-17, "attackBox");
    game.physics.enable(atkBox, Phaser.Physics.ARCADE);

    layer1 = map.createLayer(0); layer1.smoothed = false; layer1.setScale(3);
    layer2 = map.createLayer(1); layer2.smoothed = false; layer2.setScale(3);     
    layer3 = map.createLayer(2); layer3.smoothed = false; layer3.setScale(3);
    layer4 = map.createLayer(3); layer4.smoothed = false; layer4.setScale(3);    
        
    initEnemys();


    //Create NPCs
    NPC = game.add.group();
    NPC.enableBody = true;
    NPC.physicsBodyType = Phaser.Physics.ARCADE;

    var healer = NPC.create(2790,2050, 'healer'); healer.scale.set(1.2); healer.addChild(NPCBox);
    var kid = NPC.create(3076,2390, 'kid'); kid.scale.set(1.2); kid.addChild(NPCBox);
    var storeClerk = NPC.create(2264, 2580, 'clerk'); storeClerk.scale.set(1.2); storeClerk.addChild(NPCBox);

    for (var i=0; i<3; i++){
            NPCBox = game.make.sprite(-50, -50, "attackBox");
            NPCBox.scale.set(5);
            game.physics.enable(NPCBox, Phaser.Physics.ARCADE);
    }

    player = game.add.sprite(spawn.x, spawn.y, JSON.stringify(equip), playerFrames.down.walk[0]);
    player.maxHealth = 20;
    player.setHealth(20);
    player.__proto__.kill = function(){ 
        this.body.velocity.x = 0; this.body.velocity.y = 0;        
        this.alive = false;
        this.events.onKilled$dispatch(this);
        this.animations.play('dead');  

        return this
    }
    player.__proto__.revive = function () {     
        this.x = spawn.x; this.y = spawn.y;

        this.alive = true;
        this.exists = true;
        this.visible = true;
        this.setHealth(this.maxHealth);        

        if (this.events)
        {
            this.events.onRevived$dispatch(this);
        }

        return this;
    }   

    layer5 = map.createLayer(4); layer5.smoothed = false; layer5.setScale(3);    

    layer1.resizeWorld(); 

    //Adding inventory
    inventory = game.add.sprite((window.innerWidth)+200, (window.innerHeight)+200, 'characterHud');
    inventory.fixedToCamera = true;

    for (var i=0; i<4; i++){
        for (var j=0; j<6; j++){
            var givenFunction = inventoryCreator();
            inventorySlots[buttonCreated] = game.make.button(i*36+34, j*36+94, "emptySlot", givenFunction, this);
            inventory.addChild(inventorySlots[buttonCreated]);
            buttonCreated += 1
        }
    }
    //Adding equip slots
    sword_slot = game.make.button(214,167 ,"swordSlot", function() {
         try { //Removing an item
            var item = sword_slot.getChildAt(0);
            sword_slot.removeChildAt(0);
            pickUpItems(item, player);
            swordAvailability = true;
        }
        catch(err){
        }
    }, this);
    helmet_slot = game.make.button(258,98 ,"helmetSlot", function() {
         try { //Removing an item
            var item = helmet_slot.getChildAt(0);
            helmet_slot.removeChildAt(0);
            pickUpItems(item, player);
            helmetAvailability = true;
        }
        catch(err){

        }
    }, this);
    chest_slot = game.make.button(258 ,146 ,"chestSlot", function() {
         try { //Removing an item
            var item = chest_slot.getChildAt(0);
            chest_slot.removeChildAt(0);
            pickUpItems(item, player);
            chestAvailability = true;
        }
        catch(err){

        }
    }, this);

    inventory.addChild(sword_slot);
    inventory.addChild(helmet_slot);
    inventory.addChild(chest_slot);
    
    items.armor0 = itemFrames.load('armor0', 1600, 1600); game.physics.enable(items.armor0, Phaser.Physics.ARCADE);
    items.armor1 = itemFrames.load('armor1', 1650, 1600); game.physics.enable(items.armor1, Phaser.Physics.ARCADE);
    items.armor2 = itemFrames.load('armor2', 1600, 1650); game.physics.enable(items.armor2, Phaser.Physics.ARCADE);

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



    gold = game.add.sprite(30, 85, 'goldIcon');
    goldText = game.add.text(40,8,playerGold.toString(), dmgTxtStyle);
    gold.addChild(goldText);

    gold.fixedToCamera = true;
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

        //item pick up
        game.physics.arcade.overlap(items.armor0, player, pickUpItems, null, this);
        game.physics.arcade.overlap(items.armor1, player, pickUpItems, null, this);
        game.physics.arcade.overlap(items.armor2, player, pickUpItems, null, this);  

        game.physics.arcade.overlap(NPCBox, player, NPCDialogue, null, this);

        //ENemy collion + revive
        for (var enemyGroup in enemys){  
            if (game.time.now - damageTime > 500){
                game.physics.arcade.overlap(player, enemys[enemyGroup], enemyCollisionHandler, null, this);            
            }

            if(game.time.now - atkTime > 500){
                game.physics.arcade.overlap(atkBox, enemys[enemyGroup], attackCollisionHandler, null, enemys[enemyGroup]);
            }

            enemys[enemyGroup].forEach(function(mob){
                if (!mob.alive && game.time.now - mob.deathTime >= 15000){
                    mob.revive();
                    mob.setHealth(mob.maxHealth);
                    var madeBar = mobHealthBarManager(10, mob.health);
                    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
                    mob.addChild(monHealthBar);
                }
            });
        }       
    }

       
}

function render() {
    enemys.spiders.forEach(function(mob){
        //game.debug.body(mob);
    });
    game.debug.body(NPCBox);
    //game.debug.body(atkBox);
    //game.debug.body(player);
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
        try { //equiping an item
            var item = inventorySlots[id].getChildAt(0);
            //Check item type

            inventorySlots[id].removeChildAt(0);
            inventoryAvailability[id] = true;
            if (chestAvailability) { //There is a free chest armor space
                chest_slot.addChild(item);
                chestAvailability = false;
            }
            else { //there is no free chest armor space
                var temp = chest_slot.getChildAt(0);
                chest_slot.removeChildAt(0);
                chest_slot.addChild(item);
                pickUpItems(temp, player);
            }
        }
        catch(err){ //Adding an item
            console.log(err);

        }
    }
    return generatedFunction;
}

function pickUpItems(item, player) {
    for (var i=0; i<24; i++){
        if (inventoryAvailability[i]) {
            item.x = 0;
            item.y = 0;
            inventorySlots[i].addChild(item);
            inventoryAvailability[i] = false;
            break;
        }
    }
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
    /*
    if (enemy.atk >= player.health){
        player.alive = false;
        player.animations.play('dead');
        if (player.animations.currentAnim.isFinished); 
    }
    else*/ player.damage(enemy.atk);
    
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

    if (!enemy.alive) {
        enemy.deathTime = game.time.now;
        playerGold += enemy.gold;
        console.log(playerGold);

        gold.removeChildAt(0);
        goldText = game.add.text(40,8,playerGold.toString(), dmgTxtStyle);
        gold.addChild(goldText);

    }
    var madeBar = mobHealthBarManager(10, enemy.health);
    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);     

    enemy.removeChildAt(0);
    enemy.addChild(monHealthBar);    
}
function NPCDialogue(collisionBox, player) {
    var currentNPC = collisionBox.parent;
    console.log(currentNPC.x, currentNPC.y);
    console.log(currentNPC);
}