<#
const hasSummary = columns.some((column) => column.showSummary && !column.onlyCodegenDeno);
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("_");
#><template>
<div
  flex="~ [1_0_0] col"
  overflow-hidden
  w="full"
  h="full"
  p="[6px]"
  box="border"
>
  <div
    m="x-1.5"
    overflow-auto
  >
    <el-form
      size="default"
      :model="search"
      ref="searchFormRef"
      inline-message
      
      grid="~ cols-[repeat(4,minmax(min-content,max-content)210px)]"
      justify-items-end
      items-center
      gap="y-[6px]"
      
      @keyup.enter.native="searchClk"
    ><#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        if (column.onlyCodegenDeno) continue;
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
      <template v-if="builtInSearch?.<#=column_name#> == null">
        <label
          m="r-[3px] l-[6px]"
          text-gray
          whitespace-nowrap
          overflow-hidden
          class="after:content-[:]"
        >
          <#=column_comment#>
        </label>
        <el-form-item prop="<#=column_name#>">
          <el-select-v2
            @keyup.enter.native.stop
            :height="300"
            w="full"
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            :model-value="search.<#=column_name#>"
            @update:model-value="search.<#=column_name#> = $event"
            placeholder="请选择<#=column_comment#>"
            :options="<#=foreignTable#>4SelectV2"
            filterable
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
            :loading="!inited"
            @change="searchClk"
            @clear="searchIptClr"
          ></el-select-v2>
        </el-form-item>
      </template><#
      } else if (selectList.length > 0) {
      #>
      <template v-if="builtInSearch?.<#=column_name#> == null">
        <label
          m="r-[3px] l-[6px]"
          text-gray
          whitespace-nowrap
          overflow-hidden
          class="after:content-[:]"
        >
          <#=column_comment#>
        </label>
        <el-form-item prop="<#=column_name#>">
          <el-select
            @keyup.enter.native.stop
            w="full"
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            :model-value="search.<#=column_name#>"
            @update:model-value="search.<#=column_name#> = $event"
            placeholder="请选择<#=column_comment#>"
            filterable
            default-first-option
            clearable
            multiple
            @change="searchClk"
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
        </el-form-item>
      </template><#
      } else if (data_type === "datetime" || data_type === "date") {
      #>
      <template v-if="builtInSearch?.<#=column_name#> == null">
        <label
          m="r-[3px] l-[6px]"
          text-gray
          whitespace-nowrap
          overflow-hidden
          class="after:content-[:]"
        >
          <#=column_comment#>
        </label>
        <el-form-item prop="<#=column_name#>">
          <el-date-picker
            type="daterange"
            w="full"
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            :model-value="(search.<#=column_name#> as any)"
            @update:model-value="search.<#=column_name#> = $event"
            start-placeholder="开始"
            end-placeholder="结束"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[ new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59) ]"
            clearable
            @clear="searchIptClr"
          ></el-date-picker>
        </el-form-item>
      </template><#
      } else if (column_type === "int(1)") {
      #>
      <template v-if="builtInSearch?.<#=column_name#> == null">
        <label
          m="r-[3px] l-[6px]"
          text-gray
          whitespace-nowrap
          overflow-hidden
          class="after:content-[:]"
        >
          <#=column_comment#>
        </label>
        <el-form-item prop="<#=column_name#>">
          <el-checkbox
            w="full"
            v-model="search.<#=column_name#>"
            :false-label="0"
            :true-label="1"
          ><#=column_comment#></el-checkbox>
        </el-form-item>
      </template><#
      } else if (column_type.startsWith("int")) {
      #>
      <template v-if="builtInSearch?.<#=column_name#> == null">
        <label
          m="r-[3px] l-[6px]"
          text-gray
          whitespace-nowrap
          overflow-hidden
          class="after:content-[:]"
        >
          <#=column_comment#>
        </label>
        <el-form-item prop="<#=column_name#>">
          <el-input-number
            w="full"
            v-model="search.<#=column_name#>"
            :controls="false"
            clearable
            @clear="searchIptClr"
          ></el-input-number>
        </el-form-item>
      </template><#
      } else {
      #>
      <template v-if="builtInSearch?.<#=column_name#>Like == null && builtInSearch?.<#=column_name#> == null">
        <label
          m="r-[3px] l-[6px]"
          text-gray
          whitespace-nowrap
          overflow-hidden
          class="after:content-[:]"
        >
          <#=column_comment#>
        </label>
        <el-form-item prop="<#=column_name#>Like">
          <el-input
            w="full"
            v-model="search.<#=column_name#>Like"
            placeholder="请输入<#=column_comment#>"
            clearable
            @clear="searchIptClr"
          ></el-input>
        </el-form-item>
      </template><#
      }
      #><#
        }
      }
      #>
      <#
      if (opts.noRevert !== true) {
      #>
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
      </template><#
      }
      #>
      
      <div
        min="w-[20px]"
      ></div>
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
            m="x-1"
            text="green"
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
          cursor="pointer"
          m="x-3"
          text="hover:[red]"
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
            <Search/>
          </template>
          <span>查询</span>
        </el-button>
        
        <el-button
          plain
          @click="searchReset"
        >
          <template #icon>
            <Delete/>
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
    <template v-if="search.is_deleted !== 1"><#
      if (opts.noAdd !== true) {
      #>
      
      <el-button
        plain
        type="primary"
        @click="openAdd"
      >
        <template #icon>
          <CirclePlus/>
        </template>
        <span>新增</span>
      </el-button><#
      }
      #><#
      if (opts.noEdit !== true) {
      #>
      
      <el-button
        plain
        type="primary"
        @click="openEdit"
      >
        <template #icon>
          <Edit/>
        </template>
        <span>编辑</span>
      </el-button><#
      }
      #><#
        if (opts.noDelete !== true) {
      #>
      
      <el-button
        plain
        type="danger"
        @click="deleteByIdsEfc"
      >
        <template #icon>
          <CircleClose/>
        </template>
        <span>删除</span>
      </el-button><#
        }
      #><#
        if (opts.noExport !== true) {
      #>
      
      <el-button
        plain
        @click="exportClk"
      >
        <template #icon>
          <Download/>
        </template>
        <span>导出</span>
      </el-button><#
        }
      #><#
        if (opts.noImport !== true) {
      #>
      
      <el-button
        plain
        @click="openUploadClk"
      >
        <template #icon>
          <Upload/>
        </template>
        <span>导入</span>
      </el-button><#
        }
      #>
      
    </template>
    <template v-else><#
      if (opts.noRevert !== true) {
      #>
      <el-button
        plain
        type="primary"
        @click="revertByIdsEfc"
      >
        <template #icon>
          <CircleCheck/>
        </template>
        <span>还原</span>
      </el-button><#
      }
      #><#
        if (opts.noDelete !== true) {
      #>
      
      <el-button
        plain
        type="danger"
        @click="forceDeleteByIdsEfc"
      >
        <template #icon>
          <CircleClose/>
        </template>
        <span>彻底删除</span>
      </el-button><#
        }
      #><#
        if (opts.noExport !== true) {
      #>
      
      <el-button
        plain
        @click="exportClk"
      >
        <template #icon>
          <Download/>
        </template>
        <span>导出</span>
      </el-button><#
        }
      #>
    </template>
    
    <el-button
      plain
      @click="searchClk"
    >
      <template #icon>
        <Refresh/>
      </template>
      <span>刷新</span>
    </el-button>
    
    <div
      flex="[1_0_0]"
      overflow-hidden
    >
    </div>
    
    <TableShowColumns
      :tableColumns="tableColumns"
      @resetColumns="resetColumns"
      @storeColumns="storeColumns"
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
        :default-sort="sort"<#
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
          let colIdx = 0;
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
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
            const isPassword = column.isPassword;
            if (isPassword) continue;
          #><#
          if (column.isImg) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row, column }">
                <LinkImage v-model="row[column.property]"></LinkImage>
              </template>
            </el-table-column>
          </template><#
          } else if (column.isAtt) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
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
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template><#
            } else if (selectList.length > 0) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'_<#=column_name#>' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template><#
            } else if (foreignKey) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'_<#=column_name#>' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            ><#
              if (foreignKey.multiple && (foreignKey.showType === "tag" || !foreignKey.showType)) {
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
              } else if (foreignKey.multiple && foreignKey.showType === "dialog") {
            #>
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  @click="<#=column_name#>Clk(row)"
                  min="w-[30px]"
                >
                  {{ row[column.property]?.length || 0 }}
                </el-link>
              </template><#
              }
            #>
            </el-table-column>
            
          </template><#
            }
          #><#
            colIdx++;
          }
          #>
          
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
        @size-change="pgSizeChg"
        @current-change="pgCurrentChg"
        :current-page="page.current"
        :total="page.total"
      ></el-pagination>
    </div>
  </div><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
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
    if (foreignKey && foreignKey.multiple && foreignKey.showType === "dialog") {
  #>
  <ListSelectDialog
    ref="<#=column_name#>ListSelectDialogRef"
    v-slot="{ selectedIds }"
  >
    <<#=foreignTableUp#>List
      :selectedIds="selectedIds"
      @selectedIdsChg="<#=column_name#>ListSelectDialogRef?.selectedIdsChg($event)"
    ></<#=foreignTableUp#>List>
  </ListSelectDialog><#
    }
  #><#
  }
  #>
  <Detail
    ref="detailRef"
  ></Detail><#
    if (opts.noImport !== true) {
  #>
  <UploadFileDialog ref="uploadFileDialogRef"></UploadFileDialog><#
    }
  #>
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

