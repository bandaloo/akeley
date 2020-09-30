import { Vec } from "./utils";

export abstract class Movement {
  /** starting point (undefined means link to next movement) */
  start?: Vec<3>;
  /** endpoint (undefined means link to previous movement) */
  end?: Vec<3>;
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

  abstract pos(start: Vec<3>, end: Vec<3>, tween: number): Vec<3>;

  abstract dir(start: Vec<3>, end: Vec<3>, tween: number): Vec<3>;
}
