function initInventory(){
	inventory = game.add.sprite((window.innerWidth/2)-200, (window.innerHeight/2)-200, 'characterHud');
    inventory.fixedToCamera = true;

    for (var i=0; i<4; i++){
        for (var j=0; j<6; j++){
            var givenFunction = inventoryCreator();
            inventorySlots[buttonCreated] = game.make.button(i*36+34, j*36+94, "emptySlot", givenFunction, this);
            inventory.addChild(inventorySlots[buttonCreated]);
            buttonCreated += 1
        }
    }
    //Adding equip slots
    sword_slot = game.make.button(214,167 ,"swordSlot", function() {
         try { //Removing an item
            var item = sword_slot.getChildAt(0);
            if (inventoryAvailability.indexOf(true) > -1){
                sword_slot.removeChildAt(0); 
                pickUpItems.call(item, item, player);           
                swordAvailability = true;

                weapon = "";
                player.atk -= item.dmg;
                atkBox.body.setSize(30, 30, 0, 0);
            }            
        }
        catch(err){}
    }, this);

    helmet_slot = game.make.button(258,98 ,"helmetSlot", function() {
         try { //Removing an item
            var item = helmet_slot.getChildAt(0); 
            if (inventoryAvailability.indexOf(true) > -1){             
                helmet_slot.removeChildAt(0);    
                pickUpItems.call(item, item, player);       
                helmetAvailability = true;     

                equip.hat = "none";                
                player.loadTexture(JSON.stringify(equip), playerFrames[player_dir].walk[0]);
                player.dmgMultiplyer += item.dmgReduc;
            }
        }
        catch(err){}        
    }, this);

    chest_slot = game.make.button(258 ,146 ,"chestSlot", function() {
         try { //Removing an item
            var item = chest_slot.getChildAt(0);
            if (inventoryAvailability.indexOf(true) > -1){
                chest_slot.removeChildAt(0);
                pickUpItems.call(item, item, player);
                chestAvailability = true;

                equip.armor = "none";
                player.loadTexture(JSON.stringify(equip), playerFrames[player_dir].walk[0]);
                player.dmgMultiplyer += item.dmgReduc;
            }
        }
        catch(err){}
    }, this);

    inventory.addChild(sword_slot);
    inventory.addChild(helmet_slot);
    inventory.addChild(chest_slot);

    items.armor0 = itemFrames.load('armor0'); items.armor0.kill();
    items.armor1 = itemFrames.load('armor1'); items.armor1.kill();
    items.armor2 = itemFrames.load('armor2'); items.armor2.kill(); 
    items.weapon1 = itemFrames.load('weapon1'); items.weapon1.kill();
    items.weapon2 = itemFrames.load('weapon2'); items.weapon2.kill();
    items.weapon3 = itemFrames.load('weapon3'); items.weapon3.kill();
    items.gem = itemFrames.load("gem"); items.gem.kill();

    inventory.kill();
}

function toggleInventory(){
    if (gameState == states.alive){
        if (inventoryDisplayed){
            inventory.kill();
            inventoryDisplayed = false;            
        }
        else {
            inventory.revive();
            inventoryDisplayed = true;            
    	}
    }
}

function inventoryCreator(){
    var id = buttonCreated;
    function generatedFunction(){
        try { //equiping an item
            var item = inventorySlots[id].getChildAt(0);
            //Check item type
            
            var itemName = (item.itemCode).toString();
            inventorySlots[id].removeChildAt(0);
            inventoryAvailability[id] = true;

            if (itemName.indexOf('armor') > -1){                
                if (!chestAvailability) { //there is no free chest armor space
                    var temp = chest_slot.getChildAt(0);
                    chest_slot.removeChildAt(0);                    
                    pickUpItems.call(temp, temp, player);
                    player.dmgMultiplyer += temp.dmgReduc;
                }

                chestAvailability = false;
                chest_slot.addChild(item);

                equip.armor = item.itemCode;
                player.loadTexture(JSON.stringify(equip), playerFrames[player_dir].walk[0]);

                player.dmgMultiplyer -= item.dmgReduc;
            }

            else if (itemName.indexOf('hat') > -1){                            
                if (!helmetAvailability) { //there is no free helmet armor space
                    var temp = helmet_slot.getChildAt(0);
                    helmet_slot.removeChildAt(0);                    
                    pickUpItems.call(temp, temp, player);
                    player.dmgMultiplyer += temp.dmgReduc;
                }

                helmetAvailability = false;
                helmet_slot.addChild(item);

                equip.hat = item.itemCode;
                player.loadTexture(JSON.stringify(equip), playerFrames[player_dir].walk[0]);

                player.dmgMultiplyer -= item.dmgReduc;                
            }

            else if (itemName.indexOf('weapon') > -1){
                if (!swordAvailability){ //there is no free chest armor space
                    var temp = sword_slot.getChildAt(0);
                    sword_slot.removeChildAt(0);                    
                    pickUpItems.call(temp, temp, player);
                    player.atk -= temp.dmg;
                }

                swordAvailability = false; 
                sword_slot.addChild(item);

                weapon = itemName.charAt(6);   

                player.atk += item.dmg;
            }
            else if (itemName.indexOf('hp') > -1){
            	//use hp pot at that slot
                switch (item.frame){
                    case 35: 
                        player.heal(10);
                        break;
                    case 49: 
                        player.heal(25);
                        break;
                    case 28: 
                        player.heal(50);
                        break;
                }
                updateHealthBar();                                
            }
            else if (itemName.indexOf('mp') > -1) {
            	//use mp pot at that slot
                switch (inventorySlots[i].getChildAt(0).frame){
                    case 38: 
                        player.mana = Math.min(player.maxMana, player.mana+10);
                        break;
                    case 52: 
                        player.mana = Math.min(player.maxMana, player.mana+25);
                        break;
                    case 31: 
                        player.mana = Math.min(player.maxMana, player.mana+50);
                        break;
                }
                updateManaBar();
            }
        }
        catch(err){ //Adding an item
            console.log(err);
        }
    }
    return generatedFunction;
}

function pickUpItems(item, player) {	
    if (this.toString()[0] !="["){ 
        var sItem = itemFrames.load(this.toString(), 0, 0);
        sItem.name = this.toString();
        for (var i=0; i<24; i++){
            if (inventoryAvailability[i]) {                
                inventorySlots[i].addChild(sItem);
                inventoryAvailability[i] = false;                
                return true;
            }
        }
        return false;
    }
    else{
        if (item.itemCode === "gem"){
            gameState = states.dead;
            var winText = game.add.text(window.innerWidth/2, window.innerHeight/2, "GJ MAN", deathTxtStyle);
            winText.fixedToCamera = true;            
        }  	
        for (var i=0; i<24; i++){
            if (inventoryAvailability[i]) {
                this.x = 0;
                this.y = 0;
                inventorySlots[i].addChild(this);
                inventoryAvailability[i] = false;
                item.inInv = true;
                return true;
            }
        }
        return false;
    }    
}

function dropItem(item, itemName, x, y, gameProg){
    if (gameProg) gameProgress = gameProg; 
           
    item.reset(x, y);            
    game.physics.enable(item, Phaser.Physics.ARCADE);   
    item.bringToTop();

}