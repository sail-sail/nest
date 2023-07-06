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
      
      <template v-if="showBuildIn || builtInSearch?.code_like == null && builtInSearch?.code == null">
        <el-form-item
          :label="n('编码')"
          prop="code_like"
        >
          <el-input
            v-model="search.code_like"
            un-w="full"
            :placeholder="`${ ns('请输入') } ${ n('编码') }`"
            clearable
            @clear="searchIptClr"
          ></el-input>
        </el-form-item>
      </template>
      
      <template v-if="showBuildIn || builtInSearch?.lbl_like == null && builtInSearch?.lbl == null">
        <el-form-item
          :label="n('名称')"
          prop="lbl_like"
        >
          <el-input
            v-model="search.lbl_like"
            un-w="full"
            :placeholder="`${ ns('请输入') } ${ n('名称') }`"
            clearable
            @clear="searchIptClr"
          ></el-input>
        </el-form-item>
      </template>
      
      <template v-if="showBuildIn || builtInSearch?.is_deleted == null">
        <el-form-item
          label=" "
          prop="is_deleted"
        >
          <el-checkbox
            :set="search.is_deleted = search.is_deleted || 0"
            v-model="search.is_deleted"
            :false-label="0"
            :true-label="1"
            @change="recycleChg"
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
        label=" "
        un-self-start
        un-flex="~ nowrap"
        un-w="full"
        un-p="l-1"
        un-box-border
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
        v-if="permit('edit') && !isLocked"
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
        v-if="permit('edit') && !isLocked"
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
        @click="deleteByIdsEfc"
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
          <ElIconView />
        </template>
        <span>{{ ns('查看') }}</span>
      </el-button>
    
      <el-button
        plain
        @click="refreshClk"
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
              v-if="permit('edit') && !isLocked"
              un-justify-center
              @click="importExcelClk"
            >
              <span>{{ ns('导入') }}</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('edit') && !isLocked"
              un-justify-center
              @click="enableByIdsClk(1)"
            >
              <span>{{ ns('启用') }}</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('edit') && !isLocked"
              un-justify-center
              @click="enableByIdsClk(0)"
            >
              <span>{{ ns('禁用') }}</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('edit') && !isLocked"
              un-justify-center
              @click="lockByIdsClk(1)"
            >
              <span>{{ ns('锁定') }}</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('edit') && !isLocked"
              un-justify-center
              @click="lockByIdsClk(0)"
            >
              <span>{{ ns('解锁') }}</span>
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
        @click="revertByIdsEfc"
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
        @sort-change="sortChange"
        @click.ctrl="rowClkCtrl"
        @click.shift="rowClkShift"
        @header-dragend="headerDragend"
        @row-dblclick="openView"
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
          
          <!-- 编码 -->
          <template v-if="'code' === col.prop && (showBuildIn || builtInSearch?.code == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  @click="openForeignTabs(row.id, row[column.property])"
                >
                  {{ row[column.property] }}
                </el-link>
              </template>
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
          
          <!-- 数据类型 -->
          <template v-else-if="'type_lbl' === col.prop && (showBuildIn || builtInSearch?.type == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 锁定 -->
          <template v-else-if="'is_locked_lbl' === col.prop && (showBuildIn || builtInSearch?.is_locked == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row }">
                <CustomSwitch
                  v-if="permit('edit') && row.is_deleted !== 1 && !isLocked"
                  v-model="row.is_locked"
                  @change="is_lockedChg(row.id, row.is_locked)"
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
                  v-if="permit('edit') && row.is_locked !== 1 && row.is_deleted !== 1 && !isLocked"
                  v-model="row.is_enabled"
                  @change="is_enabledChg(row.id, row.is_enabled)"
                ></CustomSwitch>
              </template>
            </el-table-column>
          </template>
          
          <!-- 排序 -->
          <template v-else-if="'order_by' === col.prop && (showBuildIn || builtInSearch?.order_by == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row }">
                <CustomInputNumber
                  v-if="permit('edit') && row.is_locked !== 1 && row.is_deleted !== 1 && !isLocked"
                  v-model="row.order_by"
                  :min="0"
                  @change="updateById(row.id, { order_by: row.order_by }, { notLoading: true })"
                ></CustomInputNumber>
              </template>
            </el-table-column>
          </template>
          
          <!-- 备注 -->
          <template v-else-if="'rem' === col.prop && (showBuildIn || builtInSearch?.rem == null)">
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
          <template v-else-if="'create_time' === col.prop && (showBuildIn || builtInSearch?.create_time == null)">
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
          <template v-else-if="'update_time' === col.prop && (showBuildIn || builtInSearch?.update_time == null)">
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
  ></UploadFileDialog>
  
  <ImportPercentageDialog
    :percentage="importPercentage"
    :dialog_visible="isImporting"
    @cancel="cancelImport"
  ></ImportPercentageDialog>
  
  <ForeignTabs
    ref="foreignTabsRef"
  ></ForeignTabs>
  
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
  enableByIds,
  lockByIds,
  useExportExcel,
  updateById,
  importModels,
} from "./Api";

