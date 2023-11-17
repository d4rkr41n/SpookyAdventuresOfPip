export class UI {
  constructor(game, map) {
    this.game = game;
    this.map = map;
    this.hearts = 3;
    this.width = 15;
    this.height = 15;
    this.padding = 5;
    this.x = this.game.width;
    this.y = 0;
    this.devtools = false; // Used to toggle state on hitboxes
  }

  draw(ctx, entity) {
    let img = document.getElementById("heart");

    this.hearts = entity.hearts;

    for(var i = 1;i<=this.hearts;i++){
      let offset = i*(this.padding+this.width);
      ctx.drawImage(img, this.x - offset, this.y+this.padding, this.width, this.height);
    }

    // Frame Counter
    if(this.game.hitboxes) {
      ctx.fillStyle = 'black';
      ctx.font = "10px Arial";
      ctx.fillText("FPS: " + this.game.frame, 0, 10);
      ctx.fillText("LVL: " + this.game.map.map.name, 0, 20);
    }
  }
  update(game) {
    this.game = game;
    this.hearts = this.game.map.player.hearts;

    let keys = this.game.input.keys;
    if(keys.includes('b')) {
      if(this.game.hitboxes && !this.devtools) {
        this.game.hitboxes = false;
        this.devtools = true;
      } else if(!this.game.hitboxes && !this.devtools) {
        this.game.hitboxes = true;
        this.devtools = true;
      }
    } else {
      this.devtools = false;
    }
  }
}