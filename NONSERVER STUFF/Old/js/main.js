var canvas, ctx, width, height, maxX=39, maxY = 29,
player = {
	x: 0,
	y: 0,
	posX: Math.round(width/128)*64,
	posY: Math.round(height/128)*64,
	update: function(){
		this.posX = Math.round(width/128)*64;
		this.posY = Math.round(height/128)*64;
	},
	draw: function(ctx){		
		ctx.fillStyle = "red";
		ctx.fillRect(this.posX,this.posY,64,64);	
	}
};

function main(){
	canvas = document.getElementById('canvas');

	width = window.innerWidth-20;
	height = window.innerHeight-20;

	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext('2d');

	initSprites();

	document.addEventListener('keydown', function(event) {
	    if (event.which === 87) { //up
	        player.y = Math.max(0, player.y-1);
	    }
	    if (event.which === 83) { //down
	        player.y = Math.min(maxY, player.y+1);
	    }
	    if (event.which === 65) { //left
	        player.x = Math.max(0, player.x-1);;
	    }
	    if (event.which === 68) {
	        player.x = Math.min(maxX, player.x+1);
	    }
	});

	run();
}

function run(){
	var loop = function(){
		update();
		render();
		window.requestAnimationFrame(loop,canvas);
	}

	window.requestAnimationFrame(loop,canvas);
}

function update(){

	player.update();

}

function render(){
	ctx.fillStyle = "green";
	ctx.fillRect(-50,-50,width+50,height+50);		
	s_map.draw(ctx, -player.x*64+player.posX, -player.y*64+player.posY, 4);
	player.draw(ctx);
}

main();