import {
  type DictModel,
  type DictInput,
  type DictSearch,
  type UsrModel,
} from "#/types";

import ForeignTabs from "./ForeignTabs.vue";

defineOptions({
  name: "系统字典",
});

const {
  n,
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns
} = useI18n("/base/dict");

const usrStore = useUsrStore();
const permitStore = usePermitStore();

const permit = permitStore.getPermit("/base/dict");

let inited = $ref(false);

const emit = defineEmits([
  "selectedIdsChg",
  "add",
  "edit",
  "remove",
  "revert",
  "refresh",
  "beforeSearchReset",
]);

/** 表格 */
let tableRef = $ref<InstanceType<typeof ElTable>>();

/** 搜索 */
function initSearch() {
  return {
    is_deleted: 0,
  } as DictSearch;
}

let search = $ref(initSearch());

/** 回收站 */
async function recycleChg() {
  selectedIds = [ ];
  await dataGrid(true);
}

/** 搜索 */
async function searchClk() {
  await dataGrid(true);
}

/** 刷新 */
async function refreshClk() {
  emit("refresh");
  await dataGrid(true);
}

/** 重置搜索 */
async function searchReset() {
  search = initSearch();
  idsChecked = 0;
  resetSelectedIds();
  emit("beforeSearchReset");
  await dataGrid(true);
}

/** 清空搜索框事件 */
async function searchIptClr() {
  await dataGrid(true);
}

/** 点击已选择 */
async function idsCheckedChg() {
  await dataGrid(true);
}

const props = defineProps<{
  is_deleted?: string;
  showBuildIn?: string;
  isPagination?: string;
  isLocked?: string;
  ids?: string[]; //ids
  selectedIds?: string[]; //已选择行的id列表
  isMultiple?: Boolean; //是否多选
  id?: string; // ID
  code?: string; // 编码
  code_like?: string; // 编码
  lbl?: string; // 名称
  lbl_like?: string; // 名称
  type?: string|string[]; // 数据类型
  is_locked?: string|string[]; // 锁定
  is_enabled?: string|string[]; // 启用
  order_by?: string; // 排序
  rem?: string; // 备注
  rem_like?: string; // 备注
  create_usr_id?: string|string[]; // 创建人
  create_usr_id_lbl?: string|string[]; // 创建人
  create_time?: string; // 创建时间
  update_usr_id?: string|string[]; // 更新人
  update_usr_id_lbl?: string|string[]; // 更新人
  update_time?: string; // 更新时间
}>();

const builtInSearchType: { [key: string]: string } = {
  is_deleted: "0|1",
  showBuildIn: "0|1",
  isPagination: "0|1",
  isLocked: "0|1",
  ids: "string[]",
  type: "string[]",
  type_lbl: "string[]",
  is_locked: "number[]",
  is_locked_lbl: "string[]",
  is_enabled: "number[]",
  is_enabled_lbl: "string[]",
  order_by: "number",
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
];

/** 内置搜索条件 */
const builtInSearch: DictSearch = $computed(() => {
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
  return Object.fromEntries(entries) as unknown as DictSearch;
});

