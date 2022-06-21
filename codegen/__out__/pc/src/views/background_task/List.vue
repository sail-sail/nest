<template>
<div class="flex-1 flex-shrink-0 overflow-hidden flex flex-col w-full h-full">
  <div class="search_div">
    <el-form
      size="default"
      :model="search"
      ref="searchFormRef"
      inline-message
      class="search_form"
      @keyup.enter.native="searchClk"
    >
      
      <template v-if="builtInSearch?.lblLike == null && builtInSearch?.lbl == null">
        <label class="form_label">
          名称
        </label>
        <el-form-item prop="lblLike">
          <el-input
            class="form_input"
            v-model="search.lblLike"
            placeholder="请输入名称"
            clearable
            @clear="searchIptClr"
          ></el-input>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.state == null">
        <label class="form_label">
          状态
        </label>
        <el-form-item prop="state">
          <el-select
            class="form_input"
            @keyup.enter.native.stop
            v-model="search.state"
            placeholder="请选择状态"
            filterable
            default-first-option
            clearable
            multiple
            @clear="searchIptClr"
          >
            <el-option :value="'running'" label="运行中"></el-option>
            <el-option :value="'success'" label="成功"></el-option>
            <el-option :value="'fail'" label="失败"></el-option>
            <el-option :value="'cancel'" label="取消"></el-option>
          </el-select>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.type == null">
        <label class="form_label">
          类型
        </label>
        <el-form-item prop="type">
          <el-select
            class="form_input"
            @keyup.enter.native.stop
            v-model="search.type"
            placeholder="请选择类型"
            filterable
            default-first-option
            clearable
            multiple
            @clear="searchIptClr"
          >
            <el-option :value="'text'" label="文本"></el-option>
            <el-option :value="'download'" label="下载"></el-option>
            <el-option :value="'inline'" label="查看"></el-option>
            <el-option :value="'tag'" label="标签"></el-option>
          </el-select>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.begin_time == null">
        <label class="form_label">
          开始时间
        </label>
        <el-form-item prop="begin_time">
          <el-date-picker
            type="daterange"
            class="form_input"
            :set="search.begin_time = search.begin_time || [ ]"
            v-model="search.begin_time"
            start-placeholder="开始"
            end-placeholder="结束"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[ new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59) ]"
            clearable
            @clear="searchIptClr"
          ></el-date-picker>
        </el-form-item>
      </template>
      
      <template v-if="builtInSearch?.is_deleted == null">
        <div style="min-width: 20px;"></div>
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
      
      <div style="min-width: 20px;"></div>
      <el-form-item prop="idsChecked">
        <el-checkbox
          v-model="idsChecked"
          :false-label="0"
          :true-label="1"
          @change="searchClk"
          :disabled="selectedIds.length === 0"
        >
          <span>已选择</span>
          <span>(</span>
          <span
            class="mx-1 text-[green]"
            :style="{ color: selectedIds.length === 0 ? 'var(--el-disabled-text-color)': undefined }"
          >
            {{ selectedIds.length }}
          </span>
          <span>)</span>
        </el-checkbox>
        <el-icon
          title="清空已选择"
          v-show="selectedIds.length > 0"
          @click="clearSelect"
          class="cursor-pointer mx-3 hover:text-[red]"
        >
          <CircleClose />
        </el-icon>
      </el-form-item>
      
      <div style="min-width: 20px;"></div>
      <el-form-item
        class="form_btn_item"
      >
        <el-button
          type="primary"
          :icon="Search"
          @click="searchClk"
        >
          查询
        </el-button>
        <el-button
          plain
          :icon="Delete"
          @click="searchReset"
        >
          重置
        </el-button>
      </el-form-item>
      
    </el-form>
  </div>
  <div class="toolbar_div">
    <template v-if="search.is_deleted !== 1">
      <el-button
        type="danger"
        plain
        :icon="CircleClose"
        @click="deleteByIdsEfc"
      >
        删除
      </el-button>
    </template>
    <template v-else>
      <el-button
        type="primary"
        :icon="CircleCheck"
        @click="revertByIdsEfc"
      >
        还原
      </el-button>
    </template>
    <el-button
      :icon="Refresh"
      @click="searchClk"
    >
      刷新
    </el-button>
    <div class="flex-[1_0_0]">
    </div>
    <TableShowColumns
      :tableColumns="tableColumns"
      @resetColumns="resetColumns"
      @storeColumns="storeColumns"
    >
      列操作
    </TableShowColumns>
  </div>
  <div class="table_div">
    <div class="table_wrap">
      <el-table
        :data="tableData"
        @select="selectChg"
        @select-all="selectChg"
        @row-click="rowClk"
        :row-class-name="rowClassName"
        border
        size="small"
        height="100%"
        row-key="id"
        ref="tableRef"
        :empty-text="inited ? undefined : '加载中...'"
        @sort-change="sortChange"
        :default-sort="sort"
        @click.ctrl="rowClkCtrl"
        @click.shift="rowClkShift"
        @header-dragend="headerDragend"
        v-header-order-drag="() => ({ tableColumns, storeColumns, offset: 1 })"
      >
        
        <el-table-column
          prop="id"
          type="selection"
          align="center"
          width="50"
        ></el-table-column>
        
        <template v-for="(col, i) in tableColumns" :key="i + col">
          
          <!-- 名称 -->
          <template v-if="'lbl' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              min-width="120"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 状态 -->
          <template v-if="'_state' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              min-width="55"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 类型 -->
          <template v-if="'_type' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              min-width="55"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 执行结果 -->
          <template v-if="'result' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              min-width="140"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 错误信息 -->
          <template v-if="'err_msg' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 开始时间 -->
          <template v-if="'begin_time' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              min-width="110"
              sortable="custom"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 结束时间 -->
          <template v-if="'end_time' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              min-width="110"
              sortable="custom"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          
          <!-- 备注 -->
          <template v-if="'rem' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
        </template>
        
      </el-table>
    </div>
    <div class="pagination_row">
      <el-pagination
        background
        :page-sizes="pageSizes"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pgSizeChg"
        @current-change="pgCurrentChg"
        :current-page="page.current"
        :total="page.total"
      ></el-pagination>
    </div>
  </div>
  <Detail
    ref="detailRef"
  ></Detail>
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
  Download,
  Upload,
  CirclePlus,
  CircleClose,
  CircleCheck,
} from "@element-plus/icons-vue";
import TableShowColumns from "@/components/TableShowColumns.vue";
import { downloadById } from "@/utils/axios";
import LinkList from "@/components/LinkList.vue";
import { SELECT_V2_SIZE } from "../common/App";
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
  findAllAndCount,
  deleteByIds,
  revertByIds,
} from "./Api";

