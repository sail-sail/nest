<template>
<div
  flex="~ [1_0_0] col"
  overflow-hidden
  w="full"
  h="full"
  p="l-[6px] r-[6px] t-[6px]"
  box="border"
>
  <div
    m="x-1.5"
    overflow-auto
  >
    <el-form
      ref="searchFormRef"
      size="default"
      :model="search"
      inline-message
      
      grid="~ cols-[repeat(4,minmax(min-content,max-content)210px)]"
      justify-items-end
      items-center
      gap="y-[6px]"
      
      @keyup.enter="searchClk"
    >
      
      <template v-if="builtInSearch?.lblLike == null && builtInSearch?.lbl == null">
        <label
          m="r-[3px] l-[6px]"
          text-gray
          whitespace-nowrap
          overflow-hidden
          class="after:content-[:]"
        >
          名称
        </label>
        <el-form-item prop="lblLike">
          <el-input
            v-model="search.lblLike"
            
            w="full"
            
            placeholder="请输入名称"
            clearable
            @clear="searchIptClr"
          ></el-input>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.usernameLike == null && builtInSearch?.username == null">
        <label
          m="r-[3px] l-[6px]"
          text-gray
          whitespace-nowrap
          overflow-hidden
          class="after:content-[:]"
        >
          用户名
        </label>
        <el-form-item prop="usernameLike">
          <el-input
            v-model="search.usernameLike"
            
            w="full"
            
            placeholder="请输入用户名"
            clearable
            @clear="searchIptClr"
          ></el-input>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.dept_ids == null">
        <label
          m="r-[3px] l-[6px]"
          text-gray
          whitespace-nowrap
          overflow-hidden
          class="after:content-[:]"
        >
          拥有部门
        </label>
        <el-form-item prop="dept_ids">
          <el-select-v2
            :set="search.dept_ids = search.dept_ids || [ ]"
            
            w="full"
            
            :height="300"
            :model-value="search.dept_ids"
            placeholder="请选择拥有部门"
            :options="depts.map((item) => ({ value: item.id, label: item.lbl }))"
            filterable
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
            :loading="!inited"
            @keyup.enter.stop
            @update:model-value="search.dept_ids = $event"
            @change="searchClk"
          ></el-select-v2>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.role_ids == null">
        <label
          m="r-[3px] l-[6px]"
          text-gray
          whitespace-nowrap
          overflow-hidden
          class="after:content-[:]"
        >
          拥有角色
        </label>
        <el-form-item prop="role_ids">
          <el-select-v2
            :set="search.role_ids = search.role_ids || [ ]"
            
            w="full"
            
            :height="300"
            :model-value="search.role_ids"
            placeholder="请选择拥有角色"
            :options="roles.map((item) => ({ value: item.id, label: item.lbl }))"
            filterable
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
            :loading="!inited"
            @keyup.enter.stop
            @update:model-value="search.role_ids = $event"
            @change="searchClk"
          ></el-select-v2>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.is_deleted == null">
        <div
          min="w-[20px]"
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
            m="x-1"
            text="green"
            :style="{ color: selectedIds.length === 0 ? 'var(--el-disabled-text-color)': undefined }"
          >
            {{ selectedIds.length }}
          </span>
          <span>)</span>
        </el-checkbox>
        <el-icon
          v-show="selectedIds.length > 0"
          title="清空已选择"
          cursor="pointer"
          
          m="x-3"
          text="hover:[red]"
          
          @click="clearSelect"
        >
          <CircleClose />
        </el-icon>
      </el-form-item>
      
      <div
        min="w-[20px]"
      ></div>
      <el-form-item
        self-start
        flex="~ nowrap"
        min="w-[170px]"
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
    m="x-1.5 t-1.5"
    flex
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
        @click="lockByIdsClk(1)"
      >
        <template #icon>
          <Lock />
        </template>
        <span>锁定</span>
      </el-button>
      
      <el-button
        plain
        @click="lockByIdsClk(0)"
      >
        <template #icon>
          <Unlock />
        </template>
        <span>解锁</span>
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
      flex="[1_0_0]"
      overflow-hidden
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
    flex="~ [1_0_0] col"
    overflow-hidden
    m="t-1.5"
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
          
          <!-- 名称 -->
          <template v-if="'lbl' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 用户名 -->
          <template v-else-if="'username' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 默认部门 -->
          <template v-else-if="'_default_dept_id' === col.prop">
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
          
          <!-- 备注 -->
          <template v-else-if="'rem' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 拥有部门 -->
          <template v-else-if="'_dept_ids' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row, column }">
                <LinkList
                  v-model="row[column.property]"
                ></LinkList>
              </template>
            </el-table-column>
          </template>
          
          <!-- 锁定 -->
          <template v-else-if="'_is_locked' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 拥有角色 -->
          <template v-else-if="'_role_ids' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row, column }">
                <LinkList
                  v-model="row[column.property]"
                ></LinkList>
              </template>
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
      justify="end"
      p="[2px_5px_2px_0px]"
      flex
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
  lockByIds,
  exportExcel,
  updateById,
  importFile,
} from "./Api";

