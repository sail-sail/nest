<#
const hasSummary = columns.some((column) => column.showSummary && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsMonth = columns.some((column) => column.isMonth);
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
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
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
}
const hasForeignTabs = columns.some((item) => item.foreignTabs?.length > 0);
const hasForeignTabsButton = columns.some((item) => {
  if (!item.foreignTabs) {
    return false;
  }
  if (item.foreignTabs.length === 0) {
    return false;
  }
  return item.foreignTabs.some((item2) => {
    return item2.linkType === "button";
  });
});
const hasForeignTabsMore = columns.some((item) => {
  if (!item.foreignTabs) {
    return false;
  }
  if (item.foreignTabs.length === 0) {
    return false;
  }
  return item.foreignTabs.some((item2) => {
    return item2.linkType === "more";
  });
});
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
        if (column_name === "version") continue;
        if (column_name === "is_deleted") continue;
        if (column_name === "tenant_id") continue;
        if (column_name === "org_id") continue;
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
        let foreignSchema = undefined;
        if (foreignKey) {
          foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
        }
      #><#
        if (search) {
      #>
      <#
      if (column.isImg) {
      #><#
      } else if (foreignSchema && foreignSchema.opts?.list_tree
        && !foreignSchema.opts?.ignoreCodegen
        && !foreignSchema.opts?.onlyCodegenDeno
        && typeof opts?.list_tree !== "string"
      ) {
      #>
      <template v-if="showBuildIn || builtInSearch?.<#=column_name#> == null">
        <el-form-item
          label="<#=column_comment#>"
          prop="<#=column_name#>"
        >
          <CustomTreeSelect
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            v-model="search.<#=column_name#>"
            :method="get<#=Foreign_Table_Up#>Tree"
            :options-map="((item: <#=Foreign_Table_Up#>Model) => {
              return {
                label: item.<#=foreignKey.lbl#>,
                value: item.<#=foreignKey.column#>,
              };
            })"
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
            multiple
            @change="onSearch"
          ></CustomTreeSelect>
        </el-form-item>
      </template><#
      } else if (foreignSchema && foreignSchema.opts?.list_tree
        && !foreignSchema.opts?.ignoreCodegen
        && !foreignSchema.opts?.onlyCodegenDeno
        && typeof opts?.list_tree === "string"
      ) {
      #>
      <template v-if="showBuildIn || builtInSearch?.<#=column_name#> == null">
        <el-form-item
          label="<#=column_comment#>"
          prop="<#=column_name#>"
        >
          <CustomTreeSelect
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            v-model="search.<#=column_name#>"
            :method="get<#=Foreign_Table_Up#>Tree"
            :options-map="((item: <#=Foreign_Table_Up#>Model) => {
              return {
                label: item.<#=foreignKey.lbl#>,
                value: item.<#=foreignKey.column#>,
              };
            })"
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
            :check-strictly="false"
            multiple
            @change="onSearch"
          ></CustomTreeSelect>
        </el-form-item>
      </template><#
      } else if (foreignKey) {
      #>
      <template v-if="showBuildIn || builtInSearch?.<#=column_name#> == null">
        <el-form-item
          label="<#=column_comment#>"
          prop="<#=column_name#>"
        >
          <CustomSelect
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
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
        ><#
          if (column.searchMultiple !== false) {
          #>
          <DictSelect
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            :model-value="search.<#=column_name#>"
            @update:model-value="search.<#=column_name#> = $event"
            code="<#=column.dict#>"
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
            multiple
            @change="onSearch"
          ></DictSelect><#
          } else {
          #>
          <DictSelect
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            :model-value="search.<#=column_name#>[0]"
            @update:model-value="$event != null ? search.<#=column_name#> = [ $event ] : search.<#=column_name#> = [ ]"
            code="<#=column.dict#>"
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
            @change="onSearch"
          ></DictSelect><#
          }
          #>
        </el-form-item>
      </template><#
      } else if (column.dictbiz) {
      #>
      <template v-if="showBuildIn || builtInSearch?.<#=column_name#> == null">
        <el-form-item
          :label="n('<#=column_comment#>')"
          prop="<#=column_name#>"
        ><#
          if (column.searchMultiple !== false) {
          #>
          <DictbizSelect
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            un-w="full"
            :model-value="search.<#=column_name#>"
            @update:model-value="search.<#=column_name#> = $event"
            code="<#=column.dictbiz#>"
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
            multiple
            @change="onSearch"
          ></DictbizSelect><#
          } else {
          #>
          <DictbizSelect
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"
            :model-value="search.<#=column_name#>[0]"
            @update:model-value="$event != null ? search.<#=column_name#> = [ $event ] : search.<#=column_name#> = [ ]"
            code="<#=column.dictbiz#>"
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
            multiple
            @change="onSearch"
          ></DictbizSelect><#
          }
          #>
        </el-form-item>
      </template><#
      } else if (data_type === "datetime" || data_type === "date") {
      #>
      <template v-if="showBuildIn || builtInSearch?.<#=column_name#> == null">
        <el-form-item
          :label="n('<#=column_comment#>')"
          prop="<#=column_name#>"
        >
          <CustomDatePicker
            :set="search.<#=column_name#> = search.<#=column_name#> || [ ]"<#
            if (column.isMonth) {
            #>
            type="monthrange"<#
            } else {
            #>
            type="daterange"<#
            }
            #>
            :model-value="(search.<#=column_name#> as any)"
            :start-placeholder="ns('开始')"
            :end-placeholder="ns('结束')"
            format="YYYY-MM-DD"
            :default-time="[ new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59) ]"<#
            if (column.isMonth) {
            #>
            @update:model-value="monthrangeSearch(search, '<#=column_name#>', $event)"<#
            } else {
            #>
            @update:model-value="search.<#=column_name#> = $event"<#
            }
            #>
            @clear="onSearchClear"
            @change="onSearch"
          ></CustomDatePicker>
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
          <div
            un-flex="~"
            un-w="full"
            un-gap="x-1"
            class="searchform_number_range"
            :set="search.<#=column_name#> = search.<#=column_name#> ?? [ ]"
          >
            <CustomInputNumber
              un-flex="[1_0_0]"
              v-model="search.<#=column_name#>[0]"
              @clear="onSearchClear"
              :placeholder="ns('最小值')"
              @change="() => {
                search.<#=column_name#> = search.<#=column_name#> ?? [ ];
                if (search.<#=column_name#>[1] == null) {
                  search.<#=column_name#>[1] = search.<#=column_name#>[0];
                }
              }"
            ></CustomInputNumber>
            <CustomInputNumber
              un-flex="[1_0_0]"
              v-model="search.<#=column_name#>[1]"
              @clear="onSearchClear"
              :placeholder="ns('最大值')"
              @change="() => {
                search.<#=column_name#> = search.<#=column_name#> ?? [ ];
                if (search.<#=column_name#>[0] == null) {
                  search.<#=column_name#>[0] = search.<#=column_name#>[1];
                }
              }"
            ></CustomInputNumber>
          </div>
        </el-form-item>
      </template><#
      } else {
      #>
      <template v-if="builtInSearch?.<#=column_name#> == null && (showBuildIn || builtInSearch?.<#=column_name#>_like == null)">
        <el-form-item
          :label="n('<#=column_comment#>')"
          prop="<#=column_name#>_like"
        >
          <CustomInput
            v-model="search.<#=column_name#>_like"
            :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"
            @clear="onSearchClear"
          ></CustomInput>
        </el-form-item>
      </template><#
      }
      #><#
        }
      }
      #>
      
      <el-form-item
        label=" "
        prop="idsChecked"
      >
        <div
          un-flex="~ nowrap"
          un-justify-between
          un-w="full"
        >
          <div
            un-flex="~ nowrap"
            un-items-center
            un-gap="x-1.5"
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
                v-if="selectedIds.length > 0"
                un-m="l-0.5"
                un-text="blue"
              >
                {{ selectedIds.length }}
              </span>
            </el-checkbox>
            <el-icon
              v-show="selectedIds.length > 0"
              :title="ns('清空已选择')"
              un-cursor-pointer
              un-text="hover:red"
              @click="onEmptySelected"
            >
              <ElIconRemove />
            </el-icon>
          </div><#
          if ((opts.noDelete !== true && opts.noRevert !== true) && hasIsDeleted) {
          #>
          
          <el-checkbox
            v-if="!isLocked"
            :set="search.is_deleted = search.is_deleted ?? 0"
            v-model="search.is_deleted"
            :false-label="0"
            :true-label="1"
            @change="recycleChg"
          >
            <span>{{ ns('回收站') }}</span>
          </el-checkbox><#
          }
          #>
        </div>
      </el-form-item>
      
      <el-form-item
        label=" "
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
          @click="onSearchReset"
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
        v-if="permit('add') && !isLocked"
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
        v-if="permit('add') && !isLocked"
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
          <ElIconReading />
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
      </el-button><#
      if (hasForeignTabsButton) {
        let label = "";
        for (let ii = 0; ii < columns.length; ii++) {
          const column = columns[ii];
          if (!column.foreignTabs) {
            continue;
          }
          if (column.foreignTabs.length === 0) {
            continue;
          }
          for (let iii = 0; iii < column.foreignTabs.length; iii++) {
            const foreignTab = column.foreignTabs[iii];
            if (foreignTab.linkType !== "button") {
              continue;
            }
            label = foreignTab.label;
            break;
          }
        }
      #>
      
      <el-button
        plain
        @click="onOpenForeignTabs"
      >
        <template #icon>
          <ElIconTickets />
        </template>
        <span>{{ ns('<#=label#>') }}</span>
      </el-button><#
      }
      #>
      
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
              v-if="permit('add') && !isLocked"
              un-justify-center
              @click="onImportExcel"
            >
              <span>{{ ns('导入') }}</span>
            </el-dropdown-item><#
              }
            #><#
              if (hasEnabled && opts.noEdit !== true && !columns.find((item) => item.COLUMN_NAME === "is_enabled").readonly) {
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
              if (hasLocked && opts.noEdit !== true && !columns.find((item) => item.COLUMN_NAME === "is_locked").readonly) {
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
            #><#
            if (hasForeignTabsMore) {
              let label = "";
              for (let ii = 0; ii < columns.length; ii++) {
                const column = columns[ii];
                if (!column.foreignTabs) {
                  continue;
                }
                if (column.foreignTabs.length === 0) {
                  continue;
                }
                for (let iii = 0; iii < column.foreignTabs.length; iii++) {
                  const foreignTab = column.foreignTabs[iii];
                  if (foreignTab.linkType !== "more") {
                    continue;
                  }
                  label = foreignTab.label;
                  break;
                }
              }
            #>
            
            <el-dropdown-item
              un-justify-center
              @click="onOpenForeignTabs"
            >
              <span>{{ ns('<#=label#>') }}</span>
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
        @click="onRevertByIds"
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
        @click="openView"
      >
        <template #icon>
          <ElIconReading />
        </template>
        <span>{{ ns('查看') }}</span>
      </el-button>
      
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
            un-whitespace-nowrap
          >
            
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
            </el-dropdown-item>
            
          </el-dropdown-menu>
        </template>
      </el-dropdown><#
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
        :default-sort="defaultSort"
        :empty-text="inited ? undefined : ns('加载中...')"<#
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
        @row-dblclick="onRowDblclick"
        @keydown.escape="onEmptySelected"<#
        if (opts.noDelete !== true) {
        #>
        @keydown.ctrl.delete.stop="onDeleteByIds"<#
        }
        #>
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
        #><#
        if (opts.noAdd !== true) {
        #>
        @keydown.ctrl.i="onInsert"<#
        }
        #>
      >
        
        <el-table-column
          prop="id"
          type="selection"
          align="center"
          width="50"<#
          if (opts?.tableSelectable) {
          #>
          :selectable="tableSelectable"<#
          }
          #>
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
            if (column_name === "is_deleted") continue;
            if (column_name === "tenant_id") continue;
            if (column_name === "org_id") continue;
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
                  un-h="8"
                ></LinkImage>
              </template>
            </el-table-column>
          </template><#
            } else if (data_type === "decimal") {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop && (showBuildIn || builtInSearch?.<#=column_name#> == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
            </el-table-column>
          </template><#
            } else if (column.isEncrypt) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            ><#
              if (foreignTabs.some((item) => item.linkType === "link" || item.linkType === undefined)) {
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
                  @change="updateById(
                    row.id,
                    {<#
                      if (hasVersion) {
                      #>
                      version: row.version,<#
                      }
                      #>
                      order_by: row.order_by,
                    },
                    { notLoading: true },
                  )"
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
            } else if (selectList.length > 0 || column.dict || column.dictbiz
              || data_type === "date" || data_type === "datetime" || data_type === "timestamp"
            ) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>_lbl' === col.prop && (showBuildIn || builtInSearch?.<#=column_name#> == null)">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            ><#
              if (foreignTabs.some((item) => item.linkType === "link" || item.linkType === undefined)) {
              #>
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  @click="openForeignTabs(row.id, row[column.property])"
                >
                  {{ row[column.property] }}
                </el-link>
              </template><#
              } else if(column.isSwitch && opts.noEdit !== true && !column.readonly && column_name === "is_default") {
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
                  @change="on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(row.id)"
                ></CustomSwitch>
              </template><#
              } else if(column.isSwitch && opts.noEdit !== true && !column.readonly) {
              #>
              <template #default="{ row }">
                <CustomSwitch
                  v-if="permit('edit')<#
                  if (hasLocked && column_name !== "is_locked") {
                  #> && row.is_locked !== 1<#
                  }
                  #> && row.is_deleted !== 1 && !isLocked"
                  v-model="row.<#=column_name#>"
                  @change="on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(row.id, row.<#=column_name#>)"
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
              if (foreignTabs.some((item) => item.linkType === "link" || item.linkType === undefined)) {
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
    if (column_name === "version") continue;
    if (column_name === "is_deleted") continue;
    if (column_name === "tenant_id") continue;
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
    const many2many = column.many2many;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let foreignSchema = undefined;
    if (foreignKey) {
      foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
      if (foreignSchema.opts?.ignoreCodegen || foreignSchema.opts?.onlyCodegenDeno) {
        continue;
      }
    }
  #><#
    if (
      (foreignKey && foreignKey.multiple && foreignKey.showType === "dialog")
      && (foreignKey && ([ "selectType", "select" ].includes(foreignKey.selectType) || !foreignKey.selectType))
      && !(foreignSchema && foreignSchema.opts?.list_tree)
    ) {
  #>
  
  <!-- <#=column_comment#> -->
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
      #><#
      if (hasEnabled) {
      #>
      is_enabled="1"<#
      }
      #>
      v-bind="listSelectProps"
    ></<#=Foreign_Table_Up#>List>
  </ListSelectDialog><#
    } else if (
      (foreignKey && foreignKey.multiple && foreignKey.showType === "dialog")
      && (foreignSchema && foreignSchema.opts?.list_tree)
    ) {
  #>
  
  <!-- <#=column_comment#> -->
  <ListSelectDialog
    ref="<#=column_name#>ListSelectDialogRef"
    :is-locked="isLocked"
    v-slot="listSelectProps"
  >
    <<#=Foreign_Table_Up#>TreeList<#
      if (mod === "base" && table === "role" && column_name === "menu_ids") {
      #>
      :tenant_ids="[ usrStore.tenant_id ]"<#
      }
      #><#
      if (hasEnabled) {
      #>
      is_enabled="1"<#
      }
      #>
      v-bind="listSelectProps"
    ></<#=Foreign_Table_Up#>TreeList>
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
    @download-import-template="onDownloadImportTemplate"
  ></UploadFileDialog>
  
  <ImportPercentageDialog
    :percentage="importPercentage"
    :dialog_visible="isImporting"
    @stop="stopImport"
  ></ImportPercentageDialog><#
    }
  #><#
  if (hasForeignTabs) {
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
if (hasIsMonth) {
#>

import {
  monthrangeSearch,
} from "@/compositions/List";<#
}
#><#
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
  const foreignKey = column.foreignKey;
  const many2many = column.many2many;
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  let foreignSchema = undefined;
  if (foreignKey) {
    foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    if (foreignSchema.opts?.ignoreCodegen || foreignSchema.opts?.onlyCodegenDeno) {
      continue;
    }
  }
#><#
  if (
    (foreignKey && foreignKey.multiple && foreignKey.showType === "dialog")
    && (foreignKey && ([ "selectType", "select" ].includes(foreignKey.selectType) || !foreignKey.selectType))
    && !(foreignSchema && foreignSchema.opts?.list_tree)
  ) {
#>

import <#=Foreign_Table_Up#>List from "../<#=foreignTable#>/List.vue";<#
  } else if (
    (foreignKey && foreignKey.multiple && foreignKey.showType === "dialog")
    && (foreignSchema && foreignSchema.opts?.list_tree && foreignSchema.opts?.list_tree)
  ) {
#>

import <#=Foreign_Table_Up#>TreeList from "../<#=foreignTable#>/TreeList.vue";<#
  }
#><#
  if (foreignKey && foreignKey.isLinkForeignTabs) {
#>
import <#=Foreign_Table_Up#>ForeignTabs from "../<#=foreignTable#>/ForeignTabs.vue";<#
  }
#><#
}
#>

import type {
  <#=Table_Up#>Id,
} from "@/typings/ids";

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
  importModels,
  useDownloadImportTemplate,<#
    }
  #><#
    if (hasSummary) {
  #>
  findSummary,<#
    }
  #>
} from "./Api";

import type {
  <#=modelName#>,<#
  if (opts.noEdit !== true && opts.noAdd !== true && opts.noImport !== true) {
  #>
  <#=inputName#>,<#
  }
  #>
  <#=searchName#>,<#
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
  const search = column.search;
  if (!search) {
    continue;
  }
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  foreignTableUpArr.push(Foreign_Table_Up);
#>
  <#=Foreign_Table_Up#>Model,<#
}
#><#
}
#>
} from "#/types";<#
const foreignTableArr = [ ];
const column_commentArr = [ ];
const foreignKeyArr = [ ];
const foreignKeyCommentArr = [ ];
const foreignKeyArrColumns = [ ];
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
      foreignKeyArrColumns.push(column);
    }
  }
}
#><#
if (
  foreignKeyArrColumns.some((item) => {
    const foreignKey = item.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    if (foreignSchema && foreignSchema.opts?.list_tree) {
      return false;
    }
    return true;
  })
) {
#>

import {<#
  for (let i = 0; i < foreignTableArr.length; i++) {
    const foreignTable = foreignTableArr[i];
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const column_comment = foreignKeyCommentArr[i];
    const column = foreignKeyArrColumns[i];
    const foreignKey = column.foreignKey;
    const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    if (foreignSchema && foreignSchema.opts?.list_tree) {
      continue;
    }
  #>
  get<#=Foreign_Table_Up#>List, // <#=column_comment#><#
  }
  #>
} from "./Api";<#
}
#><#
const foreignTableArr3 = [];
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
  if (column.noAdd && column.noEdit) {
    continue;
  }
  const foreignKey = column.foreignKey;
  if (!foreignKey) {
    continue;
  }
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
  if (!foreignSchema) {
    continue;
  }
  if (foreignSchema.opts?.ignoreCodegen || foreignSchema.opts?.onlyCodegenDeno) {
    continue;
  }
  if (!foreignSchema.opts?.list_tree) {
    continue;
  }
  if (!column.search) {
    continue;
  }
  if (foreignTableArr3.includes(foreignTable)) continue;
  foreignTableArr3.push(foreignTable);
