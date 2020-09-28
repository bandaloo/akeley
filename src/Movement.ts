import { TupleVec3 } from "./utils";

export abstract class Movement {
  abstract pos(start: TupleVec3, end: TupleVec3, tween: number): number;
}
