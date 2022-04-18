<#
const hasSummary = columns.some((column) => column.showSummary);
#><template>
<div class="wrap_div">
  <div class="search_div">
    <el-form
      size="default"
      :model="search"
      ref="searchFormRef"
      inline-message
      class="search_form"
      @keyup.enter.native="searchClk"
    ><#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        const column_name = column.COLUMN_NAME;
        if (column_name === "id") continue;
        const data_type = column.DATA_TYPE;
        const column_type = column.COLUMN_TYPE;
        let column_comment = column.COLUMN_COMMENT || "";
        let selectList = [ ];
        let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
        if (selectStr) {
          selectList = eval(`(${ selectStr })`);
        }
        if (column_comment.indexOf("[") !== -1) {
          column_comment = column_comment.substring(0, column_comment.indexOf("["));
        }
        const require = column.require;
        const search = column.search;
        const foreignKey = column.foreignKey;
        const foreignTable = foreignKey && foreignKey.table;
        const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      #><#
        if (search) {
      #>
      <#
      if (column.isImg) {
      #><#
      } else if (foreignKey) {
      #>
      <label class="form_label">
        <#=column_comment#>
      </label>
      <el-form-item prop="<#=column_name#>">
        <el-select-v2
          :height="300"
          class="form_input"
          @keyup.enter.native.stop
          :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
          v-model="search.<#=column_name#>"
          placeholder="请选择<#=column_comment#>"
          :options="<#=foreignTable#>4SelectV2"
          filterable
          clearable
          multiple
          collapse-tags
          collapse-tags-tooltip
          :loading="!inited"
          :remote="<#=foreignTable#>Info.count > SELECT_V2_SIZE"
          :remote-method="<#=foreignTable#>FilterEfc"
          @clear="searchIptClr"
        ></el-select-v2>
      </el-form-item><#
      } else if (selectList.length > 0) {
      #>
      <label class="form_label">
        <#=column_comment#>
      </label>
      <el-form-item prop="<#=column_name#>">
        <el-select
          class="form_input"
          @keyup.enter.native.stop
          v-model="search.<#=column_name#>"
          placeholder="请选择<#=column_comment#>"
          filterable
          default-first-option
          clearable
          multiple
          @clear="searchIptClr"
        ><#
          for (let item of selectList) {
            let value = item.value;
            let label = item.label;
            if (typeof(value) === "string") {
              value = `'${ value }'`;
            } else if (typeof(value) === "number") {
              value = value.toString();
            }
        #>
          <el-option :value="<#=value#>" label="<#=label#>"></el-option><#
          }
        #>
        </el-select>
      </el-form-item><#
      } else if (data_type === "datetime" || data_type === "date") {
      #>
      <label class="form_label">
        <#=column_comment#>
      </label>
      <el-form-item prop="<#=column_name#>">
        <el-date-picker
          type="daterange"
          class="form_input"
          :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
          v-model="search.<#=column_name#>"
          start-placeholder="开始"
          end-placeholder="结束"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="[ new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59) ]"
          clearable
          @clear="searchIptClr"
        ></el-date-picker>
      </el-form-item><#
      } else if (column_type === "int(1)") {
      #>
      <label class="form_label">
        <#=column_comment#>
      </label>
      <el-form-item prop="<#=column_name#>">
        <el-checkbox
          class="form_input"
          v-model="search.<#=column_name#>"
          :false-label="0"
          :true-label="1"
        ><#=column_comment#></el-checkbox>
      </el-form-item><#
      } else if (column_type.startsWith("int")) {
      #>
      <label class="form_label">
        <#=column_comment#>
      </label>
      <el-form-item prop="<#=column_name#>">
        <el-input-number
          class="form_input"
          v-model="search.<#=column_name#>"
          :controls="false"
          clearable
          @clear="searchIptClr"
        ></el-input-number>
      </el-form-item><#
      } else {
      #>
      <label class="form_label">
        <#=column_comment#>
      </label>
      <el-form-item prop="<#=column_name#>Like">
        <el-input
          class="form_input"
          v-model="search.<#=column_name#>Like"
          placeholder="请输入<#=column_comment#>"
          clearable
          @clear="searchIptClr"
        ></el-input>
      </el-form-item><#
      }
      #><#
        }
      }
      #>
      <#
      if (opts.noRevert !== true) {
      #>
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
      </el-form-item><#
      }
      #>
      
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
    <template v-if="search.is_deleted !== 1"><#
      if (opts.noAdd !== true) {
      #>
      <el-button
        type="primary"
        :icon="CirclePlus"
        @click="openAdd"
      >
        新增
      </el-button><#
      }
      #><#
      if (opts.noEdit !== true) {
      #>
      <el-button
        type="primary"
        :icon="Edit"
        @click="openEdit"
      >
        编辑
      </el-button><#
      }
      #><#
      if (opts.noDelete !== true) {
      #>
      <el-button
        type="danger"
        plain
        :icon="CircleClose"
        @click="deleteByIdsEfc"
      >
        删除
      </el-button>
      <el-button
        :icon="Upload"
        @click="openUploadClk"
      >
        导入
      </el-button><#
      }
      #>
    </template>
    <template v-else><#
      if (opts.noRevert !== true) {
      #>
      <el-button
        type="primary"
        :icon="CircleCheck"
        @click="revertByIdsEfc"
      >
        还原
      </el-button><#
      }
      #>
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
        :default-sort="defaultSort"<#
        if (hasSummary) {
        #>
        show-summary
        :summary-method="summaryMethod"<#
        }
        #>
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
        
        <template v-for="(col, i) in tableColumns" :key="i + col"><#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.noList) continue;
            const column_name = column.COLUMN_NAME;
            if (column_name === "id") continue;
            const foreignKey = column.foreignKey;
            let data_type = column.DATA_TYPE;
            let column_type = column.COLUMN_TYPE;
            let column_comment = column.COLUMN_COMMENT || "";
            let selectList = [ ];
            let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
            if (selectStr) {
              selectList = eval(`(${ selectStr })`);
            }
            if (column_comment.indexOf("[") !== -1) {
              column_comment = column_comment.substring(0, column_comment.indexOf("["));
            }
            let minWith = "";
            if (column.minWith != null) {
              minWith = "\r\n              min-width=\""+column.minWith+"\"";
            }
            let width = "";
            if (column.width != null) {
              width = "\r\n              width=\""+column.width+"\"";
            }
            let sortable = "";
            if (column.sortable) {
              sortable = "\r\n              sortable=\"custom\"";
            }
            const isPassword = column.isPassword;
            if (isPassword) continue;
            let align = "";
            if (column.align) {
              align = "\r\n              align=\""+column.align+"\"";
            } else if (column_type && column_type !== "int(1)" && column_type.startsWith("int")) {
              align = "\r\n              align=\"right\"";
            } else {
              align = "\r\n              align=\"center\"";
            }
            let headerAlign = "";
            if (column.align) {
              align = "\r\n              header-align=\""+column.headerAlign+"\"";
            } else if (column_type && column_type !== "int(1)" && column_type.startsWith("int")) {
              headerAlign = "\r\n              header-align=\"center\"";
            }
          #><#
          if (column.isImg) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v-if="'<#=column_name#>' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"<#=minWith#><#=align#><#=headerAlign#>
            >
              <template #default="{ row, column }">
                <LinkImage v-model="row[column.property]"></LinkImage>
              </template>
            </el-table-column>
          </template><#
          } else if (column.isAtt) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v-if="'<#=column_name#>' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"<#=minWith#><#=align#><#=headerAlign#>
            >
              <template #default="{ row, column }">
                <LinkAtt
                  v-model="row[column.property]"
                  @change="linkAttChg(row, column.property)"<#
                  if (column.attMaxSize > 1) {
                  #>
                  :maxSize="<#=column.attMaxSize#>"<#
                  }
                  #><#
                  if (column.maxFileSize) {
                  #>
                  :maxFileSize="<#=column.maxFileSize#>"<#
                  }
                  #><#
                  if (column.attAccept) {
                  #>
                  accept="<#=column.attAccept#>"<#
                  }
                  #>
                ></LinkAtt>
              </template>
            </el-table-column>
          </template><#
          } else if (!foreignKey && selectList.length === 0) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v-if="'<#=column_name#>' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"<#=minWith#><#=sortable#><#=align#><#=headerAlign#>
              show-overflow-tooltip
            >
            </el-table-column>
          </template><#
            } else if (selectList.length > 0) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v-if="'_<#=column_name#>' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"<#=minWith#><#=sortable#><#=align#><#=headerAlign#>
              show-overflow-tooltip
            >
            </el-table-column>
          </template><#
            } else {
          #>
          
          <!-- <#=column_comment#> -->
          <template v-if="'_<#=column_name#>' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"<#=minWith#><#=sortable#><#=align#><#=headerAlign#>
              show-overflow-tooltip
            ><#
              if (foreignKey.multiple) {
            #>
              <template #default="{ row, column }">
                <LinkList
                  v-model="row[column.property]"<#
                  if (column.linkListMaxSize) {
                  #>
                  :maxSize="<#=column.linkListMaxSize#>"<#
                  }
                  #>
                ></LinkList>
              </template><#
              }
            #>
            </el-table-column>
          </template><#
            }
          }
          #>
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
  Download,
  Upload,
  CirclePlus,
  CircleClose,
  CircleCheck,
} from "@element-plus/icons-vue";
import TableShowColumns from "@/components/TableShowColumns.vue";
import UploadFileDialog from "@/components/UploadFileDialog.vue";
import { downloadById } from "@/utils/axios";<#
const hasImg = columns.some((item) => item.isImg);
const hasAtt = columns.some((item) => item.isAtt);
#><#
if (hasImg) {
#>
import LinkImage from "@/components/LinkImage.vue";<#
}
#><#
if (hasAtt) {
#>
import LinkAtt from "@/components/LinkAtt.vue";<#
}
#>
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
  importFile,<#
    if (hasSummary) {
  #>
  findSummary,<#
    }
  #>
} from "./Api";

