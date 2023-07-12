<#
const hasSummary = columns.some((column) => column.showSummary && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  Table_Up = Table_Up.substring(0, Table_Up.length - 1) + Table_Up.substring(Table_Up.length - 1).toUpperCase();
  modelName = Table_Up + "model";
  fieldCommentName = Table_Up + "fieldComment";
  inputName = Table_Up + "input";
  searchName = Table_Up + "search";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
}
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
      label-width="auto"
      
      un-grid="~ cols-[repeat(auto-fit,280px)]"
      un-gap="x-2 y-2"
      un-justify-items-end
      un-items-center
      
      @keyup.enter="onSearch"
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
        const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
      #><#
        if (search) {
      #>
      <#
      if (column.isImg) {
      #><#
      } else if (foreignKey) {
      #>
      <template v-if="showBuildIn || builtInSearch?.<#=column_name#> == null">
        <el-form-item
          label="<#=column_comment#>"
          prop="<#=column_name#>"
        >
          <CustomSelect
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            un-w="full"
            v-model="search.<#=column_name#>"
            :method="get<#=Foreign_Table_Up#>List"
            :options-map="((item: <#=Foreign_Table_Up#>Model) => {
              return {
                label: item.<#=foreignKey.lbl#>,
                value: item.<#=foreignKey.column#>,
              };
            })"
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
            multiple
            @change="onSearch"
          ></CustomSelect>
        </el-form-item>
      </template><#
      } else if (column.dict) {
      #>
      <template v-if="showBuildIn || builtInSearch?.<#=column_name#> == null">
        <el-form-item
          :label="n('<#=column_comment#>')"
          prop="<#=column_name#>"
        >
          <DictSelect
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            un-w="full"
            :model-value="search.<#=column_name#>"
            @update:model-value="search.<#=column_name#> = $event"
            code="<#=column.dict#>"
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
            multiple
            @change="onSearch"
          ></DictSelect>
        </el-form-item>
      </template><#
      } else if (column.dictbiz) {
      #>
      <template v-if="showBuildIn || builtInSearch?.<#=column_name#> == null">
        <el-form-item
          :label="n('<#=column_comment#>')"
          prop="<#=column_name#>"
        >
          <DictbizSelect
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            un-w="full"
            :model-value="search.<#=column_name#>"
            @update:model-value="search.<#=column_name#> = $event"
            code="<#=column.dictbiz#>"
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
            multiple
            @change="onSearch"
          ></DictbizSelect>
        </el-form-item>
      </template><#
      } else if (data_type === "datetime" || data_type === "date") {
      #>
      <template v-if="showBuildIn || builtInSearch?.<#=column_name#> == null">
        <el-form-item
          :label="n('<#=column_comment#>')"
          prop="<#=column_name#>"
        >
          <el-date-picker
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            type="daterange"
            un-w="full"
            :model-value="(search.<#=column_name#> as any)"
            :start-placeholder="ns('开始')"
            :end-placeholder="ns('结束')"
            format="YYYY-MM-DD"
            :default-time="[ new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59) ]"
            clearable
            @update:model-value="search.<#=column_name#> = $event"
            @clear="onSearchClear"
          ></el-date-picker>
        </el-form-item>
      </template><#
      } else if (column_type === "int(1)") {
      #>
      <template v-if="showBuildIn || builtInSearch?.<#=column_name#> == null">
        <el-form-item
          :label="n('<#=column_comment#>')"
          prop="<#=column_name#>"
        >
          <el-checkbox
            un-w="full"
            v-model="search.<#=column_name#>"
            :false-label="0"
            :true-label="1"
          >{{ n('<#=column_comment#>') }}</el-checkbox>
        </el-form-item>
      </template><#
      } else if (column_type.startsWith("int")) {
      #>
      <template v-if="showBuildIn || builtInSearch?.<#=column_name#> == null">
        <el-form-item
          :label="n('<#=column_comment#>')"
          prop="<#=column_name#>"
        >
          <el-input-number
            v-model="search.<#=column_name#>"
            un-w="full"
            :controls="false"
            clearable
            @clear="onSearchClear"
          ></el-input-number>
        </el-form-item>
      </template><#
      } else {
      #>
      <template v-if="showBuildIn || builtInSearch?.<#=column_name#>_like == null && builtInSearch?.<#=column_name#> == null">
        <el-form-item
          :label="n('<#=column_comment#>')"
          prop="<#=column_name#>_like"
        >
          <el-input
            v-model="search.<#=column_name#>_like"
            un-w="full"
            :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"
            clearable
            @clear="onSearchClear"
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
      </template><#
      }
      #>
      
      <el-form-item
        label=" "
        prop="idsChecked"
      >
        <el-checkbox
          v-model="idsChecked"
          :false-label="0"
          :true-label="1"
          :disabled="selectedIds.length === 0"
          @change="onIdsChecked"
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
          @click="onEmptySelected"
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
          @click="onSearch"
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
    <template v-if="search.is_deleted !== 1"><#
      if (opts.noAdd !== true) {
      #>
      
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
      </el-button><#
      }
      #><#
      if (opts.noEdit !== true) {
      #>
      
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
      </el-button><#
      }
      #><#
        if (opts.noDelete !== true) {
      #>
      
      <el-button
        v-if="permit('delete') && !isLocked"
        plain
        type="danger"
        @click="onDeleteByIds"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>{{ ns('删除') }}</span>
      </el-button><#
        }
      #>
      
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
        @click="onRefresh"
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
        ><#
           if (opts.noExport !== true) {
         #>
          <span
            v-if="(exportExcel.workerStatus as any) === 'RUNNING'"
          >
            {{ ns('正在导出') }}
          </span>
          <span
            v-else
          >
            {{ ns('更多操作') }}
          </span><#
            } else {
          #>
          <span>
            {{ ns('更多操作') }}
          </span><#
            }
          #>
          <el-icon>
            <ElIconArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu
            un-min="w-20"
            un-whitespace-nowrap
          ><#
            if (opts.noExport !== true) {
          #>
            
            <el-dropdown-item
              v-if="(exportExcel.workerStatus as any) !== 'RUNNING'"
              un-justify-center
              @click="onExport"
            >
              <span>{{ ns('导出') }}</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-else
              un-justify-center
              @click="onCancelExport"
            >
              <span un-text="red">{{ ns('取消导出') }}</span>
            </el-dropdown-item><#
              }
            #><#
              if (opts.noEdit !== true && opts.noAdd !== true && opts.noImport !== true) {
            #>
            
            <el-dropdown-item
              v-if="permit('edit') && !isLocked"
              un-justify-center
              @click="onImportExcel"
            >
              <span>{{ ns('导入') }}</span>
            </el-dropdown-item><#
              }
            #><#
              if (hasEnabled && opts.noEdit !== true) {
            #>
            
            <el-dropdown-item
              v-if="permit('edit') && !isLocked"
              un-justify-center
              @click="onEnableByIds(1)"
            >
              <span>{{ ns('启用') }}</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('edit') && !isLocked"
              un-justify-center
              @click="onEnableByIds(0)"
            >
              <span>{{ ns('禁用') }}</span>
            </el-dropdown-item><#
            }
            #><#
              if (hasLocked && opts.noEdit !== true) {
            #>
            
            <el-dropdown-item
              v-if="permit('edit') && !isLocked"
              un-justify-center
              @click="onLockByIds(1)"
            >
              <span>{{ ns('锁定') }}</span>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('edit') && !isLocked"
              un-justify-center
              @click="onLockByIds(0)"
            >
              <span>{{ ns('解锁') }}</span>
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
        v-if="permit('delete') && !isLocked"
        plain
        type="primary"
        @click="revertByIdsEfc"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ ns('还原') }}</span>
      </el-button><#
      }
      #><#
      if (opts.noDelete !== true) {
      #>
      
      <el-button
        v-if="permit('force_delete') && !isLocked"
        plain
        type="danger"
        @click="onForceDeleteByIds"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>{{ ns('彻底删除') }}</span>
      </el-button><#
      }
      #>
      
      <el-button
        plain
        @click="onSearch"
      >
        <template #icon>
          <ElIconRefresh />
        </template>
        <span>{{ ns('刷新') }}</span>
      </el-button><#
      if (opts.noExport !== true) {
      #>
      
      <el-button
        plain
        @click="onExport"
      >
        <template #icon>
          <ElIconDownload />
        </template>
        <span>{{ ns('导出') }}</span>
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
        :default-sort="sort"<#
        if (hasSummary) {
        #>
        show-summary
        :summary-method="summaryMethod"<#
        }
        #>
        @select="selectChg"
        @select-all="selectChg"
        @row-click="onRow"
        @sort-change="onSortChange"
        @header-dragend="headerDragend"
        @row-dblclick="openView"
        @keydown.escape="onEmptySelected"
        @keydown.delete="onDeleteByIds"
        @keydown.enter="onRowEnter"
        @keydown.up="onRowUp"
        @keydown.down="onRowDown"
        @keydown.left="onRowLeft"
        @keydown.right="onRowRight"
        @keydown.home="onRowHome"
        @keydown.end="onRowEnd"<#
        if (list_page) {
        #>
        @keydown.page-up="onPageUp"
        @keydown.page-down="onPageDown"<#
        }
        #>
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
        ><#
          let colIdx = 0;
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            if (column.noList) continue;
            const column_name = column.COLUMN_NAME;
            if (column_name === "id") continue;
            if (column_name === "version") continue;
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
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop && (showBuildIn || builtInSearch?.<#=column_name#> == null)">
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
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop && (showBuildIn || builtInSearch?.<#=column_name#> == null)">
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
                  :isLocked="isLocked"
                ></LinkAtt>
              </template>
            </el-table-column>
          </template><#
            } else if (column_name === "order_by") {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop && (showBuildIn || builtInSearch?.<#=column_name#> == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row }">
                <CustomInputNumber
                  v-if="permit('edit')<#
                  if (hasLocked) {
                  #> && row.is_locked !== 1<#
                  }
                  #> && row.is_deleted !== 1 && !isLocked"
                  v-model="row.order_by"
                  :min="0"
                  @change="updateById(row.id, { order_by: row.order_by }, { notLoading: true })"
                ></CustomInputNumber>
              </template>
            </el-table-column>
          </template><#
            } else if (column.whitespacePre) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop && (showBuildIn || builtInSearch?.<#=column_name#> == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row, column }">
                <div
                  un-whitespace-pre
                >
                  {{ row[column.property] }}
                </div>
              </template>
            </el-table-column>
          </template><#
            } else if (selectList.length > 0 || column.dict || column.dictbiz) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>_lbl' === col.prop && (showBuildIn || builtInSearch?.<#=column_name#> == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            ><#
              if (foreignTabs.length > 0) {
              #>
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  @click="openForeignTabs(row.id, row[column.property])"
                >
                  {{ row[column.property] }}
                </el-link>
              </template><#
              } else if(column.isSwitch && opts.noEdit !== true && column_name === "is_default") {
              #>
              <template #default="{ row }">
                <CustomSwitch
                  v-if="permit('edit')<#
                  if (hasLocked) {
                  #> && row.is_locked !== 1<#
                  }
                  #> && row.is_deleted !== 1 && !isLocked"
                  v-model="row.<#=column_name#>"
                  :before-change="() => row.<#=column_name#> == 0"
                  @change="<#=column_name#>Chg(row.id)"
                ></CustomSwitch>
              </template><#
              } else if(column.isSwitch && opts.noEdit !== true) {
              #>
              <template #default="{ row }">
                <CustomSwitch
                  v-if="permit('edit')<#
                  if (hasLocked && column_name !== "is_locked") {
                  #> && row.is_locked !== 1<#
                  }
                  #> && row.is_deleted !== 1 && !isLocked"
                  v-model="row.<#=column_name#>"
                  @change="<#=column_name#>Chg(row.id, row.<#=column_name#>)"
                ></CustomSwitch>
              </template><#
              }
              #>
            </el-table-column>
          </template><#
            } else if (!foreignKey && selectList.length === 0) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop && (showBuildIn || builtInSearch?.<#=column_name#> == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            ><#
              if (foreignTabs.length > 0) {
              #>
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  @click="openForeignTabs(row.id, row[column.property])"
                >
                  {{ row[column.property] }}
                </el-link>
              </template><#
              }
              #>
            </el-table-column>
          </template><#
            } else if (foreignKey) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>_lbl' === col.prop && (showBuildIn || builtInSearch?.<#=column_name#> == null)">
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
                  un-min="w-7.5"
                  @click="on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(row)"
                >
                  {{ row[column.property]?.length || 0 }}
                </el-link>
              </template><#
              } else if (foreignKey.isLinkForeignTabs) {
                const foreignTable = foreignKey.table;
                const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
                const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
                  return item.substring(0, 1).toUpperCase() + item.substring(1);
                }).join("");
            #>
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  @click="open<#=Foreign_Table_Up#>ForeignTabs(row.<#=column_name#>, row[column.property])"
                >
                  {{ row[column.property] }}
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
          
          <template v-else-if="showBuildIn">
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
    ><#
      if (list_page) {
      #>
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
      ></el-pagination><#
      } else {
      #>
      <el-pagination
        layout="total"
        :total="page.total"
      ></el-pagination><#
      }
      #>
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
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #><#
    if (foreignKey && foreignKey.multiple && foreignKey.showType === "dialog") {
  #>
  
  <ListSelectDialog
    ref="<#=column_name#>ListSelectDialogRef"
    :is-locked="isLocked"
    v-slot="listSelectProps"
  >
    <<#=Foreign_Table_Up#>List<#
      if (mod === "base" && table === "role" && column_name === "menu_ids") {
      #>
      :tenant_ids="[ usrStore.tenant_id ]"<#
      }
      #>
      v-bind="listSelectProps"
    ></<#=Foreign_Table_Up#>List>
  </ListSelectDialog><#
    }
  #><#
    if (foreignKey && foreignKey.isLinkForeignTabs) {
  #>
  
  <<#=Foreign_Table_Up#>ForeignTabs
    ref="<#=foreignTable#>ForeignTabsRef"
  ></<#=Foreign_Table_Up#>ForeignTabs><#
  }
  #><#
  }
  #>
  
  <Detail
    ref="detailRef"
  ></Detail><#
    if (opts.noEdit !== true && opts.noAdd !== true && opts.noImport !== true) {
  #>
  
  <UploadFileDialog
    ref="uploadFileDialogRef"
  ></UploadFileDialog>
  
  <ImportPercentageDialog
    :percentage="importPercentage"
    :dialog_visible="isImporting"
    @cancel="cancelImport"
  ></ImportPercentageDialog><#
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

<script lang="ts" setup>
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
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
#><#
  if (foreignKey && foreignKey.multiple && foreignKey.showType === "dialog") {
#>
import <#=Foreign_Table_Up#>List from "../<#=foreignTable#>/List.vue";<#
  }
#><#
  if (foreignKey && foreignKey.isLinkForeignTabs) {
#>
import <#=Foreign_Table_Up#>ForeignTabs from "../<#=foreignTable#>/ForeignTabs.vue";<#
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
    if (hasDefault && opts.noEdit !== true) {
  #>
  defaultById,<#
    }
  #><#
    if (hasEnabled && opts.noEdit !== true) {
  #>
  enableByIds,<#
    }
  #><#
    if (hasLocked && opts.noEdit !== true) {
  #>
  lockByIds,<#
    }
  #><#
    if (opts.noExport !== true) {
  #>
  useExportExcel,<#
    }
  #><#
    if (opts.noEdit !== true) {
  #>
  updateById,<#
    }
  #><#
    if (opts.noEdit !== true && opts.noAdd !== true && opts.noImport !== true) {
  #>
  importModels,<#
    }
  #><#
    if (hasSummary) {
  #>
  findSummary,<#
    }
  #>
} from "./Api";

import {
  type <#=modelName#>,
  type <#=inputName#>,
  type <#=searchName#>,<#
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
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  foreignTableUpArr.push(Foreign_Table_Up);
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
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  get<#=Foreign_Table_Up#>List,<#
  }
  #>
} from "./Api";<#
}
#><#
if (hasForeignTabs > 0) {
#>

import ForeignTabs from "./ForeignTabs.vue";<#
}
#><#
let optionsName = table_comment;
if (list_tree) {
  optionsName = optionsName + "List";
}
#>

