
export default function weapon(p) {
    add([
      circle(16),
      pos(p),
      color(255, 0, 0),
      area(),
      'weapon',
      z(19)
      
    ]);
   }