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
      v-search-form-item-width-auto="inited"
      
      size="default"
      :model="search"
      inline-message
      label-width="auto"
      
      un-grid="~ cols-[repeat(auto-fill,280px)]"
      un-gap="x-1.5 y-1.5"
      un-justify-items-end
      un-items-center
      
      @submit.prevent
      @keydown.enter="onSearch(true)"
    >
      
      <template v-if="(builtInSearch?.lbl == null && (showBuildIn || builtInSearch?.lbl_like == null))">
        <el-form-item
          :label="n('昵称')"
          prop="lbl_like"
        >
          <CustomInput
            v-model="search.lbl_like"
            :placeholder="`${ ns('请输入') } ${ n('昵称') }`"
            @clear="onSearchClear"
          ></CustomInput>
        </el-form-item>
      </template>
      
      <el-form-item
        label=""
        prop="idsChecked"
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
              <span>{{ ns('已选择') }}</span>
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
              :title="ns('清空已选择')"
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
            @change="recycleChg"
          >
            <span>{{ ns('回收站') }}</span>
          </el-checkbox>
        </div>
      </el-form-item>
      
      <el-form-item
        label=""
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
          <span>{{ ns('查询') }}</span>
        </el-button>
        
        <el-button
          plain
          @click="onSearchReset"
        >
          <template #icon>
            <ElIconDelete />
          </template>
          <span>{{ ns('重置') }}</span>
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
        
      </el-form-item>
      
    </el-form>
  </div>
  <div
    un-m="x-1.5 t-1.5"
    un-flex="~ nowrap"
  >
    <template v-if="search.is_deleted !== 1">
      
      <el-button
        v-if="permit('add') && !isLocked"
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
        v-if="permit('add') && !isLocked"
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
        v-if="permit('edit') && !isLocked"
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
        v-if="permit('delete') && !isLocked"
        plain
        type="danger"
        @click="onDeleteByIds"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>{{ ns('删除') }}</span>
      </el-button>
      
      <el-button
        plain
        @click="openView"
      >
        <template #icon>
          <ElIconReading />
        </template>
        <span>{{ ns('查看') }}</span>
      </el-button>
      
      <el-button
        plain
        @click="onRefresh"
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
            v-if="exportExcel.workerStatus === 'RUNNING'"
            un-text="red"
          >
            {{ ns('正在导出') }}
          </span>
          <span
            v-else-if="exportExcel.loading"
            un-text="red"
          >
            {{ ns('正在为导出加载数据') }}
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
            un-whitespace-nowrap
          >
            
            <el-dropdown-item
              v-if="exportExcel.workerStatus !== 'RUNNING' && !exportExcel.loading"
              un-justify-center
              @click="onExport"
            >
              <span>{{ ns('导出') }}</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-else-if="!exportExcel.loading"
              un-justify-center
              @click="onCancelExport"
            >
              <span un-text="red">{{ ns('取消导出') }}</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('add') && !isLocked"
              un-justify-center
              @click="onImportExcel"
            >
              <span>{{ ns('导入') }}</span>
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
        <span>{{ ns('还原') }}</span>
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
        <span>{{ ns('彻底删除') }}</span>
      </el-button>
      
      <el-button
        plain
        @click="openView"
      >
        <template #icon>
          <ElIconReading />
        </template>
        <span>{{ ns('查看') }}</span>
      </el-button>
      
      <el-button
        plain
        @click="onSearch(true)"
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
            v-if="exportExcel.workerStatus === 'RUNNING'"
          >
            {{ ns('正在导出') }}
          </span>
          <span
            v-else-if="exportExcel.loading"
            un-text="red"
          >
            {{ ns('正在为导出加载数据') }}
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
            un-whitespace-nowrap
          >
            
            <el-dropdown-item
              v-if="exportExcel.workerStatus !== 'RUNNING' && !exportExcel.loading"
              un-justify-center
              @click="onExport"
            >
              <span>{{ ns('导出') }}</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-else-if="!exportExcel.loading"
              un-justify-center
              @click="onCancelExport"
            >
              <span un-text="red">{{ ns('取消导出') }}</span>
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
        v-header-order-drag="() => ({ tableColumns, storeColumns })"
        :data="tableData"
        :row-class-name="rowClassName"
        border
        size="small"
        height="100%"
        row-key="id"
        :default-sort="defaultSort"
        :empty-text="inited ? undefined : ns('加载中...')"
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
          
          <!-- 昵称 -->
          <template v-if="'lbl' === col.prop && (showBuildIn || builtInSearch?.lbl == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 头像 -->
          <template v-else-if="'headimgurl' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 绑定用户 -->
          <template v-else-if="'usr_id_lbl' === col.prop && (showBuildIn || builtInSearch?.usr_id == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 公众号用户唯一标识 -->
          <template v-else-if="'openid' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 用户统一标识 -->
          <template v-else-if="'unionid' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 性别 -->
          <template v-else-if="'sex_lbl' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 省份 -->
          <template v-else-if="'province' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 城市 -->
          <template v-else-if="'city' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 国家 -->
          <template v-else-if="'country' === col.prop">
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
          
          <template v-else-if="showBuildIn">
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
      un-justify-end
      un-p="y-1"
      un-box-border
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
  getPagePath,
  findAll,
  findCount,
  revertByIds,
  deleteByIds,
  forceDeleteByIds,
  useExportExcel,
  updateById,
  importModels,
  useDownloadImportTemplate,
} from "./Api";

