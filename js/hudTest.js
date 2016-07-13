var game = new Phaser.Game(window.innerWidth-20, window.innerHeight-20, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var map;
var dialogueBox, textBox;
var dialogue = false;
var playerGold = 100; var gold, goldText;
var inventory, inventoryDisplayed; inventoryDisplayed = false;
var inventorySlots = [];
var inventoryAvailability = [];
var helmet_slot, sword_slot, chest_slot;
var helmetAvailability, swordAvailability, chestAvailability; helmetAvailability = chestAvailability = swordAvailability = true;

for (var i=0;i<24;i++){
    inventoryAvailability[i] = true;
}

var manaRegenTick = 0;
var buttonCreated = 0;
var layer1,layer2,layer3,layer4,layer5;
var cursors, wasd, melee;
var damageTime = 0, atkTime = 0;
var player;
var player_dir = 'down';
var dir = playerFrames.down.walk[0];
var equip = {
    armor: "none",    
    hat: "none"
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
var niceTxtStyle = {
    font: "bold 14px Lucida Console",
    fill: "black",
};
var spawn = {x:2400, y:2400};
var maxHealth = 20;

function create() {   

    $(window).resize(resizeComponents);        

    initNPC(); console.log('NPC loaded');
    initPlayer(0, 0, 20); console.log('Player loaded');
    initShop(); console.log('Shop loaded');
    initInventory(); console.log('Inventory loaded'); 

    loadMap('map0', spawn.x, spawn.y, true); console.log('Map loaded');

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
    wasd.E.onDown.add(usePot, 'hp');
    
    wasd.Q.onDown.add(usePot, 'mp');

    wasd.C.onDown.add(toggleInventory); 
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
                        loadMap('map2', 480, 928, false);
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
                        loadMap('map0', 3460, 2435, false);
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
            
            player.play(player_dir+"_melee");            
        }

        if (game.time.now - manaRegenTick >= 2000){
            manaRegenTick = game.time.now;
            player.mana = Math.min(player.maxMana, player.mana+1);
            updateManaBar();            
        }        

        if (player.animations.currentAnim.name.indexOf("melee") != -1 && !player.animations.currentAnim.isFinished){
            atkBox.x = player.body.x+atkOpts[player_dir].x;
            atkBox.y = player.body.y+atkOpts[player_dir].y;
        } else{
            atkBox.x = -100;
            atkBox.y = -100; 
        }  
            
        if (player.animations.currentAnim.isFinished){        
            player.frame = playerFrames[player_dir].walk[0];
        }        

        //item pick up
        if (!items.armor0.inInv) game.physics.arcade.overlap(items.armor0, player, pickUpItems, null, items.armor0);
        if (!items.armor1.inInv) game.physics.arcade.overlap(items.armor1, player, pickUpItems, null, items.armor1);
        if (!items.armor2.inInv) game.physics.arcade.overlap(items.armor2, player, pickUpItems, null, items.armor2);  

        game.physics.arcade.overlap(kidBox, player, createDialogue, null, this);
        game.physics.arcade.overlap(healerBox, player, createDialogue, null, this);        

        if (game.physics.arcade.intersects(player.body, storeClerkBox.body)){
            shop.revive();
        }else if (shop.alive) shop.kill();     
        

        //ENemy collion + revive
        for (var enemyGroup in enemys){  
            if (game.time.now - damageTime > 500){
                game.physics.arcade.overlap(player, enemys[enemyGroup], enemyCollisionHandler, null, this);            
            }

            if(game.time.now - atkTime > 500){
                game.physics.arcade.overlap(atkBox, enemys[enemyGroup], attackCollisionHandler, null, enemys[enemyGroup]);
            }

            enemys[enemyGroup].forEach(function(mob){                
                if (enemyGroup.indexOf('Boss')===-1 &&!mob.alive && game.time.now - mob.deathTime >= 15000){
                    mob.revive();
                    mob.setHealth(mob.maxHealth);
                    var madeBar = mobHealthBarManager(10, mob.health);
                    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
                    mob.addChild(monHealthBar);
                }
            });
        }        

        if (player.overlap(kidBox) == false && player.overlap(healerBox) == false && player.overlap(storeClerkBox) == false) {
            //dialogue = true;
            dialogue = false;
            textBox.removeChildren();
            textBox.exists = false;
        } 
    }       
}

function render() {
    
}

function resizeComponents(){
    game.scale.setGameSize(window.innerWidth-20, window.innerHeight-20);
    
    shop.cameraOffset.x = window.innerWidth/2-386; 
    shop.cameraOffset.y = window.innerHeight/2-283;

    inventory.cameraOffset.x = window.innerWidth/2-200; 
    inventory.cameraOffset.y = window.innerHeight/2-200;
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

function updateManaBar(){
    var pc = Math.ceil(player.mana/player.maxMana*10);

    $("#blue-bars").empty();
    for (var i=0; i<pc; i++){
        var hp = $('<img />', {           
          src: 'assets/HUD/mp_bar.png'          
        });
        hp.appendTo($("#blue-bars"));
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
    console.log(enemy);
    game.camera.shake(0.003, 500, true);

    damageTime = game.time.now;
    player.damage(enemy.atk);
    
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
        goldText = game.add.text(40,8,playerGold.toString(), niceTxtStyle);
        gold.addChild(goldText);

    }
    var madeBar = mobHealthBarManager(enemy.maxHealth, enemy.health);
    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);     

    enemy.removeChildAt(0);
    enemy.addChild(monHealthBar);    
}

function usePot(){       
    for (var i=0; i<24; i++){
        if (inventorySlots[i].children.length){
            var tempChild = (inventorySlots[i].getChildAt(0)).name;      
            if (this.toString()==="hp" && (tempChild.indexOf('hp') > -1)){                   
                switch (inventorySlots[i].getChildAt(0).frame){
                    case 35: 
                        player.heal(10);
                        break;
                    case 49: 
                        player.heal(25);
                        break;
                    case 28: 
                        player.heal(50);
                        break;
                }
                updateHealthBar();
                inventorySlots[i].removeChildAt(0);
                inventoryAvailability[i] = true;
                break;                    
            }

            else if (this.toString()==="mp" && (tempChild.indexOf('mp') > -1)){
                switch (inventorySlots[i].getChildAt(0).frame){
                    case 38: 
                        player.mana = Math.min(player.maxMana, player.mana+10);
                        break;
                    case 52: 
                        player.mana = Math.min(player.maxMana, player.mana+25);
                        break;
                    case 31: 
                        player.mana = Math.min(player.maxMana, player.mana+50);
                        break;
                }
                updateManaBar();

                inventorySlots[i].removeChildAt(0);
                inventoryAvailability[i] = true;
                break; 
            }                
        }
    }
}    

