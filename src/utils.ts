export interface Vec<L extends number> extends Array<number> {
  0: number;
  length: L;
}

export function mix<T extends Vec<number>>(a: T, b: T, num: number): T {
  return a.map((n, i) => n + (b[i] - n) * num) as T;
}

export function mult<T extends Vec<number>>(a: T | number, b: T): T {
  return typeof a === "number"
    ? (b.map((n) => a * n) as T)
    : (b.map((n, i) => a[i] * n) as T);
}

export function div<T extends Vec<number>>(a: T | number, b: T): T {
  return typeof a === "number"
    ? (b.map((n) => a / n) as T)
    : (b.map((n, i) => a[i] / n) as T);
}

export function add<T extends Vec<number>>(a: T | number, b: T): T {
  return typeof a === "number"
    ? (b.map((n) => a + n) as T)
    : (b.map((n, i) => a[i] + n) as T);
}

export function sub<T extends Vec<number>>(a: T | number, b: T): T {
  return typeof a === "number"
    ? (b.map((n) => a - n) as T)
    : (b.map((n, i) => a[i] - n) as T);
}

export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function clamp(n: number, lo: number, hi: number) {
  return Math.min(Math.max(n, lo), hi);
}

export function catmullRomPoint<L extends number>(
  points: [Vec<L>, Vec<L>, Vec<L>, Vec<L>],
  t: number,
  tension = 0.5
): Vec<L> {
  let p0 = points[0];
  let p1 = points[1];
  let p2 = points[2];
  let p3 = points[3];
  const a = mult(2, p1);
  const b = sub(p2, p0);
  const c = sub(add(sub(mult(2, p0), mult(5, p1)), mult(4, p2)), p3);
  const d = add(sub(add(mult(-1, p0), mult(3, p1)), mult(3, p2)), p3);
  const n1 = mult(t, b);
  const n2 = mult(t ** 2, c);
  const n3 = mult(t ** 3, d);
  return mult(tension, add(a, add(n1, add(n2, n3))));
}