defineOptions({
  name: "<#=optionsName#>",
});

const {
  n,
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns
} = useI18n("/<#=mod#>/<#=table#>");

const usrStore = useUsrStore();
const permitStore = usePermitStore();

const permit = permitStore.getPermit("/<#=mod#>/<#=table#>");

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
  } as <#=searchName#>;
}

let search = $ref(initSearch());

/** 回收站 */
async function recycleChg() {
  selectedIds = [ ];
  await dataGrid(true);
}

/** 搜索 */
async function onSearch() {
  await dataGrid(true);
}

/** 刷新 */
async function onRefresh() {
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
async function onSearchClear() {
  await dataGrid(true);
}

/** 点击已选择 */
async function onIdsChecked() {
  await dataGrid(true);
}

const props = defineProps<{
  is_deleted?: string;
  showBuildIn?: string;
  isPagination?: string;
  isLocked?: string;
  ids?: string[]; //ids
  selectedIds?: string[]; //已选择行的id列表
  isMultiple?: Boolean; //是否多选<#
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
    if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz) {
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
      column_comment = ' // ' + column_comment;
    }
    /* if (!search) continue; */
  #><#
    if (foreignKey) {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#>
  <#=column_name#>_lbl?: <#=data_type#>;<#=column_comment#><#
    } else if (selectList && selectList.length > 0) {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#><#
    } else if (column.dict || column.dictbiz) {
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
  <#=column_name#>_like?: <#=data_type#>;<#=column_comment#><#
    }
  #><#
  }
  #>
}>();

