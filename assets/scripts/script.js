var Canvasloaded = false;

var spaceObject = [];
var blackHoles = [];
var blackHole = new Image();
blackHole.src = 'assets/images/black_hole.svg';

window.onload = function() {
	
}

function checkCollision(array, x, y, mode) {
	for (var i = 0; i < array.length; i++) {
		/*
		if ((spaceObject[i].x + 50 > x || spaceObject[i].x - 50 > x &&
			spaceObject[i].y + 50 > y && spaceObject[i].y - 50 < y &&
			x > 0 + 25 && x < 1000 - 25 && y > 0 + 25 && y < 640 - 25)) {
			return true;
		}
		*/ 

		
		if (mode == 0) {
			// mode for spaceObject
			var diff = 50;
		} else {
			// mode for blackhole
			var diff = 100;
		}
		
		var tempRX = array[i].x+diff;
		var tempLX = array[i].x-diff;
		var tempBY = array[i].y+diff;
		var tempTY = array[i].y-diff;
		if (tempRX < x) {
			continue;
		} else if (tempLX > x) {
			continue;
		} else if (tempBY < y) {
			continue;
		} else if (tempTY > y) {
			continue;
		} else {
			return true;
		}

	}
	return false;

}

// object Moon
function Moon(x, y) {
	this.x = x;
	this.y = y;
	this.direction = generateDirection();
}


Moon.prototype.draw=function() {
	// If Canvas is loaded then we call the method then the moon would be drawn
	// Otherwise nothing would be drawn
	if (Canvasloaded) {
    	var c = document.getElementById("main");
    	window.ctx = c.getContext("2d"); // Dealing with a global context is easier

    	ctx.beginPath();
		ctx.arc(this.x, this.y, 25, 270*Math.PI/180, 2*Math.PI, true);
		ctx.fillStyle="#000000";
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.moveTo(this.x, this.y-25);
		var diff = Math.sqrt(1250)/2;
		ctx.arc(this.x+13, this.y-13, diff, (270-25)*Math.PI/180, (360+25)*Math.PI/180, true);
		//ctx.moveTo(this.x, this.y-25);
		ctx.fillStyle="#FFFFFF";
		ctx.fill();
		
		//ctx.stroke();
 	}

}


// Object
Planet = function(x, y) {
	this.x = x;
	this.y = y;
	this.direction = generateDirection();

}

Planet.prototype.draw=function() {
	if (Canvasloaded) {
		var c = document.getElementById("main");
    	window.ctx = c.getContext("2d");
    	ctx.beginPath();
		ctx.ellipse(this.x, this.y, Math.sqrt(1250), 5, 135*Math.PI/180, 135*Math.PI/180, 45 * Math.PI/180);
		ctx.moveTo(this.x+25,this.y);
		ctx.arc(this.x, this.y, 25, 0, 2*Math.PI, false);
		ctx.stroke();

	}
}


// Obejct Ufo
Ufo = function(x, y) {
	this.x = x;
	this.y = y;
	this.direction = generateDirection();

}

Ufo.prototype.draw=function() {
	if (Canvasloaded) {
		var c = document.getElementById("main");
    	window.ctx = c.getContext("2d");
    	ctx.beginPath();
		ctx.moveTo(this.x+Math.sqrt(200), this.y+Math.sqrt(200));
		ctx.arc(this.x, this.y, 20, 45*Math.PI/180, 225*Math.PI/180, true);
		ctx.lineTo(this.x+Math.sqrt(200), this.y+Math.sqrt(200));
		ctx.moveTo(this.x+15, this.y+15);
		ctx.ellipse(this.x, this.y, 10, Math.sqrt(1250),135*Math.PI/180, 210*Math.PI/180, 150* Math.PI/180);
		ctx.stroke();
	}
}


// Object Spaceship
Spaceship = function(x, y) {
	this.x = x;
	this.y = y;
	this.direction = generateDirection();

}

Spaceship.prototype.draw=function() {
	if (Canvasloaded) {
		var c = document.getElementById("main");
    	window.ctx = c.getContext("2d");
   	 	ctx.beginPath();
   	 	
   	 	ctx.fillStyle='#000000';
   	 	// Body of the spaceship
		ctx.moveTo(this.x+10, this.y-10);
		ctx.ellipse(this.x, this.y-10, 10, 20, 0, 0, 2 * Math.PI);
		ctx.fill();


		// left wind of the spaceship
		ctx.moveTo(this.x-10, this.y-10);
		ctx.lineTo(this.x-25, this.y+10);
		ctx.lineTo(this.x-25, this.y+25);
		ctx.lineTo(this.x-5, this.y+25);
		ctx.lineTo(this.x-5, this.y+7);


		// right wind of the spaceship
		ctx.moveTo(this.x + 10, this.y-10);
		ctx.lineTo(this.x + 25, this.y+10);
		ctx.lineTo(this.x + 25, this.y+25);
		ctx.lineTo(this.x + 5, this.y+25);
		ctx.lineTo(this.x + 5, this.y+7);

		ctx.rect(this.x-5, this.y+7, 10, 12);
		ctx.fill();
	}
}

