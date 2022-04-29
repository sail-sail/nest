<template>
<div class="flex-1 flex-shrink-0 overflow-hidden flex flex-col w-full h-full">
  <div class="search_div">
    <el-form
      size="default"
      :model="search"
      ref="searchFormRef"
      inline-message
      class="search_form"
      @keyup.enter.native="searchClk"
    >
      
      <template v-if="builtInSearch?.menu_id == null">
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
      </template>
      
      <template v-if="builtInSearch?.lblLike == null && builtInSearch?.lbl == null">
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
      </template>
      
      <template v-if="builtInSearch?.is_deleted == null">
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
      </template>
      
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
    <template v-if="search.is_deleted !== 1">
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
      <el-button
        :icon="Upload"
        @click="openUploadClk"
      >
        导入
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
    <div class="flex-[1_0_0]">
    </div>
    <TableShowColumns
      :tableColumns="tableColumns"
      @resetColumns="resetColumns"
      @storeColumns="storeColumns"
    >
      列操作
    </TableShowColumns>
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
        :default-sort="sort"
        @click.ctrl="rowClkCtrl"
        @click.shift="rowClkShift"
        @header-dragend="headerDragend"
        v-header-order-drag="() => ({ tableColumns, storeColumns, offset: 1 })"
      >
        
        <el-table-column
          prop="id"
          type="selection"
          align="center"
          width="50"
        ></el-table-column>
        
        <template v-for="(col, i) in tableColumns" :key="i + col">
          
          <!-- 类型 -->
          <template v-if="'_type' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 父菜单 -->
          <template v-if="'_menu_id' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              min-width="140"
              sortable="custom"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 名称 -->
          <template v-if="'lbl' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 路由 -->
          <template v-if="'route_path' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 参数 -->
          <template v-if="'route_query' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 启用 -->
          <template v-if="'_is_enabled' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 排序 -->
          <template v-if="'order_by' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              sortable="custom"
              align="right"
              header-align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 备注 -->
          <template v-if="'rem' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
        </template>
        
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
  <UploadFileDialog ref="uploadFileDialogRef"></UploadFileDialog>
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
  ElDatePicker,
  ElButton,
  ElIcon,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElLink,
} from "element-plus";
import { MessageBox } from "@/components/MessageBox";
import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import {
  Sort,
} from "element-plus/lib/components/table/src/table/defaults";
import {
  Search,
  Refresh,
  Delete,
  Edit,
  Download,
  Upload,
  CirclePlus,
  CircleClose,
  CircleCheck,
} from "@element-plus/icons-vue";
import TableShowColumns from "@/components/TableShowColumns.vue";
import UploadFileDialog from "@/components/UploadFileDialog.vue";
import { downloadById } from "@/utils/axios";
import LinkList from "@/components/LinkList.vue";
import { SELECT_V2_SIZE } from "../common/App";
import { deepCompare } from "@/utils/ObjectUtil";
import {
  usePage,
  useSelect,
  useTableColumns,
  ColumnType,
} from "@/compositions/List";
import Detail from "./Detail.vue";
import {
  findAll,
  findAllAndCount,
  deleteByIds,
  revertByIds,
  exportExcel,
  updateById,
  importFile,
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
  const id = await exportExcel(search, [ sort ]);
  downloadById(id);
}

// 搜索
function initSearch() {
  return <MenuSearch>{
    is_deleted: 0,
  };
}

let search = $ref(initSearch());

// 搜索
async function searchClk() {
  await dataGrid(true);
}

// 重置搜索
async function searchReset() {
  search = initSearch();
  await searchClk();
}

// 清空搜索框事件
async function searchIptClr() {
  await searchClk();
}

const props = defineProps<{
  is_deleted?: string;
  id?: string; //ID
  type?: string|string[]; //类型
  menu_id?: string|string[]; //父菜单
  _menu_id?: string|string[]; //父菜单
  lbl?: string; //名称
  lblLike?: string; //名称
  route_path?: string; //路由
  route_pathLike?: string; //路由
  route_query?: string; //参数
  route_queryLike?: string; //参数
  is_enabled?: string|string[]; //启用
  order_by?: string; //排序
  rem?: string; //备注
  remLike?: string; //备注
}>();

const builtInSearchType = {
  type: "string[]",
  _type: "string[]",
  menu_id: "string[]",
  _menu_id: "string[]",
  is_enabled: "number[]",
  _is_enabled: "string[]",
  order_by: "number[]",
  _order_by: "string[]",
};

