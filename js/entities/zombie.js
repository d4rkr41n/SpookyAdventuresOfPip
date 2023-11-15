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
  }

  update(audio) {
    let floor = this.map.floor(this.x, this.y, this.width, this.height);

    //direction = Math.floor(Math.random() * 2)?-1:1;

    //if(this.x > this.game.width-10) {
    if(this.x < 50 || this.x > 150) {
      this.direction = this.direction * -1;
    }

    this.speedX = this.direction * this.speed;
    this.x += this.speedX;

    // Recalc the floor
    floor = this.map.floor(this.x, this.y, this.width, this.height);

    // Gravity
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
    let img = document.getElementById(`left_zombie`);
    if(this.speedX < 0) {
      img = document.getElementById(`left_zombie`);
    } else {
      img = document.getElementById(`right_zombie`);
    }
    ctx.drawImage(img, this.x, this.y, this.width, this.height);

    if(hitboxes) {
      // T R B L
      // 0 1 2 3
      ctx.globalAlpha = 0.4;
      //let hitbox = this.hitbox();

      ctx.fillStyle = 'green';
      //ctx.fillRect(hitbox[3], hitbox[0], hitbox[1]-this.x, hitbox[2]-this.y);
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    ctx.globalAlpha = 1;

  }

  /*hitbox() {
    let paddingTop = (this.height * 0.05);
    let paddingBottom = (0) - paddingTop;
    let paddingLeft = (this.width * 0.20);
    let paddingRight = (0) - paddingLeft*2;

    let top = this.y + paddingTop;
    let right = this.x + this.width + paddingRight;
    let bottom = this.y + this.height + paddingBottom;
    let left = this.x + paddingLeft;
    return [top, right, bottom, left];
  }*/
}