/** 是否多选 */
let multiple = $ref(true);

watch(
  () => props.isMultiple,
  () => {
    if (props.isMultiple === false) {
      multiple = false;
    } else {
      multiple = true;
    }
  },
  {
    immediate: true,
  },
);

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

watch(
  () => props.showBuildIn,
  () => {
    if (props.showBuildIn === "1") {
      showBuildIn = true;
    } else {
      showBuildIn = false;
    }
  },
  {
    immediate: true,
  },
);

/** 是否分页 */
let isPagination = $ref(true);

watch(
  () => props.isPagination,
  () => {
    if (props.isPagination === "0") {
      isPagination = false;
    } else {
      isPagination = true;
    }
  },
  {
    immediate: true,
  },
);

/** 是否只读模式 */
let isLocked = $ref(false);

watch(
  () => props.isLocked,
  () => {
    if (props.isLocked === "1") {
      isLocked = true;
    } else {
      isLocked = false;
    }
  },
  {
    immediate: true,
  },
);

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
  return Object.fromEntries(entries) as unknown as DictModel;
});

/** 分页功能 */
let {
  page,
  pageSizes,
  pgSizeChg,
  pgCurrentChg,
} = $(usePage<DictModel>(dataGrid));

/** 表格选择功能 */
let {
  selectedIds,
  selectChg,
  rowClassName,
  rowClk,
  rowClkCtrl,
  rowClkShift,
} = $(useSelect<DictModel>(
  $$(tableRef),
  {
    multiple: $$(multiple),
  },
));

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
let tableData = $ref<DictModel[]>([ ]);

function getTableColumns(): ColumnType[] {
  return [
    {
      label: "编码",
      prop: "code",
      width: 240,
      align: "left",
      headerAlign: "center",
      showOverflowTooltip: true,
      fixed: "left",
    },
    {
      label: "名称",
      prop: "lbl",
      width: 240,
      align: "left",
      headerAlign: "center",
      showOverflowTooltip: true,
      fixed: "left",
    },
    {
      label: "数据类型",
      prop: "type_lbl",
      width: 100,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "锁定",
      prop: "is_locked_lbl",
      width: 60,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: false,
    },
    {
      label: "启用",
      prop: "is_enabled_lbl",
      width: 60,
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
      width: 120,
      align: "left",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "创建时间",
      prop: "create_time_lbl",
      width: 150,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "更新人",
      prop: "update_usr_id_lbl",
      width: 120,
      align: "left",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "更新时间",
      prop: "update_time_lbl",
      width: 150,
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
} = $(useTableColumns<DictModel>(
  $$(tableColumns),
  {
    persistKey: new URL(import.meta.url).pathname,
  },
));

let detailRef = $ref<InstanceType<typeof Detail>>();

/** 刷新表格 */
async function dataGrid(
  isCount = false,
  opt?: GqlOpt,
) {
  if (isCount) {
    await Promise.all([
      useFindAll(opt),
      useFindCount(opt),
    ]);
  } else {
    await useFindAll(opt);
  }
}

function getDataSearch() {
  let search2 = {
    ...search,
    idsChecked: undefined,
  };
  if (!showBuildIn) {
    Object.assign(search2, builtInSearch);
  }
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

let sort: Sort = $ref({
  prop: "order_by",
  order: "ascending",
});

/** 排序 */
async function sortChange(
  { prop, order, column }: { column: TableColumnCtx<DictModel> } & Sort,
) {
  sort.prop = prop || "";
  sort.order = order || "ascending";
  await dataGrid();
}

let exportExcel = $ref(useExportExcel("/base/dict"));

/** 导出Excel */
async function exportClk() {
  await exportExcel.workerFn(search, [ sort ]);
}

/** 取消导出Excel */
async function cancelExportClk() {
  exportExcel.workerTerminate();
}

/** 打开增加页面 */
async function openAdd() {
  if (isLocked) {
    return;
  }
  if (!detailRef) {
    return;
  }
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("增加"),
    action: "add",
    builtInModel,
    showBuildIn: $$(showBuildIn),
  });
  if (changedIds.length === 0) {
    return;
  }
  selectedIds = [
    ...changedIds,
  ];
  await Promise.all([
    dataGrid(true),
  ]);
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
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要 复制 的数据"));
    return;
  }
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("复制"),
    action: "copy",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    model: {
      id: selectedIds[selectedIds.length - 1],
    },
  });
  if (changedIds.length === 0) {
    return;
  }
  selectedIds = [
    ...changedIds,
  ];
  await Promise.all([
    dataGrid(true),
  ]);
  emit("add", changedIds);
}

