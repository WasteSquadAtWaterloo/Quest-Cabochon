function preload() {
    game.forceSingleUpdate = true;
    game.camera.roundPx = false;

    game.load.tilemap('map0', '/client/assets/Map/map_0.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map1', '/client/assets/Map/map_1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map2', '/client/assets/Map/map_2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map3', '/client/assets/Map/map_3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map4', '/client/assets/Map/map_4.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map5', '/client/assets/Map/map_5.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('tiles', '/client/assets/Spritesheet/roguelikeSheet_transparent.png');
    
    game.load.image('attackBox', '/client/assets/blank.png');
    game.load.image('shop', '/client/assets/HUD/realShop.png');
    game.load.image('characterHud', '/client/assets/HUD/character_hud.png');
    game.load.image('textHud', '/client/assets/HUD/text_hud.png');
    game.load.image('textHud2', '/client/assets/HUD/text_hud2.png');
    game.load.image('emptySlot', '/client/assets/HUD/empty_slot.png');
    game.load.image('helmetSlot', '/client/assets/HUD/helmet_slot.png');
    game.load.image('chestSlot', '/client/assets/HUD/chest_slot.png');
    game.load.image('swordSlot', '/client/assets/HUD/sword_slot.png');
    game.load.image('goldIcon', '/client/assets/goldIcon.png');

    game.load.image('healer', '/client/assets/Spritesheet/NPC/healer.png');
    game.load.image('kid', '/client/assets/Spritesheet/NPC/kid.png');
    game.load.image('clerk', '/client/assets/Spritesheet/NPC/storeClerk.png');
    game.load.image('oldman', '/client/assets/Spritesheet/NPC/oji-san.png');

    game.load.image('red', '/client/assets/red_shot.png');
    game.load.image('green', '/client/assets/green_shot.png');
    game.load.image('blue', '/client/assets/blue_shot.png');
    game.load.image('yellow', '/client/assets/yellow_shot.png');

    function loadWeps(key, url){
        for (var i=1; i<4; i++){
        game.load.spritesheet(key+i, url+'weapon'+i+'.png', 192, 192);    
        }
    }

    game.load.spritesheet('{"armor":"none","hat":"none"}', '/client/assets/Spritesheet/player/default.png', 64, 64);
    loadWeps('{"armor":"none","hat":"none"}', '/client/assets/Spritesheet/player/default');
    game.load.spritesheet('{"armor":"none","hat":"hat0"}', '/client/assets/Spritesheet/player/hat0.png', 64, 64);
    loadWeps('{"armor":"none","hat":"hat0"}', '/client/assets/Spritesheet/player/hat0');    
    game.load.spritesheet('{"armor":"none","hat":"hat1"}', '/client/assets/Spritesheet/player/hat1.png', 64, 64);
    loadWeps('{"armor":"none","hat":"hat1"}','/client/assets/Spritesheet/player/hat1');
    game.load.spritesheet('{"armor":"none","hat":"hat2"}', '/client/assets/Spritesheet/player/hat2.png', 64, 64);
    loadWeps('{"armor":"none","hat":"hat2"}','/client/assets/Spritesheet/player/hat2');
    game.load.spritesheet('{"armor":"none","hat":"hat3"}', '/client/assets/Spritesheet/player/hat3.png', 64, 64);
    loadWeps('{"armor":"none","hat":"hat3"}','/client/assets/Spritesheet/player/hat3');

    game.load.spritesheet('{"armor":"armor0","hat":"none"}', '/client/assets/Spritesheet/player/armor0.png', 64, 64);
    loadWeps('{"armor":"armor0","hat":"none"}','/client/assets/Spritesheet/player/armor0');
    game.load.spritesheet('{"armor":"armor0","hat":"hat0"}', '/client/assets/Spritesheet/player/armor0hat0.png', 64, 64);
    loadWeps('{"armor":"armor0","hat":"hat0"}', '/client/assets/Spritesheet/player/armor0hat0');
    game.load.spritesheet('{"armor":"armor0","hat":"hat1"}', '/client/assets/Spritesheet/player/armor0hat1.png', 64, 64);
    loadWeps('{"armor":"armor0","hat":"hat1"}', '/client/assets/Spritesheet/player/armor0hat1');
    game.load.spritesheet('{"armor":"armor0","hat":"hat2"}', '/client/assets/Spritesheet/player/armor0hat2.png', 64, 64);
    loadWeps('{"armor":"armor0","hat":"hat2"}', '/client/assets/Spritesheet/player/armor0hat2');
    game.load.spritesheet('{"armor":"armor0","hat":"hat3"}', '/client/assets/Spritesheet/player/armor0hat3.png', 64, 64);
    loadWeps('{"armor":"armor0","hat":"hat3"}', '/client/assets/Spritesheet/player/armor0hat3');

    game.load.spritesheet('{"armor":"armor1","hat":"none"}', '/client/assets/Spritesheet/player/armor1.png', 64, 64);
    loadWeps('{"armor":"armor1","hat":"none"}', '/client/assets/Spritesheet/player/armor1');
    game.load.spritesheet('{"armor":"armor1","hat":"hat0"}', '/client/assets/Spritesheet/player/armor1hat0.png', 64, 64);
    loadWeps('{"armor":"armor1","hat":"hat0"}', '/client/assets/Spritesheet/player/armor1hat0');
    game.load.spritesheet('{"armor":"armor1","hat":"hat1"}', '/client/assets/Spritesheet/player/armor1hat1.png', 64, 64);
    loadWeps('{"armor":"armor1","hat":"hat1"}', '/client/assets/Spritesheet/player/armor1hat1');
    game.load.spritesheet('{"armor":"armor1","hat":"hat2"}', '/client/assets/Spritesheet/player/armor1hat2.png', 64, 64);
    loadWeps('{"armor":"armor1","hat":"hat2"}', '/client/assets/Spritesheet/player/armor1hat2');
    game.load.spritesheet('{"armor":"armor1","hat":"hat3"}', '/client/assets/Spritesheet/player/armor1hat3.png', 64, 64);
    loadWeps('{"armor":"armor1","hat":"hat3"}', '/client/assets/Spritesheet/player/armor1hat3');

    game.load.spritesheet('{"armor":"armor2","hat":"none"}', '/client/assets/Spritesheet/player/armor2.png', 64, 64);
    loadWeps('{"armor":"armor2","hat":"none"}', '/client/assets/Spritesheet/player/armor2');
    game.load.spritesheet('{"armor":"armor2","hat":"hat0"}', '/client/assets/Spritesheet/player/armor2hat0.png', 64, 64);
    loadWeps('{"armor":"armor2","hat":"hat0"}', '/client/assets/Spritesheet/player/armor2hat0');
    game.load.spritesheet('{"armor":"armor2","hat":"hat1"}', '/client/assets/Spritesheet/player/armor2hat1.png', 64, 64);
    loadWeps('{"armor":"armor2","hat":"hat1"}', '/client/assets/Spritesheet/player/armor2hat1');
    game.load.spritesheet('{"armor":"armor2","hat":"hat2"}', '/client/assets/Spritesheet/player/armor2hat2.png', 64, 64);
    loadWeps('{"armor":"armor2","hat":"hat2"}', '/client/assets/Spritesheet/player/armor2hat2');
    game.load.spritesheet('{"armor":"armor2","hat":"hat3"}', '/client/assets/Spritesheet/player/armor2hat3.png', 64, 64);
    loadWeps('{"armor":"armor2","hat":"hat3"}', '/client/assets/Spritesheet/player/armor2hat3');

    game.load.spritesheet('spider', '/client/assets/Spritesheet/monsters/spider.png', 35, 35);
    game.load.spritesheet('scorpion', '/client/assets/Spritesheet/monsters/scorpion.png', 32, 33);
    game.load.spritesheet('snail', '/client/assets/Spritesheet/monsters/snail2.png', 35, 40);
    game.load.spritesheet('logmonster', '/client/assets/Spritesheet/monsters/logmonster.png', 45, 45);
    game.load.spritesheet('skeleton', '/client/assets/Spritesheet/monsters/skele.png', 34, 60);
    game.load.spritesheet('zombie', '/client/assets/Spritesheet/monsters/zomb.png', 34, 60);
    game.load.spritesheet('guard', '/client/assets/Spritesheet/monsters/g.png', 34, 35);

    game.load.spritesheet('wolfBoss', '/client/assets/Spritesheet/monsters/Boss_1.png', 32, 50);
    game.load.spritesheet('skeleBoss','/client/assets/Spritesheet/monsters/BOSS2.png', 50, 48);
    game.load.spritesheet('knightBoss','/client/assets/Spritesheet/monsters/BOSS3.png', 49, 48);

    game.load.spritesheet('items', '/client/assets/Spritesheet/items.png', 34, 34); 
}