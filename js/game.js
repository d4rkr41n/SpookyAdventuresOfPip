// Entities
import { Player } from './entities/player.js';
import { Zombie } from './entities/zombie.js';
import { Ghost } from './entities/ghost.js';

// Game Functions
import { UI } from './ui.js';
import { InputHandler } from './input.js';
import { AudioHandler } from './audio.js';
import { Map } from './maps/maps.js';

window.addEventListener('load', function() {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  canvas.width = 480;
  canvas.height = 270;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.frame = 0;

      this.hitboxes = false;

      this.map = new Map(this, "start");
      this.player = new Player(this, this.map, 100, 0);
      this.ghost = new Ghost(this, this.map, 100, 0, this.player);
      this.zombie = new Zombie(this, this.map, 100, 0);

      this.ui = new UI(this, this.map);
      this.audio = new AudioHandler();
      this.input = new InputHandler();
    }
    update() {
      this.frame++;
      this.player.update(this.input.keys, this.audio);
      this.ghost.update(this.audio);
      this.zombie.update(this.audio);

      this.ui.update(this.audio);
    }
    draw(ctx) {
      this.clear(ctx);
      this.map.draw(ctx);
      this.ghost.draw(ctx, this.hitboxes);
      this.player.draw(ctx, this.hitboxes);
      this.zombie.draw(ctx, this.hitboxes);

      this.ui.draw(ctx, this.player);
    }
    clear(ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  const game = new Game(canvas.width, canvas.height);

  const fps = 60;
  function animate() {
    game.update(ctx);
    game.draw(ctx);

    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 1000 / fps);
  }
  animate();
});
