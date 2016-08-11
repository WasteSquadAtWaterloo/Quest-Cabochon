var map;

function loadMap(key, spawn_x, spawn_y, bgn){
	if (!bgn){
		layer1.destroy();
		layer2.destroy();
		layer3.destroy();
		layer4.destroy();
		layer5.destroy();
		map.destroy();
	}

	map = game.add.tilemap(key);
	map.addTilesetImage('roguelikeSheet_transparent','tiles');

	layer1 = map.createLayer(0); layer1.smoothed = false; layer1.setScale(3);
    layer2 = map.createLayer(1); layer2.smoothed = false; layer2.setScale(3);     
    layer3 = map.createLayer(2); layer3.smoothed = false; layer3.setScale(3);
    layer4 = map.createLayer(3); layer4.smoothed = false; layer4.setScale(3);

   	if (selfId){
   		Player.list[selfId].sprite.bringToTop();   		
   	}   	
   	layer1.resizeWorld();

   	map.setCollisionByExclusion(stand,true,layer1);      
    map.setCollisionByExclusion(stand,true,layer2);  
    map.setCollisionByExclusion(stand,true,layer3);  
    map.setCollisionByExclusion(stand,true,layer4);  
    map.setCollisionByExclusion(stand,true,layer5);
}

var loadLastLayer = function(){
	layer5 = map.createLayer(4); layer5.smoothed = false; layer5.setScale(3);
}