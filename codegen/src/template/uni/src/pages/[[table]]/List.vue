<template><#
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
const is_export_excel = opts?.isUniPage?.list_page?.is_export_excel;
#>
<view
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  
  <!-- 操作 -->
  <view
    un-flex="~ wrap"
    un-m="x-2 t-2"
    un-items="center"
  >
    
    <view
      v-if="isEditing"
      un-flex="~"
      un-items="center"
      un-m="l-.125"
    >
      <tm-radio
        v-model="isSelectAll"
        :size="30"
        :label-font-size="28"
        :label="`${ <#=table#>_ids_selected.length ? <#=table#>_ids_selected.length : '' }`"
      ></tm-radio>
    </view>
    
    <view
      un-flex="[1_0_0]"
      un-overflow="hidden"
    ></view>
    
    <view
      un-flex="~"
      un-items="center"
      un-gap="x-4"
    >
      
      <template
        v-if="isEditing"
      >
        
        <view
          un-flex="[1_0_0]"
          un-overflow="hidden"
        ></view><#
        if (opts.noDelete !== true) {
        #>
        
        <text
          un-whitespace="nowrap"
          un-cursor="pointer"
          un-text="red"
          @click="onDelete"
        >
          删除
        </text><#
        }
        #><#
        if (is_export_excel) {
        #>
        
        <!-- 导出 -->
        <text
          un-whitespace="nowrap"
          un-cursor="pointer"
          @click="onExportExcel<#=Table_Up#>"
        >
          导出
        </text><#
        }
        #>
        
        <text
          un-whitespace="nowrap"
          un-cursor="pointer"
          @click="isEditing = false;<#=table#>_ids_selected = [ ]"
        >
          取消
        </text>
        
      </template>
      
      <text
        v-if="!isEditing"
        un-whitespace="nowrap"
        un-cursor="pointer"
        @click="isEditing = true"
      >
        操作
      </text>
      
    </view>
    
  </view>
  
  <!-- 搜索 -->
  <view
    un-p="x-2 y-.5"
    un-box-border
  >
    <tm-form
      v-model="search"
      :label-width="180"
      
      @submit="onSearch"
    ><#
    for (let i = 0; i < search_fields.length; i++) {
      const search_field = search_fields[i];
      const column = columns.find((col) => col.COLUMN_NAME === search_field);
      if (!column && search_field !== searchByKeyword.prop) {
        throw new Error(`表: ${ mod }_${ table } 中配置的搜索字段 ${ search_field } 在列中不存在`);
      }
      const column_name = column?.COLUMN_NAME;
      const data_type = column?.DATA_TYPE;
      const column_type = column?.COLUMN_TYPE;
      const column_comment = column?.COLUMN_COMMENT || "";
    #><#
      if (search_field === searchByKeyword.prop) {
        const prop = searchByKeyword.prop;
        const lbl = searchByKeyword.lbl || "关键字";
        const placeholder = searchByKeyword.placeholder || "关键字";
      #>
      
      <!-- <#=lbl#> -->
      <tm-form-item
        label="<#=lbl#>"
        name="<#=prop#>"
        :required="false"
      >
        <CustomInput
          v-model="search.<#=prop#>"
          placeholder="请输入 <#=placeholder#>"
          @change="onSearch"
        ></CustomInput>
      </tm-form-item><#
      } else if (data_type === "datetime" || data_type === "date") {
      #>
      
      <!-- <#=column_comment#> -->
      <tm-form-item
        label="<#=column_comment#>"
        name="<#=column_name#>"
        :required="false"
      >
        <CustomBetweenDate
          v-model="search.<#=column_name#>"
          placeholder="请选择 <#=column_comment#>"
          @change="onSearch"
        ></CustomBetweenDate>
      </tm-form-item><#
      } else {
      #>
      
      <!-- <#=column_comment#> -->
      <tm-form-item
        label="<#=column_comment#>"
        name="<#=column_name#>"
        :required="false"
      >
        <CustomInput
          v-model="search.<#=column_name#>"
          placeholder="请输入 <#=column_comment#>"
          @change="onSearch"
        ></CustomInput>
      </tm-form-item><#
      }
      #><#
    }
    #>
    
    </tm-form>
  </view>
  
  <scroll-view
    un-flex="~ [1_0_0] col"
    un-overflow="hidden"
    scroll-y
    enable-back-to-top
    enable-flex
    refresher-enabled
    :refresher-triggered="refresherTriggered"
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="onLoadMore"
  >
    
    <view
      v-if="!inited && <#=table#>_models.length === 0"
      un-m="x-2 t-2"
      un-p="x-4 y-4"
      un-box-border
      un-flex="~ [1_0_0]"
      un-overflow-hidden
      un-rounded="md"
      un-text="gray-500"
      un-justify="center"
      un-items="center"
    >
      加载中, 请稍后...
    </view>
    
    <view
      v-if="inited && <#=table#>_models.length === 0"
      un-m="x-2 t-2"
      un-p="x-4 y-4"
      un-box-border
      un-flex="~ [1_0_0]"
      un-overflow-hidden
      un-rounded="md"
      un-text="gray-500"
      un-justify="center"
      un-items="center"
    >
      (暂无<#=table_comment#>)
    </view>
    
    <template
      v-else
    >
      
      <view
        v-for="<#=table#>_model of <#=table#>_models_computed"
        :key="<#=table#>_model.id"
        un-flex="~"
        un-m="x-2 t-2"
        un-gap="x-2"
      >
        
        <view
          v-if="isEditing"
          un-flex="~"
          un-items="center"
        >
          <tm-radio
            :model-value="<#=table#>_ids_selected.includes(<#=table#>_model.id)"
            :size="30"
            :show-label="false"
            @change="onRadio($event, <#=table#>_model.id)"
          >
          </tm-radio>
        </view>
        
        <view
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-cursor="pointer"
          un-b="0 solid transparent b-1"
          :style="{
            borderColor: <#=table#>_id_selected === <#=table#>_model.id ? 'var(--color-primary)' : undefined,
          }"
          @click="on<#=Table_Up#>(<#=table#>_model.id)"
        >
          
          <view
            un-bg="white"
            un-flex="~ [1_0_0]"
            un-overflow="hidden"
            un-rounded="lg"
            un-items="center"
            un-p="x-2 y-2"
            un-box-border
          >
            
            <view
              un-flex="~ col"
              un-justify="center"
              un-gap="y-1"
            >
              
              <view
                un-flex="~"
                un-gap="x-2"
              >
                
                <view>
                  {{ <#=table#>_model.<#=lbl_field#> }}
                </view>
                
              </view><#
              for (let i = 0; i < lbl2_fields.length; i++) {
                const lbl2_field = lbl2_fields[i];
              #>
              
              <view
                un-text="3.5 gray-400"
              >
                {{ <#=table#>_model.<#=lbl2_field#> }}
              </view><#
              }
              #>
              
            </view>
            
            <view
              un-flex="[1_0_0]"
              un-overflow="hidden"
            ></view><#
            if (right_field) {
            #>
            
            <view
              un-text="4 gray-400"
              un-m="x-2"
            ><#
              if (right_field) {
                const data_type = right_field_column?.DATA_TYPE;
                if (data_type === "date" || data_type === "datetime" || data_type === "timestamp") {
              #>
              {{ <#=table#>_model.<#=right_field#>_lbl }}<#
                } else {
              #>
              {{ <#=table#>_model.<#=right_field#> }}<#
                }
              }
              #>
            </view><#
            }
            #>
            
            <!-- 向右的箭头 -->
            <view
              v-if="!isEditing"
              un-flex="~"
              un-items="center"
            >
              <view
                un-i="iconfont-right"
              ></view>
            </view>
            
          </view>
          
        </view>
        
      </view>
      
    </template>
    
    <CustomDivider
      v-if="!isLoading && inited && total > 0"
    >
      共 {{ total }} <#=table_comment#>
    </CustomDivider>
    
    <CustomDivider
      v-else-if="isLoading"
    >
      加载中...
    </CustomDivider>
  
  </scroll-view><#
  if (opts.noAdd !== true) {
  #>
  
  <view
    v-if="!isEditing"
    un-fixed
    un-bottom="8"
    un-right="6"
    un-z="3"
    un-bg="[var(--color-primary)]"
    un-p="x-4 y-4"
    un-box-border
    un-rounded="full"
    un-cursor="pointer"
    @click="onAdd<#=Table_Up#>"
  >
    <view
      un-i="iconfont-plus"
      un-text="6"
      un-shadow="lg"
      un-color="white"
      un-font="bold"
    ></view>
  </view><#
  }
  #>
  
  <AppLoading></AppLoading>
</view>
</template>

<script setup lang="ts">
import {
  findAll<#=Table_Up#>,
  findCount<#=Table_Up#>,<#
  if (opts.noDelete !== true) {
  #>
  deleteByIds<#=Table_Up#>,<#
  }
  #><#
  if (is_export_excel) {
  #>
  exportExcel<#=Table_Up#>,<#
  }
  #>
} from "./Api.ts";

let inited = $ref(false);

let isEditing = $ref(false);

let <#=table#>_ids_selected = $ref<<#=Table_Up#>Id[]>([ ]);
let <#=table#>_id_selected = $ref<<#=Table_Up#>Id>();

const <#=table#>_models_key = "<#=table#>.List.<#=table#>_models";
let <#=table#>_models = $ref<<#=Table_Up#>Model[]>(uni.getStorageSync(<#=table#>_models_key) || [ ]);

type SearchType = {<#
  for (let i = 0; i < search_fields.length; i++) {
    const search_field = search_fields[i];
    const column = columns.find((col) => col.COLUMN_NAME === search_field);
    if (!column && search_field !== searchByKeyword.prop) {
      throw new Error(`表: ${ mod }_${ table } 中配置的搜索字段 ${ search_field } 在列中不存在`);
    }
    const column_name = column?.COLUMN_NAME;
    const data_type = column?.DATA_TYPE;
    const column_type = column?.COLUMN_TYPE;
    const column_comment = column?.COLUMN_COMMENT || "";
  #><#
  if (search_field === searchByKeyword.prop) {
    const prop = searchByKeyword.prop;
    const lbl = searchByKeyword.lbl || "关键字";
    const placeholder = searchByKeyword.placeholder || "关键字";
  #>
  // <#=lbl#>
  <#=prop#>?: string;<#
  } else if (data_type === "datetime" || data_type === "date") {
  #>
  // <#=column_comment#>
  <#=column_name#>: [string | null, string | null];<#
  } else {
  #>
  // <#=column_comment#>
  <#=column_name#>?: string;<#
  }
  #><#
  }
  #>
};

const searchKey = "/pages/<#=table#>/List:search";
const search = $ref<SearchType>(uni.getStorageSync(searchKey) || {<#
  for (let i = 0; i < search_fields.length; i++) {
    const search_field = search_fields[i];
    const column = columns.find((col) => col.COLUMN_NAME === search_field);
    if (!column && search_field !== searchByKeyword.prop) {
      throw new Error(`表: ${ mod }_${ table } 中配置的搜索字段 ${ search_field } 在列中不存在`);
    }
    const column_name = column?.COLUMN_NAME;
    const data_type = column?.DATA_TYPE;
    const column_type = column?.COLUMN_TYPE;
    const column_comment = column?.COLUMN_COMMENT || "";
  #><#
  if (data_type === "datetime" || data_type === "date") {
  #>
  // <#=column_comment#>
  <#=column_name#>: [ null, null ],<#
  }
  #><#
  }
  #>
});<#
for (let i = 0; i < search_fields.length; i++) {
  const search_field = search_fields[i];
  const column = columns.find((col) => col.COLUMN_NAME === search_field);
  if (!column && search_field !== searchByKeyword.prop) {
    throw new Error(`表: ${ mod }_${ table } 中配置的搜索字段 ${ search_field } 在列中不存在`);
  }
  const column_name = column?.COLUMN_NAME;
  const data_type = column?.DATA_TYPE;
  const column_type = column?.COLUMN_TYPE;
  const column_comment = column?.COLUMN_COMMENT || "";
  if (search_field === searchByKeyword.prop) {
    continue;
  }
  if (data_type !== "datetime" && data_type !== "date") {
    continue;
  }
#>
// <#=column_comment#>
if (!search.<#=column_name#>) {
  search.<#=column_name#> = [ null, null ];
}<#
}
#>

type <#=Table_Up#>ModelComputed = {
  id: <#=Table_Up#>Id;
  <#=lbl_field#>: string;<#
  for (let i = 0; i < lbl2_fields_columns.length; i++) {
    const column = lbl2_fields_columns[i];
    if (!column) {
      throw new Error(`表: ${ mod }_${ table } 中配置的列表辅助显示字段 在列中不存在`);
      process.exit(1);
    }
    const column_name = column.COLUMN_NAME;
    const column_comment = column.COLUMN_COMMENT || "";
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE;
    let data_type_ts = "string";
    if (data_type === "int" || data_type === "bigint" || data_type === "float" || data_type === "double") {
      data_type_ts = "number";
    } else if (data_type === "boolean" || data_type === "tinyint(1)") {
      data_type_ts = "number";
    }
    let column_name_ts = column_name;
    if (column.dict || column.dictbiz
      || data_type === "date" || data_type === "datetime" || data_type === "timestamp"
    ) {
      column_name_ts = column_name + "_lbl";
    }
  #>
  <#=column_name_ts#>: <#=data_type_ts#>;<#
  }
  #><#
  if (right_field) {
    const column = columns.find((col) => col.COLUMN_NAME === right_field);
    if (!column) {
      throw new Error(`表: ${ mod }_${ table } 中配置的列表右侧显示字段 ${ right_field } 在列中不存在`);
    }
    const data_type = column.DATA_TYPE;
    const column_name = column.COLUMN_NAME;
    const column_type = column.COLUMN_TYPE;
    let data_type_ts = "string";
    if (data_type === "int" || data_type === "bigint" || data_type === "float" || data_type === "double") {
      data_type_ts = "number";
    } else if (data_type === "boolean" || data_type === "tinyint(1)") {
      data_type_ts = "number";
    }
    let column_name_ts = column_name;
    if (column.dict || column.dictbiz
      || data_type === "date" || data_type === "datetime" || data_type === "timestamp"
    ) {
      column_name_ts = column_name + "_lbl";
    }
  #>
  <#=column_name_ts#>: <#=data_type_ts#>;<#
  }
  #>
};

const <#=table#>_models_computed = computed<<#=Table_Up#>ModelComputed[]>(() => {
  return <#=table#>_models.map((<#=table#>_model, i) => {<#
    if (right_field) {
      const data_type = right_field_column?.DATA_TYPE;
      if (data_type === "date" || data_type === "datetime" || data_type === "timestamp") {
    #>
    let <#=right_field#>_lbl = "";
    if (<#=table#>_model.<#=right_field#>) {
      <#=right_field#>_lbl = dayjs(<#=table#>_model.<#=right_field#>).format("YYYY-MM-DD");
    }<#
      }
    }
    #>
    return {
      id: <#=table#>_model.id,
      <#=lbl_field#>: <#=table#>_model.<#=lbl_field#>,<#
      for (let i = 0; i < lbl2_fields_columns.length; i++) {
        const lbl2_fields_column = lbl2_fields_columns[i];
        const column_name = lbl2_fields_column.COLUMN_NAME;
        const column_comment = lbl2_fields_column.COLUMN_COMMENT || "";
        const data_type = lbl2_fields_column.DATA_TYPE;
        const column_type = lbl2_fields_column.COLUMN_TYPE;
        let data_type_ts = "string";
        if (data_type === "int" || data_type === "bigint" || data_type === "float" || data_type === "double") {
          data_type_ts = "number";
        } else if (data_type === "boolean" || data_type === "tinyint(1)") {
          data_type_ts = "number";
        }
        let column_name_ts = column_name;
        let column_value = table + "_model." + column_name;
        if (lbl2_fields_column.dict || lbl2_fields_column.dictbiz
          || data_type === "date" || data_type === "datetime" || data_type === "timestamp"
        ) {
          column_name_ts = column_name + "_lbl";
          column_value = table + "_model." + column_name_ts;
        }
      #>
      <#=column_name_ts#>: <#=column_value#>,<#
      }
      #><#
      if (right_field) {
        const data_type = right_field_column?.DATA_TYPE;
        let column_name_ts = right_field;
        let column_value = table + "_model." + right_field;
        if (right_field_column.dict || right_field_column.dictbiz
          || data_type === "date" || data_type === "datetime" || data_type === "timestamp"
        ) {
          column_name_ts = right_field + "_lbl";
          column_value = column_name_ts;
        }
      #>
      <#=column_name_ts#>: <#=column_value#>,<#
      }
      #>
    };
  });
});

function onRadio(
  checked: boolean,
  <#=table#>_id: <#=Table_Up#>Id,
) {
  if (checked) {
    if (!<#=table#>_ids_selected.includes(<#=table#>_id)) {
      <#=table#>_ids_selected.push(<#=table#>_id);
    }
  } else {
    <#=table#>_ids_selected = <#=table#>_ids_selected.filter((item) => item !== <#=table#>_id);
  }
}

async function on<#=Table_Up#>(
  <#=table#>_id: <#=Table_Up#>Id,
) {
  if (isEditing) {
    if (!<#=table#>_ids_selected.includes(<#=table#>_id)) {
      <#=table#>_ids_selected.push(<#=table#>_id);
    } else {
      <#=table#>_ids_selected = <#=table#>_ids_selected.filter((item) => item !== <#=table#>_id);
    }
    return;
  }
  <#=table#>_id_selected = <#=table#>_id;
  await uni.navigateTo({
    url: `/pages/<#=table#>/Detail?<#=table#>_id=${ encodeURIComponent(<#=table#>_id) }`,
  });
}

async function onAdd<#=Table_Up#>() {
  if (!inited) {
    return;
  }
  await uni.navigateTo({
    url: "/pages/<#=table#>/Detail",
  });
}

uni.$on("/pages/<#=table#>/List:refresh", async function() {
  pgOffset = 0;
  await onRefresh();
});

/** 全选 */
const isSelectAll = $computed({
  get() {
    if (<#=table#>_models.length === 0) {
      return false;
    }
    return <#=table#>_ids_selected.length === <#=table#>_models.length;
  },
  set(value) {
    if (value) {
      <#=table#>_ids_selected = <#=table#>_models.map((item) => item.id);
    } else {
      <#=table#>_ids_selected = [ ];
    }
  },
});<#
if (opts.noDelete !== true) {
#>

/** 删除 */
async function onDelete() {
  if (<#=table#>_ids_selected.length === 0) {
    uni.showToast({
      title: "请选择需要删除的<#=table_comment#>",
      icon: "none",
    });
    return;
  }
  const len = <#=table#>_ids_selected.length;
  const {
    confirm,
  } = await uni.showModal({
    title: "提示",
    content: `确定删除选中的 ${ len } 个<#=table_comment#>吗？`,
    confirmText: "删除",
    cancelText: "取消",
  });
  if (!confirm) {
    return;
  }
  
  await deleteByIds<#=Table_Up#>(<#=table#>_ids_selected);
  
  uni.showToast({
    title: `删除 ${ len } 个<#=table_comment#>成功`,
    icon: "none",
  });
  
  await onRefresh();
  
  <#=table#>_ids_selected = [ ];
  isEditing = false;
}<#
}
#><#
if (is_export_excel) {
#>

/** 导出<#=table_comment#> */
async function onExportExcel<#=Table_Up#>() {
  await exportExcel<#=Table_Up#>(
    getSearch<#=Table_Up#>(),
  );
}<#
}
#>