let uploadFileDialogRef = $ref<InstanceType<typeof UploadFileDialog>>();

let importPercentage = $ref(0);
let isImporting = $ref(false);
let isCancelImport = $ref(false);

/** 弹出导入窗口 */
async function importExcelClk() {
  if (isLocked) {
    return;
  }
  if (!uploadFileDialogRef) {
    return;
  }
  const header: { [key: string]: string } = {
    [ n("编码") ]: "code",
    [ n("名称") ]: "lbl",
    [ n("数据类型") ]: "type_lbl",
    [ n("锁定") ]: "is_locked_lbl",
    [ n("启用") ]: "is_enabled_lbl",
    [ n("排序") ]: "order_by",
    [ n("备注") ]: "rem",
    [ n("创建人") ]: "create_usr_id_lbl",
    [ n("创建时间") ]: "create_time",
    [ n("更新人") ]: "update_usr_id_lbl",
    [ n("更新时间") ]: "update_time",
  };
  const file = await uploadFileDialogRef.showDialog({
    title: await nsAsync("批量导入"),
  });
  if (!file) {
    return;
  }
  isCancelImport = false;
  isImporting = true;
  let msg: VNode | undefined = undefined;
  let succNum = 0;
  try {
    ElMessage.info(await nsAsync("正在导入..."));
    const models = await getExcelData<DictInput>(
      file,
      header,
      {
        date_keys: [
          n("创建时间"),
          n("更新时间"),
        ],
      },
    );
    const res = await importModels(
      models,
      $$(importPercentage),
      $$(isCancelImport),
    );
    msg = res.msg;
    succNum = res.succNum;
  } finally {
    isImporting = false;
    importPercentage = 0;
  }
  if (msg) {
    ElMessageBox.alert(msg)
  }
  if (succNum > 0) {
    await dataGrid(true);
  }
}

/** 取消导入 */
async function cancelImport() {
  isCancelImport = true;
  isImporting = false;
  importPercentage = 0;
}

/** 锁定 */
async function is_lockedChg(id: string, is_locked: 0 | 1) {
  if (isLocked) {
    return;
  }
  const notLoading = true;
  await lockByIds(
    [ id ],
    is_locked,
    {
      notLoading,
    },
  );
  await dataGrid(
    true,
    {
      notLoading,
    },
  );
}

/** 启用 */
async function is_enabledChg(id: string, is_enabled: 0 | 1) {
  if (isLocked) {
    return;
  }
  const notLoading = true;
  await enableByIds(
    [ id ],
    is_enabled,
    {
      notLoading,
    },
  );
  await dataGrid(
    true,
    {
      notLoading,
    },
  );
}

/** 打开修改页面 */
async function openEdit() {
  if (isLocked) {
    return;
  }
  if (!detailRef) {
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要修改的数据"));
    return;
  }
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("修改"),
    action: "edit",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    isReadonly: $$(isLocked),
    isLocked: $$(isLocked),
    model: {
      ids: selectedIds,
    },
  });
  if (changedIds.length === 0) {
    return;
  }
  await Promise.all([
    dataGrid(),
  ]);
  emit("edit", changedIds);
}

/** 打开查看 */
async function openView() {
  if (!detailRef) {
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要查看的数据"));
    return;
  }
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("查看"),
    action: "view",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    isLocked: $$(isLocked),
    model: {
      ids: selectedIds,
    },
  });
  if (changedIds.length === 0) {
    return;
  }
  await Promise.all([
    dataGrid(),
  ]);
  emit("edit", changedIds);
}

