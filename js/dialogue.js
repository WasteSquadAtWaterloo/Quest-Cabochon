dialogueText = {
	kid: 	[
			"Each month has its own birthstone. Mine is the Ruby. \nWhat is yours?",
			"Some say that Asc was killed by his own creations; \nhowever, rumors have it that he is still alive."
			],

	cleric: "Hello, I am the cleric and healer of this village. \nHere. I'll treat any wounds you might have.",	

	oldman: [
			"Ah! welcome! You must be the adventurer sent by the \nthe agency. I am Elmeld, the chief of this town. \nLately, we have been attacked by The Forest King, a \nbeast residing in the forest North-West of the city. \nPlease help us by defeating it and restoring peace \nto our town. ",
			"Amazing! Thank you adventurer for saving our village \nfrom the Forest King... What? The body disintegrated \nand left a yellow glowing gem? This is troubling. \nI have a bad feeling about this. I'm sorry to bother \nyou further, but could you visit the South-West side \nof the town and investigate the Drarr graveyard?",
			"...Uh-huh...I see. It is just as I feared. These gems \nyou found are the fabled Cursed Stones of Asc. These \nare 3 stones created by the infamous First-Age mage, \nAsc. North-East of our village is the Usten Kingdom. \nPlease visit Lord Kinonn and ask him how we should \ndispose of these gems.",
			"What? Lord Kinonn was possessed by a gem? This \nis... this is... AMAZING. KEKEKE. NOT ONLY HAVE YOU \nCOLLECTED ALL 3 STONES FOR ME, BUT YOU HAVE ALSO \nDEFEATED THE ONLY ONE WHO CAN STOP ME. THAT IS RIGHT, \nI AM THE GREAT ASC. NOW THAT I HAVE ALL THE STONES, \nI CAN RETURN TO MY TRUE FORM.",
			"Me, the great Asc? Defeated by a measly \nadventurer? Kekeke... What a world."
			]

}

function createDialogue(collisionBox, player) {
	if (gameState===states.alive && !inventory.alive && game.time.now - dialogueTimer > 250){	
		dialogueTimer = game.time.now;

		gameState = states.dialogue;
		var NPCname = (collisionBox.name).toString();		
		var text;		

		switch (NPCname){
			case "oldman":
				curDialogueBox = oldmanText;
				oldmanText.exists = true;
				text = game.add.text(495, 510, dialogueText.oldman[gameProgress], niceTxtStyle);				
				break;

			case "kid":
				curDialogueBox = kidText;
				kidText.exists = true;
				text = game.add.text(495, 510, dialogueText.kid[gameProgress/2], niceTxtStyle);		
				break;		

			case "cleric":
				curDialogueBox = clericText;
				text = game.add.text(495, 510, dialogueText.cleric, niceTxtStyle);
				clericText.exists = true;		

				player.heal(100); player.mana = player.maxMana;
            	updateHealthBar(); updateManaBar();			
				break;	

			case "clerk":
				curDialogueBox = clerkText;
				clerkText.exists = true;
				shop.revive();	
				break;	
		}
		curDialogueBox.name = NPCname;
		if (text) curDialogueBox.addChild(text);
	}


    /*
    if (dialogue == false){        
        if (NPCname == "kidBox") {
            textBox.exists = true;
            if (gameProgress < 2){
                var kidText = game.add.text(15, 15, "Each month has its own birthstone. Mine is the Ruby. \nWhat is yours?", niceTxtStyle);
            }
            else if (gameProgress >= 2){
                var kidText = game.add.text(15,15, "Some say that Asc was killed by his own creations; \nhowever, rumors have it that he is still alive.", niceTxtStyle);
            }
            textBox.addChild(kidText);            
        }
        else if (NPCname == "healerBox") {
            textBox.exists = true;           
            var healerText = game.add.text(15, 15, "Hello, I am the cleric and healer of this village. \nHere. I'll treat any wounds you might have.", niceTxtStyle);
            textBox.addChild(healerText);

            player.heal(100); player.mana = player.maxMana;
            updateHealthBar(); updateManaBar();
        }
        else if (NPCname == "oldManBox") {
            textBox2.exists = true;            
            switch (gameProgress) {
                case 0:
                    var oldManText = game.add.text(15,15, "Ah! welcome! You must be the adventurer sent by the \nthe agency. I am Elmeld, the chief of this town. \nLately, we have been attacked by The Forest King, a \nbeast residing in the forest North-West of the city. \nPlease help us by defeating it and restoring peace \nto our town. ", niceTxtStyle);
                    break;

                case 1:
                    var oldManText = game.add.text(15,15, "Amazing! Thank you adventurer for saving our village \nfrom the Forest King... What? The body disintegrated \nand left a yellow glowing gem? This is troubling. \nI have a bad feeling about this. I'm sorry to bother \nyou further, but could you visit the South-West side \nof the town and investigate the Drarr graveyard?", niceTxtStyle);
                    break;

                case 2:
                    var oldManText = game.add.text(15,15, "...Uh-huh...I see. It is just as I feared. These gems \nyou found are the fabled Cursed Stones of Asc. These \nare 3 stones created by the infamous First-Age mage, \nAsc. North-East of our village is the Usten Kingdom. \nPlease visit Lord Kinonn and ask him how we should \ndispose of these gems.", niceTxtStyle);
                    break;

                case 3:
                    var oldManText = game.add.text(15,15, "What? Lord Kinonn was possessed by a gem? This \nis... this is... AMAZING. KEKEKE. NOT ONLY HAVE YOU \nCOLLECTED ALL 3 STONES FOR ME, BUT YOU HAVE ALSO \nDEFEATED THE ONLY ONE WHO CAN STOP ME. THAT IS RIGHT, \nI AM THE GREAT ASC. NOW THAT I HAVE ALL THE STONES, \nI CAN RETURN TO MY TRUE FORM.", niceTxtStyle);
                    break;

                case 4:
                    var oldManText = game.add.text(15,15, "Me, the great Asc? Defeated by a measly \nadventurer? Kekeke... What a world.", niceTxtStyle);
                    break;
            }
            
            textBox2.addChild(oldManText);
        }
        
    }
    dialogue = true;
	*/
}