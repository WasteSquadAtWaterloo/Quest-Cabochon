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
var spellTime = 0;
var playerShots;
var mobShots;

function create() {   

    $(window).resize(resizeComponents);        

    initNPC(); console.log('NPC loaded');
    initPlayer(0, 0, 20); console.log('Player loaded');
    initShop(); console.log('Shop loaded');
    initInventory(); console.log('Inventory loaded'); 

    loadMap('map0', spawn.x, spawn.y, true); console.log('Map loaded');

    initInput();
}


function update() { 

    if (player.alive){     
        game.physics.arcade.collide(player, layer1);
        game.physics.arcade.collide(player, layer2);
        game.physics.arcade.collide(player, layer3);
        game.physics.arcade.collide(player, layer4);
        //game.physics.arcade.collide(player, layer5);     

        player.body.velocity.set(0);

        var curAn = player.animations.currentAnim.name

        //movement and its animation
        if (player.animations.currentAnim.isFinished || (curAn.indexOf("melee")<0 && curAn.indexOf("spell")<0) ){
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

                //portal to map0
                if (map.key==="map0"){
                    if (player.y<=0 && (player.x>4283 && player.x<4404)){
                        loadMap('map2', 480, 928, false);
                        player.play("up")
                    }
                }

                else if (map.key==="map1"){
                    if (player.y<=0 && (player.x>1115 && player.x<1379)){
                        loadMap('map0', 2127.5, 4768, false);
                        player.play("up")
                    }
                }
            }
            else if (cursors.down.isDown || wasd.down.isDown){ 
                player.body.velocity.y = 500;
                player.play('down');                
                player_dir = 'down';

                //portal to map2
                if (map.key==="map2"){
                    if (player.y>960){
                        loadMap('map0', 4343.5, 35, false);
                        player.play('down');
                    }
                }

                else if (map.key==="map0"){
                    if (player.y>=4800 && (player.x>2075 && player.x<2244)){
                        loadMap('map1', 1274, 0, false);
                        player.play('down');
                    }
                }
            }            

            if (player.animations.currentAnim.isFinished){        
                player.frame = playerFrames[player_dir].walk[0];                
            }   
        }

        //melee attack and its animation + hitbox
        if (game.input.activePointer.leftButton.isDown){                   
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

        if (curAn.indexOf("melee") > -1 && !player.animations.currentAnim.isFinished){
            atkBox.x = player.body.x+atkOpts[player_dir].x;
            atkBox.y = player.body.y+atkOpts[player_dir].y;
        } else{
            atkBox.x = -100;
            atkBox.y = -100; 
        }  

        //spell attack and its animation
        if (wasd.space.isDown){
            player.play(player_dir+"_spell");            
        }
        
        if (player.animations.currentAnim.name.indexOf("spell") > -1 && !player.animations.currentAnim.isFinished  && game.time.now - spellTime >=500 && player.mana>=5){
            spellTime = game.time.now;
            spellCast.call({
                color: 'blue',
                x: player.x,
                y: player.y,            
                scale: 0.25,
                group: playerShots
            },Phaser.Math.angleBetween(player.x,player.y,game.input.mousePointer.x + game.camera.x,game.input.mousePointer.y + game.camera.y));

            player.mana -=5;
            updateManaBar();

        }

        //destroy non-existent shots
        if (game.time.now - spellTime >= 5000) playerShots.removeChildren();

        //pasive mana regen
        if (game.time.now - manaRegenTick >= 20){
            manaRegenTick = game.time.now;
            player.mana = Math.min(player.maxMana, player.mana+1);
            updateManaBar();            
        }             

        //item pick up
        if (!items.armor0.inInv) game.physics.arcade.overlap(items.armor0, player, pickUpItems, null, items.armor0);
        if (!items.armor1.inInv) game.physics.arcade.overlap(items.armor1, player, pickUpItems, null, items.armor1);
        if (!items.armor2.inInv) game.physics.arcade.overlap(items.armor2, player, pickUpItems, null, items.armor2);      

        //ENemy collion + revive
        for (var enemyGroup in enemys){  
            if (game.time.now - damageTime > 500){
                game.physics.arcade.overlap(player, enemys[enemyGroup], enemyCollisionHandler, null, this);            
            }

            if(game.time.now - atkTime > 500){
                game.physics.arcade.overlap(atkBox, enemys[enemyGroup], attackCollisionHandler, null, enemys[enemyGroup]);
            }
            game.physics.arcade.overlap(playerShots, enemys[enemyGroup], attackCollisionHandler, null, enemys[enemyGroup]);
            

            enemys[enemyGroup].forEach(function(mob){                
                if (enemyGroup.indexOf('Boss')===-1 &&!mob.alive && game.time.now - mob.deathTime >= 20000){
                    mob.revive();
                    mob.setHealth(mob.maxHealth);
                    var madeBar = mobHealthBarManager(10, mob.health);
                    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
                    mob.addChild(monHealthBar);
                }
            });
        }

        if (game.time.now - damageTime > 500){
                game.physics.arcade.overlap(player, mobShots, enemyCollisionHandler, null, this);          
        }
        
        //Boss spells
        
        if (map.key==="map0" && game.time.now - enemys.wolfBoss.spellTime>=2000){
            var boss = enemys.wolfBoss.getFirstAlive();
            if (boss){
                var shotAngle = Phaser.Math.angleBetween(boss.x, boss.y, player.x, player.y);
                var spellOpts = {
                    color: 'yellow',
                    x: boss.x+boss.width/2,
                    y: boss.y+boss.height/2,                     
                    scale: 0.4,
                    atk: 3,               
                    group: mobShots
                };
                spellCast.call(spellOpts, shotAngle-Math.PI/8);                
                spellCast.call(spellOpts, shotAngle);                
                spellCast.call(spellOpts, shotAngle+Math.PI/8);
        }
            enemys.wolfBoss.spellTime = game.time.now;
        }
                

        //NPC stuff
        game.physics.arcade.overlap(kidBox, player, createDialogue, null, this);
        game.physics.arcade.overlap(healerBox, player, createDialogue, null, this);
        if (game.physics.arcade.intersects(player.body, storeClerkBox.body)){
            shop.revive();
        }else if (shop.alive) shop.kill(); 

        if (player.overlap(kidBox) == false && player.overlap(healerBox) == false && player.overlap(storeClerkBox) == false) {            
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
    var atk = atkBox.key==="blue" ? player.mAtk : player.atk

    var dmgTxt = game.add.text(enemy.x+this.x, enemy.y+this.y, atk.toString() ,dmgTxtStyle);
    game.add.tween(dmgTxt).to({y: dmgTxt.y-50}, 2000, Phaser.Easing.Default, true);
    var tweenTxt = game.add.tween(dmgTxt).to( { alpha: 0 }, 3000, "Linear", true);
    
    tweenTxt.onComplete.add(function(){
        dmgTxt.destroy();
    });
    

    atkTime = game.time.now;
    enemy.damage(atk);

    if (!enemy.alive) {
        enemy.deathTime = game.time.now;
        playerGold += enemy.gold;

        gold.removeChildAt(0);
        goldText = game.add.text(40,8,playerGold.toString(), niceTxtStyle);
        gold.addChild(goldText);

    }
    console.log(enemy.maxHealth, enemy.health);
    var madeBar = mobHealthBarManager(enemy.maxHealth, enemy.health);
    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);     

    enemy.removeChildAt(0);
    enemy.addChild(monHealthBar);   

    if (atkBox.key==="blue") atkBox.exists = false; 
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

function spellCast(angle){
    var shot = this.group.create(this.x, this.y, this.color);

    game.physics.enable(shot, Phaser.Physics.ARCADE);

    shot.outOfCameraBoundsKill= true;
    shot.autoCull = true; 
    shot.events.onKilled.add(function(){
        this.destroy();
    },shot);
    shot.scale.set(this.scale);    
    
    shot.body.velocity.x = 500*Math.cos(angle);
    shot.body.velocity.y = 500*Math.sin(angle);     

    shot.atk = this.atk;
}