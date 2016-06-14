window.onload = function() {
	window.c = document.getElementById("main");
	window.ctx = c.getContext("2d");

	window.spaceThings = [];
	window.blackHoles = [];
	window.directions = [new Direction(1, 1), new Direction(1, -1), 
						new Direction(-1, 1), new Direction(-1, -1)];

	window.blackHoleBlue = new Image();
	blackHoleBlue.src = 'assets/images/blue-hole.svg';

	window.blackHolePurple = new Image();
	blackHolePurple.src = 'assets/images/purple-hole.svg';

	window.blackHoleBlack = new Image();
	blackHoleBlack.src = 'assets/images/black-hole.svg';

	c.addEventListener("mousedown", clickBlackHole, false);
	window.pause = false;
}

function displayCanvas() {
	var canvas = document.getElementById("main");
	canvas.style.display = 'initial';
	var start = document.getElementById("start");
	start.style.display = 'none';
	// infoBar();
	startGame();
}

function infoBar() {
	var level = "Level " + 1;
	var score = "Score: " + 200;
	var timer = 60 + " seconds";
	ctx.font = "20px sans-serif";
	ctx.fillStyle = "black";

	ctx.rect(0, 0, 1000, 40);
	ctx.stroke();

	ctx.fillText(level, 20, 27);
	ctx.fillText(score, 450, 27);
	ctx.fillText(timer, 890, 27);

	ctx.fillText("Pause", 793, 27);
	ctx.rect(770, 5, 100, 30);

	ctx.stroke();
}

function clickBlackHole(event) {
	var mouseX = event.x - c.offsetLeft;
	var mouseY = event.y - c.offsetTop;


	if (checkCollision(blackHoles, mouseX, mouseY, 3)) {
		if (!pause) {
			var length = blackHoles.length;
			for (var i = 0; i < length; i++) {
				if (checkCollision([blackHoles[i]], mouseX, mouseY, 3)) {
					for (item in blackHoles[i].pulling) {
						blackHoles[i].pulling[item].pull = null;
					}
					blackHoles.splice(i, 1);
				}
			}
		}
	}

	if (checkPause(mouseX, mouseY)) {
		pause = !pause;
		console.log(pause);
	}
}


function SpaceThing(x, y, type) {
	this.x = x;
	this.y = y;
	this.direction = getDirection();
	this.pull = null;
	this.type = type;
}

function BlackHole(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.pulling = [];
}

function Direction(x, y) {
	this.x = x;
	this.y = y;
}

function checkCollision(things, x, y, type) {
	var difference;
	var xRight;
	var xLeft;
	var yTop;
	var yBottom;

	if (type == 0) {
		difference = 50;
	} else if (type == 1) {
		difference = 100;
	} else {
		difference = 25;
	}

	for (var i = 0; i < things.length; i++) {

		xRight = things[i].x + difference;
		xLeft = things[i].x - difference;
		yTop = things[i].y - difference;
		yBottom = things[i].y + difference;

	

		if (xRight < x) {
			continue;
		} else if (xLeft > x) {
			continue;
		} else if (yTop > y) {
			continue;
		} else if (yBottom < y) {
			continue;
		} else {
			return true;
		}
	}
	return false;
}

function checkPause(x, y) {

	var xRight;
	var xLeft;
	var yTop;
	var yBottom;

	

	xRight = 870;
	xLeft = 770;
	yTop = 5;
	yBottom = 35;

	

	if (xRight < x || xLeft > x || yTop > y || yBottom < y) {
		return false;
	} else {
		return true;
	}
	
}


function checkInHorizon(x, y) {
	var difference = 100;
	var xRight;
	var xLeft;
	var yTop;
	var yBottom;

	for (var i = 0; i < blackHoles.length; i++) {

		xRight = blackHoles[i].x + difference;
		xLeft = blackHoles[i].x - difference;
		yTop = blackHoles[i].y - difference;
		yBottom = blackHoles[i].y + difference;



		if (xRight < x) {
			continue;
		} else if (xLeft > x) {
			continue;
		} else if (yTop > y) {
			continue;
		} else if (yBottom < y) {
			continue;
		} else {
			return blackHoles[i];
		}
	}
	return null;
}


function getDirection() {
	var direction = directions[Math.floor(Math.random() * 4)];
	return direction;
}

