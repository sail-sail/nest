<template>
<div
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
  un-w="full"
  un-h="full"
  un-p="l-1.5 r-1.5 t-1.5"
  un-box-border
>
  <div
    un-m="x-1.5"
    un-overflow-auto
  >
    <el-form
      ref="searchFormRef"
      size="default"
      :model="search"
      inline-message
      label-width="auto"
      
      un-grid="~ cols-[repeat(auto-fit,280px)]"
      un-gap="x-2 y-2"
      un-justify-items-end
      un-items-center
      
      @keyup.enter="searchClk"
    >
      
      <template v-if="builtInSearch?.type == null">
        <el-form-item
          :label="n('类型')"
          prop="type"
        >
          <DictSelect
            :set="search.type = search.type || [ ]"
            un-w="full"
            :model-value="search.type"
            @update:model-value="search.type = $event"
            code="menu_type"
            :placeholder="`${ ns('请选择') } ${ n('类型') }`"
            multiple
            @change="searchClk"
          ></DictSelect>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.menu_id == null">
        <el-form-item
          label="父菜单"
          prop="menu_id"
        >
          <CustomSelect
            :set="search.menu_id = search.menu_id || [ ]"
            un-w="full"
            :model-value="search.menu_id"
            @update:model-value="search.menu_id = $event"
            :method="getMenuList"
            :options-map="((item: MenuModel) => {
              return {
                label: item.lbl,
                value: item.id,
              };
            })"
            :placeholder="`${ ns('请选择') } ${ n('父菜单') }`"
            multiple
            @change="searchClk"
          ></CustomSelect>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.lblLike == null && builtInSearch?.lbl == null">
        <el-form-item
          :label="n('名称')"
          prop="lblLike"
        >
          <el-input
            v-model="search.lblLike"
            un-w="full"
            :placeholder="`${ ns('请输入') } ${ n('名称') }`"
            clearable
            @clear="searchIptClr"
          ></el-input>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.is_deleted == null">
        <el-form-item
          label=" "
          prop="is_deleted"
        >
          <el-checkbox
            :set="search.is_deleted = search.is_deleted || 0"
            v-model="search.is_deleted"
            :false-label="0"
            :true-label="1"
            @change="searchClk"
          >
            <span>{{ ns('回收站') }}</span>
          </el-checkbox>
        </el-form-item>
      </template>
      
      <el-form-item
        label=" "
        prop="idsChecked"
      >
        <el-checkbox
          v-model="idsChecked"
          :false-label="0"
          :true-label="1"
          :disabled="selectedIds.length === 0"
          @change="idsCheckedChg"
        >
          <span>{{ ns('已选择') }}</span>
          <span
            un-m="l-0.5"
            un-text="blue"
            :style="{ color: selectedIds.length === 0 ? 'var(--el-disabled-text-color)': undefined }"
          >
            {{ selectedIds.length }}
          </span>
        </el-checkbox>
        <el-icon
          v-show="selectedIds.length > 0"
          :title="ns('清空已选择')"
          un-cursor-pointer
          un-m="l-1.5"
          un-text="hover:red"
          @click="emptySelected"
        >
          <ElIconRemove />
        </el-icon>
      </el-form-item>
      
      <el-form-item
        label=""
        un-self-start
        un-flex="~ nowrap"
        un-min="w-45"
      >
        
        <el-button
          plain
          type="primary"
          @click="searchClk"
        >
          <template #icon>
            <ElIconSearch />
          </template>
          <span>{{ ns('查询') }}</span>
        </el-button>
        
        <el-button
          plain
          @click="searchReset"
        >
          <template #icon>
            <ElIconDelete />
          </template>
          <span>{{ ns('重置') }}</span>
        </el-button>
        
      </el-form-item>
      
    </el-form>
  </div>
  <div
    un-m="x-1.5 t-1.5"
    un-flex="~ nowrap"
  >
    <template v-if="search.is_deleted !== 1">
      
      <el-button
        plain
        type="primary"
        @click="openAdd"
      >
        <template #icon>
          <ElIconCirclePlus />
        </template>
        <span>{{ ns('新增') }}</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="openCopy"
      >
        <template #icon>
          <ElIconCopyDocument />
        </template>
        <span>{{ ns('复制') }}</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="openEdit"
      >
        <template #icon>
          <ElIconEdit />
        </template>
        <span>{{ ns('编辑') }}</span>
      </el-button>
      
      <el-button
        plain
        type="danger"
        @click="deleteByIdsEfc"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>{{ ns('删除') }}</span>
      </el-button>
    
      <el-button
        plain
        @click="searchClk"
      >
        <template #icon>
          <ElIconRefresh />
        </template>
        <span>{{ ns('刷新') }}</span>
      </el-button>
      
      <el-dropdown
        trigger="click"
        un-m="x-3"
      >
        
        <el-button
          plain
        >
          <span
            v-if="(exportExcel.workerStatus as any) === 'RUNNING'"
          >
            {{ ns('正在导出') }}
          </span>
          <span
            v-else
          >
            {{ ns('更多操作') }}
          </span>
          <el-icon>
            <ElIconArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu
            un-min="w-20"
            whitespace-nowrap
          >
            
            <el-dropdown-item
              v-if="(exportExcel.workerStatus as any) !== 'RUNNING'"
              un-justify-center
              @click="exportClk"
            >
              <span>{{ ns('导出') }}</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-else
              un-justify-center
              @click="cancelExportClk"
            >
              <span un-text="red">{{ ns('取消导出') }}</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              un-justify-center
              @click="openUploadClk"
            >
              <span>{{ ns('导入') }}</span>
            </el-dropdown-item>
            
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
    </template>
    
    <template v-else>
      
      <el-button
        plain
        type="primary"
        @click="revertByIdsEfc"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ ns('还原') }}</span>
      </el-button>
      
      <el-button
        plain
        type="danger"
        @click="forceDeleteByIdsClk"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>{{ ns('彻底删除') }}</span>
      </el-button>
      
      <el-button
        plain
        @click="searchClk"
      >
        <template #icon>
          <ElIconRefresh />
        </template>
        <span>{{ ns('刷新') }}</span>
      </el-button>
      
      <el-button
        plain
        @click="exportClk"
      >
        <template #icon>
          <ElIconDownload />
        </template>
        <span>{{ ns('导出') }}</span>
      </el-button>
      
    </template>
    
    <div
      un-flex="[1_0_0]"
      un-overflow-hidden
    >
    </div>
    
    <TableShowColumns
      :table-columns="tableColumns"
      @reset-columns="resetColumns"
      @store-columns="storeColumns"
    >
      {{ ns('列操作') }}
    </TableShowColumns>
    
  </div>
  <div
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
    un-m="t-1.5"
  >
    <div
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
    >
      <el-table
        ref="tableRef"
        v-header-order-drag="() => ({ tableColumns, storeColumns, offset: 1 })"
        :data="tableData"
        :row-class-name="rowClassName"
        border
        size="small"
        height="100%"
        row-key="id"
        :empty-text="inited ? undefined : ns('加载中...')"
        :default-sort="sort"
        @select="selectChg"
        @select-all="selectChg"
        @row-click="rowClk"
        @row-dblclick="openEdit"
        @sort-change="sortChange"
        @click.ctrl="rowClkCtrl"
        @click.shift="rowClkShift"
        @header-dragend="headerDragend"
      >
        
        <el-table-column
          prop="id"
          type="selection"
          align="center"
          width="50"
        ></el-table-column>
        
        <template
          v-for="col in tableColumns"
          :key="col.prop"
        >
          
          <!-- 类型 -->
          <template v-if="'type' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 父菜单 -->
          <template v-else-if="'_menu_id' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 名称 -->
          <template v-else-if="'lbl' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 路由 -->
          <template v-else-if="'route_path' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 参数 -->
          <template v-else-if="'route_query' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 启用 -->
          <template v-else-if="'is_enabled' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 排序 -->
          <template v-else-if="'order_by' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 备注 -->
          <template v-else-if="'rem' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <template v-else>
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
        </template>
        
      </el-table>
    </div>
    <div
      un-flex
      un-justify-end
      un-p="t-0.5 b-0.5"
    >
      <el-pagination
        background
        :page-sizes="pageSizes"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="page.current"
        :total="page.total"
        @size-change="pgSizeChg"
        @current-change="pgCurrentChg"
      ></el-pagination>
    </div>
  </div>
  <Detail
    ref="detailRef"
  ></Detail>
  <UploadFileDialog
    ref="uploadFileDialogRef"
  ></UploadFileDialog>
