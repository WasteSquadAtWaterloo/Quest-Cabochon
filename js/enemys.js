function initEnemys(map){
    if (map === 'map0'){
        //change snail stats
        enemys.snails = game.add.group();
        createEnemys(enemys.snails, 'snail', 10, 5, 1392, 1196, 2065, 480, 2, 5, 1.5, 25);        

    	enemys.spiders = game.add.group();
    	createEnemys(enemys.spiders, 'spider', 10, 5, 724, 336, 2108, 480, 2, 5, 1.5, 25);    	

        enemys.spiders2 = game.add.group(); 
        createEnemys(enemys.spiders2, 'spider', 10, 5, 336, 3312, 2064, 336, 2, 5, 1.5, 25);

        //change atk,hp and gold of log monster
        enemys.logmonsters = game.add.group();
        createEnemys(enemys.logmonsters, 'logmonster', 10, 5, 3072, 4080, 1584, 482, 3, 4, 1.5, 100);

        enemys.logmonsters2 = game.add.group();
        createEnemys(enemys.logmonsters2, 'logmonster', 10, 5, 336, 4032, 1872, 432, 2, 5, 1.5, 100);    

        enemys.scorpions = game.add.group();
        createEnemys(enemys.scorpions, 'scorpion', 20, 15, 4076, 1008, 560, 2736, 7, 2, 1.5, 100);  

        enemys.wolfBoss = game.add.group();
        createWolfBoss('wolfBoss', 50, 5, 400, 600, 100, 100, 3, 300);

    }
    else if (map === "map1"){
        createSkeleBoss('skeleBoss', 200, 10, 400, 600, 100, 100, 3, 500);
    }
    else if (map === "map2") {
        createKnightBoss('knightBoss', 400, 15, 400, 600, 100, 100, 3, 1000);
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

            var madeBar = mobHealthBarManager(10, enemy.health);
            var monHealthBar = new Phaser.Sprite(this.game, 0, 0, madeBar);
            enemy.addChild(monHealthBar);

            enemy.scale.set(scale);       
            enemy.animations.add('move', enemyFrames[key].down.walk, 10, true);              
            enemy.play('move');            
            enemy.atk = atk;

            enemy.deathTime = 0;            
            enemy.gold = goldAmount;
            game.add.tween(enemy).to( { 
            	x: enemy.x + (Math.random()*80+80)*randSign(), 
            	y: enemy.y + (Math.random()*80+80)*randSign()}, 
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
}
function createKnightBoss(key, hp, atk, topX, topY, width, height, scale, goldAmount) {
}