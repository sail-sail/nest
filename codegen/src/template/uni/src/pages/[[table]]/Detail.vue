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
const hasVersion = columns.some((item) => item.COLUMN_NAME === "version" && !item.onlyCodegenDeno);

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
let hasReviewed = false;
let auditColumn = "";
let auditMod = "";
let auditTable = "";
let auditLabelField = "";
if (hasAudit) {
  auditColumn = opts.audit.column;
  auditMod = opts.audit.auditMod;
  auditTable = opts.audit.auditTable;
  // 是否有复核
  hasReviewed = opts?.audit?.hasReviewed;
  const auditStatusColumn = columns.find((item) => item.COLUMN_NAME === auditColumn);
  auditLabelField = auditStatusColumn?.modelLabel || `${ auditColumn }_lbl`;
}
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
      un-m="x-2"
    >
      
      <tm-form
        ref="formRef"
        v-model="<#=table#>_input"<#
        if (opts?.isUniPage?.detailFormWidth) {
        #>
        :label-width="opts?.isUniPage?.detailFormWidth"<#
        } else {
        #>
        :label-width="160"<#
        }
        #>
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
        const placeholderInForm = column.placeholderInForm;
        const foreignKey = column.foreignKey;
        if (foreignKey && foreignKey.showType === "dialog") {
          continue;
        }
        const foreignTable = foreignKey && foreignKey.table;
        const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        let foreignSchema = undefined;
        if (foreignKey) {
          foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
        }
        const modelLabel = column.modelLabel;
        const isImg = column.isImg;
        const isAtt = column.isAtt;
        const fieldPermit = column.fieldPermit;
      #><#
        if (foreignKey) {
        #>
        
        <!-- <#=column_comment#> -->
        <template
          v-if="<#
          if (fieldPermit) {
          #>fieldPermit('<#=column_name#>') && <#
          }
          #>props.hideFields?.includes('<#=column_name#>') !== true"
        >
          <tm-form-item<#
            if (column.noAdd === true) {
            #>
            v-if="dialogAction !== 'add' && dialogAction !== 'copy'"<#
            }
            #>
            label="<#=column_comment#>"
            name="<#=column_name#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            } else {
            #>
            :readonly="isReadonly"<#
            }
            #><#
            if (!require) {
            #>
            :required="false"<#
            }
            #>
          >
            <CustomSelectModal
              v-model="<#=table#>_input.<#=column_name#>"<#
              if (modelLabel) {
              #>
              v-model:model-label="<#=table#>_input.<#=modelLabel#>"<#
              }
              #><#
              if (placeholderInForm) {
              #>
              placeholder="<#=placeholderInForm#>"<#
              } else {
              #>
              placeholder="请选择 <#=column_comment#>"<#
              }
              #>
              :method="getList<#=Foreign_Table_Up#>"<#
              if (foreignKey.multiple) {
              #>
              multiple<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #><#
              if (foreignKey.uniCustomSelectModalPage) {
              #>
              :init-data="false"
              :is-page="true"
              search-key="<#=foreignKey.uniCustomSelectModalPage.searchKey#>"<#
              if (foreignKey.uniCustomSelectModalPage.searchIds) {
              #>
              search-ids="<#=foreignKey.uniCustomSelectModalPage.searchIds#>"<#
              }
              #><#
              }
              #>
            ></CustomSelectModal>
          </tm-form-item>
        </template><#
        } else if (isImg) {
        #>
        
        <!-- <#=column_comment#> -->
        <template
          v-if="<#
          if (fieldPermit) {
          #>fieldPermit('<#=column_name#>') && <#
          }
          #>props.hideFields?.includes('<#=column_name#>') !== true"
        >
          <!-- <#=column_comment#> -->
          <tm-form-item<#
            if (column.noAdd === true) {
            #>
            v-if="dialogAction !== 'add' && dialogAction !== 'copy'"<#
            }
            #>
            label="<#=column_comment#>"
            name="<#=column_name#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            } else {
            #>
            :readonly="isReadonly"<#
            }
            #><#
            if (!require) {
            #>
            :required="false"<#
            }
            #>
          >
            <CustomUploadImage
              v-model="<#=table#>_input.<#=column_name#>"<#
              if (placeholderInForm) {
              #>
              placeholder="<#=placeholderInForm#>"<#
              } else {
              #>
              placeholder="上传<#=column_comment#>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #>
            ></CustomUploadImage>
          </tm-form-item>
        </template><#
        } else if (isAtt) {
        #>
        
        <!-- <#=column_comment#> -->
        <template
          v-if="<#
          if (fieldPermit) {
          #>fieldPermit('<#=column_name#>') && <#
          }
          #>props.hideFields?.includes('<#=column_name#>') !== true"
        >
          <!-- <#=column_comment#> -->
          <tm-form-item<#
            if (column.noAdd === true) {
            #>
            v-if="dialogAction !== 'add' && dialogAction !== 'copy'"<#
            }
            #>
            label="<#=column_comment#>"
            name="<#=column_name#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            } else {
            #>
            :readonly="isReadonly"<#
            }
            #><#
            if (!require) {
            #>
            :required="false"<#
            }
            #>
          >
            <CustomAtt
              v-model="<#=table#>_input.<#=column_name#>"<#
              if (placeholderInForm) {
              #>
              placeholder="<#=placeholderInForm#>"<#
              } else {
              #>
              placeholder="添加附件"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #>
            ></CustomAtt>
          </tm-form-item>
        </template><#
        } else if (data_type === "datetime" || data_type === "date") {
        #>
        
        <!-- <#=column_comment#> -->
        <template
          v-if="<#
          if (fieldPermit) {
          #>fieldPermit('<#=column_name#>') && <#
          }
          #>props.hideFields?.includes('<#=column_name#>') !== true"
        >
          <!-- <#=column_comment#> -->
          <tm-form-item<#
            if (column.noAdd === true) {
            #>
            v-if="dialogAction !== 'add' && dialogAction !== 'copy'"<#
            }
            #>
            label="<#=column_comment#>"
            name="<#=column_name#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            } else {
            #>
            :readonly="isReadonly"<#
            }
            #><#
            if (!require) {
            #>
            :required="false"<#
            }
            #>
          >
            <CustomDate
              v-model="<#=table#>_input.<#=column_name#>"<#
              if (data_type === "datetime") {
              #>
              format="YYYY-MM-DD hh:mm:ss"
              type="second"<#
              }
              #><#
              if (placeholderInForm) {
              #>
              placeholder="<#=placeholderInForm#>"<#
              } else {
              #>
              placeholder="请选择 <#=column_comment#>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #>
            ></CustomDate>
          </tm-form-item>
        </template><#
        } else if (column.dict) {
        #>
        
        <!-- <#=column_comment#> -->
        <template
          v-if="<#
          if (fieldPermit) {
          #>fieldPermit('<#=column_name#>') && <#
          }
          #>props.hideFields?.includes('<#=column_name#>') !== true"
        >
          <!-- <#=column_comment#> -->
          <tm-form-item<#
            if (column.noAdd === true) {
            #>
            v-if="dialogAction !== 'add' && dialogAction !== 'copy'"<#
            }
            #>
            label="<#=column_comment#>"
            name="<#=column_name#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            } else {
            #>
            :readonly="isReadonly"<#
            }
            #><#
            if (!require) {
            #>
            :required="false"<#
            }
            #>
          ><#
            if (hasAudit && column_name === auditColumn) {
            #>
            <AuditHistoryField
              v-model="<#=table#>_input.<#=column_name#>"
              :model-label="<#=table#>_input.<#=auditLabelField#>"
              title="审核历史"
              placeholder="请选择 <#=column_comment#>"
              readonly-placeholder="暂无审核记录"
              :record-id="<#=table#>_id"
              record-key="<#=table#>_id"
              :method="findAll<#=auditTable_Up#>"
              :disabled="dialogAction === 'add' || dialogAction === 'copy'"
            ></AuditHistoryField><#
            } else {
            #>
            <DictSelect
              v-model="<#=table#>_input.<#=column_name#>"<#
              if (modelLabel) {
              #>
              v-model:model-label="<#=table#>_input.<#=modelLabel#>"<#
              } else {
              #>
              v-model:model-label="<#=table#>_input.<#=column_name#>_lbl"<#
              }
              #><#
              if (placeholderInForm) {
              #>
              placeholder="<#=placeholderInForm#>"<#
              } else {
              #>
              placeholder="请选择 <#=column_comment#>"<#
              }
              #>
              code="<#=column.dict#>"<#
              if (readonlyPlaceholder) {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #>
            ></DictSelect><#
            }
            #>
          </tm-form-item>
        </template><#
        } else if (column.dictbiz) {
        #>
        
        <!-- <#=column_comment#> -->
        <template
          v-if="<#
          if (fieldPermit) {
          #>fieldPermit('<#=column_name#>') && <#
          }
          #>props.hideFields?.includes('<#=column_name#>') !== true"
        >
          <!-- <#=column_comment#> -->
          <tm-form-item<#
            if (column.noAdd === true) {
            #>
            v-if="dialogAction !== 'add' && dialogAction !== 'copy'"<#
            }
            #>
            label="<#=column_comment#>"
            name="<#=column_name#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            } else {
            #>
            :readonly="isReadonly"<#
            }
            #><#
            if (!require) {
            #>
            :required="false"<#
            }
            #>
          >
            <DictbizSelect
              v-model="<#=table#>_input.<#=column_name#>"<#
              if (modelLabel) {
              #>
              v-model:model-label="<#=table#>_input.<#=modelLabel#>"<#
              } else {
              #>
              v-model:model-label="<#=table#>_input.<#=column_name#>_lbl"<#
              }
              #><#
              if (placeholderInForm) {
              #>
              placeholder="<#=placeholderInForm#>"<#
              } else {
              #>
              placeholder="请选择 <#=column_comment#>"<#
              }
              #>
              code="<#=column.dictbiz#>"<#
              if (readonlyPlaceholder) {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #>
            ></DictbizSelect>
          </tm-form-item>
        </template><#
        } else if (column_type.startsWith("int(1)") || column_type.startsWith("tinyint(1)")) {
          /* TODO: 是否生成开关 */
        #><#
        } else if (data_type === "int" || data_type === "float" || data_type === "double") {
        #>
        
        <!-- <#=column_comment#> -->
        <template
          v-if="<#
          if (fieldPermit) {
          #>fieldPermit('<#=column_name#>') && <#
          }
          #>props.hideFields?.includes('<#=column_name#>') !== true"
        >
          <!-- <#=column_comment#> -->
          <tm-form-item<#
            if (column.noAdd === true) {
            #>
            v-if="dialogAction !== 'add' && dialogAction !== 'copy'"<#
            }
            #>
            label="<#=column_comment#>"
            name="<#=column_name#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            } else {
            #>
            :readonly="isReadonly"<#
            }
            #><#
            if (!require) {
            #>
            :required="false"<#
            }
            #>
          >
            <CustomInput
              v-model="<#=table#>_input.<#=column_name#>"
              type="number"<#
              if (placeholderInForm) {
              #>
              placeholder="<#=placeholderInForm#>"<#
              } else {
              #>
              placeholder="请输入 <#=column_comment#>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #>
            ></CustomInput>
          </tm-form-item>
        </template><#
        } else if (data_type === "decimal") {
        #>
        
        <!-- <#=column_comment#> -->
        <template
          v-if="<#
          if (fieldPermit) {
          #>fieldPermit('<#=column_name#>') && <#
          }
          #>props.hideFields?.includes('<#=column_name#>') !== true"
        >
          <!-- <#=column_comment#> -->
          <tm-form-item<#
            if (column.noAdd === true) {
            #>
            v-if="dialogAction !== 'add' && dialogAction !== 'copy'"<#
            }
            #>
            label="<#=column_comment#>"
            name="<#=column_name#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            } else {
            #>
            :readonly="isReadonly"<#
            }
            #><#
            if (!require) {
            #>
            :required="false"<#
            }
            #>
          >
            <CustomInput
              v-model="<#=table#>_input.<#=column_name#>"
              type="decimal"<#
              if (placeholderInForm) {
              #>
              placeholder="<#=placeholderInForm#>"<#
              } else {
              #>
              placeholder="请输入 <#=column_comment#>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #><#
              if (column.isHideZero === false) {
              #>
              :is-hide-zero="false"<#
              }
              #>
            ></CustomInput>
          </tm-form-item>
        </template><#
        } else if (column.isCountyLbl) {
        #>
        
        <!-- <#=column_comment#> -->
        <template
          v-if="<#
          if (fieldPermit) {
          #>fieldPermit('<#=column_name#>') && <#
          }
          #>props.hideFields?.includes('<#=column_name#>') !== true"
        >
          <!-- <#=column_comment#> -->
          <tm-form-item<#
            if (column.noAdd === true) {
            #>
            v-if="dialogAction !== 'add' && dialogAction !== 'copy'"<#
            }
            #>
            label="<#=column_comment#>"
            name="<#=column_name#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            } else {
            #>
            :readonly="isReadonly"<#
            }
            #><#
            if (!require) {
            #>
            :required="false"<#
            }
            #>
          >
            <CustomCityPicker
              v-model="<#=column_name#>_city_picker"<#
              if (placeholderInForm) {
              #>
              placeholder="<#=placeholderInForm#>"<#
              } else {
              #>
              placeholder="请选择 <#=column_comment#>"<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isReadonly"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #>
            ></CustomCityPicker>
          </tm-form-item>
        </template><#
        } else {
        #>
        
        <!-- <#=column_comment#> -->
        <template
          v-if="<#
          if (fieldPermit) {
          #>fieldPermit('<#=column_name#>') && <#
          }
          #>props.hideFields?.includes('<#=column_name#>') !== true"
        >
          <!-- <#=column_comment#> -->
          <tm-form-item<#
            if (column.noAdd === true) {
            #>
            v-if="dialogAction !== 'add' && dialogAction !== 'copy'"<#
            }
            #>
            label="<#=column_comment#>"
            name="<#=column_name#>"<#
            if (column.readonly) {
            #>
            :readonly="true"<#
            } else {
            #>
            :readonly="isReadonly"<#
            }
            #><#
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
              height="130"<#
              }
              #><#
              if (placeholderInForm) {
              #>
              placeholder="<#=placeholderInForm#>"<#
              } else {
              #>
              placeholder="请输入 <#=column_comment#>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #>
            ></CustomInput>
          </tm-form-item>
        </template><#
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
        :line-full="true"
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
            @click="onCopy<#=Table_Up#>"
          >
            复制
          </view>
          
          <view
            un-text="[var(--color-primary)]"
            un-p="x-2 y-2"
            un-box-border
            un-cursor="pointer"
            @click="onEdit<#=Table_Up#>"
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
            un-flex="~ [1_0_0]"
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
            un-flex="~ [1_0_0]"
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
            un-flex="~ [1_0_0]"
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
            un-flex="~ [1_0_0]"
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
            un-flex="~ [1_0_0]"
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
            un-flex="~ [1_0_0]"
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
            un-flex="~ [1_0_0]"
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
            un-flex="~ [1_0_0]"
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
          un-justify="center"
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
          un-justify="center"
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
          un-justify="center"
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
          un-justify="center"
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
          un-justify="center"
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
          un-justify="center"
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
          un-justify="center"
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
      un-p="t-[300px]"
      un-box-border
    ></view>
    
  </scroll-view><#
  if (opts.noCopy !== true || opts.noEdit !== true || opts.noAdd !== true || hasAudit) {
  #>
  
  <view
    v-if="dialogAction !== 'view'<#
    if (opts.noEdit === true || opts.noAdd === true) {
    #> &&<#
    }
    #><#
    if (opts.noEdit === true) {
    #>dialogAction === 'add'<#
    } else if (opts.noAdd === true) {
    #>dialogAction === 'edit'<#
    }
    #>"
    un-p="x-2 b-2"
    un-box-border
    un-flex="~"
    un-justify="center"
    un-items="center"
    un-gap="x-4"
  >

    <view
      v-if="props.hasCloseBtn"
      un-flex="~ [1_0_0]"
      un-overflow="hidden"
      un-justify="center"
      un-items="center"
    >
      <tm-button
        block
        color="info"
        @click="onCancel"
      >
        取消
      </tm-button>
    </view>

    <view
      un-flex="~ [1_0_0]"
      un-overflow="hidden"
      un-justify="center"
      un-items="center"
    >
      <CustomActionBar
        ref="actionBarRef"
        trigger-text="操作"
        trigger-color="info"
      ><#
        if (hasAudit) {
        #>

        <view
          v-if="dialogAction === 'edit'"
          un-flex="~"
          un-gap="x-2"
        ><#
          if (!hasReviewed) {
          #>

          <CustomActionButton
            v-if="permit('audit_pass', '审核通过') &&
              <#=table#>_model?.<#=auditColumn#> === <#=Table_Up#>Audit.Audited
            "
            report
            disabled
          >
            已审核
          </CustomActionButton><#
          }
          #>

          <CustomActionButton
            v-if="permit('audit_reject', '审核拒绝') &&
              <#=table#>_model?.<#=auditColumn#> === <#=Table_Up#>Audit.Unaudited
            "
            report
            color="danger"
            @click="actionBarRef?.close(); onAuditReject();"
          >
            审核拒绝
          </CustomActionButton>

          <CustomActionButton
            v-if="permit('audit_submit', '审核提交') &&
              (
                <#=table#>_model?.<#=auditColumn#> === <#=Table_Up#>Audit.Unsubmited ||
                <#=table#>_model?.<#=auditColumn#> === <#=Table_Up#>Audit.Rejected
              )
            "
            report
            @click="actionBarRef?.close(); onAuditSubmit();"
          >
            审核提交
          </CustomActionButton><#
          if (hasReviewed) {
          #>

          <CustomActionButton
            v-if="permit('audit_pass', '审核通过') &&
              <#=table#>_model?.<#=auditColumn#> === <#=Table_Up#>Audit.Audited
            "
            report
            color="success"
            @click="actionBarRef?.close(); onAuditPass();"
          >
            审核通过
          </CustomActionButton><#
          }
          #><#
          if (opts?.audit?.hasReverse) {
          #>

          <CustomActionButton
            v-if="permit('audit_reverse', '反审核') &&
              (
                <#=table#>_model?.<#=auditColumn#> === <#=Table_Up#>Audit.Unaudited ||
                <#=table#>_model?.<#=auditColumn#> === <#=Table_Up#>Audit.Audited<#
                if (hasReviewed) {
                #> ||
                <#=table#>_model?.<#=auditColumn#> === <#=Table_Up#>Audit.Reviewed<#
                }
                #>
              )
            "
            report
            color="warn"
            @click="actionBarRef?.close(); onAuditReverse();"
          >
            反审核
          </CustomActionButton><#
          }
          #><#
          if (hasReviewed) {
          #>

          <CustomActionButton
            v-if="permit('audit_review', '复核') &&
              <#=table#>_model?.<#=auditColumn#> === <#=Table_Up#>Audit.Audited
            "
            report
            @click="actionBarRef?.close(); onAuditReview();"
          >
            复核
          </CustomActionButton><#
          }
          #><#
          if (hasReviewed) {
          #>

          <CustomActionButton
            v-if="permit('audit_review', '复核') &&
              <#=table#>_model?.<#=auditColumn#> === <#=Table_Up#>Audit.Reviewed &&
              !permit('audit_reverse', '反审核')
            "
            report
            disabled
          >
            已复核
          </CustomActionButton><#
          }
          #>

        </view>

        <CustomDivider
          v-if="dialogAction === 'edit'"
          class="custom-action-bar-single-hide"
          :show-text="false"
          un-p="y-0 x-0"
        ></CustomDivider><#
        }
        #>

        <view
          v-if="dialogAction === 'edit'"
          un-flex="~"
          un-gap="x-2"
        ><#
          if (opts.noCopy !== true) {
          #>

          <CustomActionButton
            v-if="permit('add', '新增') && <#=table#>_id"
            report
            color="info"
            @click="actionBarRef?.close(); onCopy();"
          >
            复制
          </CustomActionButton><#
          }
          #><#
          if (!opts.noEdit) {
          #>

          <CustomActionButton
            v-if="permit('edit', '编辑')"
            report
            :disabled="!inited || is_form_hydrating || isReadonly"
            @click="actionBarRef?.close(); formRef?.submit();"
          >
            保存
          </CustomActionButton><#
          }
          #>

        </view>

        <CustomDivider
          v-if="dialogAction === 'edit'"
          class="custom-action-bar-single-hide"
          :show-text="false"
          un-p="y-0 x-0"
        ></CustomDivider>

        <template
          v-if="dialogAction === 'copy' || dialogAction === 'add'"
        ><#
          if (!opts.noAdd) {
          #>

          <CustomActionButton
            v-if="permit('add', '新增')"
            report
            :disabled="!inited || is_form_hydrating"
            @click="actionBarRef?.close(); formRef?.submit();"
          >
            保存
          </CustomActionButton><#
          }
          #>

        </template>

        <CustomDivider
          v-if="dialogAction === 'copy' || dialogAction === 'add'"
          class="custom-action-bar-single-hide"
          :show-text="false"
          un-p="y-0 x-0"
        ></CustomDivider>
      </CustomActionBar>
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
  getPagePath<#=Table_Up#>,<#
  if (hasAudit) {
  #>
  auditSubmit<#=Table_Up#>,
  auditPass<#=Table_Up#>,
  auditReverse<#=Table_Up#>,
  auditReject<#=Table_Up#>,<#
  if (hasReviewed) {
  #>
  auditReview<#=Table_Up#>,<#
  }
  #><#
}
#>
} from "./Api.ts";<#
if (hasAudit) {
#>

import {
  findAll<#=auditTable_Up#>,
} from "../<#=auditTable#>/Api.ts";

import {
  <#=Table_Up#>Audit,
} from "#/types.ts";<#
}
#>

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
if (county_lbl_column) {
#>

import {
  findNameByCodePcaCode,
} from "@/components/CustomCityPicker/CustomCityPickerApi.ts";<#
}
#><#
if (hasAudit) {
#>

import AuditHistoryField from "@/components/AuditHistoryField/AuditHistoryField.vue";<#
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

// <#=inlineForeignTab.label#>
import <#=Table_Up#>DetailModal from "@/pages/<#=table#>/DetailModal.vue";

import {
  getDefaultInput<#=Table_Up#>,
} from "@/pages/<#=table#>/Api.ts";<#
}
#>

const pagePath = getPagePath<#=Table_Up#>();
const permitStore = usePermitStore();<#
if (tableFieldPermit) {
#>
const fieldPermitStore = useFieldPermitStore();<#
}
#>

const {
  permit,
  permitAsync,
} = permitStore.getPermit(pagePath);<#
if (tableFieldPermit) {
#>
const {
  fieldPermit,
  fieldPermitAsync,
} = fieldPermitStore.getFieldPermit(pagePath);<#
}
#>

let inited = $ref(false);

let <#=table#>_id = $ref<<#=Table_Up#>Id>();

let <#=table#>_input = $ref<<#=Table_Up#>Input>({ });
let <#=table#>_model = $ref<<#=Table_Up#>Model>();<#
if (county_lbl_column) {
#>

/** 选择省市区县 */
const <#=county_lbl_column.COLUMN_NAME#>_city_picker = $computed<[string, string, string] | undefined>({
  get() {
    return [
      <#=table#>_input.<#=province_code_column.COLUMN_NAME#> ?? "",
      <#=table#>_input.<#=city_code_column.COLUMN_NAME#> ?? "",
      <#=table#>_input.<#=county_code_column.COLUMN_NAME#> ?? "",
    ] as [string, string, string];
  },
  async set(codes) {
    const <#=province_code_column.COLUMN_NAME#> = codes?.[0] ?? "";
    const <#=province_lbl_column.COLUMN_NAME#> = await findNameByCodePcaCode(<#=province_code_column.COLUMN_NAME#>);
    const <#=city_code_column.COLUMN_NAME#> = codes?.[1] ?? "";
    const <#=city_lbl_column.COLUMN_NAME#> = await findNameByCodePcaCode(<#=city_code_column.COLUMN_NAME#>);
    const <#=county_code_column.COLUMN_NAME#> = codes?.[2] ?? "";
    const <#=county_lbl_column.COLUMN_NAME#> = await findNameByCodePcaCode(<#=county_code_column.COLUMN_NAME#>);
    <#=table#>_input.<#=province_code_column.COLUMN_NAME#> = <#=province_code_column.COLUMN_NAME#>;
    <#=table#>_input.<#=province_lbl_column.COLUMN_NAME#> = <#=province_lbl_column.COLUMN_NAME#>;
    <#=table#>_input.<#=city_code_column.COLUMN_NAME#> = <#=city_code_column.COLUMN_NAME#>;
    <#=table#>_input.<#=city_lbl_column.COLUMN_NAME#> = <#=city_lbl_column.COLUMN_NAME#>;
    <#=table#>_input.<#=county_code_column.COLUMN_NAME#> = <#=county_code_column.COLUMN_NAME#>;
    <#=table#>_input.<#=county_lbl_column.COLUMN_NAME#> = <#=county_lbl_column.COLUMN_NAME#>;
  },
});<#
}
#>

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
    if (column.autoCode) continue;
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
let isReadonly = $ref(false);

