import { Segment } from "./Segment";

// TODO move this to utils
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export class Akeley {
  segments: Segment[] = [];

  private currIndex = 0;
  private prevSegmentsTime = 0;

  constructor(segments: Segment[]) {
    this.segments = segments;
  }

  // TODO fix for backwards time
  pos(time: number): [number, number, number] {
    // advance index until segment is correct for current time
    // TODO use modded index for backwards time
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
    const start: [number, number, number] | undefined =
      this.segments[this.currIndex].start ??
      this.segments[mod(this.currIndex - 1, this.segments.length)].end;

    if (start === undefined)
      throw new Error("start is undefined and prev segment end is undefined");

    // use next segment start point if end is undefined
    const end: [number, number, number] | undefined =
      this.segments[this.currIndex].end ??
      this.segments[mod(this.currIndex + 1, this.segments.length)].start;

    if (end === undefined)
      throw new Error("end is undefined and prev segment start is undefined");

    const ret = start.map((num, index) => num + (end[index] - num) * tween);
    // cast because we are doing a map on something that's actually a tuple
    return ret as [number, number, number];
  }
}

// TODO error for empty path