const builtInSearchType: { [key: string]: string } = {
  is_deleted: "0|1",
  showBuildIn: "0|1",
  isPagination: "0|1",
  isLocked: "0|1",
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
  <#=column_name#>_lbl: "string[]",<#
    } else if ((selectList && selectList.length > 0 || column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(column.DATA_TYPE)) {
  #>
  <#=column_name#>: "number[]",
  <#=column_name#>_lbl: "string[]",<#
    } else if ((selectList && selectList.length > 0 || column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(column.DATA_TYPE)) {
  #>
  <#=column_name#>: "string[]",
  <#=column_name#>_lbl: "string[]",<#
    } else if ([ "int", "decimal", "tinyint" ].includes(column.DATA_TYPE)) {
  #>
  <#=column_name#>: "number",<#
  }
  #><#
  }
  #>
};

const propsNotInSearch: string[] = [
  "selectedIds",
  "isMultiple",
  "showBuildIn",
  "isPagination",
  "isLocked",
];

/** 内置搜索条件 */
const builtInSearch: <#=searchName#> = $(initBuiltInSearch(
  props,
  builtInSearchType,
  propsNotInSearch,
));

/** 内置变量 */
const builtInModel: <#=modelName#> = $(initBuiltInModel(
  props,
  builtInSearchType,
  propsNotInSearch,
));