import TableShowColumns from "@/components/TableShowColumns.vue";<#
  if (opts.noImport !== true) {
#>
import UploadFileDialog from "@/components/UploadFileDialog.vue";<#
  }
#>
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
import { deepCompare } from "@/utils/ObjectUtil";

import {
  usePage,
  useSelect,
  useTableColumns,
  ColumnType,
} from "@/compositions/List";

import Detail from "./Detail.vue";

import ListSelectDialog from "@/components/ListSelectDialog.vue";<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
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
  if (foreignKey && foreignKey.multiple && foreignKey.showType === "dialog") {
#>
import <#=foreignTableUp#>List from "../<#=foreignTable#>/List.vue";<#
  }
#><#
}
#>

import {
  findAll,
  findAllAndCount,<#
    if (opts.noRevert !== true) {
  #>
  revertByIds,<#
    }
  #><#
    if (opts.noDelete !== true) {
  #>
  deleteByIds,
  forceDeleteByIds,<#
    }
  #><#
    if (opts.noExport !== true) {
  #>
  exportExcel,<#
    }
  #><#
    if (opts.noEdit !== true) {
  #>
  updateById,<#
    }
  #><#
    if (opts.noImport !== true) {
  #>
  importFile,<#
    }
  #><#
    if (hasSummary) {
  #>
  findSummary,<#
    }
  #>
} from "./Api";