import {
  Background_taskModel,
  Background_taskSearch,
} from "./Model";

const usrStore = useUsrStore();

let inited = $ref(false);

const emit = defineEmits([ "selectedIdsChg" ]);

// 表格
let tableRef = $ref<InstanceType<typeof ElTable>>();

// 搜索
function initSearch() {
  return <Background_taskSearch>{
    is_deleted: 0,
  };
}

let search = $ref(initSearch());

// 搜索
async function searchClk() {
  await dataGrid(true);
}

// 重置搜索
async function searchReset() {
  search = initSearch();
  idsChecked = 0;
  await searchClk();
}

// 清空搜索框事件
async function searchIptClr() {
  await searchClk();
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

// 内置搜索条件
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
  return <Background_taskSearch> Object.fromEntries(entries);
});

// 内置变量
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
          item[1] = <any> Number(item[1][0]);
        }
      } else {
        if (!isNaN(Number(item[1]))) {
          item[1] = <any> Number(item[1]);
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
  return <Background_taskModel> Object.fromEntries(entries);
});

// 分页功能
let {
  page,
  pageSizes,
  pgSizeChg,
  pgCurrentChg,
} = $(usePage<Background_taskModel>(dataGrid));

// 表格选择功能
let {
  selectedIds,
  selectChg,
  rowClassName,
  rowClk,
  rowClkCtrl,
  rowClkShift,
} = $(useSelect<Background_taskModel>(<any>$$(tableRef)));

