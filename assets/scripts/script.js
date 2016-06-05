function loadCanvas() {
	var canvas = document.createElement('canvas');
	canvas.id = 'main';
	canvas.width = '1000';
	canvas.height = '640';

    document.getElementById('start-page').appendChild(canvas);

}

// window.onload = function() {
    
//     var c = document.getElementById("main");
//     window.ctx = c.getContext("2d"); // Dealing with a global context is easier
    
//     // draw();
    
//     // animate();
//     start();
    
// }



// var shapes = new Array();
// var Shape = function (x, y) {
//     this.x = x;
//     this.y = y;
// }


// function start() {
// 	window.ctx.clearRect(0, 0, 1000, 640);
// 	shapes.push (new Shape(300, 200));


// }