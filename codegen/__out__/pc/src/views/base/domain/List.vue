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
      
      un-grid="~ cols-[repeat(auto-fill,340px)]"
      un-gap="x-1.5 y-1.5"
      un-justify-items-end
      un-items-center
      
      @submit.prevent
      @keydown.enter="onSearch(true)"
    >
      
      <template v-if="(builtInSearch?.lbl == null && (showBuildIn || builtInSearch?.lbl_like == null))">
        <el-form-item
          label="名称"
          prop="lbl_like"
        >
          <CustomInput
            v-model="search.lbl_like"
            placeholder="请输入 名称"
            @clear="onSearchClear"
          ></CustomInput>
        </el-form-item>
      </template>
      
      <template v-if="(showBuildIn || builtInSearch?.is_enabled == null)">
        <el-form-item
          label="启用"
          prop="is_enabled"
        >
          <DictSelect
            :model-value="is_enabled_search[0]"
            code="is_enabled"
            placeholder="请选择 启用"
            @update:model-value="($event != null && $event !== '') ? is_enabled_search = [ $event ] : is_enabled_search = [ ]"
            @change="onSearch(false)"
          ></DictSelect>
        </el-form-item>
      </template>
      
      <div
        class="search-ids-checked"
      >
        <div
          un-flex="~ nowrap"
          un-justify-evenly
          un-w="full"
        >
          <div
            un-flex="~ nowrap"
            un-items-center
            un-gap="x-1.5"
            un-min="w-31.5"
          >
            <el-checkbox
              v-model="idsChecked"
              :false-value="0"
              :true-value="1"
              :disabled="selectedIds.length === 0"
              @change="onIdsChecked"
            >
              <span>已选择</span>
              <span
                v-if="selectedIds.length > 0"
                un-m="l-0.5"
                un-text="blue"
              >
                {{ selectedIds.length }}
              </span>
            </el-checkbox>
            <el-icon
              v-show="selectedIds.length > 0"
              title="清空已选择"
              un-cursor-pointer
              un-text="hover:red"
              @click="onEmptySelected"
            >
              <ElIconRemove />
            </el-icon>
          </div>
          
          <el-checkbox
            v-if="!isLocked"
            v-model="search.is_deleted"
            :set="search.is_deleted = search.is_deleted ?? 0"
            :false-value="0"
            :true-value="1"
            @change="onRecycle"
          >
            <span>回收站</span>
          </el-checkbox>
        </div>
      </div>
      
      <div
        class="search-buttons"
      >
        
        <el-button
          un-m="l-3"
          plain
          type="primary"
          @click="onSearch(true)"
        >
          <template #icon>
            <ElIconSearch />
          </template>
          <span>查询</span>
        </el-button>
        
        <el-button
          plain
          @click="onSearchReset"
        >
          <template #icon>
            <ElIconDelete />
          </template>
          <span>重置</span>
        </el-button>
        
        <div
          un-m="l-2"
          un-flex="~"
          un-items-end
          un-h="full"
          un-gap="x-2"
        >
          
          <TableSearchStaging
            :search="search"
            :page-path="pagePath"
            :filename="__filename"
            @search="onSearchStaging"
          ></TableSearchStaging>
          
        </div>
        
      </div>
      
    </el-form>
  </div>
  <div
    un-m="x-1.5 t-1.5"
    un-flex="~ nowrap"
  >
    <template v-if="search.is_deleted !== 1">
      
      <el-button
        v-if="permit('add', '新增') && !isLocked"
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
        v-if="permit('add', '复制') && !isLocked"
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
        v-if="permit('edit', '编辑') && !isLocked"
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
        v-if="permit('delete') && !isLocked"
        plain
        type="danger"
        @click="onDeleteByIds"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>删除</span>
      </el-button>
      
      <el-button
        plain
        @click="openView"
      >
        <template #icon>
          <ElIconReading />
        </template>
        <span>查看</span>
      </el-button>
      
      <el-button
        plain
        @click="onRefresh"
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
          <span
            v-if="exportExcel.workerStatus === 'RUNNING'"
            un-text="red"
          >
            正在导出
          </span>
          <span
            v-else-if="exportExcel.loading"
            un-text="red"
          >
            正在为导出加载数据
          </span>
          <span
            v-else
          >
            更多操作
          </span>
          <el-icon>
            <ElIconArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu
            un-min="w-20"
            un-whitespace-nowrap
          >
            
            <el-dropdown-item
              v-if="exportExcel.workerStatus !== 'RUNNING' && !exportExcel.loading"
              un-justify-center
              @click="onExport"
            >
              <span>导出</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-else-if="!exportExcel.loading"
              un-justify-center
              @click="onCancelExport"
            >
              <span un-text="red">取消导出</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('add', '导入') && !isLocked"
              un-justify-center
              @click="onImportExcel"
            >
              <span>导入</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('edit', '编辑') && !isLocked"
              un-justify-center
              @click="onEnableByIds(1)"
            >
              <span>启用</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('edit', '编辑') && !isLocked"
              un-justify-center
              @click="onEnableByIds(0)"
            >
              <span>禁用</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('edit', '编辑') && !isLocked"
              un-justify-center
              @click="onLockByIds(1)"
            >
              <span>锁定</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('edit', '编辑') && !isLocked"
              un-justify-center
              @click="onLockByIds(0)"
            >
              <span>解锁</span>
            </el-dropdown-item>
            
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
    </template>
    
    <template v-else>
      
      <el-button
        v-if="permit('delete') && !isLocked"
        plain
        type="primary"
        @click="onRevertByIds"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>还原</span>
      </el-button>
      
      <el-button
        v-if="permit('force_delete') && !isLocked"
        plain
        type="danger"
        @click="onForceDeleteByIds"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>彻底删除</span>
      </el-button>
      
      <el-button
        plain
        @click="openView"
      >
        <template #icon>
          <ElIconReading />
        </template>
        <span>查看</span>
      </el-button>
      
      <el-button
        plain
        @click="onSearch(true)"
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
          <span
            v-if="exportExcel.workerStatus === 'RUNNING'"
          >
            正在导出
          </span>
          <span
            v-else-if="exportExcel.loading"
            un-text="red"
          >
            正在为导出加载数据
          </span>
          <span
            v-else
          >
            更多操作
          </span>
          <el-icon>
            <ElIconArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu
            un-min="w-20"
            un-whitespace-nowrap
          >
            
            <el-dropdown-item
              v-if="exportExcel.workerStatus !== 'RUNNING' && !exportExcel.loading"
              un-justify-center
              @click="onExport"
            >
              <span>导出</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-else-if="!exportExcel.loading"
              un-justify-center
              @click="onCancelExport"
            >
              <span un-text="red">取消导出</span>
            </el-dropdown-item>
            
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
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
        v-header-order-drag="() => ({ tableColumns, storeColumns })"
        :data="tableData"
        :row-class-name="rowClassName"
        border
        size="small"
        height="100%"
        row-key="id"
        :default-sort="defaultSort"
        :empty-text="inited ? undefined : '加载中...'"
        @select="onSelect"
        @select-all="onSelect"
        @row-click="onRow"
        @sort-change="onSortChange"
        @header-dragend="headerDragend"
        @row-dblclick="onRowDblclick"
        @keydown.escape="onEmptySelected"
        @keydown.ctrl.delete.stop="onDeleteByIds"
        @keydown.enter="onRowEnter"
        @keydown.up="onRowUp"
        @keydown.down="onRowDown"
        @keydown.left="onRowLeft"
        @keydown.right="onRowRight"
        @keydown.home="onRowHome"
        @keydown.end="onRowEnd"
        @keydown.page-up="onPageUp"
        @keydown.page-down="onPageDown"
        @keydown.ctrl.i="onInsert"
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
          
          <!-- 协议 -->
          <template v-if="'protocol' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 名称 -->
          <template v-else-if="'lbl' === col.prop && (showBuildIn || builtInSearch?.lbl == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 锁定 -->
          <template v-else-if="'is_locked_lbl' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row }">
                <CustomSwitch
                  v-if="permit('edit', '编辑') && row.is_deleted !== 1 && !isLocked"
                  v-model="row.is_locked"
                  @change="onIs_locked(row.id, row.is_locked)"
                ></CustomSwitch>
              </template>
            </el-table-column>
          </template>
          
          <!-- 启用 -->
          <template v-else-if="'is_enabled_lbl' === col.prop && (showBuildIn || builtInSearch?.is_enabled == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row }">
                <CustomSwitch
                  v-if="permit('edit', '编辑') && row.is_locked !== 1 && row.is_deleted !== 1 && !isLocked"
                  v-model="row.is_enabled"
                  @change="onIs_enabled(row.id, row.is_enabled)"
                ></CustomSwitch>
              </template>
            </el-table-column>
          </template>
          
          <!-- 排序 -->
          <template v-else-if="'order_by' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row }">
                <CustomInputNumber
                  v-if="permit('edit', '编辑') && row.is_locked !== 1 && row.is_deleted !== 1 && !isLocked"
                  v-model="row.order_by"
                  :min="0"
                  @change="updateByIdDomain(
                    row.id,
                    {
                      order_by: row.order_by,
                    },
                    { notLoading: true },
                  )"
                  @keydown.stop
                  @dblclick.stop
                  @keydown.enter="() => tableFocus()"
                ></CustomInputNumber>
              </template>
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
          
          <!-- 创建人 -->
          <template v-else-if="'create_usr_id_lbl' === col.prop && (showBuildIn || builtInSearch?.create_usr_id == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 创建时间 -->
          <template v-else-if="'create_time_lbl' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 更新人 -->
          <template v-else-if="'update_usr_id_lbl' === col.prop && (showBuildIn || builtInSearch?.update_usr_id == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 更新时间 -->
          <template v-else-if="'update_time_lbl' === col.prop">
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
      un-flex="~"
      un-justify="end"
      un-items="center"
      un-h="10"
    >
      <el-pagination
        v-if="isPagination"
        :page-sizes="pageSizes"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="page.current"
        :total="page.total"
        @size-change="pgSizeChg"
        @current-change="pgCurrentChg"
      ></el-pagination>
      <el-pagination
        v-else
        layout="total"
        :total="page.total"
      ></el-pagination>
    </div>
  </div>
  
  <Detail
    ref="detailRef"
  ></Detail>
  
  <UploadFileDialog
    ref="uploadFileDialogRef"
    @download-import-template="onDownloadImportTemplate"
  ></UploadFileDialog>
  
  <ImportPercentageDialog
    :percentage="importPercentage"
    :dialog-visible="isImporting"
    @stop="stopImport"
  ></ImportPercentageDialog>
  
