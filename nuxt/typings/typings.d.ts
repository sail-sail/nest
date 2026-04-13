import "vue-router";

declare module 'vue-router' {
  interface RouteMeta {
    
  }
}

declare global {
  type PartialNull<T> = { [P in keyof T]?: T[P] | null | undefined; }
  
  type Distinct<T, DistinctName> = T & { __TYPE__: DistinctName };
  
  type TableSortOrder = 'ascending' | 'descending';
  
  interface Sort {
    prop: string;
    order: TableSortOrder;
  }
  
  interface ColumnType {
    prop: string;
    label: string;
    sortBy?: string;
    hide?: boolean;
    width?: string | number;
    minWidth?: string | number;
    align?: "left" | "center" | "right";
    headerAlign?: "left" | "center" | "right";
    className?: string;
    labelClassName?: string;
    columnKey?: string;
    sortable?: "custom" | boolean;
    showOverflowTooltip?: boolean;
    fixed?: boolean | "left" | "right";
    isDynField?: boolean;
  }
  
  interface ExcelColumnType {
    prop: string;
    label: string;
    width?: string | number;
    fixed?: boolean;
    hidden?: "1" | "0";
  }
  
  type DecimalType = InstanceType<typeof import("decimal.js").default>;
  
}