#>

import {
  get<#=Foreign_Table_Up#>Tree,
} from "@/views/<#=foreignKey.mod#>/<#=foreignTable#>/Api";<#
}
#><#
if (hasForeignTabs) {
#>

import ForeignTabs from "./ForeignTabs.vue";<#
}
#><#
if (opts?.isRealData) {
#>

import {
  publish,
} from "@/compositions/websocket";<#
}
#>

<#
let optionsName = table_comment;
if (list_tree) {
  optionsName = optionsName + "List";
}
#>defineOptions({
  name: "<#=optionsName#>",
});

const pagePath = "/<#=mod#>/<#=table#>";
const pageName = getCurrentInstance()?.type?.name as string;

const {
  n,
  nAsync,
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns
} = useI18n(pagePath);

const usrStore = useUsrStore();
const permitStore = usePermitStore();
const dirtyStore = useDirtyStore();

const clearDirty = dirtyStore.onDirty(onRefresh, pageName);

const permit = permitStore.getPermit(pagePath);

let inited = $ref(false);

const emit = defineEmits<{
  selectedIdsChg: [ <#=Table_Up#>Id[] ],
  add: [ <#=Table_Up#>Id[] ],
  edit: [ <#=Table_Up#>Id[] ],
  remove: [ number ],
  revert: [ number ],
  refresh: [ ],
  beforeSearchReset: [ ],
  rowEnter: [ KeyboardEvent? ],
  rowDblclick: [ <#=modelName#> ],
}>();

/** 表格 */
let tableRef = $ref<InstanceType<typeof ElTable>>();<#
if (opts?.isRealData) {
#>

useSubscribeList<<#=Table_Up#>Id>(
  pagePath,
  async function(data) {
    const action = data.action;
    if (action === "add") {
      await dataGrid(true);
      return;
    }
    if (action === "edit") {
      const id = data.id;
      if (tableData.some((model) => model.id === id)) {
        await dataGrid();
      }
      return;
    }
    if (action === "delete") {
      const ids = data.ids;
      selectedIds = selectedIds.filter((id) => !ids.includes(id));
      await dataGrid(true);
      return;
    }
    if (action === "import") {
      await dataGrid(true);
      return;
    }
    if (action === "revert") {
      await dataGrid(true);
      return;
    }
    if (action === "forceDelete") {
      if (search.is_deleted === 1) {
        await dataGrid(true);
      }
      return;
    }
  },
);<#
}
#>

/** 搜索 */
function initSearch() {
  return {<#
    if (hasIsDeleted) {
    #>
    is_deleted: 0,<#
    }
    #><#
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
  tableFocus();
  selectedIds = [ ];
  await dataGrid(true);
}

/** 搜索 */
async function onSearch() {
  tableFocus();
  await dataGrid(true);
}

/** 刷新 */
async function onRefresh() {
  tableFocus();
  emit("refresh");
  await dataGrid(true);
}

let isSearchReset = $ref(false);

/** 重置搜索 */
async function onSearchReset() {
  tableFocus();
  isSearchReset = true;
  search = initSearch();
  idsChecked = 0;
  resetSelectedIds();
  emit("beforeSearchReset");
  await nextTick();
  await dataGrid(true);
  isSearchReset = false;
}

/** 清空搜索框事件 */
async function onSearchClear() {
  tableFocus();
  await dataGrid(true);
}

/** 点击已选择 */
async function onIdsChecked() {
  tableFocus();
  await dataGrid(true);
}

const props = defineProps<{<#
  if (hasIsDeleted) {
  #>
  is_deleted?: string;<#
  }
  #>
  showBuildIn?: string;
  isPagination?: string;
  isLocked?: string;
  isFocus?: string;
  ids?: string[]; //ids
  selectedIds?: <#=Table_Up#>Id[]; //已选择行的id列表
  isMultiple?: Boolean; //是否多选<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "version") continue;
    if ([
      "create_usr_id",
      "create_time",
      "update_usr_id",
      "update_time",
      "tenant_id",
      "org_id",
      "is_hidden",
      "is_deleted",
    ].includes(column_name)) continue;
    let is_nullable = column.IS_NULLABLE === "YES";
    let data_type = column.DATA_TYPE;
    let column_type = column.DATA_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const search = column.search;
    let _data_type = "string";
    if (column_name === 'id') {
      data_type = `${ Table_Up }Id`;
    }
    else if (foreignKey && foreignKey.multiple) {
      data_type = `${ foreignTable_Up }Id[]`;
      _data_type = "string[]";
      is_nullable = true;
    }
    else if (foreignKey && !foreignKey.multiple) {
      data_type = `${ foreignTable_Up }Id`;
      _data_type = "string";
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
  #><#
    if (foreignKey) {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#>
  <#=column_name#>_lbl?: <#=_data_type#>;<#=column_comment#><#
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
  #><#
    if (!column.isEncrypt) {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#>
  <#=column_name#>_like?: <#=data_type#>;<#=column_comment#><#
    }
  #><#
    }
  #><#
  }
  #>
}>();

const builtInSearchType: { [key: string]: string } = {<#
  if (hasIsDeleted) {
  #>
  is_deleted: "0|1",<#
  }
  #>
  showBuildIn: "0|1",
  isPagination: "0|1",
  isLocked: "0|1",
  isFocus: "0|1",
  ids: "string[]",<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "version") continue;
    if (column_name === "is_deleted") continue;
    if (column_name === "tenant_id") continue;
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
  "isFocus",
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
/** 是否 focus, 默认为 true */
const isFocus = $computed(() => props.isFocus !== "0");

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
));<#
if (opts?.tableSelectable) {
#>
function tableSelectable(model: <#=modelName#>, index: number) {<#=opts?.tableSelectable#>
}<#
}
#>

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
  tableFocus,
} = $(useSelect<<#=modelName#>, <#=Table_Up#>Id>(
  $$(tableRef),
  {
    multiple: $$(multiple),<#
    if (opts?.tableSelectable) {
    #>
    tableSelectable,<#
    }
    #>
  },
));<#
if (opts?.tableSelectable) {
#>

useSubscribeList<<#=Table_Up#>Id>(
  $$(tableRef),
  pagePath,
  dataGrid,
);<#
}
#>

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
  selectedIds = [ ];
}