import {
  type UsrModel,
  type UsrSearch,
  type DeptModel,
  type RoleModel,
} from "#/types";

import {
  findAllDept,
  findAllRole,
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
    dept_ids: [ ],
    role_ids: [ ],
  } as UsrSearch;
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
  lbl?: string; //名称
  lblLike?: string; //名称
  username?: string; //用户名
  usernameLike?: string; //用户名
  password?: string; //密码
  passwordLike?: string; //密码
  default_dept_id?: string|string[]; //默认部门
  _default_dept_id?: string|string[]; //默认部门
  is_enabled?: string|string[]; //启用
  rem?: string; //备注
  remLike?: string; //备注
  dept_ids?: string|string[]; //拥有部门
  _dept_ids?: string|string[]; //拥有部门
  is_locked?: string|string[]; //锁定
  role_ids?: string|string[]; //拥有角色
  _role_ids?: string|string[]; //拥有角色
}>();

const builtInSearchType: { [key: string]: string } = {
  is_deleted: "0|1",
  ids: "string[]",
  default_dept_id: "string[]",
  _default_dept_id: "string[]",
  is_enabled: "number[]",
  _is_enabled: "string[]",
  dept_ids: "string[]",
  _dept_ids: "string[]",
  is_locked: "number[]",
  _is_locked: "string[]",
  role_ids: "string[]",
  _role_ids: "string[]",
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
  return Object.fromEntries(entries) as unknown as UsrSearch;
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
  return Object.fromEntries(entries) as unknown as UsrModel;
});

/** 分页功能 */
let {
  page,
  pageSizes,
  pgSizeChg,
  pgCurrentChg,
} = $(usePage<UsrModel>(dataGrid));

/** 表格选择功能 */
let {
  selectedIds,
  selectChg,
  rowClassName,
  rowClk,
  rowClkCtrl,
  rowClkShift,
} = $(useSelect<UsrModel>($$(tableRef)));

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
let tableData = $ref<UsrModel[]>([ ]);

let tableColumns = $ref<ColumnType[]>([
  {
    label: "名称",
    prop: "lbl",
    width: 140,
    sortable: "custom",
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "用户名",
    prop: "username",
    width: 140,
    sortable: "custom",
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "默认部门",
    prop: "_default_dept_id",
    width: 140,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "启用",
    prop: "_is_enabled",
    width: 80,
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
    label: "拥有部门",
    prop: "_dept_ids",
    width: 140,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "锁定",
    prop: "_is_locked",
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "拥有角色",
    prop: "_role_ids",
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
} = $(useTableColumns<UsrModel>(
  $$(tableColumns),
  {
    persistKey: new URL(import.meta.url).pathname,
  },
));

let detailRef = $ref<InstanceType<typeof Detail> | undefined>();

let depts = $ref<DeptModel[]>([ ]);

let roles = $ref<RoleModel[]>([ ]);

/** 获取下拉框列表 */
async function useSelectList() {
  [
    depts,
    roles,
  ] = await Promise.all([
    findAllDept(
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
    findAllRole(
      undefined,
      {
      },
      [
        {
          prop: "",
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
  prop: "",
  order: "ascending",
});

/** 排序 */
async function sortChange(
  { prop, order, column }: { column: TableColumnCtx<UsrModel> } & Sort,
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
    title: "导入用户",
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
