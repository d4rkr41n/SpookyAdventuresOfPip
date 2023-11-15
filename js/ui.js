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
  }

  draw(ctx, entity) {
    let img = document.getElementById("heart");

    this.hearts = entity.hearts;

    for(var i = 1;i<=this.hearts;i++){
      let offset = i*(this.padding+this.width);
      ctx.drawImage(img, this.x - offset, this.y+this.padding, this.width, this.height);
    }


    // Frame Counter
    //ctx.font = "10px Arial";
    //ctx.fillText(this.game.frame, 0, 10);

  }
  update(entity) {
    this.hearts = entity.hearts;
  }
}