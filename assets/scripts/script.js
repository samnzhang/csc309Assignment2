window.onload = function() {
	// Canvas context.
	window.c = document.getElementById("main");
	window.ctx = c.getContext("2d");

	// Global variables to store space objects and blackholes;
	window.spaceThings = [];
	window.blackHoles = [];

	// Directions for how the space objects move;
	window.directions = [new Direction(1, 1), new Direction(1, -1), 
						new Direction(-1, 1), new Direction(-1, -1)];

	// Global variables for imported svg images.
	window.blackHoleBlue = new Image();
	blackHoleBlue.src = 'assets/images/blue-hole.svg';

	window.blackHolePurple = new Image();
	blackHolePurple.src = 'assets/images/purple-hole.svg';

	window.blackHoleBlack = new Image();
	blackHoleBlack.src = 'assets/images/black-hole.svg';

	// Canvas onclick event.
	c.setAttribute("onmousedown", "clickBlackHole(event)");

	// Global variables for game attributes
	window.level;
	window.pause;
	window.timeLeft;
	window.score;
	window.over;

	// Setting the default values for highscore if they don't exist.
	if (localStorage.highScore1 == null) {
		localStorage.highScore1 = 0;
	}

	if (localStorage.highScore2 == null) {
		localStorage.highScore2 = 0;
	}

	if (localStorage.highScore3 == null) {
		localStorage.highScore3 = 0;
	}

	// Display the highscore;
	displayHighscore();
}

/*
 * Start button on click event, hides the starting page and displays the
 * canvas. Also sets the game attributes to default.
 */
function displayCanvas() {
	// Hides the starting page and displays the canvas.
	var canvas = document.getElementById("main");
	canvas.style.display = 'initial';
	var start = document.getElementById("start");
	start.style.display = 'none';
	var credit = document.getElementById("credit");
	credit.style.display = 'none';

	// Setting the game attributes to default.
	level = 1;
	pause = false;
	timeLeft = 60;
	score = 200;
	over = false;
	spaceThings = [];
	blackHoles = [];

	// Starts the game.
	startGame();
}

/*
 * Count down function for time.
 */
function countDown() {
	if (!pause && !over) {
		timeLeft -= 1;
	}
}

/*
 * Determines if the game is over or not.
 */
function gameOver() {
	// Game ends if there are no objects left.
	if (spaceThings.length == 0) {
		over = true;
	}

	// Game is not over if the play still has objects surviving at the end of
	// the game time.
	if (timeLeft == 0) {
		if (spaceThings.length > 0) {
			over = false;
		} else {
			over = true;
		}
	}
 }

/*
 * Draws out the information bar.
 */
function infoBar() {
	// Declare variables for the game info.
	var levelDisplay = "Level " + level;
	var scoreBoard = "Score: " + score;
	var timer = timeLeft + " seconds";
	ctx.font = "20px sans-serif";
	ctx.fillStyle = "black";

	ctx.rect(0, 0, 1000, 40);
	ctx.stroke();

	ctx.fillText(levelDisplay, 20, 27);
	ctx.fillText(scoreBoard, 450, 27);
	ctx.fillText(timer, 890, 27);

	ctx.fillText("Pause", 793, 27);
	ctx.rect(770, 5, 100, 30);

	ctx.stroke();
}

/*
 * Canvas on click event, checks if the player clicked on a black hole
 * or the pause button. Blackhole disappears if clicked and game pauses
 * on click.
 */
function clickBlackHole(event) {
	// Getting user click location
	var mouseX = event.clientX - c.getBoundingClientRect().left;
	var mouseY = event.clientY - c.getBoundingClientRect().top;

	// Checks if the uses clicked on a blackhole.
	if (checkCollision(blackHoles, mouseX, mouseY, 2)) {
		if (!pause && !over) {
			for (var i = 0; i < blackHoles.length; i++) {
				var blackHole = [];
				blackHole.push(blackHoles[i]);
				// Stops changing the status of all objects being pulled by
				// the black hole.
				if (checkCollision(blackHole, mouseX, mouseY, 2)) {
					for(item in blackHoles[i].pulling) {
						blackHoles[i].pulling[item].pull = null;
						blackHoles[i].pulling[item].pulling = false;
					}

					// Increment the score by the type of black hole clicked.
					if (blackHoles[i].type == 0) {
						score += 5;
					} else if (blackHoles[i].type == 1) {
						score += 10;
					} else {
						score += 20;
					}

					// Finally, remove the black hole.
					blackHoles.splice(i, 1);
				}
			}
		}
	}
	// checks if the pause button is clicked.
	if (checkPause(mouseX, mouseY) && !over) {
		pause = !pause;
	}
}

