<#
const hasSummary = columns.some((column) => column.showSummary && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("_");
const hasForeignTabs = columns.some((item) => item.foreignTabs?.length > 0);
const hasImg = columns.some((item) => item.isImg);
const hasAtt = columns.some((item) => item.isAtt);
#><template>
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
      
      un-grid="~ cols-[repeat(auto-fit,60px_220px)]"
      un-gap="x-1 y-2"
      un-justify-items-end
      un-items-center
      
      @keyup.enter="searchClk"
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
        <label><#=column_comment#></label>
        <el-form-item prop="<#=column_name#>">
          <el-select-v2
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            un-w="full"
            :height="300"
            :model-value="search.<#=column_name#>"
            placeholder="请选择<#=column_comment#>"
            :options="<#=foreignTable#>s.map((item) => ({ value: item.<#=foreignKey.column#>, label: item.<#=foreignKey.lbl#> }))"
            filterable
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
            :loading="!inited"
            @keyup.enter.stop
            @update:model-value="search.<#=column_name#> = $event"
            @change="searchClk"
          ></el-select-v2>
        </el-form-item>
      </template><#
      } else if (selectList.length > 0) {
      #>
      <template v-if="builtInSearch?.<#=column_name#> == null">
        <label><#=column_comment#></label>
        <el-form-item prop="<#=column_name#>">
          <el-select
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            un-w="full"
            :model-value="search.<#=column_name#>"
            placeholder="请选择<#=column_comment#>"
            filterable
            default-first-option
            clearable
            multiple
            @keyup.enter.stop
            @update:model-value="search.<#=column_name#> = $event"
            @change="searchClk"
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
            <el-option
              :value="<#=value#>"
              label="<#=label#>"
            ></el-option><#
            }
          #>
          </el-select>
        </el-form-item>
      </template><#
      } else if (data_type === "datetime" || data_type === "date") {
      #>
      <template v-if="builtInSearch?.<#=column_name#> == null">
        <label><#=column_comment#></label>
        <el-form-item prop="<#=column_name#>">
          <el-date-picker
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            type="daterange"
            un-w="full"
            :model-value="(search.<#=column_name#> as any)"
            start-placeholder="开始"
            end-placeholder="结束"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[ new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59) ]"
            clearable
            @update:model-value="search.<#=column_name#> = $event"
            @clear="searchIptClr"
          ></el-date-picker>
        </el-form-item>
      </template><#
      } else if (column_type === "int(1)") {
      #>
      <template v-if="builtInSearch?.<#=column_name#> == null">
        <label><#=column_comment#></label>
        <el-form-item prop="<#=column_name#>">
          <el-checkbox
            un-w="full"
            v-model="search.<#=column_name#>"
            :false-label="0"
            :true-label="1"
          ><#=column_comment#></el-checkbox>
        </el-form-item>
      </template><#
      } else if (column_type.startsWith("int")) {
      #>
      <template v-if="builtInSearch?.<#=column_name#> == null">
        <label><#=column_comment#></label>
        <el-form-item prop="<#=column_name#>">
          <el-input-number
            v-model="search.<#=column_name#>"
            un-w="full"
            :controls="false"
            clearable
            @clear="searchIptClr"
          ></el-input-number>
        </el-form-item>
      </template><#
      } else {
      #>
      <template v-if="builtInSearch?.<#=column_name#>Like == null && builtInSearch?.<#=column_name#> == null">
        <label><#=column_comment#></label>
        <el-form-item prop="<#=column_name#>Like">
          <el-input
            v-model="search.<#=column_name#>Like"
            un-w="full"
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
      if (opts.noDelete !== true && opts.noRevert !== true) {
      #>
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
      </template><#
      }
      #>
      
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
          title="清空已选择"
          un-cursor-pointer
          un-m="l-1.5"
          un-text="hover:red"
          @click="emptySelected"
        >
          <ElIconRemove />
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
    <template v-if="search.is_deleted !== 1"><#
      if (opts.noAdd !== true) {
      #>
      
      <el-button
        plain
        type="primary"
        @click="openAdd"
      >
        <template #icon>
          <ElIconCirclePlus />
        </template>
        <span>新增</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="openCopy"
      >
        <template #icon>
          <ElIconCopyDocument />
        </template>
        <span>复制</span>
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
          <ElIconEdit />
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
          <ElIconCircleClose />
        </template>
        <span>删除</span>
      </el-button><#
        }
      #>
    
      <el-button
        plain
        @click="searchClk"
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
          <span>更多操作</span>
          <el-icon>
            <ElIconArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu
            un-min="w-20"
            whitespace-nowrap
          ><#
            if (opts.noExport !== true) {
          #>
            
            <el-dropdown-item
              un-justify-center
              @click="exportClk"
            >
              <span>导出</span>
            </el-dropdown-item><#
              }
            #><#
              if (opts.noEdit !== true && opts.noAdd !== true && opts.noImport !== true) {
            #>
            
            <el-dropdown-item
              un-justify-center
              @click="openUploadClk"
            >
              <span>导入</span>
            </el-dropdown-item><#
              }
            #><#
              if (hasLocked && opts.noEdit !== true) {
            #>
            
            <el-dropdown-item
              un-justify-center
              @click="lockByIdsClk(1)"
            >
              <span>锁定</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              un-justify-center
              @click="lockByIdsClk(0)"
            >
              <span>解锁</span>
            </el-dropdown-item><#
            }
            #>
            
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
    </template>
    
    <template v-else><#
      if (opts.noDelete !== true && opts.noRevert !== true) {
    #>
      
      <el-button
        plain
        type="primary"
        @click="revertByIdsEfc"
      >
        <template #icon>
          <ElIconCircleCheck />
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
        @click="forceDeleteByIdsClk"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>彻底删除</span>
      </el-button><#
        }
      #>
      
      <el-button
        plain
        @click="searchClk"
      >
        <template #icon>
          <ElIconRefresh />
        </template>
        <span>刷新</span>
      </el-button><#
        if (opts.noExport !== true) {
      #>
      
      <el-button
        plain
        @click="exportClk"
      >
        <template #icon>
          <ElIconDownload />
        </template>
        <span>导出</span>
      </el-button><#
        }
      #>
      
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
        v-header-order-drag="() => ({ tableColumns, storeColumns, offset: 1 })"
        :data="tableData"
        :row-class-name="rowClassName"
        border
        size="small"
        height="100%"
        row-key="id"
        :empty-text="inited ? undefined : '加载中...'"
        :default-sort="sort"<#
        if (hasSummary) {
        #>
        show-summary
        :summary-method="summaryMethod"<#
        }
        #>
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
        ><#
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
            const foreignTabs = column.foreignTabs || [ ];
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
                <LinkImage
                  v-model="row[column.property]"
                ></LinkImage>
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
                  :max-size="<#=column.attMaxSize#>"<#
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
            ><#
              if (foreignTabs.length > 0) {
              #>
              <template #default="scope">
                <el-link
                  type="primary"
                  @click="openForeignTabs(scope.row.id, scope.row[scope.column.property])"
                >
                  {{ scope.row[scope.column.property] }}
                </el-link>
              </template><#
              }
              #>
            </el-table-column>
          </template><#
            } else if (selectList.length > 0) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'_<#=column_name#>' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            ><#
              if (foreignTabs.length > 0) {
              #>
              <template #default="scope">
                <el-link
                  type="primary"
                  @click="openForeignTabs(scope.row.id, scope.row[scope.column.property])"
                >
                  {{ scope.row[scope.column.property] }}
                </el-link>
              </template><#
              }
              #>
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
                  
                  min="w-7.5"
                  
                  @click="<#=column_name#>Clk(row)"
                >
                  {{ row[column.property]?.length || 0 }}
                </el-link>
              </template><#
              } else if (foreignKey.isLinkForeignTabs) {
                const foreignTable = foreignKey.table;
                const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
            #>
              <template #default="scope">
                <el-link
                  type="primary"
                  @click="open<#=foreignTableUp#>ForeignTabs(scope.row.<#=column_name#>, scope.row[scope.column.property])"
                >
                  {{ scope.row[scope.column.property] }}
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
      :selected-ids="selectedIds"
      @selected-ids-chg="<#=column_name#>ListSelectDialogRef?.selectedIdsChg($event)"
    ></<#=foreignTableUp#>List>
  </ListSelectDialog><#
    }
  #><#
    if (foreignKey && foreignKey.isLinkForeignTabs) {
  #>
  <<#=foreignTableUp#>ForeignTabs
    ref="<#=foreignTable#>ForeignTabsRef"
  ></<#=foreignTableUp#>ForeignTabs><#
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
  #><#
  if (hasForeignTabs > 0) {
  #>
  <ForeignTabs
    ref="foreignTabsRef"
  ></ForeignTabs><#
  }
  #>
</div>
</template>

<script setup lang="ts">
import Detail from "./Detail.vue";<#
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
  if (foreignKey && foreignKey.isLinkForeignTabs) {
#>
import <#=foreignTableUp#>ForeignTabs from "../<#=foreignTable#>/ForeignTabs.vue";<#
  }
#><#
}
#>

