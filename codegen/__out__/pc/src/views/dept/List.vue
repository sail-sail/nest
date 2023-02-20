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
      
      <template v-if="builtInSearch?.lblLike == null && builtInSearch?.lbl == null">
        <el-form-item
          label="名称"
          prop="lblLike"
        >
          <el-input
            v-model="search.lblLike"
            un-w="full"
            placeholder="请输入名称"
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
            <span>回收站</span>
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
          <span>已选择</span>
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
          title="清空已选择"
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
          <span>查询</span>
        </el-button>
        
        <el-button
          plain
          @click="searchReset"
        >
          <template #icon>
            <ElIconDelete />
          </template>
          <span>重置</span>
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
        <span>新增</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="openCopy"
      >
        <template #icon>
          <ElIconCopyDocument />
        </template>
        <span>复制</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="openEdit"
      >
        <template #icon>
          <ElIconEdit />
        </template>
        <span>编辑</span>
      </el-button>
      
      <el-button
        plain
        type="danger"
        @click="deleteByIdsEfc"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>删除</span>
      </el-button>
    
      <el-button
        plain
        @click="searchClk"
      >
        <template #icon>
          <ElIconRefresh />
        </template>
        <span>刷新</span>
      </el-button>
      
      <el-dropdown
        trigger="click"
        un-m="x-3"
      >
        
        <el-button
          plain
        >
          <span>更多操作</span>
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
              un-justify-center
              @click="exportClk"
            >
              <span>导出</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              un-justify-center
              @click="openUploadClk"
            >
              <span>导入</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              un-justify-center
              @click="lockByIdsClk(1)"
            >
              <span>锁定</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              un-justify-center
              @click="lockByIdsClk(0)"
            >
              <span>解锁</span>
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
        <span>还原</span>
      </el-button>
      
      <el-button
        plain
        type="danger"
        @click="forceDeleteByIdsClk"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>彻底删除</span>
      </el-button>
      
      <el-button
        plain
        @click="searchClk"
      >
        <template #icon>
          <ElIconRefresh />
        </template>
        <span>刷新</span>
      </el-button>
      
      <el-button
        plain
        @click="exportClk"
      >
        <template #icon>
          <ElIconDownload />
        </template>
        <span>导出</span>
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
      列操作
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
        :empty-text="inited ? undefined : '加载中...'"
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
          v-for="(col, i) in tableColumns"
          :key="i + col"
        >
          
          <!-- 父部门 -->
          <template v-if="'_parent_id' === col.prop">
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
          
          <!-- 排序 -->
          <template v-else-if="'order_by' === col.prop">
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
          
          <!-- 备注 -->
          <template v-else-if="'rem' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 锁定 -->
          <template v-else-if="'is_locked' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 创建人 -->
          <template v-else-if="'_create_usr_id' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 创建时间 -->
          <template v-else-if="'create_time' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 更新人 -->
          <template v-else-if="'_update_usr_id' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 更新时间 -->
          <template v-else-if="'update_time' === col.prop">
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
  <UploadFileDialog ref="uploadFileDialogRef"></UploadFileDialog>
</div>
</template>

<script setup lang="ts">
import Detail from "./Detail.vue";

import {
  findAll,
  findCount,
  revertByIds,
  deleteByIds,
  forceDeleteByIds,
  lockByIds,
  exportExcel,
  updateById,
  importFile,
} from "./Api";

import {
  type DeptModel,
  type DeptSearch,
  type UsrModel,
} from "#/types";

defineOptions({
  name: "部门",
});

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

/** 导出Excel */
async function exportClk() {
  const id = await exportExcel(search, [ sort ]);
  downloadById(id);
}

/** 搜索 */
function initSearch() {
  return {
    is_deleted: 0,
  } as DeptSearch;
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
  id?: string; //ID
  parent_id?: string|string[]; //父部门
  _parent_id?: string|string[]; //父部门
  lbl?: string; //名称
  lblLike?: string; //名称
  order_by?: string; //排序
  is_enabled?: string|string[]; //启用
  rem?: string; //备注
  remLike?: string; //备注
  is_locked?: string|string[]; //锁定
  create_usr_id?: string|string[]; //创建人
  _create_usr_id?: string|string[]; //创建人
  create_time?: string; //创建时间
  update_usr_id?: string|string[]; //更新人
  _update_usr_id?: string|string[]; //更新人
  update_time?: string; //更新时间
}>();

