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
			"What? Lord Kinonn was possessed by a gem? This \nis... this is... AMAZING. KEKEKE. NOT ONLY HAVE YOU \nCOLLECTED ALL 3 STONES FOR ME, BUT YOU HAVE ALSO \nDEFEATED THE ONLY ONE WHO CAN STOP ME. THAT IS RIGHT, \nI AM THE GREAT ASC. NOW THAT I HAVE ALL THE STONES, \nI CAN RETURN TO MY TRUE FORM."
			],

	wolfBoss: "I must protect the creatures of the forest. If \nyou are brave enough to challenge me, step inside my \nden. Don't be afraid to get burned.",

	skeleBoss: "When you die, you will realize the consequences of \nyour actions. Lies do not come from the dead, they \nare born from the living.",

	knightBoss: "Not necessity, not desire - no, the love of power \nis the demon of men. Let them have everything - \nhealth, food, a place to live, entertainment - \nthey are and remain unhappy and low-spirited: for the \ndemon waits and waits and will be satisfied. ",

	raidBoss: [
				"Your skills seem to have developed. Don't be fooled, \nI have yet to release the true power of the gems.",
				"Me, the great Asc? Defeated by a measly \nadventurer? Kekeke... What a world."
			  ]


}

function createDialogue(collisionBox, player) {	
	if (player===undefined || (gameState===states.alive && !inventory.alive && game.time.now - dialogueTimer > 250)){	
		dialogueTimer = game.time.now;

		gameState = states.dialogue;		
		var NPCname = (collisionBox.name).toString();		
		var text = game.add.text(495, 500, null, niceTxtStyle);

		switch (NPCname){
			case "oldman":
				curDialogueBox = oldmanText;
				oldmanText.exists = true;
				text.setText(dialogueText.oldman[gameProgress]);
				if (gameProgress === 3)
					loadMap('map6', spawn.x, spawn.y, false);				
				break;

			case "kid":
				curDialogueBox = kidText;
				kidText.exists = true;
				text.setText(dialogueText.kid[Math.floor(gameProgress/2)]);		
				break;		

			case "cleric":
				curDialogueBox = clericText;
				text.setText(dialogueText.cleric);
				clericText.exists = true;		

				player.heal(100); player.mana = player.maxMana;
            	updateHealthBar(); updateManaBar();			
				break;	

			case "clerk":
				curDialogueBox = clerkText;
				clerkText.exists = true;
				shop.bringToTop();
				shop.revive();	
				break;	

			case "wolfBoss":
				curDialogueBox = wolfBossText;
				text.setText(dialogueText.wolfBoss);
				wolfBossText.exists = true;
				break;

			case "skeleBoss":
				curDialogueBox = skeleBossText;
				text.setText(dialogueText.skeleBoss);
				skeleBossText.exists = true;
				break;

			case "knightBoss":
				curDialogueBox = knightBossText;
				text.setText(dialogueText.knightBoss);
				knightBossText.exists = true;
				break;

			case "raidBoss":
				curDialogueBox = raidBossText;
				text.setText(dialogueText.raidBoss[gameProgress-3]);
				raidBossText.exists = true;
				break;
		}
		curDialogueBox.name = NPCname;
		if (text) curDialogueBox.addChild(text);
	}
}