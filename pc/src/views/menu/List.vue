<template>
<div class="wrap_div">
  <div class="search_div">
    <el-form
      :model="search"
      ref="searchFormRef"
      inline-message
      class="search_form"
      @keyup.enter.native="searchClk"
    >
      
      <label class="form_label">
        父菜单
      </label>
      <el-form-item prop="menu_id">
        <el-select-v2
          :height="300"
          class="form_input"
          @keyup.enter.native.stop
          :set="search.menu_id = search.menu_id || [ ]"
          v-model="search.menu_id"
          placeholder="请选择父菜单"
          :options="menu4SelectV2"
          filterable
          clearable
          multiple
          collapse-tags
          collapse-tags-tooltip
          :loading="!inited"
          :remote="menuInfo.count > SELECT_V2_SIZE"
          :remote-method="menuFilterEfc"
          @clear="searchIptClr"
        ></el-select-v2>
      </el-form-item>
      
      <label class="form_label">
        名称
      </label>
      <el-form-item prop="lblLike">
        <el-input
          class="form_input"
          v-model="search.lblLike"
          placeholder="请输入名称"
          clearable
          @clear="searchIptClr"
        ></el-input>
      </el-form-item>
      
      <div style="min-width: 20px;"></div>
      <el-form-item prop="is_deleted">
        <el-checkbox
          :set="search.is_deleted = search.is_deleted || 0"
          v-model="search.is_deleted"
          :false-label="0"
          :true-label="1"
          @change="searchClk"
        >
          回收站
        </el-checkbox>
      </el-form-item>
      
      <div style="min-width: 20px;"></div>
      <el-form-item
        class="form_btn_item"
      >
        <el-button
          type="primary"
          :icon="Search"
          @click="searchClk"
        >
          查询
        </el-button>
        <el-button
          plain
          :icon="Delete"
          @click="searchReset"
        >
          重置
        </el-button>
      </el-form-item>
      
    </el-form>
  </div>
  <div class="toolbar_div">
    <template v-if="search.is_deleted === 0">
      <el-button
        type="primary"
        :icon="CirclePlus"
        @click="openAdd"
      >
        新增
      </el-button>
      <el-button
        type="primary"
        :icon="Edit"
        @click="openEdit"
      >
        编辑
      </el-button>
      <el-button
        type="danger"
        plain
        :icon="CircleClose"
        @click="deleteByIdsEfc"
      >
        删除
      </el-button>
    </template>
    <template v-else>
      <el-button
        type="primary"
        :icon="CircleCheck"
        @click="revertByIdsEfc"
      >
        还原
      </el-button>
    </template>
    <el-button
      :icon="Download"
      @click="exportClk"
    >
      导出
    </el-button>
    <el-button
      :icon="Refresh"
      @click="searchClk"
    >
      刷新
    </el-button>
  </div>
  <div class="table_div">
    <div class="table_wrap">
      <el-table
        :data="tableData"
        @select="selectChg"
        @select-all="selectChg"
        @row-click="rowClk"
        :row-class-name="rowClassName"
        border
        size="small"
        height="100%"
        row-key="id"
        ref="tableRef"
        :empty-text="inited ? undefined : '加载中...'"
        @sort-change="sortChange"
        :default-sort="defaultSort"
        @click.ctrl="rowClkCtrl"
        @click.shift="rowClkShift"
      >
        
        <el-table-column
          prop="id"
          type="selection"
          align="center"
          width="42"
        ></el-table-column>
        
        <el-table-column
          prop="_type"
          label="类型"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        
        <el-table-column
          prop="_menu_id"
          label="父菜单"
          min-width="140"
          sortable="custom"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        
        <el-table-column
          prop="lbl"
          label="名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        
        <el-table-column
          prop="route_path"
          label="路由"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        
        <el-table-column
          prop="route_query"
          label="参数"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        
        <el-table-column
          prop="_is_enabled"
          label="启用"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        
        <el-table-column
          prop="order_by"
          label="排序"
          sortable="custom"
          align="right"
          header-align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        
        <el-table-column
          prop="rem"
          label="备注"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        
      </el-table>
    </div>
    <div class="pagination_row">
      <el-pagination
        background
        :page-sizes="pageSizes"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pgSizeChg"
        @current-change="pgCurrentChg"
        :current-page="page.current"
        :total="page.total"
      ></el-pagination>
    </div>
  </div>
  <Detail
    ref="detailRef"
  ></Detail>