defineOptions({
  name: "公众号用户",
});

const pagePath = getPagePath();
const __filename = new URL(import.meta.url).pathname;
const pageName = getCurrentInstance()?.type?.name as string;

const {
  n,
  nAsync,
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns
} = useI18n(pagePath);

const permitStore = usePermitStore();
const fieldPermitStore = useFieldPermitStore();
const dirtyStore = useDirtyStore();

const clearDirty = dirtyStore.onDirty(onRefresh, pageName);

const permit = permitStore.getPermit(pagePath);

let inited = $ref(false);

const emit = defineEmits<{
  selectedIdsChg: [ WxoUsrId[] ],
  add: [ WxoUsrId[] ],
  edit: [ WxoUsrId[] ],
  remove: [ number ],
  revert: [ number ],
  refresh: [ ],
  beforeSearchReset: [ ],
  rowEnter: [ KeyboardEvent? ],
  rowDblclick: [ WxoUsrModel ],
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
  selectedIds?: WxoUsrId[]; //已选择行的id列表
  isMultiple?: boolean; //是否多选
  id?: WxoUsrId; // ID
  lbl?: string; // 昵称
  lbl_like?: string; // 昵称
  usr_id?: string|string[]; // 绑定用户
  usr_id_lbl?: string; // 绑定用户
}>();