</div>
</template>

<script lang="ts" setup>
import Detail from "./Detail.vue";

import {
  getPagePathDomain,
  findAllDomain,
  findCountDomain,
  revertByIdsDomain,
  deleteByIdsDomain,
  forceDeleteByIdsDomain,
  enableByIdsDomain,
  lockByIdsDomain,
  useExportExcelDomain,
  updateByIdDomain,
  importModelsDomain,
  useDownloadImportTemplateDomain,
} from "./Api.ts";

defineOptions({
  name: "域名",
});

const pagePath = getPagePathDomain();
const __filename = new URL(import.meta.url).pathname;
const pageName = getCurrentInstance()?.type?.name as string;
const permitStore = usePermitStore();
const dirtyStore = useDirtyStore();

const clearDirty = dirtyStore.onDirty(onRefresh, pageName);

const permit = permitStore.getPermit(pagePath);

let inited = $ref(false);

const emit = defineEmits<{
  selectedIdsChg: [ DomainId[] ],
  add: [ DomainId[] ],
  edit: [ DomainId[] ],
  remove: [ number ],
  revert: [ number ],
  refresh: [ ],
  beforeSearchReset: [ ],
  rowEnter: [ KeyboardEvent? ],
  rowDblclick: [ DomainModel ],
}>();