watch(
  () => selectedIds,
  () => {
    emit("selectedIdsChg", selectedIds);
  },
);

// 取消已选择筛选
async function clearSelect() {
  selectedIds = [ ];
  idsChecked = 0;
  await dataGrid(true);
}

// 若传进来的参数或者url有selectedIds，则使用传进来的选中行
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

// 表格数据
let tableData: Background_taskModel[] = $ref([ ]);

let tableColumns = $ref<ColumnType[]>([
  {
    label: "名称",
    prop: "lbl",
  },
  {
    label: "状态",
    prop: "_state",
  },
  {
    label: "类型",
    prop: "_type",
  },
  {
    label: "执行结果",
    prop: "result",
  },
  {
    label: "错误信息",
    prop: "err_msg",
  },
  {
    label: "开始时间",
    prop: "begin_time",
  },
  {
    label: "结束时间",
    prop: "end_time",
  },
  {
    label: "备注",
    prop: "rem",
  },
]);

// 表格列
let {
  headerDragend,
  resetColumns,
  storeColumns,
} = $(useTableColumns<Background_taskModel>(
  $$(tableColumns),
  {
    persistKey: "0",
  },
));

let detailRef = $ref<InstanceType<typeof Detail>>();

// 获取下拉框列表
async function getSelectListEfc() {
}

// 刷新表格
async function dataGrid(isCount = false) {
  const pgSize = page.size;
  const pgOffset = (page.current - 1) * page.size;
  let data: Background_taskModel[];
  let count: number|undefined = 0;
  let search2 = {
    ...search,
    ...builtInSearch,
    idsChecked: undefined,
  };
  if (idsChecked) {
    search2.ids = selectedIds;
  }
  if (search2.ids && search2.ids.length === 0) {
    search2.ids = undefined;
  }
  if (isCount) {
    const rvData = await findAllAndCount(search2, { pgSize, pgOffset }, [ sort ]);
    data = rvData.data;
    count = rvData.count || 0;
  } else {
    data = await findAll(search2, { pgSize, pgOffset }, [ sort ]);
    count = undefined;
  }
  tableData = data || [ ];
  if (count != null) {
    page.total = count;
  }
}

// 排序
let sort: Sort = $ref({
  prop: "begin_time",
  order: "descending",
});

// 排序
async function sortChange(
  { prop, order, column }: { column: TableColumnCtx<Background_taskModel> } & Sort,
) {
  sort.prop = prop;
  sort.order = order;
  await dataGrid();
}

// 点击删除
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
  }
}

// 点击还原
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
  }
}

async function initFrame() {
  if (usrStore.authorization) {
    await Promise.all([
      searchClk(),
      getSelectListEfc(),
    ]);
  }
  inited = true;
}

watch(
  () => usrStore.authorization,
  initFrame,
);

watch(
  () => builtInSearch,
  async (newVal, oldVal) => {
    if (!deepCompare(oldVal, newVal)) {
      await initFrame();
    }
  },
  {
    immediate: true,
  },
);
</script>

<style lang="scss" scoped>
.search_div {
  margin-top: 6px;
  margin-left: 6px;
  overflow-x: auto;
}
.search_form {
  display: grid;
  grid-template-columns: repeat(
    4,
    minmax(min-content, max-content)
    210px
  );
  justify-items: end;
  align-items: center;
  grid-row-gap: 6px;
}
.form_label {
  margin-right: 3px;
  color: gray;
  margin-left: 6px;
  white-space: nowrap;
  overflow: hidden;
}
.form_label::after {
  content: ":";
}
.form_input {
  width: 100%;
}
.form_btn_item {
  display: flex;
  flex-wrap: nowrap;
  justify-self: flex-start;
  min-width: 170px;
}
.toolbar_div {
  margin-left: 6px;
  margin-top: 6px;
  margin-right: 6px;
  display: flex;
}
.table_div {
  flex: 1 0 0;
  overflow: hidden;
  margin-top: 6px;
  display: flex;
  flex-direction: column;
}
.table_wrap {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.pagination_row {
  padding: 2px 5px 2px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
