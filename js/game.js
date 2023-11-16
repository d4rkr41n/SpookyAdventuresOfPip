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

      this.map = new Map(this, "arcadia");
      this.map.player = new Player(this, this.map, this.map.map.spawn.x, this.map.map.spawn.y);
      this.map.ghost = new Ghost(this, this.map, this.map.map.spawn.x, this.map.map.spawn.y, this.map.player);

      for(var i = 0;i < this.map.enemies.length;i++) {
        let enemy = this.map.enemies[i];
        let x = enemy.x;
        let y = enemy.y;
        enemy.entity = new Zombie(this, this.map, x, y);
      }

      this.ui = new UI(this, this.map);
      this.audio = new AudioHandler();
      this.input = new InputHandler();
    }
    update() {
      this.frame++;
      this.map.player.update(this.input.keys, this.audio);
      this.map.ghost.update(this.audio);

      // Update enemies in the current map
      for(var i = 0;i < this.map.enemies.length;i++) {
        let entity = this.map.enemies[i].entity;
        entity.update(this.audio);
      }

      this.ui.update(this);
    }
    draw(ctx) {
      this.clear(ctx);
      this.map.draw(ctx);

      // Update enemies in the current map
      for(var i = 0;i < this.map.enemies.length;i++) {
        let entity = this.map.enemies[i].entity;
        entity.draw(ctx, this.hitboxes);
      }

      this.map.ghost.draw(ctx, this.hitboxes);
      this.map.player.draw(ctx, this.hitboxes);

      this.ui.draw(ctx, this.map.player);
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
