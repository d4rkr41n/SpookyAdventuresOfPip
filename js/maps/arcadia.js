export default {
  data: {
    name: "Arcadia",
    gravity: 1,
    spawn: {x:100, y:0},
    platforms: [
      {x: 150, y: 200, w: 100, h: 10},
      {x: 100, y: 220, w: 100, h: 10},
      {x: 0, y: 260, w: 500, h: 10}
    ],
    enemies: [
      {entity: null,type: "zombie", x:130, y:100},
      {entity: null,type: "zombie", x:140, y:50}
    ]
  }
}