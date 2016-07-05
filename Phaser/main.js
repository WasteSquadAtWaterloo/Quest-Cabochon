var game = new Phaser.Game(800, 600, Phaser.CANVAS, '');

var spaceField,backgroundv,player,cursors,bullets;
var bulletTime = 0;
var fireButton;

var enemies;
var collision = false;

var score = 0;

var mainState = {
	preload: function() {

		game.load.image("map", "assets/map.png");
		game.load.image("ship", "assets/ship.png");
		game.load.image("bullet", "assets/bullet.png");
		game.load.image("enemy", "assets/enemy.png");
	},

	create: function() {
		spaceField = game.add.tileSprite(0,0,800,600, "map");

		backgroundv = 2;

		player = game.add.sprite(game.world.centerX - 250, game.world.centerY, "ship");
		game.physics.enable(player, Phaser.Physics.ARCADE);

		cursors = game.input.keyboard.createCursorKeys();

		//Handling Bullets
		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(30,"bullet");
		bullets.setAll('anchor.y', 0.5);
		bullets.setAll('anchor.x', 1);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll("checkWorldBounds", true);

		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		//Handling Enemies
		enemies = game.add.group();
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE

		createEnemies(300);
		
	},

	update: function() {


		player.body.velocity.y = +50;
		spaceField.tilePosition.x -= backgroundv;
		enemies.x -= 5;
		if (enemies.x < 0) {
			collision = true;
		}

		game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);
		if (collision) {
			var rand_y = Math.round(600*Math.random());
			createEnemies(rand_y);
			collision = false;

		}
		if (cursors.down.isDown) {
			player.body.velocity.y = +300; 
		}
		if (cursors.up.isDown) {
			player.body.velocity.y = -300; 
		}


		if(fireButton.isDown) {
			fireBullet();
		}

		
	}
}

function fireBullet() {
	if(game.time.now > bulletTime) {
		shot = bullets.getFirstExists(false);

		if (shot) {
			shot.reset(player.x + 150, player.y + 30);
			shot.body.velocity.x = 600;
			bulletTime = game.time.now + 200;
		}
	}
}

function createEnemies(starty) {

	//var enemyY = 600*Math.random() ;
	//var enemy = enemies.create(700, enemyY, 'enemy');
	//enemy.anchor.setTo(0.5, 0.5);

	var enemy = enemies.create(0, 0, 'enemy');
	enemy.anchor.setTo(0.5,0.5);
	
	//for (var y = 0; y < 4; y++) {
	//	for (var x = 0; x < 4; x ++) {
	//		var enemy = enemies.create(x*100, y*100, 'enemy');
	//		enemy.anchor.setTo(0.5,0.5);
	//	}
	//}
	enemies.x = 900;
	enemies.y = starty;
	var tween = game.add.tween(enemies).to({y:400}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

	//tween.onLoop.add(move, this);
}
function move() {
	enemies.x -= 100;
}

function collisionHandler(bullet, enemy) {
	collision = true;
	bullet.kill();
	enemy.kill();
}
game.state.add('mainState', mainState);

game.state.start('mainState');