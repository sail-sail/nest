import "vue-router";

import {
  type AutocompleteFetchSuggestionsCallback as AutocompleteFetchSuggestionsCallback2,
  type UploadProps as UploadProps2,
  type Sort as Sort2,
  type TableColumnCtx as TableColumnCtx2,
  type FormItemRule as FormItemRule2,
} from "element-plus";

declare module 'vue-router' {
  interface RouteMeta {
    
  }
}

declare global {
  type PartialNull<T> = { [P in keyof T]?: T[P] | null | undefined; }
  
  interface AutocompleteFetchSuggestionsCallback extends AutocompleteFetchSuggestionsCallback2 {
  }
  
  interface UploadProps extends UploadProps2 {
  }
  
  interface TableColumnCtx<T> extends TableColumnCtx2<T> {
  }
  
  interface ColumnType {
    prop: string;
    label: string;
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
  
  interface FormItemRule extends FormItemRule2 {
  }
  
  interface Sort extends Sort2 {
  }
  
}
