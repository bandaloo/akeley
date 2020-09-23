export type Interp = "linear";

/** part of a path */
export class Segment {
  /** starting point */
  start?: [number, number, number];
  /** endpoint */
  end?: [number, number, number];
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
