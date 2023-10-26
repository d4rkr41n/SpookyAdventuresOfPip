var pip;
var myObstacles = [];
var myScore;

// Define Global Sounds
var theme;
var jump;

var canvasWidth = 480;
var canvasHeight = 270;
var pWidth = 50;
var pHeight = 50;

function startGame() {
    pip = new player(pWidth, pHeight, 0 + pWidth*2, canvasHeight - pHeight);
    pip.gravity = 1;

    overlay = new interface(pip);

    // Add sound effects and music
    jump = new sound("sfx/pip_jump.wav");
    hurt = new sound("sfx/pip_hurt.wav");
    duck = new sound("sfx/pip_duck.wav");
    //theme = new sound("sfx/theme.wav");
    //theme.play();

    game.start();
}

var game = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.getElementById("game").insertBefore(this.canvas, document.getElementById("game").childNodes[0]);

        this.frameNo = 0;
        this.interval = setInterval(updateGame, 20);

        window.addEventListener('keydown', function (e) {
          game.keys = (game.keys || []);
          game.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
          game.keys[e.keyCode] = false;
        })
    },
    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function player(width, height, x, y) {
  this.hearts = 3;
  this.score = 0;
  this.width = width;
  this.height = height;
  this.strength = 16;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.gravity = 0;

  this.update = function() {
    ctx = game.context;

    let img = document.getElementById("player");
    if(this.speedY >= -(this.strength/2) && this.speedY < 0) {
      img = document.getElementById("up_player");
    }else if(this.speedY <= this.strength && this.speedY > (this.strength/2)) {
      img = document.getElementById("down_player");
    }else if(this.speedX < 0) {
      img = document.getElementById("left_player");
    } else if (this.speedX > 0) {
      img = document.getElementById("right_player");
    }
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }

  this.newPos = function() {
    // Calc Y
    this.speedY += this.gravity;
    this.y += this.speedY;
    this.hitBottom();

    // Calc X
    this.x += this.speedX;
  }
  this.hitBottom = function() {
    var bottom = game.canvas.height - this.height;
    if(this.y > bottom){
      this.y = bottom;
      this.speedY = 0;
    }
  }
}

function interface(pip) {
  this.hearts = pip.hearts;
  this.width = 30;
  this.height = 30;
  this.padding = 5;
  this.x = canvasWidth;
  this.y = 0;

  this.update = function() {
    ctx = game.context;
    let img = document.getElementById("heart");

    for(var i = 1;i<=this.hearts;i++){
      let offset = i*(this.padding+this.width);
      ctx.drawImage(img, this.x - offset, this.y+this.padding, this.width, this.height);
    }
  }
}

function updateGame() {
  game.clear();
  game.frameNo += 1;

  //if (game.keys && game.keys[37]) {pip.speedX = -10; }
  //if (game.keys && game.keys[39]) {pip.speedX = 10; }

  var bottom = game.canvas.height - pip.height;
  var strength = 16; // Must be even number

  // Jump
  if (game.keys && game.keys[38]) {
    if(pip.y >= bottom) {
      pip.speedY = -strength;
      jump.play();
    }
  }
  // Duck
  if (game.keys && game.keys[40]) {
    if(pip.y < bottom) {
      pip.speedY = strength;
    } else {
      if (pip.height != pHeight / 2) {
        duck.play();
      }
      // Ducking position
      pip.height = pHeight / 2;
      pip.y += pHeight / 2;
    }
  } else {
    // Exit Ducking Position
    pip.height = pHeight;
  }

  // Right
  if (game.keys && game.keys[39]) {
    pip.speedX = strength / 2;
  } else {
    // Slow Down
    if(pip.speedX > 0) {
      pip.speedX -= strength/8;
    }
  }

  // Left
  if (game.keys && game.keys[37]) {
    pip.speedX = 0 - strength / 2;
  } else {
    // Slow Down
    if(pip.speedX < 0) {
      pip.speedX += strength/8;
    }
  }

  pip.newPos();
  // Update his pos to calc damage before his position
  overlay.update();
  pip.update();
}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}