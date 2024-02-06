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
      dragClass: "v-header-order-drag-sortable-drag",
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
        
        // 包含隐藏列在内去重新获取 oldIndex 和 newIndex
        let ii = 0;
        let hasSetOldIndex = false;
        let hasSetNewIndex = false;
        for (let i = 0; i < tableColumns.length; i++) {
          const item = tableColumns[i];
          if (item.hide === true) {
            continue;
          }
          if (ii === oldIndex) {
            oldIndex = i;
            hasSetOldIndex = true;
          }
          if (ii === newIndex) {
            newIndex = i;
            hasSetNewIndex = true;
          }
          if (hasSetOldIndex && hasSetNewIndex) {
            break;
          }
          ii++;
        }
        
        let leftFixed = 0;
        let rightFixed = 0;
        for (let i = 0; i < tableColumns.length; i++) {
          const item = tableColumns[i];
          if (item.hide === true) {
            continue;
          }
          if (item.fixed === "left" || item.fixed === true) {
            leftFixed++;
          }
          if (item.fixed === "right") {
            rightFixed++;
          }
        }
        if (leftFixed > 0 && newIndex < leftFixed) {
          ElMessage.warning("不能移动到左侧固定列之前");
          storeColumns(tableColumns, true);
          return;
        }
        if (rightFixed > 0 && newIndex >= tableColumns.length - rightFixed) {
          ElMessage.warning("不能移动到右侧固定列之后");
          storeColumns(tableColumns, true);
          return;
        }
        const oldTableColumn = tableColumns[oldIndex];
        tableColumns.splice(oldIndex, 1);
        tableColumns.splice(newIndex, 0, oldTableColumn);
        if (storeColumns) {
          storeColumns(tableColumns);
        }
      },
      filter: function(_, el) {
        let filter = false;
        if (el.classList.contains("el-table-fixed-column--left")) {
          filter = true;
        }
        if (el.classList.contains("el-table-fixed-column--right")) {
          filter = true;
        }
        if (el.classList.contains("el-table-column--selection")) {
          filter = true;
        }
        return filter;
      },
    }
  );
}
