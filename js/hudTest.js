var game = new Phaser.Game(window.innerWidth-20, window.innerHeight-20, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var map;
var gameProgress = 0;
var oldmanText, kidText, clerkText, clericText;
var dialogue = false;
var playerGold = 100; var gold, goldText, goldHud;
var levelIcon, levelText;
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
var items = {};

google: {
  families: ['Finger Paint']
}

var dmgTxtStyle = {
    font: "bold 18px Courier",
    fill: "red",
};
var niceTxtStyle = {
    font: "bold 14px Finger Paint",
    fill: "black",
};
var deathTxtStyle = {
    font: "30px Lucida Console",
    fill: "black",
    align: "center",
    boundsAlignH: "center",
    boundsAlignV: "center",
};
var spawn = {x:1152, y:624};
var maxHealth = 20;
var spellTime = 0;
var playerShots;
var mobShots;
var bossSpellTime = 0;
var weapon;
var OSattack = false;
var unlockedWep = [false, false, false];
var expReq = [10, 20, 30, 40, 50, 60, 70, 80, 100, 999999999999999999999];
var gameState = 0;
var states = {alive:0, dead:1, dialogue:2};
var curDialogueBox, dialogueTimer = 0;

function create() {   

    $(window).resize(resizeComponents);        

    initNPC(); console.log('NPC loaded');
    initPlayer(0, 0, 20); console.log('Player loaded');
    initShop(); console.log('Shop loaded');
    initInventory(); console.log('Inventory loaded');   
    loadMap('map0', spawn.x, spawn.y, true); console.log('Map loaded');

    initInput();

    //FOR TESTING
    dropItem(items.armor0, 'armor0', 1100, 700);
    dropItem(items.armor1, 'armor1', 1150, 700);
    dropItem(items.armor2, 'armor2', 1200, 700);
    dropItem(items.weapon1, 'weapon1', 1100, 750);
    dropItem(items.weapon2, 'weapon2', 1150, 750);
    dropItem(items.weapon3, 'weapon3', 1200, 750);
}


function update() {     
    player.body.velocity.set(0);

    if (gameState === states.dialogue){        
        if (game.input.activePointer.isDown && game.time.now - dialogueTimer > 250){
            var mx = game.input.mousePointer.x;
            var my = game.input.mousePointer.y;
                        
            if (!(curDialogueBox.name === "clerk" && (mx>shop.cameraOffset.x && mx<shop.cameraOffset.x+shop.width && my>shop.cameraOffset.y && my<shop.cameraOffset.y+shop.height))){
                dialogueTimer = game.time.now;

                curDialogueBox.exists = false;                
                if (curDialogueBox.children.length) curDialogueBox.removeChildAt(0);
                if (shop.alive) shop.kill();

                gameState = states.alive;
            }            
        }
    }

    else if (gameState === states.alive){
        game.physics.arcade.collide(player, layer1);
        game.physics.arcade.collide(player, layer2);
        game.physics.arcade.collide(player, layer3);
        game.physics.arcade.collide(player, layer4);
        //game.physics.arcade.collide(player, layer5);        

        //var curAn = player.animations.currentAnim.name

        //movement and its animation
        if (player.animations.currentAnim.isFinished || (player.animations.currentAnim.name.indexOf("melee")<0 && player.animations.currentAnim.name.indexOf("spell")<0) ){
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

            if (player.animations.currentAnim.isFinished){        
                player.frame = playerFrames[player_dir].walk[0];                
            }   
        }

        portalCheck(map.key);

        //melee attack and its animation + hitbox
        if (game.input.activePointer.leftButton.isDown && !inventory.alive && !shop.alive && ((player.animations.currentAnim.name.indexOf("spell") < 0) || (player.animations.currentAnim.name.indexOf("spell") > 0 && player.animations.currentAnim.isFinished))){                   
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
            
            if (weapon) player.OS(player_dir);
            else player.play(player_dir+"_melee");            
        }

        if (player.animations.currentAnim.name.indexOf("melee") > -1 && !player.animations.currentAnim.isFinished){
            var wep = weapon ? parseInt(weapon):0;
            //Setting size of atkBox
            if (wep){
                var orntn = (player_dir==="right" || player_dir==="left") ? "hrzntl":"vrtcl";
                var boxWidth = wepBoxSize[weapon][orntn].width;
                var boxHeight = wepBoxSize[weapon][orntn].height;
                atkBox.body.setSize(boxWidth, boxHeight, 0, 0);
            }

            //Setting coordinates for atkBox                   
            atkBox.x = player.body.x+atkOpts[player_dir][wep].x;
            atkBox.y = player.body.y+atkOpts[player_dir][wep].y;
        } else{
            atkBox.x = -100;
            atkBox.y = -100; 
        }  
       

        //spell attack and its animation
        if (wasd.space.isDown && player.animations.currentAnim.name.indexOf("melee") < 0 || wasd.space.isDown && player.animations.currentAnim.name.indexOf("melee") > 0 && player.animations.currentAnim.isFinished){
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
        if (!items.weapon1.inInv) game.physics.arcade.overlap(items.weapon1, player, pickUpItems, null, items.weapon1); 
        if (!items.weapon2.inInv) game.physics.arcade.overlap(items.weapon2, player, pickUpItems, null, items.weapon2); 
        if (!items.weapon3.inInv) game.physics.arcade.overlap(items.weapon3, player, pickUpItems, null, items.weapon3);       

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
                    mob.removeChildAt(0);

                    var madeBar = mobHealthBarManager(mob.health, mob.health);
                    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
                    mob.addChild(monHealthBar);
                    console.log(mob.children);
                }
            });
        }

        if (game.time.now - damageTime > 500){
                game.physics.arcade.overlap(player, mobShots, enemyCollisionHandler, null, this);          
        }
        
        //Boss spells
        
        if (game.time.now - bossSpellTime>=2500 && map.key==="map1"){
            bossSpellTime = game.time.now;            
            var boss = enemys.wolfBoss.getFirstAlive();
            if (boss){
                var shotAngle = Phaser.Math.angleBetween(boss.x, boss.y, player.x-60, player.y-60);
                var spellOpts = {
                    color: 'yellow',
                    x: boss.x+boss.width/2,
                    y: boss.y+boss.height/2,                     
                    scale: 0.4,
                    atk: 3, //UPDATE                  
                    group: mobShots
                };
                for (var ang=-1; ang<=1; ang++){
                    spellCast.call(spellOpts, shotAngle+(Math.PI/8)*ang);
                }                         
            }                                
        }

        if (game.time.now - bossSpellTime>=2000 && map.key==="map3"){
            bossSpellTime = game.time.now;            
            var boss = enemys.skeleBoss.getFirstAlive();
            if (boss){
                var shotAngle = Phaser.Math.angleBetween(boss.x, boss.y, player.x-60, player.y-60);
                var spellOpts = {
                    color: 'red',
                    x: boss.x+boss.width/2,
                    y: boss.y+boss.height/2,                     
                    scale: 0.4,
                    atk: 3, //UPDATE       
                    group: mobShots
                };
                for (var ang=-2; ang<=2; ang++){
                    spellCast.call(spellOpts, shotAngle+(Math.PI/8)*ang);
                }
            }                                
        }

        if (game.time.now - bossSpellTime>=2000 && map.key==="map5"){
            bossSpellTime = game.time.now;            
            var boss = enemys.knightBoss.getFirstAlive();
            if (boss){                
                var spellOpts = {
                    color: 'green',
                    x: boss.x+boss.width/2,
                    y: boss.y+boss.height/2,                     
                    scale: 0.4,
                    atk: 3, //UPDATE                
                    group: mobShots
                };
                for (var ang=0; ang<=12; ang++){
                    spellCast.call(spellOpts, (Math.PI/6)*ang);
                }
            }                                
        }                

        //NPC stuff
        if (map.key === 'map0'){
            if (game.input.activePointer.isDown){
                game.physics.arcade.overlap(oldManBox, player, createDialogue, null, this);
                game.physics.arcade.overlap(kidBox, player, createDialogue, null, this);
                game.physics.arcade.overlap(clericBox, player, createDialogue, null, this);
                game.physics.arcade.overlap(clerkBox, player, createDialogue, null, this);
            }            
            

            /*
            if (game.physics.arcade.intersects(player.body, storeClerkBox.body)){
                shop.revive();
            }else if (shop.alive) shop.kill(); 

            if (player.overlap(kidBox) == false && player.overlap(healerBox) == false && player.overlap(storeClerkBox) == false && player.overlap(oldManBox) == false) {            
                dialogue = false;
                
                textBox.removeChildren();
                textBox.exists = false;
                textBox2.removeChildren();
                textBox2.exists = false;
                
            }     
            */
        }     
    }       
}

