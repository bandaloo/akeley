export interface Vec<L extends number> extends Array<number> {
  0: number;
  length: L;
}

export function mix<T extends Vec<number>>(a: T, b: T, num: number): T {
  return a.map((n, i) => n + (b[i] - n) * num) as T;
}

export function mult<T extends Vec<number>>(a: T, b: T | number): T {
  return typeof b === "number"
    ? (a.map((n) => n * b) as T)
    : (a.map((n, i) => n * b[i]) as T);
}

export function div<T extends Vec<number>>(a: T, b: T | number): T {
  return typeof b === "number"
    ? (a.map((n) => n / b) as T)
    : (a.map((n, i) => n / b[i]) as T);
}

export function add<T extends Vec<number>>(a: T, b: T | number): T {
  return typeof b === "number"
    ? (a.map((n) => n + b) as T)
    : (a.map((n, i) => n + b[i]) as T);
}

export function sub<T extends Vec<number>>(a: T, b: T | number): T {
  return typeof b === "number"
    ? (a.map((n) => n - b) as T)
    : (a.map((n, i) => n - b[i]) as T);
}

export function length<T extends Vec<number>>(a: T): number {
  return Math.sqrt(a.reduce((acc, curr) => (acc + curr) ** 2));
}

export function norm<T extends Vec<number>>(a: T): T {
  return div(a, length(a));
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
  const [p0, p1, p2, p3] = [...points];
  const a = mult(p1, 2);
  const b = sub(p2, p0);
  const c = sub(add(sub(mult(p0, 2), mult(p1, 5)), mult(p2, 4)), p3);
  const d = add(sub(add(mult(p0, -1), mult(p1, 3)), mult(p2, 3)), p3);
  const n1 = mult(b, t);
  const n2 = mult(c, t ** 2);
  const n3 = mult(d, t ** 3);
  // a + bt + ct^2 + dt^3
  return mult(add(a, add(n1, add(n2, n3))), tension);
}

export function catmullRomGrad<L extends number>(
  points: [Vec<L>, Vec<L>, Vec<L>, Vec<L>],
  t: number,
  tension = 0.5
): Vec<L> {
  const [p0, p1, p2, p3] = [...points];
  const b = sub(p2, p0);
  const c2 = mult(sub(add(sub(mult(p0, 2), mult(p1, 5)), mult(p2, 4)), p3), 2);
  const d3 = mult(add(sub(add(mult(p0, -1), mult(p1, 3)), mult(p2, 3)), p3), 3);
  const n1 = mult(c2, t);
  const n2 = mult(d3, t ** 2);
  // b + 2ct + 3dt^3
  return mult(add(b, add(n1, n2)), tension);
}
