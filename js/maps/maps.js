export class Map {
  constructor(game, mapName) {
    this.game = game;
    this.map = mapName;
    this.gravity = 1;
    // x, y, w, h
    this.platforms = [
      {x: 150, y: 200, w: 100, h: 10},
      {x: 100, y: 220, w: 100, h: 10},
      {x: 0, y: game.height-10, w: game.width, h: 10}
    ]
  }
  draw(ctx) {
    for(var i = 0;i < this.platforms.length;i++) {
      let p = this.platforms[i];
      ctx.fillStyle = 'black';
      ctx.fillRect(p.x, p.y, p.w, p.h);
    }
  }
  floor(x, y, w, h) {
    let closestPlatform = game.height;
    for(var i = 0;i < this.platforms.length;i++) {
      let p = this.platforms[i];

      if(y+h <= p.y && x < p.x+p.w && x+w > p.x) {
        if(closestPlatform > p.y - h) {
          closestPlatform = p.y - h;
        }
      }
    }
    return closestPlatform;
  }
}