/** 是否多选 */
const multiple = $computed(() => props.isMultiple !== false);
/** 是否显示内置变量 */
const showBuildIn = $computed(() => props.showBuildIn === "1");
/** 是否分页 */
const isPagination = $computed(() => !props.isPagination || props.isPagination === "1");
/** 是否只读模式 */
const isLocked = $computed(() => props.isLocked === "1");

/** 分页功能 */
let {
  page,<#
  if (list_page) {
  #>
  pageSizes,
  pgSizeChg,
  pgCurrentChg,
  onPageUp,
  onPageDown,<#
  }
  #>
} = $(usePage<<#=modelName#>>(
  dataGrid,
  {
    isPagination,
  },
));

/** 表格选择功能 */
let {
  selectedIds,
  selectChg,
  rowClassName,
  onRow,
  onRowUp,
  onRowDown,
  onRowLeft,
  onRowRight,
  onRowHome,
  onRowEnd,
} = $(useSelect<<#=modelName#>>(
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
async function onEmptySelected() {
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
let tableData = $ref<<#=modelName#>[]>([ ]);

function getTableColumns(): ColumnType[] {
  return [<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    if (column.noList) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "version") continue;
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
    if (column_type) {
      if (
        (column_type !== "int(1)" && column_type.startsWith("int"))
        || column_type.startsWith("decimal")
      ) {
        column.align = column.align || "right";
        column.width = column.width || 100;
      } else {
        column.align = column.align || "center";
      }
    } else {
      column.align = column.align || "center";
    }
    column.headerAlign = column.headerAlign || "center";
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
      #><#
      if (column.fixed !== undefined) {
      #>
      fixed: "<#=column.fixed#>",<#
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
      #><#
      if (column.fixed !== undefined) {
      #>
      fixed: "<#=column.fixed#>",<#
      }
      #>
    },<#
    } else if (selectList.length > 0 || foreignKey || column.dict || column.dictbiz
        || data_type === "date" || data_type === "datetime" || data_type === "timestamp"
      ) {
    #>
    {
      label: "<#=column_comment#>",
      prop: "<#=column_name#>_lbl",<#
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
      showOverflowTooltip: <#=column.showOverflowTooltip.toString()#>,<#
      }
      #><#
      if (column.fixed !== undefined) {
      #>
      fixed: "<#=column.fixed#>",<#
      }
      #>
    },<#
    } else {
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
      showOverflowTooltip: <#=column.showOverflowTooltip.toString()#>,<#
      }
      #><#
      if (column.fixed !== undefined) {
      #>
      fixed: "<#=column.fixed#>",<#
      }
      #>
    },<#
    }
    #><#
  }
  #>
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
} = $(useTableColumns<<#=modelName#>>(
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
}<#
if (list_page) {
#>

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
}<#
} else {
#>

async function useFindAll(
  opt?: GqlOpt,
) {
  const search2 = getDataSearch();
  tableData = await findAll(
    search2,
    undefined,
    [
      sort,
    ],
    opt,
  );
}<#
}
#>

