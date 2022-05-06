import { Ref, watch } from "vue";
import {
  ElForm,
  ElTable,
} from "element-plus";
import { useRoute } from "vue-router";
import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";

export function usePage<T>(dataGrid: Function, pageSizes0: number[] = [ 30, 50, 100 ]) {
  let pageSizes = $ref(pageSizes0);
  // 分页
  let page = $ref({
    size: pageSizes[0],
    current: 1,
    total: 0,
  });

  // 每页显示发生改变
  async function pgSizeChg(size: number) {
    page.size = size;
    await dataGrid(true);
  }

  // 页码发生改变
  async function pgCurrentChg(current: number) {
    page.current = current;
    await dataGrid();
  }
  
  return $$({
    page,
    pageSizes,
    pgSizeChg,
    pgCurrentChg,
  });
}

export function useSelect<T>(tableRef: Ref<InstanceType<typeof ElTable>>) {
  
  /** 当前多行选中的数据 */
  let selectedIds: string[] = $ref([ ]);
  let prevSelectedIds: string[] = $ref([ ]);
  
  function useSelectedIds() {
    if (!tableRef.value || !tableRef.value.data) return;
    const newSelectList = [ ];
    const select2falseList = [ ];
    for (let i = 0; i < tableRef.value.data.length; i++) {
      const item = tableRef.value.data[i];
      if (selectedIds.includes(item.id)) {
        newSelectList.push(item);
      } else if (prevSelectedIds.includes(item.id)) {
        select2falseList.push(item);
      }
    }
    if (newSelectList.length > 0) {
      for (let i = 0; i < newSelectList.length; i++) {
        const item = newSelectList[i];
        tableRef.value.toggleRowSelection(item, true);
      }
      for (let i = 0; i < select2falseList.length; i++) {
        const item = select2falseList[i];
        tableRef.value.toggleRowSelection(item, false);
      }
    } else {
      tableRef.value.clearSelection();
    }
  }
  
  watch(
    () => tableRef.value?.data,
    () => {
      if (!tableRef.value?.data) return;
      useSelectedIds();
    },
    {
      immediate: true,
    },
  );
  
  watch(
    () => selectedIds,
    (newSelectIds: string[], oldSelectIds: string[]) => {
      if (!tableRef.value?.data) return;
      prevSelectedIds = oldSelectIds;
      useSelectedIds();
    },
  );
  
  /**
   * 多行或单行勾选
   * @param {(T & { id: string })[]} list
   * @param {(T & { id: string })} row?
   */
  function selectChg(list: (T & { id: string })[], row?: (T & { id: string })) {
    if (!row) {
      if (list.length === 0) {
        selectedIds = [ ];
      } else {
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (!selectedIds.includes(item.id)) {
            selectedIds.push(item.id);
          }
        }
      }
    } else {
      if (list.includes(row)) {
        if (!selectedIds.includes(row.id)) {
          selectedIds = [ ...selectedIds, row.id ];
        }
      } else {
        if (selectedIds.includes(row.id)) {
          selectedIds = selectedIds.filter((id) => id !== row.id);
        }
      }
    }
  }
  
  /**
   * 点击一行
   * @param {(T & { id: string })} row
   * @param {TableColumnCtx<T>} column
   * @param {PointerEvent} event
   */
  async function rowClk(row: T & { id: string }, column: TableColumnCtx<T>, event: PointerEvent) {
    if (column.type === "selection") {
      if (selectedIds.includes(row.id)) {
        selectedIds = selectedIds.filter((id) => id !== row.id);
      } else {
        selectedIds = [ ...selectedIds, row.id ];
      }
    } else {
      if (!row) {
        selectedIds = [ ];
      } else {
        selectedIds = [ row.id ];
      }
    }
  }
  
  /**
   * 按住ctrl键之后点击一行
   * @param {PointerEvent} _event
   */
  function rowClkCtrl(_event: PointerEvent) {
    const id = selectedIds[0];
    if (id) {
      if (!prevSelectedIds.includes(id)) {
        selectedIds = [ ...prevSelectedIds, id ];
      } else {
        selectedIds = prevSelectedIds.filter((item) => item !== id);
      }
    }
  }
  
  /**
   * 按住shift键之后点击一行
   * @param {PointerEvent} _event
   */
  function rowClkShift(_event: PointerEvent) {
    const id = selectedIds[0];
    const tableData = tableRef.value.data;
    let fromIdx = tableData.length - 1;
    for (let i = 0; i < prevSelectedIds.length; i++) {
      const item = prevSelectedIds[i];
      const idx = tableData.indexOf(item);
      if (idx !== -1 && idx < fromIdx) {
        fromIdx = idx;
      }
    }
    if (fromIdx === tableData.length - 1) {
      fromIdx = 0;
    }
    const toIndex = tableData.findIndex((item) => item === id);
    selectedIds = tableData.slice(Math.min(fromIdx, toIndex), Math.max(fromIdx, toIndex) + 1);
  }
  
  /**
   * 表格每一行的css样式
   * @param {{ row: T, rowIndex: number }} { row, rowIndex }
   */
  function rowClassName({ row, rowIndex }: { row: T, rowIndex: number }) {
    return selectedIds.includes((row as any).id) ? "table_current_row" : "";
  }
  
  return $$({
    selectedIds,
    selectChg,
    rowClk,
    rowClkCtrl,
    rowClkShift,
    rowClassName,
  });
}

