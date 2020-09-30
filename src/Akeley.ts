import { Movement } from "./Movement";
import { mix, mod, Vec } from "./utils";

interface Orientation {
  pos: Vec<3>;
  dir: Vec<3>;
}

export class Path {
  movements: Movement[] = [];

  private prevTime = 0;

  private currIndex = 0;
  private prevSegmentsTime = 0;

  constructor(movements: Movement[]) {
    this.movements = movements;
  }

  // TODO fix for 0 time
  orientation(time: number, pos = true): Orientation {
    // advance index until segment is correct for current time
    // advancing will not happen if sign is 0 (time stopped)
    const sign = Math.sign(time - this.prevTime);
    while (sign !== 0) {
      const prev = this.prevSegmentsTime;
      const next = prev + this.movements[this.currIndex].time * sign;
      if (sign > 0 ? time > next : time < next) {
        this.prevSegmentsTime += this.movements[this.currIndex].time * sign;
        this.currIndex = mod(this.currIndex + sign, this.movements.length);
      } else {
        break;
      }
    }

    const curr = time - this.prevSegmentsTime;
    const next = this.movements[this.currIndex].time;
    const tween = (1 - (next - curr) / next) * sign;

    // use previous segment endpoint as start if undefined
    const start: Vec<3> | undefined =
      this.movements[this.currIndex].start ??
      this.movements[mod(this.currIndex - sign, this.movements.length)].end;

    if (start === undefined)
      throw new Error("start is undefined and prev segment end is undefined");

    // use next segment start point if end is undefined
    const end: Vec<3> | undefined =
      this.movements[this.currIndex].end ??
      this.movements[mod(this.currIndex + sign, this.movements.length)].start;

    if (end === undefined)
      throw new Error("end is undefined and prev segment start is undefined");

    this.prevTime = time;

    return {
      pos: this.movements[this.currIndex].pos(start, end, tween),
      dir: this.movements[this.currIndex].dir(start, end, tween),
    };
  }
}

// TODO error for empty path
