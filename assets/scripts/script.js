var Canvasloaded = false;



window.onload = function() {

    
}


// parent object
function SpaceObject(x, y) {
	this.x = x;
	this.y = y;
}


// object Moon
function Moon(x, y) {
	this.x = x;
	this.y = y;
}

Moon._proto_ = SpaceObject;

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
		ctx.arc(this.x+12.5, this.y-12.5, diff, (270-45)*Math.PI/180, (360+45)*Math.PI/180, true);
		ctx.moveTo(this.x, this.y-25);
		ctx.fillStyle="#FFFFFF";
		ctx.fill();
		
		ctx.stroke();
   		console.log("0");
 	}

}


// Object
Planet = function(x, y) {
	this.x = x;
	this.y = y;

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

}

Spaceship.prototype.draw=function() {
	if (Canvasloaded) {
		var c = document.getElementById("main");
    	window.ctx = c.getContext("2d");
   	 	ctx.beginPath();
   	 	
   	 	// Body of the spaceship
		ctx.moveTo(this.x+10, this.y-10);
		ctx.ellipse(this.x, this.y-10, 10, 20, 0, 0, 2 * Math.PI);


		// left wind of the spaceship
		ctx.moveTo(this.x-10, this.y-10);
		ctx.lineTo(this.x-25, this.y+10);
		ctx.lineTo(this.x-25, this.y+25);
		ctx.lineTo(this.x-5, this.y+25);
		ctx.lineTo(this.x-5, this.y+7);


		// right wind of the spaceship
		ctx.moveTo(this.x+10, this.y-10);
		ctx.lineTo(this.x+25, this.y+10);
		ctx.lineTo(this.x+25, this.y+25);
		ctx.lineTo(this.x+5, this.y+25);
		ctx.lineTo(this.x+5, this.y+7);

		ctx.moveTo(this.x-5, this.y+20);
		ctx.lineTo(this.x+5, this.y+20);
		ctx.stroke();
	}
}
// object button

/* function button (xTop, xBot, yLeft, yRight) {
	this.xTop = xTop;
	this.xBot = xBot;
	this.yLeft = yLeft;
	this.yRight = yRight;
}*/




// Load the Canvas in the webpage
function loadCanvas() {
	var canvas = document.createElement('canvas');
	canvas.id = 'main';
	canvas.width = '1000';
	canvas.height = '640';
	var start = document.getElementById('start-page');
	document.body.removeChild(start);
    document.body.appendChild(canvas);
    Canvasloaded = true;
    console.log("successe");
    startGame();
}



function startGame() {
	// draw the Moon, Planet, Spaceship and Ufo in the canvas
	var moon = new Moon(100, 200, (50/3));
	moon.draw();
	var planet = new Planet(200, 300);
	planet.draw();
	var ufo = new Ufo(350, 400);
	ufo.draw();
	var spaceship = new Spaceship(500, 400);
	spaceship.draw();
}

// var shapes = new Array();
// var Shape = function (x, y) {
//     this.x = x;
//     this.y = y;
// }


// function start() {
// 	window.ctx.clearRect(0, 0, 1000, 640);
// 	shapes.push (new Shape(300, 200));


// }