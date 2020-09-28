import { Movement } from "./Movement";
import { getCurvePoints } from "./curvepoints";
import { mix, TupleVec3 } from "./utils";

export type Interp = "linear";

/** part of a path */
export class Segment extends Movement {
  /** starting point */
  start?: TupleVec3;
  /** endpoint */
  end?: TupleVec3;
  /** interpolation style */
  interp: Interp = "linear";
  /** time for transition in ms */
  time: number = 1000;

  /** sets start point */
  from(x: number, y: number, z: number) {
    this.start = [x, y, z];
    return this;
  }

  /** sets endpoint */
  to(x: number, y: number, z: number) {
    this.end = [x, y, z];
    return this;
  }

  /** sets time length of the transition */
  within(time: number) {
    this.time = time;
    return this;
  }

  /** sets interpolation style */
  like(interp: Interp) {
    this.interp = interp;
    return this;
  }

  pos(start: TupleVec3, end: TupleVec3, tween: number) {
    return mix(start, end, tween);
  }
}

/** creates a new [[Segment]] */
export function lerp() {
  return new Segment().like("linear");
}

interface SplineOptions {
  tension?: number;
  numOfSeg?: number;
  kind?: "closed" | "from" | "to" | "capped";
}

export function spline(
  points: TupleVec3[],
  within = 8000,
  options: SplineOptions = {}
) {
  const s = getCurvePoints(
    points.flat(),
    options.tension,
    options.numOfSeg,
    options.kind === "closed"
  );
  const curve: TupleVec3[] = [];
  for (let i = 0; i < s.length; i += 3) {
    curve.push([s[i], s[i + 1], s[i + 2]]);
  }

  // TODO closed or not closed segments will be different
  // slice off last element if closed
  const time = within / (curve.length - 1);
  const ret = curve.map((p) =>
    options.kind === "to"
      ? new Segment().within(time).to(...p)
      : new Segment().within(time).from(...p)
  );

  // remove the last element so the loop doesn't pause, but we want to keep the
  // last element if we intend to cut
  if (options.kind === "closed" || options.kind === "capped") {
    const popped = ret.pop();
    if (popped?.start === undefined)
      throw new Error("popped or start undefined");
    ret[ret.length - 1].to(...popped.start);
  }

  return ret;
}
