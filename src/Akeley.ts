import { Segment } from "./Segment";
import { mix, mod, TupleVec3 } from "./utils";

export class Path {
  segments: Segment[] = [];

  private prevTime = 0;

  private currIndex = 0;
  private prevSegmentsTime = 0;

  constructor(segments: Segment[]) {
    this.segments = segments;
  }

  pos(time: number): TupleVec3 {
    // advance index until segment is correct for current time
    // advancing will not happen if sign is 0 (time stopped)
    const sign = Math.sign(time - this.prevTime);
    while (sign !== 0) {
      const prev = this.prevSegmentsTime;
      const next = prev + this.segments[this.currIndex].time * sign;
      if (sign > 0 ? time > next : time < next) {
        this.prevSegmentsTime += this.segments[this.currIndex].time * sign;
        this.currIndex = mod(this.currIndex + sign, this.segments.length);
      } else {
        break;
      }
    }

    const curr = time - this.prevSegmentsTime;
    const next = this.segments[this.currIndex].time;
    const tween = (1 - (next - curr) / next) * sign;

    // use previous segment endpoint as start if undefined
    const start: TupleVec3 | undefined =
      this.segments[this.currIndex].start ??
      this.segments[mod(this.currIndex - sign, this.segments.length)].end;

    if (start === undefined)
      throw new Error("start is undefined and prev segment end is undefined");

    // use next segment start point if end is undefined
    const end: TupleVec3 | undefined =
      this.segments[this.currIndex].end ??
      this.segments[mod(this.currIndex + sign, this.segments.length)].start;

    if (end === undefined)
      throw new Error("end is undefined and prev segment start is undefined");

    this.prevTime = time;

    return mix(start, end, tween);
  }
}

// TODO error for empty path
