import {
  useI18n,
} from "@/locales/i18n";

import type {
  MaybeRefOrGetter,
} from "vue";

import dayjs from "dayjs";

import {
  subscribe,
  publish,
  unSubscribe,
} from "@/compositions/websocket";

/** 初始化内置搜索条件 */
export function initBuiltInSearch<T>(
  props: Record<string, any>,
  builtInSearchType: { [key: string]: string },
  propsNotInSearch: string[],
) {
  const builtInSearch = computed(() => {
    const entries = Object.entries(props).filter(([ key, val ]) => !propsNotInSearch.includes(key) && val);
    for (const item of entries) {
      if (builtInSearchType[item[0]] === "0|1") {
        item[1] = (item[1] === "0" ? 0 : 1) as any;
        continue;
      }
      if (builtInSearchType[item[0]] === "number[]") {
        if (!Array.isArray(item[1])) {
          item[1] = [ item[1] as string ]; 
        }
        item[1] = (item[1] as any).map((itemTmp: string) => Number(itemTmp));
        continue;
      }
      if (builtInSearchType[item[0]] === "string[]") {
        if (!Array.isArray(item[1])) {
          item[1] = [ item[1] as string ]; 
        }
        continue;
      }
    }
    return Object.fromEntries(entries) as unknown as T;
  });
  return builtInSearch;
}

/** 初始化内置变量 */
export function initBuiltInModel<T>(
  props: Record<string, any>,
  builtInSearchType: { [key: string]: string },
  propsNotInSearch: string[],
) {
  const builtInModel = computed(() => {
    const entries = Object.entries(props).filter(([ key, val ]) => !propsNotInSearch.includes(key) && val);
    for (const item of entries) {
      if (builtInSearchType[item[0]] === "0|1") {
        item[1] = (item[1] === "0" ? 0 : 1) as any;
        continue;
      }
      if (builtInSearchType[item[0]] === "number[]" || builtInSearchType[item[0]] === "number") {
        if (Array.isArray(item[1]) && item[1].length === 1) {
          if (!isNaN(Number(item[1][0]))) {
            item[1] = Number(item[1][0]) as any;
          }
        } else {
          if (!isNaN(Number(item[1]))) {
            item[1] = Number(item[1]) as any;
          }
        }
        continue;
      }
      if (builtInSearchType[item[0]] === "string[]" || builtInSearchType[item[0]] === "string") {
        if (Array.isArray(item[1]) && item[1].length === 1) {
          item[1] = item[1][0]; 
        }
        continue;
      }
    }
    return Object.fromEntries(entries) as unknown as T;
  });
  return builtInModel;
}

export function usePage<T>(
  dataGrid: Function,
  opt?: {
    pageSizes?: number[],
    isPagination?: boolean, // 默认为true
  },
) {
  
  let pageSizes = $ref(opt?.pageSizes || [ 20, 50, 100 ]);
  
  // 分页
  let page = $ref({
    size: pageSizes[0],
    current: 1,
    total: 0,
  });

  // 每页显示发生改变
  async function pgSizeChg(size: number) {
    if (opt?.isPagination === false) {
      return;
    }
    page.size = size;
    await dataGrid(true);
  }

  // 页码发生改变
  async function pgCurrentChg(current: number) {
    if (opt?.isPagination === false) {
      return;
    }
    page.current = current;
    await dataGrid();
  }
  
  async function onPageDown() {
    if (opt?.isPagination === false) {
      return;
    }
    const totalPageSize = Math.ceil(page.total / page.size);
    if (page.current < totalPageSize) {
      page.current++;
      await dataGrid();
    }
  }
  
  async function onPageUp() {
    if (opt?.isPagination === false) {
      return;
    }
    if (page.current > 1) {
      page.current--;
      await dataGrid();
    }
  }
  
  return $$({
    page,
    pageSizes,
    pgSizeChg,
    pgCurrentChg,
    onPageDown,
    onPageUp,
  });
}

