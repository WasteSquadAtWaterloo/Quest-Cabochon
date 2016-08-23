var shop;

function initShop(){
	shop = game.add.sprite( window.innerWidth>1235 ? Math.max(window.innerWidth/2-400, 440):(window.innerWidth-772), window.innerHeight/2-300 ,'shop');
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
	var btn = game.add.button(x, y, '', function(){
		var shopTxt = game.add.text(x+shop.cameraOffset.x+15, y+shop.cameraOffset.y+15, "+1" , niceTxtStyle); 
		shopTxt.fixedToCamera = true; shopTxt.fontSize = 30; 
		shopTxt.stroke = "black"; shopTxt.strokeThickness = 3; shopTxt.fill = "green";
		
	    var tweenTxt = game.add.tween(shopTxt.cameraOffset).to({y: shopTxt.y-75}, 1500, Phaser.Easing.Default, true);	    
	    
	    tweenTxt.onComplete.add(function(){
	        shopTxt.destroy();
	    });    

		pickUpItems.call(item);
	} ,item);

	btn.width = 60; btn.height = 60;

	shop.addChild(btn);
}

function toggleShop(){
	shop.revive();
}