const props = defineProps<{
  is_deleted?: string;
  showBuildIn?: string;
  isPagination?: string;
  isLocked?: string;
  isFocus?: string;
  propsNotReset?: string[];
  isListSelectDialog?: string;
  ids?: string[]; //ids
  selectedIds?: DomainId[]; //已选择行的id列表
  isMultiple?: string; //是否多选
  id?: DomainId; // ID
  lbl?: string; // 名称
  lbl_like?: string; // 名称
  is_enabled?: string|string[]; // 启用
}>();

const builtInSearchType: { [key: string]: string } = {
  is_deleted: "0|1",
  showBuildIn: "0|1",
  isPagination: "0|1",
  isMultiple: "0|1",
  isLocked: "0|1",
  isFocus: "0|1",
  isListSelectDialog: "0|1",
  ids: "string[]",
  is_enabled: "number[]",
  is_enabled_lbl: "string[]",
  create_usr_id: "string[]",
  create_usr_id_lbl: "string[]",
  update_usr_id: "string[]",
  update_usr_id_lbl: "string[]",
};

const propsNotInSearch: string[] = [
  "selectedIds",
  "isMultiple",
  "showBuildIn",
  "isPagination",
  "isLocked",
  "isFocus",
  "propsNotReset",
  "isListSelectDialog",
];

