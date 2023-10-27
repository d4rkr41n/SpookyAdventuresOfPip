var myObstacles = [];
var enemies = [];
var myScore;
var ghost;
var pip;

var canvasWidth = 480;
var canvasHeight = 270;
var pWidth = 30;
var pHeight = 30;

var ghostS = 20;

function startGame() {
    pip = new player(pWidth, pHeight, 0 + pWidth*2, canvasHeight - pHeight);
    ghost = new enemy(ghostS, ghostS, 50, 50, pip, "ghost");
    //enemies.push( new enemy(ghostS, ghostS, 50, 50, pip, "ghost") );
    //enemies.push( new enemy(ghostS, ghostS, 50, 50, enemies[0], "ghost") );
    //enemies.push( new enemy(ghostS, ghostS, 50, 50, enemies[1], "ghost") );
    //enemies.push( new enemy(ghostS, ghostS, 50, 50, enemies[2], "ghost") );
    //enemies.push( new enemy(ghostS, ghostS, 50, 50, enemies[3], "ghost") );
    pip.gravity = 1;

    overlay = new interface(pip);

    // Add sound effects and music
    jump = new sound("sfx/pip_jump.wav");
    hurt = new sound("sfx/pip_hurt.wav");
    heal = new sound("sfx/pip_heal.wav");
    duck = new sound("sfx/pip_duck.wav");
    squeak = new sound("sfx/ghost_squeak.wav");

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
  this.strength = 12;
  this.ducking = false;
  this.score = 0;
  this.width = width;
  this.height = height;
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

  this.move = function() {

    var bottom = game.canvas.height - this.height;

    // Jump
    if (game.keys && game.keys[38]) {
      if(pip.y >= bottom) {
        this.speedY = -this.strength;
        jump.play();
      }
    }

    // Duck
    if (game.keys && game.keys[40] || this.ducking) {
      if(pip.y < bottom) {
        pip.speedY = this.strength;
      } else {
        if (pip.height != pHeight / 2) {
          duck.play();
        }
        // Ducking position
        pip.height = pHeight / 2;
        pip.y += pHeight / 2;
      }
    } else {
      pip.height = pHeight;
      pip.ducking = false;
    }

    // Right
    if (game.keys && game.keys[39]) {
      pip.speedX = this.strength / 2;
    } else {
      // Slow Down
      if(pip.speedX > 0) {
        pip.speedX -= this.strength/8;
      }
    }

    // Left
    if (game.keys && game.keys[37]) {
      pip.speedX = 0 - this.strength / 2;
    } else {
      // Slow Down
      if(pip.speedX < 0) {
        pip.speedX += this.strength/8;
      }
    }
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
  this.hurt = function() {
    // Detect if ya hit sometin
    this.hearts -= 1;
    hurt.play();
  }
  this.heal = function() {
    // Detect if ya hit sometin
    if(this.hearts < 3) {
      this.hearts += 1;
      heal.play();
    }
  }
}

function enemy(width, height, x, y, target, type) {
  this.hearts = 3;
  this.strength = 4;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.target = target;
  this.type = type;
  this.hiding = false;
  this.gravity = 0;

  this.update = function() {
    ctx = game.context;

    // Control the transition point between animations
    let animateDist = .5;

    let img = document.getElementById(`${this.type}`);
    if(this.speedY > animateDist && (this.speedX > -animateDist && this.speedX < animateDist)) {
      img = document.getElementById(`down_${this.type}`);
    }else if(this.speedY < -animateDist && (this.speedX > -animateDist && this.speedX < animateDist)) {
      img = document.getElementById(`up_${this.type}`);
    }else if(this.speedX < -animateDist) {
      img = document.getElementById(`left_${this.type}`);
    } else if (this.speedX > animateDist) {
      img = document.getElementById(`right_${this.type}`);
    }
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }

  this.move = function() {
    //var distX = this.speedX = (pip.x - this.x)
    //var distY = this.speedY = (pip.y - this.y)

    // move at a percentage of strength based on distance
     //this.speedX = ((distX) / 100) * this.strength;
     //this.speedY = ((distY) / 100) * this.strength;

    // if the ghost is hiding, only move after player gets a certain distance away
    var distance = Math.sqrt(Math.pow(this.x - this.target.x, 2) + Math.pow(this.y - this.target.y, 2));
    console.log(distance);

    if(distance < 1) {
      this.hiding = true;
      return;
    } else if(distance > 100 && this.hiding) {
      this.hiding = false;
      squeak.play();
    }

    if(this.hiding) {
      this.speedX = 0;
      this.speedY = 0;
    } else {
      // Determine where the player will be and move there instead
      var distX = this.speedX = this.target.x + (this.target.speedX / 100 * this.target.strength) - this.x;
      var distY = this.speedY = this.target.y + (this.target.speedY / 100 * this.target.strength) - this.y;

      this.speedX = ((distX) / 100) * this.strength;
      this.speedY = ((distY) / 100) * this.strength;
    }
  }

  this.newPos = function() {
    // Calc Y
    // Add some jiggle
    //var jiggle = Math.floor(Math.random() * 2)/2;
    //var sign = Math.floor(Math.random() * 2)?1:-1;

    //this.speedY += sign*jiggle;
    this.y += this.speedY;

    // Calc X
    this.x += this.speedX;
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

    this.hearts = pip.hearts;

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

  for(var i = enemies.length-1;i>=0;i--){
    enemies[i].move();
    enemies[i].newPos();
    enemies[i].update();
  }

  ghost.move();
  ghost.newPos();

  pip.move();
  pip.newPos();

  ghost.update();
  pip.update();
  overlay.update();
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