watch(
  () => dialogAction,
  () => {
    if (dialogAction === "view") {
      isReadonly = true;
    }
  },
  {
    immediate: true,
  },
);

const formRef = $ref<InstanceType<typeof TmForm>>();
let is_form_hydrating = $ref(false);

const actionBarRef = $ref<{
  close: () => void;
}>();

/** 复制 */
async function onCopy() {
  if (!<#=table#>_id) {
    return;
  }
  if (!await permitAsync('add')) {
    uni.showToast({
      title: "无新增权限",
      icon: "none",
    });
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
  if (dialogAction === "view") {
    return;
  }
  if (!inited || is_form_hydrating) {
    return;
  }
  if (dialogAction === "add" || dialogAction === "copy") {<#
    if (opts.noAdd !== true) {
    #>
    if (!await permitAsync('add')) {
      uni.showToast({
        title: "无新增权限",
        icon: "none",
      });
      return;
    }<#
    } else {
    #>
    return;<#
    }
    #>
  }
  if (dialogAction === "edit") {<#
    if (opts.noEdit !== true) {
    #>
    if (!await permitAsync('edit')) {
      uni.showToast({
        title: "无编辑权限",
        icon: "none",
      });
      return;
    }<#
    } else {
    #>
    return;<#
    }
    #>
  }
  if (formSubmitResult?.isPass === false) {
    const firstValid = formSubmitResult.firstValid;
    if (firstValid) {
      uni.showToast({
        title: firstValid.message,
        icon: "none",
      });
    }
    return;
  }
  
  if (props.beforeSave) {
    const canSave = await props.beforeSave(<#=table#>_input);
    if (!canSave) {
      return;
    }
  }
  const currentAction = dialogAction;
  
  if (currentAction === "copy" || currentAction === "add") {
    const created_id = await create<#=Table_Up#>(
      <#=table#>_input,
    );
    await uni.showModal({
      content: "新增成功",
      showCancel: false,
    });
    if (backAfterSaveInner) {
      await uni.navigateBack();
    } else {
      <#=table#>_id = created_id;
      dialogAction = "edit";
      await onRefresh();
    }
    uni.$emit("/pages/<#=table#>/List:refresh", {
      action: currentAction,
    });
  } else if (currentAction === "edit") {
    if (!<#=table#>_id) {
      uni.showToast({
        title: "编辑失败, id 不能为空",
        icon: "none",
      });
      return;
    }
    await updateById<#=Table_Up#>(
      <#=table#>_id,
      <#=table#>_input,
    );
    await uni.showModal({
      content: "编辑成功",
      showCancel: false,
    });
    if (backAfterSaveInner) {
      await uni.navigateBack();
    } else {
      await onRefresh();
    }
    uni.$emit("/pages/<#=table#>/List:refresh");
  }
  
}<#
if (hasAudit) {
#>

/** 审核提交 */
async function onAuditSubmit() {
  if (!<#=table#>_id) {
    return;
  }
  if (!await permitAsync('audit_submit')) {
    return;
  }
  const { confirm } = await uni.showModal({
    title: "审核提交",
    content: "确定要审核提交吗",
    showCancel: true,
  });
  if (!confirm) {
    return;
  }
  await auditSubmit<#=Table_Up#>(<#=table#>_id);
  await uni.showModal({
    content: "审核提交成功",
    showCancel: false,
  });
  await onRefresh();
  uni.$emit("/pages/<#=table#>/List:refresh");
}

/** 反审核 */
async function onAuditReverse() {
  if (!<#=table#>_id) {
    return;
  }
  if (!await permitAsync('audit_reverse')) {
    return;
  }
  const { confirm } = await uni.showModal({
    title: "反审核",
    content: "确认要反审核吗",
    showCancel: true,
  });
  if (!confirm) {
    return;
  }
  await auditReverse<#=Table_Up#>(<#=table#>_id);
  await uni.showModal({
    content: "反审核成功",
    showCancel: false,
  });
  await onRefresh();
  uni.$emit("/pages/<#=table#>/List:refresh");
}

/** 审核通过 */
async function onAuditPass() {
  if (!<#=table#>_id) {
    return;
  }
  if (!await permitAsync('audit_pass')) {
    return;
  }
  const { confirm } = await uni.showModal({
    title: "审核通过",
    content: "确定要审核通过吗",
    showCancel: true,
  });
  if (!confirm) {
    return;
  }
  await auditPass<#=Table_Up#>(<#=table#>_id);
  await uni.showModal({
    content: "审核通过成功",
    showCancel: false,
  });
  await onRefresh();
  uni.$emit("/pages/<#=table#>/List:refresh");
}

/** 审核拒绝 */
async function onAuditReject() {
  if (!<#=table#>_id) {
    return;
  }
  if (!await permitAsync('audit_reject')) {
    return;
  }
  const { confirm, content } = await uni.showModal({
    title: "审核拒绝",
    content: "请输入原因",
    editable: true,
    placeholderText: "请输入原因",
  });
  if (!confirm) {
    return;
  }
  const rem = (content || "").trim();
  if (!rem) {
    uni.showToast({
      title: "请输入原因",
      icon: "none",
    });
    return;
  }
  await auditReject<#=Table_Up#>(<#=table#>_id, {
    rem,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  await uni.showModal({
    content: "审核拒绝成功",
    showCancel: false,
  });
  await onRefresh();
  uni.$emit("/pages/<#=table#>/List:refresh");
}<#
if (hasReviewed) {
#>
/** 复核通过 */
async function onAuditReview() {
  if (!<#=table#>_id) {
    return;
  }
  if (!await permitAsync('audit_review')) {
    return;
  }
  const { confirm } = await uni.showModal({
    title: "复核",
    content: "确定要复核通过吗",
    showCancel: true,
  });
  if (!confirm) {
    return;
  }
  await auditReview<#=Table_Up#>(<#=table#>_id);
  await uni.showModal({
    content: "复核通过成功",
    showCancel: false,
  });
  await onRefresh();
  uni.$emit("/pages/<#=table#>/List:refresh");
}<#
}
#><#
}
#>