import {
  <#=tableUp#>Model,
  <#=tableUp#>Search,
} from "./Model";<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  const foreignKey = column.foreignKey;
  const data_type = column.DATA_TYPE;
  if (!foreignKey) continue;
  const foreignTable = foreignKey.table;
  const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  if (table === foreignTable) continue;
#>
import { <#=foreignTableUp#>Model } from "../<#=foreignTable#>/Model";<#
}
#><#
const foreignTableArr = [ ];
const column_commentArr = [ ];
const foreignKeyArr = [ ];
const foreignKeyCommentArr = [ ];
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE;
  let column_comment = column.COLUMN_COMMENT || "";
  if (column_comment.indexOf("[") !== -1) {
    column_comment = column_comment.substring(0, column_comment.indexOf("["));
  }
  column_commentArr.push(column_comment);
  const foreignKey = column.foreignKey;
  foreignKeyArr.push(foreignKey);
  const foreignTable = foreignKey && foreignKey.table;
  const search = column.search;
  if (search && foreignTable) {
    foreignTableArr.push(foreignTable);
    foreignKeyCommentArr.push(column_comment);
  }
}
#><#
if (foreignTableArr.length > 0) {
#>
import {<#
  for (let i = 0; i < foreignTableArr.length; i++) {
    const foreignTable = foreignTableArr[i];
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  #>
  findAllAndCount<#=foreignTableUp#>,
  findAll<#=foreignTableUp#>,<#
  }
  #>
} from "./Api";<#
}
#>