const pgSize = 20;
let pgOffset = 0;
let total = $ref<number>(0);
let isLoading = $ref(false);
let isEnd = false;

async function onSearch() {
  uni.setStorage({
    key: searchKey,
    data: {<#
  for (let i = 0; i < search_fields.length; i++) {
    const search_field = search_fields[i];
    const column = columns.find((col) => col.COLUMN_NAME === search_field);
    if (!column && search_field !== searchByKeyword?.prop) {
      throw new Error(`表: ${ mod }_${ table } 中配置的搜索字段 ${ search_field } 在列中不存在`);
    }
    const column_name = column?.COLUMN_NAME;
    const prop = search_field === searchByKeyword?.prop ? searchByKeyword.prop : column_name;
  #>
      <#=prop#>: search.<#=prop#>,<#
  }
  #>
    },
  });
  pgOffset = 0;
  await onRefresh();
}

function getSearch<#=Table_Up#>() {
  const search2: SearchType = {<#
  for (let i = 0; i < search_fields.length; i++) {
    const search_field = search_fields[i];
    const column = columns.find((col) => col.COLUMN_NAME === search_field);
    if (!column && search_field !== searchByKeyword?.prop) {
      throw new Error(`表: ${ mod }_${ table } 中配置的搜索字段 ${ search_field } 在列中不存在`);
    }
    const column_name = column?.COLUMN_NAME;
    const data_type = column?.DATA_TYPE;
    const prop = search_field === searchByKeyword?.prop ? searchByKeyword.prop : column_name;
    
    if (search_field === searchByKeyword?.prop) {
  #>
    <#=prop#>: search.<#=prop#>?.trim() || undefined,<#
    } else if (data_type === "date" || data_type === "datetime" || data_type === "timestamp") {
  #>
    <#=column_name#>: [ search.<#=column_name#>[0], search.<#=column_name#>[1] ],<#
    } else {
  #>
    <#=column_name#>: search.<#=column_name#>?.trim() || undefined,<#
    }
  }
  #>
  };<#
  for (let i = 0; i < search_fields.length; i++) {
    const search_field = search_fields[i];
    const column = columns.find((col) => col.COLUMN_NAME === search_field);
    if (!column && search_field !== searchByKeyword?.prop) {
      continue;
    }
    if (search_field === searchByKeyword?.prop) {
      continue;
    }
    const column_name = column?.COLUMN_NAME;
    const data_type = column?.DATA_TYPE;
    
    if (data_type === "date" || data_type === "datetime" || data_type === "timestamp") {
  #>
  if (search2.<#=column_name#>?.[0]) {
    search2.<#=column_name#>[0] = dayjs(search2.<#=column_name#>[0]).startOf("day").format("YYYY-MM-DDTHH:mm:ss");
  }
  if (search2.<#=column_name#>?.[1]) {
    search2.<#=column_name#>[1] = dayjs(search2.<#=column_name#>[1]).endOf("day").format("YYYY-MM-DDTHH:mm:ss");
  }<#
    }
  }
  #>
  return search2;
}