</div>
</template>

<script lang="ts" setup>
import Detail from "./Detail.vue";

import {
  findAll,
  findCount,
  revertByIds,
  deleteByIds,
  forceDeleteByIds,
  useExportExcel,
  updateById,
  importFile,
} from "./Api";

import {
  type MenuModel,
  type MenuSearch,
} from "#/types";

import {
  getMenuList,
} from "./Api";

defineOptions({
  name: "菜单",
});

const {
  n,
  ns,
  initI18ns,
  initSysI18ns
} = useI18n();

const usrStore = useUsrStore();

let inited = $ref(false);

const emit = defineEmits([
  "selectedIdsChg",
  "add",
  "edit",
  "remove",
  "revert",
]);

/** 表格 */
let tableRef = $ref<InstanceType<typeof ElTable>>();

/** 搜索 */
function initSearch() {
  return {
    is_deleted: 0,
    menu_id: [ ],
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
  resetSelectedIds();
  await searchClk();
}

/** 清空搜索框事件 */
async function searchIptClr() {
  await searchClk();
}

/** 点击已选择 */
async function idsCheckedChg() {
  await dataGrid(true);
}

const props = defineProps<{
  is_deleted?: string;
  ids?: string[]; //ids
  selectedIds?: string[]; //已选择行的id列表
  id?: string; // ID
  type?: string|string[]; // 类型
  menu_id?: string|string[]; // 父菜单
  _menu_id?: string|string[]; // 父菜单
  lbl?: string; // 名称
  lblLike?: string; // 名称
  route_path?: string; // 路由
  route_pathLike?: string; // 路由
  route_query?: string; // 参数
  route_queryLike?: string; // 参数
  is_enabled?: string|string[]; // 启用
  order_by?: string; // 排序
  rem?: string; // 备注
  remLike?: string; // 备注
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
  order_by: "number",
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
    if (!inited) {
      return;
    }
    emit("selectedIdsChg", selectedIds);
  },
  {
    deep: true,
  },
);