/*
 * Checks if objects in the array things are in type range of x and y;
 * Return true if a collision occurs, false otherwise.
 */
function checkCollision(things, x, y, type) {
	var difference;
	var xRight;
	var xLeft;
	var yTop;
	var yBottom;

	// Types of collision to be determined
	if (type == 0) {
		difference = 50;
	} else if (type == 1) {
		difference = 100;
	} else if (type == 2){
		difference = 25;
	} else {
		difference = 3;
	}

	// Checks each object in things if they are colliding with the object on
	// x and y
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
	// No objects are colliding with things.
	return false;
}

/*
 * Provided with the user's click location, check if the user clicked on the
 * pause button. Return true if click, false otherwise.
 */
function checkPause(x, y) {
	// Pause button location.
	var xRight = 870;
	var xLeft = 770;
	var yTop = 5;
	var yBot = 35;

	// Checks is pause button is clicked.
	if (xRight < x || xLeft > x || yTop > y || yBot < y) {
		return false;
	} else {
		return true;
	}
}

/*
 * Checks if object at x, y are colliding with any blackholes.
 * Return the blackhole if collision occurs, null if no collision.
 */
function checkInHorizon(x, y) {
	var difference = 100;
	var xRight;
	var xLeft;
	var yTop;
	var yBottom;

	// Checking for all blackholes if they collide with x, y.
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
	// No objects are in collision path.
	return null;
}

/*
 * Randomly generate directions for the space objects.
 */
function getDirection() {
	var direction = directions[Math.floor(Math.random() * 4)];
	return direction;
}

/*
 * Inserting ten space objects into random places.
 */
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

/*
 * Assigning the objects in spaceThings an "look"
 */
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

/*
 * Caculates the pull directions given the blackholes location and the
 * space object's location.
 */
function calculatePullDirection(x, y, targetX, targetY, t) {
	var vector = new Direction();
	var xdirect;
	var ydirect;
	vector.x  = (targetX - x) / t;
	vector.y = (targetY - y) / t;
	return vector;
}

/*
 * Main function for drawing and erasing objects on the canvas.
 */
function moveSpaceThings() {
	if (!pause && !over) {
		// Clear the canvas.
		ctx.clearRect(0, 0, 1000, 640);
		// Draw the remaining objects that are not sucked in by the 
		// blackhole.
		drawSpaceThings();
		// Draw the blackholes.
		drawBlackHoles();
		// Draw the info bar.
		infoBar();
		// Checks if the game is over;
		gameOver();

		// Generate a move direction for the space objects if they are not
		// being pulled by a black hole.
		for (item in spaceThings) {
			var object = spaceThings[item];
			if (object.pull == null) {
				while ((object.x + object.direction.x) <= 25 || 
					(object.x + object.direction.x) >= 975 || 
					(object.y + object.direction.y) <= 65 || 
					(object.y + object.direction.y) >= 615) {
					object.direction = getDirection();
				} 
				
				// Checks if an object is crossing the event horizon.
				object.pull = checkInHorizon(object.x, object.y);
				if (object.pull != null) {
					object.pull.pulling.push(object);
				}

			} else {
				var directionX;
				var directiony;

				// If the object is being pull by the black hole,
				// generate the pull direction and speed for the object.
				if (object.pulling == false) {
					switch (object.pull.type) {
						// Speed is slow for blue black holes.
						case 0: 
							object.direction = calculatePullDirection(
								object.x, object.y, 
								object.pull.x, object.pull.y, 50);
							break;
						// Speed is moderate for purple black holes.
						case 1:
							object.direction = calculatePullDirection(
								object.x, object.y, 
								object.pull.x, object.pull.y, 30);
							break;
						// Speed is fast for black black holes.
						case 2:
							object.direction = calculatePullDirection(
								object.x, object.y, 
								object.pull.x, object.pull.y, 15);
							break;
					}
					object.pulling = true;
				}
			}
			// Change the object's position in the direction of the pull.
			object.x += object.direction.x;
			object.y += object.direction.y;
		}
		// Checks if an object is at the center of a black hole. Disappears
		// if it is at the center.
		eventHorizon();
	}

	// If the game is in an transition phase.
	if (!over && timeLeft == 0) {
		if (level == 1) {
			// Change the directions if an object was being pulled by a black
			// hole right before the game stopped.
			for (item in spaceThings) {
				spaceThings[item].pull = null;
				spaceThings[item].pulling = false;
			}
			// Display the next info page.
			levelOverview();
			level += 1;
		} else {
			levelOverview();
		}
		// Ends this function.
		return null;

	// If the game is over, shows the finish info page and ends the function.
	} else if (over) {
		levelOverview();
		return null;
	}
	setTimeout(moveSpaceThings, 33);
}