/** 内置查询条件 */
const builtInSearch: DomainSearch = $(initBuiltInSearch(
  props,
  builtInSearchType,
  propsNotInSearch,
));

/** 内置变量 */
const builtInModel: DomainModel = $(initBuiltInModel(
  props,
  builtInSearchType,
  propsNotInSearch,
));

/** 是否多选 */
const multiple = $computed(() => props.isMultiple !== "0");
/** 是否显示内置变量 */
const showBuildIn = $computed(() => props.showBuildIn === "1");
/** 是否分页 */
const isPagination = $computed(() => !props.isPagination || props.isPagination === "1");
/** 是否只读模式 */
const isLocked = $computed(() => props.isLocked === "1");
/** 是否 focus, 默认为 true */
const isFocus = $computed(() => props.isFocus !== "0");
const isListSelectDialog = $computed(() => props.isListSelectDialog === "1");

/** 表格 */
const tableRef = $(useTemplateRef("tableRef"));

/** 查询 */
function initSearch() {
  const search = {
    is_deleted: 0,
  } as DomainSearch;
  props.propsNotReset?.forEach((key) => {
    search[key] = builtInSearch[key];
  });
  return search;
}

let search = $ref(initSearch());

// 启用
const is_enabled_search = $computed({
  get() {
    return search.is_enabled || [ ];
  },
  set(val) {
    if (!val || val.length === 0) {
      search.is_enabled = undefined;
    } else {
      search.is_enabled = val;
    }
  },
});

/** 回收站 */
async function onRecycle() {
  tableFocus();
  selectedIds = [ ];
  await dataGrid(true);
}

/** 查询 */
async function onSearch(isFocus: boolean) {
  if (isFocus) {
    tableFocus();
  }
  await dataGrid(true);
}

/** 暂存查询 */
async function onSearchStaging(searchStaging?: DomainSearch) {
  if (!searchStaging) {
    return;
  }
  search = searchStaging;
  await onSearch(true);
}

/** 刷新 */
async function onRefresh() {
  tableFocus();
  emit("refresh");
  await dataGrid(true);
}

let isSearchReset = $ref(false);

/** 重置查询 */
async function onSearchReset() {
  tableFocus();
  isSearchReset = true;
  search = initSearch();
  idsChecked = 0;
  resetSelectedIds();
  emit("beforeSearchReset");
  await nextTick();
  await dataGrid(true);
  isSearchReset = false;
}

/** 清空查询框事件 */
async function onSearchClear() {
  tableFocus();
  await dataGrid(true);
}

/** 点击已选择 */
async function onIdsChecked() {
  tableFocus();
  await dataGrid(true);
}

/** 分页功能 */
const {
  page,
  pageSizes,
  pgSizeChg,
  pgCurrentChg,
  onPageUp,
  onPageDown,
} = $(usePage<DomainModel>(
  dataGrid,
  {
    isPagination,
  },
));