import {
  findAll,
  findCount,<#
    if (opts.noDelete !== true && opts.noRevert !== true) {
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
    if (hasLocked && opts.noEdit !== true) {
  #>
  lockByIds,<#
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
    if (opts.noEdit !== true && opts.noAdd !== true && opts.noImport !== true) {
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
  type <#=Table_Up#>Search,<#
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
  type <#=Foreign_Table_Up#>Model,<#
}
#><#
}
#>
} from "#/types";<#
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
  findAll<#=foreignTableUp#>,<#
  }
  #>
} from "./Api";<#
}
#><#
if (hasForeignTabs > 0) {
#>

import ForeignTabs from "./ForeignTabs.vue";<#
}
#>

defineOptions({
  name: "<#=table_comment#>",
});

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
    is_deleted: 0,<#
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
      if (!search) continue;
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    #><#
      if (foreignKey) {
    #>
    <#=column_name#>: [ ],<#
      }
    #><#
    }
    #>
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
  resetSelectedIds();
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
let tableData = $ref<<#=Table_Up#>Model[]>([ ]);

let tableColumns = $ref<ColumnType[]>([<#
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
    persistKey: new URL(import.meta.url).pathname,
  },
));

let detailRef = $ref<InstanceType<typeof Detail>>();<#
let foreignTableTmpArr = [ ];
for (let i = 0; i < foreignTableArr.length; i++) {
  const column = columns.find((item) => {
    const foreignKey = item.foreignKey;
    if (!foreignKey) return false;
    const foreignTable = foreignKey && foreignKey.table;
    if (!foreignTable) return false;
    return foreignTableArr[i] === foreignTable;
  });
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

let <#=foreignTable#>s = $ref<<#=Foreign_Table_Up#>Model[]>([ ]);<#
  }
}
#>

