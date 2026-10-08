<template>
<div
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
  un-w="full"
  un-h="full"
  un-p="l-1.5 r-1.5 t-1.5"
  un-box-border
>
  <template
    v-if="permit('find', '查看')"
  ></template>
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
      
      <template v-if="(builtInSearch?.sp_no == null && (showBuildIn || builtInSearch?.sp_no_like == null))">
        <el-form-item
          label="审批编号"
          prop="sp_no_like"
        >
          <CustomInput
            v-model="search.sp_no_like"
            placeholder="请输入 审批编号"
            @clear="onSearchClear"
          ></CustomInput>
        </el-form-item>
      </template>
      
      <template v-if="(builtInSearch?.sp_name == null && (showBuildIn || builtInSearch?.sp_name_like == null))">
        <el-form-item
          label="审批申请类型名称"
          prop="sp_name_like"
        >
          <CustomInput
            v-model="search.sp_name_like"
            placeholder="请输入 审批申请类型名称"
            @clear="onSearchClear"
          ></CustomInput>
        </el-form-item>
      </template>
      
      <template v-if="(showBuildIn || builtInSearch?.sp_status == null)">
        <el-form-item
          label="审批申请状态"
          prop="sp_status"
        >
          <DictSelect
            :model-value="sp_status_search[0]"
            code="wxw_oa_approval_detail_sp_status"
            placeholder="请选择 审批申请状态"
            @update:model-value="($event != null && $event !== '') ? sp_status_search = [ $event ] : sp_status_search = [ ]"
            @change="onSearch(false)"
          ></DictSelect>
        </el-form-item>
      </template>
      
      <template v-if="(builtInSearch?.template_id == null && (showBuildIn || builtInSearch?.template_id_like == null))">
        <el-form-item
          label="模板ID"
          prop="template_id_like"
        >
          <CustomInput
            v-model="search.template_id_like"
            placeholder="请输入 模板ID"
            @clear="onSearchClear"
          ></CustomInput>
        </el-form-item>
      </template>
      
      <template v-if="(showBuildIn || builtInSearch?.apply_time == null)">
        <el-form-item
          label="审批申请提交时间"
          prop="apply_time"
        >
          <CustomDatePicker
            v-model="apply_time_search"
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
    <template v-if="true">
      
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
            
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
    </template>
    
    <template v-else>
      
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
          
          <!-- 审批编号 -->
          <template v-if="'sp_no' === col.prop && (showBuildIn || builtInSearch?.sp_no == null)">
            <!-- @vue-generic {WxwOaApprovalDetailModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 审批申请类型名称 -->
          <template v-else-if="'sp_name' === col.prop && (showBuildIn || builtInSearch?.sp_name == null)">
            <!-- @vue-generic {WxwOaApprovalDetailModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 审批申请状态 -->
          <template v-else-if="'sp_status_lbl' === col.prop && (showBuildIn || builtInSearch?.sp_status == null)">
            <!-- @vue-generic {WxwOaApprovalDetailModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 模板ID -->
          <template v-else-if="'template_id' === col.prop && (showBuildIn || builtInSearch?.template_id == null)">
            <!-- @vue-generic {WxwOaApprovalDetailModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 审批申请提交时间 -->
          <template v-else-if="'apply_time_lbl' === col.prop && (showBuildIn || builtInSearch?.apply_time == null)">
            <!-- @vue-generic {WxwOaApprovalDetailModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 申请人 -->
          <template v-else-if="'applyer_userid' === col.prop">
            <!-- @vue-generic {WxwOaApprovalDetailModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 批量申请人 -->
          <template v-else-if="'batch_applyer_userid' === col.prop">
            <!-- @vue-generic {WxwOaApprovalDetailModel} -->
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 所属组织 -->
          <template v-else-if="'org_id_lbl' === col.prop && (showBuildIn || builtInSearch?.org_id == null)">
            <!-- @vue-generic {WxwOaApprovalDetailModel} -->
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
  
</div>
</template>

<script lang="ts" setup>
import Detail from "./Detail.vue";

import {
  getPagePathWxwOaApprovalDetail,
  findAllWxwOaApprovalDetail,
  findCountWxwOaApprovalDetail,
  deleteByIdsWxwOaApprovalDetail,
  useExportExcelWxwOaApprovalDetail,
} from "./Api.ts";

defineOptions({
  name: "审批申请详情",
});

const pagePath = getPagePathWxwOaApprovalDetail();
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
  selectedIdsChg: [ WxwOaApprovalDetailId[] ],
  add: [ WxwOaApprovalDetailId[] ],
  edit: [ WxwOaApprovalDetailId[] ],
  remove: [ number ],
  revert: [ number ],
  refresh: [ ],
  beforeSearchReset: [ ],
  rowEnter: [ KeyboardEvent? ],
  rowDblclick: [ WxwOaApprovalDetailModel ],
}>();

const props = defineProps<{
  showBuildIn?: string;
  isPagination?: string;
  isLocked?: string;
  isFocus?: string;
  propsNotReset?: string[];
  isListSelectDialog?: string;
  ids?: string[]; //ids
  selectedIds?: WxwOaApprovalDetailId[]; //已选择行的id列表
  isMultiple?: string; //是否多选
  id?: WxwOaApprovalDetailId; // ID
  sp_no?: string; // 审批编号
  sp_no_like?: string; // 审批编号
  sp_name?: string; // 审批申请类型名称
  sp_name_like?: string; // 审批申请类型名称
  sp_status?: string|string[]; // 审批申请状态
  template_id?: string; // 模板ID
  template_id_like?: string; // 模板ID
  apply_time?: string; // 审批申请提交时间
  org_id?: string|string[]; // 所属组织
  org_id_lbl?: string; // 所属组织
}>();

const builtInSearchType: { [key: string]: string } = {
  showBuildIn: "0|1",
  isPagination: "0|1",
  isMultiple: "0|1",
  isLocked: "0|1",
  isFocus: "0|1",
  isListSelectDialog: "0|1",
  ids: "string[]",
  sp_status: "number[]",
  sp_status_lbl: "string[]",
  org_id: "string[]",
  org_id_lbl: "string[]",
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
const builtInSearch: WxwOaApprovalDetailSearch = $(initBuiltInSearch(
  props,
  builtInSearchType,
  propsNotInSearch,
));

/** 内置变量 */
const builtInModel: WxwOaApprovalDetailModel = $(initBuiltInModel(
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
  } as WxwOaApprovalDetailSearch;
  props.propsNotReset?.forEach((key) => {
    search[key] = builtInSearch[key];
  });
  return search;
}

let search = $ref<WxwOaApprovalDetailSearch>(initSearch());

// 审批申请状态
const sp_status_search = $computed({
  get() {
    return search.sp_status || [ ];
  },
  set(val) {
    if (!val || val.length === 0) {
      search.sp_status = undefined;
    } else {
      search.sp_status = val;
    }
  },
});

// 审批申请提交时间
const apply_time_search = $computed({
  get() {
    return search.apply_time || [ ];
  },
  set(val) {
    if (!val || val.length === 0) {
      search.apply_time = undefined;
    } else {
      search.apply_time = [
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
async function onSearchStaging(searchStaging?: WxwOaApprovalDetailSearch) {
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

let selectedIds = $(tableSelected.selectedIds as unknown as WxwOaApprovalDetailId[]);

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
let tableData = $ref<WxwOaApprovalDetailModel[]>([ ]);

function getTableColumns(): ColumnType[] {
  return [
    {
      label: "审批编号",
      prop: "sp_no",
      width: 220,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "审批申请类型名称",
      prop: "sp_name",
      width: 220,
      align: "left",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "审批申请状态",
      prop: "sp_status_lbl",
      sortBy: "sp_status",
      width: 130,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: false,
    },
    {
      label: "模板ID",
      prop: "template_id",
      width: 220,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "审批申请提交时间",
      prop: "apply_time_lbl",
      sortBy: "apply_time",
      width: 160,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "申请人",
      prop: "applyer_userid",
      width: 180,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "批量申请人",
      prop: "batch_applyer_userid",
      width: 200,
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
} = $(useTableColumns<WxwOaApprovalDetailModel>(
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
  const search2 = {
    ...search,
    idsChecked: undefined,
  };
  Object.assign(search2, builtInSearch);
  if (idsChecked) {
    search2.ids = selectedIds;
  }
  return search2;
}

async function useFindAll(
  search: WxwOaApprovalDetailSearch,
  opt?: GqlOpt,
) {
  if (isPagination) {
    const pgSize = page.size;
    const pgOffset = (page.current - 1) * page.size;
    tableData = await findAllWxwOaApprovalDetail(
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
    tableData = await findAllWxwOaApprovalDetail(
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
  search: WxwOaApprovalDetailSearch,
  opt?: GqlOpt,
) {
  page.total = await findCountWxwOaApprovalDetail(
    search,
    opt,
  );
}

const _defaultSort: Sort = {
  prop: "apply_time",
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
    column: TableColumnCtx<WxwOaApprovalDetailModel>;
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

const exportExcel = $ref(useExportExcelWxwOaApprovalDetail());

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

/** 键盘回车按键 */
async function onRowEnter(e: KeyboardEvent) {
  if (props.selectedIds != null) {
    emit("rowEnter", e);
    return;
  }
  await openView();
}

/** 双击行 */
async function onRowDblclick(
  row: WxwOaApprovalDetailModel,
  column: TableColumnCtx<WxwOaApprovalDetailModel> | null,
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
    ElMessage.warning("请选择需要查看的 审批申请详情");
    return;
  }
  const search = getDataSearch();
  const ids = selectedIds;
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "查看 审批申请详情",
    action: "view",
    builtInModel,
    showBuildIn: $$(showBuildIn),
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
    ElMessage.warning("请选择需要删除的 审批申请详情");
    return;
  }
  try {
    await ElMessageBox.confirm(`确定删除已选择的 ${ selectedIds.length } 审批申请详情?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const num = await deleteByIdsWxwOaApprovalDetail(selectedIds);
  tableData = tableData.filter((item) => !selectedIds.includes(item.id));
  selectedIds = [ ];
  dirtyStore.fireDirty(pageName);
  await dataGrid(true);
  ElMessage.success(`删除 ${ num } 审批申请详情 成功`);
  emit("remove", num);
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