/** 表格选择功能 */
const tableSelected = useSelect<DomainModel, DomainId>(
  $$(tableRef),
  {
    multiple: $$(multiple),
    isListSelectDialog,
  },
);

const {
  onSelect,
  rowClassName,
  onRow,
  onRowUp,
  onRowDown,
  onRowLeft,
  onRowRight,
  onRowHome,
  onRowEnd,
  tableFocus,
} = tableSelected;

let selectedIds = $(tableSelected.selectedIds);

watch(
  () => selectedIds,
  (oldVal, newVal) => {
    if (!inited) {
      return;
    }
    if (oldVal.length === newVal.length && oldVal.every((v, i) => v === newVal[i])) {
      return;
    }
    emit("selectedIdsChg", selectedIds);
  },
  {
    deep: true,
  },
);

function resetSelectedIds() {
  selectedIds = [ ];
}

/** 取消已选择筛选 */
async function onEmptySelected() {
  tableFocus();
  resetSelectedIds();
  if (idsChecked === 1) {
    idsChecked = 0;
    await dataGrid(true);
  }
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
let tableData = $ref<DomainModel[]>([ ]);

function getTableColumns(): ColumnType[] {
  return [
    {
      label: "协议",
      prop: "protocol",
      width: 100,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
      fixed: "left",
    },
    {
      label: "名称",
      prop: "lbl",
      width: 280,
      align: "left",
      headerAlign: "center",
      showOverflowTooltip: true,
      fixed: "left",
    },
    {
      label: "锁定",
      prop: "is_locked_lbl",
      sortBy: "is_locked",
      width: 85,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: false,
    },
    {
      label: "启用",
      prop: "is_enabled_lbl",
      sortBy: "is_enabled",
      width: 85,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: false,
    },
    {
      label: "排序",
      prop: "order_by",
      width: 100,
      sortable: "custom",
      align: "right",
      headerAlign: "center",
      showOverflowTooltip: false,
    },
    {
      label: "备注",
      prop: "rem",
      width: 280,
      align: "left",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "创建人",
      prop: "create_usr_id_lbl",
      sortBy: "create_usr_id_lbl",
      width: 120,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "创建时间",
      prop: "create_time_lbl",
      sortBy: "create_time",
      width: 160,
      sortable: "custom",
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "更新人",
      prop: "update_usr_id_lbl",
      sortBy: "update_usr_id_lbl",
      width: 120,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "更新时间",
      prop: "update_time_lbl",
      sortBy: "update_time",
      width: 160,
      sortable: "custom",
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
  ];
}

/** 表格列 */
const tableColumns = $ref<ColumnType[]>(getTableColumns());

/** 表格列 */
const {
  headerDragend,
  resetColumns,
  storeColumns,
  initColumns,
} = $(useTableColumns<DomainModel>(
  $$(tableColumns),
  {
    persistKey: __filename,
  },
));

const detailRef = $(useTemplateRef("detailRef"));

/** 当前表格数据对应的搜索条件 */
let currentSearch = $ref<DomainSearch>({ });

/** 刷新表格 */
async function dataGrid(
  isCount = false,
  opt?: GqlOpt,
) {
  clearDirty();
  const search = getDataSearch();
  currentSearch = search;
  if (isCount) {
    await Promise.all([
      useFindAll(search, opt),
      useFindCount(search, opt),
    ]);
  } else {
    await Promise.all([
      useFindAll(search, opt),
    ]);
  }
}

function getDataSearch() {
  const is_deleted = search.is_deleted;
  const search2 = {
    ...search,
    idsChecked: undefined,
  };
  if (!showBuildIn) {
    Object.assign(search2, builtInSearch);
  }
  search2.is_deleted = is_deleted;
  if (idsChecked) {
    search2.ids = selectedIds;
  }
  return search2;
}

async function useFindAll(
  search: DomainSearch,
  opt?: GqlOpt,
) {
  if (isPagination) {
    const pgSize = page.size;
    const pgOffset = (page.current - 1) * page.size;
    tableData = await findAllDomain(
      search,
      {
        pgSize,
        pgOffset,
      },
      [
        sort,
      ],
      opt,
    );
  } else {
    tableData = await findAllDomain(
      search,
      undefined,
      [
        sort,
      ],
      opt,
    );
  }
}

async function useFindCount(
  search: DomainSearch,
  opt?: GqlOpt,
) {
  const search2 = getDataSearch();
  page.total = await findCountDomain(
    search2,
    opt,
  );
}

const _defaultSort: Sort = {
  prop: "order_by",
  order: "ascending",
};

const defaultSort: Sort = $computed(() => {
  if (_defaultSort.prop === "") {
    return _defaultSort;
  }
  const sort2: Sort = {
    ..._defaultSort,
  };
  const column = tableColumns.find((item) => item.sortBy === _defaultSort.prop);
  if (column) {
    sort2.prop = column.prop;
  }
  return sort2;
});

let sort = $ref<Sort>({
  ..._defaultSort,
});

/** 排序 */
async function onSortChange(
  { prop, order, column }: { column: TableColumnCtx<DomainModel> } & Sort,
) {
  if (!order) {
    sort = {
      ..._defaultSort,
    };
    await dataGrid();
    return;
  }
  let prop2 = "";
  if (Array.isArray(column.sortBy)) {
    prop2 = column.sortBy[0];
  } else {
    prop2 = (column.sortBy as string) || prop || "";
  }
  sort.prop = prop2;
  sort.order = order || "ascending";
  await dataGrid();
}

const exportExcel = $ref(useExportExcelDomain());

/** 导出Excel */
async function onExport() {
  const search2 = getDataSearch();
  await exportExcel.workerFn(
    toExcelColumns(tableColumns),
    search2,
    [ sort ],
  );
}

/** 取消导出Excel */
async function onCancelExport() {
  exportExcel.workerTerminate();
}

/** 打开新增页面 */
async function openAdd() {
  if (isLocked) {
    return;
  }
  if (!detailRef) {
    return;
  }
  if (!permit("add")) {
    ElMessage.warning("无权限");
    return;
  }
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "新增 域名",
    action: "add",
    builtInModel,
    showBuildIn: $$(showBuildIn),
  });
  tableFocus();
  if (changedIds.length === 0) {
    return;
  }
  selectedIds = [
    ...changedIds,
  ];
  dirtyStore.fireDirty(pageName);
  await dataGrid(true);
  emit("add", changedIds);
}

