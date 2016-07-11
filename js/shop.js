var shop;

function initShop(){
	shop = game.add.image(window.innerWidth/2-400, window.innerHeight/2-300 ,'shop');
	shop.scale.set(1);
	shop.fixedToCamera = true;
	var shopItems = ['hp0', 'hp1', 'hp2', 'mp0', 'mp1', 'mp2', 'hat0', 'hat1', 'hat2', 'hat3'];
	var ct = 0;

	for (var i=0; i<6; i++){
		make_button(36,32+84*i, shopItems[ct++]);		
	}
	for (var i=0; i<4; i++){
		make_button(428,32+84*i, shopItems[ct++]);
	}

	shop.kill();
}

function make_button (x, y, item){	
	var btn = game.add.button(x, y, '', pickUpItems, item);
	btn.width = 60; btn.height = 60;

	shop.addChild(btn);
}

function toggleShop(){
	shop.revive();
}