function insertSpaceThings() {

	for (var i = 0; i < 10; i++) {
		do {
			var x = Math.floor(Math.random() * 950) + 25;
			var y = Math.floor(Math.random() * 535) + 65;
		}
		while (checkCollision(spaceThings, x, y, 0));
		spaceThings.push(new SpaceThing(x, y, i));
	}
}

function drawSpaceThings() {
	for (item in spaceThings) {
		var x = spaceThings[item].x;
		var y = spaceThings[item].y;

		switch (spaceThings[item].type) {
			case 0:
				drawUFO(x, y);
				break;
			case 1:
				drawPlanet(x, y);
				break;
			case 2: 
				drawMoon(x, y);
				break;
			case 3:
				drawRobot(x, y);
				break;
			case 4:
				drawSpaceship(x, y);
				break;
			case 5:
				drawStar(x, y);
				break;
			case 6:
				drawSatellite(x, y);
				break;
			case 7:
				drawSatellite2(x, y);
				break;
			case 8:
				drawRocket(x, y);
				break;
			case 9:
				drawAstroid(x, y);
				break;
		}
	}
}


function calculatePullDirection(x, y, targetX, targetY, t) {
	var vector = new Direction();
	var xdirect;
	var ydirect;
	vector.x  = (targetX - x) / t;
	vector.y = (targetY - y) / t;
	return vector;
}

function moveSpaceThings() {
	if (!pause) {
		ctx.clearRect(0, 40, 1000, 600);
		drawSpaceThings();
		drawBlackHoles();
		for (item in spaceThings) {
			var object = spaceThings[item];
			if (object.pull == null) {
				while ((object.x + object.direction.x) <= 25 || 
					(object.x + object.direction.x) >= 975 || 
					(object.y + object.direction.y) <= 65 || 
					(object.y + object.direction.y) >= 615) {
					object.direction = getDirection();
				} 
			
				object.pull = checkInHorizon(object.x, object.y);
				if (object.pull != null) {
					object.pull.pulling.push(object);
				}
			} else {
				var directionX;
				var directiony;

				switch (object.pull.type) {
					case 0: 
						object.direction = calculatePullDirection(object.x, object.y, object.pull.x, object.pull.y, 50);
						break;
					case 1:
						object.direction = calculatePullDirection(object.x, object.y, object.pull.x, object.pull.y, 30);
						break;
					case 2:
						object.direction = calculatePullDirection(object.x, object.y, object.pull.x, object.pull.y, 15);

				}
			
			}
			object.x += object.direction.x;
			object.y += object.direction.y;

		}
		eventHorizon();
	}
	setTimeout(moveSpaceThings, 33);
}

function insertBlackHoles() {
	if (!pause) {
		do {
			var x = Math.floor(Math.random() * 950) + 25;
			var y = Math.floor(Math.random() * 535) + 65;

		} 
		while (checkCollision(spaceThings, x, y, 1) || checkCollision(blackHoles, x, y, 1) && blackHoles.length < 20);

		var type = Math.floor(Math.random() * 15);
		if (blackHoles.length < 15) {
			if (type < 9) {
				blackHoles.push(new BlackHole(x, y, 0));
			} else if (type >= 9 && type < 13) {
				blackHoles.push(new BlackHole(x, y, 1));
			} else {
				blackHoles.push(new BlackHole(x, y, 2));
			}
		}
	}
}
function drawBlackHoles() {
	for (item in blackHoles) {
		switch(blackHoles[item].type) {
			case 0:
				ctx.drawImage(blackHoleBlue, blackHoles[item].x-25, blackHoles[item].y-25, 50, 50);
				break;
			case 1:
				ctx.drawImage(blackHolePurple, blackHoles[item].x-25, blackHoles[item].y-25, 50, 50);
				break;
			case 2:
				ctx.drawImage(blackHoleBlack, blackHoles[item].x-25, blackHoles[item].y-25, 50, 50);
				break;
		}
		
	}
}

function eventHorizon() {
	for (var i = 0; i < spaceThings.length; i++) {
		var collision = checkCollision(blackHoles, spaceThings[i].x, spaceThings[i].y, 0);

		if (collision) {
			spaceThings.splice(i, 1);
		}
	}
}

function startGame() {
	infoBar();
	insertSpaceThings();
	setInterval(insertBlackHoles, 1000);
	moveSpaceThings();
	// drawSpaceThings();
}