</div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import useUsrStore from "@/store/usr";
import {
  ElMessage,
  ElMessageBox,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElSelectV2,
  ElInput,
  ElInputNumber,
  ElCheckbox,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
} from "element-plus";
import {
  Sort,
} from "element-plus/lib/components/table/src/table/defaults";
import {
  Search,
  Refresh,
  Delete,
  Edit,
  Download,
  CirclePlus,
  CircleClose,
  CircleCheck,
} from "@element-plus/icons-vue";
import LinkList from "@/components/LinkList.vue";
import { SELECT_V2_SIZE } from "../common/App";
import {
  usePage,
  useSearch,
  useSelect,
} from "@/compositions/List";
import Detail from "./Detail.vue";
import {
  findAll,
  findAllAndCount,
  deleteByIds,
  revertByIds,
  exportExcel,
  updateById,
} from "./Api";

import {
  MenuModel,
  MenuSearch,
} from "./Model";
import {
  findAllAndCountMenu,
  findAllMenu,
} from "./Api";

const usrStore = useUsrStore();

let inited = $ref(false);

// 表格
let tableRef = $ref<InstanceType<typeof ElTable>>();

// 导出Excel
async function exportClk() {
  await exportExcel(search);
}

// 搜索功能
let {
  search,
  searchFormRef,
  searchClk,
  searchReset,
  searchIptClr,
} = $(useSearch<MenuSearch>(
  dataGrid,
));

// 分页功能
let {
  page,
  pageSizes,
  pgSizeChg,
  pgCurrentChg,
} = $(usePage<MenuModel>(dataGrid));

// 表格选择功能
let {
  selectList,
  selectChg,
  rowClassName,
  rowClk,
  rowClkCtrl,
  rowClkShift,
} = $(useSelect<MenuModel>(<any>$$(tableRef)));

// 表格数据
let tableData: MenuModel[] = $ref([ ]);

let detailRef = $ref<InstanceType<typeof Detail>>();

let menuInfo: {
  count: number;
  data: MenuModel[];
} = $ref({
  count: 0,
  data: [ ],
});

let menu4SelectV2 = $computed(() => {
  return menuInfo.data.map((item) => {
    return {
      value: item.id,
      label: item.lbl,
    };
  });
});

// 获取下拉框列表
async function getSelectListEfc() {
  [ menuInfo, ] = await Promise.all([
    findAllAndCountMenu({
      orderBy: "order_by",
      orderDec: "ascending",
    }, { pgSize: SELECT_V2_SIZE }, { notLoading: true }),
  ]);
}

// 父菜单下拉框远程搜索
async function menuFilterEfc(query: string) {
  menuInfo.data = await findAllMenu({
    orderBy: "order_by",
    orderDec: "ascending",
    lbl: query ? `%${ query }%` : undefined,
  }, { pgSize: SELECT_V2_SIZE }, { notLoading: true });
}

