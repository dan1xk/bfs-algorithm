class Vector2 {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public add(vec: Vector2) {
    return new Vector2(this.x + vec.x, this.y + vec.y);
  }
}

export default Vector2;
