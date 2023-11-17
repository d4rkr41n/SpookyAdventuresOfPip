import Entity from './entity.js';
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
    this.hitbox = Entity.hitbox;
    this.padding = function(w, h) {
      return {t:h/3, b:0, l:1, r:1};
    };
  }

  update(input, audio) {

    // TODO: Make ceiling and floor based on hitbox
    //let h = this.hitbox;
    //let width = h.r-h.l;
    //let height = h.b-h.t;

    //let floor = this.map.floor(h.l, h.t, width, height);
    //let ceiling = this.map.ceiling(h.l, h.t, h.r-h.l, h.b-h.t);
    let floor = this.map.floor(this.x, this.y, this.width, this.height);
    let ceiling = this.map.ceiling(this.x, this.y, this.width, this.height);

    // Left / Right
    if(input.includes('ArrowRight') && this.speedX < this.speed) {
      this.speedX += 1;
    } else if(input.includes('ArrowLeft') && this.speedX > -this.speed) {
      this.speedX -= 1;
    } else if(this.speedX < 0) {
      this.speedX += 1;
    } else if(this.speedX > 0) {
      this.speedX -= 1;
    } else {
      this.speedX = 0;
    }

    // Jump
    if(input.includes('ArrowUp') && this.y+this.height == floor && this.speedY == 0) {
      this.speedY = -this.speed*2;
      audio.play("pip_jump");
    }

    // Down
    if(input.includes('ArrowDown')) {
      if(this.y+this.height < floor) {
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
    if(this.y+this.height <= floor && this.y+this.height+this.speedY >= floor) {
      // Land on platforms
      this.y = floor-this.height;
      this.speedY = 0;
    } else if(this.y >= ceiling && this.y+this.speedY <= ceiling) {
      // Hit your head on platforms
      this.y = ceiling;
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
      let hitbox = this.hitbox(this);
      let padding = this.padding(this.width, this.height);
      ctx.fillStyle = 'blue';
      ctx.globalAlpha = 0.4;
      ctx.fillRect(hitbox.l, hitbox.t, hitbox.r-this.x-padding.l, hitbox.b-this.y-padding.t);

      // Draw Floor Marker
      let floor = this.map.floor(this.x, this.y, this.width, this.height);
      ctx.fillStyle = 'yellow';
      ctx.fillRect(this.x, floor, this.width, 10);

      // Draw Ceiling Marker
      let ceiling = this.map.ceiling(this.x, this.y, this.width, this.height);
      ctx.fillRect(this.x, ceiling, this.width, 10);
    }
    ctx.globalAlpha = 1;
  }
}
