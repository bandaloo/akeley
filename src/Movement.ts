import { Vec } from "./utils";

export abstract class Movement {
  /** starting point (undefined means link to next movement) */
  start?: Vec<3>;
  /** endpoint (undefined means link to previous movement) */
  end?: Vec<3>;

  abstract pos(start: Vec<3>, end: Vec<3>, tween: number): Vec<3>;
}
