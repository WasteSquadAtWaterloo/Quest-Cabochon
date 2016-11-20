//player animation frame indices
var playerFrames = {
	"dead": [260, 261, 262, 263, 264, 265],

	"up":{
		"walk": [104, 105, 106, 107, 108, 109, 110, 111, 112],		
		"melee":[156, 157, 158, 159, 160, 161],
		"attackOS1":[56, 57, 58, 59, 60, 61, 62, 63],
		"attackOS2":[56, 57, 58, 59, 60, 61],
		"attackOS3":[56, 57, 58, 59, 60, 61, 62, 63],
		"spell": [6, 5, 4, 3, 2, 1, 0]	
	},

	"left":{
		"walk": [117, 118, 119, 120, 121, 122, 123, 124, 125],		
		"melee":[169, 170, 171, 172, 173, 174],
		"attackOS1":[64, 65, 66, 67, 68, 69, 70, 71],
		"attackOS2":[64, 65, 66, 67, 68, 69],
		"attackOS3":[64, 65, 66, 67, 68, 69, 70, 71],
		"spell": [19, 18, 17, 16, 15, 14, 13]	
	},

	"down":{
		"walk": [130, 131, 132, 133, 134, 135, 136, 137, 138],		
		"melee":[182, 183, 184, 185, 186, 187],
		"attackOS1":[72, 73, 74, 75, 76, 77, 78, 79],
		"attackOS2":[72, 73, 74, 75, 76, 77],
		"attackOS3":[72, 73, 74, 75, 76, 77, 78, 79],
		"spell": [32, 31, 30, 29, 28, 27, 26]	
	},

	"right":{
		"walk": [143, 144, 145, 146, 147, 148, 149, 150, 151],		
		"melee":[195, 196, 197, 198, 199, 200],
		"attackOS1":[80, 81, 82, 83, 84, 85, 86, 87],
		"attackOS2":[80, 81, 82, 83, 84, 85],
		"attackOS3":[80, 81, 82, 83, 84, 85, 86, 87],
		"spell": [45, 44, 43, 42, 41, 40, 39]	
	}
},

//enemy animation frame indices
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

//item sprite indices
itemFrames = {
	'hat0': 192,
	'hat1': 190,
	'hat2': 195,
	'hat3': 194,
	'armor0': 184,
	'armor1': 186,
	'armor2': 187,
	'weapon1': 116,
	'weapon2': 79,
	'weapon3': 122,
	'hp0': 35,
	'hp1': 49,
	'hp2': 28,
	'mp0': 38,
	'mp1': 52,
	'mp2': 31,

	load: function(item, x, y){
		var itemTR = game.add.sprite(x, y, 'items', this[item]);
		itemTR.itemCode = item;		
		switch (item) {
			case 'armor0': 
				itemTR.dmgReduc = 0.1; 
				break;
			case 'armor1': 
				itemTR.dmgReduc = 0.2; 
				break;
			case 'armor2': 
				itemTR.dmgReduc = 0.3; 
				break;
			case 'hat0': 
				itemTR.dmgReduc = 0.05; 
				break;
			case 'hat1': 
				itemTR.dmgReduc = 0.1; 
				break;
			case 'hat2': 
				itemTR.dmgReduc = 0.15; 
				break;
			case 'hat3': 
				itemTR.dmgReduc = 0.2; 	
				break;
			case 'weapon1': 
				itemTR.dmg = 2; 
				break;
			case 'weapon2': 
				itemTR.dmg = 5; 	
				break;
			case 'weapon3': 
				itemTR.dmg = 10; 			
				break;
		}		

		return itemTR;
	}
}

//offsets for proper hit box collision of weapon
var atkOpts = {
    "up": [
    	{x:-2.5, y:-30},
    	{x:11.5, y:-75},
    	{x:-23.5, y:-50},
    	{x:6.5, y:-80}
    ],
    "down": [
    	{x:-2.5, y:15},
    	{x:-0.5, y:-5},
    	{x:-20.5, y:20},
    	{x:-5.5, y:0}
    ],
    "right": [
    	{x:25, y:-12.5},
    	{x:25, y:-9},
    	{x:25, y:-27.5},
    	{x:25, y:-12.5}
    ],
    "left": [
    	{x:-25, y:-12.5},
    	{x:-55, y:-9},
    	{x:-50, y:-27.5},
    	{x:-65, y:-12.5}
    ]
};

var wepBoxSize = {
	'1': {
		'hrzntl': {
			'width': 60,
			'height': 20 
		},
		'vrtcl': {
			'width': 20,
			'height': 60
		}
	},
	'2': {
		'hrzntl': {
			'width': 50,
			'height': 40 
		},
		'vrtcl': {
			'width': 70,
			'height': 50
		}
	},
	'3': {
		'hrzntl': {
			'width': 65,
			'height': 30 
		},
		'vrtcl': {
			'width': 30,
			'height': 65
		}
	} 
}

//get all tile ids that cannot be collided with
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


for (var i=25; i<28; i++){
	for (var j=41; j<50; j++){
		stand.push (i*57+j);
	}
}

stand.push(541, 542, 543, 544, 545, 546, 547, 548, 549, 593, 650, 583, 584, 585, 586, 587, 588);