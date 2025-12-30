<template><#
const hasSummary = columns.some((column) => column.showSummary && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsMonth = columns.some((column) => column.isMonth);
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
const inlineForeignTabs = (opts?.inlineForeignTabs || [ ]).filter((item) => item.onlyCodegenDeno !== true);
const hasInlineForeignTabs = inlineForeignTabs.length > 0;
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const oldTable = table;
const oldTable_Up = Table_Up;
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
const hasForeignPage = columns.some((item) => item.foreignPage);
const hasImg = columns.some((item) => item.isImg && !item.onlyCodegenDeno);
const hasAtt = columns.some((item) => item.isAtt && !item.onlyCodegenDeno);

const searchFormWidth = opts.searchFormWidth;

const tableFieldPermit = columns.some((item) => item.fieldPermit);

const hasIsSwitch = columns.some((item) => item.isSwitch && !item.onlyCodegenDeno && !item.ignoreCodegen && !item.readonly && !item.noList
  && !item.isEncrypt
  && item.COLUMN_NAME !== "is_deleted"
);
const hasForeignKeyShowTypeDialog = columns.some((item) => item.foreignKey?.showType === "dialog" && !item.onlyCodegenDeno);
const hasOrderBy = columns.some((item) => item.COLUMN_NAME === 'order_by' && !item.readonly && !item.onlyCodegenDeno);

// 审核
const hasAudit = !!opts?.audit;
let auditColumn = "";
let auditMod = "";
let auditTable = "";
if (hasAudit) {
  auditColumn = opts.audit.column;
  auditMod = opts.audit.auditMod;
  auditTable = opts.audit.auditTable;
}
// 是否有复核
const hasReviewed = opts?.hasReviewed;
const auditTableUp = auditTable.substring(0, 1).toUpperCase()+auditTable.substring(1);
const auditTable_Up = auditTableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const auditTableSchema = opts?.audit?.auditTableSchema;

// 选择省市县区
let province_code_column = undefined;
let province_lbl_column = undefined;
let city_code_column = undefined;
let city_lbl_column = undefined;
let county_code_column = undefined;
let county_lbl_column = undefined;
let address_column = undefined;
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  const column_name = column.COLUMN_NAME;
  if (column.isProvinceCode) {
    province_code_column = column;
  }
  if (column.isProvinceLbl) {
    province_lbl_column = column;
  }
  if (column.isCityCode) {
    city_code_column = column;
    if (!province_code_column) {
      throw new Error("没有配置省份字段");
    }
  }
  if (column.isCityLbl) {
    city_lbl_column = column;
  }
  if (column.isCountyCode) {
    county_code_column = column;
    if (!city_lbl_column) {
      throw new Error("没有配置城市字段");
    }
  }
  if (column.isCountyLbl) {
    county_lbl_column = column;
  }
  if (column.isAddress) {
    address_column = column;
  }
  if (province_code_column && province_lbl_column && city_code_column && city_lbl_column && county_code_column && county_lbl_column && address_column) {
    break;
  }
}

// 根据关键字搜索
let searchByKeyword = opts?.searchByKeyword;

if (searchByKeyword) {
  if (!searchByKeyword.prop) {
    throw `表: ${ mod }_${ table } 的 opts.searchByKeyword.prop 不能为空`;
    process.exit(1);
  }
  if (!searchByKeyword.fields || !Array.isArray(searchByKeyword.fields) || searchByKeyword.fields.length === 0) {
    throw `表: ${ mod }_${ table } 的 opts.searchByKeyword.fields 不能为空`;
    process.exit(1);
  }
} else {
  searchByKeyword = { };
}

const search_fields = opts?.isUniPage?.list_page?.search_fields || [ ];
const lbl_field = opts?.isUniPage?.list_page?.lbl_field || "lbl";
const lbl_field_column = columns.find((col) => col.COLUMN_NAME === lbl_field);
const lbl2_fields = opts?.isUniPage?.list_page?.lbl2_fields || [ ];
const lbl2_fields_columns = lbl2_fields.map((field) => {
  const column = columns.find((col) => col.COLUMN_NAME === field);
  if (!column) {
    throw new Error(`表: ${ mod }_${ table } 中配置的列表辅助显示字段 ${ field } 在列中不存在`);
  }
  return column;
});
const right_field = opts?.isUniPage?.list_page?.right_field;
const right_field_column = columns.find((col) => col.COLUMN_NAME === right_field);
if (right_field && !right_field_column) {
  throw new Error(`表: ${ mod }_${ table } 中配置的列表右侧显示字段 ${ right_field } 在列中不存在`);
}
#>
<view
  un-flex="~ [1_0_0] col"
  un-overflow="hidden"
  un-relative
