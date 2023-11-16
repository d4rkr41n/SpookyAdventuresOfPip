export default {
  hitbox(e) {
    // This returns the exact coords on the page
    let p = e.padding(e.width, e.height);
    let box = {
      t:this.y + p.t,
      b:this.y + this.height - p.b,
      l:this.x + p.l,
      r:this.x + this.width - p.r
    };
    return box;
  }
}