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
      un-grid="~ cols-[repeat(auto-fit,minmax(50px,min-content)_220px)]"
      un-justify-items-end
      un-items-center
      un-gap="x-1 y-2"
      @keyup.enter="searchClk"
    >
      
      <template v-if="builtInSearch?.lblLike == null && builtInSearch?.lbl == null">
        <label
          un-m="l-1"
          un-text="[var(--el-text-color-regular)]"
          un-whitespace-nowrap
          un-overflow-hidden
          un-after="content-[quoted::]"
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
      
      <template v-if="builtInSearch?.state == null">
        <label
          un-m="l-1"
          un-text="[var(--el-text-color-regular)]"
          un-whitespace-nowrap
          un-overflow-hidden
          un-after="content-[quoted::]"
        >
          状态
        </label>
        <el-form-item prop="state">
          <el-select
            :set="search.state = search.state || [ ]"
            un-w="full"
            :model-value="search.state"
            placeholder="请选择状态"
            filterable
            default-first-option
            clearable
            multiple
            @keyup.enter.stop
            @update:model-value="search.state = $event"
            @change="searchClk"
          >
            <el-option
              :value="'running'"
              label="运行中"
            ></el-option>
            <el-option
              :value="'success'"
              label="成功"
            ></el-option>
            <el-option
              :value="'fail'"
              label="失败"
            ></el-option>
            <el-option
              :value="'cancel'"
              label="取消"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.type == null">
        <label
          un-m="l-1"
          un-text="[var(--el-text-color-regular)]"
          un-whitespace-nowrap
          un-overflow-hidden
          un-after="content-[quoted::]"
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
              :value="'text'"
              label="文本"
            ></el-option>
            <el-option
              :value="'download'"
              label="下载"
            ></el-option>
            <el-option
              :value="'inline'"
              label="查看"
            ></el-option>
            <el-option
              :value="'tag'"
              label="标签"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.begin_time == null">
        <label
          un-m="l-1"
          un-text="[var(--el-text-color-regular)]"
          un-whitespace-nowrap
          un-overflow-hidden
          un-after="content-[quoted::]"
        >
          开始时间
        </label>
        <el-form-item prop="begin_time">
          <el-date-picker
            :set="search.begin_time = search.begin_time || [ ]"
            type="daterange"
            un-w="full"
            :model-value="(search.begin_time as any)"
            start-placeholder="开始"
            end-placeholder="结束"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[ new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59) ]"
            clearable
            @update:model-value="search.begin_time = $event"
            @clear="searchIptClr"
          ></el-date-picker>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.is_deleted == null">
        <div
          un-min="w-5"
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
        min="w-5"
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
          un-cursor-pointer
          un-m="x-3"
          un-text="hover:[red]"
          @click="clearSelect"
        >
          <ElIconCircleClose />
        </el-icon>
      </el-form-item>
      
      <div
        un-min="w-5"
      ></div>
      <el-form-item
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
    un-flex
  >
    <template v-if="search.is_deleted !== 1">
      
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
    </template>
    
    <el-button
      plain
      @click="searchClk"
    >
      <template #icon>
        <ElIconRefresh />
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
          
          <!-- 状态 -->
          <template v-else-if="'_state' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 类型 -->
          <template v-else-if="'_type' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 执行结果 -->
          <template v-else-if="'result' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 错误信息 -->
          <template v-else-if="'err_msg' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 开始时间 -->
          <template v-else-if="'begin_time' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template>
          
          <!-- 结束时间 -->
          <template v-else-if="'end_time' === col.prop">
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
} from "./Api";

import {
  type Background_TaskModel,
  type Background_TaskSearch,
} from "#/types";

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
  } as Background_TaskSearch;
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
  state?: string|string[]; //状态
  type?: string|string[]; //类型
  result?: string; //执行结果
  resultLike?: string; //执行结果
  err_msg?: string; //错误信息
  err_msgLike?: string; //错误信息
  begin_time?: string; //开始时间
  end_time?: string; //结束时间
  rem?: string; //备注
  remLike?: string; //备注
}>();

const builtInSearchType: { [key: string]: string } = {
  is_deleted: "0|1",
  ids: "string[]",
  state: "string[]",
  _state: "string[]",
  type: "string[]",
  _type: "string[]",
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
  return Object.fromEntries(entries) as unknown as Background_TaskSearch;
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
  return Object.fromEntries(entries) as unknown as Background_TaskModel;
});

/** 分页功能 */
let {
  page,
  pageSizes,
  pgSizeChg,
  pgCurrentChg,
} = $(usePage<Background_TaskModel>(dataGrid));

/** 表格选择功能 */
let {
  selectedIds,
  selectChg,
  rowClassName,
  rowClk,
  rowClkCtrl,
  rowClkShift,
} = $(useSelect<Background_TaskModel>($$(tableRef)));

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
let tableData = $ref<Background_TaskModel[]>([ ]);

let tableColumns = $ref<ColumnType[]>([
  {
    label: "名称",
    prop: "lbl",
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "状态",
    prop: "_state",
    minWidth: 55,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "类型",
    prop: "_type",
    minWidth: 55,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "执行结果",
    prop: "result",
    minWidth: 140,
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "错误信息",
    prop: "err_msg",
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "开始时间",
    prop: "begin_time",
    minWidth: 110,
    sortable: "custom",
    align: "center",
    headerAlign: "center",
    showOverflowTooltip: true,
  },
  {
    label: "结束时间",
    prop: "end_time",
    minWidth: 110,
    sortable: "custom",
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
]);

/** 表格列 */
let {
  headerDragend,
  resetColumns,
  storeColumns,
} = $(useTableColumns<Background_TaskModel>(
  $$(tableColumns),
  {
    persistKey: new URL(import.meta.url).pathname,
  },
));

let detailRef = $ref<InstanceType<typeof Detail> | undefined>();

/** 获取下拉框列表 */
async function useSelectList() {
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
  prop: "begin_time",
  order: "descending",
});

/** 排序 */
async function sortChange(
  { prop, order, column }: { column: TableColumnCtx<Background_TaskModel> } & Sort,
) {
  sort.prop = prop;
  sort.order = order;
  await dataGrid();
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
