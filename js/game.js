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

var drawHitboxes = true;

function startGame() {
    pip = new player(pWidth, pHeight, 0 + pWidth*2, canvasHeight - pHeight-30);
    ghost = new fairy(ghostS, ghostS, 50, 50, pip);
    enemies.push( new zombie(30, 30, 100, 100) );
    //enemies.push( new enemy(ghostS, ghostS, 50, 50, pip, "ghost") );
    //enemies.push( new enemy(ghostS, ghostS, 50, 50, enemies[0], "ghost") );
    //enemies.push( new enemy(ghostS, ghostS, 50, 50, enemies[1], "ghost") );
    //enemies.push( new enemy(ghostS, ghostS, 50, 50, enemies[2], "ghost") );
    //enemies.push( new enemy(ghostS, ghostS, 50, 50, enemies[3], "ghost") );

    overlay = new interface(pip);

    // Add sound effects and music
    jump = new sound("sfx/pip_jump.wav");
    hurt = new sound("sfx/pip_hurt.wav");
    heal = new sound("sfx/pip_heal.wav");
    duck = new sound("sfx/pip_duck.wav");
    squeak = new sound("sfx/ghost_squeak.wav");
    death = new sound("sfx/death.wav");

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

        this.keydown = function (e) {
          game.keys = (game.keys || []);
          game.keys[e.keyCode] = true;
        };
        this.keyup = function (e) {
          game.keys[e.keyCode] = false;
        };
        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);
    },
    end : function() {
      //this.clear();
      window.clearInterval(this.interval);
      death.play();

      let deathMessage = "YOU DIED";
      ctx.font = "24px serif";
      ctx.textAlign = "center";

      ctx.fillStyle = 'black';
      let padding = 20;
      let width = ctx.measureText(deathMessage).width+padding*2;
      let height = ctx.measureText(deathMessage).height;
      ctx.fillRect(game.canvas.width/2-width/2, game.canvas.height/2-(24+padding/2), width, parseInt(ctx.font, padding));

      ctx.fillStyle = "orange";
      ctx.fillText(deathMessage, this.canvas.width/2, this.canvas.height/2);
    },
    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function player(width, height, x, y) {
  this.hearts = 3;
  this.speed = 12;
  this.iframes = 80;
  this.ducking = false;
  this.score = 0;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.gravity = 1;

  this.update = function() {
    ctx = game.context;

    let img = document.getElementById("player");
    if(this.speedY >= -(this.speed/2) && this.speedY < 0) {
      img = document.getElementById("up_player");
    }else if(this.speedY <= this.speed && this.speedY > (this.speed/2)) {
      img = document.getElementById("down_player");
    }else if(this.speedX < 0) {
      img = document.getElementById("left_player");
    } else if (this.speedX > 0) {
      img = document.getElementById("right_player");
    }
    // Check if taking damage
    // Decay iframes
    if(this.iframes > 0) {
      if(game.frameNo % 5) {
        ctx.globalAlpha = 0.4;
      }
      this.iframes -= 1;
    }

    if(drawHitboxes) {
      // T R B L
      // 0 1 2 3
      let hitbox = this.hitbox();
      ctx.fillStyle = 'blue';
      ctx.fillRect(hitbox[3], hitbox[0], hitbox[1]-this.x, hitbox[2]-this.y);
    }

    ctx.drawImage(img, this.x, this.y, this.width, this.height);
    ctx.globalAlpha = 1;
  }

  this.move = function() {

    var bottom = game.canvas.height - this.height;

    // Jump
    if (game.keys && game.keys[38]) {
      if(pip.y >= bottom) {
        this.speedY = -this.speed;
        jump.play();
      }
    }

    // Duck
    if (game.keys && game.keys[40] || this.ducking) {
      if(pip.y < bottom) {
        pip.speedY = this.speed;
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
      pip.speedX = this.speed / 2;
    } else {
      // Slow Down
      if(pip.speedX > 0) {
        pip.speedX -= this.speed/8;
      }
    }

    // Left
    if (game.keys && game.keys[37]) {
      pip.speedX = 0 - this.speed / 2;
    } else {
      // Slow Down
      if(pip.speedX < 0) {
        pip.speedX += this.speed/8;
      }
    }
  }

  this.hitbox = function() {
    let paddingTop = (this.height * 0.45);
    let paddingBottom = (0) - paddingTop;
    let paddingLeft = (this.width * 0.00);
    let paddingRight = (0) - paddingLeft*2;

    let top = this.y + paddingTop;
    let right = this.x + this.width + paddingRight;
    let bottom = this.y + this.height + paddingBottom;
    let left = this.x + paddingLeft;
    return [top, right, bottom, left];
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
    // Do the hurt player things
    // Check if immune
    if(this.iframes > 0) {
      return;
    }
    this.iframes = 40;
    if(this.hearts > 0) {
      this.hearts -= 1;
      hurt.play();
      return;
    }
    game.end();
  }
  this.heal = function() {
    // Detect if ya hit sometin
    if(this.hearts < 3) {
      this.hearts += 1;
      heal.play();
    }
  }
}

function fairy(width, height, x, y, target) {
  this.speed = 4;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.target = target;
  this.hiding = false;
  this.scared = 0;
  this.gravity = 0;

  this.update = function() {
    ctx = game.context;

    // Control the transition point between animations
    let animateDist = .5;

    let img = document.getElementById(`ghost`);
    if(this.speedY > animateDist && (this.speedX > -animateDist && this.speedX < animateDist)) {
      img = document.getElementById(`down_ghost`);
    }else if(this.speedY < -animateDist && (this.speedX > -animateDist && this.speedX < animateDist)) {
      img = document.getElementById(`up_ghost`);
    }else if(this.speedX < -animateDist) {
      img = document.getElementById(`left_ghost`);
    } else if (this.speedX > animateDist) {
      img = document.getElementById(`right_ghost`);
    }
    ctx.drawImage(img, this.x, this.y, this.width, this.height);

    if(this.scared > 0) {
      let img = document.getElementById(`exclaimation`);
      let topCenterX = this.x+this.width/2.5;
      let topCenterY = this.y-this.height/2;
      ctx.drawImage(img, topCenterX, topCenterY, this.width/3, this.height/3);
      this.scared -= 1;
    }
  }

  this.move = function() {
    // if the ghost is hiding, only move after player gets a certain distance away
    var distance = Math.sqrt(Math.pow(this.x - this.target.x, 2) + Math.pow(this.y - this.target.y, 2));

    if(distance < 2) {
      this.hiding = true;
      return;
    } else if(distance > 100 && this.hiding) {
      this.hiding = false;
      this.scared = 20;
      squeak.play();
    }

    if(this.hiding) {
      this.speedX = 0;
      this.speedY = 0;
    } else {
      // Determine where the player will be and move there instead
      var distX = this.speedX = this.target.x + (this.target.speedX / 100 * this.target.speed) - this.x;
      var distY = this.speedY = this.target.y + (this.target.speedY / 100 * this.target.speed) - this.y;

      this.speedX = ((distX) / 100) * this.speed;
      this.speedY = ((distY) / 100) * this.speed;
    }
  }

  this.newPos = function() {
    // Calc Y
    this.y += this.speedY;
    // Calc X
    this.x += this.speedX;
  }
}

function zombie(width, height, x, y) {
  this.hearts = 3;
  this.speed = 1;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.gravity = 1;

  this.update = function() {
    ctx = game.context;

    let img = document.getElementById(`left_zombie`);
    if(this.speedX < 0) {
      img = document.getElementById(`left_zombie`);
    } else {
      img = document.getElementById(`right_zombie`);
    }

    if(drawHitboxes) {
      // T R B L
      // 0 1 2 3
      let hitbox = this.hitbox();

      ctx.fillStyle = 'green';
      ctx.fillRect(hitbox[3], hitbox[0], hitbox[1]-this.x, hitbox[2]-this.y);
    }

    ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }

  this.move = function() {

    let bottom = game.canvas.height - this.height;
    let direction = 0;

    if(game.frameNo % 40 == 1) {
      direction = Math.floor(Math.random() * 2)?-1:1;
    } else if(this.x >= game.canvas.width-10) {
      // Move Move Left
      direction = -1;
    } else if(this.x <= 0+10) {
      // Move Move Right
      direction = 1;
    } else {
      // Ruin the equation to keep the same state
      direction = this.speedX/this.speed;
    }
    this.speedX = direction * this.speed;

    if(this.y < bottom) {
      this.speedY += this.gravity;
    }
    this.hitBottom();

  }

  this.hitBottom = function() {
    var bottom = game.canvas.height - this.height;
    if(this.y > bottom){
      this.y = bottom;
      this.speedY = 0;
    }
  }

  this.hitbox = function() {
    let paddingTop = (this.height * 0.05);
    let paddingBottom = (0) - paddingTop;
    let paddingLeft = (this.width * 0.20);
    let paddingRight = (0) - paddingLeft*2;

    let top = this.y + paddingTop;
    let right = this.x + this.width + paddingRight;
    let bottom = this.y + this.height + paddingBottom;
    let left = this.x + paddingLeft;
    return [top, right, bottom, left];
  }

  this.newPos = function() {
    // Calc X
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

function interface(pip) {
  this.hearts = pip.hearts;
  this.width = 15;
  this.height = 15;
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
    if(collision.collide(pip.hitbox(), enemies[i].hitbox()) || collision.inside(pip.hitbox(), enemies[i].hitbox())) {
      pip.hurt();
    }
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

var collision = {
  collide: function (el1, el2) {
    return !(
      el1[0] > el2[2] ||
      el1[1] < el2[3] ||
      el1[2] < el2[0] ||
      el1[3] > el2[1]
    );
  },

  inside: function (el1, el2) {
    return (
      ((el2[0] <= el1[0]) && (el1[0] <= el2[2])) &&
      ((el2[0] <= el1[2]) && (el1[2] <= el2[2])) &&
      ((el2[3] <= el1[3]) && (el1[3] <= el2[1])) &&
      ((el2[3] <= el1[1]) && (el1[1] <= el2[1]))
    );
  }
};