const builtInSearchType: { [key: string]: string } = {
  is_deleted: "0|1",
  showBuildIn: "0|1",
  isPagination: "0|1",
  isLocked: "0|1",
  isFocus: "0|1",
  isListSelectDialog: "0|1",
  ids: "string[]",
  usr_id: "string[]",
  usr_id_lbl: "string[]",
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
const builtInSearch: WxoUsrSearch = $(initBuiltInSearch(
  props,
  builtInSearchType,
  propsNotInSearch,
));

/** 内置变量 */
const builtInModel: WxoUsrModel = $(initBuiltInModel(
  props,
  builtInSearchType,
  propsNotInSearch,
));

/** 是否多选 */
const multiple = $computed(() => props.isMultiple !== false);
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
const tableRef = $ref<InstanceType<typeof ElTable>>();

/** 查询 */
function initSearch() {
  const search = {
    is_deleted: 0,
  } as WxoUsrSearch;
  if (props.propsNotReset && props.propsNotReset.length > 0) {
    for (let i = 0; i < props.propsNotReset.length; i++) {
      const key = props.propsNotReset[i];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (search as any)[key] = (builtInSearch as any)[key];
    }
  }
  return search;
}

let search = $ref(initSearch());

/** 回收站 */
async function recycleChg() {
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
async function onSearchStaging(searchStaging?: WxoUsrSearch) {
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
} = $(usePage<WxoUsrModel>(
  dataGrid,
  {
    isPagination,
  },
));

/** 表格选择功能 */
const tableSelected = useSelect<WxoUsrModel, WxoUsrId>(
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
let tableData = $ref<WxoUsrModel[]>([ ]);

function getTableColumns(): ColumnType[] {
  return [
    {
      label: "昵称",
      prop: "lbl",
      width: 200,
      align: "left",
      headerAlign: "center",
      showOverflowTooltip: true,
      fixed: "left",
    },
    {
      label: "头像",
      prop: "headimgurl",
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "绑定用户",
      prop: "usr_id_lbl",
      sortBy: "usr_id_lbl",
      width: 240,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "公众号用户唯一标识",
      prop: "openid",
      width: 240,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "用户统一标识",
      prop: "unionid",
      width: 180,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "性别",
      prop: "sex_lbl",
      sortBy: "sex",
      width: 120,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "省份",
      prop: "province",
      width: 120,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "城市",
      prop: "city",
      width: 120,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "国家",
      prop: "country",
      width: 120,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
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
      width: 150,
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
      width: 150,
      sortable: "custom",
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
  ];
}

/** 表格列 */
const tableColumns = $ref<ColumnType[]>(getTableColumns());

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
const {
  headerDragend,
  resetColumns,
  storeColumns,
  initColumns,
} = $(useTableColumns<WxoUsrModel>(
  $$(tableColumns),
  {
    persistKey: __filename,
  },
));

const detailRef = $ref<InstanceType<typeof Detail>>();

/** 刷新表格 */
async function dataGrid(
  isCount = false,
  opt?: GqlOpt,
) {
  clearDirty();
  if (isCount) {
    await Promise.all([
      useFindAll(opt),
      useFindCount(opt),
    ]);
  } else {
    await Promise.all([
      useFindAll(opt),
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
  opt?: GqlOpt,
) {
  if (isPagination) {
    const pgSize = page.size;
    const pgOffset = (page.current - 1) * page.size;
    const search2 = getDataSearch();
    tableData = await findAll(
      search2,
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
    const search2 = getDataSearch();
    tableData = await findAll(
      search2,
      undefined,
      [
        sort,
      ],
      opt,
    );
  }
}

async function useFindCount(
  opt?: GqlOpt,
) {
  const search2 = getDataSearch();
  page.total = await findCount(
    search2,
    opt,
  );
}

const _defaultSort: Sort = {
  prop: "create_time",
  order: "descending",
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
  { prop, order, column }: { column: TableColumnCtx<WxoUsrModel> } & Sort,
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

const exportExcel = $ref(useExportExcel(pagePath));

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
    ElMessage.warning(await nsAsync("无权限"));
    return;
  }
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("新增") + " " + await nsAsync("公众号用户"),
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
    ElMessage.warning(await nsAsync("无权限"));
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要 复制 的 {0}", await nsAsync("公众号用户")));
    return;
  }
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("复制") + " " + await nsAsync("公众号用户"),
    action: "copy",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    model: {
      id: selectedIds[selectedIds.length - 1],
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

const uploadFileDialogRef = $ref<InstanceType<typeof UploadFileDialog>>();

let importPercentage = $ref(0);
let isImporting = $ref(false);
let isStopImport = $ref(false);

const downloadImportTemplate = $ref(useDownloadImportTemplate(pagePath));

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
    [ await nAsync("昵称") ]: "lbl",
    [ await nAsync("头像") ]: "headimgurl",
    [ await nAsync("绑定用户") ]: "usr_id_lbl",
    [ await nAsync("公众号用户唯一标识") ]: "openid",
    [ await nAsync("用户统一标识") ]: "unionid",
    [ await nAsync("性别") ]: "sex_lbl",
    [ await nAsync("省份") ]: "province",
    [ await nAsync("城市") ]: "city",
    [ await nAsync("国家") ]: "country",
    [ await nAsync("备注") ]: "rem",
  };
  const file = await uploadFileDialogRef.showDialog({
    title: await nsAsync("批量导入"),
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
    const messageHandler = ElMessage.info(await nsAsync("正在导入..."));
    const models = await getExcelData<WxoUsrInput>(
      file,
      header,
      {
        key_types: {
          "lbl": "string",
          "headimgurl": "string",
          "usr_id_lbl": "string",
          "openid": "string",
          "unionid": "string",
          "sex_lbl": "string",
          "province": "string",
          "city": "string",
          "country": "string",
          "rem": "string",
        },
      },
    );
    messageHandler.close();
    const res = await importModels(
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

/** 打开编辑页面 */
async function openEdit() {
  if (isLocked) {
    return;
  }
  if (!detailRef) {
    return;
  }
  if (!permit("edit")) {
    ElMessage.warning(await nsAsync("无权限"));
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要编辑的 {0}", await nsAsync("公众号用户")));
    return;
  }
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("编辑") + " " + await nsAsync("公众号用户"),
    action: "edit",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    isReadonly: $$(isLocked),
    isLocked: $$(isLocked),
    model: {
      ids: selectedIds,
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
  if (props.selectedIds != null && !isLocked) {
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
  row: WxoUsrModel,
  column: TableColumnCtx<WxoUsrModel>,
) {
  if (isListSelectDialog) {
    return;
  }
  if (column.type === "selection") {
    return;
  }
  if (props.selectedIds != null && !isLocked) {
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
    ElMessage.warning(await nsAsync("请选择需要查看的 {0}", await nsAsync("公众号用户")));
    return;
  }
  const search = getDataSearch();
  const is_deleted = search.is_deleted;
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("查看") + " " + await nsAsync("公众号用户"),
    action: "view",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    isLocked: $$(isLocked),
    model: {
      ids: selectedIds,
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
    ElMessage.warning(await nsAsync("无权限"));
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要删除的 {0}", await nsAsync("公众号用户")));
    return;
  }
  try {
    await ElMessageBox.confirm(`${ await nsAsync("确定删除已选择的 {0} {1}", selectedIds.length, await nsAsync("公众号用户")) }?`, {
      confirmButtonText: await nsAsync("确定"),
      cancelButtonText: await nsAsync("取消"),
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await deleteByIds(selectedIds);
  if (num) {
    tableData = tableData.filter((item) => !selectedIds.includes(item.id));
    selectedIds = [ ];
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
    ElMessage.success(await nsAsync("删除 {0} {1} 成功", num, await nsAsync("公众号用户")));
    emit("remove", num);
  }
}

/** 点击彻底删除 */
async function onForceDeleteByIds() {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (!permit("forceDelete")) {
    ElMessage.warning(await nsAsync("无权限"));
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要 彻底删除 的 {0}", await nsAsync("公众号用户")));
    return;
  }
  try {
    await ElMessageBox.confirm(`${ await nsAsync("确定 彻底删除 已选择的 {0} {1}", selectedIds.length, await nsAsync("公众号用户")) }?`, {
      confirmButtonText: await nsAsync("确定"),
      cancelButtonText: await nsAsync("取消"),
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await forceDeleteByIds(selectedIds);
  if (num) {
    selectedIds = [ ];
    ElMessage.success(await nsAsync("彻底删除 {0} {1} 成功", num, await nsAsync("公众号用户")));
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
    ElMessage.warning(await nsAsync("无权限"));
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要还原的 {0}", await nsAsync("公众号用户")));
    return;
  }
  try {
    await ElMessageBox.confirm(`${ await nsAsync("确定还原已选择的 {0} {1}", selectedIds.length, await nsAsync("公众号用户")) }?`, {
      confirmButtonText: await nsAsync("确定"),
      cancelButtonText: await nsAsync("取消"),
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await revertByIds(selectedIds);
  if (num) {
    search.is_deleted = 0;
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
    ElMessage.success(await nsAsync("还原 {0} {1} 成功", num, await nsAsync("公众号用户")));
    emit("revert", num);
  }
}

/** 初始化ts中的国际化信息 */
async function initI18nsEfc() {
  const codes: string[] = [
    "昵称",
    "头像",
    "绑定用户",
    "公众号用户唯一标识",
    "用户统一标识",
    "性别",
    "省份",
    "城市",
    "国家",
    "备注",
    "创建人",
    "创建时间",
    "更新人",
    "更新时间",
  ];
  await Promise.all([
    initListI18ns(),
    initI18ns(codes),
  ]);
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
    initI18nsEfc(),
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
    search.is_deleted = builtInSearch.is_deleted;
    if (deepCompare(builtInSearch, search, undefined, [ "selectedIds" ])) {
      return;
    }
    if (showBuildIn) {
      Object.assign(search, builtInSearch);
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