/*
 * Updates the highscore of the game.
 */
function setHighscore(score) {
	var temp;
	if (score > localStorage.highScore1) {
		temp = localStorage.highScore1;
		localStorage.highScore3 = localStorage.highScore2;
		localStorage.highScore2 = temp;
		localStorage.highScore1 = score;
		return null;
	} else if (score > localStorage.highScore2) {
		localStorage.highScore3 = localStorage.highScore2;
		localStorage.highScore2 = score;
		return null;
	} else if (score > localStorage.highScore3) {
		localStorage.highScore3 = score;
		return null;
	}

}

/*
 * Display and modify the highscore info on the html.
 */
function displayHighscore() {
	document.getElementById("highscore1").innerHTML = localStorage.highScore1;
	document.getElementById("highscore2").innerHTML = localStorage.highScore2;
	document.getElementById("highscore3").innerHTML = localStorage.highScore3;
}

/*
 * Hides the canvas and displays the next level info page with buttons.
 */
function levelOverview() {
	// Modify the level and the score.
	document.getElementById("level").innerHTML = "Level " + level;
	document.getElementById("score").innerHTML = "Your Score: " + score;
	// Hides canvas.
	var canvas = document.getElementById("main");
	canvas.style.display = 'none';
	// Displays the next level transition page.
	var next = document.getElementById("next");
	next.style.display = 'block';
	// Display the credit for the SVG images.
	var credit = document.getElementById("credit");
	credit.style.display = 'initial';
	var nextLevel = document.getElementById("nextLevel");
	var finish = document.getElementById("finish");

	// Hides finish button if it is level 1 and game is not over.
	if (level == 1 && !over) {
		nextLevel.style.display = 'initial';
		finish.style.display = 'none';
	// Else, hides the next button.
	} else {
		nextLevel.style.display = 'none';
		finish.style.display = 'initial';
		setHighscore(score);
		displayHighscore();
	}
	// Clear the intervals for counting time and inserting blackholes.
	clearInterval(countTime);
	clearInterval(insertSpeed);
}

/*
 * Initializes level 2 with 60 secs and no blackholes.
 */
function initLevel() {
	// Hides the next level transition pages and shows canvas.
	var canvas = document.getElementById("main");
	canvas.style.display = 'initial';
	var next = document.getElementById("next");
	next.style.display = 'none';
	// Hides the credit.
	var credit = document.getElementById("credit");
	credit.style.display = 'none';
	// Initializes the blackholes and time.
	blackHoles = [];
	timeLeft = 60;
	// Clear the previous blackholes and time intervals.
	clearInterval(countTime);
	clearInterval(insertSpeed);
	// Starts the game.
	startGame();
}

/*
 * Goes back to the starting page if the game ended, and finish button clicked.
 */
function restart() {
	displayHighscore();
	var next = document.getElementById("next");
	next.style.display = 'none';
	var start = document.getElementById("start");
	start.style.display = 'block';
}