// 刷新表格
async function dataGrid(isCount = false) {
  const pgSize = page.size;
  const pgOffset = (page.current - 1) * page.size;
  const search2: any = { };
  const searchKeys = Object.keys(search);
  for (let i = 0; i < searchKeys.length; i++) {
    const key = searchKeys[i];
    const val = search[key];
    if ([ "orderBy", "orderDec" ].includes(key)) {
      search2[key] = val;
      continue;
    }
    search2[key] = val;
  }
  if (!search2.orderBy && defaultSort && defaultSort.prop) {
    search2.orderBy = defaultSort.prop;
    search2.orderDec = defaultSort.order;
  }
  let data: MenuModel[];
  let count = 0;
  if (isCount) {
    const rvData = await findAllAndCount(search2, { pgSize, pgOffset });
    data = rvData.data;
    count = rvData.count || 0;
  } else {
    data = await findAll(search2, { pgSize, pgOffset });
    count = undefined;
  }
  tableData = data || [ ];
  if (count != null) {
    page.total = count;
  }
  selectList = [ ];
  if (tableRef) {
    tableRef.clearSelection();
  }
}

// 默认排序
let defaultSort = $ref<Sort>({
  prop: "order_by",
  order: "ascending",
});

// 排序
async function sortChange(
  { prop, order, column }: { column: InstanceType<typeof ElTableColumn> } & Sort,
) {
  search.orderBy = prop;
  search.orderDec = order;
  await dataGrid();
}

// 打开增加页面
async function openAdd() {
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "增加",
    action: "add",
  });
  if (changedIds && changedIds.length > 0) {
    await dataGrid(true);
    selectList = tableData.filter((item) => changedIds.includes(item.id));
  }
}

// 打开修改页面
async function openEdit() {
  if (selectList.length === 0) {
    ElMessage.warning(`请选择需要编辑的数据!`);
    return;
  }
  const ids = tableData.filter((item) => selectList.includes(item)).map((item) => item.id);
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "修改",
    action: "edit",
    model: {
      ids,
    },
  });
  if (changedIds && changedIds.length > 0) {
    await dataGrid();
    selectList = tableData.filter((item) => changedIds.includes(item.id));
  }
}

// 点击删除
async function deleteByIdsEfc() {
  if (selectList.length === 0) {
    ElMessage.warning(`请选择需要删除的数据!`);
    return;
  }
  try {
    await ElMessageBox.confirm(`确定删除已选择的 ${ selectList.length } 条数据?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const ids = selectList.map((item) => item.id);
  const num = await deleteByIds(ids);
  if (num) {
    await dataGrid(true);
    ElMessage.success(`删除 ${ num } 条数据成功!`);
  }
}

// 点击还原
async function revertByIdsEfc() {
  if (selectList.length === 0) {
    ElMessage.warning(`请选择需要还原的数据!`);
    return;
  }
  try {
    await ElMessageBox.confirm(`确定还原已选择的 ${ selectList.length } 条数据?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const ids = selectList.map((item) => item.id);
  const num = await revertByIds(ids);
  if (num) {
    await dataGrid(true);
    ElMessage.success(`还原 ${ num } 条数据成功!`);
  }
}

async function initFrame() {
  if (usrStore.access_token) {
    await searchClk();
    await getSelectListEfc();
  }
  inited = true;
}

watch(
  () => usrStore.access_token,
  initFrame,
  {
    immediate: true,
  },
);
</script>

<style lang="scss" scoped>
.wrap_div {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.search_div {
  margin-top: 10px;
  margin-left: 10px;
  overflow-x: auto;
}
.search_form {
  display: grid;
  grid-template-columns: repeat(
    4,
    minmax(min-content, max-content)
    minmax(min-content, max-content)
  );
  justify-items: end;
  align-items: center;
  grid-row-gap: 15px;
}
.form_label {
  margin-right: 3px;
  color: gray;
  margin-left: 10px;
  white-space: nowrap;
}
.form_label::after {
  content: ":";
}
.form_input {
  max-width: 240px;
  min-width: 200px;
}
.form_btn_item {
  display: flex;
  flex-wrap: nowrap;
  justify-self: flex-start;
  min-width: 170px;
}
.toolbar_div {
  margin-left: 10px;
  margin-top: 10px;
}
.table_div {
  flex: 1 0 0;
  overflow: hidden;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}
.table_wrap {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.pagination_row {
  padding: 2px 5px 2px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
