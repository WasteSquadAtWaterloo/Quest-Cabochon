var canvas, ctx, width, height, maxX=40, maxY = 30,
player = {
	x: 0,
	y: 0,
	draw: function(ctx){
		ctx.save();
		ctx.fillStyle = "red";
		ctx.fillRect(this.x*64, this.y*64, 64, 64);
		//ctx.stroke();
		ctx.restore();
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

}

function render(){
	s_map.draw(ctx, 0, 0, 4);
	player.draw(ctx);
}

main();