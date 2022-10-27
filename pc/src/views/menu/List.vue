<template>
<div
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
  un-w="full"
  un-h="full"
  un-p="l-[6px] r-[6px] t-[6px]"
  un-box="border"
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
      
      un-grid="~ cols-[repeat(4,minmax(min-content,max-content)210px)]"
      un-justify-items-end
      un-items-center
      un-gap="y-[6px]"
      
      @keyup.enter="searchClk"
    >
      
      <template v-if="builtInSearch?.type == null">
        <label
          m="r-[3px] l-[6px]"
          text-gray
          whitespace-nowrap
          overflow-hidden
          class="after:content-[:]"
        >
          类型
        </label>
        <el-form-item prop="type">
          <el-select
            :set="search.type = search.type || [ ]"
            
            un-w="full"
            
            :model-value="search.type"
            placeholder="请选择类型"
            filterable
            default-first-option
            clearable
            multiple
            @keyup.enter.stop
            @update:model-value="search.type = $event"
            @change="searchClk"
          >
            <el-option
              :value="'pc'"
              label="电脑端"
            ></el-option>
            <el-option
              :value="'mobile'"
              label="手机端"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.menu_id == null">
        <label
          un-m="r-[3px] l-[6px]"
          un-text-gray
          un-whitespace-nowrap
          un-overflow-hidden
          class="after:content-[:]"
        >
          父菜单
        </label>
        <el-form-item prop="menu_id">
          <el-select-v2
            :set="search.menu_id = search.menu_id || [ ]"
            
            un-w="full"
            
            :height="300"
            :model-value="search.menu_id"
            placeholder="请选择父菜单"
            :options="menus.map((item) => ({ value: item.id, label: item.lbl }))"
            filterable
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
            :loading="!inited"
            @keyup.enter.stop
            @update:model-value="search.menu_id = $event"
            @change="searchClk"
          ></el-select-v2>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.lblLike == null && builtInSearch?.lbl == null">
        <label
          un-m="r-[3px] l-[6px]"
          un-text-gray
          un-whitespace-nowrap
          un-overflow-hidden
          class="after:content-[:]"
        >
          名称
        </label>
        <el-form-item prop="lblLike">
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
        <div
          un-min="w-[20px]"
        ></div>
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
      
      <div
        min="w-[20px]"
      ></div>
      <el-form-item prop="idsChecked">
        <el-checkbox
          v-model="idsChecked"
          :false-label="0"
          :true-label="1"
          :disabled="selectedIds.length === 0"
          @change="idsCheckedChg"
        >
          <span>已选择</span>
          <span>(</span>
          <span
            un-m="x-1"
            un-text="green"
            :style="{ color: selectedIds.length === 0 ? 'var(--el-disabled-text-color)': undefined }"
          >
            {{ selectedIds.length }}
          </span>
          <span>)</span>
        </el-checkbox>
        <el-icon
          v-show="selectedIds.length > 0"
          title="清空已选择"
          
          un-cursor="pointer"
          un-m="x-3"
          un-text="hover:[red]"
          
          @click="clearSelect"
        >
          <CircleClose />
        </el-icon>
      </el-form-item>
      
      <div
        un-min="w-[20px]"
      ></div>
      <el-form-item
        un-self-start
        un-flex="~ nowrap"
        un-min="w-[170px]"
      >
        
        <el-button
          plain
          type="primary"
          @click="searchClk"
        >
          <template #icon>
            <Search />
          </template>
          <span>查询</span>
        </el-button>
        
        <el-button
          plain
          @click="searchReset"
        >
          <template #icon>
            <Delete />
          </template>
          <span>重置</span>
        </el-button>
        
      </el-form-item>
      
    </el-form>
  </div>
  <div
    un-m="x-1.5 t-1.5"
    un-flex
  >
    <template v-if="search.is_deleted !== 1">
      
      <el-button
        plain
        type="primary"
        @click="openAdd"
      >
        <template #icon>
          <CirclePlus />
        </template>
        <span>新增</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="openCopy"
      >
        <template #icon>
          <CopyDocument />
        </template>
        <span>复制</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="openEdit"
      >
        <template #icon>
          <Edit />
        </template>
        <span>编辑</span>
      </el-button>
      
      <el-button
        plain
        type="danger"
        @click="deleteByIdsEfc"
      >
        <template #icon>
          <CircleClose />
        </template>
        <span>删除</span>
      </el-button>
      
      <el-button
        plain
        @click="exportClk"
      >
        <template #icon>
          <Download />
        </template>
        <span>导出</span>
      </el-button>
      
      <el-button
        plain
        @click="openUploadClk"
      >
        <template #icon>
          <Upload />
        </template>
        <span>导入</span>
      </el-button>
      
    </template>
    <template v-else>
      <el-button
        plain
        type="primary"
        @click="revertByIdsEfc"
      >
        <template #icon>
          <CircleCheck />
        </template>
        <span>还原</span>
      </el-button>
      
      <el-button
        plain
        type="danger"
        @click="forceDeleteByIdsClk"
      >
        <template #icon>
          <CircleClose />
        </template>
        <span>彻底删除</span>
      </el-button>
      
      <el-button
        plain
        @click="exportClk"
      >
        <template #icon>
          <Download />
        </template>
        <span>导出</span>
      </el-button>
    </template>
    
    <el-button
      plain
      @click="searchClk"
    >
      <template #icon>
        <Refresh />
      </template>
      <span>刷新</span>
    </el-button>
    
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
      flex="~ [1_0_0] col"
      overflow-hidden
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
          
          <!-- 类型 -->
          <template v-if="'_type' === col.prop">
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
          <template v-else-if="'_is_enabled' === col.prop">
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
      un-justify="end"
      un-p="[2px_5px_2px_0px]"
      un-flex
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
  Lock,
  Unlock,
  Download,
  Upload,
  CirclePlus,
  CopyDocument,
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
  findCount,
  revertByIds,
  deleteByIds,
  forceDeleteByIds,
  exportExcel,
  updateById,
  importFile,
} from "./Api";

