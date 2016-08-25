function initEnemys(map){
    if (map === 'map1'){
        //change snail stats
        enemys.snails = game.add.group();
        createEnemys(enemys.snails, 'snail', 7, 3, 1392, 1196, 2065, 480, 2, 5, 1.5, 15, 2);        

    	enemys.spiders = game.add.group();
    	createEnemys(enemys.spiders, 'spider', 10, 5, 950, 336, 2158, 480, 2, 5, 1.5, 25, 3);

        if (gameProgress<1){
            enemys.wolfBoss = game.add.group();
            createWolfBoss('wolfBoss', 50, 5, 400, 600, 100, 100, 3, 300);
        }
    }
    else if (map === 'map2'){

        enemys.spiders = game.add.group(); 
        createEnemys(enemys.spiders, 'spider', 10, 5, 432, 432, 2064, 336, 2, 5, 1.5, 25, 3);

        //change atk,hp and gold of log monster
        enemys.logmonsters = game.add.group();
        createEnemys(enemys.logmonsters, 'logmonster', 15, 7, 432, 1104, 1584, 482, 3, 4, 1.5, 50, 5);
    }
    else if (map === "map3"){
        enemys.skeletons = game.add.group();
        createEnemys(enemys.skeletons, 'skeleton', 20, 10, 284, 384, 1736, 580, 2, 6, 1.5, 70, 6);

        enemys.zombies = game.add.group();
        createEnemys(enemys.zombies, 'zombie', 25, 12, 200, 1052, 1800, 700, 3, 4, 1.5 , 85, 7);

        if (gameProgress<2){
            enemys.skeleBoss = game.add.group();
            createSkeleBoss('skeleBoss', 200, 15, 1450, 1970, 100, 100, 2, 500);
        }
    }
    else if(map === 'map4'){
        enemys.logmonsters = game.add.group();
        createEnemys(enemys.logmonsters, 'logmonster', 15, 7, 288, 4032, 1632, 480, 2, 5, 1.5, 50, 5);    

        enemys.scorpions = game.add.group();
        createEnemys(enemys.scorpions, 'scorpion', 30, 15, 1392, 1008, 560, 2736, 7, 2, 1.5, 100, 8);  
    }    
    else if (map === "map5") {
        if (gameProgress<3){
            enemys.knightBoss = game.add.group();
            createKnightBoss('knightBoss', 400, 15, 450, 370, 100, 100, 1.5, 1000);
        }

        enemys.guards = game.add.group();
        createEnemys(enemys.guards, 'guard', 45, 20, 130, 528, 624, 288, 1, 4, 2, 150, 10);
    }    
    else if (map === "map6") {
        enemys.raidBoss = game.add.group();
        createRaidBoss('raidBoss', 500, 20, 540, 338, 850, 550, 1.5, 2500);
    }

}

function createEnemys(group, key, hp, atk, topX, topY, width, height, rows, cols, scale, goldAmount, xp){
    group.enableBody = true;
    group.physicsBodyType = Phaser.Physics.ARCADE;

	var eachX = width/cols;
	var eachY = height/rows;

    for (var i=0; i<cols; i++){
        for (var j=0; j<rows; j++){
            var enemy = group.create(eachX*i + eachX/2, eachY*j + eachY/2, key);
            enemy.maxHealth = hp;
            enemy.setHealth(hp);            

            var madeBar = mobHealthBarManager(enemy.health, enemy.health);
            var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
            enemy.addChild(monHealthBar);

            enemy.scale.set(scale);       
            enemy.animations.add('move', enemyFrames[key].down.walk, 10, true);              
            enemy.play('move');            
            enemy.atk = atk;
            enemy.exp = xp;

            enemy.deathTime = 0;            
            enemy.gold = goldAmount;
            game.add.tween(enemy).to( { 
            	x: enemy.x + (Math.random()*80+50)*randSign(), 
            	y: enemy.y + (Math.random()*80+50)*randSign()}, 
            Math.random()*1000+1000, null, true, Math.random()*2000, -1, true);
        }
    }

    group.x = topX;
    group.y = topY;
}