/** 刷新 */
async function onRefresh() {
  is_form_hydrating = true;
  try {
    formRef?.resetValidation();
    if (dialogAction === "add") {
      <#=table#>_input = await getDefaultInput<#=Table_Up#>();
      <#=table#>_input = {
        ...<#=table#>_input,
        ...getMergedInputPatch(),
      };<#
      if (hasOrderBy) {
      #>
      if (props.order_by) {
        <#=table#>_input.order_by = props.order_by;
      }<#
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
      const [
        defaultInput,
      ] = await Promise.all([
        getDefaultInput<#=Table_Up#>(),
      ]);
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
      <#=table#>_input = {
        ...<#=table#>_input,
        ...getMergedInputPatch(),
        id: undefined,<#
        if (hasAudit) {
        #>
        audit: <#=Table_Up#>Audit.Unsubmited,
        audit_lbl: "待提交",<#
        }
        #>
      };<#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        if (column.onlyCodegenDeno) continue;
        if (column.noDetail) continue;
        if (column.isAtt) continue;
        const column_name = column.COLUMN_NAME;
        if (column_name === "id") continue;
        if (column_name === "is_locked") continue;
        if (column_name === "is_deleted") continue;
        if (column_name === "version") continue;
        if (column_name === "tenant_id") continue;
        if (column_name === "order_by") continue;
        if (hasAudit && column_name === auditColumn) continue;
        if (!column.readonly) continue;
        const bpm = opts?.bpm;
        const isBpmField =
          bpm?.bpm_status_field === column_name ||
          bpm?.apply_usr_id_field === column_name ||
          bpm?.apply_usr_id_lbl_field === column_name ||
          bpm?.apply_time_field === column_name;
        if (isBpmField) continue;
      #>
      <#=table#>_input.<#=column_name#> = defaultInput.<#=column_name#>;<#
      }
      #><#
      if (hasDefault) {
      #>
      <#=table#>_input.is_default = undefined;
      <#=table#>_input.is_default_lbl = undefined;<#
      }
      #><#
      if (hasLocked) {
      #>
      <#=table#>_input.is_locked = undefined;
      <#=table#>_input.is_locked_lbl = undefined;<#
      }
      #><#
      if (hasVersion) {
      #>
      <#=table#>_input.version = 0;<#
      }
      #><#
      if (hasOrderBy) {
      #>
      if (props.order_by) {
        <#=table#>_input.order_by = props.order_by;
      } else {
        <#=table#>_input.order_by = 1;
      }<#
      }
      #>
    } else if (dialogAction === "edit" || dialogAction === "view") {
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
  } finally {
    await nextTick();
    is_form_hydrating = false;
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
    !inited || !<#=table#>_detail_modal_ref
  ) {
    return;
  }
  
  let order_by = 1;
  if ((<#=oldTable#>_input.<#=inline_column_name#>?.length || 0) > 0) {
    const max_order_by = Math.max(...<#=oldTable#>_input.<#=inline_column_name#>?.map((it) => it.order_by || 0) || [ ]);
    order_by = max_order_by + 1;
  }
  
  const res = await <#=table#>_detail_modal_ref.showDialog({
    action: "add",
    title: "新增 <#=inlineForeignTab.label#>",
    model: {
      order_by,
    },<#
    if (hasInlineForeignTabs) {
    #>
    hideFields: [<#
      for (const inlineForeignTab of inlineForeignTabs) {
        const table = inlineForeignTab.table;
        const mod = inlineForeignTab.mod;
        const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
        const Table_Up = tableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
        const inline_column_name = inlineForeignTab.column_name;
        const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
        const inlineForeignColumns = inlineForeignSchema.columns;
        const inlineForeignOrgIdColumn = inlineForeignColumns.find((item) => item.COLUMN_NAME === "org_id");
        const inlineForeignHasOrgId = !!inlineForeignOrgIdColumn;
        const inlineForeignHasOrgIdLbl = !!inlineForeignOrgIdColumn?.modelLabel;
      #>
      "<#=inlineForeignTab.column#>",<#
      }
      #><#
      if (hasOrgId) {
      #>
      "org_id",<#
      }
      #>
      "order_by",
    ],
    hasCloseBtn: true,<#
    }
    #>
  });
  
  if (res.type === "cancel") {
    return;
  }
  
  const input = res.input;
  
  <#=oldTable#>_input.<#=inline_column_name#> = <#=oldTable#>_input.<#=inline_column_name#> || [ ];
  
  <#=oldTable#>_input.<#=inline_column_name#>.push({
    ...input,<#
    if (hasOrgId) {
    #>
    org_id: <#=oldTable#>_input.org_id,<#
    }
    #>
    is_deleted: 0,
  } as <#=Table_Up#>Model);
  
  <#=oldTable#>_input.<#=inline_column_name#>.sort((a, b) => (a.order_by || 0) - (b.order_by || 0));
  <#=oldTable#>_input = intoInput<#=oldTable_Up#>(<#=oldTable#>_input);
  
}

