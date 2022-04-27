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
  let selectList: T[] = $ref([ ]);
  let prevSelectList: T[] = $ref([ ]);
  
  watch(
    () => selectList,
    (newSelectList: T[], oldSelectList: T[]) => {
      prevSelectList = oldSelectList;
      if (tableRef.value) {
        if (newSelectList.length > 0) {
          for (let i = 0; i < newSelectList.length; i++) {
            const item = newSelectList[i];
            tableRef.value.toggleRowSelection(item, true);
          }
        } else {
          tableRef.value.clearSelection();
        }
        if (oldSelectList && oldSelectList.length > 0) {
          for (let i = 0; i < oldSelectList.length; i++) {
            const item = oldSelectList[i];
            if (!newSelectList.includes(item)) {
              tableRef.value.toggleRowSelection(item, false);
            }
          }
        }
      }
    },
  );
  
  /**
   * 多行或单行勾选
   * @param {T[]} list
   * @param {T} row?
   */
  function selectChg(list: T[], row?: T) {
    selectList = list;
  }
  
  /**
   * 点击一行
   * @param {T} row
   */
  async function rowClk(row: T) {
    if (!row) {
      selectList = [ ];
    } else {
      selectList = [ row ];
    }
  }
  
  /**
   * 按住ctrl键之后点击一行
   * @param {PointerEvent} _event
   */
  function rowClkCtrl(_event: PointerEvent) {
    const row = selectList[0];
    if (row) {
      if (!prevSelectList.includes(row)) {
        selectList = [ ...prevSelectList, row ];
      } else {
        selectList = prevSelectList.filter((item) => item !== row);
      }
    }
  }
  
  /**
   * 按住shift键之后点击一行
   * @param {PointerEvent} _event
   */
  function rowClkShift(_event: PointerEvent) {
    const row = selectList[0];
    const tableData = tableRef.value.data;
    let fromIdx = tableData.length - 1;
    for (let i = 0; i < prevSelectList.length; i++) {
      const item = prevSelectList[i];
      const idx = tableData.indexOf(item);
      if (idx !== -1 && idx < fromIdx) {
        fromIdx = idx;
      }
    }
    if (fromIdx === tableData.length - 1) {
      fromIdx = 0;
    }
    const toIndex = tableData.indexOf(row);
    selectList = tableData.slice(Math.min(fromIdx, toIndex), Math.max(fromIdx, toIndex) + 1);
  }
  
  /**
   * 表格每一行的css样式
   * @param {{ row: T, rowIndex: number }} { row, rowIndex }
   */
  function rowClassName({ row, rowIndex }: { row: T, rowIndex: number }) {
    return selectList.includes(row) ? "table_current_row" : "";
  }
  
  return $$({
    selectList,
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
