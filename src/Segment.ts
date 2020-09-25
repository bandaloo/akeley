import { getCurvePoints } from "./spline";
import { TupleVec3 } from "./utils";

export type Interp = "linear";

/** part of a path */
export class Segment {
  /** starting point */
  start?: TupleVec3;
  /** endpoint */
  end?: TupleVec3;
  /** interpolation style */
  interp: Interp = "linear";
  /** time for transition in ms */
  time: number = 1000;

  constructor() {}

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
}

/** creates a new [[Segment]] */
export function lerp() {
  return new Segment().like("linear");
}

interface SplineOptions {
  tension?: number;
  numOfSeg?: number;
  close?: boolean;
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
    options.close
  );
  const curve: TupleVec3[] = [];
  for (let i = 0; i < s.length; i += 3) {
    curve.push([s[i], s[i + 1], s[i + 2]]);
  }

  // TODO closed or not closed segments will be different
  // slice off last element if closed
  const ret = curve.map((p) =>
    new Segment().within(within / (curve.length - 1)).from(...p)
  );

  // remove the last element so the loop doesn't pause, but we want to keep the
  // last element if we intend to cut
  const popped = ret.pop();
  if (popped === undefined) throw new Error("pop returned undefined");

  if (!options.close) {
    if (popped.start === undefined)
      throw new Error("popped poitn somehow doesn't have start");
    ret[ret.length - 1].to(...popped.start);
  }

  return ret;
}