const usrStore = useUsrStore();

let inited = $ref(false);

// 表格
let tableRef = $ref<InstanceType<typeof ElTable>>();

// 导出Excel
async function exportClk() {
  const id = await exportExcel(search);
  downloadById(id);
}

// 搜索功能
let {
  search,
  searchFormRef,
  searchClk,
  searchReset,
  searchIptClr,
} = $(useSearch<<#=tableUp#>Search>(
  dataGrid,
));

// 分页功能
let {
  page,
  pageSizes,
  pgSizeChg,
  pgCurrentChg,
} = $(usePage<<#=tableUp#>Model>(dataGrid));

// 表格选择功能
let {
  selectList,
  selectChg,
  rowClassName,
  rowClk,
  rowClkCtrl,
  rowClkShift,
} = $(useSelect<<#=tableUp#>Model>(<any>$$(tableRef)));

// 表格数据
let tableData: <#=tableUp#>Model[] = $ref([ ]);

let tableColumns = $ref<ColumnType[]>([<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  const foreignKey = column.foreignKey;
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE;
  let column_comment = column.COLUMN_COMMENT || "";
  let selectList = [ ];
  let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
  if (selectStr) {
    selectList = eval(`(${ selectStr })`);
  }
  if (column_comment.indexOf("[") !== -1) {
    column_comment = column_comment.substring(0, column_comment.indexOf("["));
  }
  let minWith = "";
  if (column.minWith != null) {
    minWith = "\r\n          min-width=\""+column.minWith+"\"";
  }
  let width = "";
  if (column.width != null) {
    width = "\r\n          width=\""+column.width+"\"";
  }
  let sortable = "";
  if (column.sortable) {
    sortable = "\r\n          sortable=\"custom\"";
  }
  const isPassword = column.isPassword;
  if (isPassword) continue;
  let align = "";
  if (column.align) {
    align = "\r\n          align=\""+column.align+"\"";
  } else if (column_type && column_type !== "int(1)" && column_type.startsWith("int")) {
    align = "\r\n          align=\"right\"";
  } else {
    align = "\r\n          align=\"center\"";
  }
  let headerAlign = "";
  if (column.align) {
    align = "\r\n          header-align=\""+column.headerAlign+"\"";
  } else if (column_type && column_type !== "int(1)" && column_type.startsWith("int")) {
    headerAlign = "\r\n          header-align=\"center\"";
  }
#><#
  if (column.isImg) {
  #>
  {
    label: "<#=column_comment#>",
    prop: "<#=column_name#>",<#
    if (column.width) {
    #>
    width: <#=column.width#>,<#
    }
    #>
  },<#
  } else if (column.isAtt) {
  #>
  {
    label: "<#=column_comment#>",
    prop: "<#=column_name#>",<#
    if (column.width) {
    #>
    width: <#=column.width#>,<#
    }
    #>
  },<#
  } else if (!foreignKey && selectList.length === 0) {
  #>
  {
    label: "<#=column_comment#>",
    prop: "<#=column_name#>",<#
    if (column.width) {
    #>
    width: <#=column.width#>,<#
    }
    #>
  },<#
  } else if (selectList.length > 0 || foreignKey) {
  #>
  {
    label: "<#=column_comment#>",
    prop: "_<#=column_name#>",<#
    if (column.width) {
    #>
    width: <#=column.width#>,<#
    }
    #>
  },<#
  }
  #><#
}
#>
]);

// 表格列
let {
  headerDragend,
  resetColumns,
  storeColumns,
} = $(useTableColumns<<#=tableUp#>Model>(
  $$(tableColumns),
  {
    persistKey: "0",
  },
));

