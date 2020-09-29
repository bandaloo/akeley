import { Movement } from "./Movement";
import { add, mult, sub, Vec } from "./utils";

export class Polyline extends Movement {
  static catmullRomPoint(
    points: [Vec<3>, Vec<3>, Vec<3>, Vec<3>],
    t: number,
    tension = 0.5
  ): Vec<3> {
    let p0 = points[0];
    let p1 = points[1];
    let p2 = points[2];
    let p3 = points[3];
    const a = mult(2, p1);
    const b = sub(p2, p0);
    const c = sub(add(sub(mult(2, p0), mult(5, p1)), mult(4, p2)), p3);
    const d = add(sub(add(mult(-1, p0), mult(3, p1)), mult(3, p2)), p3);
    const n1 = mult(t, b);
    const n2 = mult(t ** 2, c);
    const n3 = mult(t ** 3, d);
    return mult(tension, add(a, add(n1, add(n2, n3))));
  }

  pos(start: Vec<3>, end: Vec<3>, tween: number): Vec<3> {
    throw new Error("Method not implemented.");
  }
}