/*
 * Insert a black hole into a random position but not on top of each other.
 */
function insertBlackHoles() {
	if (!pause && !over) {
		do {
			var x = Math.floor(Math.random() * 950) + 25;
			var y = Math.floor(Math.random() * 535) + 65;
		} 
		while (checkCollision(blackHoles, x, y, 1) && blackHoles.length < 20);

		var type = Math.floor(Math.random() * 15);
		// Setting the probability of getting each types of blackholes.
		if (blackHoles.length < 20) {
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

/*
 * Draw black holes based on their types: blue, purple, black.
 */
function drawBlackHoles() {
	for (item in blackHoles) {
		switch(blackHoles[item].type) {
			case 0:
				ctx.drawImage(blackHoleBlue, blackHoles[item].x-25, 
					blackHoles[item].y-25, 50, 50);
				break;
			case 1:
				ctx.drawImage(blackHolePurple, blackHoles[item].x-25, 
					blackHoles[item].y-25, 50, 50);
				break;
			case 2:
				ctx.drawImage(blackHoleBlack, blackHoles[item].x-25, 
					blackHoles[item].y-25, 50, 50);
				break;
		}
		
	}
}

/*
 * Checks if an objects is at the center of a black hole, remove the object 
 * from the game if so.
 */
function eventHorizon() {
	for (var i = 0; i < spaceThings.length; i++) {
		// Check if any objects are at the center of the black hole
		var collision = checkCollision(blackHoles, 
			spaceThings[i].x, spaceThings[i].y, 3);

		if (collision) {
			for (var j = 0; j < blackHoles.length; j++) {
				var blackHole = [];
				blackHole.push(blackHoles[j]);
				if (checkCollision(blackHole, 
					spaceThings[i].x, spaceThings[i].y, 3)) {
					blackHoles[j].pulledItems += 1;

					// Checks if a black hole ate too much,
					// base on its type, remove the object if it eats too much
					if (blackHoles[j].type == 0 && 
						blackHoles[j].pulledItems == 3) {
						for (item in blackHoles[j].pulling) {
							blackHoles[j].pulling[item].pull = null;
							blackHoles[j].pulling[item].pulling = false;
						}
						blackHoles.splice(j, 1);
					} else if (blackHoles[j].type == 1 && 
						blackHoles[j].pulledItems == 2) {
						for (item in blackHoles[j].pulling) {
							blackHoles[j].pulling[item].pull = null;
							blackHoles[j].pulling[item].pulling = false;
						}
						blackHoles.splice(j, 1);
					} else if (blackHoles[j].type == 2 && 
						blackHoles[j].pulledItems == 1) {
						for (item in blackHoles[j].pulling) {
							blackHoles[j].pulling[item].pull = null;
							blackHoles[j].pulling[item].pulling = false;
						}
						blackHoles.splice(j, 1);
					}
				}
			}
			// Remove the object at the center of the black hole.
			spaceThings.splice(i, 1);
			// Decrease the score by 50.
			score -= 50;
		}
	}
}
/*
 * Starts the game by starting the time countdown and start inserting
 * blackholes.
 */
function startGame() {

	if (level == 1) {
		insertSpaceThings();
		// Interval for inserting blackholes in level 1.
		window.insertSpeed = setInterval(insertBlackHoles, 1500);
	}
	// Time counter.
	window.countTime = setInterval(countDown, 1000);
	
	if (level == 2) {
		// Interval for inserting blackholes in level 2.
		window.insertSpeed = setInterval(insertBlackHoles, 750);
	}
	// Starts moving things on the canvas.
	moveSpaceThings();
}

// Class for space object.
function SpaceThing(x, y, type) {
	this.x = x;
	this.y = y;
	this.direction = getDirection();
	this.pull = null;
	this.type = type;
	this.pulling = false;
}

// Class for a black hole.
function BlackHole(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.pulling = [];
	this.pulledItems = 0;
}

// Class for a direction.
function Direction(x, y) {
	this.x = x;
	this.y = y;
}

// Draw functions for each various canvas object.

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
	// ctx.stnroke();

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