/** 取消已选择筛选 */
async function onEmptySelected() {
  tableFocus();
  resetSelectedIds();
  if (idsChecked === 1) {
    idsChecked = 0;
    await dataGrid(true);
  }
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
    if (column_name === "is_deleted") continue;
    if (column_name === "tenant_id") continue;
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
      prop: "<#=column_name#>_lbl",
      sortBy: "<#=column_name#>",<#
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
  clearDirty();
  if (isCount) {
    await Promise.all([
      useFindAll(opt),
      useFindCount(opt),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
    ]);
  } else {
    await Promise.all([
      useFindAll(opt),<#
      if (hasSummary) {
      #>
      dataSummary(),<#
      }
      #>
    ]);
  }
}

function getDataSearch() {<#
  if (hasIsDeleted) {
  #>
  const is_deleted = search.is_deleted;<#
  }
  #>
  const search2 = {
    ...search,
    idsChecked: undefined,
  };
  if (!showBuildIn) {
    Object.assign(search2, builtInSearch);
  }<#
  if (hasIsDeleted) {
  #>
  search2.is_deleted = is_deleted;<#
  }
  #>
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

const defaultSort: Sort = {
  prop: "<#=defaultSort.prop#>",
  order: "<#=defaultSort.order || 'ascending'#>",
};<#
} else {
#>

const defaultSort: Sort = {
  prop: "",
  order: "ascending",
};<#
}
#>

