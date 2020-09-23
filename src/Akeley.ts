import { Segment } from "./Segment";
import { mix, mod, TupleVec3 } from "./utils";

export class Akeley {
  segments: Segment[] = [];

  private prevTime = 0;

  private currIndex = 0;
  private prevSegmentsTime = 0;

  constructor(segments: Segment[]) {
    this.segments = segments;
  }

  // TODO fix for backwards time
  pos(time: number): TupleVec3 {
    // advance index until segment is correct for current time
    while (
      time < this.prevSegmentsTime ||
      time > this.prevSegmentsTime + this.segments[this.currIndex].time
    ) {
      this.prevSegmentsTime += this.segments[this.currIndex].time;
      this.currIndex = mod(this.currIndex + 1, this.segments.length);
    }

    const curr = time - this.prevSegmentsTime;
    const next = this.segments[this.currIndex].time;
    const tween = 1 - (next - curr) / next;

    // use previous segment endpoint as start if undefined
    const start: TupleVec3 | undefined =
      this.segments[this.currIndex].start ??
      this.segments[mod(this.currIndex - 1, this.segments.length)].end;

    if (start === undefined)
      throw new Error("start is undefined and prev segment end is undefined");

    // use next segment start point if end is undefined
    const end: TupleVec3 | undefined =
      this.segments[this.currIndex].end ??
      this.segments[mod(this.currIndex + 1, this.segments.length)].start;

    if (end === undefined)
      throw new Error("end is undefined and prev segment start is undefined");

    return mix(start, end, tween);
  }
}

// TODO error for empty path