async function useFindCount(
  opt?: GqlOpt,
) {
  const search2 = getDataSearch();
  page.total = await findCount(
    search2,
    opt,
  );
}<#
if (defaultSort && defaultSort.prop) {
#>

let sort: Sort = $ref({
  prop: "<#=defaultSort.prop#>",
  order: "<#=defaultSort.order || 'ascending'#>",
});<#
} else {
#>

let sort: Sort = $ref({
  prop: "",
  order: "ascending",
});<#
}
#>

/** 排序 */
async function onSortChange(
  { prop, order, column }: { column: TableColumnCtx<<#=modelName#>> } & Sort,
) {
  sort.prop = prop || "";
  sort.order = order || "ascending";
  await dataGrid();
}<#
  if (opts.noExport !== true) {
#>

let exportExcel = $ref(useExportExcel("/<#=mod#>/<#=table#>"));

/** 导出Excel */
async function onExport() {
  await exportExcel.workerFn(search, [ sort ]);
}

/** 取消导出Excel */
async function onCancelExport() {
  exportExcel.workerTerminate();
}<#
  }
#><#
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
  const columns: TableColumnCtx<<#=modelName#>>[] = summary.columns;
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
    dataGrid(true),<#
    if (hasSummary) {
    #>
    dataSummary(),<#
    }
    #>
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
}<#
  if (opts.noEdit !== true && opts.noAdd !== true && opts.noImport !== true) {
#>

let uploadFileDialogRef = $ref<InstanceType<typeof UploadFileDialog>>();

let importPercentage = $ref(0);
let isImporting = $ref(false);
let isCancelImport = $ref(false);

/** 弹出导入窗口 */
async function onImportExcel() {
  if (isLocked) {
    return;
  }
  if (!uploadFileDialogRef) {
    return;
  }
  const header: { [key: string]: string } = {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    if (column.noList) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "version") continue;
    const isPassword = column.isPassword;
    if (isPassword) continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    let column_name2 = column_name;
    if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz) {
      column_name2 = `${column_name}_lbl`;
    }
  #>
    [ n("<#=column_comment#>") ]: "<#=column_name2#>",<#
  }
  #>
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
    const models = await getExcelData<<#=inputName#>>(
      file,
      header,
      {
        date_keys: [<#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            if (column.noList) continue;
            const column_name = column.COLUMN_NAME;
            if (column_name === "id") continue;
            if (column_name === "version") continue;
            const data_type = column.DATA_TYPE;
            const isPassword = column.isPassword;
            if (isPassword) continue;
            let column_comment = column.COLUMN_COMMENT || "";
            let selectList = [ ];
            let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
            if (selectStr) {
              selectList = eval(`(${ selectStr })`);
            }
            if (column_comment.indexOf("[") !== -1) {
              column_comment = column_comment.substring(0, column_comment.indexOf("["));
            }
            if (![ "datetime", "date" ].includes(data_type)) {
              continue;
            }
          #>
          n("<#=column_comment#>"),<#
          }
          #>
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
}<#
  }
