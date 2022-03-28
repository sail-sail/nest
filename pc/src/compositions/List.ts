import { Ref } from "vue";
import {
  ElForm,
  ElTable,
} from "element-plus";

export function useSearch<T>(dataGrid: Function, defModel: T) {
  if ((<any>defModel).is_deleted == null) {
    (<any>defModel).is_deleted = 0;
  }
  let search = $ref(defModel);
  
  // 搜索
  let searchFormRef = $ref<InstanceType<typeof ElForm>>();
  
  async function searchClk() {
    await dataGrid(true);
  }
  
  // 重置搜索
  async function searchReset() {
    searchFormRef.resetFields();
    await searchClk();
  }
  
  // 清空某个搜索框
  async function searchIptClr() {
    await searchClk();
  }
  
  return $$({
    search,
    searchFormRef,
    searchClk,
    searchReset,
    searchIptClr,
  });
}

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
  // 当前多行选中的数据
  let selectList: T[] = $ref([ ]);
  
  // 多行选中
  function selectChg(list: any, row?: any) {
    selectList = list;
  }
  
  async function rowClk(row: T) {
    if (tableRef.value) {
      tableRef.value.clearSelection();
    }
    if (!row) {
      selectList = [ ];
    } else {
      selectList = [ row ];
      if (tableRef.value) {
        tableRef.value.toggleRowSelection(row, true);
      }
    }
  }
  
  function rowClassName({ row, rowIndex }: { row: T, rowIndex: number }) {
    return selectList.includes(row) ? "table_current_row" : "";
  }
  
  return $$({
    selectList,
    selectChg,
    rowClk,
    rowClassName,
  });
}
