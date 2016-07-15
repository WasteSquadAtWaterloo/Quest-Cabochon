function initEnemys(map){
    if (map === 'map0'){
        //change snail stats
        enemys.snails = game.add.group();
        createEnemys(enemys.snails, 'snail', 7, 3, 1392, 1196, 2065, 480, 2, 5, 1.5, 15);        

    	enemys.spiders = game.add.group();
    	createEnemys(enemys.spiders, 'spider', 10, 5, 724, 336, 2108, 480, 2, 5, 1.5, 25);    	

        enemys.spiders2 = game.add.group(); 
        createEnemys(enemys.spiders2, 'spider', 10, 5, 336, 3312, 2064, 336, 2, 5, 1.5, 25);

        //change atk,hp and gold of log monster
        enemys.logmonsters = game.add.group();
        createEnemys(enemys.logmonsters, 'logmonster', 15, 7, 3072, 4080, 1584, 482, 3, 4, 1.5, 50);

        enemys.logmonsters2 = game.add.group();
        createEnemys(enemys.logmonsters2, 'logmonster', 15, 7, 336, 4032, 1872, 432, 2, 5, 1.5, 50);    

        enemys.scorpions = game.add.group();
        createEnemys(enemys.scorpions, 'scorpion', 30, 15, 4076, 1008, 560, 2736, 7, 2, 1.5, 100);  

        enemys.wolfBoss = game.add.group();
        createWolfBoss('wolfBoss', 50, 5, 400, 600, 100, 100, 3, 300);

    }
    else if (map === "map1"){
        enemys.skeleBoss = game.add.group();
        createSkeleBoss('skeleBoss', 200, 15, 1300, 1900, 100, 100, 2, 500);

        enemys.skeletons = game.add.group();
        createEnemys(enemys.skeletons, 'skeleton', 20, 10, 284, 384, 1736, 580, 2, 6, 1.5, 70);

        enemys.zombies = game.add.group();
        createEnemys(enemys.zombies, 'zombie', 25, 12, 200, 1052, 1800, 700, 3, 4, 1.5 ,85);
    }
    else if (map === "map2") {
        enemys.knightBoss = game.add.group();
        createKnightBoss('knightBoss', 400, 15, 450, 370, 100, 100, 1.5, 1000);

        enemys.guards = game.add.group();
        createEnemys(enemys.guards, 'guard', 45, 20, 130, 528, 624, 288, 1, 4, 2, 150);
    }    

}

