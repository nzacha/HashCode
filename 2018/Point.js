class Point {
  constructor(x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
  }

  distance(other) {
    if (!other) {
      other = this;
    }
    return Math.abs(this.x - other.x + this.y - other.y);
  }
}

module.exports = Point;