export interface ColumnType {
  prop: string,
  label: string,
  hide?: boolean,
  width?: string|number,
}

export function useTableColumns<T>(
  tableColumns: Ref<ColumnType[]>,
  opt?: {
    /**
     * 表格列存储的唯一编码, 同一路由下必须唯一
     * @type {string}
     */
    persistKey?: string,
  },
) {
  const route = useRoute();
  
  const routePath = route.path;
  
  let tableColumn0s = [ ...tableColumns.value ];
  
  let tableColumn1s: ColumnType[] = undefined;
  
  const persistKey = `TableColumns-${ routePath }--${ opt?.persistKey }`;
  
  if (opt?.persistKey) {
    const str = window.localStorage.getItem(persistKey);
    if (str) {
      try {
        tableColumn1s = JSON.parse(str);
      } catch (err) {
        console.error(err);
        window.localStorage.removeItem(persistKey);
        tableColumn1s = undefined;
      }
    }
    if (tableColumn1s) {
      let hasChg = false;
      for (let i = 0; i < tableColumn0s.length; i++) {
        const col0 = tableColumn0s[i];
        if (tableColumn1s.some((col1) => col1.prop === col0.prop)) continue;
        tableColumn1s.splice(i, 0, col0);
        hasChg = true;
      }
      const rmvIdxs: number[] = [ ];
      for (let i = 0; i < tableColumn1s.length; i++) {
        const col1 = tableColumn1s[i];
        if (tableColumn0s.some((col0) => col1.prop === col0.prop)) continue;
        rmvIdxs.push(i);
        hasChg = true;
      }
      for (let i = 0; i < rmvIdxs.length; i++) {
        const rmvIdx = rmvIdxs[i];
        tableColumn1s.splice(rmvIdx, 1);
      }
      if (hasChg) {
        window.localStorage.setItem(persistKey, JSON.stringify(tableColumn1s));
      }
    }
  }
  
  tableColumns.value = tableColumn1s || [ ...tableColumn0s ];
  
  function storeColumns(tableColumns2?: any) {
    if (tableColumns2) {
      tableColumns.value = tableColumns2;
    }
    window.localStorage.setItem(persistKey, JSON.stringify(tableColumns.value));
  }
  
  function deleteColumns() {
    window.localStorage.removeItem(persistKey);
  }
  
  function headerDragend(
    newWidth: number,
    _oldWidth: number,
    column: TableColumnCtx<T>,
    _event: MouseEvent,
  ) {
    const prop = column.property;
    const idx = tableColumns.value.findIndex((item) => item.prop === prop);
    if (idx !== -1) {
      tableColumns.value[idx] = { ...tableColumns.value[idx], width: newWidth };
      storeColumns();
    }
  }
  
  function resetColumns() {
    tableColumns.value = [ ...tableColumn0s ];
    deleteColumns();
  }
  
  return $$({
    headerDragend,
    resetColumns,
    storeColumns,
    deleteColumns,
  });
}
