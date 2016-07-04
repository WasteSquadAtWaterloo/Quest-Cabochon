var canvas, ctx, width, height;

function main(){
	canvas = document.getElementById('canvas');

	width = window.innerWidth-20;
	height = window.innerHeight-20;

	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext('2d');

	initSprites();

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
}

main();