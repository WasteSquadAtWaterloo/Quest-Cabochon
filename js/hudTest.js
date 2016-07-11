var game = new Phaser.Game(window.innerWidth-20, window.innerHeight-20, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });


function preload() {
    game.load.tilemap('map0', 'assets/Map/level_1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map2', 'assets/Map/level_3.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('tiles', 'assets/Spritesheet/roguelikeSheet_transparent.png');
    
    game.load.image('attackBox', 'assets/blank.png');
    game.load.image('shop', 'assets/HUD/shop.png');
    game.load.image('characterHud', 'assets/HUD/character_hud.png');
    game.load.image('emptySlot', 'assets/HUD/empty_slot.png');
    game.load.image('helmetSlot', 'assets/HUD/helmet_slot.png');
    game.load.image('chestSlot', 'assets/HUD/chest_slot.png');
    game.load.image('swordSlot', 'assets/HUD/sword_slot.png');
    game.load.image('goldIcon', 'assets/goldIcon.png');

    game.load.image('healer', 'assets/Spritesheet/NPC/healer.png');
    game.load.image('kid', 'assets/Spritesheet/NPC/kid.png');
    game.load.image('clerk', 'assets/Spritesheet/NPC/storeClerk.png');

    game.load.spritesheet('{"armor":"none","weapon":"none"}', 'assets/Spritesheet/player/default.png', 64, 64);
    game.load.spritesheet('{"armor":"leather","weapon":"none"}', 'assets/Spritesheet/player/armor0.png', 64, 64);
    game.load.spritesheet('{"armor":"plate","weapon":"none"}', 'assets/Spritesheet/player/armor1.png', 64, 64);
    game.load.spritesheet('{"armor":"gold","weapon":"none"}', 'assets/Spritesheet/player/armor2.png', 64, 64);

    game.load.spritesheet('spider', 'assets/Spritesheet/monsters/spider.png', 35, 35);
    game.load.spritesheet('scorpion', 'assets/Spritesheet/monsters/scorpion.png', 32, 33);
    game.load.spritesheet('snail', 'assets/Spritesheet/monsters/snail1.png', 50, 50);
    game.load.spritesheet('logmonster', 'assets/Spritesheet/monsters/logmonster.png', 45, 45);

    game.load.spritesheet('items', 'assets/Spritesheet/items.png', 34, 34);

    //game.load.spritesheet('NPCs', 'assets/Spritesheet/NPC/npc_spritesheet.png', 40, 48);

    //for testing
    game.load.image('rect', 'assets/HUD/hp_bar.png');
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
var maxHealth = 20;

function create() {   

    $(window).resize(function(){
        game.scale.setGameSize(window.innerWidth-20, window.innerHeight-20);

        shop.cameraOffset.x = window.innerWidth/2-290; 
        shop.cameraOffset.y = window.innerHeight/2-212
    });    

    atkBox = game.add.sprite(spawn.x-12,spawn.y-17, "attackBox");
    game.physics.enable(atkBox, Phaser.Physics.ARCADE);

    loadMap('map0', spawn.x, spawn.y, 20, true);

    

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
            pickUpItems.call(item, item, player);
            swordAvailability = true;
        }
        catch(err){
        }
    }, this);
    helmet_slot = game.make.button(258,98 ,"helmetSlot", function() {
         try { //Removing an item
            var item = helmet_slot.getChildAt(0);
            helmet_slot.removeChildAt(0);
            pickUpItems.call(item, item, player);
            helmetAvailability = true;
        }
        catch(err){

        }
    }, this);
    chest_slot = game.make.button(258 ,146 ,"chestSlot", function() {
         try { //Removing an item
            var item = chest_slot.getChildAt(0);
            chest_slot.removeChildAt(0);
            pickUpItems.call(item, item, player);
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
    items.hp0 = itemFrames.load('hp0', -100, -100);
    items.hp1 = itemFrames.load('hp1', -100, -100);
    items.hp2 = itemFrames.load('hp2', -100, -100);
    items.mp0 = itemFrames.load('mp0', -100, -100);
    items.mp1 = itemFrames.load('mp1', -100, -100);
    items.mp2 = itemFrames.load('mp2', -100, -100);
    items.hat0 = itemFrames.load('hat0', -100, -100);
    items.hat1 = itemFrames.load('hat1', -100, -100);
    items.hat2 = itemFrames.load('hat2', -100, -100);    
    items.hat3 = itemFrames.load('hat3', -100, -100);   

    initShop();

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

    //pots
    wasd.E.onDown.add(function(){        
        for (var i=0; i<24; i++){
            if (inventorySlots[i].children.length){
                console.log(inventorySlots[i].getChildAt(0).frame);
                if ([35, 49, 28].indexOf(inventorySlots[i].getChildAt(0).frame) > -1){                   
                    switch (inventorySlots[i].getChildAt(0).frame){
                        case 35: player.heal(10);
                        case 49: player.heal(10);
                        case 28: player.heal(10);
                    }
                    updateHealthBar();

                    inventorySlots[i].removeChildAt(0);
                    inventoryAvailability[i] = true;
                    break;                    
                }                
            }
        }
    });

    //temp shop
    wasd.Q.onDown.add(function(){
        if (shop.alive){
            shop.kill();
        } else shop.revive();
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

    
    
    //Create NPCs
    
    NPC = game.add.group();
    NPC.enableBody = true;
    NPC.physicsBodyType = Phaser.Physics.ARCADE;

    /*
    var healer = NPC.create(2790, 2050, 'healer'); healer.scale.set(1.2); healer.addChild(NPCBox); 
    var kid = NPC.create(3076, 2390, 'kid'); kid.scale.set(1.2); kid.addChild(NPCBox);
    var storeClerk = NPC.create(2264, 2580, 'clerk'); storeClerk.scale.set(1.2); storeClerk.addChild(NPCBox);

    for (var i=0; i<3; i++){
            NPCBox = game.add.sprite(-50, -50, "attackBox");
            NPCBox.scale.set(5);
            game.physics.enable(NPCBox, Phaser.Physics.ARCADE);
    }
    */

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
        //game.physics.arcade.collide(player, layer5);     

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

                if (map.key==="map0"){
                    if (player.y===2435 && (player.x>3440 && player.x<3470)){
                        loadMap('map2', 480, 928, 20, false);
                        player.animations.play("up")
                    }
                }
            }
            else if (cursors.down.isDown || wasd.down.isDown){ 
                player.body.velocity.y = 500;
                player.play('down');                
                player_dir = 'down';

                if (map.key==="map2"){
                    if (player.y>960){
                        loadMap('map0', 3460, 2435, 20, false);
                        player.animations.play('down');
                    }
                }
            }
        }
        


        if (game.input.activePointer.leftButton.isDown){   
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
            //console.log(game.input.mousePointer.x, game.input.mousePointer.y); 
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
        game.physics.arcade.overlap(items.armor0, player, pickUpItems, null, items.armor0);
        game.physics.arcade.overlap(items.armor1, player, pickUpItems, null, items.armor1);
        game.physics.arcade.overlap(items.armor2, player, pickUpItems, null, items.armor2);  

        //game.physics.arcade.overlap(NPCBox, player, NPCDialogue, null, this);

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
    //game.debug.body(NPCBox);
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
                pickUpItems.call(temp, temp, player);
            }
        }
        catch(err){ //Adding an item
            console.log(err);

        }
    }
    return generatedFunction;
}

function pickUpItems(item, player) {

    if (this.toString()[0] !="["){        
        var sItem = itemFrames.load(this.toString(), 0, 0);
        for (var i=0; i<24; i++){
            if (inventoryAvailability[i]) {                
                inventorySlots[i].addChild(sItem);
                inventoryAvailability[i] = false;
                break;
            }
        }
    }
    else{
        for (var i=0; i<24; i++){
            if (inventoryAvailability[i]) {
                this.x = 0;
                this.y = 0;
                inventorySlots[i].addChild(this);
                inventoryAvailability[i] = false;
                break;
            }
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