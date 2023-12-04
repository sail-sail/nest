export { }

declare global {
  
  type PartialNull<T> = {
    [P in keyof T]?: T[P] | null | undefined;
  }
  
  type Distinct<T, DistinctName> = T & { __TYPE__: DistinctName };
  
  interface Sort extends Sort2 {
  }
  
}