async function onRefresh() {
  if (isLoading) {
    return;
  }
  isLoading = true;
  pgOffset = 0;
  
  try {
    <#=table#>_ids_selected = [ ];
    
    [
      <#=table#>_models,
      total,
    ] = await Promise.all([
      findAll<#=Table_Up#>(
        getSearch<#=Table_Up#>(),
        {
          pgSize,
          pgOffset,
        },
        undefined,
        {
          notLoading: true,
        },
      ),
      findCount<#=Table_Up#>(
        getSearch<#=Table_Up#>(),
        {
          notLoading: true,
        },
      ),
    ]);
    
    if (!<#=table#>_models.some((item) => item.id === <#=table#>_id_selected)) {
      <#=table#>_id_selected = undefined;
    }
    <#=table#>_ids_selected = <#=table#>_ids_selected
      .filter((id) => <#=table#>_models.some((item2) => item2.id === id));
    const len = <#=table#>_models.length;
    isEnd = len < pgSize;
    pgOffset = len;
    await uni.setStorage({
      key: <#=table#>_models_key,
      data: <#=table#>_models,
    });
  } finally {
    isLoading = false;
  }
}

async function onLoadMore() {
  if (isLoading) {
    return;
  }
  if (isEnd) {
    isLoading = false;
    return;
  }
  isLoading = true;
  try {
    const <#=table#>_models_new = await findAll<#=Table_Up#>(
      getSearch<#=Table_Up#>(),
      {
        pgSize,
        pgOffset,
      },
      undefined,
      {
        notLoading: true,
      },
    );
    const len = <#=table#>_models_new.length;
    if (len < pgSize) {
      isEnd = true;
    }
    if (len > 0) {
      pgOffset += len;
      <#=table#>_models.push(...<#=table#>_models_new);
    }
    if (!<#=table#>_models.some((item) => item.id === <#=table#>_id_selected)) {
      <#=table#>_id_selected = undefined;
    }
    await uni.setStorage({
      key: <#=table#>_models_key,
      data: <#=table#>_models,
    });
  } finally {
    isLoading = false;
  }
}

let refresherTriggered = $ref(false);

/** 下拉刷新 */
async function onRefresherrefresh() {
  refresherTriggered = true;
  pgOffset = 0;
  try {
    await onRefresh();
  } finally {
    refresherTriggered = false;
  }
}

async function initFrame() {
  await onRefresh();
  inited = true;
}

initFrame();
</script>