/** 复制 */
async function onCopy<#=Table_Up#>() {
  
  if (
    !inited || !<#=table#>_detail_modal_ref
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
      title: "请选择要复制的 <#=inlineForeignTab.label#>",
      icon: "none",
    });
    return;
  }
  
  const index = index_selected_<#=table#>[0];
  const sourceItem = <#=oldTable#>_input.<#=inline_column_name#>?.[index] as <#=Table_Up#>Model | undefined;
  if (!sourceItem) {
    return;
  }
  
  let order_by = 1;
  if ((<#=oldTable#>_input.<#=inline_column_name#>?.length || 0) > 0) {
    const max_order_by = Math.max(...<#=oldTable#>_input.<#=inline_column_name#>?.map((it) => it.order_by || 0) || [ ]);
    order_by = max_order_by + 1;
  }
  
  const defaultInput = await getDefaultInput<#=Table_Up#>();
  const copiedItem = {
    ...defaultInput,
    ...sourceItem,
    id: undefined,
    order_by,<#
    if (hasOrgId) {
    #>
    org_id: <#=oldTable#>_input.org_id,<#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      if (column.noDetail) continue;
      if (column.isAtt) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "is_locked") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "version") continue;
      if (column_name === "tenant_id") continue;
      if (column_name === "order_by") continue;
      if (hasAudit && column_name === auditColumn) continue;
      if (!column.readonly) continue;
      const bpm = opts?.bpm;
      const isBpmField =
        bpm?.bpm_status_field === column_name ||
        bpm?.apply_usr_id_field === column_name ||
        bpm?.apply_usr_id_lbl_field === column_name ||
        bpm?.apply_time_field === column_name;
      if (isBpmField) continue;
    #>
    <#=column_name#>: defaultInput.<#=column_name#>,<#
    }
    #><#
    if (hasDefault) {
    #>
    is_default: undefined,
    is_default_lbl: undefined,<#
    }
    #><#
    if (hasLocked) {
    #>
    is_locked: undefined,
    is_locked_lbl: undefined,<#
    }
    #><#
    if (hasVersion) {
    #>
    version: 0,<#
    }
    #>
    is_deleted: 0,
  } as <#=Table_Up#>Input;
  
  <#=oldTable#>_input.<#=inline_column_name#> = <#=oldTable#>_input.<#=inline_column_name#> || [ ];
  <#=oldTable#>_input.<#=inline_column_name#>.splice(index + 1, 0, copiedItem);
  
  <#=oldTable#>_input.<#=inline_column_name#>.sort((a, b) => (a.order_by || 0) - (b.order_by || 0));
  <#=oldTable#>_input = intoInput<#=oldTable_Up#>(<#=oldTable#>_input);
  
}

