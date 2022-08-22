<template>
<div
  flex="~ [1_0_0] col"
  overflow-hidden
  w="full"
  h="full"
  p="[6px]"
  box="border"
>
  <div
    m="x-1.5"
    overflow-auto
  >
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
            @keyup.enter.native.stop
            :height="300"
            class="form_input"
            :set="search.menu_id = search.menu_id || [ ]"
            :model-value="search.menu_id"
            @update:model-value="search.menu_id = $event"
            placeholder="请选择父菜单"
            :options="menu4SelectV2"
            filterable
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
            :loading="!inited"
            @change="searchClk"
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
      <el-form-item prop="idsChecked">
        <el-checkbox
          v-model="idsChecked"
          :false-label="0"
          :true-label="1"
          @change="searchClk"
          :disabled="selectedIds.length === 0"
        >
          <span>已选择</span>
          <span>(</span>
          <span
            m="x-1"
            text="green"
            :style="{ color: selectedIds.length === 0 ? 'var(--el-disabled-text-color)': undefined }"
          >
            {{ selectedIds.length }}
          </span>
          <span>)</span>
        </el-checkbox>
        <el-icon
          title="清空已选择"
          v-show="selectedIds.length > 0"
          @click="clearSelect"
          cursor="pointer"
          m="x-3"
          text="hover:[red]"
        >
          <CircleClose />
        </el-icon>
      </el-form-item>
      
      <div style="min-width: 20px;"></div>
      <el-form-item
        self-start
        flex="~ nowrap"
        min="w-[170px]"
      >
        <el-button
          plain
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
  <div
    m="x-1.5 t-1.5"
    flex
  >
    <template v-if="search.is_deleted !== 1">
      <el-button
        type="primary"
        plain
        :icon="CirclePlus"
        @click="openAdd"
      >
        新增
      </el-button>
      <el-button
        type="primary"
        plain
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
        plain
        :icon="Download"
        @click="exportClk"
      >
        导出
      </el-button>
      <el-button
        plain
        :icon="Upload"
        @click="openUploadClk"
      >
        导入
      </el-button>
    </template>
    <template v-else>
      <el-button
        type="primary"
        plain
        :icon="CircleCheck"
        @click="revertByIdsEfc"
      >
        还原
      </el-button>
      <el-button
        plain
        :icon="Download"
        @click="exportClk"
      >
        导出
      </el-button>
    </template>
    <el-button
      plain
      :icon="Refresh"
      @click="searchClk"
    >
      刷新
    </el-button>
    <div
      flex="[1_0_0]"
      overflow-hidden
    >
    </div>
    <TableShowColumns
      :tableColumns="tableColumns"
      @resetColumns="resetColumns"
      @storeColumns="storeColumns"
    >
      列操作
    </TableShowColumns>
  </div>
  <div
    flex="~ [1_0_0] col"
    overflow-hidden
    m="t-1.5"
  >
    <div
      flex="~ [1_0_0] col"
      overflow-hidden
    >
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
        :empty-text="inited ? '加载中...' : undefined"
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
          <template v-else-if="'_menu_id' === col.prop">
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
          <template v-else-if="'lbl' === col.prop">
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
          <template v-else-if="'route_path' === col.prop">
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
          <template v-else-if="'route_query' === col.prop">
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
          <template v-else-if="'_is_enabled' === col.prop">
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
          <template v-else-if="'order_by' === col.prop">
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
          <template v-else-if="'rem' === col.prop">
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
          
          <template v-else>
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              header-align="center"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
        </template>
        
      </el-table>
    </div>
    <div
      justify="end"
      p="[2px_5px_2px_0px]"
      flex
    >
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
import { deepCompare } from "@/utils/ObjectUtil";

import {
  usePage,
  useSelect,
  useTableColumns,
  ColumnType,
} from "@/compositions/List";

import Detail from "./Detail.vue";

import ListSelectDialog from "@/components/ListSelectDialog.vue";

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
  type MenuModel,
  type MenuSearch,
} from "#/types";
import {
  findAllAndCountMenu,
  findAllMenu,
} from "./Api";

const usrStore = useUsrStore();

let inited = $ref(false);

const emit = defineEmits([
  "selectedIdsChg",
]);

/** 表格 */
let tableRef = $ref<InstanceType<typeof ElTable>>();

/** 导出Excel */
async function exportClk() {
  const id = await exportExcel(search, [ sort ]);
  downloadById(id);
}

/** 搜索 */
function initSearch() {
  return {
    is_deleted: 0,
  } as MenuSearch;
}

let search = $ref(initSearch());

/** 搜索 */
async function searchClk() {
  await dataGrid(true);
}

/** 重置搜索 */
async function searchReset() {
  search = initSearch();
  idsChecked = 0;
  await searchClk();
}

/** 清空搜索框事件 */
async function searchIptClr() {
  await searchClk();
}

