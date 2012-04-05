window.requestAnimationFrame = (function () {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

var ctx;
var spiral = {
	r: 300,
	spirals: 20,
	period: 1000,
	progress: 0,
	dr: 0,
	x: 300,
	y: 300
};
var time = Date.now();
var pi2 = Math.PI * 2;
var oldx = 300, oldy = 300;

function init() {
	ctx = document.getElementById('paper').getContext('2d');
}

function step(time, delta) {
	var sr = spiral.r / spiral.spirals;
	var rev = spiral.progress / spiral.period;
	var dr = sr * rev;
	var x = dr * Math.sin(pi2 * rev) + spiral.x;
	var y = dr * Math.cos(pi2 * rev) + spiral.y;
	spiral.progress += delta;
	
	ctx.beginPath();
	ctx.moveTo(oldx, oldy);
    ctx.lineTo(oldx = x, oldy = y);
    ctx.stroke();
    console.log(x,y,spiral.progress);
}

function loopsy() {
	var delta = Date.now() - time;
    time = time + delta;
    step(time, delta);
    window.requestAnimationFrame(loopsy);
}

window.onload = function () {
	init();
	loopsy();
};