import {
  type MenuModel,
  type MenuSearch,
} from "#/types";

import {
  findAllMenu,
} from "./Api";

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
    menu_id: [ ],
  } as MenuSearch;
}

let search = $ref(initSearch());

/** 搜索 */
async function searchClk() {
  resetSelectedIds();
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
  resetSelectedIds();
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
async function clearSelect() {
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

let tableColumns = $ref<ColumnType[]>([
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
    align: "center",
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
} = $(useTableColumns<MenuModel>(
  $$(tableColumns),
  {
    persistKey: new URL(import.meta.url).pathname,
  },
));

let detailRef = $ref<InstanceType<typeof Detail> | undefined>();

let menus = $ref<MenuModel[]>([ ]);

/** 获取下拉框列表 */
async function useSelectList() {
  [
    menus,
  ] = await Promise.all([
    findAllMenu(
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
  if (!dialogResult || dialogResult.type === "cancel") {
    return;
  }
  const changedIds = dialogResult?.changedIds;
  if (changedIds && changedIds.length > 0) {
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
  const dialogResult = await detailRef.showDialog({
    title: "复制",
    action: "copy",
    builtInModel,
    model: {
      id: selectedIds[selectedIds.length - 1],
    },
  });
  if (!dialogResult || dialogResult.type === "cancel") {
    return;
  }
  const changedIds = dialogResult?.changedIds;
  if (changedIds && changedIds.length > 0) {
    selectedIds = [ ...changedIds ];
    await Promise.all([
      dataGrid(true),
    ]);
    emit("add", changedIds);
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
  if (!dialogResult || dialogResult.type === "cancel") {
    return;
  }
  const changedIds = dialogResult?.changedIds;
  if (changedIds && changedIds.length > 0) {
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
  if (usrStore.authorization) {
    await Promise.all([
      searchClk(),
      useSelectList(),
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