/** 打开复制页面 */
async function openCopy() {
  if (isLocked) {
    return;
  }
  if (!detailRef) {
    return;
  }
  if (!permit("add")) {
    ElMessage.warning("无权限");
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning("请选择需要 复制 的 域名");
    return;
  }
  const id = selectedIds[selectedIds.length - 1];
  const ids = [ id ];
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "复制 域名",
    action: "copy",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    model: {
      ids,
    },
  });
  tableFocus();
  if (changedIds.length === 0) {
    return;
  }
  selectedIds = [
    ...changedIds,
  ];
  dirtyStore.fireDirty(pageName);
  await dataGrid(true);
  emit("add", changedIds);
}

/** 打开新增或复制页面, 未选择任何行则为新增, 选中一行为复制此行 */
async function onInsert() {
  if (isLocked) {
    return;
  }
  await openAdd();
}

const uploadFileDialogRef = $(useTemplateRef("uploadFileDialogRef"));

let importPercentage = $ref(0);
let isImporting = $ref(false);
let isStopImport = $ref(false);

const downloadImportTemplate = $ref(useDownloadImportTemplateDomain());

/**
 * 下载导入模板
 */
async function onDownloadImportTemplate() {
  await downloadImportTemplate.workerFn();
}

/** 弹出导入窗口 */
async function onImportExcel() {
  if (isLocked) {
    return;
  }
  if (!uploadFileDialogRef) {
    return;
  }
  const header: { [key: string]: string } = {
    [ "协议" ]: "protocol",
    [ "名称" ]: "lbl",
    [ "锁定" ]: "is_locked_lbl",
    [ "启用" ]: "is_enabled_lbl",
    [ "排序" ]: "order_by",
    [ "备注" ]: "rem",
  };
  const file = await uploadFileDialogRef.showDialog({
    title: "批量导入",
    accept: ".xlsx",
  });
  tableFocus();
  if (!file) {
    return;
  }
  isStopImport = false;
  isImporting = true;
  importPercentage = 0;
  let msg: VNode | undefined = undefined;
  let succNum = 0;
  try {
    const messageHandler = ElMessage.info("正在导入...");
    const models = await getExcelData<DomainInput>(
      file,
      header,
      {
        key_types: {
          "protocol": "string",
          "lbl": "string",
          "is_locked_lbl": "string",
          "is_enabled_lbl": "string",
          "order_by": "number",
          "rem": "string",
        },
      },
    );
    messageHandler.close();
    const res = await importModelsDomain(
      models,
      $$(importPercentage),
      $$(isStopImport),
    );
    msg = res.msg;
    succNum = res.succNum;
  } finally {
    isImporting = false;
  }
  if (msg) {
    ElMessageBox.alert(msg)
  }
  if (succNum > 0) {
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
  }
}

