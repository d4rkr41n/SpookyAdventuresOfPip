import data from './arcadia.js';
export class Map {
  constructor(game, mapName) {
    this.game = game;
    this.map = data.data;
    this.player = null;
    this.ghost = null;
    this.mapName = mapName;
    this.platforms = this.map['platforms'];
    this.enemies = this.map['enemies'];
    this.gravity = this.map.gravity;
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