const builtInSearchType: { [key: string]: string } = {
  is_deleted: "0|1",
  ids: "string[]",
  parent_id: "string[]",
  _parent_id: "string[]",
  order_by: "number",
  is_enabled: "number[]",
  _is_enabled: "string[]",
  is_locked: "number[]",
  _is_locked: "string[]",
  create_usr_id: "string[]",
  _create_usr_id: "string[]",
  update_usr_id: "string[]",
  _update_usr_id: "string[]",
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
  return Object.fromEntries(entries) as unknown as DeptSearch;
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
  return Object.fromEntries(entries) as unknown as DeptModel;
});

/** 分页功能 */
let {
  page,
  pageSizes,
  pgSizeChg,
  pgCurrentChg,
} = $(usePage<DeptModel>(dataGrid));

/** 表格选择功能 */
let {
  selectedIds,
  selectChg,
  rowClassName,
  rowClk,
  rowClkCtrl,
  rowClkShift,
} = $(useSelect<DeptModel>($$(tableRef)));

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
let tableData = $ref<DeptModel[]>([ ]);

let tableColumns = $ref<ColumnType[]>([
  {
    label: "父部门",
    prop: "_parent_id",
    width: 120,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "名称",
    prop: "lbl",
    width: 180,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
    fixed: "left",
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
    label: "启用",
    prop: "_is_enabled",
    width: 60,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "备注",
    prop: "rem",
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "锁定",
    prop: "_is_locked",
    width: 100,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "创建人",
    prop: "_create_usr_id",
    width: 100,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "创建时间",
    prop: "create_time",
    width: 140,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "更新人",
    prop: "_update_usr_id",
    width: 100,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "更新时间",
    prop: "update_time",
    width: 140,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
]);

/** 表格列 */
let {
  headerDragend,
  resetColumns,
  storeColumns,
} = $(useTableColumns<DeptModel>(
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
  { prop, order, column }: { column: TableColumnCtx<DeptModel> } & Sort,
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
  const {
    type,
    changedIds,
  } = await detailRef.showDialog({
    title: "增加",
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
    ElMessage.warning(`请选择需要 复制 的数据!`);
    return;
  }
  const {
    type,
    changedIds,
  } = await detailRef.showDialog({
    title: "复制",
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
    title: "导入部门",
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
  const {
    type,
    changedIds,
  } = await detailRef.showDialog({
    title: "修改",
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
    emit("remove", num);
  }
}

/** 点击彻底删除 */
async function forceDeleteByIdsClk() {
  if (selectedIds.length === 0) {
    ElMessage.warning(`请选择需要 彻底删除 的数据!`);
    return;
  }
  try {
    await ElMessageBox.confirm(`确定 彻底删除 已选择的 ${ selectedIds.length } 条数据?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await forceDeleteByIds(selectedIds);
  if (num) {
    selectedIds = [ ];
    ElMessage.success(`彻底删除 ${ num } 条数据成功!`);
    await Promise.all([
      dataGrid(true),
    ]);
  }
}

/** 点击锁定或者解锁 */
async function lockByIdsClk(is_locked: 0 | 1) {
  if (selectedIds.length === 0) {
    ElMessage.warning(`请选择需要 ${ is_locked === 1 ? "锁定" : "解锁" } 的数据!`);
    return;
  }
  const num = await lockByIds(selectedIds, is_locked);
  if (num) {
    ElMessage.success(`${ is_locked === 1 ? "锁定" : "解锁" } ${ num } 条数据成功!`);
    await dataGrid(true);
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
    emit("revert", num);
  }
}

async function initFrame() {
  if (!usrStore.authorization) {
    return;
  }
  await Promise.all([
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