>
  
  <scroll-view
    un-flex="~ [1_0_0] col"
    un-overflow="hidden"
    scroll-y
    enable-back-to-top
    enable-flex
  >
    
    <view
      un-m="x-1"
    >
      
      <tm-form
        ref="formRef"
        v-model="<#=table#>_input"
        :label-width="180"
        :rules="form_rules"
        @submit="onSave"
      ><#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const column_name = column.COLUMN_NAME;
        if (column.onlyCodegenDeno) {
          continue;
        }
        if (column.ignoreCodegen) continue;
        if (column.onlyCodegenDeno) continue;
        if (column.noDetail) continue;
        if (column_name === "id") continue;
        if (column_name === "is_locked") continue;
        if (column_name === "is_deleted") continue;
        if (column_name === "version") continue;
        if (column_name === "tenant_id") continue;
        if (column.isFluentEditor) {
          continue;
        }
        if (column.inlineMany2manyTab) continue;
        const data_type = column.DATA_TYPE;
        const column_type = column.COLUMN_TYPE || "";
        const column_comment = column.COLUMN_COMMENT || "";
        const require = column.require;
        const readonly = column.readonly;
        const readonlyPlaceholder = column.readonlyPlaceholder || "";
        const foreignKey = column.foreignKey;
        if (foreignKey && foreignKey.showType === "dialog") {
          continue;
        }
        const foreignTable = foreignKey && foreignKey.table;
        const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
      #><#
        if (foreignKey) {
        #>
        
        <!-- <#=column_comment#> -->
        <tm-form-item
          label="<#=column_comment#>"
          name="<#=column_name#>"<#
          if (!require) {
          #>
          :required="false"<#
          }
          #>
        >
          <CustomSelectModal
            v-model="<#=table#>_input.<#=column_name#>"
            placeholder="请选择 <#=column_comment#>"
            :method="getList<#=Foreign_Table_Up#>"<#
            if (foreignKey.multiple) {
            #>
            multiple<#
            }
            #><#
            if (column.readonly) {
            #>
            :readonly="true"<#
            }
            #><#
            if (readonlyPlaceholder) {
            #>
            :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
            }
            #>
          ></CustomSelectModal>
        </tm-form-item><#
        } else if (data_type === "datetime" || data_type === "date") {
        #>
        
        <!-- <#=column_comment#> -->
        <tm-form-item
          label="<#=column_comment#>"
          name="<#=column_name#>"<#
          if (!require) {
          #>
          :required="false"<#
          }
          #>
        >
          <CustomInput
            v-model="<#=table#>_input.<#=column_name#>"
            placeholder="请选择 <#=column_comment#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            }
            #><#
            if (readonlyPlaceholder) {
            #>
            :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
            }
            #>
          ></CustomInput>
        </tm-form-item><#
        } else if (column.dict) {
        #>
        
        <!-- <#=column_comment#> -->
        <tm-form-item
          label="<#=column_comment#>"
          name="<#=column_name#>"<#
          if (!require) {
          #>
          :required="false"<#
          }
          #>
        >
          <DictSelect
            v-model="<#=table#>_input.<#=column_name#>"
            placeholder="请选择 <#=column_comment#>"
            code="<#=column.dict#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            }
            #><#
            if (readonlyPlaceholder) {
            #>
            :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
            }
            #>
          ></DictSelect>
        </tm-form-item><#
        } else if (column.dictbiz) {
        #>
        
        <!-- <#=column_comment#> -->
        <tm-form-item
          label="<#=column_comment#>"
          name="<#=column_name#>"<#
          if (!require) {
          #>
          :required="false"<#
          }
          #>
        >
          <DictSelect
            v-model="<#=table#>_input.<#=column_name#>"
            placeholder="请选择 <#=column_comment#>"
            code="<#=column.dictbiz#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            }
            #><#
            if (readonlyPlaceholder) {
            #>
            :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
            }
            #>
          ></DictSelect>
        </tm-form-item><#
        } else if (column_type.startsWith("int(1)") || column_type.startsWith("tinyint(1)")) {
          /* TODO: 是否生成开关 */
        #><#
        } else if (data_type === "int" || data_type === "float" || data_type === "double") {
        #>
        
        <!-- <#=column_comment#> -->
        <tm-form-item
          label="<#=column_comment#>"
          name="<#=column_name#>"<#
          if (!require) {
          #>
          :required="false"<#
          }
          #>
        >
          <CustomInput
            v-model="<#=table#>_input.<#=column_name#>"
            type="number"
            placeholder="请输入 <#=column_comment#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            }
            #><#
            if (readonlyPlaceholder) {
            #>
            :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
            }
            #>
          ></CustomInput>
        </tm-form-item><#
        } else if (data_type === "decimal") {
        #>
        
        <!-- <#=column_comment#> -->
        <tm-form-item
          label="<#=column_comment#>"
          name="<#=column_name#>"<#
          if (!require) {
          #>
          :required="false"<#
          }
          #>
        >
          <CustomInput
            v-model="<#=table#>_input.<#=column_name#>"
            type="decimal"
            placeholder="请输入 <#=column_comment#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            }
            #><#
            if (readonlyPlaceholder) {
            #>
            :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
            }
            #>
          ></CustomInput>
        </tm-form-item><#
        } else {
        #>
        
        <!-- <#=column_comment#> -->
        <tm-form-item
          label="<#=column_comment#>"
          name="<#=column_name#>"<#
          if (!require) {
          #>
          :required="false"<#
          }
          #>
        >
          <CustomInput
            v-model="<#=table#>_input.<#=column_name#>"<#
            if (column.isTextarea) {
            #>
            type="textarea"
            height="120"<#
            }
            #>
            placeholder="请输入 <#=column_comment#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            }
            #><#
            if (readonlyPlaceholder) {
            #>
            :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
            }
            #>
          ></CustomInput>
        </tm-form-item><#
        }
        #><#
      }
      #>
        
      </tm-form>
      
    </view><#
    if (hasInlineForeignTabs) {
    #>
    
    <!-- 选项卡 -->
    <view
      un-m="x-1"
    >
      <tm-tabs
        v-model="inlineForeignTabIdx"
        color=""
        :list="[<#
          for (const inlineForeignTab of inlineForeignTabs) {
            const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
            const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
            const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
            const table = inlineForeignTab.table;
            const mod = inlineForeignTab.mod;
            if (!inlineForeignSchema) {
              throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
              process.exit(1);
            }
            const opts = inlineForeignSchema.opts;
            const inline_column_name = inlineForeignTab.column_name;
            const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
          #>
          '<#=inlineForeignTab.label#>',<#
          }
          #>
        ]"
      ></tm-tabs>
    </view><#
    for (let i = 0; i < inlineForeignTabs.length; i++) {
      const inlineForeignTab = inlineForeignTabs[i];
      const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
      const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
      const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
      const table = inlineForeignTab.table;
      const mod = inlineForeignTab.mod;
      if (!inlineForeignSchema) {
        throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
        process.exit(1);
      }
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const opts = inlineForeignSchema.opts;
      const inline_column_name = inlineForeignTab.column_name;
      const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
      const uni_list_page_fields = inlineForeignTab.uni_list_page_fields || [ ];
    #>
    
    <!-- <#=inlineForeignTab.label#> -->
    <view
      v-if="inlineForeignTabIdx === <#=i.toString()#>"
      un-m="x-1"
    >
      
      <view
        un-sticky
        un-top="-.5"
        un-bg="[var(--page-bg)]"
        un-z="3"
      >
        
        <!-- 操作栏 -->
        <view
          un-flex="~"
        >
          
          <view
            un-flex="[1_0_0]"
            un-overflow="hidden"
          ></view>
          
          <view
            un-p="x-2 y-2"
            un-box-border
            un-cursor="pointer"
            :class="{
              'text-gray-500': index_selected_<#=table#>.length > 0,
              'text-gray-300': index_selected_<#=table#>.length === 0,
            }"
            @click="onUp<#=Table_Up#>"
          >
            <view
              un-i="iconfont-arrow_up"
            ></view>
          </view>
          
          <view
            un-p="x-2 y-2"
            un-box-border
            un-cursor="pointer"
            :class="{
              'text-gray-500': index_selected_<#=table#>.length > 0,
              'text-gray-300': index_selected_<#=table#>.length === 0,
            }"
            @click="onDown<#=Table_Up#>"
          >
            <view
              un-i="iconfont-arrow_down"
            ></view>
          </view>
          
          <view
            un-text="[var(--color-primary)]"
            un-p="x-2 y-2"
            un-box-border
            un-cursor="pointer"
            @click="onAdd<#=Table_Up#>"
          >
            新增
          </view>
          
          <view
            un-text="[var(--color-primary)]"
            un-p="x-2 y-2"
            un-box-border
            un-cursor="pointer"
            @click="onEditDynPageField"
          >
            编辑
          </view>
          
          <view
            un-text="red"
            un-p="x-2 y-2"
            un-box-border
            un-cursor="pointer"
            @click="onDelete<#=Table_Up#>"
          >
            删除
          </view>
          
        </view>
        
        <!-- 表头 -->
        <view
          un-flex="~ none"
          un-h="10"
          un-items="center"
          un-text="gray-600"
          un-b="0 solid gray-200 b-1"
        >
          
          <!-- 全选 -->
          <view
            un-w="10"
            un-h="full"
            un-flex="~"
            un-justify="center"
            un-items="center"
          >
            <tm-checkbox
              :show-label="false"
              :model-value="<#=oldTable#>_input?.<#=inline_column_name#>?.length && index_selected_<#=table#>.length === <#=oldTable#>_input?.<#=inline_column_name#>?.length"
              @update:model-value="onSelectAll<#=Table_Up#>($event, <#=oldTable#>_input?.<#=inline_column_name#>?.length || 0)"
            ></tm-checkbox>
          </view><#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const column_name = column.COLUMN_NAME;
            if (column.onlyCodegenDeno) {
              continue;
            }
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            if (column.noDetail) continue;
            if (!uni_list_page_fields.includes(column_name)) {
              continue;
            }
            if (column_name === "id") continue;
            if (column_name === "is_locked") continue;
            if (column_name === "is_deleted") continue;
            if (column_name === "version") continue;
            if (column_name === "tenant_id") continue;
            if (column.isFluentEditor) {
              continue;
            }
            if (column.inlineMany2manyTab) continue;
            const data_type = column.DATA_TYPE;
            const column_type = column.COLUMN_TYPE || "";
            const column_comment = column.COLUMN_COMMENT || "";
            const require = column.require;
            const readonly = column.readonly;
            const readonlyPlaceholder = column.readonlyPlaceholder || "";
            const foreignKey = column.foreignKey;
            if (foreignKey && foreignKey.showType === "dialog") {
              continue;
            }
            const foreignTable = foreignKey && foreignKey.table;
            const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
            const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
              return item.substring(0, 1).toUpperCase() + item.substring(1);
            }).join("");
          #><#
            if (foreignKey) {
          #>
          
          <!-- <#=column_comment#> -->
          <view
            un-h="full"
            un-flex="~ [1_0_auto]"
            un-justify="center"
            un-items="center"
          >
            <#=column_comment#>
          </view><#
            } else if (data_type === "datetime" || data_type === "date") {
          #>
          
          <!-- <#=column_comment#> -->
          <view
            un-h="full"
            un-flex="~ [1_0_auto]"
            un-justify="center"
            un-items="center"
          >
            <#=column_comment#>
          </view><#
            } else if (column.dict) {
          #>
          
          <!-- <#=column_comment#> -->
          <view
            un-h="full"
            un-flex="~ [1_0_auto]"
            un-justify="center"
            un-items="center"
          >
            <#=column_comment#>
          </view><#
            } else if (column.dictbiz) {
          #>
          
          <!-- <#=column_comment#> -->
          <view
            un-h="full"
            un-flex="~ [1_0_auto]"
            un-justify="center"
            un-items="center"
          >
            <#=column_comment#>
          </view><#
            } else if (column_type.startsWith("int(1)") || column_type.startsWith("tinyint(1)")) {
          #>
          
          <!-- <#=column_comment#> -->
          <view
            un-h="full"
            un-flex="~ [1_0_auto]"
            un-justify="center"
            un-items="center"
          >
            <#=column_comment#>
          </view><#
            } else if (data_type === "int" || data_type === "float" || data_type === "double") {
          #>
          
          <!-- <#=column_comment#> -->
          <view
            un-h="full"
            un-flex="~ [1_0_auto]"
            un-justify="center"
            un-items="center"
          >
            <#=column_comment#>
          </view><#
            } else if (data_type === "decimal") {
          #>
          
          <!-- <#=column_comment#> -->
          <view
            un-h="full"
            un-flex="~ [1_0_auto]"
            un-justify="center"
            un-items="center"
          >
            <#=column_comment#>
          </view><#
            } else {
          #>
          
          <!-- <#=column_comment#> -->
          <view
            un-h="full"
            un-flex="~ [1_0_auto]"
            un-justify="center"
            un-items="center"
          >
            <#=column_comment#>
          </view><#
            }
          #><#
          }
          #>
          
        </view>
        
      </view>
        
      <view
        v-if="!inited"
        un-m="t-14"
        un-flex="~"
        un-justify="center"
        un-text="gray-500"
      >
        加载中, 请稍后...
      </view>
          
      <view
        v-else-if="!<#=oldTable#>_input?.<#=inline_column_name#>?.length"
        un-m="t-14"
        un-flex="~"
        un-justify="center"
        un-text="gray-500"
      >
        (暂无<#=inlineForeignTab.label#>)
      </view>
      
      <!-- 数据行 -->
      <view
        v-for="(<#=inline_column_name#>, index) of <#=oldTable#>_input?.<#=inline_column_name#> || [ ]"
        :key="index"
        un-flex="~ none"
        un-h="12"
        un-items="center"
        un-text="gray-600"
        un-b="0 solid transparent b-1"
        :style="{
          'padding-top': index === 0 ? '8rpx' : '0',
          'border-color': index_selected_<#=table#>.includes(index) ? 'var(--color-primary)' : undefined,
        }"
      >
        
        <!-- 勾选框 -->
        <view
          un-w="10"
          un-h="full"
          un-flex="~"
          un-justify="center"
          un-items="center"
        >
          <tm-checkbox
            :show-label="false"
            :model-value="index_selected_<#=table#>.includes(index)"
            @update:model-value="onSelect<#=Table_Up#>($event, index)"
          ></tm-checkbox>
        </view><#
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          const column_name = column.COLUMN_NAME;
          if (column.onlyCodegenDeno) {
            continue;
          }
          if (column.ignoreCodegen) continue;
          if (column.onlyCodegenDeno) continue;
          if (column.noDetail) continue;
          if (!uni_list_page_fields.includes(column_name)) {
            continue;
          }
          if (column_name === "id") continue;
          if (column_name === "is_locked") continue;
          if (column_name === "is_deleted") continue;
          if (column_name === "version") continue;
          if (column_name === "tenant_id") continue;
          if (column.isFluentEditor) {
            continue;
          }
          if (column.inlineMany2manyTab) continue;
          const data_type = column.DATA_TYPE;
          const column_type = column.COLUMN_TYPE || "";
          const column_comment = column.COLUMN_COMMENT || "";
          const require = column.require;
          const readonly = column.readonly;
          const readonlyPlaceholder = column.readonlyPlaceholder || "";
          const foreignKey = column.foreignKey;
          if (foreignKey && foreignKey.showType === "dialog") {
            continue;
          }
          const foreignTable = foreignKey && foreignKey.table;
          const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
          const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
            return item.substring(0, 1).toUpperCase() + item.substring(1);
          }).join("");
        #><#
        if (foreignKey) {
        #>
        
        <!-- <#=column_comment#> -->
        <view
          un-h="full"
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-items="center"
          un-break="all"
          @click="onRow<#=Table_Up#>(index)"
        >
          {{ <#=inline_column_name#>.<#=column_name#>_lbl }}
        </view><#
        } else if (data_type === "datetime" || data_type === "date") {
        #>
        
        <!-- <#=column_comment#> -->
        <view
          un-h="full"
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-items="center"
          un-break="all"
          @click="onRow<#=Table_Up#>(index)"
        >
          {{ <#=inline_column_name#>.<#=column_name#> }}
        </view><#
        } else if (column.dict) {
        #>
        
        <!-- <#=column_comment#> -->
        <view
          un-h="full"
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-items="center"
          un-break="all"
          @click="onRow<#=Table_Up#>(index)"
        >
          {{ <#=inline_column_name#>.<#=column_name#>_lbl }}
        </view><#
        } else if (column.dictbiz) {
        #>
        
        <!-- <#=column_comment#> -->
        <view
          un-h="full"
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-items="center"
          un-break="all"
          @click="onRow<#=Table_Up#>(index)"
        >
          {{ <#=inline_column_name#>.<#=column_name#>_lbl }}
        </view><#
        } else if (column_type.startsWith("int(1)") || column_type.startsWith("tinyint(1)")) {
        #>
        
        <!-- <#=column_comment#> -->
        <view
          un-h="full"
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-items="center"
          un-break="all"
          @click="onRow<#=Table_Up#>(index)"
        >
          {{ <#=inline_column_name#>.<#=column_name#>_lbl }}
        </view><#
        } else if (data_type === "int" || data_type === "float" || data_type === "double") {
        #>
        
        <!-- <#=column_comment#> -->
        <view
          un-h="full"
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-items="center"
          un-break="all"
          @click="onRow<#=Table_Up#>(index)"
        >
          {{ <#=inline_column_name#>.<#=column_name#> }}
        </view><#
        } else if (data_type === "decimal") {
        #>
        
        <!-- <#=column_comment#> -->
        <view
          un-h="full"
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-justify="center"
          un-items="center"
          un-break="all"
          @click="onRow<#=Table_Up#>(index)"
        >
          {{ <#=inline_column_name#>.<#=column_name#> }}
        </view><#
        } else {
        #>
        
        <!-- <#=column_comment#> -->
        <view
          un-h="full"
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-items="center"
          un-break="all"
          @click="onRow<#=Table_Up#>(index)"
        >
          {{ <#=inline_column_name#>.<#=column_name#> }}
        </view><#
        }
        #><#
        } /** for (let i = 0; i < columns.length; i++) */
        #>
        
      </view>
      
    </view><#
    } /** for (const inlineForeignTab of inlineForeignTabs) */
    #><#
    } /** hasInlineForeignTabs */
    #>
    
    <view
      un-p="t-[350px]"
      un-box-border
    ></view>
    
  </scroll-view><#
  if (opts.noAdd !== true || opts.noEdit !== true) {
  #>
  
  <view<#
    if (opts.noEdit === true || opts.noAdd === true) {
    #>
    v-if="<#
    if (opts.noEdit === true) {
    #>dialogAction === 'add'<#
    } else if (opts.noAdd === true) {
    #>dialogAction === 'edit'<#
    }
    #>"
    <#
    }
    #>
    un-p="x-2 b-2"
    un-box-border
    un-flex="~"
    un-justify="center"
    un-items="center"
    un-gap="x-4"
  >
    
    <view
      v-if="dialogAction === 'edit' && <#=table#>_id"
      un-flex="1"
    >
      <tm-button
        block
        color="info"
        @click="onCopy"
      >
        复制
      </tm-button>
    </view>
    
    <view
      un-flex="1"
    >
      <tm-button
        :disabled="!inited"
        block
        @click="formRef?.submit()"
      >
        确定
      </tm-button>
    </view>
    
  </view><#
  }
  #>
  
  <AppLoading></AppLoading><#
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
    const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    if (!inlineForeignSchema) {
      throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const opts = inlineForeignSchema.opts;
    const inline_column_name = inlineForeignTab.column_name;
    const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
  #>
  
  <!-- <#=inlineForeignTab.label#> -->
  <<#=Table_Up#>DetailModal
    ref="<#=table#>_detail_modal_ref"
  ></<#=Table_Up#>DetailModal><#
  }
  #>
  
</view>
</template>

<script setup lang="ts"><#
const getListForeignTableArr = [ ];
#>
import {
  findOne<#=Table_Up#>,<#
  if (opts.noAdd !== true) {
  #>
  create<#=Table_Up#>,<#
  }
  #><#
  if (opts.noEdit !== true) {
  #>
  updateById<#=Table_Up#>,<#
  }
  #>
  getDefaultInput<#=Table_Up#>,
  intoInput<#=Table_Up#>,
} from "./Api.ts";

import {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "tenant_id") continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    const column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    if (!foreignKey) continue;
    if (foreignKey.showType === "dialog") {
      continue;
    }
    if (column.noAdd && column.noEdit) {
      continue;
    }
    if (column.inlineMany2manyTab) {
      continue;
    }
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    // if (foreignSchema && foreignSchema.opts?.list_tree) {
    //   continue;
    // }
    if (getListForeignTableArr.includes(foreignTable)) continue;
    getListForeignTableArr.push(foreignTable);
  #>
  getList<#=Foreign_Table_Up#>,<#
  }
  #>
} from "./Api.ts";

import TmForm from "@/uni_modules/tm-ui/components/tm-form/tm-form.vue";<#
for (const inlineForeignTab of inlineForeignTabs) {
  const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
  const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
  const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
  const table = inlineForeignTab.table;
  const mod = inlineForeignTab.mod;
  if (!inlineForeignSchema) {
    throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
    process.exit(1);
  }
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const opts = inlineForeignSchema.opts;
  const inline_column_name = inlineForeignTab.column_name;
  const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
#>

// <#=inlineForeignTab.label#>
import <#=Table_Up#>DetailModal from "@/pages/<#=table#>/DetailModal.vue";<#
}
#>

let inited = $ref(false);

let <#=table#>_id = $ref<<#=Table_Up#>Id>();

let <#=table#>_input = $ref<<#=Table_Up#>Input>({ });
let <#=table#>_model = $ref<<#=Table_Up#>Model>();

const form_rules: Record<string, TM.FORM_RULE[]> = {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const column_name = column.COLUMN_NAME;
    if (column.onlyCodegenDeno) {
      continue;
    }
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    if (column.noDetail) continue;
    if (column_name === "id") continue;
    if (column_name === "is_locked") continue;
    if (column_name === "is_deleted") continue;
    if (column_name === "version") continue;
    if (column_name === "tenant_id") continue;
    if (column.isFluentEditor) {
      continue;
    }
    if (column.inlineMany2manyTab) continue;
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE;
    const column_comment = column.COLUMN_COMMENT || "";
    const require = column.require;
    if (require !== true) {
      continue;
    }
    const readonly = column.readonly;
    const foreignKey = column.foreignKey;
    if (foreignKey && foreignKey.showType === "dialog") {
      continue;
    }
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #><#
  if (data_type === "datetime" || data_type === "date" ||
    column.dict || column.dictbiz || foreignKey
  ) {
  #>
  <#=column_name#>: [
    {
      required: true,
      message: "请选择 <#=column_comment#>",
    },
  ],<#
  } else {
  #>
  <#=column_name#>: [
    {
      required: true,
      message: "请输入 <#=column_comment#>",
    },
  ],<#
  }
  #><#
  }
  #>
};

type ActionType = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<ActionType>("add");

const formRef = $ref<InstanceType<typeof TmForm>>();

/** 复制 */
async function onCopy() {
  if (!<#=table#>_id) {
    return;
  }
  uni.redirectTo({
    url: `/pages/<#=table#>/Detail?<#=table#>_id=${ encodeURIComponent(<#=table#>_id) }&action=copy`,
  });
}

/** 保存 */
async function onSave(
  formSubmitResult?: TM.FORM_SUBMIT_RESULT,
) {
  if (!inited) {
    return;
  }<#
  if (opts.noAdd === true) {
  #>
  if (dialogAction === "add" || dialogAction === "copy") {
    uni.showToast({
      title: "无新增权限",
      icon: "none",
    });
    return;
  }<#
  }
  #><#
  if (opts.noEdit === true) {
  #>
  if (dialogAction === "edit") {
    uni.showToast({
      title: "无修改权限",
      icon: "none",
    });
    return;
  }<#
  }
  #>
  if (formSubmitResult?.isPass === false) {
    return;
  }
  
  if (props.beforeSave) {
    const canSave = await props.beforeSave(<#=table#>_input);
    if (!canSave) {
      return;
    }
  }
  
  if (dialogAction === "copy" || dialogAction === "add") {
    await create<#=Table_Up#>(
      <#=table#>_input,
    );
    await uni.navigateBack();
    uni.$emit("/pages/<#=table#>/List:refresh");
  } else if (dialogAction === "edit") {
    if (!<#=table#>_id) {
      uni.showToast({
        title: "修改失败, id 不能为空",
        icon: "none",
      });
      return;
    }
    await updateById<#=Table_Up#>(
      <#=table#>_id,
      <#=table#>_input,
    );
    await uni.navigateBack();
    uni.$emit("/pages/<#=table#>/List:refresh");
  }
  
}

/** 刷新 */
async function onRefresh() {
  formRef?.resetValidation();
  if (dialogAction === "add") {
    <#=table#>_input = await getDefaultInput<#=Table_Up#>();<#
    if (hasOrderBy) {
    #>
    <#=table#>_input.order_by = props.order_by;<#
    }
    #>
  } else if (dialogAction === "copy") {
    if (!<#=table#>_id) {
      uni.showToast({
        title: "复制失败, id 不能为空",
        icon: "none",
      });
      return;
    }
    <#=table#>_model = await findOneModel(
      {
        id: <#=table#>_id,
        is_deleted: 0,
      },
      undefined,
      {
        notLoading: true,
      },
    );
    if (!<#=table#>_model) {
      uni.showToast({
        title: "<#=table_comment#> 已被删除",
        icon: "none",
      });
    }
    <#=table#>_input = intoInput<#=Table_Up#>(
      <#=table#>_model,
    );<#
    if (hasOrderBy) {
    #>
    <#=table#>_input.order_by = props.order_by;<#
    }
    #>
  } else if (dialogAction === "edit") {
    <#=table#>_model = await findOneModel(
      {
        id: <#=table#>_id,
        is_deleted: 0,
      },
      undefined,
      {
        notLoading: true,
      },
    );
    if (!<#=table#>_model) {
      uni.showToast({
        title: "<#=table_comment#> 已被删除",
        icon: "none",
      });
    }
    <#=table#>_input = intoInput<#=Table_Up#>(
      <#=table#>_model,
    );
  }
}<#
if (hasInlineForeignTabs) {
#>

const inlineForeignTabIdx = $ref<number>(0);<#
}
#><#
for (const inlineForeignTab of inlineForeignTabs) {
  const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
  const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
  const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
  const table = inlineForeignTab.table;
  const mod = inlineForeignTab.mod;
  if (!inlineForeignSchema) {
    throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
    process.exit(1);
  }
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const opts = inlineForeignSchema.opts;
  const inline_column_name = inlineForeignTab.column_name;
  const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
#>

/** <#=inlineForeignTab.label#> */
<#=oldTable#>_input.<#=inline_column_name#> = <#=oldTable#>_input.<#=inline_column_name#> || [ ];
const inlineForeignTab<#=Table_Up#> = useInlineForeignTab(
  () => <#=oldTable#>_input.<#=inline_column_name#>,
);

const index_selected_<#=table#> = $(inlineForeignTab<#=Table_Up#>.index_selected);
const onRow<#=Table_Up#> = inlineForeignTab<#=Table_Up#>.onRow;
const onUp<#=Table_Up#> = inlineForeignTab<#=Table_Up#>.onUp;
const onDown<#=Table_Up#> = inlineForeignTab<#=Table_Up#>.onDown;
const onDelete<#=Table_Up#> = inlineForeignTab<#=Table_Up#>.onDelete;
const onSelect<#=Table_Up#> = inlineForeignTab<#=Table_Up#>.onSelect;
const onSelectAll<#=Table_Up#> = inlineForeignTab<#=Table_Up#>.onSelectAll;

const <#=table#>_detail_modal_ref = $ref<InstanceType<typeof <#=Table_Up#>DetailModal>>();

/** 新增 */
async function onAdd<#=Table_Up#>() {
  
  if (
    !inited || !<#=table#>_detail_modal_ref ||
    !<#=oldTable#>_model
  ) {
    return;
  }
  
  let order_by = 1;
  if ((<#=oldTable#>_model.<#=inline_column_name#>?.length || 0) > 0) {
    const max_order_by = Math.max(...<#=oldTable#>_model.<#=inline_column_name#>.map((it) => it.order_by || 0));
    order_by = max_order_by + 1;
  }
  
  const res = await <#=table#>_detail_modal_ref.showDialog({
    action: "add",
    title: "新增 <#=inlineForeignTab.label#>",
    model: {
      order_by,
    },
  });
  
  if (res.type === "cancel") {
    return;
  }
  
  const input = res.input;
  
  <#=oldTable#>_input.<#=inline_column_name#> = <#=oldTable#>_input.<#=inline_column_name#> || [ ];
  <#=oldTable#>_input.<#=inline_column_name#>.push(input);
  
  <#=oldTable#>_model.<#=inline_column_name#>.push({
    ...input,
    is_deleted: 0,
  } as <#=Table_Up#>Model);
  
  <#=oldTable#>_model.<#=inline_column_name#>.sort((a, b) => (a.order_by || 0) - (b.order_by || 0));
  <#=oldTable#>_input = intoInput<#=oldTable_Up#>(<#=oldTable#>_model);
  
}

/** 编辑 */
async function onEdit<#=Table_Up#>() {
  
  if (
    !inited || !<#=table#>_detail_modal_ref ||
    !<#=oldTable#>_model
  ) {
    return;
  }
  
  if (index_selected_<#=table#>.length > 1) {
    uni.showToast({
      title: "只能单选 <#=inlineForeignTab.label#>",
      icon: "none",
    });
    return;
  }
  if (index_selected_<#=table#>.length === 0) {
    uni.showToast({
      title: "请选择要编辑的 <#=inlineForeignTab.label#>",
      icon: "none",
    });
    return;
  }
  
  const index = index_selected_<#=table#>[0];
  
  const res = await <#=table#>_detail_modal_ref.showDialog({
    action: "edit",
    title: "编辑 <#=inlineForeignTab.label#>",
    findOne: async function(
      search?: <#=Table_Up#>Search,
      sort?: Sort[],
      opt?: GqlOpt,
    ): Promise<<#=Table_Up#>Model | undefined> {
      return <#=oldTable#>_model?.<#=inline_column_name#>?.[index];
    },
  });
  
  if (res.type === "cancel") {
    return;
  }
  
  const input = res.input;
  
  <#=oldTable#>_input.<#=inline_column_name#> = <#=oldTable#>_input.<#=inline_column_name#> || [ ];
  <#=oldTable#>_input.<#=inline_column_name#>.splice(index, 1, input);
  
  if (<#=oldTable#>_model && <#=oldTable#>_model.<#=inline_column_name#>) {
    Object.assign(<#=oldTable#>_model.<#=inline_column_name#>[index], input);
    <#=oldTable#>_model.<#=inline_column_name#>.sort((a, b) => (a.order_by || 0) - (b.order_by || 0));
    <#=oldTable#>_input = intoInput<#=oldTable_Up#>(<#=oldTable#>_model);
  }
  
}<#
}
#>

