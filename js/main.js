var canvas, ctx, width, height;

function main(){
	canvas = document.getElementById('canvas');

	width = window.innerWidth;
	height = window.innerHeight;

	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext('2d');
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

}

main();