function createWolfBoss(key, hp, atk, topX, topY, width, height, scale, goldAmount) {
    var wolfBoss = enemys.wolfBoss.create(topX, topY, 'wolfBoss');

    wolfBoss.maxHealth = hp;
    wolfBoss.setHealth(hp);
    game.physics.enable(wolfBoss, Phaser.Physics.ARCADE);   

    var madeBar = mobHealthBarManager(wolfBoss.health, wolfBoss.health);
    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
    wolfBoss.addChild(monHealthBar);

    wolfBoss.scale.set(scale);       
    wolfBoss.animations.add('down', [0,1,2,3], 10, true);
    wolfBoss.animations.add('left', [4,5,6,7], 10, true);   
    wolfBoss.animations.add('right', [8,9,10,11], 10, true);   
    wolfBoss.animations.add('up', [12,13,14,15], 10, true);                 
    wolfBoss.play('down');            
    wolfBoss.atk = atk;
    wolfBoss.exp = 10;

    wolfBoss.gold = goldAmount;
    var tweenA = game.add.tween(wolfBoss).to( { 
        x: wolfBoss.x + (Math.random()*80+80)}, 
    Math.random()*1000+1000, null, false, Math.random()*2000, 0, false);
    tweenA.onStart.add(function(){
        wolfBoss.play('right');
    });

    var tweenB = game.add.tween(wolfBoss).to( {  
        y: wolfBoss.y + (Math.random()*80+80)}, 
    Math.random()*1000+1000, null, false, Math.random()*2000, 0, false);
    tweenB.onStart.add(function(){
        wolfBoss.play('down');
    });

    var tweenC = game.add.tween(wolfBoss).to( { 
        x: wolfBoss.x - (Math.random()*80+80)}, 
    Math.random()*1000+1000, null, false, Math.random()*2000, 0, false);
    tweenC.onStart.add(function(){
        wolfBoss.play('left');
    });

    var tweenD = game.add.tween(wolfBoss).to( { 
        y: wolfBoss.y - (Math.random()*80+80)}, 
    Math.random()*1000+1000, null, false, Math.random()*2000, 0, false);
    tweenD.onStart.add(function(){
        wolfBoss.play('up');
    });

    tweenA.chain(tweenB); tweenB.chain(tweenC); tweenC.chain(tweenD); tweenD.chain(tweenA);

    tweenA.start();

}
function createSkeleBoss(key, hp, atk, topX, topY, width, height, scale, goldAmount) {
    var skeleBoss = enemys.skeleBoss.create(topX, topY, 'skeleBoss');
    
    skeleBoss.maxHealth = hp;
    skeleBoss.setHealth(hp);
    game.physics.enable(skeleBoss, Phaser.Physics.ARCADE);

    var madeBar = mobHealthBarManager(skeleBoss.health, skeleBoss.health);
    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
    skeleBoss.addChild(monHealthBar);

    skeleBoss.scale.set(scale);       
    skeleBoss.animations.add('down', [0,1,2,3], 10, true);    
    skeleBoss.animations.add('left', [4,5,6,7], 10, true); 
    skeleBoss.animations.add('right', [8,9,10,11], 10, true); 
    skeleBoss.animations.add('up', [12,13,14,15], 10, true);           
    skeleBoss.play('down');            
    skeleBoss.atk = atk;
    skeleBoss.exp = 20;

    skeleBoss.gold = goldAmount;
    var tweenA = game.add.tween(skeleBoss).to( { 
        x: skeleBoss.x + (Math.random()*80+80)}, 
    Math.random()*1000+750, null, false, Math.random()*1000, 0, false);
    tweenA.onStart.add(function(){
        skeleBoss.play('right');
    });

    var tweenB = game.add.tween(skeleBoss).to( {  
        y: skeleBoss.y + (Math.random()*80+80)}, 
    Math.random()*1000+750, null, false, Math.random()*1000, 0, false);
    tweenB.onStart.add(function(){
        skeleBoss.play('down');
    });

    var tweenC = game.add.tween(skeleBoss).to( { 
        x: skeleBoss.x - (Math.random()*80+80)}, 
    Math.random()*1000+750, null, false, Math.random()*1000, 0, false);
    tweenC.onStart.add(function(){
        skeleBoss.play('left');
    });

    var tweenD = game.add.tween(skeleBoss).to( { 
        y: skeleBoss.y - (Math.random()*80+80)}, 
    Math.random()*1000+750, null, false, Math.random()*1000, 0, false);
    tweenD.onStart.add(function(){
        skeleBoss.play('up');
    });

    tweenA.chain(tweenB); tweenB.chain(tweenC); tweenC.chain(tweenD); tweenD.chain(tweenA);

    tweenA.start();
}
function createKnightBoss(key, hp, atk, topX, topY, width, height, scale, goldAmount) {
    var knightBoss = enemys.knightBoss.create(topX, topY, 'knightBoss');
    
    knightBoss.maxHealth = hp;
    knightBoss.setHealth(hp);
    game.physics.enable(knightBoss, Phaser.Physics.ARCADE);

    var madeBar = mobHealthBarManager(knightBoss.health, knightBoss.health);
    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
    knightBoss.addChild(monHealthBar);

    knightBoss.scale.set(scale);       
    knightBoss.animations.add('down', [0,1,2,3], 10, true);    
    knightBoss.animations.add('left', [4,5,6,7], 10, true); 
    knightBoss.animations.add('right', [8,9,10,11], 10, true); 
    knightBoss.animations.add('up', [12,13,14,15], 10, true);           
    knightBoss.play('down');            
    knightBoss.atk = atk;
    knightBoss.exp = 30;

    knightBoss.gold = goldAmount;
    var tweenA = game.add.tween(knightBoss).to( { 
        x: knightBoss.x + (Math.random()*40+80)}, 
    Math.random()*750+750, null, false, Math.random()*850, 0, false);
    tweenA.onStart.add(function(){
        knightBoss.play('right');
    });

    var tweenB = game.add.tween(knightBoss).to( {  
        y: knightBoss.y + (Math.random()*40+80)}, 
    Math.random()*750+750, null, false, Math.random()*850, 0, false);
    tweenB.onStart.add(function(){
        knightBoss.play('down');
    });

    var tweenC = game.add.tween(knightBoss).to( { 
        x: knightBoss.x - (Math.random()*40+80)}, 
    Math.random()*750+750, null, false, Math.random()*850, 0, false);
    tweenC.onStart.add(function(){
        knightBoss.play('left');
    });

    var tweenD = game.add.tween(knightBoss).to( { 
        y: knightBoss.y - (Math.random()*40+80)}, 
    Math.random()*750+750, null, false, Math.random()*850, 0, false);
    tweenD.onStart.add(function(){
        knightBoss.play('up');
    });

    tweenA.chain(tweenB); tweenB.chain(tweenC); tweenC.chain(tweenD); tweenD.chain(tweenA);

    tweenA.start();
}