#><#
}
#><#
if (opts.noEdit !== true) {
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  if (column.noList) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (column_name === "version") continue;
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
  if (!column.isSwitch) {
    continue;
  }
#><#
if (column_name === "is_default") {
#>

/** <#=column_comment#> */
async function <#=column_name#>Chg(id: string) {
  if (isLocked) {
    return;
  }
  const notLoading = true;
  await defaultById(
    id,
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
}<#
} else if (column_name === "is_enabled") {
#>

/** <#=column_comment#> */
async function <#=column_name#>Chg(id: string, <#=column_name#>: 0 | 1) {
  if (isLocked) {
    return;
  }
  const notLoading = true;
  await enableByIds(
    [ id ],
    <#=column_name#>,
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
}<#
} else if (column_name === "is_locked") {
#>

/** <#=column_comment#> */
async function <#=column_name#>Chg(id: string, <#=column_name#>: 0 | 1) {
  if (isLocked) {
    return;
  }
  const notLoading = true;
  await lockByIds(
    [ id ],
    <#=column_name#>,
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
}<#
} else {
#>

/** <#=column_comment#> */
async function <#=column_name#>Chg(id: string, <#=column_name#>: 0 | 1) {
  if (isLocked) {
    return;
  }
  const notLoading = true;
  await updateById(
    id,
    {
      <#=column_name#>,
    },
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
}<#
}
#><#
}
#>

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
    dataGrid(),<#
    if (hasSummary) {
    #>
    dataSummary(),<#
    }
    #>
  ]);
  emit("edit", changedIds);
}<#
}
#>

