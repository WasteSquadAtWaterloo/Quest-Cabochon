var map;
var NPC;
var healer, kid, storeClerk;
var healerBox, kidBox, storeClerkBox;

function loadMap(key, spawn_x, spawn_y, bgn){
	if (!bgn){
        for (var enemy in enemys){
            enemys[enemy].destroy();
        }

        playerShots.destroy();
        mobShots.destroy();

        NPC.forEach(function(spr){
            spr.kill();
        });

		layer1.destroy();
		layer2.destroy();
		layer3.destroy();
		layer4.destroy();
		layer5.destroy();
		map.destroy();
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
    textBox.bringToTop();
    textBox2.bringToTop();
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
        this.body.velocity.x = 0; this.body.velocity.y = 0;        
        this.alive = false;
        this.events.onKilled$dispatch(this);
        this.animations.play('dead');  

        if (inventoryDisplayed) toggleInventory();

        var deathText = game.add.text(window.innerWidth/2-63.5, window.innerHeight/2-50, "lol rip", deathTxtStyle); 
        deathText.fixedToCamera = true;

        var reviveBtn = game.add.button(window.innerWidth/2-80, window.innerHeight/2+50, "reviveBtn", function(){
            deathText.destroy();
            player.revive();
            reviveBtn.destroy();
        }, this);
        reviveBtn.fixedToCamera = true;

        return this;
    }
    player.revive = function () {     
        if (map.key != "map0") loadMap('map0', spawn.x, spawn.y, false);
        else {
            this.x = spawn.x; 
            this.y = spawn.y;
        }

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

    for (var dir in dirs){
        player.animations.add(dirs[dir], playerFrames[dirs[dir]].walk, 10, false);

        for (var act in acts){
            player.animations.add(dirs[dir]+acts[act], playerFrames[dirs[dir]][acts[act].slice(1)], 15, false);
        }

        for (var wp=1; wp<=3; wp++){
            player.animations.add(dirs[dir]+"_meleeOS"+wp, playerFrames[dirs[dir]]['attackOS'+wp], 15, false).onComplete.add(function(){
                player.loadTexture(JSON.stringify(equip), playerFrames[player_dir].walk[0]);
                player.body.setSize(25, 20, 19, 43);
                //atkBox.body.setSize(30, 30, 0, 0);
            });
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

    textBox = game.add.sprite((window.innerWidth/2) - 245, (window.innerHeight) - 90 , 'textHud'); textBox.fixedToCamera = true; textBox.exists = false; 
    textBox2 = game.add.sprite((window.innerWidth/2) - 245, (window.innerHeight) - 160 , 'textHud2'); textBox2.fixedToCamera = true; textBox2.exists = false; 
    
    goldHud = game.add.sprite(0, 80, 'gold_and_exp_hud');
    goldHud.scale.set(1.2);
    goldHud.fixedToCamera = true;

    levelIcon = itemFrames.load("levelIcon", 180, 85);
    levelIcon.scale.set(0.8);
    levelText = game.add.text(-15, 12, player.lvl.toString(), niceTxtStyle);
    levelIcon.addChild(levelText);
    levelIcon.fixedToCamera = true;

    gold = game.add.sprite(30, 88, 'goldIcon');
    gold.scale.set(0.8);
    goldText = game.add.text(35,9,playerGold.toString(), niceTxtStyle);
    gold.addChild(goldText);

    gold.fixedToCamera = true;
    updateHealthBar();
    updateManaBar();

    game.camera.follow(player);
}

function initNPC(){
    /*
    textBox = game.add.sprite((window.innerWidth/2) - 245, (window.innerHeight) - 90 , 'textHud'); 
    textBox.fixedToCamera = true; 
    textBox.exists = false;

    textBox2 = game.add.sprite((window.innerWidth/2) - 245, (window.innerHeight) - 180 , 'textHud2'); 
    textBox2.fixedToCamera = true;
    textBox2.exists = false; */

    NPC = game.add.group();
    NPC.enableBody = true;
    NPC.physicsBodyType = Phaser.Physics.ARCADE;

    healerBox =  game.add.sprite(-50, -50, "attackBox"); healerBox.scale.set(5); game.physics.enable(healerBox, Phaser.Physics.ARCADE); healerBox.name = "healerBox";
    kidBox =  game.add.sprite(-50, -50, "attackBox"); kidBox.scale.set(5); game.physics.enable(kidBox, Phaser.Physics.ARCADE); kidBox.name = "kidBox";
    storeClerkBox = game.add.sprite(-50, -50, "attackBox"); storeClerkBox.scale.set(5); game.physics.enable(storeClerkBox, Phaser.Physics.ARCADE); storeClerkBox.name = "storeClerkBox";
    oldManBox =  game.add.sprite(-50, -50, "attackBox"); oldManBox.scale.set(5); game.physics.enable(oldManBox, Phaser.Physics.ARCADE); oldManBox.name = "oldManBox";

    healer = NPC.create(1060, 230, 'healer'); healer.scale.set(1.2); healer.addChild(healerBox); 
    kid = NPC.create(1350, 565, 'kid'); kid.scale.set(1.2); kid.addChild(kidBox);
    storeClerk = NPC.create(533, 758, 'clerk'); storeClerk.scale.set(1.2); storeClerk.addChild(storeClerkBox); 
    oldMan = NPC.create(1780, 660, 'oldman'); oldMan.scale.set(1.2); oldMan.addChild(oldManBox);
}

function createDialogue(collisionBox, player) {
    var NPCname = (collisionBox.name).toString();
    if (dialogue == false){        
        if (NPCname == "kidBox") {
            textBox.exists = true;
            if (gameProgress < 2){
                var kidText = game.add.text(15, 15, "Each month has its own birthstone. Mine is the Ruby. \nWhat is yours?", niceTxtStyle);
            }
            else if (gameProgress >= 2){
                var kidText = game.add.text(15,15, "Some say that Asc was killed by his own creations; \nhowever, rumors have it that he is still alive.", niceTxtStyle);
            }
            textBox.addChild(kidText);            
        }
        else if (NPCname == "healerBox") {
            textBox.exists = true;           
            var healerText = game.add.text(15, 15, "Hello, I am the cleric and healer of this village. \nHere. I'll treat any wounds you might have.", niceTxtStyle);
            textBox.addChild(healerText);

            player.heal(100); player.mana = player.maxMana;
            updateHealthBar(); updateManaBar();
        }
        else if (NPCname == "oldManBox") {
            textBox2.exists = true;            
            switch (gameProgress) {
                case 0:
                    var oldManText = game.add.text(15,15, "Ah! welcome! You must be the adventurer sent by the \nthe agency. I am Elmeld, the chief of this town. \nLately, we have been attacked by The Forest King, a \nbeast residing in the forest North-West of the city. \nPlease help us by defeating it and restoring peace \nto our town. ", niceTxtStyle);
                    break;

                case 1:
                    var oldManText = game.add.text(15,15, "Amazing! Thank you adventurer for saving our village \nfrom the Forest King... What? The body disintegrated \nand left a yellow glowing gem? This is troubling. \nI have a bad feeling about this. I'm sorry to bother \nyou further, but could you visit the South-West side \nof the town and investigate the Drarr graveyard?", niceTxtStyle);
                    break;

                case 2:
                    var oldManText = game.add.text(15,15, "...Uh-huh...I see. It is just as I feared. These gems \nyou found are the fabled Cursed Stones of Asc. These \nare 3 stones created by the infamous First-Age mage, \nAsc. North-East of our village is the Usten Kingdom. \nPlease visit Lord Kinonn and ask him how we should \ndispose of these gems.", niceTxtStyle);
                    break;

                case 3:
                    var oldManText = game.add.text(15,15, "What? Lord Kinonn was possessed by a gem? This \nis... this is... AMAZING. KEKEKE. NOT ONLY HAVE YOU \nCOLLECTED ALL 3 STONES FOR ME, BUT YOU HAVE ALSO \nDEFEATED THE ONLY ONE WHO CAN STOP ME. THAT IS RIGHT, \nI AM THE GREAT ASC. NOW THAT I HAVE ALL THE STONES, \nI CAN RETURN TO MY TRUE FORM.", niceTxtStyle);
                    break;

                case 4:
                    var oldManText = game.add.text(15,15, "Me, the great Asc? Defeated by a measly \nadventurer? Kekeke... What a world.", niceTxtStyle);
                    break;
            }
            
            textBox2.addChild(oldManText);
        }
        
    }
    dialogue = true;

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
    }

    else if (map==='map1'){
        if ((player.y>=2051 && player.y<=2127) && player.x>1780){
            loadMap('map0', 96, 264, false);
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
    }
}

function levelUp(){
    player.maxHealth += 5;
    player.heal(5);
    player.maxMana += 5;
    player.mana += 5;
    player.mAtk += 1;
}