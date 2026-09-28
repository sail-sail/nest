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
      
      <template v-if="(showBuildIn || builtInSearch?.message_id == null)">
        <el-form-item
          label="消息"
          prop="message_id"
        >
          <CustomSelect
            v-model="message_id_search"
            :method="getListMessage"
            dirty-key="消息"
            :options-map="((item: MessageModel) => {
              return {
                label: item.content,
                value: item.id,
              };
            })"
            placeholder="请选择 消息"
            multiple
            @change="onSearch(false)"
          ></CustomSelect>
        </el-form-item>
      </template>
      
      <template v-if="(showBuildIn || builtInSearch?.receiver_usr_id == null)">
        <el-form-item
          label="接收人"
          prop="receiver_usr_id"
        >
          <CustomSelect
            v-model="receiver_usr_id_search"
            :method="getListUsr"
            dirty-key="用户"
            :options-map="((item: UsrModel) => {
              return {
                label: item.lbl,
                value: item.id,
              };
            })"
            placeholder="请选择 接收人"
            multiple
            @change="onSearch(false)"
          ></CustomSelect>
        </el-form-item>
      </template>
      
      <template v-if="(showBuildIn || builtInSearch?.is_read == null)">
        <el-form-item
          label="已读"
          prop="is_read"
        >
          <DictSelect
            :model-value="is_read_search[0]"
            code="yes_no"
            placeholder="请选择 已读"
            @update:model-value="($event != null && $event !== '') ? is_read_search = [ $event ] : is_read_search = [ ]"
            @change="onSearch(false)"
          ></DictSelect>
        </el-form-item>
      </template>
      
      <template v-if="(showBuildIn || builtInSearch?.read_time == null)">
        <el-form-item
          label="阅读时间"
          prop="read_time"
        >
          <CustomDatePicker
            v-model="read_time_search"
            type="daterange"
            start-placeholder="开始"
            end-placeholder="结束"
            @clear="onSearchClear"
            @change="onSearch(false)"
          ></CustomDatePicker>
        </el-form-item>
      </template>
      
      <template v-if="(showBuildIn || builtInSearch?.create_time == null)">
        <el-form-item
          label="创建时间"
          prop="create_time"
        >
          <CustomDatePicker
            v-model="create_time_search"
            type="daterange"
            start-placeholder="开始"
            end-placeholder="结束"
            @clear="onSearchClear"
            @change="onSearch(false)"
          ></CustomDatePicker>
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
    un-flex="~ wrap"
    un-items-center
    un-gap="y-2"
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
        v-if="permit('delete', '删除') && !isLocked"
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
          <el-icon
            un-m="l-1"
          >
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
            
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
    </template>
    
    <template v-else>
      
      <el-button
        v-if="permit('delete', '还原') && !isLocked"
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
        v-if="permit('force_delete', '彻底删除') && !isLocked"
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
          
          <!-- 消息 -->
          <template v-if="'message_id_lbl' === col.prop && (showBuildIn || builtInSearch?.message_id == null)">
            <!-- @vue-generic {MessageReceiverModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 接收人 -->
          <template v-else-if="'receiver_usr_id_lbl' === col.prop && (showBuildIn || builtInSearch?.receiver_usr_id == null)">
            <!-- @vue-generic {MessageReceiverModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 已读 -->
          <template v-else-if="'is_read_lbl' === col.prop && (showBuildIn || builtInSearch?.is_read == null)">
            <!-- @vue-generic {MessageReceiverModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 阅读时间 -->
          <template v-else-if="'read_time_lbl' === col.prop && (showBuildIn || builtInSearch?.read_time == null)">
            <!-- @vue-generic {MessageReceiverModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 所属组织 -->
          <template v-else-if="'org_id_lbl' === col.prop && (showBuildIn || builtInSearch?.org_id == null)">
            <!-- @vue-generic {MessageReceiverModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 创建人 -->
          <template v-else-if="'create_usr_id_lbl' === col.prop && (showBuildIn || builtInSearch?.create_usr_id == null)">
            <!-- @vue-generic {MessageReceiverModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 创建时间 -->
          <template v-else-if="'create_time_lbl' === col.prop && (showBuildIn || builtInSearch?.create_time == null)">
            <!-- @vue-generic {MessageReceiverModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 更新人 -->
          <template v-else-if="'update_usr_id_lbl' === col.prop && (showBuildIn || builtInSearch?.update_usr_id == null)">
            <!-- @vue-generic {MessageReceiverModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 更新时间 -->
          <template v-else-if="'update_time_lbl' === col.prop">
            <!-- @vue-generic {MessageReceiverModel} -->
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
  getPagePathMessageReceiver,
  findAllMessageReceiver,
  findCountMessageReceiver,
  revertByIdsMessageReceiver,
  deleteByIdsMessageReceiver,
  forceDeleteByIdsMessageReceiver,
  useExportExcelMessageReceiver,
  importModelsMessageReceiver,
  useDownloadImportTemplateMessageReceiver,
} from "./Api.ts";

import {
  getListMessage, // 消息
  getListUsr, // 接收人
} from "./Api.ts";

defineOptions({
  name: "消息接收人",
});

const pagePath = getPagePathMessageReceiver();
// @ts-ignore
const __filename = new URL(import.meta.url).pathname;
const pageName = getCurrentInstance()?.type?.name as string;
const permitStore = usePermitStore();
const dirtyStore = useDirtyStore();

const clearDirty = dirtyStore.onDirty(onRefresh, pageName);

const {
  permit,
  permitAsync,
} = permitStore.getPermit(pagePath);

let inited = $ref(false);

const emit = defineEmits<{
  selectedIdsChg: [ MessageReceiverId[] ],
  add: [ MessageReceiverId[] ],
  edit: [ MessageReceiverId[] ],
  remove: [ number ],
  revert: [ number ],
  refresh: [ ],
  beforeSearchReset: [ ],
  rowEnter: [ KeyboardEvent? ],
  rowDblclick: [ MessageReceiverModel ],
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
  selectedIds?: MessageReceiverId[]; //已选择行的id列表
  isMultiple?: string; //是否多选
  id?: MessageReceiverId; // ID
  message_id?: string|string[]; // 消息
  message_id_lbl?: string; // 消息
  receiver_usr_id?: string|string[]; // 接收人
  receiver_usr_id_lbl?: string; // 接收人
  is_read?: string|string[]; // 已读
  read_time?: string; // 阅读时间
  org_id?: string|string[]; // 所属组织
  org_id_lbl?: string; // 所属组织
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
  message_id: "string[]",
  message_id_lbl: "string[]",
  receiver_usr_id: "string[]",
  receiver_usr_id_lbl: "string[]",
  is_read: "number[]",
  is_read_lbl: "string[]",
  org_id: "string[]",
  org_id_lbl: "string[]",
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
const builtInSearch: MessageReceiverSearch = $(initBuiltInSearch(
  props,
  builtInSearchType,
  propsNotInSearch,
));

/** 内置变量 */
const builtInModel: MessageReceiverModel = $(initBuiltInModel(
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
  } as MessageReceiverSearch;
  props.propsNotReset?.forEach((key) => {
    search[key] = builtInSearch[key];
  });
  return search;
}

let search = $ref<MessageReceiverSearch>(initSearch());

// 消息
const message_id_search = $computed({
  get() {
    return search.message_id || [ ];
  },
  set(val) {
    if (!val || val.length === 0) {
      search.message_id = undefined;
    } else {
      search.message_id = val;
    }
  },
});

// 接收人
const receiver_usr_id_search = $computed({
  get() {
    return search.receiver_usr_id || [ ];
  },
  set(val) {
    if (!val || val.length === 0) {
      search.receiver_usr_id = undefined;
    } else {
      search.receiver_usr_id = val;
    }
  },
});

// 已读
const is_read_search = $computed({
  get() {
    return search.is_read || [ ];
  },
  set(val) {
    if (!val || val.length === 0) {
      search.is_read = undefined;
    } else {
      search.is_read = val;
    }
  },
});

// 阅读时间
const read_time_search = $computed({
  get() {
    return search.read_time || [ ];
  },
  set(val) {
    if (!val || val.length === 0) {
      search.read_time = undefined;
    } else {
      search.read_time = [
        dayjs(val[0]).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        dayjs(val[1]).endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
      ];
    }
  },
});

// 创建时间
const create_time_search = $computed({
  get() {
    return search.create_time || [ ];
  },
  set(val) {
    if (!val || val.length === 0) {
      search.create_time = undefined;
    } else {
      search.create_time = [
        dayjs(val[0]).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        dayjs(val[1]).endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
      ];
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
  page.current = 1;
  await dataGrid(true);
}

/** 暂存查询 */
async function onSearchStaging(searchStaging?: MessageReceiverSearch) {
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
} = $(usePage(
  dataGrid,
  {
    isPagination,
  },
));

/** 表格选择功能 */
const tableSelected = useSelect(
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
} = $(tableSelected);

let selectedIds = $(tableSelected.selectedIds as unknown as MessageReceiverId[]);

watch(
  () => selectedIds,
  (newVal, oldVal) => {
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
let tableData = $ref<MessageReceiverModel[]>([ ]);

function getTableColumns(): ColumnType[] {
  return [
    {
      label: "消息",
      prop: "message_id_lbl",
      sortBy: "message_id_lbl",
      width: 320,
      align: "left",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "接收人",
      prop: "receiver_usr_id_lbl",
      sortBy: "receiver_usr_id_lbl",
      width: 200,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "已读",
      prop: "is_read_lbl",
      sortBy: "is_read",
      width: 100,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: false,
    },
    {
      label: "阅读时间",
      prop: "read_time_lbl",
      sortBy: "read_time",
      width: 160,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "所属组织",
      prop: "org_id_lbl",
      sortBy: "org_id_lbl",
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
let tableColumns = $ref<ColumnType[]>(getTableColumns());

/** 表格列 */
const {
  headerDragend,
  resetColumns,
  storeColumns,
  initColumns,
} = $(useTableColumns<MessageReceiverModel>(
  $$(tableColumns),
  {
    persistKey: __filename,
  },
));

watch(
  () => [
    showBuildIn,
    builtInSearch,
  ],
  () => {
    if (showBuildIn) {
      tableColumns = getTableColumns();
      return;
    }
    const keys = Object.keys(builtInSearch);
    for (const col of tableColumns) {
      if ((col.prop && keys.includes(col.prop)) || (col.sortBy && keys.includes(col.sortBy))) {
        col.hide = true;
        col.forceHide = true;
      }
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

const detailRef = $(useTemplateRef("detailRef"));

/** 刷新表格 */
async function dataGrid(
  isCount = false,
  opt?: GqlOpt,
) {
  clearDirty();
  const search = getDataSearch();
  if (isCount) {
    await Promise.all([
      useFindAll(search, opt),
      useFindCount(search, opt),
    ]);
  } else {
    await useFindAll(search, opt);
  }
}

function getDataSearch() {
  const is_deleted = search.is_deleted;
  const search2 = {
    ...search,
    idsChecked: undefined,
  };
  Object.assign(search2, builtInSearch);
  search2.is_deleted = is_deleted;
  if (idsChecked) {
    search2.ids = selectedIds;
  }
  return search2;
}

async function useFindAll(
  search: MessageReceiverSearch,
  opt?: GqlOpt,
) {
  if (isPagination) {
    const pgSize = page.size;
    const pgOffset = (page.current - 1) * page.size;
    tableData = await findAllMessageReceiver(
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
    tableData = await findAllMessageReceiver(
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
  search: MessageReceiverSearch,
  opt?: GqlOpt,
) {
  page.total = await findCountMessageReceiver(
    search,
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
  { prop, order, column }: {
    column: TableColumnCtx<MessageReceiverModel>;
    prop: string | null;
    order: TableSortOrder | null;
  },
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

const exportExcel = $ref(useExportExcelMessageReceiver());

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
  if (!await permitAsync("add")) {
    ElMessage.warning("无权限");
    return;
  }
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "新增 消息接收人",
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
  if (!await permitAsync("add")) {
    ElMessage.warning("无权限");
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning("请选择需要 复制 的 消息接收人");
    return;
  }
  const id = selectedIds[selectedIds.length - 1];
  const ids = [ id ];
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "复制 消息接收人",
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

const downloadImportTemplate = $ref(useDownloadImportTemplateMessageReceiver());

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
    [ "消息" ]: "message_id_lbl",
    [ "接收人" ]: "receiver_usr_id_lbl",
    [ "已读" ]: "is_read_lbl",
    [ "阅读时间" ]: "read_time_lbl",
    [ "所属组织" ]: "org_id_lbl",
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
    const models = await getExcelData<MessageReceiverInput>(
      file,
      header,
      {
        key_types: {
          "message_id_lbl": "string",
          "receiver_usr_id_lbl": "string",
          "is_read_lbl": "string",
          "read_time_lbl": "date",
          "org_id_lbl": "string",
        },
      },
    );
    messageHandler.close();
    const res = await importModelsMessageReceiver(
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
  if (!await permitAsync("edit")) {
    ElMessage.warning("无权限");
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning("请选择需要编辑的 消息接收人");
    return;
  }
  const ids = selectedIds;
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "编辑 消息接收人",
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
  row: MessageReceiverModel,
  column: TableColumnCtx<MessageReceiverModel> | null,
) {
  if (column?.type === "selection") {
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
    ElMessage.warning("请选择需要查看的 消息接收人");
    return;
  }
  const search = getDataSearch();
  const is_deleted = search.is_deleted;
  const ids = selectedIds;
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "查看 消息接收人",
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
  if (!await permitAsync("delete")) {
    ElMessage.warning("无权限");
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning("请选择需要删除的 消息接收人");
    return;
  }
  try {
    await ElMessageBox.confirm(`确定删除已选择的 ${ selectedIds.length } 消息接收人?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await deleteByIdsMessageReceiver(selectedIds);
  tableData = tableData.filter((item) => !selectedIds.includes(item.id));
  selectedIds = [ ];
  dirtyStore.fireDirty(pageName);
  await dataGrid(true);
  ElMessage.success(`删除 ${ num } 消息接收人 成功`);
  emit("remove", num);
}

/** 点击彻底删除 */
async function onForceDeleteByIds() {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (!await permitAsync("force_delete")) {
    ElMessage.warning("无权限");
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning("请选择需要 彻底删除 的 消息接收人");
    return;
  }
  try {
    await ElMessageBox.confirm(`确定 彻底删除 已选择的 ${ selectedIds.length } 消息接收人?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await forceDeleteByIdsMessageReceiver(selectedIds);
  if (num) {
    selectedIds = [ ];
    ElMessage.success(`彻底删除 ${ num } 消息接收人 成功`);
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
  if (await permitAsync("delete") === false) {
    ElMessage.warning("无权限");
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning("请选择需要还原的 消息接收人");
    return;
  }
  try {
    await ElMessageBox.confirm(`确定还原已选择的 ${ selectedIds.length } 消息接收人?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await revertByIdsMessageReceiver(selectedIds);
  if (num) {
    search.is_deleted = 0;
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
    ElMessage.success(`还原 ${ num } 消息接收人 成功`);
    emit("revert", num);
  }
}

async function focus() {
  const tableWrapper = tableRef?.context?.refs.tableWrapper
  if (!inited || !tableWrapper) {
    return;
  }
  tableWrapper.focus();
}

watch(
  () => [
    props.isFocus,
    inited,
  ],
  () => {
    const tableWrapper = tableRef?.context?.refs.tableWrapper
    if (!inited || !isFocus || !tableWrapper) {
      return;
    }
    tableWrapper.focus();
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
  computed(() => {
    const {
      selectedIds,
      isMultiple,
      showBuildIn,
      isPagination,
      isLocked,
      isFocus,
      propsNotReset,
      isListSelectDialog,
      ...rest
    // oxlint-disable-next-line @typescript-eslint/no-explicit-any
    } = builtInSearch as any;
    return rest;
  }),
  async function(newVal, oldVal) {
    if (!inited) {
      return;
    }
    if (isSearchReset) {
      return;
    }
    if (deepCompare(newVal, oldVal)) {
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