let sort = $ref<Sort>({
  ...defaultSort,
});

/** 排序 */
async function onSortChange(
  { prop, order, column }: { column: TableColumnCtx<<#=modelName#>> } & Sort,
) {
  if (!order) {
    sort = {
      ...defaultSort,
    };
    await dataGrid();
    return;
  }
  let prop2 = "";
  if (Array.isArray(column.sortBy)) {
    prop2 = column.sortBy[0];
  } else {
    prop2 = (column.sortBy as string) || prop || "";
  }
  sort.prop = prop2;
  sort.order = order || "ascending";
  await dataGrid();
}<#
  if (opts.noExport !== true) {
#>

let exportExcel = $ref(useExportExcel(pagePath));

/** 导出Excel */
async function onExport() {
  const search2 = getDataSearch();
  await exportExcel.workerFn(
    search2,
    [
      sort,
    ],
  );
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
      val = `合计: ${ val }`;
    }
    sums.push(val);
  }
  return sums;
}<#
}
#><#
if (opts.noAdd !== true) {
#>

/** 打开新增页面 */
async function openAdd() {
  if (isLocked) {
    return;
  }
  if (!detailRef) {
    return;
  }
  if (!permit("add")) {
    ElMessage.warning(await nsAsync("无权限"));
    return;
  }
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("新增") + await nsAsync("<#=table_comment#>"),
    action: "add",
    builtInModel,
    showBuildIn: $$(showBuildIn),
  });
  tableFocus();
  if (changedIds.length === 0) {
    return;
  }
  selectedIds = [
    ...changedIds,
  ];
  dirtyStore.fireDirty(pageName);
  await dataGrid(true);
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
  if (!permit("add")) {
    ElMessage.warning(await nsAsync("无权限"));
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要 复制 的数据"));
    return;
  }
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("复制") + await nsAsync("<#=table_comment#>"),
    action: "copy",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    model: {
      id: selectedIds[selectedIds.length - 1],
    },
  });
  tableFocus();
  if (changedIds.length === 0) {
    return;
  }
  selectedIds = [
    ...changedIds,
  ];
  dirtyStore.fireDirty(pageName);
  await dataGrid(true);
  emit("add", changedIds);
}

