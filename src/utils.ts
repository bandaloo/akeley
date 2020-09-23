export type TupleVec2 = [number, number];
export type TupleVec3 = [number, number, number];
export type TupleVec4 = [number, number, number, number];
export type TupleVec = TupleVec2 | TupleVec3 | TupleVec4;

// utility functions
export function mix<T extends TupleVec2>(a: T, b: T, num: number): TupleVec2;
export function mix<T extends TupleVec3>(a: T, b: T, num: number): TupleVec3;
export function mix<T extends TupleVec4>(a: T, b: T, num: number): TupleVec4;
export function mix<T extends TupleVec>(a: T, b: T, num: number): T {
  return a.map((n, i) => n + (b[i] - n) * num) as T;
}

export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