/** 编辑 */
async function onEdit<#=Table_Up#>() {
  
  if (
    !inited || !<#=table#>_detail_modal_ref
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
      return <#=oldTable#>_input.<#=inline_column_name#>?.[index] as <#=Table_Up#>Model | undefined;
    },<#
    if (hasInlineForeignTabs) {
      let inlineForeignTabColumnNames = inlineForeignTabs.map((tab) => tab.column);
      inlineForeignTabColumnNames = Array.from(new Set(inlineForeignTabColumnNames));
    #>
    hideFields: [<#
      for (const inlineForeignTabColumnName of inlineForeignTabColumnNames) {
      #>
      "<#=inlineForeignTabColumnName#>",<#
      }
      #><#
      if (hasOrgId) {
      #>
      "org_id",<#
      }
      #>
      "order_by",
    ],
    hasCloseBtn: true<#
    }
    #>
  });
  
  if (res.type === "cancel") {
    return;
  }
  
  const input = res.input;
  
  <#=oldTable#>_input.<#=inline_column_name#> = <#=oldTable#>_input.<#=inline_column_name#> || [ ];
  <#=oldTable#>_input.<#=inline_column_name#>.splice(index, 1, input);
  
  if (<#=oldTable#>_input.<#=inline_column_name#>) {
    Object.assign(<#=oldTable#>_input.<#=inline_column_name#>[index], input);
    <#=oldTable#>_input.<#=inline_column_name#>.sort((a, b) => (a.order_by || 0) - (b.order_by || 0));
    <#=oldTable#>_input = intoInput<#=oldTable_Up#>(<#=oldTable#>_input);
  }
  
}<#
}
#><#
if (hasAudit) {
#>

// 已审核提交的不允许编辑
watch(
  () => [
    inited,
    dialogAction,
    <#=table#>_model?.<#=auditColumn#>,
  ],
  () => {
    if (!inited) {
      return;
    }
    if (
      (dialogAction === "edit" || dialogAction === "view") &&
      (<#=table#>_model?.<#=auditColumn#> === <#=Table_Up#>Audit.Unaudited || <#=table#>_model?.<#=auditColumn#> === <#=Table_Up#>Audit.Audited || <#=table#>_model?.<#=auditColumn#> === <#=Table_Up#>Audit.Reviewed)
    ) {
      isReadonly = true;
    }
  },
);<#
}
#>

async function onCancel() {
  if (props.closeBtnFn) {
    await props.closeBtnFn();
  } else {
    await uni.navigateBack();
  }
}

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
    beforeSave?: (input: <#=Table_Up#>Input) => Promise<boolean>;
    inputPatch?: Partial<<#=Table_Up#>Input>;
    backAfterSave?: boolean;<#
    if (hasOrderBy) {
    #>
    order_by?: number;<#
    }
    #>
    hideFields?: string[];
    hasCloseBtn?: boolean;
    closeBtnFn?: () => Promise<void> | void;
    drawerDisableTeleport?: boolean;
  }>(),
  {
    init: true,
    action: undefined,
    <#=table#>_id: undefined,
    findOne: undefined,
    beforeSave: undefined,
    inputPatch: undefined,
    backAfterSave: true,<#
    if (hasOrderBy) {
    #>
    order_by: undefined,<#
    }
    #>
    hideFields: undefined,
    hasCloseBtn: undefined,
    closeBtnFn: undefined,
    drawerDisableTeleport: undefined,
  },
);

