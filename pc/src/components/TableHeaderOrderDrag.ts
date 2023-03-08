import {
  type DirectiveBinding,
} from "vue";

import {
  type SortableEvent,
} from "sortablejs";

import Sortable from "sortablejs";

export function headerOrderDrag(el: HTMLElement, binding: DirectiveBinding) {
  const bindVal: Function = binding.value;
  if (!bindVal) {
    console.error("请设置正确的 v-header-order-drag 参数值!", el, binding.value);
    return;
  }
  const headTr = el.querySelector(".el-table__header-wrapper>.el-table__header thead tr") as HTMLTableElement;
  if (!headTr) {
    return;
  }
  Sortable.create(
    headTr,
    {
      animation: 150,
      onEnd: function (event: SortableEvent) {
        let { oldIndex, newIndex } = event;
        if (oldIndex == null || newIndex == null) {
          return;
        }
        const bindValue = bindVal();
        const tableColumns = bindValue.tableColumns;
        const storeColumns = bindValue.storeColumns;
        const offset = bindValue.offset || 0;
        oldIndex = oldIndex - offset;
        newIndex = newIndex - offset;
        const oldTableColumn = tableColumns[oldIndex];
        tableColumns.splice(oldIndex, 1);
        tableColumns.splice(newIndex, 0, oldTableColumn);
        if (storeColumns) {
          storeColumns(tableColumns.concat([ ]));
        }
      },
      filter: ".el-table-column--selection",
    }
  );
}
