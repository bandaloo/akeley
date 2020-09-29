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
