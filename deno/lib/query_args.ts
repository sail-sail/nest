
export class QueryArgs {
  
  // deno-lint-ignore no-explicit-any
  value: any[] = [ ];
  
  toJSON() {
    return this.value;
  }
  
  reset() {
    this.value = [ ];
  }
  
  toString() {
    return this.value.join(",");
  }
  
  get length() {
    return this.value.length;
  }
  
  // deno-lint-ignore no-explicit-any
  push(val: any): "?" {
    this.value.push(val);
    return `?`;
  }
  
  concat(args: QueryArgs) {
    this.value = this.value.concat(args.value);
    return this;
  }
  
}