/** 打开新增或复制页面, 未选择任何行则为新增, 选中一行为复制此行 */
async function onInsert() {
  if (isLocked) {
    return;
  }
  await openAdd();
}<#
  if (opts.noEdit !== true && opts.noAdd !== true && opts.noImport !== true) {
#>

let uploadFileDialogRef = $ref<InstanceType<typeof UploadFileDialog>>();

let importPercentage = $ref(0);
let isImporting = $ref(false);
let isStopImport = $ref(false);

const downloadImportTemplate = $ref(useDownloadImportTemplate(pagePath));

/**
 * 下载导入模板
 */
async function onDownloadImportTemplate() {
  await downloadImportTemplate.workerFn();
}

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
    if (column_name === "is_deleted") continue;
    if (column_name === "tenant_id") continue;
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
    const foreignKey = column.foreignKey;
    if (
      [
        "create_usr_id", "create_time", "update_usr_id", "update_time",
        "is_default",
      ].includes(column_name)
      || column.readonly
    ) {
      continue;
    }
    let column_name2 = column_name;
    if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
      || data_type === "date" || data_type === "datetime" || data_type === "timestamp"
    ) {
      column_name2 = `${column_name}_lbl`;
    }
  #>
    [ await nAsync("<#=column_comment#>") ]: "<#=column_name2#>",<#
  }
  #>
  };
  const file = await uploadFileDialogRef.showDialog({
    title: await nsAsync("批量导入"),
    accept: ".xlsx",
  });
  tableFocus();
  if (!file) {
    return;
  }
  isStopImport = false;
  isImporting = true;
  importPercentage = 0;
  let msg: VNode | undefined = undefined;
  let succNum = 0;
  try {
    const messageHandler = ElMessage.info(await nsAsync("正在导入..."));
    const models = await getExcelData<<#=inputName#>>(
      file,
      header,
      {
        key_types: {<#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            if (column.noList) continue;
            const column_name = column.COLUMN_NAME;
            if (column_name === "id") continue;
            if (column_name === "version") continue;
            if (column_name === "is_deleted") continue;
            if (column_name === "tenant_id") continue;
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
            const foreignKey = column.foreignKey;
            if (
              [
                "create_usr_id", "create_time", "update_usr_id", "update_time",
                "is_default",
              ].includes(column_name)
              || column.readonly
            ) {
              continue;
            }
            let column_name2 = column_name;
            if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
              || data_type === "date" || data_type === "datetime" || data_type === "timestamp"
            ) {
              column_name2 = `${column_name}_lbl`;
            }
            let data_type2 = "string";
            if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz) {
              data_type2 = "string";
            } else if ([ "datetime", "date" ].includes(data_type)) {
              data_type2 = "date";
            } else if (data_type === "int" || data_type === "tinyint" || data_type === "double") {
              data_type2 = "number";
            } else if (data_type === "varchar" || data_type === "text" || data_type === "char" || data_type === "decimal") {
              data_type2 = "string";
            }
            if (foreignKey && foreignKey.multiple) {
              data_type2 = "string[]";
            }
          #>
          "<#=column_name2#>": "<#=data_type2#>",<#
          }
          #>
        },
      },
    );
    messageHandler.close();
    const res = await importModels(
      models,
      $$(importPercentage),
      $$(isStopImport),
    );
    msg = res.msg;
    succNum = res.succNum;
  } finally {
    isImporting = false;
  }
  if (msg) {
    ElMessageBox.alert(msg)
  }
  if (succNum > 0) {<#
    if (opts?.isRealData) {
    #>
    publish({
      topic: JSON.stringify({
        pagePath,
        action: "import",
      }),
      payload: selectedIds,
    });<#
    }
    #>
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
  }
}

