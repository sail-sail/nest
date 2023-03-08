import {
  type DirectiveBinding,
} from "vue";

import Sortable from "sortablejs";

export function tableDataSortable(el: HTMLElement, binding: DirectiveBinding) {
  const tbodyEl = el.querySelector(".el-table__body-wrapper .el-table__body>tbody") as HTMLElement | null;
  if (!tbodyEl) {
    return;
  }
  const bindVal = binding.value;
  Sortable.create(tbodyEl, bindVal);
}
