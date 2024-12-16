import type {
  DirectiveBinding,
} from "vue";

import type {
  SortableEvent,
} from "sortablejs";

import Sortable from "sortablejs";

function getTextWidth(textContent: string) {
  const text = textContent.replace(/[\u0391-\uFFE5]/g, "aa");
  // 大写字母的个数
  const upperCaseSize = text.match(/[A-Z]/g)?.length || 0;
  const textWidth = (text.length - upperCaseSize) * 8 + upperCaseSize * 10.5;
  return textWidth;
}

export function headerOrderDrag(el: HTMLElement, binding: DirectiveBinding) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const bindVal: Function = binding.value;
  if (!bindVal) {
    console.error("请设置正确的 v-header-order-drag 参数值!", el, binding.value);
    return;
  }
  const headTr = el.querySelector(".el-table__header-wrapper .el-table__header thead tr") as HTMLTableElement;
  if (!headTr) {
    return;
  }
  const thEls = headTr.querySelectorAll(".el-table__cell") as NodeListOf<HTMLTableElement>;
  thEls.forEach((thEl, i) => {
    thEl.addEventListener("mousedown", function(event) {
      const rect = thEl.getBoundingClientRect();
      if (rect.width > 12 && rect.right - event.pageX < 12) {
        thEl.classList.add("noclick");
      }
    });
    thEl.addEventListener("dblclick", function(event) {
      const rect = thEl.getBoundingClientRect();
      if (rect.width > 12 && rect.right - event.pageX < 12) {
        event.stopPropagation();
        event.preventDefault();
        event.stopImmediatePropagation();
      } else {
        return;
      }
      const tableBodyEl = el.querySelector(".el-table__body-wrapper .el-table__body");
      const tbodyEl = tableBodyEl?.querySelector("tbody");
      if (!tbodyEl) {
        return;
      }
      const tableRowEls = tbodyEl.querySelectorAll(".el-table__row");
      let maxWidth = getTextWidth(thEl.textContent || "");
      for (let k = 0; k < tableRowEls.length; k++) {
        const rowEl = tableRowEls[k];
        const tdEls = rowEl.querySelectorAll(".el-table__cell");
        const tdEl = tdEls[i];
        if (!tdEl) {
          continue;
        }
        if (tdEl.querySelector("input")) {
          maxWidth = 0;
          break;
        }
        if (tdEl.querySelector("button")) {
          maxWidth = 0;
          break;
        }
        if (tdEl.querySelector(".el-switch")) {
          maxWidth = 0;
          break;
        }
        if (tdEl.querySelector(".el-select")) {
          maxWidth = 0;
          break;
        }
        const text = tdEl.textContent;
        if (!text) {
          continue;
        }
        const textWidth = getTextWidth(text);
        if (textWidth > maxWidth) {
          maxWidth = textWidth;
        }
      }
      const bindValue = bindVal();
      const tableColumns = bindValue.tableColumns;
      const storeColumns = bindValue.storeColumns;
      const offset = bindValue.offset || 1;
      const column = tableColumns[i - offset];
      if (maxWidth > 0) {
        column.width = maxWidth + 20;
      }
      storeColumns(tableColumns);
    });
  });
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
        const offset = bindValue.offset || 1;
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
          if (ii === oldIndex && !hasSetOldIndex) {
            oldIndex = i;
            hasSetOldIndex = true;
          }
          if (ii === newIndex && !hasSetNewIndex) {
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
      preventOnFilter: false,
    }
  );
}
