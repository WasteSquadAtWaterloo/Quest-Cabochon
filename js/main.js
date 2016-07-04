var canvas, ctx, width, height;

function main(){
	canvas = document.getElementById('canvas');

	width = window.innerWidth;
	height = window.innerHeight;

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
	s_map.draw(ctx,0,0,s_map.width*2, s_map.height*2);
}

main();