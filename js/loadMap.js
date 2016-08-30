var map;
var NPC;
var healer, kid, storeClerk, oldMan;
var healerBox, kidBox, storeClerkBox;
var oldmanText, kidText, clerkText, clericText, wolfBossText, skeleBossText, knightBossText, raidBossText;
var bgm = {};
var mapMusic = {
    'map0' : 'forest',
    'map1' : 'forest',
    'map2' : 'forest',
    'map4' : 'forest',
    'map3' : 'graveyard',
    'map5' : 'castle',
    'map6' : 'raidBossBattle'
}
var woosh, wep1_sound, wep2_sound, wep3_sound, spellSound, spellImpactSound, wolfDeathSound, skeleDeathSound, knightDeathSound, raidBossDeathSound;

function loadMap(key, spawn_x, spawn_y, bgn){
	if (!bgn){
        if (mapMusic[key] !== mapMusic[map.key]){
            for (var m in bgm)
                if (bgm[m].isPlaying) bgm[m].stop();            
            bgm[mapMusic[key]].play();
        }   

        for (var enemy in enemys){
            enemys[enemy].destroy();
        }

        playerShots.destroy();
        mobShots.destroy();

        if (map.key != "map0"){
            NPC.forEach(function(spr){   
                if (spr.visible) spr.visible = false;
            });           
        }        

		layer1.destroy();
		layer2.destroy();
		layer3.destroy();
		layer4.destroy();
		layer5.destroy();
		map.destroy();
        map.key = "map0";
	}else {
        bgm.forest.play();
    }
    
    
	map = game.add.tilemap(key);   
    map.addTilesetImage('roguelikeSheet_transparent','tiles');

    layer1 = map.createLayer(0); layer1.smoothed = false; layer1.setScale(3);
    layer2 = map.createLayer(1); layer2.smoothed = false; layer2.setScale(3);     
    layer3 = map.createLayer(2); layer3.smoothed = false; layer3.setScale(3);
    layer4 = map.createLayer(3); layer4.smoothed = false; layer4.setScale(3);    
    
    if (key==='map0'){        
        game.world.bringToTop(NPC);
        NPC.forEach(function(spr){
            spr.revive();
        }); 
    }   
    initEnemys(key);
    if (key==='map6'){
        easystar = new EasyStar.js();
        timestep = 400;

        level = [[0, 0, 1363, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1363, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 539, 0, 0, 0, 0, 0, 539, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 0, 0, 0, 0], [0, 0, 1363, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1363, 1138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1138, 0, 0, 0, 0, 874, 874, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1138, 1138, 0, 0, 874, 874, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1363, 1138, 0, 873, 874, 874, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1363, 0, 0, 873, 874, 874, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1363, 0, 0, 870, 869, 869, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 874, 874, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1363, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 874, 874, 874, 0, 0, 0, 875, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 873, 874, 874, 874, 874, 874, 0, 0, 875, 0, 0, 0, 0, 0], [0, 0, 0, 0, 850, 851, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 870, 869, 869, 869, 869, 869, 869, 869, 872, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 793, 794, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 539, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1080, 795, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 874, 0, 0, 874, 874, 0, 0, 874, 874, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 874, 874, 874, 874, 874, 0, 0, 874, 874, 875, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 874, 874, 874, 874, 874, 874, 874, 874, 874, 875, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 870, 869, 869, 869, 869, 869, 869, 869, 869, 869, 872, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1138, 1138, 0, 1138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 495, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1138, 0, 0, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 1360, 1361, 495, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

        easystar.setGrid(level);
        easystar.setIterationsPerCalculation(500); 
        easystar.setAcceptableTiles([0]);
        //easystar.enableCornerCutting();
        //easystar.enableDiagonals();
    }

    player.bringToTop();
    player.x = spawn_x; player.y = spawn_y;

    layer5 = map.createLayer(4); layer5.smoothed = false; layer5.setScale(3);    
    layer1.resizeWorld(); 

    map.setCollisionByExclusion(stand,true,layer1);      
    map.setCollisionByExclusion(stand,true,layer2);  
    map.setCollisionByExclusion(stand,true,layer3);  
    map.setCollisionByExclusion(stand,true,layer4);  
    map.setCollisionByExclusion(stand,true,layer5);

    playerShots = game.add.group();
    mobShots = game.add.group();

    shop.bringToTop(); 
    inventory.bringToTop();

    oldmanText.bringToTop();
    kidText.bringToTop();
    clericText.bringToTop();
    clerkText.bringToTop();

    wolfBossText.bringToTop();
    skeleBossText.bringToTop();
    knightBossText.bringToTop();
    raidBossText.bringToTop();
    
    goldHud.bringToTop();
    gold.bringToTop();
    levelIcon.bringToTop();   
}


function initPlayer(spawnX, spawnY, hp){
    atkBox = game.add.sprite(spawn.x-12,spawn.y-17, "attackBox");
    game.physics.enable(atkBox, Phaser.Physics.ARCADE);

	player = game.add.sprite(spawnX, spawnY, JSON.stringify(equip), playerFrames.down.walk[0]);
    player.maxHealth = maxHealth;
    player.setHealth(hp);

    player.maxMana = 20;
    player.mana = 20;

    player.lvl = 1;
    player.exp = 0;    

    player.atk = 3;
    player.mAtk = 5;

    player.dmgMultiplyer = 1;

    player.kill = function(){ 
        gameState = states.dead;

        player.loadTexture(JSON.stringify(equip));

        this.body.velocity.x = 0; this.body.velocity.y = 0;        
        this.alive = false;
        this.events.onKilled$dispatch(this);
        this.animations.play('dead');  

        if (inventoryDisplayed) toggleInventory();        

        if (map.key === "map6"){
            var deathText = game.add.text(window.innerWidth/2-206, window.innerHeight/2-50, "You have died. The game is over", deathTxtStyle); 
            deathText.fixedToCamera = true;          

            var reviveBtn = game.add.button(window.innerWidth/2-80, window.innerHeight/2+50, "restartBtn", function(){
                window.location.reload();
            }, this);
            reviveBtn.fixedToCamera = true;
        }
        else {
            var deathText = game.add.text(window.innerWidth/2-95, window.innerHeight/2-50, "You have died.", deathTxtStyle); 
            deathText.fixedToCamera = true;            

            var reviveBtn = game.add.button(window.innerWidth/2-80, window.innerHeight/2+50, "reviveBtn", function(){
                deathText.destroy();
                player.revive();
                reviveBtn.destroy();
            }, this);
            reviveBtn.fixedToCamera = true;
        }   
        return this;
    }
    player.revive = function () {
        if (map.key != "map0") loadMap('map0', spawn.x, spawn.y, false);        
        else {
            this.x = spawn.x; 
            this.y = spawn.y;
        }

        gameState = states.alive;

        this.exp = 0;
        updateExpBar();

        playerGold = Math.floor(playerGold/2);
        gold.getChildAt(0).setText(playerGold); 

        this.alive = true;
        this.exists = true;
        this.visible = true;
        this.setHealth(this.maxHealth); 
        updateHealthBar();       

        if (this.events)
        {
            this.events.onRevived$dispatch(this);
        }

        return this;
    }     
     

    player.anchor.setTo(0.5,0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.setSize(25, 20, 20, 45);

    //loading animations
    var dirs = ['down', 'up', 'left', 'right'];
    var acts = ['_melee', '_spell'];
    var anim;

    for (var dir in dirs){
        player.animations.add(dirs[dir], playerFrames[dirs[dir]].walk, 10, false);

        for (var act in acts){
            anim = player.animations.add(dirs[dir]+acts[act], playerFrames[dirs[dir]][acts[act].slice(1)], 15, false);            
            if (acts[act]==='_melee'){                 
                anim.onStart.add(function(){                    
                    woosh.play();//restart('', 0, 0.25);
                });
            }else {
                anim.onStart.add(function(){                    
                    spellSound.play();//restart('', 0, 0.1);
                });
            }
        }

        for (var wp=1; wp<=3; wp++){
            anim = player.animations.add(dirs[dir]+"_meleeOS"+wp, playerFrames[dirs[dir]]['attackOS'+wp], 15, false);
            anim.onComplete.add(function(){
                player.loadTexture(JSON.stringify(equip), playerFrames[player_dir].walk[0]);
                player.body.setSize(25, 20, 19, 43);                
            });

            switch (wp){
                case (1): 
                    anim.onStart.add(function(){                                         
                        wep1_sound.play();//restart('', 0, 0.25);
                    });
                    break;
                case (2):
                    anim.onStart.add(function(){                                        
                        wep2_sound.play();//restart('', 0, 0.25);
                    });
                    break;
                case (3):
                    anim.onStart.add(function(){                                            
                        wep3_sound.play();//restart('', 0, 0.15);
                    });
                    break;
            }

            
        }
    }
    player.animations.add('dead', playerFrames.dead, 5, false);     

    player.OS = function(dir){     

        if (player.key != JSON.stringify(equip)+weapon) {
            player.loadTexture(JSON.stringify(equip)+weapon);            
            player.body.setSize(25, 20 , 83, 107);
        }
        player.play(dir+"_meleeOS"+weapon);       
    } 

    /*
    textBox = game.add.sprite((window.innerWidth/2) - 245, (window.innerHeight) - 90 , 'textHud'); textBox.fixedToCamera = true; textBox.exists = false; 
    textBox2 = game.add.sprite((window.innerWidth/2) - 245, (window.innerHeight) - 160 , 'textHud2'); textBox2.fixedToCamera = true; textBox2.exists = false; 
    */

    goldHud = game.add.sprite(5, 90, 'gold_and_exp_hud');
    goldHud.scale.set(1.2);
    goldHud.fixedToCamera = true;

    levelIcon = itemFrames.load("levelIcon", 148, 5); goldHud.addChild(levelIcon);
    levelIcon.scale.set(0.67);
    levelText = game.add.text(-20, -5, player.lvl.toString(), niceTxtStyle); levelText.fontSize = 30;
    levelIcon.addChild(levelText);
    

    gold = game.add.sprite(28, 6.5, 'goldIcon'); goldHud.addChild(gold);
    gold.scale.set(0.67);
    goldText = game.add.text(35,0,playerGold.toString(), niceTxtStyle); goldText.fontSize = 20;
    gold.addChild(goldText);

    
    updateHealthBar();
    updateManaBar();

    game.camera.follow(player);
}

function initNPC(){
    NPC = game.add.group();
    NPC.enableBody = true;
    NPC.physicsBodyType = Phaser.Physics.ARCADE;

    clericBox =  game.add.sprite(-50, -50, "attackBox"); clericBox.scale.set(5); game.physics.enable(clericBox, Phaser.Physics.ARCADE); clericBox.name = "cleric";
    kidBox =  game.add.sprite(-50, -50, "attackBox"); kidBox.scale.set(5); game.physics.enable(kidBox, Phaser.Physics.ARCADE); kidBox.name = "kid";
    clerkBox = game.add.sprite(-50, -50, "attackBox"); clerkBox.scale.set(5); game.physics.enable(clerkBox, Phaser.Physics.ARCADE); clerkBox.name = "clerk";
    oldManBox =  game.add.sprite(-50, -50, "attackBox"); oldManBox.scale.set(5); game.physics.enable(oldManBox, Phaser.Physics.ARCADE); oldManBox.name = "oldman";

    healer = NPC.create(1060, 230, 'healer'); healer.scale.set(1.2); healer.addChild(clericBox); 
    kid = NPC.create(1350, 565, 'kid'); kid.scale.set(1.2); kid.addChild(kidBox);
    storeClerk = NPC.create(533, 758, 'clerk'); storeClerk.scale.set(1.2); storeClerk.addChild(clerkBox); 
    oldMan = NPC.create(1780, 660, 'oldman'); oldMan.scale.set(1.2); oldMan.addChild(oldManBox);

    oldmanText = game.add.sprite(0, window.innerHeight-720, "oldmanDialogue"); oldmanText.fixedToCamera = true; oldmanText.exists = false;
    kidText = game.add.sprite(0, window.innerHeight-720, "kidDialogue"); kidText.fixedToCamera = true; kidText.exists = false;
    clerkText = game.add.sprite(0, window.innerHeight-720, "clerkDialogue"); clerkText.fixedToCamera = true; clerkText.exists = false;
    clericText = game.add.sprite(0, window.innerHeight-720, "clericDialogue"); clericText.fixedToCamera = true; clericText.exists = false;

    wolfBossText = game.add.sprite(0, window.innerHeight-720, "wolfBossDialogue"); wolfBossText.fixedToCamera = true; wolfBossText.exists = false;
    skeleBossText = game.add.sprite(0, window.innerHeight-720, "skeleBossDialogue"); skeleBossText.fixedToCamera = true; skeleBossText.exists = false;
    knightBossText = game.add.sprite(0, window.innerHeight-720, "knightBossDialogue"); knightBossText.fixedToCamera = true; knightBossText.exists = false;
    raidBossText = game.add.sprite(0, window.innerHeight-720, "raidBossDialogue"); raidBossText.fixedToCamera = true; raidBossText.exists = false;
}

function initInput(){
    cursors = game.input.keyboard.createCursorKeys(); 
    wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        E: game.input.keyboard.addKey(Phaser.Keyboard.E),
        Q: game.input.keyboard.addKey(Phaser.Keyboard.Q),
        C: game.input.keyboard.addKey(Phaser.Keyboard.C),
        Z: game.input.keyboard.addKey(Phaser.Keyboard.Z),
        space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };
    game.input.mouse.capture = true;

    //pots
    wasd.E.onDown.add(usePot, 'hp');
    
    wasd.Q.onDown.add(usePot, 'mp');

    wasd.C.onDown.add(toggleInventory); 


}

function portalCheck(map){
    if (map==="map0"){
        if ((player.y>=227 && player.y<=303) && player.x<95){
            loadMap('map1', 1728, 2088, false);
        }
        else if ((player.x>=828 && player.x<=947) && player.y>1275){
            loadMap('map2', 2616, 216, false);            
        }
        else if ((player.x>=1710 && player.x<=1750) && player.y<612){
            loadMap('map6', spawn.x, spawn.y, false);
        }
    }

    else if (map==='map1'){
        if ((player.y>=2051 && player.y<=2127) && player.x>1780){
            loadMap('map0', 96, 264, false);
        }
        //for bgm & dialogue purposes - wolfboss
        else if ((player.y >= 336 && player.y <= 770) && (player.x < 912 && player.x >906)){
            if (!bgm.wolfBattle.isPlaying && player.body.velocity.x < 0 && enemys.wolfBoss){
                if (enemys.wolfBoss.children.length){
                    bgm.forest.stop();
                    bgm.wolfBattle.play();
                    
                    createDialogue({name:"wolfBoss"});
                }
            }else if (!bgm.forest.isPlaying){
                bgm.wolfBattle.stop();
                bgm.forest.play();                
            }
        }else {

        }                
    }

    else if (map==='map2'){
        if ((player.x>=2556 && player.x<=2675) && player.y<200){
            loadMap('map0', 888, 1248, false);
        } 
        else if((player.x>=2076 && player.x<=2243) && player.y>1900){
            loadMap('map3', 1274, 0, false);
        }
        else if((player.y>=630 && player.y<=735) && player.x>3360){
            loadMap('map4', 8, 3407, false);
        }

    }

    else if (map==='map3'){
        if (player.y<0){
            loadMap('map2', 2160, 1872, false);
        }
        //for bgm & dialogue purposes - skeleBoss
        else if ((player.x >= 960 && player.x <= 1152) && (player.y >1824 && player.y<1832)){
            if (!bgm.skeleBattle.isPlaying && player.body.velocity.y>0 && enemys.skeleBoss){
                if (enemys.skeleBoss.children.length){
                    bgm.graveyard.stop();
                    bgm.skeleBattle.play();

                    createDialogue({name:"skeleBoss"});
                }
            }else if (!bgm.graveyard.isPlaying){
                bgm.skeleBattle.stop();
                bgm.graveyard.play();
            }
        }
    }

    else if (map==="map4"){
        if ((player.y>=3347 && player.y<=3471) && player.x<0){
            loadMap('map2', 3344, 672, false);
        }
        else if ((player.x>=1548 && player.x<=1667) && player.y<0){
            loadMap('map5', 480, 928, false);
        }
    }

    else if (map==="map5"){
        if (player.y>960){
            loadMap('map4', 1612, 35, false);
        }
        //for bgm & dialogue purposes - knightboss
        else if ((player.x >= 336 && player.x <= 576) && (player.y < 900 && player.y >894) && 
            player.body.velocity.y<0 && enemys.knightBoss){

            if (enemys.knightBoss.children.length)
                createDialogue({name:"knightBoss"});
        }
    }
}

function levelUp(){
    player.maxHealth += 5;
    player.heal(5);
    player.maxMana += 5;
    player.mana += 5;
    player.mAtk += 1;
}

function initAudio(){
    bgm['forest'] = game.add.audio('forest', 0.01, true);
    bgm['graveyard'] = game.add.audio('graveyard', 0.3, true);
    bgm['castle'] = game.add.audio('castle', 0.01, true);
    bgm['wolfBattle'] = game.add.audio('wolfBattle', 0.01, true);
    bgm['skeleBattle'] = game.add.audio('skeleBattle', 0.05, true);
    bgm['raidBossBattle'] = game.add.audio('raidBossBattle', 0.02, true);
    bgm['victory'] = game.add.audio('victory', 0.05, true);

    woosh = game.add.audio('woosh', 0.1);
    wep1_sound = game.add.audio('wep1', 0.1);
    wep2_sound = game.add.audio('wep2', 0.1);
    wep3_sound = game.add.audio('wep3', 0.05);

    spellSound = game.add.audio('spell', 0.05);
    spellImpactSound = game.add.audio('spell_impact', 0.05);

    wolfDeathSound = game.add.audio('wolfDeath', 0.05);
    skeleDeathSound = game.add.audio('skeleDeath', 0.1);
    knightDeathSound = game.add.audio('knightDeath', 0.1);
    raidBossDeathSound = game.add.audio('raidBossDeath', 0.1);
}