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
      
      <template v-if="(showBuildIn == '1' || builtInSearch?.lbl_like == null && builtInSearch?.lbl == null)">
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
      
      <template v-if="(showBuildIn == '1' || builtInSearch?.menu_ids == null)">
        <el-form-item
          label="菜单"
          prop="menu_ids"
        >
          <CustomSelect
            :set="search.menu_ids = search.menu_ids || [ ]"
            un-w="full"
            v-model="search.menu_ids"
            :method="getMenuList"
            :options-map="((item: MenuModel) => {
              return {
                label: item.lbl,
                value: item.id,
              };
            })"
            :placeholder="`${ ns('请选择') } ${ n('菜单') }`"
            multiple
            @change="searchClk"
          ></CustomSelect>
        </el-form-item>
      </template>
      
      <template v-if="(showBuildIn == '1' || builtInSearch?.is_deleted == null)">
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
        v-if="permit('add')"
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
        v-if="permit('add')"
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
        v-if="permit('edit')"
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
        v-if="permit('delete')"
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
              @click="importExcelClk"
            >
              <span>{{ ns('导入') }}</span>
            </el-dropdown-item>
            
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
    </template>
    
    <template v-else>
      
      <el-button
        v-if="permit('delete')"
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
        v-if="permit('force_delete')"
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
          
          <!-- 名称 -->
          <template v-if="'lbl' === col.prop && (showBuildIn == '1' || builtInSearch?.lbl == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 域名绑定 -->
          <template v-else-if="'host' === col.prop && (showBuildIn == '1' || builtInSearch?.host == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 到期日 -->
          <template v-else-if="'expiration' === col.prop && (showBuildIn == '1' || builtInSearch?.expiration == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 最大用户数 -->
          <template v-else-if="'max_usr_num' === col.prop && (showBuildIn == '1' || builtInSearch?.max_usr_num == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 启用 -->
          <template v-else-if="'is_enabled' === col.prop && (showBuildIn == '1' || builtInSearch?.is_enabled == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 菜单 -->
          <template v-else-if="'menu_ids_lbl' === col.prop && (showBuildIn == '1' || builtInSearch?.menu_ids == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  
                  min="w-7.5"
                  
                  @click="menu_idsClk(row)"
                >
                  {{ row[column.property]?.length || 0 }}
                </el-link>
              </template>
            </el-table-column>
          </template>
          
          <!-- 排序 -->
          <template v-else-if="'order_by' === col.prop && (showBuildIn == '1' || builtInSearch?.order_by == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 备注 -->
          <template v-else-if="'rem' === col.prop && (showBuildIn == '1' || builtInSearch?.rem == null)">
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
  
  <ListSelectDialog
    ref="menu_idsListSelectDialogRef"
    v-slot="{ selectedIds }"
  >
    <MenuList
      :selected-ids="selectedIds"
      @selected-ids-chg="menu_idsListSelectDialogRef?.selectedIdsChg($event)"
    ></MenuList>
  </ListSelectDialog>
  
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
  
</div>
</template>

<script lang="ts" setup>
import Detail from "./Detail.vue";
import MenuList from "../menu/List.vue";

import {
  findAll,
  findCount,
  revertByIds,
  deleteByIds,
  forceDeleteByIds,
  useExportExcel,
  updateById,
  importModels,
} from "./Api";

import {
  type TenantModel,
  type TenantInput,
  type TenantSearch,
  type MenuModel,
} from "#/types";

import {
  getMenuList,
} from "./Api";

defineOptions({
  name: "租户",
});

const {
  n,
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns
} = useI18n("/base/tenant");

const usrStore = useUsrStore();
const permitStore = usePermitStore();

const permit = permitStore.getPermit("/base/tenant");

let inited = $ref(false);

const emit = defineEmits([
  "selectedIdsChg",
  "add",
  "edit",
  "remove",
  "revert",
  "beforeSearchReset",
]);

/** 表格 */
let tableRef = $ref<InstanceType<typeof ElTable>>();

/** 搜索 */
function initSearch() {
  return {
    is_deleted: 0,
    menu_ids: [ ],
  } as TenantSearch;
}

let search = $ref(initSearch());

/** 回收站 */
async function recycleChg() {
  selectedIds = [ ];
  await searchClk();
}

/** 搜索 */
async function searchClk() {
  await dataGrid(true);
}

/** 重置搜索 */
async function searchReset() {
  search = initSearch();
  idsChecked = 0;
  resetSelectedIds();
  emit("beforeSearchReset");
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
  showBuildIn?: string;
  ids?: string[]; //ids
  selectedIds?: string[]; //已选择行的id列表
  isMultiple?: Boolean; //是否多选
  id?: string; // ID
  lbl?: string; // 名称
  lbl_like?: string; // 名称
  host?: string; // 域名绑定
  host_like?: string; // 域名绑定
  expiration?: string; // 到期日
  max_usr_num?: string; // 最大用户数
  is_enabled?: string|string[]; // 启用
  menu_ids?: string|string[]; // 菜单
  menu_ids_lbl?: string|string[]; // 菜单
  order_by?: string; // 排序
  rem?: string; // 备注
  rem_like?: string; // 备注
}>();

