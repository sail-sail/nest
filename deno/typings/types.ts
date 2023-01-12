
declare global {
  type PartialNull<T> = { [P in keyof T]?: T[P] | null | undefined; }
}