let detailRef = $ref<InstanceType<typeof Detail>>();<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  const data_type = column.DATA_TYPE;
  const column_type = column.COLUMN_TYPE;
  let column_comment = column.COLUMN_COMMENT || "";
  if (column_comment.indexOf("[") !== -1) {
    column_comment = column_comment.substring(0, column_comment.indexOf("["));
  }
  const foreignKey = column.foreignKey;
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
#><#
  if (foreignKey) {
#>

let <#=foreignTable#>Info: {
  count: number;
  data: <#=foreignTableUp#>Model[];
} = $ref({
  count: 0,
  data: [ ],
});

let <#=foreignTable#>4SelectV2 = $computed(() => {
  return <#=foreignTable#>Info.data.map((item) => {
    return {
      value: item.<#=foreignKey.column#>,
      label: item.<#=foreignKey.lbl#>,
    };
  });
});<#
  }
}
#>

// 获取下拉框列表
async function getSelectListEfc() {<#
  if (foreignTableArr.length > 0) {
  #>
  [<#
  for (let i = 0; i < foreignTableArr.length; i++) {
    const foreignTable = foreignTableArr[i];
    const foreignKey = foreignKeyArr.find((item) => item && item.table === foreignTable);
    const defaultSort = foreignKey && foreignKey.defaultSort;
  #>
    <#=foreignTable#>Info,<#
  }
  #>
  ] = await Promise.all([<#
  for (let i = 0; i < foreignTableArr.length; i++) {
    const foreignTable = foreignTableArr[i];
    const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignKey = foreignKeyArr.find((item) => item && item.table === foreignTable);
    const defaultSort = foreignKey && foreignKey.defaultSort;
  #>
    findAllAndCount<#=foreignTableUp#>({<#
      if (defaultSort && defaultSort.prop) {
    #>
      orderBy: "<#=defaultSort.prop#>",
      orderDec: "<#=defaultSort.order#>",<#
      }
    #>
    }, { pgSize: SELECT_V2_SIZE }, { notLoading: true }),<#
  }
  #>
  ]);<#
  }
  #>
}<#
for (let i = 0; i < foreignTableArr.length; i++) {
  const foreignTable = foreignTableArr[i];
  const foreignKey = foreignKeyArr.find((item) => item && item.table === foreignTable);
  const defaultSort = foreignKey && foreignKey.defaultSort;
  const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const column_comment = foreignKeyCommentArr[i];
#>

// <#=column_comment#>下拉框远程搜索
async function <#=foreignTable#>FilterEfc(query: string) {
  <#=foreignTable#>Info.data = await findAll<#=foreignTableUp#>({<#
      if (defaultSort && defaultSort.prop) {
    #>
    orderBy: "<#=defaultSort.prop#>",
    orderDec: "<#=defaultSort.order#>",<#
      }
    #>
    <#=foreignKey.lbl#>Like: query,
  }, { pgSize: SELECT_V2_SIZE }, { notLoading: true });
}<#
}
#>

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
  let data: <#=tableUp#>Model[];
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
}<#
if (defaultSort && defaultSort.prop) {
#>

// 默认排序
let defaultSort = $ref<Sort>({
  prop: "<#=defaultSort.prop#>",
  order: "<#=defaultSort.order || 'ascending'#>",
});<#
} else {
#>

// 默认排序
let defaultSort = $ref<Sort>();<#
}
#>

