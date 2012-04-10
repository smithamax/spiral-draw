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

ImageData.prototype.setPix = function (x, y, rgbaArray) {
    this.data[(y * this.width + x) * 4] = rgbaArray[0];
    this.data[(y * this.width + x) * 4 + 1] = rgbaArray[1];
    this.data[(y * this.width + x) * 4 + 2] = rgbaArray[2];
    this.data[(y * this.width + x) * 4 + 3] = rgbaArray[3];
};

ImageData.prototype.getPix = function (x, y) {
    if (x >= this.width || y >= this.height) {
        return null;
    }
    var r = this.data[(y * this.width + x) * 4];
    var g = this.data[(y * this.width + x) * 4 + 1];
    var b = this.data[(y * this.width + x) * 4 + 2];
    var a = this.data[(y * this.width + x) * 4 + 3];
    return [r, g, b, a];
};

var srcData, ctx, img;
var spiral = {
    r: 300,
    spirals: 60,
    period: 300,
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
    img = new Image();
    img.src = 'default.jpeg';
    var src = document.createElement('canvas');
    src.width = 600;
    src.height = 600;
    //document.body.appendChild(src);
    var sctx = src.getContext('2d');
    sctx.drawImage(img, 0, 0);
    srcData = sctx.getImageData(0,0,600,600);

}

function step(time, delta) {
    var sr = spiral.r / spiral.spirals;
    var rev = spiral.progress / spiral.period;
    var dr = sr * rev;
    var x = dr * Math.sin(pi2 * rev) + spiral.x;
    var y = dr * Math.cos(pi2 * rev) + spiral.y;
    var c = dr*pi2 || 1;
    spiral.progress += 100*(delta/c);
    var rgba = srcData.getPix(x | 0, y | 0);
    var brightness;
    if (rgba) {
        brightness = (rgba[0] + rgba[1] + rgba[2])/ (3*255);
    } else {
        brightness = 255;
    }
    ctx.lineWidth = 5 - (4 * brightness);
    ctx.beginPath();
    ctx.moveTo(oldx, oldy);
    ctx.lineTo(oldx = x, oldy = y);
    ctx.stroke();
    //console.log(spiral.progress);
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