function preload() {
    game.load.tilemap('map0', 'assets/Map/level_1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map1', 'assets/Map/level_2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map2', 'assets/Map/level_3.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('tiles', 'assets/Spritesheet/roguelikeSheet_transparent.png');
    
    game.load.image('attackBox', 'assets/blank.png');
    game.load.image('shop', 'assets/HUD/realShop.png');
    game.load.image('characterHud', 'assets/HUD/character_hud.png');
    game.load.image('textHud', 'assets/HUD/text_hud.png');
    game.load.image('emptySlot', 'assets/HUD/empty_slot.png');
    game.load.image('helmetSlot', 'assets/HUD/helmet_slot.png');
    game.load.image('chestSlot', 'assets/HUD/chest_slot.png');
    game.load.image('swordSlot', 'assets/HUD/sword_slot.png');
    game.load.image('goldIcon', 'assets/goldIcon.png');

    game.load.image('healer', 'assets/Spritesheet/NPC/healer.png');
    game.load.image('kid', 'assets/Spritesheet/NPC/kid.png');
    game.load.image('clerk', 'assets/Spritesheet/NPC/storeClerk.png');

    game.load.image('red', 'assets/red_shot.png');
    game.load.image('green', 'assets/green_shot.png');
    game.load.image('blue', 'assets/blue_shot.png');
    game.load.image('yellow', 'assets/yellow_shot.png');

    game.load.spritesheet('{"armor":"none","hat":"none"}', 'assets/Spritesheet/player/default.png', 64, 64);
    game.load.spritesheet('{"armor":"none","hat":"hat0"}', 'assets/Spritesheet/player/hat0.png', 64, 64);
    game.load.spritesheet('{"armor":"none","hat":"hat1"}', 'assets/Spritesheet/player/hat1.png', 64, 64);
    game.load.spritesheet('{"armor":"none","hat":"hat2"}', 'assets/Spritesheet/player/hat2.png', 64, 64);
    game.load.spritesheet('{"armor":"none","hat":"hat3"}', 'assets/Spritesheet/player/hat3.png', 64, 64);

    game.load.spritesheet('{"armor":"armor0","hat":"none"}', 'assets/Spritesheet/player/armor0.png', 64, 64);
    game.load.spritesheet('{"armor":"armor0","hat":"hat0"}', 'assets/Spritesheet/player/armor0hat0.png', 64, 64);
    game.load.spritesheet('{"armor":"armor0","hat":"hat1"}', 'assets/Spritesheet/player/armor0hat1.png', 64, 64);
    game.load.spritesheet('{"armor":"armor0","hat":"hat2"}', 'assets/Spritesheet/player/armor0hat2.png', 64, 64);
    game.load.spritesheet('{"armor":"armor0","hat":"hat3"}', 'assets/Spritesheet/player/armor0hat3.png', 64, 64);

    game.load.spritesheet('{"armor":"armor1","hat":"none"}', 'assets/Spritesheet/player/armor1.png', 64, 64);
    game.load.spritesheet('{"armor":"armor1","hat":"hat0"}', 'assets/Spritesheet/player/armor1hat0.png', 64, 64);
    game.load.spritesheet('{"armor":"armor1","hat":"hat1"}', 'assets/Spritesheet/player/armor1hat1.png', 64, 64);
    game.load.spritesheet('{"armor":"armor1","hat":"hat2"}', 'assets/Spritesheet/player/armor1hat2.png', 64, 64);
    game.load.spritesheet('{"armor":"armor1","hat":"hat3"}', 'assets/Spritesheet/player/armor1hat3.png', 64, 64);

    game.load.spritesheet('{"armor":"armor2","hat":"none"}', 'assets/Spritesheet/player/armor2.png', 64, 64);
    game.load.spritesheet('{"armor":"armor2","hat":"hat0"}', 'assets/Spritesheet/player/armor2hat0.png', 64, 64);
    game.load.spritesheet('{"armor":"armor2","hat":"hat1"}', 'assets/Spritesheet/player/armor2hat1.png', 64, 64);
    game.load.spritesheet('{"armor":"armor2","hat":"hat2"}', 'assets/Spritesheet/player/armor2hat2.png', 64, 64);
    game.load.spritesheet('{"armor":"armor2","hat":"hat3"}', 'assets/Spritesheet/player/armor2hat3.png', 64, 64);

    game.load.spritesheet('spider', 'assets/Spritesheet/monsters/spider.png', 35, 35);
    game.load.spritesheet('scorpion', 'assets/Spritesheet/monsters/scorpion.png', 32, 33);
    game.load.spritesheet('snail', 'assets/Spritesheet/monsters/snail1.png', 50, 50);
    game.load.spritesheet('logmonster', 'assets/Spritesheet/monsters/logmonster.png', 45, 45);
    game.load.spritesheet('skeleton', 'assets/Spritesheet/monsters/skele.png', 34, 60);
    game.load.spritesheet('zombie', 'assets/Spritesheet/monsters/zomb.png', 34, 60);
    game.load.spritesheet('guard', 'assets/Spritesheet/monsters/g.png', 34, 35);

    game.load.spritesheet('wolfBoss', 'assets/Spritesheet/monsters/Boss_1.png', 32, 50);
    game.load.spritesheet('skeleBoss','assets/Spritesheet/monsters/BOSS2.png', 50, 48);
    game.load.spritesheet('knightBoss','assets/Spritesheet/monsters/BOSS3.png', 49, 48);

    game.load.spritesheet('items', 'assets/Spritesheet/items.png', 34, 34);   

    //for testing
    game.load.image('rect', 'assets/HUD/hp_bar.png');
}