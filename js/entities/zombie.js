import Entity from './entity.js';
export class Zombie {
  constructor(game, map, x, y) {
    this.game = game;
    this.map = map;
    this.hearts = 3;
    this.speed = 1;
    this.direction = 1;
    this.width = 30;
    this.height = 30;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.hitbox = Entity.hitbox;
    this.padding = function(w, h) {
      return {t:1, b:0, l:6, r:6};
    };
  }

  update(audio) {
    let h = this.hitbox(this);
    let width = h.r-h.l;
    let height = h.b-h.t;
    let padding = this.padding(this.width, this.height);
    let floor = this.map.floor(h.l, h.t, width, height);
    let ceiling = this.map.ceiling(h.l, h.t, width, height);

    let frameRand = Math.floor(Math.random() * 5) + 40;
    if(this.game.frame % frameRand == 0) {
      this.direction = Math.floor(Math.random() * 2)?-1:1;
    }

    //if(this.x > this.game.width-10) {
    if(this.x < 50) {
      this.direction = 1;
    } else if(this.x > game.width - 50 - this.width) {
      this.direction = -1;
    }

    this.speedX = this.direction * this.speed;
    this.x += this.speedX;

    // Recalc the floor
    h = this.hitbox(this);
    width = h.r-h.l;
    height = h.b-h.t;
    padding = this.padding(this.width, this.height);
    floor = this.map.floor(h.l, h.t, width, height);
    ceiling = this.map.ceiling(h.l, h.t, width, height);

    // Gravity
    this.speedY += this.map.gravity;

    // if skipping the platform when falling, set to platform
    if(h.b > floor || h.b+this.speedY >= floor) {
      // Land on platforms
      this.y = floor - this.height + padding.b;
      this.speedY = 0;
    } else if(h.t < ceiling || h.t+this.speedY <= ceiling) {
      // Hit your head on platforms
      this.y = ceiling - padding.t;
      this.speedY = 0;
    } else {
      this.y += this.speedY;
    }
  }

  draw(ctx, hitboxes) {
    let img = document.getElementById(`left_zombie`);
    if(this.speedX < 0) {
      img = document.getElementById(`left_zombie`);
    } else {
      img = document.getElementById(`right_zombie`);
    }
    ctx.drawImage(img, this.x, this.y, this.width, this.height);

    // Draw Health Bar
    let healthPadding = 5;
    let healthHeight = 2;
    let healthWidth = this.width/2;
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x + healthWidth/2, this.y-healthPadding, healthWidth, healthHeight);
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x+healthWidth/2, this.y-healthPadding, (this.hearts/3*healthWidth), healthHeight);

    if(hitboxes) {
      let hitbox = this.hitbox(this);
      let padding = this.padding(this.width, this.height);
      ctx.fillStyle = 'red';
      ctx.globalAlpha = 0.4;
      ctx.fillRect(hitbox.l, hitbox.t, hitbox.r-this.x-padding.l, hitbox.b-this.y-padding.t);
    }
    ctx.globalAlpha = 1;
  }
}