import {
  type <#=Table_Up#>Model,
  type <#=Table_Up#>Search,
} from "#/types";<#
{
const foreignTableUpArr = [ ];
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const column_name = column.COLUMN_NAME;
  const foreignKey = column.foreignKey;
  const data_type = column.DATA_TYPE;
  if (!foreignKey) continue;
  const foreignTable = foreignKey.table;
  const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  if (table === foreignTable) continue;
  if (foreignTableUpArr.includes(foreignTableUp)) continue;
  foreignTableUpArr.push(foreignTableUp);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("_");
#>
import {
  type <#=Foreign_Table_Up#>Model,
} from "#/types";<#
}
}
#><#
const foreignTableArr = [ ];
const column_commentArr = [ ];
const foreignKeyArr = [ ];
const foreignKeyCommentArr = [ ];
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
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
    if (!foreignTableArr.includes(foreignTable)) {
      foreignTableArr.push(foreignTable);
      foreignKeyCommentArr.push(column_comment);
    }
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

const emit = defineEmits([
  "selectedIdsChg",
]);

/** 表格 */
let tableRef = $ref<InstanceType<typeof ElTable>>();<#
  if (opts.noExport !== true) {
#>

/** 导出Excel */
async function exportClk() {
  const id = await exportExcel(search, [ sort ]);
  downloadById(id);
}<#
  }
