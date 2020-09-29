import { Movement } from "./Movement";
import { Vec } from "./utils";

export class Polyline extends Movement {
  static catmulPoint(points: Vec<3>[], t: number, looped: boolean): Vec<3> {
    let p0 = points[0];
    let p1 = points[1];
    let p2 = points[2];
    let p3 = points[3];
    return [0, 0, 0];
  }

  pos(start: Vec<3>, end: Vec<3>, tween: number): Vec<3> {
    throw new Error("Method not implemented.");
  }
}