function createEnemys(group, key, hp, atk, topX, topY, width, height, rows, cols, scale, goldAmount){
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
    wolfBoss.name = "wolfBoss";
    wolfBoss.maxHealth = hp;
    wolfBoss.setHealth(hp);
    game.physics.enable(wolfBoss, Phaser.Physics.ARCADE);   

    var madeBar = mobHealthBarManager(wolfBoss.health, wolfBoss.health);
    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
    wolfBoss.addChild(monHealthBar);

    wolfBoss.scale.set(scale);       
    wolfBoss.animations.add('move', [0,1,2,3], 10, true);              
    wolfBoss.play('move');            
    wolfBoss.atk = atk;

    enemys.wolfBoss.spellTime = 0;

    wolfBoss.gold = goldAmount;
    var tweenA = game.add.tween(wolfBoss).to( { 
        x: wolfBoss.x + (Math.random()*80+80)}, 
    Math.random()*1000+1000, null, false, Math.random()*2000, 0, false);

    var tweenB = game.add.tween(wolfBoss).to( {  
        y: wolfBoss.y + (Math.random()*80+80)}, 
    Math.random()*1000+1000, null, false, Math.random()*2000, 0, false);

    var tweenC = game.add.tween(wolfBoss).to( { 
        x: wolfBoss.x - (Math.random()*80+80)}, 
    Math.random()*1000+1000, null, false, Math.random()*2000, 0, false);

    var tweenD = game.add.tween(wolfBoss).to( { 
        y: wolfBoss.y - (Math.random()*80+80)}, 
    Math.random()*1000+1000, null, false, Math.random()*2000, 0, false);

    tweenA.chain(tweenB); tweenB.chain(tweenC); tweenC.chain(tweenD); tweenD.chain(tweenA);

    tweenA.start();

}
function createSkeleBoss(key, hp, atk, topX, topY, width, height, scale, goldAmount) {
    var skeleBoss = enemys.skeleBoss.create(topX, topY, 'skeleBoss');
    skeleBoss.name = "skeleBoss";
    skeleBoss.maxHealth = hp;
    skeleBoss.setHealth(hp);
    game.physics.enable(skeleBoss, Phaser.Physics.ARCADE);

    var madeBar = mobHealthBarManager(skeleBoss.health, skeleBoss.health);
    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
    skeleBoss.addChild(monHealthBar);

    skeleBoss.scale.set(scale);       
    skeleBoss.animations.add('move', [0,1,2,3], 10, true);              
    skeleBoss.play('move');            
    skeleBoss.atk = atk;

    skeleBoss.gold = goldAmount;
    var tweenA = game.add.tween(skeleBoss).to( { 
        x: skeleBoss.x + (Math.random()*80+80)}, 
    Math.random()*1000+500, null, false, Math.random()*1000, 0, false);

    var tweenB = game.add.tween(skeleBoss).to( {  
        y: skeleBoss.y + (Math.random()*80+80)}, 
    Math.random()*1000+500, null, false, Math.random()*1000, 0, false);

    var tweenC = game.add.tween(skeleBoss).to( { 
        x: skeleBoss.x - (Math.random()*80+80)}, 
    Math.random()*1000+500, null, false, Math.random()*1000, 0, false);

    var tweenD = game.add.tween(skeleBoss).to( { 
        y: skeleBoss.y - (Math.random()*80+80)}, 
    Math.random()*1000+500, null, false, Math.random()*1000, 0, false);

    tweenA.chain(tweenB); tweenB.chain(tweenC); tweenC.chain(tweenD); tweenD.chain(tweenA);

    tweenA.start();
}
function createKnightBoss(key, hp, atk, topX, topY, width, height, scale, goldAmount) {
    var knightBoss = enemys.knightBoss.create(topX, topY, 'knightBoss');
    knightBoss.name = "knightBoss";
    knightBoss.maxHealth = hp;
    knightBoss.setHealth(hp);
    game.physics.enable(knightBoss, Phaser.Physics.ARCADE);

    var madeBar = mobHealthBarManager(knightBoss.health, knightBoss.health);
    var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
    knightBoss.addChild(monHealthBar);

    knightBoss.scale.set(scale);       
    knightBoss.animations.add('move', [0,1,2,3], 10, true);              
    knightBoss.play('move');            
    knightBoss.atk = atk;

    knightBoss.gold = goldAmount;
    var tweenA = game.add.tween(knightBoss).to( { 
        x: knightBoss.x + (Math.random()*40+80)}, 
    Math.random()*750+500, null, false, Math.random()*750, 0, false);

    var tweenB = game.add.tween(knightBoss).to( {  
        y: knightBoss.y + (Math.random()*40+80)}, 
    Math.random()*750+500, null, false, Math.random()*750, 0, false);

    var tweenC = game.add.tween(knightBoss).to( { 
        x: knightBoss.x - (Math.random()*40+80)}, 
    Math.random()*750+500, null, false, Math.random()*750, 0, false);

    var tweenD = game.add.tween(knightBoss).to( { 
        y: knightBoss.y - (Math.random()*40+80)}, 
    Math.random()*750+500, null, false, Math.random()*750, 0, false);

    tweenA.chain(tweenB); tweenB.chain(tweenC); tweenC.chain(tweenD); tweenD.chain(tweenA);

    tweenA.start();
}