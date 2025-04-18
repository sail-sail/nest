export { }

export * from "@/uni_modules/tm-ui/interface";

declare global {
  
  type PartialNull<T> = {
    [P in keyof T]?: T[P] | null | undefined;
  }
  
  type Distinct<T, DistinctName> = T & { __TYPE__: DistinctName };
  
  interface Sort extends Sort2 {
  }
  
  type DecimalType = InstanceType<typeof import("decimal.js").default>;
  
}