let inputPatchByQuery = $ref<Partial<<#=Table_Up#>Input>>({ });
let backAfterSaveInner = $ref(true);

function getMergedInputPatch(): Partial<<#=Table_Up#>Input> {
  return {
    ...inputPatchByQuery,
    ...props.inputPatch,
  };
}

let findOneModel: typeof findOne<#=Table_Up#> = findOne<#=Table_Up#>;

watch(
  () => [
    props.action,
    props.<#=table#>_id,
    props.findOne,
    props.backAfterSave,
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
    backAfterSaveInner = props.backAfterSave ?? true;
  },
  {
    immediate: true,
  },
);

onLoad(async function(query?: AnyObject) {
  const <#=table#>_id_str = query?.<#=table#>_id;
  const action = props.action || query?.action;
  const input_patch = query?.input_patch;
  const back_after_save = query?.back_after_save;
  if (action === "add") {
    dialogAction = "add";
  } else if (action === "copy") {
    dialogAction = "copy";
  } else if (action === "edit") {
    dialogAction = "edit";
  }
  if (back_after_save != null) {
    backAfterSaveInner = decodeURIComponent(back_after_save) !== "0";
  }
  if (input_patch) {
    try {
      const data = JSON.parse(decodeURIComponent(input_patch));
      if (data && typeof data === "object") {
        inputPatchByQuery = data as Partial<<#=Table_Up#>Input>;
      }
    } catch (err) {
      console.error(err);
    }
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