const builtInSearchType: { [key: string]: string } = {
  is_deleted: "0|1",
  showBuildIn: "0|1",
  ids: "string[]",
  max_usr_num: "number",
  is_enabled: "number[]",
  is_enabled_lbl: "string[]",
  menu_ids: "string[]",
  menu_ids_lbl: "string[]",
  order_by: "number",
};

const propsNotInSearch: string[] = [
  "selectedIds",
  "isMultiple",
  "showBuildIn",
];

/** 内置搜索条件 */
const builtInSearch: TenantSearch = $computed(() => {
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
  return Object.fromEntries(entries) as unknown as TenantSearch;
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
  return Object.fromEntries(entries) as unknown as TenantModel;
});

/** 分页功能 */
let {
  page,
  pageSizes,
  pgSizeChg,
  pgCurrentChg,
} = $(usePage<TenantModel>(dataGrid));

/** 表格选择功能 */
let {
  selectedIds,
  selectChg,
  rowClassName,
  rowClk,
  rowClkCtrl,
  rowClkShift,
} = $(useSelect<TenantModel>(
  $$(tableRef),
  {
    multiple: props.isMultiple,
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
let tableData = $ref<TenantModel[]>([ ]);

function getTableColumns(): ColumnType[] {
  return [
    {
      label: "名称",
      prop: "lbl",
      width: 140,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "域名绑定",
      prop: "host",
      width: 280,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "到期日",
      prop: "expiration_lbl",
      width: 140,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "最大用户数",
      prop: "max_usr_num",
      width: 100,
      align: "right",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "启用",
      prop: "is_enabled_lbl",
      width: 60,
      align: "center",
      headerAlign: "center",
      showOverflowTooltip: true,
    },
    {
      label: "菜单",
      prop: "menu_ids_lbl",
      minWidth: 50,
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
} = $(useTableColumns<TenantModel>(
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
  };
  if (props.showBuildIn == "0") {
    Object.assign(search2, builtInSearch, { idsChecked: undefined });
  }
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

let sort: Sort = $ref({
  prop: "order_by",
  order: "ascending",
});

/** 排序 */
async function sortChange(
  { prop, order, column }: { column: TableColumnCtx<TenantModel> } & Sort,
) {
  sort.prop = prop || "";
  sort.order = order || "ascending";
  await dataGrid();
}

let exportExcel = $ref(useExportExcel("/base/tenant"));

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
  if (!detailRef) {
    return;
  }
  const {
    type,
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("增加"),
    action: "add",
    builtInModel,
    showBuildIn: props.showBuildIn,
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
    ElMessage.warning(await nsAsync("请选择需要 复制 的数据"));
    return;
  }
  const {
    type,
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("复制"),
    action: "copy",
    builtInModel,
    showBuildIn: props.showBuildIn,
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

let importPercentage = $ref(0);
let isImporting = $ref(false);
let isCancelImport = $ref(false);

/** 弹出导入窗口 */
async function importExcelClk() {
  if (!uploadFileDialogRef) {
    return;
  }
  const header: { [key: string]: string } = {
    [ n("名称") ]: "lbl",
    [ n("域名绑定") ]: "host",
    [ n("到期日") ]: "expiration",
    [ n("最大用户数") ]: "max_usr_num",
    [ n("启用") ]: "is_enabled_lbl",
    [ n("菜单") ]: "menu_ids_lbl",
    [ n("排序") ]: "order_by",
    [ n("备注") ]: "rem",
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
    const models = await getExcelData<TenantInput>(
      file,
      header,
      {
        date_keys: [
          n("到期日"),
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

/** 打开修改页面 */
async function openEdit() {
  if (!detailRef) {
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要修改的数据"));
    return;
  }
  const {
    type,
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("修改"),
    action: "edit",
    builtInModel,
    showBuildIn: props.showBuildIn,
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

/** 点击还原 */
async function revertByIdsEfc() {
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

/** 初始化ts中的国际化信息 */
async function initI18nsEfc() {
  const codes: string[] = [
    "名称",
    "域名绑定",
    "到期日",
    "最大用户数",
    "启用",
    "菜单",
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
  async function() {
    search = {
      ...search,
      ...builtInSearch,
    };
    await searchClk();
  },
  {
    deep: true,
  },
);

usrStore.onLogin(initFrame);

initFrame();

let menu_idsListSelectDialogRef = $ref<InstanceType<typeof ListSelectDialog>>();

async function menu_idsClk(row: TenantModel) {
  if (!menu_idsListSelectDialogRef) return;
  row.menu_ids = row.menu_ids || [ ];
  let {
    selectedIds: selectedIds2,
    action
  } = await menu_idsListSelectDialogRef.showDialog({
    selectedIds: row.menu_ids as string[],
  });
  if (action === "select") {
    selectedIds2 = selectedIds2 || [ ];
    let isEqual = true;
    if (selectedIds2.length === row.menu_ids.length) {
      for (let i = 0; i < selectedIds2.length; i++) {
        const item = selectedIds2[i];
        if (!row.menu_ids.includes(item)) {
          isEqual = false;
          break;
        }
      }
    } else {
      isEqual = false;
    }
    if (!isEqual) {
      row.menu_ids = selectedIds2;
      await updateById(row.id, { menu_ids: selectedIds2 });
      await dataGrid();
    }
  }
}

defineExpose({
  refresh: searchClk,
});
</script>
