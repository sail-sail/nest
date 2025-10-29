import "vue-router";

import type {
  AutocompleteFetchSuggestionsCallback as AutocompleteFetchSuggestionsCallback2,
  UploadProps as UploadProps2,
  Sort as Sort2,
  TableColumnCtx as TableColumnCtx2,
  FormItemRule as FormItemRule2,
} from "element-plus";

import type {
  SortableOptions as SortableOptions2,
  SortableEvent as SortableEvent2,
} from "sortablejs";

import type {
  TreeNodeData as TreeNodeData2,
} from "element-plus/es/components/tree/src/tree.type";

declare module 'vue-router' {
  interface RouteMeta {
    
  }
}

declare global {
  type PartialNull<T> = { [P in keyof T]?: T[P] | null | undefined; }
  
  type InputMaybe<T> = Maybe<T>;
  
  type Distinct<T, DistinctName> = T & { __TYPE__: DistinctName };

  
  interface AutocompleteFetchSuggestionsCallback extends AutocompleteFetchSuggestionsCallback2 {
  }
  
  interface UploadProps extends UploadProps2 {
  }
  
  interface TableColumnCtx<T> extends TableColumnCtx2<T> {
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
  }
  
  interface ExcelColumnType {
    prop: string;
    label: string;
    width?: string | number;
    fixed?: boolean;
    hidden?: "1" | "0";
  }
  
  interface FormItemRule extends FormItemRule2 {
  }
  
  interface Sort extends Sort2 {
  }
  
  interface SortableOptions extends SortableOptions2 {
  }
  
  interface SortableEvent extends SortableEvent2 {
  }
  
  interface TreeNodeData extends TreeNodeData2 {
  }
  
  type DecimalType = InstanceType<typeof import("decimal.js").default>;
  
}
