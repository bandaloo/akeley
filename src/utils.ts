export interface Vec<L extends number> extends Array<number> {
  0: number;
  length: L;
}

export function mix<T extends Vec<number>>(a: T, b: T, num: number): T {
  return a.map((n, i) => n + (b[i] - n) * num) as T;
}

export function mult<T extends Vec<number>>(s: number, v: T): T {
  return v.map((n) => n * s) as T;
}

export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
