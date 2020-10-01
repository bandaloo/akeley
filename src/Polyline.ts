import { Movement } from "./Movement";
import { catmullRomGrad, catmullRomPoint, clamp, mod, Vec } from "./utils";

export class Polyline extends Movement {
  /** points between the start and end */
  controls: Vec<3>[] = [];
  /** if closed loop or not */
  closed = false;

  between(...controls: Vec<3>[]) {
    this.controls = controls;
    return this;
  }

  entering(x: number, y: number, z: number) {
    this.start = [x, y, z];
    this.end = [x, y, z];
    this.closed = true;
    return this;
  }

  private posGrad(
    start: Vec<3>,
    end: Vec<3>,
    tween: number,
    pos = true
  ): Vec<3> {
    if (this.controls.length < 2) throw new Error("not enough between points");
    const points = [start, ...this.controls];
    if (!this.closed) points.push(end);
    const l = points.length;
    const f = (i: number) => (this.closed ? mod(i, l) : clamp(i, 0, l - 1));
    const i1 = Math.floor(tween * l);
    const p0 = points[f(i1 - 1)];
    const p1 = points[i1];
    const p2 = points[f(i1 + 1)];
    const p3 = points[f(i1 + 2)];
    const t = (tween % (1 / l)) * l;
    return pos
      ? catmullRomPoint([p0, p1, p2, p3], t)
      : catmullRomGrad([p0, p1, p2, p3], t);
  }

  pos(start: Vec<3>, end: Vec<3>, tween: number): Vec<3> {
    return this.posGrad(start, end, tween, true);
  }

  dir(start: Vec<3>, end: Vec<3>, tween: number): Vec<3> {
    return this.posGrad(start, end, tween, false);
  }
}