// 内置搜索条件
const builtInSearch = $computed(() => {
  const entries = Object.entries(props).filter(([ _, val ]) => val);
  for (const item of entries) {
    if (item[0] === "is_deleted") {
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
  return <MenuSearch> Object.fromEntries(entries);
});

// 内置变量
const builtInModel = $computed(() => {
  const entries = Object.entries(props).filter(([ _, val ]) => val);
  for (const item of entries) {
    if (item[0] === "is_deleted") {
      item[1] = (item[1] === "0" ? 0 : 1) as any;
      continue;
    }
    if (builtInSearchType[item[0]] === "number[]" || builtInSearchType[item[0]] === "number") {
      if (Array.isArray(item[1]) && item[1].length === 1) {
        if (!isNaN(Number(item[1][0]))) {
          item[1] = <any> Number(item[1][0]);
        }
      } else {
        if (!isNaN(Number(item[1]))) {
          item[1] = <any> Number(item[1]);
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
  return <MenuModel> Object.fromEntries(entries);
});

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

let tableColumns = $ref<ColumnType[]>([
  {
    label: "类型",
    prop: "_type",
  },
  {
    label: "父菜单",
    prop: "_menu_id",
  },
  {
    label: "名称",
    prop: "lbl",
  },
  {
    label: "路由",
    prop: "route_path",
  },
  {
    label: "参数",
    prop: "route_query",
  },
  {
    label: "启用",
    prop: "_is_enabled",
  },
  {
    label: "排序",
    prop: "order_by",
  },
  {
    label: "备注",
    prop: "rem",
  },
]);

// 表格列
let {
  headerDragend,
  resetColumns,
  storeColumns,
} = $(useTableColumns<MenuModel>(
  $$(tableColumns),
  {
    persistKey: "0",
  },
));

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
  [
    menuInfo,
  ] = await Promise.all([
    findAllAndCountMenu(
      undefined,
      {
        pgSize: SELECT_V2_SIZE,
      },
      [
        {
          prop: "order_by",
          order: "ascending",
        },
      ],
      {
        notLoading: true,
      },
    ),
  ]);
}

// 父菜单下拉框远程搜索
async function menuFilterEfc(query: string) {
  menuInfo.data = await findAllMenu(
    {
      lblLike: query,
    },
    {
      pgSize: SELECT_V2_SIZE,
    },
    [
      {
        prop: "order_by",
        order: "ascending",
      },
    ],
    {
      notLoading: true,
    },
  );
}

// 刷新表格
async function dataGrid(isCount = false) {
  const pgSize = page.size;
  const pgOffset = (page.current - 1) * page.size;
  let data: MenuModel[];
  let count = 0;
  let search2 = {
    ...search,
    ...builtInSearch,
  };
  if (isCount) {
    const rvData = await findAllAndCount(search2, { pgSize, pgOffset }, [ sort ]);
    data = rvData.data;
    count = rvData.count || 0;
  } else {
    data = await findAll(search2, { pgSize, pgOffset }, [ sort ]);
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

// 排序
let sort = $ref<Sort>({
  prop: "order_by",
  order: "ascending",
});

// 排序
async function sortChange(
  { prop, order, column }: { column: TableColumnCtx<MenuModel> } & Sort,
) {
  sort.prop = prop;
  sort.order = order;
  await dataGrid();
}

// 打开增加页面
async function openAdd() {
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "增加",
    action: "add",
    builtInModel,
  });
  if (changedIds && changedIds.length > 0) {
    await Promise.all([
      dataGrid(true),
    ]);
    selectList = tableData.filter((item) => changedIds.includes(item.id));
  }
}

let uploadFileDialogRef = $ref<InstanceType<typeof UploadFileDialog>>();

/**
 * 弹出导入窗口
*/
async function openUploadClk() {
  if (!uploadFileDialogRef) return;
  const file = await uploadFileDialogRef.showDialog({
    title: "导入菜单",
  });
  if (file) {
    const msg = await importFile(file);
    MessageBox.success(msg);
    await dataGrid(true);
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
    builtInModel,
    model: {
      ids,
    },
  });
  if (changedIds && changedIds.length > 0) {
    await Promise.all([
      dataGrid(),
    ]);
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
    await Promise.all([
      dataGrid(true),
    ]);
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
    await Promise.all([
      dataGrid(true),
    ]);
    ElMessage.success(`还原 ${ num } 条数据成功!`);
  }
}

async function initFrame() {
  if (usrStore.access_token) {
    await Promise.all([
      searchClk(),
      getSelectListEfc(),
    ]);
  }
  inited = true;
}

watch(
  () => usrStore.access_token,
  initFrame,
);

watch(
  () => builtInSearch,
  async (newVal, oldVal) => {
    if (!deepCompare(oldVal, newVal)) {
      await initFrame();
    }
  },
  {
    immediate: true,
  },
);
</script>

<style lang="scss" scoped>
.search_div {
  margin-top: 6px;
  margin-left: 6px;
  overflow-x: auto;
}
.search_form {
  display: grid;
  grid-template-columns: repeat(
    4,
    minmax(min-content, max-content)
    210px
  );
  justify-items: end;
  align-items: center;
  grid-row-gap: 6px;
}
.form_label {
  margin-right: 3px;
  color: gray;
  margin-left: 6px;
  white-space: nowrap;
  overflow: hidden;
}
.form_label::after {
  content: ":";
}
.form_input {
  width: 100%;
}
.form_btn_item {
  display: flex;
  flex-wrap: nowrap;
  justify-self: flex-start;
  min-width: 170px;
}
.toolbar_div {
  margin-left: 6px;
  margin-top: 6px;
  margin-right: 6px;
  display: flex;
}
.table_div {
  flex: 1 0 0;
  overflow: hidden;
  margin-top: 6px;
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