/** 取消导入 */
async function stopImport() {
  isStopImport = true;
  isImporting = false;
}

/** 锁定 */
async function onIs_locked(id: DomainId, is_locked: 0 | 1) {
  if (isLocked) {
    return;
  }
  const notLoading = true;
  await lockByIdsDomain(
    [ id ],
    is_locked,
    {
      notLoading,
    },
  );
  dirtyStore.fireDirty(pageName);
  await dataGrid(
    true,
    {
      notLoading,
    },
  );
}

/** 启用 */
async function onIs_enabled(id: DomainId, is_enabled: 0 | 1) {
  if (isLocked) {
    return;
  }
  const notLoading = true;
  await enableByIdsDomain(
    [ id ],
    is_enabled,
    {
      notLoading,
    },
  );
  dirtyStore.fireDirty(pageName);
  await dataGrid(
    true,
    {
      notLoading,
    },
  );
}

/** 打开编辑页面 */
async function openEdit() {
  if (isLocked) {
    return;
  }
  if (!detailRef) {
    return;
  }
  if (!permit("edit")) {
    ElMessage.warning("无权限");
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning("请选择需要编辑的 域名");
    return;
  }
  const ids = selectedIds;
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "编辑 域名",
    action: "edit",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    isReadonly: $$(isLocked),
    isLocked: $$(isLocked),
    model: {
      ids,
    },
  });
  tableFocus();
  if (changedIds.length === 0) {
    return;
  }
  dirtyStore.fireDirty(pageName);
  await dataGrid();
  emit("edit", changedIds);
}

/** 键盘回车按键 */
async function onRowEnter(e: KeyboardEvent) {
  if (props.selectedIds != null) {
    emit("rowEnter", e);
    return;
  }
  if (e.ctrlKey) {
    await openEdit();
  } else if (e.shiftKey) {
    await openCopy();
  } else {
    await openView();
  }
}

/** 双击行 */
async function onRowDblclick(
  row: DomainModel,
  column: TableColumnCtx<DomainModel>,
) {
  if (column.type === "selection") {
    return;
  }
  if (isListSelectDialog) {
    emit("rowDblclick", row);
    return;
  }
  await openView();
}

/** 打开查看 */
async function openView() {
  tableFocus();
  if (!detailRef) {
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning("请选择需要查看的 域名");
    return;
  }
  const search = getDataSearch();
  const is_deleted = search.is_deleted;
  const ids = selectedIds;
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "查看 域名",
    action: "view",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    isLocked: $$(isLocked),
    model: {
      ids,
      is_deleted,
    },
  });
  tableFocus();
  if (changedIds.length === 0) {
    return;
  }
  dirtyStore.fireDirty(pageName);
  await dataGrid();
  emit("edit", changedIds);
}