function createRaidBoss(key, hp, atk, topX, topY, width, height, scale, goldAmount) {
    var raidBoss = enemys.raidBoss.create(topX, topY, 'raidBoss');
    
    raidBoss.maxHealth = hp;
    raidBoss.setHealth(hp);
    game.physics.enable(raidBoss, Phaser.Physics.ARCADE);

    var madeBar = mobHealthBarManager(raidBoss.health, raidBoss.health);
    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
    raidBoss.addChild(monHealthBar);

    raidBoss.scale.set(scale);       
    raidBoss.animations.add('down', [0,1,2,3], 10, true);   
    raidBoss.animations.add('left', [4,5,6,7], 10, true);     
    raidBoss.animations.add('right', [8,9,10,11], 10, true);     
    raidBoss.animations.add('up', [12,13,14,15], 10, true);                
    //raidBoss.play('move');            
    raidBoss.atk = atk;
    raidBoss.exp = 150;

    raidBoss.gold = goldAmount;
}

function raidBossAi(){
    currentBossXtile = Math.round(enemys.raidBoss.children[0].x/48);
    currentBossYtile = Math.round(enemys.raidBoss.children[0].y/48);
    currentPlayerXtile = Math.round(player.x/48);
    currentPlayerYtile = Math.round(player.y/48);
    //console.log(currentBossXtile, currentBossYtile, currentPlayerXtile, currentPlayerYtile);

    setInterval(function(){
        easystar.findPath(currentBossXtile, currentBossYtile, currentPlayerXtile, currentPlayerYtile, function( path ) {
            if (path) {        
                if (path[1]){        
                    currentNextPointX = path[1].x;
                    currentNextPointY = path[1].y;
                }
            }
            
            if (currentNextPointX < currentBossXtile && currentNextPointY < currentBossYtile)
            {
                // left up
                
                //console.log("GO LEFT UP");
                
                //enemyDirection = "NW";
                enemys.raidBoss.children[0].body.velocity.x = -300;
                enemys.raidBoss.children[0].body.velocity.y = -300;
                enemys.raidBoss.children[0].play("up");
            }
            else if (currentNextPointX == currentBossXtile && currentNextPointY < currentBossYtile)
            {
                // up
                
                //console.log("GO UP");
                
                //enemyDirection = "N";
                enemys.raidBoss.children[0].body.velocity.x = 0;
                enemys.raidBoss.children[0].body.velocity.y = -300;
                enemys.raidBoss.children[0].play("up");
                
            }
            else if (currentNextPointX > currentBossXtile && currentNextPointY < currentBossYtile)
            {
                // right up
                
                //console.log("GO RIGHT UP");
                
                //enemyDirection = "NE";
                enemys.raidBoss.children[0].body.velocity.x = 300;
                enemys.raidBoss.children[0].body.velocity.y = -300;
                enemys.raidBoss.children[0].play("up");
                
            }
            else if (currentNextPointX < currentBossXtile && currentNextPointY == currentBossYtile)
            {
                // left
                
                //console.log("GO LEFT");
                
                //enemyDirection = "W";
                enemys.raidBoss.children[0].body.velocity.x = -300;
                enemys.raidBoss.children[0].body.velocity.y = 0;
                enemys.raidBoss.children[0].play("left");
                
            }
            else if (currentNextPointX > currentBossXtile && currentNextPointY == currentBossYtile)
            {
                // right
                
                //console.log("GO RIGHT");
                
                //enemyDirection = "E";
                enemys.raidBoss.children[0].body.velocity.x = 300;
                enemys.raidBoss.children[0].body.velocity.y = 0;
                enemys.raidBoss.children[0].play("right");
            
            }
            else if (currentNextPointX > currentBossXtile && currentNextPointY > currentBossYtile)
            {
                // right down
                
                //console.log("GO RIGHT DOWN");
                
                //enemyDirection = "SE";
                enemys.raidBoss.children[0].body.velocity.x = 300;
                enemys.raidBoss.children[0].body.velocity.y = 300;
                enemys.raidBoss.children[0].play("down");
                
            }
            else if (currentNextPointX == currentBossXtile && currentNextPointY > currentBossYtile)
            {
                // down
                
                //console.log("GO DOWN");
                
                //enemyDirection = "S";
                enemys.raidBoss.children[0].body.velocity.x = 0;
                enemys.raidBoss.children[0].body.velocity.y = 300;
                enemys.raidBoss.children[0].play("down");
                
            }
            else if (currentNextPointX < currentBossXtile && currentNextPointY > currentBossYtile)
            {
                // left down
                
                //console.log("GO LEFT DOWN");
                
                //enemyDirection = "SW";
                enemys.raidBoss.children[0].body.velocity.x = -300;
                enemys.raidBoss.children[0].body.velocity.y = 300;
                enemys.raidBoss.children[0].play("down");
            }
            else
            {
                
                //enemyDirection = "STOP";
                enemys.raidBoss.children[0].body.velocity.x = 0;
                enemys.raidBoss.children[0].body.velocity.y = 0;
                enemys.raidBoss.children[0].animations.stop("down", 0);
            }
            
           // if (enemyDirection != "STOP") cowboy.animations.play(enemyDirection);
            
        });

        easystar.calculate();
        
    }, 3000);
}