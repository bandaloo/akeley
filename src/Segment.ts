export type Interp = "linear";

/** part of a path */
export class Segment {
  /** starting point */
  start?: [number, number, number];
  /** endpoint */
  end?: [number, number, number];
  /** interpolation style */
  interp?: Interp;
  /** time for transition in ms */
  time?: number;

  constructor();
  constructor(x: number, y: number, z: number);
  constructor(x?: number, y?: number, z?: number) {
    // undefined start means use the endpoint of previous segment
    if (x === undefined) return;
    // y and z must be numbers as defined by the overload
    this.start = [x, y as number, z as number];
  }

  /** sets endpoint */
  to(end: [number, number, number]) {
    this.end = end;
    return this;
  }

  /** sets time length of the transition */
  within(time: number) {
    this.time = time;
    return time;
  }

  /** sets interpolation style */
  like(interp: Interp) {
    this.interp = interp;
    return this;
  }
}

/** creates a new [[Segment]] */
function move(x: number, y: number, z: number) {
  return new Segment(x, y, z);
}
