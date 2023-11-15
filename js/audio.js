export class AudioHandler {
  constructor(game, map) {
    this.game = game;
    this.map = map;
  }
  async play(sound) {
    //document.getElementById(sound).play();
    let audio = new Audio(`sfx/${sound}.wav`);
    audio.play();
    return audio;
  }
  async stop(audio) {
    //document.getElementById(sound).pause();
    audio.pause();
  }
}