function drawUFO(x, y) {
	ctx.beginPath();
	ctx.moveTo(x + Math.sqrt(200), y + Math.sqrt(200));
	ctx.arc(x, y, 20, 45 * Math.PI / 180, 225 * Math.PI / 180, true);
	ctx.lineTo(x + Math.sqrt(200), y + Math.sqrt(200));
	ctx.moveTo(x + 15, y + 15);
	ctx.ellipse(x, y, 10, Math.sqrt(1250), 135 * Math.PI/180, 
		210 * Math.PI / 180, 150 * Math.PI / 180);
	ctx.stroke();
}

function drawPlanet(x, y) {
	ctx.beginPath();
	ctx.ellipse(x, y, Math.sqrt(1250), 5, 135 * Math.PI/180, 
		135 * Math.PI/180, 45 * Math.PI/180);
	ctx.moveTo(x + 22, y);
	ctx.arc(x, y, 22, 0, 2*Math.PI, false);
	ctx.stroke();
}

function drawMoon(x, y) {
	ctx.beginPath();
	ctx.arc(x, y, 25, 270 * Math.PI / 180, 2 * Math.PI, true);
	ctx.fillStyle = "#000000";
	ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	ctx.moveTo(x, y - 25);
	var difference = Math.sqrt(1250) / 2;
	ctx.arc(x+13, y-13, difference, (270 - 26) * Math.PI / 180, 
		(360 + 26) * Math.PI / 180, true);
	ctx.fillStyle="#FFFFFF";
	ctx.fill();
}

function drawRobot(x, y) {
	ctx.beginPath();

	// head
	ctx.moveTo(x+10, y-15);
	ctx.arc(x,y-15, 10, 0, 1*Math.PI, true);

	// body
	ctx.rect(x-10, y-15, 20, 25);

	// legs
	ctx.moveTo(x-5,y+10);
	ctx.lineTo(x-5, y+25);
	ctx.moveTo(x+5,y+10);
	ctx.lineTo(x+5, y+25);

	//eyes
	ctx.moveTo(x-3, y-19);
	ctx.arc(x-4,y-19, 1, 0, 2*Math.PI, true);

	ctx.moveTo(x+4, y-19);
	ctx.arc(x+3,y-19, 1, 0, 2*Math.PI, true);


	// arms
	ctx.moveTo(x-10, y-10);
	ctx.lineTo(x-20, y+5);
	ctx.lineTo(x-23, y+2);
	ctx.lineTo(x-25, y+5);
	ctx.moveTo(x-20, y+5);
	ctx.lineTo(x-17, y+7);
	ctx.lineTo(x-19, y+9);

	ctx.moveTo(x+10, y-10);
	ctx.lineTo(x+20, y-20);

	ctx.stroke();

}

function drawSpaceship(x, y) {
	ctx.beginPath();
   	 	
 	ctx.fillStyle = '#000000';
 	// Body of the spaceship
	ctx.moveTo(x + 10, y - 10);
	ctx.ellipse(x, y, 10, 22, 0, 0, 2 * Math.PI);
	ctx.fill();

	// left wind of the spaceship
	ctx.moveTo(x - 10, y - 3);
	ctx.lineTo(x - 20, y + 12);
	ctx.lineTo(x - 20, y + 25);
	ctx.lineTo(x - 5, y + 25);
	ctx.lineTo(x - 5, y + 7);
	ctx.fill();

	// right wind of the spaceship
	ctx.moveTo(x + 10, y - 3);
	ctx.lineTo(x + 20, y + 12);
	ctx.lineTo(x + 20, y + 25);
	ctx.lineTo(x + 5, y + 25);
	ctx.lineTo(x + 5, y + 7);
	ctx.fill();

// 	ctx.rect(x - 9, y - 3, 15, 22);
// 	ctx.fill();
}