export function useSelect<T = any, Id = string>(
  tableRef: Ref<InstanceType<typeof ElTable> | undefined>,
  opts?: {
    tableSelectable?: ((row: T, index: number) => boolean),
    multiple?: MaybeRefOrGetter<boolean>,
    tabIndex?: number,
  },
) {
  
  const watch3Stop = watch(
    () => tableRef.value,
    () => {
      if (!tableRef.value) {
        return;
      }
      const tableEl = tableRef.value.$el as HTMLDivElement;
      if (!tableEl) {
        return;
      }
      tableEl.tabIndex = opts?.tabIndex ?? 0;
      tableEl.focus();
    },
  );
  
  function getRowKey() {
    const rowKey = tableRef.value?.rowKey;
    if (!rowKey) {
      return;
    }
    if (typeof rowKey === "string") {
      return rowKey;
    }
    throw new Error("暂不支持 function 类型的 rowKey");
  }
  
  /** 当前多行选中的数据 */
  let selectedIds: Id[] = $ref([ ]);
  let prevSelectedIds: Id[] = $ref([ ]);
  
  function useSelectedIds() {
    if (!tableRef.value || !tableRef.value.data) {
      return;
    }
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    const newSelectList: any[] = [ ];
    const select2falseList: any[] = [ ];
    for (let i = 0; i < tableRef.value.data.length; i++) {
      const item = tableRef.value.data[i];
      if (selectedIds.includes(item[rowKey])) {
        newSelectList.push(item);
      } else if (prevSelectedIds.includes(item[rowKey])) {
        select2falseList.push(item);
      }
    }
    if (newSelectList.length > 0) {
      const selectFn = function() {
        if (!tableRef.value) {
          return;
        }
        for (let i = 0; i < newSelectList.length; i++) {
          const item = newSelectList[i];
          tableRef.value.toggleRowSelection(item, true);
        }
        for (let i = 0; i < select2falseList.length; i++) {
          const item = select2falseList[i];
          tableRef.value.toggleRowSelection(item, false);
        }
      };
      selectFn();
      nextTick(selectFn);
    } else {
      tableRef.value.clearSelection();
    }
  }
  
  const watch1Stop = watch(
    () => tableRef.value?.data,
    () => {
      if (!tableRef.value?.data) return;
      useSelectedIds();
    },
    {
      immediate: true,
    },
  );
  
  const watch2Stop = watch(
    () => selectedIds,
    (_newSelectIds: Id[], oldSelectIds: Id[]) => {
      if (!tableRef.value?.data) return;
      prevSelectedIds = oldSelectIds;
      useSelectedIds();
    },
  );
  
  /**
   * 多行或单行勾选
   */
  function selectChg(list: T[], row?: T) {
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    let multiple = true;
    if (opts?.multiple === false) {
      multiple = false;
    }
    if (isRef(opts?.multiple) && opts?.multiple.value === false) {
      multiple = false;
    }
    if (!row) {
      if (list.length === 0) {
        selectedIds = [ ];
      } else {
        if (!multiple) {
          tableRef.value?.clearSelection();
          selectedIds = [ (list[0] as any)[rowKey] ];
        } else {
          for (let i = 0; i < list.length; i++) {
            const item = list[i] as any;
            if (!selectedIds.includes(item[rowKey])) {
              selectedIds.push(item[rowKey]);
            }
          }
        }
      }
    } else {
      const id = (row as any)[rowKey];
      if (list.includes(row)) {
        if (!selectedIds.includes(id)) {
          if (!multiple) {
            selectedIds = [ id ];
          } else {
            selectedIds = [ ...selectedIds, id ];
          }
        }
      } else {
        if (selectedIds.includes(id)) {
          selectedIds = selectedIds.filter((item) => item !== id);
        }
      }
    }
  }
  
  function scrollIntoViewIfNeeded(idx: number) {
    const table = tableRef.value?.$el;
    if (!table) {
      return;
    }
    const tableBody = table.querySelector(".el-table__body-wrapper");
    if (!tableBody) {
      return;
    }
    const tableRow = tableBody.querySelector(`.el-table__row:nth-child(${ idx + 1 })`);
    if (!tableRow) {
      return;
    }
    tableRow.scrollIntoViewIfNeeded(true);
  }
  
  /**
   * 键盘按键向上按键
   */
  function onRowUp(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.ctrlKey) {
      onRowCtrlUp();
      return;
    }
    if (e.shiftKey) {
      onRowShiftUp();
      return;
    }
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    const data = tableRef.value?.data;
    if (!data || data.length === 0) {
      return;
    }
    let idx = 0;
    if (selectedIds.length > 0) {
      idx = data.findIndex((item) => item.id === selectedIds[ selectedIds.length - 1 ]);
      if (idx === -1) {
        idx = 0;
      }
    }
    const hasMoveMap = new Map<Id, boolean>();
    while (true) {
      idx--;
      if (idx < 0) {
        idx = data.length - 1;
      }
      if (!data[idx]?.[rowKey]) {
        break;
      }
      if (hasMoveMap.has(data[idx][rowKey])) {
        break;
      }
      hasMoveMap.set(data[idx][rowKey], true);
      if (opts?.tableSelectable && !opts?.tableSelectable(data[idx], idx)) {
        continue;
      }
      selectedIds = [ data[idx][rowKey] ];
      scrollIntoViewIfNeeded(idx);
      break;
    }
  }
  
  /**
   * 键盘按键ctrl+向上按键
   */
  function onRowCtrlUp() {
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    const data = tableRef.value?.data;
    if (!data || data.length === 0) {
      return;
    }
    let idx = -1;
    const hasMoveMap = new Map<Id, boolean>();
    while (true) {
      idx++;
      if (idx >= data.length) {
        break;
      }
      if (!data[idx]?.[rowKey]) {
        break;
      }
      if (hasMoveMap.has(data[idx][rowKey])) {
        break;
      }
      hasMoveMap.set(data[idx][rowKey], true);
      if (opts?.tableSelectable && !opts?.tableSelectable(data[idx], idx)) {
        continue;
      }
      selectedIds = [ data[idx][rowKey] ];
      scrollIntoViewIfNeeded(idx);
      break;
    }
  }
  
  /**
   * 键盘按键shift+向上按键
   */
  function onRowShiftUp() {
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    const data = tableRef.value?.data;
    if (!data || data.length === 0) {
      return;
    }
    let idx = 0;
    if (selectedIds.length > 0) {
      idx = data.findIndex((item) => item.id === selectedIds[ selectedIds.length - 1 ]);
      if (idx === -1) {
        idx = 0;
      }
    }
    const hasMoveMap = new Map<Id, boolean>();
    while (true) {
      idx--;
      if (idx < 0) {
        idx = data.length - 1;
      }
      if (!data[idx]?.[rowKey]) {
        break;
      }
      if (hasMoveMap.has(data[idx][rowKey])) {
        break;
      }
      hasMoveMap.set(data[idx][rowKey], true);
      if (opts?.tableSelectable && !opts?.tableSelectable(data[idx], idx)) {
        continue;
      }
      selectedIds = [
        ...selectedIds,
        data[idx][rowKey],
      ];
      scrollIntoViewIfNeeded(idx);
      break;
    }
    // if (selectedIds.length === 0 && data[data.length - 1]?.[rowKey]) {
    //   const selectedIdx = data.length - 1;
    //   selectedIds = [
    //     data[selectedIdx][rowKey],
    //   ];
    //   scrollIntoViewIfNeeded(selectedIdx);
    //   return;
    // }
    // const idx = data.findIndex((item) => item[rowKey] === selectedIds[ selectedIds.length - 1 ]);
    // if (idx === -1 || idx === 0 && data[data.length - 1]?.[rowKey]) {
    //   const selectedIdx = data.length - 1;
    //   selectedIds = [
    //     ...selectedIds,
    //     data[selectedIdx][rowKey],
    //   ];
    //   scrollIntoViewIfNeeded(selectedIdx);
    //   return;
    // }
    // const selectedIdx = idx - 1;
    // if (data[selectedIdx]?.[rowKey]) {
    //   selectedIds = [
    //     ...selectedIds,
    //     data[selectedIdx][rowKey],
    //   ];
    //   scrollIntoViewIfNeeded(selectedIdx);
    // }
  }
  
  /**
   * 键盘按键向下按键
   */
  function onRowDown(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.ctrlKey) {
      onRowCtrlDown();
      return;
    }
    if (e.shiftKey) {
      onRowShiftDown();
      return;
    }
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    const data = tableRef.value?.data;
    if (!data || data.length === 0) {
      return;
    }
    let idx = 0;
    if (selectedIds.length > 0) {
      idx = data.findIndex((item) => item.id === selectedIds[ selectedIds.length - 1 ]);
      if (idx === -1) {
        idx = 0;
      }
    }
    const hasMoveMap = new Map<Id, boolean>();
    while (true) {
      idx++;
      if (idx >= data.length) {
        idx = 0;
      }
      if (!data[idx]?.[rowKey]) {
        break;
      }
      if (hasMoveMap.has(data[idx][rowKey])) {
        break;
      }
      hasMoveMap.set(data[idx][rowKey], true);
      if (opts?.tableSelectable && !opts?.tableSelectable(data[idx], idx)) {
        continue;
      }
      selectedIds = [ data[idx][rowKey] ];
      scrollIntoViewIfNeeded(idx);
      break;
    }
  }
  
  /**
   * 键盘按键向左按键
   */
  function onRowLeft(e: KeyboardEvent) {
    if (!tableRef.value) {
      return;
    }
    const tableEl = tableRef.value.$el as HTMLDivElement;
    if (!tableEl) {
      return;
    }
    const tableBody = tableEl.querySelector(".el-table__body-wrapper");
    if (!tableBody) {
      return;
    }
    const scrollbar = tableBody.querySelector(".el-scrollbar__wrap");
    if (!scrollbar) {
      return;
    }
    if (e.ctrlKey) {
      scrollbar.scrollLeft = 0;
    } else {
      scrollbar.scrollLeft -= 100;
    }
  }
  
  /**
   * 键盘按键向右按键
   */
  function onRowRight(e: KeyboardEvent) {
    if (!tableRef.value) {
      return;
    }
    const tableEl = tableRef.value.$el as HTMLDivElement;
    if (!tableEl) {
      return;
    }
    const tableBody = tableEl.querySelector(".el-table__body-wrapper");
    if (!tableBody) {
      return;
    }
    const scrollbar = tableBody.querySelector(".el-scrollbar__wrap");
    if (!scrollbar) {
      return;
    }
    if (e.ctrlKey) {
      scrollbar.scrollLeft = scrollbar.scrollWidth;
    } else {
      scrollbar.scrollLeft += 100;
    }
  }
  
  /**
   * 键盘按键Home按键
   */
  function onRowHome(e: KeyboardEvent) {
    if (!e.shiftKey) {
      onRowCtrlUp();
      return;
    }
    if (!tableRef.value) {
      return;
    }
    const tableEl = tableRef.value.$el as HTMLDivElement;
    if (!tableEl) {
      return;
    }
    const tableBody = tableEl.querySelector(".el-table__body-wrapper");
    if (!tableBody) {
      return;
    }
    const scrollbar = tableBody.querySelector(".el-scrollbar__wrap");
    if (!scrollbar) {
      return;
    }
    scrollbar.scrollLeft = 0;
  }
  
  /**
   * 键盘按键End按键
   */
  function onRowEnd(e: KeyboardEvent) {
    if (!e.shiftKey) {
      onRowCtrlDown();
      return;
    }
    if (!tableRef.value) {
      return;
    }
    const tableEl = tableRef.value.$el as HTMLDivElement;
    if (!tableEl) {
      return;
    }
    const tableBody = tableEl.querySelector(".el-table__body-wrapper");
    if (!tableBody) {
      return;
    }
    const scrollbar = tableBody.querySelector(".el-scrollbar__wrap");
    if (!scrollbar) {
      return;
    }
    scrollbar.scrollLeft = scrollbar.scrollWidth;
  }
  
  /**
   * 键盘按键ctrl+向下按键
   */
  function onRowCtrlDown() {
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    const data = tableRef.value?.data;
    if (!data || data.length === 0) {
      return;
    }
    let idx = data.length;
    const hasMoveMap = new Map<Id, boolean>();
    while (true) {
      idx--;
      if (idx < 0) {
        break;
      }
      if (!data[idx]?.[rowKey]) {
        break;
      }
      if (hasMoveMap.has(data[idx][rowKey])) {
        break;
      }
      hasMoveMap.set(data[idx][rowKey], true);
      if (opts?.tableSelectable && !opts?.tableSelectable(data[idx], idx)) {
        continue;
      }
      selectedIds = [ data[idx][rowKey] ];
      scrollIntoViewIfNeeded(idx);
      break;
    }
  }
  
  /**
   * 键盘按键shift+向下按键
   */
  function onRowShiftDown() {
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    const data = tableRef.value?.data;
    if (!data || data.length === 0) {
      return;
    }
    let idx = 0;
    if (selectedIds.length > 0) {
      idx = data.findIndex((item) => item.id === selectedIds[ selectedIds.length - 1 ]);
      if (idx === -1) {
        idx = 0;
      }
    }
    const hasMoveMap = new Map<Id, boolean>();
    while (true) {
      idx++;
      if (idx >= data.length) {
        break;
      }
      if (!data[idx]?.[rowKey]) {
        break;
      }
      if (hasMoveMap.has(data[idx][rowKey])) {
        break;
      }
      hasMoveMap.set(data[idx][rowKey], true);
      if (opts?.tableSelectable && !opts?.tableSelectable(data[idx], idx)) {
        continue;
      }
      selectedIds = [
        ...selectedIds,
        data[idx][rowKey],
      ];
      scrollIntoViewIfNeeded(idx);
      break;
    }
  }
  
  /**
   * 点击一行
   */
  function onRow(row: T, column?: TableColumnCtx<T>, e?: PointerEvent) {
    if (column && column.type !== "selection") {
      if (e && e.ctrlKey) {
        onRowCtrl(row, column, e);
        return;
      }
      if (e && e.shiftKey) {
        onRowShift(row, column, e);
        return;
      }
    }
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    let multiple = true;
    if (opts?.multiple === false) {
      multiple = false;
    }
    if (isRef(opts?.multiple) && opts?.multiple.value === false) {
      multiple = false;
    }
    const tableSelectable = opts?.tableSelectable;
    if (tableSelectable && !tableSelectable(row, tableRef.value?.data?.findIndex((item) => item[rowKey] === (row as any)[rowKey]) ?? 0)) {
      if (column && column.type !== "selection") {
        selectedIds = [ ];
      }
      return;
    }
    const id = (row as any)[rowKey];
    if (column && column.type === "selection") {
      if (selectedIds.includes(id)) {
        selectedIds = selectedIds.filter((item) => item !== id);
      } else {
        if (multiple) {
          selectedIds = [
            ...selectedIds,
            id,
          ];
        } else {
          selectedIds = [ id ];
        }
      }
    } else {
      if (!row) {
        selectedIds = [ ];
      } else {
        selectedIds = [ id ];
      }
    }
  }
  
  /**
   * 按住ctrl键之后点击一行
   */
  function onRowCtrl(row: T, column?: TableColumnCtx<T>, e?: MouseEvent) {
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    let multiple = true;
    if (opts?.multiple === false) {
      multiple = false;
    }
    if (isRef(opts?.multiple) && opts?.multiple.value === false) {
      multiple = false;
    }
    const tableSelectable = opts?.tableSelectable;
    if (tableSelectable && !tableSelectable(row, tableRef.value?.data?.findIndex((item) => item[rowKey] === (row as any)[rowKey]) ?? 0)) {
      return;
    }
    const id = (row as any)[rowKey];
    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter((item) => item !== id);
    } else {
      if (multiple) {
        selectedIds = [
          ...selectedIds,
          id,
        ];
      } else {
        selectedIds = [ id ];
      }
    }
  }
  
  /**
   * 按住shift键之后点击一行
   */
  function onRowShift(row: T, column?: TableColumnCtx<T>, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    const tableData = tableRef.value?.data;
    if (!tableData || tableData.length === 0) {
      return;
    }
    const id = (row as any)[rowKey];
    if (selectedIds.length === 0) {
      selectedIds = [ id ];
      return;
    }
    const idx = tableData.findIndex((item) => item[rowKey] === selectedIds[ selectedIds.length - 1 ]);
    if (idx === -1) {
      selectedIds = [ id ];
      return;
    }
    const idx2 = tableData.findIndex((item) => item[rowKey] === id);
    if (idx2 === -1) {
      selectedIds = [ id ];
      return;
    }
    const minIdx = Math.min(idx, idx2);
    const maxIdx = Math.max(idx, idx2);
    selectedIds = tableData.slice(minIdx, maxIdx + 1).map((item) => item[rowKey]);
  }
  
  /**
   * 表格每一行的css样式
   * @param {{ row: T, rowIndex: number }} { row, rowIndex }
   */
  function rowClassName({ row, rowIndex }: { row: T, rowIndex: number }) {
    return selectedIds.includes((row as any).id) ? "table_current_row" : "";
  }
  
  function tableFocus() {
    const tableEl = tableRef.value?.$el as HTMLDivElement;
    if (!tableEl) {
      return;
    }
    tableEl.focus();
  }
  
  onUnmounted(function() {
    watch1Stop();
    watch2Stop();
    watch3Stop();
  });
  
  return $$({
    selectedIds,
    selectChg,
    onRow,
    onRowUp,
    onRowDown,
    onRowLeft,
    onRowRight,
    onRowHome,
    onRowEnd,
    rowClassName,
    tableFocus,
  });
}