function render() {
    game.debug.body(atkBox);
    game.debug.body(player, "rgba(255,0,0,0.5)");
}

function resizeComponents(){
    game.scale.setGameSize(window.innerWidth-20, window.innerHeight-20);
    
    shop.cameraOffset.x = window.innerWidth/2-386; 
    shop.cameraOffset.y = window.innerHeight/2-283;

    inventory.cameraOffset.x = window.innerWidth/2-200; 
    inventory.cameraOffset.y = window.innerHeight/2-200;

    oldmanText.cameraOffset.y = window.innerHeight-720;
    kidText.cameraOffset.y = window.innerHeight-720;
    clerkText.cameraOffset.y = window.innerHeight-720;
    clericText.cameraOffset.y = window.innerHeight-720;

    /*
    textBox.cameraOffset.x = window.innerWidth/2-245;
    textBox.cameraOffset.y =  window.innerHeight-90;

    textBox2.cameraOffset.x = window.innerWidth/2-245;
    textBox2.cameraOffset.y = window.innerHeight-160;
    */
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

function updateExpBar(){
    var pc = Math.ceil(player.exp/expReq[player.lvl-1]*10);

    $("#green-bars").empty();
    for (var i=0; i<pc; i++){
        var hp = $('<img />', {           
          src: 'assets/HUD/exp_bar.png'          
        });
        hp.appendTo($("#green-bars"));
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
    player.damage(enemy.atk*player.dmgMultiplyer);
    
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

        player.exp += enemy.exp;
        if (player.exp >= expReq[player.lvl-1]){
            console.log(player.lvl, player.exp, expReq[player.lvl-1]);
            player.exp = player.exp - expReq[player.lvl-1];
            player.lvl++;            
            levelUp();
        }
        updateExpBar();

        gold.getChildAt(0).setText(playerGold); 
        levelIcon.getChildAt(0).setText(player.lvl);
        
        switch (enemy.key){
            case "wolfBoss":
                dropItem(items.armor0, 'armor0', enemy.x, enemy.y, 1);
                break;
            case "skeleBoss":
                dropItem(items.armor1, 'armor1', enemy.x, enemy.y, 2);
                break;
            case "knightBoss":
                dropItem(items.armor2, 'armor2', enemy.x, enemy.y, 3);
                break;   
            case "spider":
                if (!unlockedWep[0] && Math.random()>0.5){
                    dropItem(items.weapon1, 'weapon1', enemy.x+this.x, enemy.y+this.y);
                    unlockedWep[0] = true;
                }
                break
            case "skeleton":
                if (!unlockedWep[1] && Math.random()>0.5){
                    dropItem(items.weapon2, 'weapon2', enemy.x+this.x, enemy.y+this.y);
                    unlockedWep[1] = true;
                }
                break 
            case "scorpion":
                if (!unlockedWep[2] && Math.random()>0.5){
                    dropItem(items.weapon3, 'weapon3', enemy.x+this.x, enemy.y+this.y);
                    unlockedWep[2] = true;
                }
                break          
        }      

        
    }    
    var madeBar = mobHealthBarManager(enemy.maxHealth, enemy.health);
    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);     

    enemy.removeChildAt(0);
    enemy.addChild(monHealthBar);   

    //for when atkBox is a projectile
    if (atkBox.key==="blue") atkBox.exists = false; 
}

function usePot(){
    if (gameState === states.alive){     
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
    shot.anchor.set(0.5,0.5);
    
    shot.body.velocity.x = 500*Math.cos(angle);
    shot.body.velocity.y = 500*Math.sin(angle);     

    shot.atk = this.atk;
}