function Direction(x, y) {
	this.x = x;
	this.y = y;

}


var directions = [new Direction(1, 1),  new Direction(-1, 1), new Direction(1, -1), 
					new Direction(-1, -1)];
// object button

/* function button (xTop, xBot, yLeft, yRight) {
	this.xTop = xTop;
	this.xBot = xBot;
	this.yLeft = yLeft;
	this.yRight = yRight;
}*/


function generateDirection() {
	var direction = directions[Math.floor(Math.random() * 4)];
	return direction;
}

// Load the Canvas in the webpage
function loadCanvas() {
	var canvas = document.createElement('canvas');
	canvas.id = 'main';
	canvas.width = '1000';
	canvas.height = '640';
	var startPage = document.getElementById('start-page');
	var footer = document.getElementById('credit');
	document.body.removeChild(startPage);
	document.body.insertBefore(canvas, footer);
    Canvasloaded = true;
    console.log("success");
    startGame();
}

function infoBar() {
	var c = document.getElementById("main");
    window.ctx = c.getContext("2d");
    ctx.rect(0, 0, 1000, 40);
	ctx.stroke();

	var level = "Level " + 1;
	var score = "Score: " + 200;
	var timer = 60 + " seconds";
	ctx.font = "20px sans-serif";

	ctx.fillText(level, 20, 27);
	ctx.fillText(score, 450, 27);
	ctx.fillText(timer, 890, 27);

	ctx.fillText("Pause", 793, 27);
	ctx.rect(770, 5, 100, 30);
	ctx.stroke();
}
var BlackHole = function(x, y) {
	this.x = x;
	this.y = y;
}

function loadBlackHole() {


	do {
		x = Math.floor(Math.random() * 950) + 25;
		y = Math.floor(Math.random() * 535) + 65;

	} 
	while (checkCollision(spaceObject, x, y, 1) || checkCollision(blackHoles, x, y, 1) && blackHoles.length < 15);

	if (blackHoles.length < 15) {
		blackHoles.push(new BlackHole(x, y));
	}
}


function initObjects() {
	while (spaceObject.length < 10) {
		var type = Math.floor(Math.random() * 4);
		var x = Math.floor(Math.random() * 950) + 25;
		var y = Math.floor(Math.random() * 535) + 65;
		var collision = checkCollision(spaceObject, x, y, 0);
		console.log(collision);
		if (!collision) {
			switch(type) {
				case 0:
					spaceObject.push(new Moon(x, y));
					break;
				case 1:
					spaceObject.push(new Planet(x, y));
					break;
				case 2:
					spaceObject.push(new Ufo(x, y));
					break;
				case 3:
					spaceObject.push(new Spaceship(x, y));
					break;
			}
		}

	}
}

function moveObject() {
	var c = document.getElementById("main");
    var ctx = c.getContext("2d");
    window.ctx.clearRect(0, 40, 1000, 600);
	for (object in spaceObject) {
		var temp = spaceObject[object];
		temp.draw();
		while ((temp.x + temp.direction.x) <= 25 || 
			(temp.x + temp.direction.x) >= 975 || 
			(temp.y + temp.direction.y) <= 70 || 
			(temp.y + temp.direction.y) >= 610) {
			temp.direction = generateDirection();
		} 
		temp.x += temp.direction.x;
		temp.y += temp.direction.y;
	}

	for (item in blackHoles) {
		ctx.drawImage(blackHole, blackHoles[item].x-25, blackHoles[item].y-25, 50, 50);
	}
	
	setTimeout(moveObject, 33);
}



function startGame() {
	// draw the Moon, Planet, Spaceship and Ufo in the canvas

	

	infoBar();
	initObjects();
	setInterval(loadBlackHole, 1000);
	moveObject();

	// var moon = new Moon(100, 200, (50/3));
	// moon.draw();
	// var planet = new Planet(200, 300);
	// planet.draw();
	// var ufo = new Ufo(350, 400);
	// ufo.draw();
	// var spaceship = new Spaceship(500, 400);
	// spaceship.draw();
	// loadBlackHole(200, 100);
	
	
}