#>

/** 搜索 */
function initSearch() {
  return {
    is_deleted: 0,
  } as <#=Table_Up#>Search;
}

let search = $ref(initSearch());

/** 搜索 */
async function searchClk() {
  await dataGrid(true);
}

/** 重置搜索 */
async function searchReset() {
  search = initSearch();
  idsChecked = 0;
  await searchClk();
}

/** 清空搜索框事件 */
async function searchIptClr() {
  await searchClk();
}

const props = defineProps<{
  is_deleted?: string;
  ids?: string[]; //ids
  selectedIds?: string[]; //已选择行的id列表<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    let data_type = column.DATA_TYPE;
    let column_type = column.DATA_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const search = column.search;
    if (column_name === 'id') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'varchar') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'date') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'datetime') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'int') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'json') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'text') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'tinyint') {
      data_type = "string";
    }
    else if (column.DATA_TYPE === 'decimal') {
      data_type = 'string';
    }
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (foreignKey || selectList.length > 0) {
      data_type = "string|string[]";
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (data_type === 'id') {
      column_comment = '';
    } else {
      column_comment = ' //' + column_comment;
    }
    /* if (!search) continue; */
  #><#
    if (foreignKey) {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#>
  _<#=column_name#>?: <#=data_type#>;<#=column_comment#><#
    } else if (selectList && selectList.length > 0) {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#><#
    } else if (column_name === "id") {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#><#
    } else if (column.DATA_TYPE === "int" || column.DATA_TYPE === "decimal" || column.DATA_TYPE === "double" || column.DATA_TYPE === "datetime" || column.DATA_TYPE === "date") {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#><#
    } else {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#>
  <#=column_name#>Like?: <#=data_type#>;<#=column_comment#><#
    }
  #><#
  }
  #>
}>();

const builtInSearchType: { [key: string]: string } = {
  is_deleted: "0|1",
  ids: "string[]",<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    let data_type = column.DATA_TYPE;
    let column_type = column.DATA_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (foreignKey || selectList.length > 0) {
      data_type = data_type+"[]";
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
  #><#
    if (foreignKey) {
  #>
  <#=column_name#>: "string[]",
  _<#=column_name#>: "string[]",<#
    } else if (selectList && selectList.length > 0 && column.DATA_TYPE === 'tinyint' || column.DATA_TYPE === 'int') {
  #>
  <#=column_name#>: "number[]",
  _<#=column_name#>: "string[]",<#
    } else if (selectList && selectList.length > 0) {
  #>
  <#=column_name#>: "string[]",
  _<#=column_name#>: "string[]",<#
    } else if (column.DATA_TYPE === 'tinyint' || column.DATA_TYPE === 'int' || column.DATA_TYPE === 'decimal') {
  #>
  <#=column_name#>: "number",<#
  }
  #><#
  }
  #>
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
  return Object.fromEntries(entries) as unknown as <#=Table_Up#>Search;
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
  return Object.fromEntries(entries) as unknown as <#=Table_Up#>Model;
});

