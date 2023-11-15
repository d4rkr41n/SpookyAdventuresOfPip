export class Player {
  constructor(game, map, x, y) {
    this.game = game;
    this.map = map;
    this.hearts = 3;
    this.speed = 6;
    this.width = 30;
    this.height = 30;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
  }

  update(input, audio) {

    let floor = this.map.floor(this.x, this.y, this.width, this.height);

    // Left / Right
    if(input.includes('ArrowRight') && this.speedX < this.speed) {
      this.speedX += 1;
    } else if(input.includes('ArrowLeft') && this.speedX > -this.speed) {
      this.speedX -= 1;
    } else if(this.speedX < 0) {
      this.speedX += 1;
    } else if(this.speedX > 0) {
      this.speedX -= 1;
    }

    // Jump
    if(input.includes('ArrowUp') && this.y == floor) {
      this.speedY = -this.speed*2;
      audio.play("pip_jump");
    }

    // Down
    if(input.includes('ArrowDown')) {
      if(this.y < floor) {
        // Speed Fall
        this.speedY += 1;
      } else {
        if(this.height != 15) {
          this.y += 15;
          audio.play("pip_duck");
        }
        this.height = 15;
      }
    } else {
      if(this.height == 15) {
        this.y -= 15;
      }
      this.height = 30;
    }

    // Apply final movement Calculations
    this.x += this.speedX;

    // Recalc the floor
    floor = this.map.floor(this.x, this.y, this.width, this.height);

    // Apply Gravity
    this.speedY += this.map.gravity;

    // if skipping the platform when falling, set to platform
    if(this.y <= floor && this.y+this.speedY >= floor) {
      this.y = floor;
      this.speedY = 0;
    } else {
      this.y += this.speedY;
    }
  }

  draw(ctx, hitboxes) {
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
    /*if(this.iframes > 0) {
      if(game.frameNo % 5) {
        ctx.globalAlpha = 0.4;
      }
      this.iframes -= 1;
    }*/
    ctx.drawImage(img, this.x, this.y, this.width, this.height);

    if(hitboxes) {
      // T R B L
      // 0 1 2 3
      let hitbox = this.hitbox();
      ctx.fillStyle = 'blue';
      ctx.globalAlpha = 0.4;

      //ctx.fillRect(hitbox[3], hitbox[0], hitbox[1]-this.x, hitbox[2]-this.y);
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    ctx.globalAlpha = 1;
  }

  hitbox() {
  }
}
