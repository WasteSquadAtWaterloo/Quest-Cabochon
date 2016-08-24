function preload() {
    game.forceSingleUpdate = true;
    game.camera.roundPx = false;

    game.load.tilemap('map0', 'assets/Map/map_0.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map1', 'assets/Map/map_1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map2', 'assets/Map/map_2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map3', 'assets/Map/map_3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map4', 'assets/Map/map_4.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map5', 'assets/Map/map_5.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map6', 'assets/Map/map_6.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('tiles', 'assets/Spritesheet/roguelikeSheet_transparent.png');
    
    game.load.image('attackBox', 'assets/blank.png');
    game.load.image('shop', 'assets/HUD/realShop.png');
    game.load.image('characterHud', 'assets/HUD/character_hud.png');
    game.load.image('textHud', 'assets/HUD/text_hud.png');
    game.load.image('textHud2', 'assets/HUD/text_hud2.png');
    game.load.image('emptySlot', 'assets/HUD/empty_slot.png');
    game.load.image('helmetSlot', 'assets/HUD/helmet_slot.png');
    game.load.image('chestSlot', 'assets/HUD/chest_slot.png');
    game.load.image('swordSlot', 'assets/HUD/sword_slot.png');
    game.load.image('reviveBtn', 'assets/HUD/revive_btn.png');
    game.load.image('goldIcon', 'assets/goldIcon.png');
    game.load.image('gold_and_exp_hud', 'assets/HUD/other_hud_player.png');

    game.load.image('healer', 'assets/Spritesheet/NPC/healer.png');
    game.load.image('kid', 'assets/Spritesheet/NPC/kid.png');
    game.load.image('clerk', 'assets/Spritesheet/NPC/storeClerk.png');
    game.load.image('oldman', 'assets/Spritesheet/NPC/oji-san.png');

    game.load.image('oldmanDialogue', 'assets/characterArt/oldManText.png');
    game.load.image('clericDialogue', 'assets/characterArt/clericText.png');
    game.load.image('clerkDialogue', 'assets/characterArt/clerkText.png');
    game.load.image('kidDialogue', 'assets/characterArt/kidText.png');
    game.load.image('knightBossDialogue', 'assets/characterArt/knightBossText.png');
    game.load.image('wolfBossDialogue', 'assets/characterArt/wolfBossText.png');
    game.load.image('skeleBossDialogue', 'assets/characterArt/skeleBossText.png');

    game.load.image('red', 'assets/red_shot.png');
    game.load.image('green', 'assets/green_shot.png');
    game.load.image('blue', 'assets/blue_shot.png');
    game.load.image('yellow', 'assets/yellow_shot.png');

    function loadWeps(key, url){
        for (var i=1; i<4; i++){
        game.load.spritesheet(key+i, url+'weapon'+i+'.png', 192, 192);    
        }
    }

    game.load.spritesheet('{"armor":"none","hat":"none"}', 'assets/Spritesheet/player/default.png', 64, 64);
    loadWeps('{"armor":"none","hat":"none"}', 'assets/Spritesheet/player/default');
    game.load.spritesheet('{"armor":"none","hat":"hat0"}', 'assets/Spritesheet/player/hat0.png', 64, 64);
    loadWeps('{"armor":"none","hat":"hat0"}', 'assets/Spritesheet/player/hat0');    
    game.load.spritesheet('{"armor":"none","hat":"hat1"}', 'assets/Spritesheet/player/hat1.png', 64, 64);
    loadWeps('{"armor":"none","hat":"hat1"}','assets/Spritesheet/player/hat1');
    game.load.spritesheet('{"armor":"none","hat":"hat2"}', 'assets/Spritesheet/player/hat2.png', 64, 64);
    loadWeps('{"armor":"none","hat":"hat2"}','assets/Spritesheet/player/hat2');
    game.load.spritesheet('{"armor":"none","hat":"hat3"}', 'assets/Spritesheet/player/hat3.png', 64, 64);
    loadWeps('{"armor":"none","hat":"hat3"}','assets/Spritesheet/player/hat3');

    game.load.spritesheet('{"armor":"armor0","hat":"none"}', 'assets/Spritesheet/player/armor0.png', 64, 64);
    loadWeps('{"armor":"armor0","hat":"none"}','assets/Spritesheet/player/armor0');
    game.load.spritesheet('{"armor":"armor0","hat":"hat0"}', 'assets/Spritesheet/player/armor0hat0.png', 64, 64);
    loadWeps('{"armor":"armor0","hat":"hat0"}', 'assets/Spritesheet/player/armor0hat0');
    game.load.spritesheet('{"armor":"armor0","hat":"hat1"}', 'assets/Spritesheet/player/armor0hat1.png', 64, 64);
    loadWeps('{"armor":"armor0","hat":"hat1"}', 'assets/Spritesheet/player/armor0hat1');
    game.load.spritesheet('{"armor":"armor0","hat":"hat2"}', 'assets/Spritesheet/player/armor0hat2.png', 64, 64);
    loadWeps('{"armor":"armor0","hat":"hat2"}', 'assets/Spritesheet/player/armor0hat2');
    game.load.spritesheet('{"armor":"armor0","hat":"hat3"}', 'assets/Spritesheet/player/armor0hat3.png', 64, 64);
    loadWeps('{"armor":"armor0","hat":"hat3"}', 'assets/Spritesheet/player/armor0hat3');

    game.load.spritesheet('{"armor":"armor1","hat":"none"}', 'assets/Spritesheet/player/armor1.png', 64, 64);
    loadWeps('{"armor":"armor1","hat":"none"}', 'assets/Spritesheet/player/armor1');
    game.load.spritesheet('{"armor":"armor1","hat":"hat0"}', 'assets/Spritesheet/player/armor1hat0.png', 64, 64);
    loadWeps('{"armor":"armor1","hat":"hat0"}', 'assets/Spritesheet/player/armor1hat0');
    game.load.spritesheet('{"armor":"armor1","hat":"hat1"}', 'assets/Spritesheet/player/armor1hat1.png', 64, 64);
    loadWeps('{"armor":"armor1","hat":"hat1"}', 'assets/Spritesheet/player/armor1hat1');
    game.load.spritesheet('{"armor":"armor1","hat":"hat2"}', 'assets/Spritesheet/player/armor1hat2.png', 64, 64);
    loadWeps('{"armor":"armor1","hat":"hat2"}', 'assets/Spritesheet/player/armor1hat2');
    game.load.spritesheet('{"armor":"armor1","hat":"hat3"}', 'assets/Spritesheet/player/armor1hat3.png', 64, 64);
    loadWeps('{"armor":"armor1","hat":"hat3"}', 'assets/Spritesheet/player/armor1hat3');

    game.load.spritesheet('{"armor":"armor2","hat":"none"}', 'assets/Spritesheet/player/armor2.png', 64, 64);
    loadWeps('{"armor":"armor2","hat":"none"}', 'assets/Spritesheet/player/armor2');
    game.load.spritesheet('{"armor":"armor2","hat":"hat0"}', 'assets/Spritesheet/player/armor2hat0.png', 64, 64);
    loadWeps('{"armor":"armor2","hat":"hat0"}', 'assets/Spritesheet/player/armor2hat0');
    game.load.spritesheet('{"armor":"armor2","hat":"hat1"}', 'assets/Spritesheet/player/armor2hat1.png', 64, 64);
    loadWeps('{"armor":"armor2","hat":"hat1"}', 'assets/Spritesheet/player/armor2hat1');
    game.load.spritesheet('{"armor":"armor2","hat":"hat2"}', 'assets/Spritesheet/player/armor2hat2.png', 64, 64);
    loadWeps('{"armor":"armor2","hat":"hat2"}', 'assets/Spritesheet/player/armor2hat2');
    game.load.spritesheet('{"armor":"armor2","hat":"hat3"}', 'assets/Spritesheet/player/armor2hat3.png', 64, 64);
    loadWeps('{"armor":"armor2","hat":"hat3"}', 'assets/Spritesheet/player/armor2hat3');

    game.load.spritesheet('spider', 'assets/Spritesheet/monsters/spider.png', 35, 35);
    game.load.spritesheet('scorpion', 'assets/Spritesheet/monsters/scorpion.png', 32, 33);
    game.load.spritesheet('snail', 'assets/Spritesheet/monsters/snail2.png', 35, 40);
    game.load.spritesheet('logmonster', 'assets/Spritesheet/monsters/logmonster.png', 45, 45);
    game.load.spritesheet('skeleton', 'assets/Spritesheet/monsters/skele.png', 34, 60);
    game.load.spritesheet('zombie', 'assets/Spritesheet/monsters/zomb.png', 34, 60);
    game.load.spritesheet('guard', 'assets/Spritesheet/monsters/g.png', 34, 35);

    game.load.spritesheet('wolfBoss', 'assets/Spritesheet/monsters/Boss_1.png', 32, 50);
    game.load.spritesheet('skeleBoss','assets/Spritesheet/monsters/BOSS2.png', 50, 48);
    game.load.spritesheet('knightBoss','assets/Spritesheet/monsters/BOSS3.png', 49, 48);
    game.load.spritesheet('raidBoss', 'assets/Spritesheet/monsters/BOSS4.png', 46, 52);

    game.load.spritesheet('items', 'assets/Spritesheet/items.png', 34, 34); 

    game.load.audio('woosh', 'assets/audio/woosh.mp3');
    game.load.audio('wep1', 'assets/audio/wep1.mp3');
    game.load.audio('wep2', 'assets/audio/wep2.mp3');
    game.load.audio('wep3', 'assets/audio/wep3.mp3');
    game.load.audio('spell', 'assets/audio/spell.mp3');
    game.load.audio('spell_impact', 'assets/audio/spell_impact.ogg');
    game.load.audio('wolfDeath', 'assets/audio/wolfDeath.mp3');
    game.load.audio('skeleDeath', 'assets/audio/skeleDeath.mp3');
    game.load.audio('knightDeath', 'assets/audio/knightDeath.mp3');
    game.load.audio('raidBossDeath', 'assets/audio/raidBossDeath.mp3');

}