/** 分页功能 */
let {
  page,
  pageSizes,
  pgSizeChg,
  pgCurrentChg,
} = $(usePage<<#=Table_Up#>Model>(dataGrid));

/** 表格选择功能 */
let {
  selectedIds,
  selectChg,
  rowClassName,
  rowClk,
  rowClkCtrl,
  rowClkShift,
} = $(useSelect<<#=Table_Up#>Model>($$(tableRef)));

watch(
  () => selectedIds,
  () => {
    emit("selectedIdsChg", selectedIds);
  },
);

/** 取消已选择筛选 */
async function clearSelect() {
  selectedIds = [ ];
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
let tableData = $ref<<#=Table_Up#>Model[]>([ ]);

let tableColumns = $ref<ColumnType[]>([<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
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
  const isPassword = column.isPassword;
  if (isPassword) continue;
  if (column.align) {
    column.align = column.align;
  } else if (column_type && column_type !== "int(1)" && column_type.startsWith("int")) {
    column.align = "right";
  } else {
    column.align = "center";
  }
  if (column.headerAlign) {
    column.headerAlign = column.headerAlign;
  } else if (column_type && column_type !== "int(1)" && column_type.startsWith("int")) {
    column.headerAlign = "center";
  } else {
    column.headerAlign = "center";
  }
  if (column.showOverflowTooltip == null) {
    column.showOverflowTooltip = true;
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
    #><#
    if (column.minWidth) {
    #>
    minWidth: <#=column.minWidth#>,<#
    }
    #><#
    if (column.sortable) {
    #>
    sortable: "custom",<#
    }
    #><#
    if (column.align) {
    #>
    align: "<#=column.align#>",<#
    }
    #><#
    if (column.headerAlign) {
    #>
    headerAlign: "<#=column.headerAlign#>",<#
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
    #><#
    if (column.minWidth) {
    #>
    minWidth: <#=column.minWidth#>,<#
    }
    #><#
    if (column.sortable) {
    #>
    sortable: "custom",<#
    }
    #><#
    if (column.align) {
    #>
    align: "<#=column.align#>",<#
    }
    #><#
    if (column.headerAlign) {
    #>
    headerAlign: "<#=column.headerAlign#>",<#
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
    #><#
    if (column.minWidth) {
    #>
    minWidth: <#=column.minWidth#>,<#
    }
    #><#
    if (column.sortable) {
    #>
    sortable: "custom",<#
    }
    #><#
    if (column.align) {
    #>
    align: "<#=column.align#>",<#
    }
    #><#
    if (column.headerAlign) {
    #>
    headerAlign: "<#=column.headerAlign#>",<#
    }
    #><#
    if (column.showOverflowTooltip != null) {
    #>
    showOverflowTooltip: <#=column.showOverflowTooltip#>,<#
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
    #><#
    if (column.minWidth) {
    #>
    minWidth: <#=column.minWidth#>,<#
    }
    #><#
    if (column.sortable) {
    #>
    sortable: "custom",<#
    }
    #><#
    if (column.align) {
    #>
    align: "<#=column.align#>",<#
    }
    #><#
    if (column.headerAlign) {
    #>
    headerAlign: "<#=column.headerAlign#>",<#
    }
    #><#
    if (column.showOverflowTooltip != null) {
    #>
    showOverflowTooltip: <#=column.showOverflowTooltip#>,<#
    }
    #>
  },<#
  }
  #><#
}
#>
]);

/** 表格列 */
let {
  headerDragend,
  resetColumns,
  storeColumns,
} = $(useTableColumns<<#=Table_Up#>Model>(
  $$(tableColumns),
  {
    persistKey: "0",
  },
));

let detailRef = $ref<InstanceType<typeof Detail> | undefined>();<#
const foreignTableTmpArr = [];
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
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
  if (foreignTableTmpArr.includes(foreignTable)) continue;
  foreignTableTmpArr.push(foreignTable);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("_");
#><#
  if (foreignKey) {
#>

let <#=foreignTable#>Info = $ref<{
  count: number;
  data: <#=Foreign_Table_Up#>Model[];
}>({
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

/** 获取下拉框列表 */
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
    findAllAndCount<#=foreignTableUp#>(
      undefined,
      {
      },
      [
        {
          prop: "<#=defaultSort && defaultSort.prop || ""#>",
          order: "<#=defaultSort && defaultSort.order || "ascending"#>",
        },
      ],
      {
        notLoading: true,
      },
    ),<#
  }
  #>
  ]);<#
  }
  #>
}

/** 刷新表格 */
async function dataGrid(isCount = false) {
  const pgSize = page.size;
  const pgOffset = (page.current - 1) * page.size;
  let data: <#=Table_Up#>Model[];
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
}<#
if (defaultSort && defaultSort.prop) {
#>

/** 排序 */
let sort: Sort = $ref({
  prop: "<#=defaultSort.prop#>",
  order: "<#=defaultSort.order || 'ascending'#>",
});<#
} else {
#>

/** 排序 */
let sort: Sort = $ref({
  prop: "",
  order: "ascending",
});<#
}
#>