function resetSelectedIds() {
  selectedIds = props.selectedIds ? [ ...props.selectedIds ] : [ ];
}

/** 取消已选择筛选 */
async function emptySelected() {
  resetSelectedIds();
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

function getTableColumns(): ColumnType[] {
  return [
    {
      label: "类型",
      prop: "_type",
      width: 100,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "父菜单",
      prop: "_menu_id",
      width: 140,
      sortable: "custom",
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "名称",
      prop: "lbl",
      width: 140,
      align: "left",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "路由",
      prop: "route_path",
      align: "left",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "参数",
      prop: "route_query",
      align: "left",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "启用",
      prop: "_is_enabled",
      width: 60,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "排序",
      prop: "order_by",
      width: 100,
      sortable: "custom",
      align: "right",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "备注",
      prop: "rem",
      width: 180,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
  ];
}

/** 表格列 */
let tableColumns = $ref<ColumnType[]>(getTableColumns());

/** 表格列标签国际化 */
watchEffect(() => {
  const tableColumns2 = getTableColumns();
  for (let i = 0; i < tableColumns2.length; i++) {
    const column2 = tableColumns2[i];
    const column = tableColumns.find((item) => item.prop === column2.prop);
    if (column) {
      column.label = n(column2.label);
    }
  }
});

/** 表格列 */
let {
  headerDragend,
  resetColumns,
  storeColumns,
} = $(useTableColumns<MenuModel>(
  $$(tableColumns),
  {
    persistKey: new URL(import.meta.url).pathname,
  },
));

let detailRef = $ref<InstanceType<typeof Detail>>();

/** 刷新表格 */
async function dataGrid(isCount = false) {
  if (isCount) {
    await Promise.all([
      useFindAll(),
      useFindCount(),
    ]);
  } else {
    await useFindAll();
  }
}

function getDataSearch() {
  let search2 = {
    ...search,
    ...builtInSearch,
    idsChecked: undefined,
  };
  if (idsChecked) {
    search2.ids = selectedIds;
  }
  return search2;
}

async function useFindAll() {
  const pgSize = page.size;
  const pgOffset = (page.current - 1) * page.size;
  const search2 = getDataSearch();
  tableData = await findAll(search2, { pgSize, pgOffset }, [ sort ]);
}

async function useFindCount() {
  const search2 = getDataSearch();
  page.total = await findCount(search2);
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

let exportExcel = $ref(useExportExcel(search, [ sort ]));

/** 导出Excel */
async function exportClk() {
  await exportExcel.workerFn();
}

/** 取消导出Excel */
async function cancelExportClk() {
  exportExcel.workerTerminate();
}

/** 打开增加页面 */
async function openAdd() {
  if (!detailRef) {
    return;
  }
  const {
    type,
    changedIds,
  } = await detailRef.showDialog({
    title: ns("增加"),
    action: "add",
    builtInModel,
  });
  if (type === "cancel") {
    return;
  }
  if (changedIds.length > 0) {
    selectedIds = [ ...changedIds ];
    await Promise.all([
      dataGrid(true),
    ]);
    emit("add", changedIds);
  }
}

/** 打开复制页面 */
async function openCopy() {
  if (!detailRef) {
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(ns("请选择需要 复制 的数据"));
    return;
  }
  const {
    type,
    changedIds,
  } = await detailRef.showDialog({
    title: ns("复制"),
    action: "copy",
    builtInModel,
    model: {
      id: selectedIds[selectedIds.length - 1],
    },
  });
  if (type === "cancel") {
    return;
  }
  if (changedIds.length > 0) {
    selectedIds = [ ...changedIds ];
    await Promise.all([
      dataGrid(true),
    ]);
    emit("add", changedIds);
  }
}

let uploadFileDialogRef = $ref<InstanceType<typeof UploadFileDialog>>();

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
    ElMessage.warning(ns("请选择需要修改的数据"));
    return;
  }
  const {
    type,
    changedIds,
  } = await detailRef.showDialog({
    title: ns("修改"),
    action: "edit",
    builtInModel,
    model: {
      ids: selectedIds,
    },
  });
  if (type === "cancel") {
    return;
  }
  if (changedIds.length > 0) {
    await Promise.all([
      dataGrid(),
    ]);
    emit("edit", changedIds);
  }
}

/** 点击删除 */
async function deleteByIdsEfc() {
  if (selectedIds.length === 0) {
    ElMessage.warning(ns("请选择需要删除的数据"));
    return;
  }
  try {
    await ElMessageBox.confirm(`${ ns("确定删除已选择的 {0} 条数据", selectedIds.length) }?`, {
      confirmButtonText: ns("确定"),
      cancelButtonText: ns("取消"),
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
    ElMessage.success(ns("删除 {0} 条数据成功", num));
    emit("remove", num);
  }
}

/** 点击彻底删除 */
async function forceDeleteByIdsClk() {
  if (selectedIds.length === 0) {
    ElMessage.warning(ns("请选择需要 彻底删除 的数据"));
    return;
  }
  try {
    await ElMessageBox.confirm(`${ ns("确定 彻底删除 已选择的 {0} 条数据", selectedIds.length) }?`, {
      confirmButtonText: ns("确定"),
      cancelButtonText: ns("取消"),
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await forceDeleteByIds(selectedIds);
  if (num) {
    selectedIds = [ ];
    ElMessage.success(ns("彻底删除 {0} 条数据成功", num));
    await Promise.all([
      dataGrid(true),
    ]);
  }
}

/** 点击还原 */
async function revertByIdsEfc() {
  if (selectedIds.length === 0) {
    ElMessage.warning(ns("请选择需要还原的数据"));
    return;
  }
  try {
    await ElMessageBox.confirm(`${ ns("确定还原已选择的 {0} 条数据", selectedIds.length) }?`, {
      confirmButtonText: ns("确定"),
      cancelButtonText: ns("取消"),
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
    ElMessage.success(ns("还原 {0} 条数据成功", num));
    emit("revert", num);
  }
}

/** 初始化ts中的国际化信息 */
async function initI18nsEfc() {
  const codes: string[] = [
    "类型",
    "父菜单",
    "名称",
    "路由",
    "参数",
    "启用",
    "排序",
    "备注",
  ];
  await Promise.all([
    initListI18ns(),
    initI18ns(codes),
  ]);
}

async function initFrame() {
  if (!usrStore.authorization) {
    return;
  }
  await Promise.all([
    initI18nsEfc(),
    searchClk(),
  ]);
  if (tableData.length === 1) {
    await nextTick();
    selectedIds = [ tableData[0].id ];
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
