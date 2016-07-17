var playerFrames = {
	"dead": [260, 261, 262, 263, 264, 265],

	"up":{
		"walk": [104, 105, 106, 107, 108, 109, 110, 111, 112],		
		"attack":[156, 157, 158, 159, 160, 161],
		"spell": [6, 5, 4, 3, 2, 1, 0]	
	},

	"left":{
		"walk": [117, 118, 119, 120, 121, 122, 123, 124, 125],		
		"attack":[169, 170, 171, 172, 173, 174],
		"spell": [19, 18, 17, 16, 15, 14, 13]	
	},

	"down":{
		"walk": [130, 131, 132, 133, 134, 135, 136, 137, 138],		
		"attack":[182, 183, 184, 185, 186, 187],
		"spell": [32, 31, 30, 29, 28, 27, 26]	
	},

	"right":{
		"walk": [143, 144, 145, 146, 147, 148, 149, 150, 151],		
		"attack":[195, 196, 197, 198, 199, 200],
		"spell": [45, 44, 43, 42, 41, 40, 39]	
	}
},

enemyFrames = {
"snail": {
	"down": {
		"walk": [0, 1, 2, 3]		
	},	
},
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
},
"logmonster": {
	"down":{
		"walk": [0, 1, 2, 3, 4],
	}
},
"skeleton": {
	"down": {
		"walk": [0, 1, 2, 3, 4, 5, 6]
	}
},
"zombie": {
	"down": {
		"walk": [0, 1, 2, 3, 4, 5, 6]
	}
},
"guard": {
	"down": {
		"walk": [0, 1, 2]
	}
}
},

itemFrames = {
	'hat0': 192,
	'hat1': 190,
	'hat2': 195,
	'hat3': 194,
	'armor0': 184,
	'armor1': 186,
	'armor2': 187,
	'hp0': 35,
	'hp1': 49,
	'hp2': 28,
	'mp0': 38,
	'mp1': 52,
	'mp2': 31,


	load: function(item, x, y){
		var itemTR = game.add.sprite(x, y, 'items', this[item]);
		itemTR.itemCode = item;
		return itemTR;
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

for (var i=25; i<31; i++){
	for (var j=45; j<50; j++){
		stand.push (i*57+j);
	}
}

stand.push(541, 542, 543, 544, 545, 546, 547, 548, 549, 593, 650, 583, 584, 585, 586, 587, 588);