/** 键盘回车按键 */
async function onRowEnter(e: KeyboardEvent) {
  if (e.ctrlKey) {<#
    if (opts.noEdit !== true) {
    #>
    await openEdit();<#
    }
    #>
  } else if (e.shiftKey) {<#
    if (opts.noAdd !== true) {
    #>
    await openCopy();<#
    }
    #>
  } else {
    await openView();
  }
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
    dataGrid(),<#
    if (hasSummary) {
    #>
    dataSummary(),<#
    }
    #>
  ]);
  emit("edit", changedIds);
}<#
if (opts.noDelete !== true) {
#>

/** 点击删除 */
async function onDeleteByIds() {
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
      dataGrid(true),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
    ]);
    ElMessage.success(await nsAsync("删除 {0} 条数据成功", num));
    emit("remove", num);
  }
}

/** 点击彻底删除 */
async function onForceDeleteByIds() {
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
  if (hasEnabled && opts.noEdit !== true) {
#>

/** 点击启用或者禁用 */
async function onEnableByIds(is_enabled: 0 | 1) {
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
}<#
}
#><#
  if (hasLocked && opts.noEdit !== true) {
#>

/** 点击锁定或者解锁 */
async function onLockByIds(is_locked: 0 | 1) {
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
}<#
}
#><#
if (opts.noDelete !== true && opts.noRevert !== true) {
#>

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
      dataGrid(true),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
    ]);
    ElMessage.success(await nsAsync("还原 {0} 条数据成功", num));
    emit("revert", num);
  }
}<#
}
#><#
if (hasForeignTabs > 0) {
#>

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
}<#
}
#>

/** 初始化ts中的国际化信息 */
async function initI18nsEfc() {
  const codes: string[] = [<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    if (column.noList) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "version") continue;
    const isPassword = column.isPassword;
    if (isPassword) continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
  #>
    "<#=column_comment#>",<#
  }
  #>
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
    dataGrid(true),<#
    if (hasSummary) {
    #>
    dataSummary(),<#
    }
    #>
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
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
#><#
  if (foreignKey && foreignKey.multiple && foreignKey.showType === "dialog") {
#>

let <#=column_name#>ListSelectDialogRef = $ref<InstanceType<typeof ListSelectDialog>>();

async function on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(row: <#=modelName#>) {
  if (!<#=column_name#>ListSelectDialogRef) {
    return;
  }
  row.<#=column_name#> = row.<#=column_name#> || [ ];
  let {
    selectedIds: selectedIds2,
    action
  } = await <#=column_name#>ListSelectDialogRef.showDialog({
    selectedIds: row.<#=column_name#> as string[],<#
    if (hasLocked) {
    #>
    isLocked: row.is_locked == 1,<#
    } else {
    #>
    isLocked: false,<#
    }
    #>
  });
  if (isLocked) {
    return;
  }
  if (action !== "select") {
    return;
  }
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
  if (isEqual) {
    return;
  }
  row.<#=column_name#> = selectedIds2;
  await updateById(row.id, { <#=column_name#>: selectedIds2 });
  await dataGrid();
}<#
  }
#><#
  if (foreignKey && foreignKey.isLinkForeignTabs) {
#>

let <#=foreignTable#>ForeignTabsRef = $ref<InstanceType<typeof <#=Foreign_Table_Up#>ForeignTabs> | undefined>();

async function open<#=Foreign_Table_Up#>ForeignTabs(id: string, title: string) {
  await <#=foreignTable#>ForeignTabsRef?.showDialog({
    title,
    isLocked: $$(isLocked),
    model: {
      id,
    },
  });
}<#
  }
#><#
}
#>

defineExpose({
  refresh: onRefresh,
});
</script>
