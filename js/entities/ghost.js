export class Ghost {
  constructor(game, map, x, y, target) {
    this.game = game;
    this.map = map;
    this.speed = 2;
    this.width = 20;
    this.height = 20;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.target = target;
    this.hiding = false;
    this.scared = 0;
  }
  update(audio) {
    // This is in case the ghost is tracking a single point instead of another entity
    if(this.target.speedX === undefined) {
      this.target.speedX = 0;
    } if(this.target.speedY === undefined) {
      this.target.speedY = 0;
    } if(this.target.speed === undefined) {
      this.target.speed = 0;
    }

    // if the ghost is hiding, only move after player gets a certain distance away
    let distance = Math.sqrt(Math.pow(this.x - this.target.x, 2) + Math.pow(this.y - this.target.y, 2));

    if(distance < 2) {
      this.hiding = true;
      return;
    } else if(distance > 100 && this.hiding) {
      this.hiding = false;
      this.scared = 20;
      audio.play("ghost_squeak");
    }

    if(this.hiding) {
      this.speedX = 0;
      this.speedY = 0;
    } else {
      // Determine where the player will be and move there instead
      let distX = this.speedX = this.target.x + (this.target.speedX / 100 * this.target.speed) - this.x;
      let distY = this.speedY = this.target.y + (this.target.speedY / 100 * this.target.speed) - this.y;

      this.speedX = ((distX) / 100) * this.speed;
      this.speedY = ((distY) / 100) * this.speed;
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw(ctx, hitboxes) {
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
}