export function useSelectOne<T>(
  tableRef: Ref<InstanceType<typeof ElTable> | undefined>,
  opts?: {
    tableSelectable?: (row: T, index?: number) => boolean,
    tabIndex?: number,
  },
) {
  
  const watch3Stop = watch(
    () => tableRef.value,
    () => {
      if (!tableRef.value) {
        return;
      }
      const tableEl = tableRef.value.$el as HTMLDivElement;
      if (!tableEl) {
        return;
      }
      tableEl.tabIndex = opts?.tabIndex ?? 0;
      tableEl.focus();
    },
  );
  
  function getRowKey() {
    const rowKey = tableRef.value?.rowKey;
    if (!rowKey) {
      return;
    }
    if (typeof rowKey === "string") {
      return rowKey;
    }
    throw new Error("暂不支持 function 类型的 rowKey");
  }
  
  /** 当前多行选中的数据 */
  let selectedIds = $ref<string[]>([ ]);
  let prevSelectedIds = $ref<string[]>([ ]);
  
  function useSelectedIds() {
    if (!tableRef.value || !tableRef.value.data) {
      return;
    }
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    const newSelectList = [ ];
    const select2falseList = [ ];
    for (let i = 0; i < tableRef.value.data.length; i++) {
      const item = tableRef.value.data[i];
      if (selectedIds.includes(item[rowKey])) {
        newSelectList.push(item);
      } else if (prevSelectedIds.includes(item[rowKey])) {
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
  
  const watch1Stop = watch(
    () => tableRef.value?.data,
    () => {
      if (!tableRef.value?.data) return;
      useSelectedIds();
    },
    {
      immediate: true,
    },
  );
  
  const watch2Stop = watch(
    () => selectedIds,
    (_newSelectIds: string[], oldSelectIds: string[]) => {
      if (!tableRef.value?.data) return;
      prevSelectedIds = oldSelectIds;
      useSelectedIds();
    },
  );
  
  /**
   * 多行或单行勾选
   */
  function selectChg(list: T[], row?: T) {
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    if (!row) {
      if (list.length === 0) {
        selectedIds = [ ];
      } else {
        selectedIds = [ (list as any)[0][rowKey] ];
      }
    } else {
      const id = (row as any)[rowKey];
      if (list.includes(row)) {
        if (!selectedIds.includes(id)) {
          selectedIds = [ id ];
        }
      } else {
        if (selectedIds.includes(id)) {
          selectedIds = selectedIds.filter((item) => item !== id);
        }
      }
    }
  }
  
  /**
   * 点击一行
   */
  async function onRow(row: T, column: TableColumnCtx<T>, event: PointerEvent) {
    const rowKey = getRowKey();
    if (!rowKey) {
      return;
    }
    const tableSelectable = opts?.tableSelectable;
    if (tableSelectable && !tableSelectable(row)) {
      if (column.type !== "selection") {
        selectedIds = [ ];
      }
      return;
    }
    const id = (row as any)[rowKey];
    if (column.type === "selection") {
      if (selectedIds.includes(id)) {
        selectedIds = selectedIds.filter((item) => item !== id);
      } else {
        selectedIds = [
          id,
        ];
      }
    } else {
      if (!row) {
        selectedIds = [ ];
      } else {
        selectedIds = [ id ];
      }
    }
  }
  
  /**
   * 表格每一行的css样式
   */
  function rowClassName({ row, rowIndex }: { row: T, rowIndex: number }) {
    return selectedIds.includes((row as any).id) ? "table_current_row" : "";
  }
  
  function tableFocus() {
    const tableEl = tableRef.value?.$el as HTMLDivElement;
    if (!tableEl) {
      return;
    }
    tableEl.focus();
  }
  
  onUnmounted(function() {
    watch1Stop();
    watch2Stop();
    watch3Stop();
  });
  
  return $$({
    selectedIds,
    selectChg,
    onRow,
    rowClassName,
    tableFocus,
  });
}

export function useTableColumns<T>(
  _tableColumns: any,
  opt?: {
    /**
     * 表格列存储的唯一编码, 同一路由下必须唯一
     * @type {string}
     */
    persistKey?: string,
  },
) {
  const tableColumns: Ref<ColumnType[]> = _tableColumns;
  const route = useRoute();
  
  const routePath = route.path;
  
  let tableColumn0s = [ ...tableColumns.value ];
  
  let tableColumn1s: ColumnType[]|undefined = undefined;
  
  const persistKey = `TableColumns-${ routePath }--${ opt?.persistKey }`;
  
  if (opt?.persistKey) {
    try {
      const str = window.localStorage.getItem(persistKey);
      if (str) {
        tableColumn1s = JSON.parse(str);
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
    } catch (err) {
      console.error(err);
      window.localStorage.removeItem(persistKey);
      tableColumn1s = undefined;
    }
  }
  
  tableColumns.value = tableColumn1s || [ ...tableColumn0s ];
  
  async function storeColumns(tableColumns2?: any, force?: boolean) {
    if (tableColumns2) {
      tableColumns.value = tableColumns2;
    }
    if (force) {
      const oldTableColumns = tableColumns.value;
      tableColumns.value = [ ];
      await nextTick();
      tableColumns.value = [ ...oldTableColumns ];
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

/**
 * 列表页中的月份控件搜索条件
 */
export function monthrangeSearch(search: any, key: string, event?: Date[]) {
  search[key] = search[key] || [ ];
  if (!event || event.length === 0) {
    search[key] = [ ];
    return;
  }
  if (event[0] && event[1]) {
    search[key][0] = dayjs(event[0]).startOf("month").format("YYYY-MM-DD");
    search[key][1] = dayjs(event[1]).endOf("month").format("YYYY-MM-DD");
  }
}

export async function initListI18ns() {
  const {
    initSysI18ns,
  } = useI18n("");
  const codes = [
    "新增",
    "请选择需要 复制 的数据",
    "复制",
    "请选择需要编辑的数据",
    "编辑",
    "请选择需要删除的数据",
    "确定删除已选择的 {0} 条数据",
    "确定",
    "取消",
    "删除 {0} 条数据成功",
    "请选择需要 彻底删除 的数据",
    "确定 彻底删除 已选择的 {0} 条数据",
    "彻底删除 {0} 条数据成功",
    "锁定",
    "解锁",
    "请选择需要 锁定 的数据",
    "请选择需要 解锁 的数据",
    "锁定 {0} 条数据成功",
    "解锁 {0} 条数据成功",
    "请选择需要还原的数据",
    "确定还原已选择的 {0} 条数据",
    "还原 {0} 条数据成功",
    "请输入",
    "请选择",
    "导出失败",
    "批量导入",
    "正在导入...",
  ];
  await initSysI18ns(codes);
}

type UseSubscribeListData<T> = {
  action: "add",
  id: T,
} | {
  action: "edit",
  id: T,
} | {
  action: "delete",
  ids: T[],
} | {
  action: "import",
  num: number,
} | {
  action: "revert",
  num: number,
} | {
  action: "forceDelete",
  num: number,
};

/** 表格数据的实时监听 */
export function useSubscribeList<T>(
  pagePath: string,
  callback: (data: UseSubscribeListData<T>) => Promise<void> | void,
) {
  async function add(id?: T) {
    if (!id) {
      return;
    }
    await callback({
      action: "add",
      id,
    });
  }
  async function edit(id?: T) {
    if (!id) {
      return;
    }
    await callback({
      action: "edit",
      id,
    });
  }
  async function deleteFn(ids?: T[]) {
    if (!ids || ids.length === 0) {
      return;
    }
    await callback({
      action: "delete",
      ids,
    });
  }
  async function importFn(num?: number) {
    if (!num) {
      return;
    }
    await callback({
      action: "import",
      num,
    });
  }
  async function revertFn(num?: number) {
    if (!num) {
      return;
    }
    await callback({
      action: "revert",
      num,
    });
  }
  async function forceDeleteFn(num?: number) {
    if (!num) {
      return;
    }
    await callback({
      action: "forceDelete",
      num,
    });
  }
  onBeforeUnmount(() => {
    unSubscribe(
      JSON.stringify({
        pagePath,
        action: "add",
      }),
      add,
    );
    unSubscribe(
      JSON.stringify({
        pagePath,
        action: "edit",
      }),
      edit,
    );
    unSubscribe(
      JSON.stringify({
        pagePath,
        action: "delete",
      }),
      deleteFn,
    );
    unSubscribe(
      JSON.stringify({
        pagePath,
        action: "import",
      }),
      importFn,
    );
    unSubscribe(
      JSON.stringify({
        pagePath,
        action: "revert",
      }),
      revertFn,
    );
    unSubscribe(
      JSON.stringify({
        pagePath,
        action: "forceDelete",
      }),
      forceDeleteFn,
    );
  });
  
  subscribe<T>(
    JSON.stringify({
      pagePath,
      action: "add",
    }),
    add,
  );
  
  subscribe<T>(
    JSON.stringify({
      pagePath,
      action: "edit",
    }),
    edit,
  );
  
  subscribe<T[]>(
    JSON.stringify({
      pagePath,
      action: "delete",
    }),
    deleteFn,
  );
  
  subscribe<number>(
    JSON.stringify({
      pagePath,
      action: "import",
    }),
    importFn,
  );
  
  subscribe<number>(
    JSON.stringify({
      pagePath,
      action: "revert",
    }),
    revertFn,
  );
  
  subscribe<number>(
    JSON.stringify({
      pagePath,
      action: "forceDelete",
    }),
    forceDeleteFn,
  );
}
