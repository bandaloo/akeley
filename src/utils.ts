export interface Vec<L extends number> extends Array<number> {
  0: number;
  length: L;
}

export interface Mat<L extends number> extends Array<Vec<L>> {
  0: Vec<L>;
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
  return Math.sqrt(a.reduce((acc, curr) => acc + curr ** 2, 0));
}

export function norm<T extends Vec<number>>(a: T): T {
  const l = length(a);
  if (l === 0) throw new Error("cannot normalize zero vector");
  return div(a, l);
}

export function dot<T extends Vec<number>>(a: T, b: T): number {
  return a.reduce((acc, curr, i) => acc + curr * b[i], 0);
}

// https://www.geertarien.com/blog/2017/07/30/breakdown-of-the-lookAt-function-in-OpenGL/
export function lookAt(eye: Vec<3>, at: Vec<3>, up: Vec<3>): Mat<4> {
  let z = norm(sub(at, eye));
  const x = norm(cross(z, up));
  const y = cross(x, z);
  //console.log("inputs", eye, at, up);
  //console.log("lookat", x, y, z);
  z = mult(z, -1); // invert
  return [
    [x[0], x[1], x[2], -dot(x, eye)],
    [y[0], y[1], y[2], -dot(y, eye)],
    [z[0], z[1], z[2], -dot(z, eye)],
    [0, 0, 0, 1],
  ];
}

// TODO also add scalar cross product
export function cross(a: Vec<3>, b: Vec<3>): Vec<3> {
  const [a1, a2, a3] = a;
  const [b1, b2, b3] = b;
  return [a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1];
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
