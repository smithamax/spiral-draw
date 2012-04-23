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

setPix = function (imagedata, x, y, rgbaArray) {
    imagedata.data[(y * imagedata.width + x) * 4] = rgbaArray[0];
    imagedata.data[(y * imagedata.width + x) * 4 + 1] = rgbaArray[1];
    imagedata.data[(y * imagedata.width + x) * 4 + 2] = rgbaArray[2];
    imagedata.data[(y * imagedata.width + x) * 4 + 3] = rgbaArray[3];
};

getPix = function (imagedata, x, y) {
    if (x >= imagedata.width || y >= imagedata.height) {
        return null;
    }
    var r = imagedata.data[(y * imagedata.width + x) * 4];
    var g = imagedata.data[(y * imagedata.width + x) * 4 + 1];
    var b = imagedata.data[(y * imagedata.width + x) * 4 + 2];
    var a = imagedata.data[(y * imagedata.width + x) * 4 + 3];
    return [r, g, b, a];
};

var paper = document.getElementById('paper');

var img = new Image();

var srcData, ctx, img;
var spiral = {
    density: 10,
    period: 200,
    progress: 200,
    dr: 0,
    x: paper.width/2,
    y: paper.height/2
};
var time = Date.now();
var pi2 = Math.PI * 2;
var oldx = spiral.x, oldy = spiral.y;

var reset = function () {
    ctx.clearRect(0, 0, paper.width, paper.height);
    spiral.progress = 200;
    oldx = spiral.x;
    oldy = spiral.y;
    ctx.moveTo(spiral.x, spiral.y);
};

var setupSrc = function () {
    var src = document.createElement('canvas');
    src.width = paper.width;
    src.height = paper.height;
    //document.body.appendChild(src);
    var sctx = src.getContext('2d');
    var imgx = (paper.width / 2) - (img.width / 2);
    var imgy = (paper.height / 2) - (img.height / 2);
    sctx.drawImage(img, imgx, imgy);
    srcData = sctx.getImageData(0, 0, src.width, src.height);
};

img.onload = function(){
    setupSrc();
    reset();
};

function init() {
    ctx = paper.getContext('2d');
    ctx.lineCap = 'round';
    img.src = 'default.jpeg';
    setupSrc();
    var gui = new dat.GUI();

    gui.add(spiral, 'density').min(5).max(20)
    .onFinishChange(reset);
    gui.add(spiral, 'period').min(150).max(1000)
    .onFinishChange(reset);
}

function step(time, delta) {
    delta = delta < 30 ? delta : 20;
    var sr = spiral.density;
    var rev = spiral.progress / spiral.period;
    var dr = sr * rev;
    var x = dr * Math.sin(pi2 * rev) + spiral.x;
    var y = dr * Math.cos(pi2 * rev) + spiral.y;
    var c = dr*pi2;
    spiral.progress += 100*(delta/c);
    var rgba = getPix(srcData, x | 0, y | 0);
    var brightness;
    if (rgba) {
        brightness = (rgba[0] + rgba[1] + rgba[2])/ (3*255);
    } else {
        brightness = 255;
    }
    ctx.lineWidth = sr - ((sr-1) * brightness);
    ctx.beginPath();
    ctx.moveTo(oldx, oldy);
    ctx.lineTo(oldx = x, oldy = y);
    ctx.stroke();
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

if (typeof window.FileReader === 'undefined') {
    console.log('Not file dragging for the person with the shit browser');
} else {
    paper.ondrop = function (e) {
        e.preventDefault();

        var file = e.dataTransfer.files[0],
            reader = new FileReader();

        reader.onload = function (event) {
            console.log(event.target);
            img.src = event.target.result;
        };
        console.log(file);
        reader.readAsDataURL(file);

        return false;
    };
}