/** 排序 */
async function sortChange(
  { prop, order, column }: { column: TableColumnCtx<<#=Table_Up#>Model> } & Sort,
) {
  sort.prop = prop;
  sort.order = order;
  await dataGrid();
}<#
if (hasAtt) {
#>

async function linkAttChg(row: any, key: any) {<#
    if (opts.noEdit !== true) {
#>
  await updateById(row.id!, { [key]: row[key] });<#
    }
  #>
}<#
}
#><#
if (hasSummary) {
#>

/** 合计 */
let summarys = $ref({ });

async function dataSummary() {
  summarys = await findSummary(search);
}

function summaryMethod(
  summary: any,
) {
  const columns: TableColumnCtx<<#=Table_Up#>Model>[] = summary.columns;
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
      dataGrid(true),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
    ]);
    selectedIds = tableData.filter(
      (item) => changedIds.includes(item.id)
    ).map(
      (item) => item.id
    );
  }
}<#
  if (opts.noImport !== true) {
#>

let uploadFileDialogRef = $ref<InstanceType<typeof UploadFileDialog> | undefined>();

/**
 * 弹出导入窗口
*/
async function openUploadClk() {
  if (!uploadFileDialogRef) {
    return;
  }
  const file = await uploadFileDialogRef.showDialog({
    title: "导入<#=table_comment#>",
  });
  if (file) {
    const msg = await importFile(file);
    if (msg) {
      MessageBox.success(msg);
    }
    await dataGrid(true);
  }
}<#
  }
#><#
}
#><#
if (opts.noEdit !== true) {
#>

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
      dataGrid(),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
    ]);
    selectedIds = tableData.filter(
      (item) => changedIds.includes(item.id)
    ).map(
      (item) => item.id
    );
  }
}<#
}
#><#
if (opts.noDelete !== true) {
#>

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
      dataGrid(true),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
    ]);
    ElMessage.success(`删除 ${ num } 条数据成功!`);
  }
}

/** 点击彻底删除 */
async function forceDeleteByIdsEfc() {
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
    await Promise.all([
      dataGrid(true),
    ]);
    ElMessage.success(`彻底删除 ${ num } 条数据成功!`);
  }
}<#
}
#><#
if (opts.noRevert !== true) {
#>

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
  if (usrStore.authorization) {
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
  () => builtInSearch,
  async (newVal, oldVal) => {
    if (!deepCompare(oldVal, newVal)) {
      await initFrame();
    }
  },
);

usrStore.onLogin(initFrame);

initFrame();<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
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
  if (foreignKey && foreignKey.multiple && foreignKey.showType === "dialog") {
#>

let <#=column_name#>ListSelectDialogRef: InstanceType<typeof ListSelectDialog>|undefined = $ref();

async function <#=column_name#>Clk(row: <#=Table_Up#>Model) {
  if (!<#=column_name#>ListSelectDialogRef) return;
  row.<#=column_name#> = row.<#=column_name#> || [ ];
  let {
    selectedIds: selectedIds2,
    action
  } = await <#=column_name#>ListSelectDialogRef.showDialog({
    selectedIds: row.<#=column_name#> as string[],
  });
  if (action === "select") {
    selectedIds2 = selectedIds2 || [ ];
    let isEqual = true;
    if (selectedIds2.length === row.<#=column_name#>.length) {
      for (let i = 0; i < selectedIds2.length; i++) {
        const item = selectedIds2[i];
        if (!row.<#=column_name#>.includes(item)) {
          isEqual = false;
          break;
        }
      }
    } else {
      isEqual = false;
    }
    if (!isEqual) {
      row.<#=column_name#> = selectedIds2;
      await updateById(row.id, { <#=column_name#>: selectedIds2 });
      await dataGrid();
    }
  }
}<#
  }
#><#
}
#>
</script>
