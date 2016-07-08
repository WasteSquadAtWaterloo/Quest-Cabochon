var playerFrames = {
	"dead": [260, 261, 262, 263, 264, 265],

	"up":{
		"walk": [104, 105, 106, 107, 108, 109, 110, 111, 112],		
		"attack":[156, 157, 158, 159, 160, 161]	
	},

	"left":{
		"walk": [117, 118, 119, 120, 121, 122, 123, 124, 125],		
		"attack":[169, 170, 171, 172, 173, 174]	
	},

	"down":{
		"walk": [130, 131, 132, 133, 134, 135, 136, 137, 138],		
		"attack":[182, 183, 184, 185, 186, 187]	
	},

	"right":{
		"walk": [143, 144, 145, 146, 147, 148, 149, 150, 151],		
		"attack":[195, 196, 197, 198, 199, 200]	
	}
},

enemyFrames = {
"spider": {
	"down": {
		"walk": [0, 1, 2, 3, 4, 5],
		"dead": 6
	},	
},
"scorpion": {
	"down":{
		"walk": [0, 1, 2, 3, 4],
	}
}
},

itemFrames = {
	'armor0': 184,
	'armor1': 186,
	'armor2': 187,

	load: function(item, x, y){
		return game.add.sprite(x, y, 'items', this[item]);
	}
}



var stand = [];

for (var i=0; i<25; i++){
    for (var j=6; j<14; j++){
    	if (i>6 || j<11) stand.push(i*57+j);
    }
}

for (var i=21; i<25; i++){
    for (var j=13; j<41; j++){
        stand.push(i*57+j);
    }
}

stand.push(541, 542, 543, 544, 545, 546, 547, 548, 549, 593, 650, 583, 584, 585, 586, 587, 588);
