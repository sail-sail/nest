<template>
<div class="wrap_div">
  <div class="search_div">
    <el-form
      size="default"
      :model="search"
      ref="searchFormRef"
      inline-message
      class="search_form"
      @keyup.enter.native="searchClk"
    >
      
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
      :icon="Download"
      @click="exportClk"
    >
      导出
    </el-button>
    <el-button
      :icon="Refresh"
      @click="searchClk"
    >
      刷新
    </el-button>
    <div class="split_toolbar">
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
        :default-sort="defaultSort"
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
import * as fileSaver from "file-saver";
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
} from "element-plus";
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
  CirclePlus,
  CircleClose,
  CircleCheck,
} from "@element-plus/icons-vue";
import TableShowColumns from "@/components/TableShowColumns.vue";
import { getDownloadUrl } from "@/utils/axios";
import LinkList from "@/components/LinkList.vue";
import { SELECT_V2_SIZE } from "../common/App";
import {
  usePage,
  useSearch,
  useSelect,
  useTableColumns,
  ColumnType,
} from "@/compositions/List";
import Detail from "./Detail.vue";
import {
  findAll,
  findAllAndCount,
  deleteByIds,
  revertByIds,
  exportExcel,
  updateById,
} from "./Api";

import {
  Background_taskModel,
  Background_taskSearch,
} from "./Model";

const usrStore = useUsrStore();

let inited = $ref(false);

// 表格
let tableRef = $ref<InstanceType<typeof ElTable>>();

// 导出Excel
async function exportClk() {
  const id = await exportExcel(search);
  if (id) {
    const url = getDownloadUrl(
      {
        id,
      },
    );
    fileSaver.saveAs(url);
  }
}

// 搜索功能
let {
  search,
  searchFormRef,
  searchClk,
  searchReset,
  searchIptClr,
} = $(useSearch<Background_taskSearch>(
  dataGrid,
));

// 分页功能
let {
  page,
  pageSizes,
  pgSizeChg,
  pgCurrentChg,
} = $(usePage<Background_taskModel>(dataGrid));

// 表格选择功能
let {
  selectList,
  selectChg,
  rowClassName,
  rowClk,
  rowClkCtrl,
  rowClkShift,
} = $(useSelect<Background_taskModel>(<any>$$(tableRef)));

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
  const search2 = {
    ...search,
  };
  if (!search2.orderBy && defaultSort && defaultSort.prop) {
    search2.orderBy = defaultSort.prop;
    search2.orderDec = defaultSort.order;
  }
  let data: Background_taskModel[];
  let count = 0;
  if (isCount) {
    const rvData = await findAllAndCount(search2, { pgSize, pgOffset });
    data = rvData.data;
    count = rvData.count || 0;
  } else {
    data = await findAll(search2, { pgSize, pgOffset });
    count = undefined;
  }
  tableData = data || [ ];
  if (count != null) {
    page.total = count;
  }
  selectList = [ ];
  if (tableRef) {
    tableRef.clearSelection();
  }
}

// 默认排序
let defaultSort = $ref<Sort>({
  prop: "begin_time",
  order: "descending",
});

// 排序
async function sortChange(
  { prop, order, column }: { column: TableColumnCtx<Background_taskModel> } & Sort,
) {
  search.orderBy = prop;
  search.orderDec = order;
  await dataGrid();
}

// 点击删除
async function deleteByIdsEfc() {
  if (selectList.length === 0) {
    ElMessage.warning(`请选择需要删除的数据!`);
    return;
  }
  try {
    await ElMessageBox.confirm(`确定删除已选择的 ${ selectList.length } 条数据?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const ids = selectList.map((item) => item.id);
  const num = await deleteByIds(ids);
  if (num) {
    await Promise.all([
      dataGrid(true),
    ]);
    ElMessage.success(`删除 ${ num } 条数据成功!`);
  }
}

// 点击还原
async function revertByIdsEfc() {
  if (selectList.length === 0) {
    ElMessage.warning(`请选择需要还原的数据!`);
    return;
  }
  try {
    await ElMessageBox.confirm(`确定还原已选择的 ${ selectList.length } 条数据?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  const ids = selectList.map((item) => item.id);
  const num = await revertByIds(ids);
  if (num) {
    await Promise.all([
      dataGrid(true),
    ]);
    ElMessage.success(`还原 ${ num } 条数据成功!`);
  }
}

async function initFrame() {
  if (usrStore.access_token) {
    await Promise.all([
      searchClk(),
      getSelectListEfc(),
    ]);
  }
  inited = true;
}

watch(
  () => usrStore.access_token,
  initFrame,
  {
    immediate: true,
  },
);
</script>

<style lang="scss" scoped>
.wrap_div {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
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
.split_toolbar {
  flex: 1 0 0;
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