/** 取消导入 */
async function stopImport() {
  isStopImport = true;
  isImporting = false;
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
  if (column_name === "is_deleted") continue;
  if (column_name === "tenant_id") continue;
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
async function on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(id: <#=Table_Up#>Id) {
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
  dirtyStore.fireDirty(pageName);
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
async function on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(id: <#=Table_Up#>Id, <#=column_name#>: 0 | 1) {
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
  dirtyStore.fireDirty(pageName);
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
async function on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(id: <#=Table_Up#>Id, <#=column_name#>: 0 | 1) {
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
  dirtyStore.fireDirty(pageName);
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
async function on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(id: <#=Table_Up#>Id, <#=column_name#>: 0 | 1) {
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
  dirtyStore.fireDirty(pageName);
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

/** 打开编辑页面 */
async function openEdit() {
  if (isLocked) {
    return;
  }
  if (!detailRef) {
    return;
  }
  if (!permit("edit")) {
    ElMessage.warning(await nsAsync("无权限"));
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要编辑的数据"));
    return;
  }
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("编辑") + await nsAsync("<#=table_comment#>"),
    action: "edit",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    isReadonly: $$(isLocked),
    isLocked: $$(isLocked),
    model: {
      ids: selectedIds,
    },
  });
  tableFocus();
  if (changedIds.length === 0) {
    return;
  }
  dirtyStore.fireDirty(pageName);
  await dataGrid();
  emit("edit", changedIds);
}<#
}
#>

/** 键盘回车按键 */
async function onRowEnter(e: KeyboardEvent) {
  if (props.selectedIds != null && !isLocked) {
    emit("rowEnter", e);
    return;
  }
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

/** 双击行 */
async function onRowDblclick(
  row: <#=modelName#>,
) {
  if (props.selectedIds != null && !isLocked) {
    emit("rowDblclick", row);
    return;
  }
  await openView();
}

/** 打开查看 */
async function openView() {
  tableFocus();
  if (!detailRef) {
    return;
  }
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要查看的数据"));
    return;
  }
  const search = getDataSearch();<#
  if (hasIsDeleted) {
  #>
  const is_deleted = search.is_deleted;<#
  }
  #>
  const {
    changedIds,
  } = await detailRef.showDialog({
    title: await nsAsync("查看") + await nsAsync("<#=table_comment#>"),
    action: "view",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    isLocked: $$(isLocked),
    model: {
      ids: selectedIds,<#
      if (hasIsDeleted) {
      #>
      is_deleted,<#
      }
      #>
    },
  });
  tableFocus();
  if (changedIds.length === 0) {
    return;
  }
  dirtyStore.fireDirty(pageName);
  await dataGrid();
  emit("edit", changedIds);
}<#
if (opts.noDelete !== true) {
#>

/** 点击删除 */
async function onDeleteByIds() {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (!permit("delete")) {
    ElMessage.warning(await nsAsync("无权限"));
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
  if (num) {<#
    if (opts?.isRealData) {
    #>
    publish({
      topic: JSON.stringify({
        pagePath,
        action: "delete",
      }),
      payload: selectedIds,
    });<#
    }
    #>
    selectedIds = [ ];
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
    ElMessage.success(await nsAsync("删除 {0} 条数据成功", num));
    emit("remove", num);
  }
}

/** 点击彻底删除 */
async function onForceDeleteByIds() {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (!permit("forceDelete")) {
    ElMessage.warning(await nsAsync("无权限"));
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
  if (num) {<#
    if (opts?.isRealData) {
    #>
    publish({
      topic: JSON.stringify({
        pagePath,
        action: "forceDelete",
      }),
      payload: num,
    });<#
    }
    #>
    selectedIds = [ ];
    ElMessage.success(await nsAsync("彻底删除 {0} 条数据成功", num));
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
  }
}<#
}
#><#
  if (hasEnabled && opts.noEdit !== true) {
#>

/** 点击启用或者禁用 */
async function onEnableByIds(is_enabled: 0 | 1) {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (permit("edit") === false) {
    ElMessage.warning(await nsAsync("无权限"));
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
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
  }
}<#
}
#><#
  if (hasLocked && opts.noEdit !== true) {
#>

/** 点击锁定或者解锁 */
async function onLockByIds(is_locked: 0 | 1) {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (permit("edit") === false) {
    ElMessage.warning(await nsAsync("无权限"));
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
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
  }
}<#
}
#><#
if (opts.noDelete !== true && opts.noRevert !== true) {
#>

/** 点击还原 */
async function onRevertByIds() {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (permit("delete") === false) {
    ElMessage.warning(await nsAsync("无权限"));
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
  if (num) {<#
    if (opts?.isRealData) {
    #>
    publish({
      topic: JSON.stringify({
        pagePath,
        action: "revert",
      }),
      payload: num,
    });<#
    }
    #><#
    if (hasIsDeleted) {
    #>
    search.is_deleted = 0;<#
    }
    #>
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
    ElMessage.success(await nsAsync("还原 {0} 条数据成功", num));
    emit("revert", num);
  }
}<#
}
#><#
if (hasForeignTabs) {
#>

let foreignTabsRef = $ref<InstanceType<typeof ForeignTabs>>();<#
if (hasForeignTabsButton || hasForeignTabsMore) {
#>

async function onOpenForeignTabs() {
  tableFocus();
  if (selectedIds.length === 0) {
    ElMessage.warning(await nsAsync("请选择需要查看的数据"));
    return;
  }
  if (selectedIds.length > 1) {
    ElMessage.warning(await nsAsync("只能选择一条数据"));
    return;
  }
  const id = selectedIds[0];
  await openForeignTabs(id, "");
  tableFocus();
}<#
}
#>

async function openForeignTabs(id: <#=Table_Up#>Id, title: string) {
  if (!foreignTabsRef) {
    return;
  }
  await foreignTabsRef.showDialog({
    title,
    model: {
      id,<#
      if (hasIsDeleted) {
      #>
      is_deleted: search.is_deleted,<#
      }
      #>
    },
  });
  tableFocus();
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
    if (column_name === "is_deleted") continue;
    if (column_name === "tenant_id") continue;
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

async function focus() {
  if (!inited || !tableRef || !tableRef.$el) {
    return;
  }
  tableRef.$el.focus();
}

watch(
  () => [
    props.isFocus,
    inited,
  ],
  () => {
    if (!inited || !isFocus || !tableRef || !tableRef.$el) {
      return;
    }
    tableRef.$el.focus();
  },
);

async function initFrame() {
  await Promise.all([
    initI18nsEfc(),
    dataGrid(true),
  ]);
  inited = true;
}

watch(
  () => [ builtInSearch, showBuildIn ],
  async function() {
    if (isSearchReset) {
      return;
    }<#
    if (hasIsDeleted) {
    #>
    search.is_deleted = builtInSearch.is_deleted;<#
    }
    #>
    if (deepCompare(builtInSearch, search)) {
      return;
    }
    if (showBuildIn) {
      Object.assign(search, builtInSearch);
    }
    await dataGrid(true);
  },
  {
    deep: true,
    immediate: true,
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
  if (column_name === "version") continue;
  if (column_name === "is_deleted") continue;
  if (column_name === "tenant_id") continue;
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
  const foreignSchema = foreignKey && optTables[foreignKey.mod + "_" + foreignTable];
#><#
  if (foreignKey && foreignKey.multiple && foreignKey.showType === "dialog") {
#>

let <#=column_name#>ListSelectDialogRef = $ref<InstanceType<typeof ListSelectDialog>>();

async function on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(row: <#=modelName#>) {
  if (!<#=column_name#>ListSelectDialogRef) {
    return;
  }
  row.<#=column_name#> = row.<#=column_name#> || [ ];
  const res = await <#=column_name#>ListSelectDialogRef.showDialog({
    title: await nsAsync("选择") + await nsAsync("<#=foreignSchema?.opts?.table_comment#>"),
    selectedIds: row.<#=column_name#>,<#
    if (hasLocked) {
    #>
    isLocked: row.is_locked == 1 || row.is_deleted == 1,<#
    } else {
    #>
    isLocked: row.is_deleted == 1,<#
    }
    #>
  });
  if (isLocked) {
    return;
  }
  const action = res.action;
  if (action !== "select") {
    return;
  }
  const selectedIds2 = res.selectedIds || [ ];
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
  dirtyStore.fireDirty(pageName);
  await dataGrid();
}<#
  }
#><#
  if (foreignKey && foreignKey.isLinkForeignTabs) {
#>

let <#=foreignTable#>ForeignTabsRef = $ref<InstanceType<typeof <#=Foreign_Table_Up#>ForeignTabs>>();

async function open<#=Foreign_Table_Up#>ForeignTabs(id: <#=Table_Up#>Id, title: string) {
  await <#=foreignTable#>ForeignTabsRef?.showDialog({
    title,
    isLocked: $$(isLocked),
    model: {
      id,<#
      if (hasIsDeleted) {
      #>
      is_deleted: search.is_deleted,<#
      }
      #>
    },
  });
}<#
  }
#><#
}
#>

defineExpose({
  refresh: onRefresh,
  focus,
});
</script>