/** 点击删除 */
async function deleteByIdsEfc() {
  if (isLocked) {
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要删除的数据"));
    return;
  }
  try {
    await ElMessageBox.confirm(`${ await nsAsync("确定删除已选择的 {0} 条数据", selectedIds.length) }?`, {
      confirmButtonText: await nsAsync("确定"),
      cancelButtonText: await nsAsync("取消"),
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
    ElMessage.success(await nsAsync("删除 {0} 条数据成功", num));
    emit("remove", num);
  }
}

/** 点击彻底删除 */
async function forceDeleteByIdsClk() {
  if (isLocked) {
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要 彻底删除 的数据"));
    return;
  }
  try {
    await ElMessageBox.confirm(`${ await nsAsync("确定 彻底删除 已选择的 {0} 条数据", selectedIds.length) }?`, {
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
    ElMessage.success(await nsAsync("彻底删除 {0} 条数据成功", num));
    await Promise.all([
      dataGrid(true),
    ]);
  }
}

/** 点击启用或者禁用 */
async function enableByIdsClk(is_enabled: 0 | 1) {
  if (isLocked) {
    return;
  }
  if (selectedIds.length === 0) {
    let msg = "";
    if (is_enabled === 1) {
      msg = await nsAsync("请选择需要 启用 的数据");
    } else {
      msg = await nsAsync("请选择需要 禁用 的数据");
    }
    ElMessage.warning(msg);
    return;
  }
  const num = await enableByIds(selectedIds, is_enabled);
  if (num > 0) {
    let msg = "";
    if (is_enabled === 1) {
      msg = await nsAsync("启用 {0} 条数据成功", num);
    } else {
      msg = await nsAsync("禁用 {0} 条数据成功", num);
    }
    ElMessage.success(msg);
    await dataGrid(true);
  }
}

/** 点击锁定或者解锁 */
async function lockByIdsClk(is_locked: 0 | 1) {
  if (isLocked) {
    return;
  }
  if (selectedIds.length === 0) {
    let msg = "";
    if (is_locked === 1) {
      msg = await nsAsync("请选择需要 锁定 的数据");
    } else {
      msg = await nsAsync("请选择需要 解锁 的数据");
    }
    ElMessage.warning(msg);
    return;
  }
  const num = await lockByIds(selectedIds, is_locked);
  if (num > 0) {
    let msg = "";
    if (is_locked === 1) {
      msg = await nsAsync("锁定 {0} 条数据成功", num);
    } else {
      msg = await nsAsync("解锁 {0} 条数据成功", num);
    }
    ElMessage.success(msg);
    await dataGrid(true);
  }
}

/** 点击还原 */
async function revertByIdsEfc() {
  if (isLocked) {
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要还原的数据"));
    return;
  }
  try {
    await ElMessageBox.confirm(`${ await nsAsync("确定还原已选择的 {0} 条数据", selectedIds.length) }?`, {
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
    await Promise.all([
      dataGrid(true),
    ]);
    ElMessage.success(await nsAsync("还原 {0} 条数据成功", num));
    emit("revert", num);
  }
}

let foreignTabsRef = $ref<InstanceType<typeof ForeignTabs>>();

async function openForeignTabs(id: string, title: string) {
  if (!foreignTabsRef) {
    return;
  }
  await foreignTabsRef.showDialog({
    title,
    model: {
      id,
    },
  });
}

/** 初始化ts中的国际化信息 */
async function initI18nsEfc() {
  const codes: string[] = [
    "编码",
    "名称",
    "数据类型",
    "锁定",
    "启用",
    "排序",
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

async function initFrame() {
  if (!usrStore.authorization) {
    return;
  }
  await Promise.all([
    initI18nsEfc(),
    dataGrid(true),
  ]);
  if (tableData.length === 1) {
    await nextTick();
    selectedIds = [ tableData[0].id ];
  }
  inited = true;
}

watch(
  () => builtInSearch,
  async function() {
    search = {
      ...search,
      ...builtInSearch,
    };
    await dataGrid(true);
  },
  {
    deep: true,
  },
);

usrStore.onLogin(initFrame);

initFrame();

defineExpose({
  refresh: refreshClk,
});
</script>