const props = defineProps<{
  is_deleted?: string;
  ids?: string[]; //ids
  selectedIds?: string[]; //已选择行的id列表
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

const builtInSearchType: { [key: string]: string } = {
  is_deleted: "0|1",
  ids: "string[]",
  type: "string[]",
  _type: "string[]",
  menu_id: "string[]",
  _menu_id: "string[]",
  is_enabled: "number[]",
  _is_enabled: "string[]",
  order_by: "number[]",
  _order_by: "string[]",
};

const propsNotInSearch: string[] = [
  "selectedIds",
];

/** 内置搜索条件 */
const builtInSearch = $computed(() => {
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
  return Object.fromEntries(entries) as unknown as MenuSearch;
});

/** 内置变量 */
const builtInModel = $computed(() => {
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
  return Object.fromEntries(entries) as unknown as MenuModel;
});

/** 分页功能 */
let {
  page,
  pageSizes,
  pgSizeChg,
  pgCurrentChg,
} = $(usePage<MenuModel>(dataGrid));

/** 表格选择功能 */
let {
  selectedIds,
  selectChg,
  rowClassName,
  rowClk,
  rowClkCtrl,
  rowClkShift,
} = $(useSelect<MenuModel>($$(tableRef)));

watch(
  () => selectedIds,
  () => {
    emit("selectedIdsChg", selectedIds);
  },
);

/** 取消已选择筛选 */
async function clearSelect() {
  selectedIds = [ ];
  idsChecked = 0;
  await dataGrid(true);
}

/** 若传进来的参数或者url有selectedIds，则使用传进来的选中行 */
watch(
  () => props.selectedIds,
  (val) => {
    if (Array.isArray(val)) {
      selectedIds = val;
    } else if (val) {
      selectedIds = [ val ];
    } else {
      selectedIds = [ ];
    }
  },
  {
    immediate: true,
  },
);

let idsChecked = $ref<0|1>(0);

/** 表格数据 */
let tableData = $ref<MenuModel[]>([ ]);

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

/** 表格列 */
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

let detailRef = $ref<InstanceType<typeof Detail> | undefined>();

let menuInfo = $ref<{
  count: number;
  data: MenuModel[];
}>({
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

/** 获取下拉框列表 */
async function getSelectListEfc() {
  [
    menuInfo,
  ] = await Promise.all([
    findAllAndCountMenu(
      undefined,
      {
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

/** 刷新表格 */
async function dataGrid(isCount = false) {
  const pgSize = page.size;
  const pgOffset = (page.current - 1) * page.size;
  let data: MenuModel[];
  let count: number|undefined = 0;
  let search2 = {
    ...search,
    ...builtInSearch,
    idsChecked: undefined,
  };
  if (idsChecked) {
    search2.ids = selectedIds;
  }
  if (search2.ids && search2.ids.length === 0) {
    search2.ids = undefined;
  }
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
}

/** 排序 */
let sort: Sort = $ref({
  prop: "order_by",
  order: "ascending",
});

/** 排序 */
async function sortChange(
  { prop, order, column }: { column: TableColumnCtx<MenuModel> } & Sort,
) {
  sort.prop = prop;
  sort.order = order;
  await dataGrid();
}

/** 打开增加页面 */
async function openAdd() {
  if (!detailRef) {
    return;
  }
  const dialogResult = await detailRef.showDialog({
    title: "增加",
    action: "add",
    builtInModel,
  });
  const changedIds = dialogResult?.changedIds;
  if (changedIds && changedIds.length > 0) {
    selectedIds = [ ...changedIds ];
    await Promise.all([
      dataGrid(true),
    ]);
  }
}

let uploadFileDialogRef = $ref<InstanceType<typeof UploadFileDialog> | undefined>();

/**
 * 弹出导入窗口
*/
async function openUploadClk() {
  if (!uploadFileDialogRef) {
    return;
  }
  const file = await uploadFileDialogRef.showDialog({
    title: "导入菜单",
  });
  if (file) {
    const msg = await importFile(file);
    if (msg) {
      MessageBox.success(msg);
    }
    await dataGrid(true);
  }
}

/** 打开修改页面 */
async function openEdit() {
  if (!detailRef) {
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(`请选择需要编辑的数据!`);
    return;
  }
  const dialogResult = await detailRef.showDialog({
    title: "修改",
    action: "edit",
    builtInModel,
    model: {
      ids: selectedIds,
    },
  });
  const changedIds = dialogResult?.changedIds;
  if (changedIds && changedIds.length > 0) {
    await Promise.all([
      dataGrid(),
    ]);
  }
}

/** 点击删除 */
async function deleteByIdsEfc() {
  if (selectedIds.length === 0) {
    ElMessage.warning(`请选择需要删除的数据!`);
    return;
  }
  try {
    await ElMessageBox.confirm(`确定删除已选择的 ${ selectedIds.length } 条数据?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await deleteByIds(selectedIds);
  if (num) {
    selectedIds = [ ];
    await Promise.all([
      dataGrid(true),
    ]);
    ElMessage.success(`删除 ${ num } 条数据成功!`);
  }
}

/** 点击还原 */
async function revertByIdsEfc() {
  if (selectedIds.length === 0) {
    ElMessage.warning(`请选择需要还原的数据!`);
    return;
  }
  try {
    await ElMessageBox.confirm(`确定还原已选择的 ${ selectedIds.length } 条数据?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await revertByIds(selectedIds);
  if (num) {
    search.is_deleted = 0;
    await Promise.all([
      dataGrid(true),
    ]);
    ElMessage.success(`还原 ${ num } 条数据成功!`);
  }
}

async function initFrame() {
  if (usrStore.authorization) {
    await Promise.all([
      searchClk(),
      getSelectListEfc(),
    ]);
  }
  inited = true;
}

watch(
  () => builtInSearch,
  async (newVal, oldVal) => {
    if (!deepCompare(oldVal, newVal)) {
      await initFrame();
    }
  },
);

usrStore.onLogin(initFrame);

initFrame();
</script>

<style lang="scss" scoped>
.search_form {
  grid-template-columns: repeat(
    4,
    minmax(min-content, max-content)
    210px
  );
  @apply grid justify-items-end items-center gap-y-[6px];
}
.form_label {
  @apply mr-[3px] text-gray ml-[6px] whitespace-nowrap overflow-hidden;
}
.form_label::after {
  content: ":";
}
.form_input {
  @apply w-full;
}
</style>
