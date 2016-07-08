function initEnemys(){
	enemys.spiders = game.add.group();
	enemys.spiders.enableBody = true;
	enemys.spiders.physicsBodyType = Phaser.Physics.ARCADE;
	createEnemys(enemys.spiders, 'spider', 10, 5, 310, 265, 960, 640, 1.5, 25);

	enemys.scorpions = game.add.group();
	enemys.scorpions.enableBody = true;
	enemys.scorpions.physicsBodyType = Phaser.Physics.ARCADE;
	createEnemys(enemys.scorpions, 'scorpion', 20, 15, 240, 3408, 960, 640, 1.5, 100);
}

function createEnemys(group, key, hp, atk, topX, topY, width, height, scale, goldAmount){

	var eachX = width/3;
	var eachY = height/2;

    for (var i=0; i<3; i++){
        for (var j=0; j<2; j++){
            var enemy = group.create(eachX*i + eachX/2, eachY*j + eachX/2, key);
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