// 排序
async function sortChange(
  { prop, order, column }: { column: TableColumnCtx<<#=tableUp#>Model> } & Sort,
) {
  search.orderBy = prop;
  search.orderDec = order;
  await dataGrid();
}<#
if (hasAtt) {
#>

async function linkAttChg(row: <#=tableUp#>Model, key: string) {
  await updateById(row.id, { [key]: row[key] });
}<#
}
#><#
if (hasSummary) {
#>

// 合计
let summarys = $ref({ });

async function dataSummary() {
  summarys = await findSummary(search);
}

function summaryMethod(
  summary: any,
) {
  const columns: TableColumnCtx<MenuModel>[] = summary.columns;
  const sums: string[] = [ ];
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    let val = summarys[column.property] || "";
    if (i === 0) {
      val = `合计:${ val }`;
    }
    sums.push(val);
  }
  return sums;
}<#
}
#><#
if (opts.noAdd !== true) {
#>

// 打开增加页面
async function openAdd() {
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "增加",
    action: "add",
  });
  if (changedIds && changedIds.length > 0) {
    await Promise.all([
      dataGrid(true),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
    ]);
    selectList = tableData.filter((item) => changedIds.includes(item.id));
  }
}

let uploadFileDialogRef = $ref<InstanceType<typeof UploadFileDialog>>();

/**
 * 弹出导入窗口
*/
async function openUploadClk() {
  if (!uploadFileDialogRef) return;
  const file = await uploadFileDialogRef.showDialog({
    title: "导入<#=table_comment#>",
  });
  if (file) {
    const msg = await importFile(file);
    MessageBox.success(msg);
    await dataGrid(true);
  }
}<#
}
#><#
if (opts.noEdit !== true) {
#>

// 打开修改页面
async function openEdit() {
  if (selectList.length === 0) {
    ElMessage.warning(`请选择需要编辑的数据!`);
    return;
  }
  const ids = tableData.filter((item) => selectList.includes(item)).map((item) => item.id);
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: "修改",
    action: "edit",
    model: {
      ids,
    },
  });
  if (changedIds && changedIds.length > 0) {
    await Promise.all([
      dataGrid(),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
    ]);
    selectList = tableData.filter((item) => changedIds.includes(item.id));
  }
}<#
}
#><#
if (opts.noDelete !== true) {
#>

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
      dataGrid(true),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
    ]);
    ElMessage.success(`删除 ${ num } 条数据成功!`);
  }
}<#
}
#><#
if (opts.noRevert !== true) {
#>

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
      dataGrid(true),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
    ]);
    ElMessage.success(`还原 ${ num } 条数据成功!`);
  }
}<#
}
#>

async function initFrame() {
  if (usrStore.access_token) {
    await Promise.all([
      searchClk(),
      getSelectListEfc(),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
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