/** 点击删除 */
async function onDeleteByIds() {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (!permit("delete")) {
    ElMessage.warning("无权限");
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning("请选择需要删除的 域名");
    return;
  }
  try {
    await ElMessageBox.confirm(`确定删除已选择的 ${ selectedIds.length } 域名?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await deleteByIdsDomain(selectedIds);
  tableData = tableData.filter((item) => !selectedIds.includes(item.id));
  selectedIds = [ ];
  dirtyStore.fireDirty(pageName);
  await dataGrid(true);
  ElMessage.success(`删除 ${ num } 域名 成功`);
  emit("remove", num);
}

/** 点击彻底删除 */
async function onForceDeleteByIds() {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (!permit("forceDelete")) {
    ElMessage.warning("无权限");
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning("请选择需要 彻底删除 的 域名");
    return;
  }
  try {
    await ElMessageBox.confirm(`确定 彻底删除 已选择的 ${ selectedIds.length } 域名?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await forceDeleteByIdsDomain(selectedIds);
  if (num) {
    selectedIds = [ ];
    ElMessage.success(`彻底删除 ${ num } 域名 成功`);
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
  }
}

/** 点击启用或者禁用 */
async function onEnableByIds(is_enabled: 0 | 1) {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (permit("edit") === false) {
    ElMessage.warning("无权限");
    return;
  }
  if (selectedIds.length === 0) {
    let msg = "";
    if (is_enabled === 1) {
      msg = "请选择需要 启用 的 域名";
    } else {
      msg = "请选择需要 禁用 的 域名";
    }
    ElMessage.warning(msg);
    return;
  }
  const num = await enableByIdsDomain(selectedIds, is_enabled);
  if (num > 0) {
    let msg = "";
    if (is_enabled === 1) {
      msg = `启用 ${ num } 域名 成功`;
    } else {
      msg = `禁用 ${ num } 域名 成功`;
    }
    ElMessage.success(msg);
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
  }
}

/** 点击锁定或者解锁 */
async function onLockByIds(is_locked: 0 | 1) {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (permit("edit") === false) {
    ElMessage.warning("无权限");
    return;
  }
  if (selectedIds.length === 0) {
    let msg = "";
    if (is_locked === 1) {
      msg = "请选择需要 锁定 的 域名";
    } else {
      msg = "请选择需要 解锁 的 域名";
    }
    ElMessage.warning(msg);
    return;
  }
  const num = await lockByIdsDomain(selectedIds, is_locked);
  if (num > 0) {
    let msg = "";
    if (is_locked === 1) {
      msg = `锁定 ${ num } 域名 成功`;
    } else {
      msg = `解锋 ${ num } 域名 成功`;
    }
    ElMessage.success(msg);
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
  }
}

/** 点击还原 */
async function onRevertByIds() {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (permit("delete") === false) {
    ElMessage.warning("无权限");
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning("请选择需要还原的 域名");
    return;
  }
  try {
    await ElMessageBox.confirm(`确定还原已选择的 ${ selectedIds.length } 域名?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await revertByIdsDomain(selectedIds);
  if (num) {
    search.is_deleted = 0;
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
    ElMessage.success(`还原 ${ num } 域名 成功`);
    emit("revert", num);
  }
}

async function focus() {
  if (!inited || !tableRef || !tableRef.$el) {
    return;
  }
  tableRef.$el.focus();
}

watch(
  () => [
    props.isFocus,
    inited,
  ],
  () => {
    if (!inited || !isFocus || !tableRef || !tableRef.$el) {
      return;
    }
    tableRef.$el.focus();
  },
);

async function initFrame() {
  initColumns(tableColumns);
  await Promise.all([
    dataGrid(true),
  ]);
  inited = true;
}

watch(
  () => [ builtInSearch, showBuildIn ],
  async function() {
    if (isSearchReset) {
      return;
    }
    if (builtInSearch.is_deleted != null) {
      search.is_deleted = builtInSearch.is_deleted;
    }
    if (showBuildIn) {
      Object.assign(search, builtInSearch);
    }
    const search2 = getDataSearch();
    if (deepCompare(currentSearch, search2, undefined, [ "selectedIds" ])) {
      return;
    }
    await dataGrid(true);
  },
  {
    deep: true,
    immediate: true,
  },
);

initFrame();

defineExpose({
  refresh: onRefresh,
  focus,
});
</script>