function drawRocket(x, y) {
	ctx.beginPath();
	ctx.moveTo(x, y - 25);
	ctx.lineTo(x, y - 20);
	ctx.ellipse(x - 5, y, 10, 30, 0, 300 * Math.PI / 180, 345 * Math.PI / 180);
	ctx.lineTo(x - 5, y - 8);
	ctx.ellipse(x + 5, y, 10, 30, 0, 200 * Math.PI / 180, 230 * Math.PI / 180);
	ctx.fillStyle="#EE0000";
	ctx.fill()
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(x - 5, y);
	ctx.rect(x - 5, y - 8, 10, 20);

	ctx.moveTo(x - 5, y - 5);
	ctx.lineTo(x - 25, y + 12);
	ctx.lineTo(x - 5, y + 12);
	ctx.lineTo(x - 5, y - 5);

	ctx.moveTo(x + 5, y - 5);
	ctx.lineTo(x + 25, y + 12);
	ctx.lineTo(x + 5, y + 12);
	ctx.lineTo(x + 5, y - 5);
	ctx.fillStyle = "#062B78";
	ctx.fill()
	ctx.stroke();
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(x - 5, y + 12);
	ctx.lineTo(x - 7, y + 25);
	ctx.lineTo(x - 3, y + 20);
	ctx.lineTo(x, y + 25);
	ctx.lineTo(x + 3, y + 20);
	ctx.lineTo(x + 7, y + 25);
	ctx.lineTo(x + 5, y + 12);
	ctx.lineTo(x - 5, y + 12);
	ctx.fillStyle = "#F04900";
	ctx.fill();
	ctx.stroke();
}

function drawStar(x, y) {
	ctx.beginPath();

	ctx.moveTo(x, y - 25);
	ctx.lineTo(x + 7.5, y - 7);
	ctx.lineTo(x + 25, y - 7);
	ctx.lineTo(x + 12, y + 7);
	ctx.lineTo(x + 20, y + 25);
	ctx.lineTo(x, y + 15);
	ctx.lineTo(x - 20, y + 25);
	ctx.lineTo(x - 12, y + 7);
	ctx.lineTo(x - 25, y - 7);
	ctx.lineTo(x - 7.5, y - 7);
	ctx.lineTo(x, y - 25);
	ctx.fillStyle = "#FBF57D";
	ctx.fill()
	ctx.stroke();

}

function drawAstroid(x, y) {
	ctx.beginPath();

	ctx.moveTo(x, y - 25);
	ctx.arc(x, y - 15, 10, 270 * Math.PI / 180, Math.PI, true);
	ctx.lineTo(x - 25, y - 10);
	ctx.lineTo(x - 22, y + 10);
	ctx.lineTo(x - 10, y + 12);
	ctx.lineTo(x - 10, y + 12);
	ctx.lineTo(x - 15, y + 20);
	ctx.lineTo(x - 5, y + 25);
	ctx.lineTo(x + 8, y + 20);
	ctx.lineTo(x + 15, y);
	ctx.arc(x, y, 25, 0, 270 * Math.PI / 180, true);

	ctx.moveTo(x - 3, y - 3);
	ctx.lineTo(x - 7, y + 3);
	ctx.lineTo(x, y + 3);
	ctx.lineTo(x - 5, y + 9);

	ctx.moveTo(x + 10, y - 3);
	ctx.lineTo(x + 7, y + 3);
	ctx.lineTo(x + 13, y + 3);
	ctx.lineTo(x + 10, y + 9);
	ctx.fillStyle = "#B8B8B8";
	ctx.fill()
	ctx.stroke();
}

function drawSatellite(x, y) {
	ctx.beginPath();
	ctx.rect(x - 4, y - 10, 8, 20);
	ctx.stroke();
	ctx.beginPath();
	ctx.rect(x - 25, y - 5, 18, 8);
	ctx.rect(x + 7, y - 5, 18, 8);
	ctx.fillStyle = "#000000";
	ctx.fill();
	ctx.moveTo(x - 4, y);
	ctx.lineTo(x - 7, y);
	ctx.moveTo(x + 4, y);
	ctx.lineTo(x + 7, y);
	ctx.stroke();
}

function drawSatellite2(x, y) {
	ctx.beginPath();
	ctx.rect(x - 4, y - 10, 8, 20);
	ctx.moveTo(x, y - 10);
	ctx.lineTo(x, y - 15);
	ctx.arc(x, y - 17, 2, 2 * Math.PI, false);
	ctx.stroke();
	ctx.beginPath();
	ctx.rect(x - 25, y - 5, 18, 8);
	ctx.rect(x + 7, y - 5, 18, 8);
	ctx.fillStyle = "#767676";
	ctx.fill();
	ctx.moveTo(x - 4, y);
	ctx.lineTo(x - 7, y);
	ctx.moveTo(x + 4, y);
	ctx.lineTo(x + 7, y);
	ctx.stroke();
}














