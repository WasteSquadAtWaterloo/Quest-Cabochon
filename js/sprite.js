var s_map;

function Sprite(img, x, y, width, height) {
	this.img = img;
	this.x = x*2;
	this.y = y*2;
	this.width = width*2;
	this.height = height*2;
};

Sprite.prototype.draw = function(ctx, x, y, scale) {
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height,
		x, y, this.width*scale, this.height*scale);
};

function initSprites(){
	var mapImg = new Image();
	mapImg.src = "img/sample_map.png";
	s_map = new Sprite(mapImg, 0, 0, 640, 480);
}