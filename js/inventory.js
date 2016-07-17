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
            sword_slot.removeChildAt(0);
            pickUpItems.call(item, item, player);
            swordAvailability = true;
        }
        catch(err){
        }
    }, this);
    helmet_slot = game.make.button(258,98 ,"helmetSlot", function() {
         try { //Removing an item
            var item = helmet_slot.getChildAt(0);
            helmet_slot.removeChildAt(0);
            pickUpItems.call(item, item, player);
            helmetAvailability = true;
        }
        catch(err){

        }
    }, this);
    chest_slot = game.make.button(258 ,146 ,"chestSlot", function() {
         try { //Removing an item
            var item = chest_slot.getChildAt(0);
            chest_slot.removeChildAt(0);
            pickUpItems.call(item, item, player);
            chestAvailability = true;
        }
        catch(err){

        }
    }, this);

    inventory.addChild(sword_slot);
    inventory.addChild(helmet_slot);
    inventory.addChild(chest_slot);

    items.armor0 = itemFrames.load('armor0'); items.armor0.exists = false;//game.physics.enable(items.armor0, Phaser.Physics.ARCADE); items.armor0.name = "armor0";
    items.armor1 = itemFrames.load('armor1');items.armor1.exists = false;// game.physics.enable(items.armor1, Phaser.Physics.ARCADE); items.armor1.name = "armor1";
    items.armor2 = itemFrames.load('armor2');items.armor2.exists = false; //game.physics.enable(items.armor2, Phaser.Physics.ARCADE); items.armor2.name = "armor2";

    inventory.kill();
}

function toggleInventory(){
    if (inventoryDisplayed){
        inventory.kill();
        inventoryDisplayed = false;            
    }
    else {
        inventory.revive();
        inventoryDisplayed = true;            
	}
}

function inventoryCreator(){
    var id = buttonCreated;
    function generatedFunction(){
        try { //equiping an item
            var item = inventorySlots[id].getChildAt(0);
            //Check item type
            var itemName = (item.name).toString();
            inventorySlots[id].removeChildAt(0);
            inventoryAvailability[id] = true;

            if (itemName.indexOf('armor') > -1){
                if (chestAvailability) { //There is a free chest armor space
                    chest_slot.addChild(item);
                    chestAvailability = false;
                }
                else { //there is no free chest armor space
                    var temp = chest_slot.getChildAt(0);
                    chest_slot.removeChildAt(0);
                    chest_slot.addChild(item);
                    pickUpItems.call(temp, temp, player);
                }

                equip.armor = item.itemCode;
                player.loadTexture(JSON.stringify(equip), playerFrames[player_dir].walk[0]);
            }
            else if (itemName.indexOf('hat') > -1){
                if (helmetAvailability) { //There is a free chest armor space
                    helmet_slot.addChild(item);
                    helmetAvailability = false;
                }
                else { //there is no free chest armor space
                    var temp = helmet_slot.getChildAt(0);
                    helmet_slot.removeChildAt(0);
                    helmet_slot.addChild(item);
                    pickUpItems.call(temp, temp, player);
                }
                equip.hat = item.itemCode;
                player.loadTexture(JSON.stringify(equip), playerFrames[player_dir].walk[0]);                
            }
            else if (itemName.indexOf('weapon') > -1){
                if (swordAvailability) { //There is a free chest armor space
                    sword_slot.addChild(item);
                    swordAvailability = false;
                }
                else { //there is no free chest armor space
                    var temp = sword_slot.getChildAt(0);
                    sword_slot.removeChildAt(0);
                    sword_slot.addChild(item);
                    pickUpItems.call(temp, temp, player);
                }    
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
                break;
            }
        }
    }
    else{
    	item.inInv = true;
        for (var i=0; i<24; i++){
            if (inventoryAvailability[i]) {
                this.x = 0;
                this.y = 0;
                inventorySlots[i].addChild(this);
                inventoryAvailability[i] = false;
                break;
            }
        }
    }
}