async function initFrame() {
  await onRefresh();
  inited = true;
}

const props = withDefaults(
  defineProps<{
    /** 是否初始化页面, 默认为 true */
    init?: boolean;
    action?: ActionType;
    <#=table#>_id?: <#=Table_Up#>Id;
    findOne?: typeof findOne<#=Table_Up#>;
    beforeSave?: (input: <#=Table_Up#>Input) => Promise<boolean>;<#
    if (hasOrderBy) {
    #>
    order_by?: number;<#
    }
    #>
  }>(),
  {
    init: true,
    action: undefined,
    <#=table#>_id: undefined,
    findOne: undefined,
    beforeSave: undefined,<#
    if (hasOrderBy) {
    #>
    order_by: undefined,<#
    }
    #>
  },
);

let findOneModel: typeof findOne<#=Table_Up#> = findOne<#=Table_Up#>;

watch(
  () => [
    props.action,
    props.<#=table#>_id,
    props.findOne,
  ],
  () => {
    if (props.action) {
      dialogAction = props.action;
    }
    if (props.<#=table#>_id) {
      <#=table#>_id = props.<#=table#>_id;
    }
    if (props.findOne) {
      findOneModel = props.findOne;
    } else {
      findOneModel = findOne<#=Table_Up#>;
    }
  },
  {
    immediate: true,
  },
);

onLoad(async function(query?: AnyObject) {
  const <#=table#>_id_str = query?.<#=table#>_id;
  const action = query?.action;
  if (action === "add") {
    dialogAction = "add";
  } else if (action === "copy") {
    dialogAction = "copy";
  } else if (action === "edit") {
    dialogAction = "edit";
  }
  if (<#=table#>_id_str) {
    <#=table#>_id = decodeURIComponent(<#=table#>_id_str) as <#=Table_Up#>Id | undefined;
    if (!action) {
      dialogAction = "edit";
    }
  }
  await initFrame();
});

async function initOrRefresh() {
  if (!inited) {
    await initFrame();
  } else {
    await onRefresh();
  }
}

defineExpose({
  refresh: initOrRefresh,
});
</script>