/** 获取下拉框列表 */
async function useSelectList() {<#
  if (foreignTableArr.length > 0) {
  #>
  [<#
  for (let i = 0; i < foreignTableArr.length; i++) {
    const foreignTable = foreignTableArr[i];
    const foreignKey = foreignKeyArr.find((item) => item && item.table === foreignTable);
    const defaultSort = foreignKey && foreignKey.defaultSort;
  #>
    <#=foreignTable#>s,<#
  }
  #>
  ] = await Promise.all([<#
  for (let i = 0; i < foreignTableArr.length; i++) {
    const foreignTable = foreignTableArr[i];
    const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignKey = foreignKeyArr.find((item) => item && item.table === foreignTable);
    const defaultSort = foreignKey && foreignKey.defaultSort;
  #>
    findAll<#=foreignTableUp#>(
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
  const {
    type,
    changedIds,
  } = await detailRef.showDialog({
    title: "增加",
    action: "add",
    builtInModel,
  });
  if (type === "cancel") {
    return;
  }
  if (changedIds.length > 0) {
    selectedIds = [ ...changedIds ];
    await Promise.all([
      dataGrid(true),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
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
  const {
    type,
    changedIds,
  } = await detailRef.showDialog({
    title: "复制",
    action: "copy",
    builtInModel,
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
}<#
  if (opts.noEdit !== true && opts.noAdd !== true && opts.noImport !== true) {
#>

let uploadFileDialogRef = $ref<InstanceType<typeof UploadFileDialog>>();

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
  const {
    type,
    changedIds,
  } = await detailRef.showDialog({
    title: "修改",
    action: "edit",
    builtInModel,
    model: {
      ids: selectedIds,
    },
  });
  if (type === "cancel") {
    return;
  }
  if (changedIds.length > 0) {
    await Promise.all([
      dataGrid(),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
    ]);
    emit("edit", changedIds);
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
      dataGrid(true),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
    ]);
  }
}<#
}
#><#
  if (hasLocked && opts.noEdit !== true) {
#>

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
}<#
}
#><#
if (opts.noDelete !== true && opts.noRevert !== true) {
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
    emit("revert", num);
  }
}<#
}
#><#
if (hasForeignTabs > 0) {
#>

let foreignTabsRef = $ref<InstanceType<typeof ForeignTabs>>();

async function openForeignTabs(id: string, title: string) {
  await foreignTabsRef.showDialog({
    title,
    model: {
      id,
    },
  });
}<#
}
#>

async function initFrame() {
  if (usrStore.authorization) {
    await Promise.all([
      searchClk(),
      useSelectList(),<#
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

let <#=column_name#>ListSelectDialogRef = $ref<InstanceType<typeof ListSelectDialog>>();

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
  if (foreignKey && foreignKey.isLinkForeignTabs) {
#>

let <#=foreignTable#>ForeignTabsRef = $ref<InstanceType<typeof <#=foreignTableUp#>ForeignTabs> | undefined>();

async function open<#=foreignTableUp#>ForeignTabs(id: string, title: string) {
  await <#=foreignTable#>ForeignTabsRef?.showDialog({
    title,
    model: {
      id,
    },
  });
}<#
  }
#><#
}
#>
</script>
