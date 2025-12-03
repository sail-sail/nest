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
const searchByKeyword = opts?.searchByKeyword;

if (searchByKeyword) {
  if (!searchByKeyword.prop) {
    throw `表: ${ mod }_${ table } 的 opts.searchByKeyword.prop 不能为空`;
    process.exit(1);
  }
  if (!searchByKeyword.fields || !Array.isArray(searchByKeyword.fields) || searchByKeyword.fields.length === 0) {
    throw `表: ${ mod }_${ table } 的 opts.searchByKeyword.fields 不能为空`;
    process.exit(1);
  }
}

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
      
      un-grid="~ cols-[repeat(auto-fill,<#=searchFormWidth#>)]"
      un-gap="x-1.5 y-1.5"
      un-justify-items-end
      un-items-center
      
      @submit.prevent
      @keydown.enter="onSearch(true)"
    ><#
    if (searchByKeyword && !searchByKeyword.hideInList) {
      const prop = searchByKeyword.prop;
      const lbl = searchByKeyword.lbl || "关键字";
      const placeholder = searchByKeyword.placeholder || "关键字";
      const fields = searchByKeyword.fields;
    #>
      
      <el-form-item<#
        if (isUseI18n) {
        #>
        :label="n('<#=lbl#>')"<#
        } else {
        #>
        label="<#=lbl#>"<#
        }
        #>
        prop="<#=prop#>"
      >
        <CustomInput
          v-model="search.<#=prop#>"<#
          if (isUseI18n) {
          #>
          :placeholder="`${ ns('请输入') } ${ n('<#=placeholder#>') }`"<#
          } else {
          #>
          placeholder="请输入 <#=placeholder#>"<#
          }
          #>
          @clear="onSearchClear"
        ></CustomInput>
      </el-form-item><#
    }
    #><#
      let hasSearchExpand = false;
      const searchIntColumns = [ ];
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        if (column.onlyCodegenDeno) continue;
        const column_name = column.COLUMN_NAME;
        if (column_name === "id") continue;
        if (column_name === "version") continue;
        if (column_name === "is_deleted") continue;
        if (column_name === "tenant_id") continue;
        const isPassword = column.isPassword;
        if (isPassword) continue;
        const isEncrypt = column.isEncrypt;
        if (isEncrypt) continue;
        const data_type = column.DATA_TYPE;
        const column_type = column.COLUMN_TYPE;
        const column_comment = column.COLUMN_COMMENT || "";
        const require = column.require;
        const search = column.search;
        const isSearchExpand = column.isSearchExpand;
        if (isSearchExpand && !hasSearchExpand) {
          hasSearchExpand = true;
        }
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
        const fieldPermit = column.fieldPermit;
        const isVirtual = column.isVirtual;
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
      <template<#
        if (fieldPermit || !isVirtual || vIfStr) {
      #> v-if="<#
        if (fieldPermit) {
      #>field_permit('<#=column_name#>') && <#
        }
      #><#
        if (!isVirtual) {
      #>(showBuildIn || builtInSearch?.<#=column_name#> == null<#=isSearchExpand ? " && isSearchExpand" : ""#>)<#
        }
      #>"<#
        } else {
      #> v-if="true"<#
        }
      #>>
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('<#=column_comment#>')"<#
          } else {
          #>
          label="<#=column_comment#>"<#
          }
          #>
          prop="<#=column_name#>"
        >
          <CustomTreeSelect
            v-model="<#=column_name#>_search"
            :method="getTree<#=Foreign_Table_Up#>"
            :options-map="((item: <#=Foreign_Table_Up#>Model) => {
              return {
                label: item.<#=foreignKey.lbl#>,
                value: item.<#=foreignKey.column#>,
              };
            })"<#
            if (isUseI18n) {
            #>
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
            } else {
            #>
            placeholder="请选择 <#=column_comment#>"<#
            }
            #>
            multiple
            @change="onSearch(false)"
          ></CustomTreeSelect>
        </el-form-item>
      </template><#
      } else if (foreignSchema && foreignSchema.opts?.list_tree
        && !foreignSchema.opts?.ignoreCodegen
        && !foreignSchema.opts?.onlyCodegenDeno
        && typeof opts?.list_tree === "string"
      ) {
      #>
      <template<#
        if (fieldPermit || !isVirtual || vIfStr) {
      #> v-if="<#
        if (fieldPermit) {
      #>field_permit('<#=column_name#>') && <#
        }
      #><#
        if (!isVirtual) {
      #>(showBuildIn || builtInSearch?.<#=column_name#> == null<#=isSearchExpand ? " && isSearchExpand" : ""#>)<#
        }
      #>"<#
        } else {
      #> v-if="true"<#
        }
      #>>
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('<#=column_comment#>')"<#
          } else {
          #>
          label="<#=column_comment#>"<#
          }
          #>
          prop="<#=column_name#>"
        >
          <CustomTreeSelect
            v-model="<#=column_name#>_search"
            :method="getTree<#=Foreign_Table_Up#>"
            :options-map="((item: <#=Foreign_Table_Up#>Model) => {
              return {
                label: item.<#=foreignKey.lbl#>,
                value: item.<#=foreignKey.column#>,
              };
            })"<#
            if (isUseI18n) {
            #>
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
            } else {
            #>
            placeholder="请选择 <#=column_comment#>"<#
            }
            #>
            multiple
            @change="onSearch(false)"
          ></CustomTreeSelect>
        </el-form-item>
      </template><#
      } else if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.isSearchByLbl && !foreignKey.isSearchBySelectInput) {
      #>
      <template<#
        if (fieldPermit || !isVirtual || vIfStr) {
      #> v-if="<#
        if (fieldPermit) {
      #>field_permit('<#=column_name#>') && <#
        }
      #><#
        if (!isVirtual) {
      #>(showBuildIn || builtInSearch?.<#=column_name#> == null<#=isSearchExpand ? " && isSearchExpand" : ""#>)<#
        }
      #>"<#
        } else {
      #> v-if="true"<#
        }
      #>>
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('<#=column_comment#>')"<#
          } else {
          #>
          label="<#=column_comment#>"<#
          }
          #>
          prop="<#=column_name#>"
        >
          <CustomSelect
            v-model="<#=column_name#>_search"
            :method="getList<#=Foreign_Table_Up#>"
            :options-map="((item: <#=Foreign_Table_Up#>Model) => {
              return {
                label: item.<#=foreignKey.lbl#>,
                value: item.<#=foreignKey.column#>,
              };
            })"<#
            if (isUseI18n) {
            #>
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
            } else {
            #>
            placeholder="请选择 <#=column_comment#>"<#
            }
            #>
            multiple
            @change="onSearch(false)"
          ></CustomSelect>
        </el-form-item>
      </template><#
      } else if (foreignKey && foreignKey.type !== "many2many" && foreignKey.isSearchByLbl && !foreignKey.isSearchBySelectInput) {
      #>
      <template<#
        if (fieldPermit || !isVirtual || vIfStr) {
      #> v-if="<#
        if (fieldPermit) {
      #>field_permit('<#=column_name#>') && <#
        }
      #><#
        if (!isVirtual) {
      #>(showBuildIn || builtInSearch?.<#=column_name#> == null<#=isSearchExpand ? " && isSearchExpand" : ""#>)<#
        }
      #>"<#
        } else {
      #> v-if="true"<#
        }
      #>>
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('<#=column_comment#>')"<#
          } else {
          #>
          label="<#=column_comment#>"<#
          }
          #>
          prop="<#=column_name#>"
        >
          <CustomInput
            v-model="search.<#=column_name#>_<#=foreignKey.lbl#>_like"<#
            if (isUseI18n) {
            #>
            :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"<#
            } else {
            #>
            placeholder="请输入 <#=column_comment#>"<#
            }
            #>
            @change="onSearch(false)"
          ></CustomInput>
        </el-form-item>
      </template><#
      } else if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.isSearchByLbl && foreignKey.isSearchBySelectInput) {
      #>
      <template<#
        if (fieldPermit || !isVirtual || vIfStr) {
      #> v-if="<#
        if (fieldPermit) {
      #>field_permit('<#=column_name#>') && <#
        }
      #><#
        if (!isVirtual) {
      #>(showBuildIn || builtInSearch?.<#=column_name#> == null<#=isSearchExpand ? " && isSearchExpand" : ""#>)<#
        }
      #>"<#
        } else {
      #> v-if="true"<#
        }
      #>>
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('<#=column_comment#>')"<#
          } else {
          #>
          label="<#=column_comment#>"<#
          }
          #>
          prop="<#=column_name#>"
        >
          <SelectInput<#=Foreign_Table_Up#>
            v-model="<#=column_name#>_search"
            v-model:model-label="search.<#=column_name#>_like"<#
            if (isUseI18n) {
            #>
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
            } else {
            #>
            placeholder="请选择 <#=column_comment#>"<#
            }
            #>
            :label-readonly="false"
            multiple
            @change="onSearch(false)"
          ></SelectInput<#=Foreign_Table_Up#>>
        </el-form-item>
      </template><#
      } else if (foreignKey && foreignKey.type === "many2many" && !foreignKey.isSearchBySelectInput) {
      #>
      <template<#
        if (fieldPermit || !isVirtual || vIfStr) {
      #> v-if="<#
        if (fieldPermit) {
      #>field_permit('<#=column_name#>') && <#
        }
      #><#
        if (!isVirtual) {
      #>(showBuildIn || builtInSearch?.<#=column_name#> == null<#=isSearchExpand ? " && isSearchExpand" : ""#>)<#
        }
      #>"<#
        } else {
      #> v-if="true"<#
        }
      #>>
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('<#=column_comment#>')"<#
          } else {
          #>
          label="<#=column_comment#>"<#
          }
          #>
          prop="<#=column_name#>"
        >
          <CustomSelect
            v-model="<#=column_name#>_search"
            :method="getList<#=Foreign_Table_Up#>"
            :options-map="((item: <#=Foreign_Table_Up#>Model) => {
              return {
                label: item.<#=foreignKey.lbl#>,
                value: item.<#=foreignKey.column#>,
              };
            })"<#
            if (isUseI18n) {
            #>
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
            } else {
            #>
            placeholder="请选择 <#=column_comment#>"<#
            }
            #>
            multiple
            @change="onSearch(false)"
          ></CustomSelect>
        </el-form-item>
      </template><#
      } else if (foreignKey && foreignKey.type === "many2many" && foreignKey.isSearchBySelectInput) {
      #>
      <template<#
        if (fieldPermit || !isVirtual || vIfStr) {
      #> v-if="<#
        if (fieldPermit) {
      #>field_permit('<#=column_name#>') && <#
        }
      #><#
        if (!isVirtual) {
      #>(showBuildIn || builtInSearch?.<#=column_name#> == null<#=isSearchExpand ? " && isSearchExpand" : ""#>)<#
        }
      #>"<#
        } else {
      #> v-if="true"<#
        }
      #>>
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('<#=column_comment#>')"<#
          } else {
          #>
          label="<#=column_comment#>"<#
          }
          #>
          prop="<#=column_name#>"
        >
          <SelectInput<#=Foreign_Table_Up#>
            v-model="<#=column_name#>_search"
            v-model:model-label="search.<#=column_name#>_<#=foreignKey.lbl#>_like"<#
            if (isUseI18n) {
            #>
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
            } else {
            #>
            placeholder="请选择 <#=column_comment#>"<#
            }
            #>
            :label-readonly="false"
            multiple
            @change="onSearch(false)"
          ></SelectInput<#=Foreign_Table_Up#>>
        </el-form-item>
      </template><#
      } else if (column.dict) {
      #>
      <template<#
        if (fieldPermit || !isVirtual || vIfStr) {
      #> v-if="<#
        if (fieldPermit) {
      #>field_permit('<#=column_name#>') && <#
        }
      #><#
        if (!isVirtual) {
      #>(showBuildIn || builtInSearch?.<#=column_name#> == null<#=isSearchExpand ? " && isSearchExpand" : ""#>)<#
        }
      #>"<#
        } else {
      #> v-if="true"<#
        }
      #>>
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('<#=column_comment#>')"<#
          } else {
          #>
          label="<#=column_comment#>"<#
          }
          #>
          prop="<#=column_name#>"
        ><#
          if (column.searchMultiple !== false) {
          #>
          <DictSelect
            v-model="<#=column_name#>_search"
            code="<#=column.dict#>"<#
            if (isUseI18n) {
            #>
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
            } else {
            #>
            placeholder="请选择 <#=column_comment#>"<#
            }
            #>
            multiple
            @change="onSearch(false)"
          ></DictSelect><#
          } else {
          #>
          <DictSelect
            :model-value="<#=column_name#>_search[0]"
            code="<#=column.dict#>"<#
            if (isUseI18n) {
            #>
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
            } else {
            #>
            placeholder="请选择 <#=column_comment#>"<#
            }
            #>
            @update:model-value="($event != null && $event !== '') ? <#=column_name#>_search = [ $event ] : <#=column_name#>_search = [ ]"
            @change="onSearch(false)"
          ></DictSelect><#
          }
          #>
        </el-form-item>
      </template><#
      } else if (column.dictbiz) {
      #>
      <template<#
        if (fieldPermit || !isVirtual || vIfStr) {
      #> v-if="<#
        if (fieldPermit) {
      #>field_permit('<#=column_name#>') && <#
        }
      #><#
        if (!isVirtual) {
      #>(showBuildIn || builtInSearch?.<#=column_name#> == null<#=isSearchExpand ? " && isSearchExpand" : ""#>)<#
        }
      #>"<#
        } else {
      #> v-if="true"<#
        }
      #>>
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('<#=column_comment#>')"<#
          } else {
          #>
          label="<#=column_comment#>"<#
          }
          #>
          prop="<#=column_name#>"
        ><#
          if (column.searchMultiple !== false) {
          #>
          <DictbizSelect
            v-model="<#=column_name#>_search"
            code="<#=column.dictbiz#>"<#
            if (isUseI18n) {
            #>
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
            } else {
            #>
            placeholder="请选择 <#=column_comment#>"<#
            }
            #>
            multiple
            @change="onSearch(false)"
          ></DictbizSelect><#
          } else {
          #>
          <DictbizSelect
            :model-value="<#=column_name#>_search[0]"
            code="<#=column.dictbiz#>"<#
            if (isUseI18n) {
            #>
            :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
            } else {
            #>
            placeholder="请选择 <#=column_comment#>"<#
            }
            #>
            @update:model-value="($event != null && $event !== '') ? <#=column_name#>_search = [ $event ] : <#=column_name#>_search = [ ]"
            @change="onSearch(false)"
          ></DictbizSelect><#
          }
          #>
        </el-form-item>
      </template><#
      } else if (data_type === "datetime" || data_type === "date") {
      #>
      <template<#
        if (fieldPermit || !isVirtual || vIfStr) {
      #> v-if="<#
        if (fieldPermit) {
      #>field_permit('<#=column_name#>') && <#
        }
      #><#
        if (!isVirtual) {
      #>(showBuildIn || builtInSearch?.<#=column_name#> == null<#=isSearchExpand ? " && isSearchExpand" : ""#>)<#
        }
      #>"<#
        } else {
      #> v-if="true"<#
        }
      #>>
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('<#=column_comment#>')"<#
          } else {
          #>
          label="<#=column_comment#>"<#
          }
          #>
          prop="<#=column_name#>"
        >
          <CustomDatePicker
            v-model="<#=column_name#>_search"<#
            if (column.isMonth) {
            #>
            type="monthrange"<#
            } else {
            #>
            type="daterange"<#
            }
            #><#
            if (isUseI18n) {
            #>
            :start-placeholder="ns('开始')"
            :end-placeholder="ns('结束')"<#
            } else {
            #>
            start-placeholder="开始"
            end-placeholder="结束"<#
            }
            #>
            @clear="onSearchClear"
            @change="onSearch(false)"
          ></CustomDatePicker>
        </el-form-item>
      </template><#
      } else if (column_type === "int(1)") {
      #>
      <template<#
        if (fieldPermit || !isVirtual || vIfStr) {
      #> v-if="<#
        if (fieldPermit) {
      #>field_permit('<#=column_name#>') && <#
        }
      #><#
        if (!isVirtual) {
      #>(showBuildIn || builtInSearch?.<#=column_name#> == null<#=isSearchExpand ? " && isSearchExpand" : ""#>)<#
        }
      #>"<#
        } else {
      #> v-if="true"<#
        }
      #>>
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('<#=column_comment#>')"<#
          } else {
          #>
          label="<#=column_comment#>"<#
          }
          #>
          prop="<#=column_name#>"
        >
          <el-checkbox
            v-model="search.<#=column_name#>"
            un-w="full"
            :false-value="0"
            :true-value="1"
          ><#
            if (isUseI18n) {
            #>{{ n('<#=column_comment#>') }}<#
            } else {
            #><#=column_comment#><#
            }
            #>
          </el-checkbox>
        </el-form-item>
      </template><#
      } else if (column_type.startsWith("int")) {
        searchIntColumns.push(column);
      #>
      <template<#
        if (fieldPermit || !isVirtual || vIfStr) {
      #> v-if="<#
        if (fieldPermit) {
      #>field_permit('<#=column_name#>') && <#
        }
      #><#
        if (!isVirtual) {
      #>(showBuildIn || builtInSearch?.<#=column_name#> == null<#=isSearchExpand ? " && isSearchExpand" : ""#>)<#
        }
      #>"<#
        } else {
      #> v-if="true"<#
        }
      #>>
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('<#=column_comment#>')"<#
          } else {
          #>
          label="<#=column_comment#>"<#
          }
          #>
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
              @clear="onSearchClear"<#
              if (isUseI18n) {
              #>
              :placeholder="ns('最小值')"<#
              } else {
              #>
              placeholder="最小值"<#
              }
              #>
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
              @clear="onSearchClear"<#
              if (isUseI18n) {
              #>
              :placeholder="ns('最大值')"<#
              } else {
              #>
              placeholder="最大值"<#
              }
              #>
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
      <template<#
        if (fieldPermit || !isVirtual || vIfStr) {
      #> v-if="<#
        if (fieldPermit) {
      #>field_permit('<#=column_name#>') && <#
        }
      #><#
        if (!isVirtual) {
      #>(builtInSearch?.<#=column_name#> == null && (showBuildIn || builtInSearch?.<#=column_name#>_like == null)<#=isSearchExpand ? " && isSearchExpand" : ""#>)<#
        }
      #>"<#
        } else {
      #> v-if="true"<#
        }
      #>>
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('<#=column_comment#>')"<#
          } else {
          #>
          label="<#=column_comment#>"<#
          }
          #>
          prop="<#=column_name#>_like"
        >
          <CustomInput
            v-model="search.<#=column_name#>_like"<#
            if (isUseI18n) {
            #>
            :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"<#
            } else {
            #>
            placeholder="请输入 <#=column_comment#>"<#
            }
            #>
            @clear="onSearchClear"
          ></CustomInput>
        </el-form-item>
      </template><#
      }
      #><#
        }
      }
      #><#
      if (opts?.isUseDynPageFields) {
      #>
      
      <template
        v-for="field_model in dyn_page_field_models"
        :key="field_model.id"
      >
        <el-form-item
          v-if="field_model.is_search"
          :label="field_model.lbl"
          :prop="field_model.code"
        >
          <CustomDynComp
            :model-value="search.dyn_page_data?.[field_model.code + '_like']"
            :name="field_model.type"
            :placeholder="`请输入 ${ field_model.lbl }`"
            v-bind="field_model._attrs"
            @update:model-value="(val: any) => {
              search.dyn_page_data = search.dyn_page_data ?? { };
              search.dyn_page_data[field_model.code + '_like'] = val;
            }"
          ></CustomDynComp>
        </el-form-item>
      </template><#
      }
      #>
      
      <div
        class="search-ids-checked"
      >
        <div
          un-flex="~ nowrap"
          un-justify-evenly
          un-w="full"
        >
          <div
            un-flex="~ nowrap"
            un-items-center
            un-gap="x-1.5"
            un-min="w-31.5"
          >
            <el-checkbox
              v-model="idsChecked"
              :false-value="0"
              :true-value="1"
              :disabled="selectedIds.length === 0"
              @change="onIdsChecked"
            ><#
              if (isUseI18n) {
              #>
              <span>{{ ns('已选择') }}</span><#
              } else {
              #>
              <span>已选择</span><#
              }
              #>
              <span
                v-if="selectedIds.length > 0"
                un-m="l-0.5"
                un-text="blue"
              >
                {{ selectedIds.length }}
              </span>
            </el-checkbox>
            <el-icon
              v-show="selectedIds.length > 0"<#
              if (isUseI18n) {
              #>
              :title="ns('清空已选择')"<#
              } else {
              #>
              title="清空已选择"<#
              }
              #>
              un-cursor-pointer
              un-text="hover:red"
              @click="onEmptySelected"
            >
              <ElIconRemove />
            </el-icon>
          </div><#
          if (hasIsDeleted) {
          #>
          
          <el-checkbox
            v-if="!isLocked"
            v-model="search.is_deleted"
            :set="search.is_deleted = search.is_deleted ?? 0"
            :false-value="0"
            :true-value="1"
            @change="onRecycle"
          ><#
            if (isUseI18n) {
            #>
            <span>{{ ns('回收站') }}</span><#
            } else {
            #>
            <span>回收站</span><#
            }
            #>
          </el-checkbox><#
          }
          #>
        </div>
      </div>
      
      <div
        class="search-buttons"
      >
        
        <el-button
          un-m="l-3"
          plain
          type="primary"
          @click="onSearch(true)"
        >
          <template #icon>
            <ElIconSearch />
          </template><#
          if (isUseI18n) {
          #>
          <span>{{ ns('查询') }}</span><#
          } else {
          #>
          <span>查询</span><#
          }
          #>
        </el-button>
        
        <el-button
          plain
          @click="onSearchReset"
        >
          <template #icon>
            <ElIconDelete />
          </template><#
          if (isUseI18n) {
          #>
          <span>{{ ns('重置') }}</span><#
          } else {
          #>
          <span>重置</span><#
          }
          #>
        </el-button>
        
        <div
          un-m="l-2"
          un-flex="~"
          un-items-end
          un-h="full"
          un-gap="x-2"
        ><#
          if (hasSearchExpand) {
          #>
          
          <div
            un-text="3 gray hover:[var(--el-color-primary)]"
            un-cursor-pointer
            un-flex="~"
            un-justify-end
            un-h="5.5"
            un-overflow-hidden
            @click="isSearchExpand = !isSearchExpand"
          ><#
            if (isUseI18n) {
            #>
            <span v-if="isSearchExpand">{{ ns('收起') }}</span>
            <span v-else>{{ ns('展开') }}</span><#
            } else {
            #>
            <span v-if="isSearchExpand">收起</span>
            <span v-else>展开</span><#
            }
            #>
          </div><#
          }
          #>
          
          <TableSearchStaging
            :search="search"
            :page-path="pagePath"
            :filename="__filename"
            @search="onSearchStaging"
          ></TableSearchStaging>
          
        </div>
        
      </div>
      
    </el-form>
  </div>
  <div
    un-m="x-1.5 t-1.5"
    un-flex="~ nowrap"
  >
    <template v-if="<# if (hasIsDeleted) { #>search.is_deleted !== 1<# } else { #>true<# } #>"><#
      if (opts.noAdd !== true) {
      #>
      
      <el-button
        v-if="permit('add', '新增') && !isLocked"
        plain
        type="primary"
        @click="openAdd"
      >
        <template #icon>
          <ElIconCirclePlus />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('新增') }}</span><#
        } else {
        #>
        <span>新增</span><#
        }
        #>
      </el-button><#
        if (opts.noCopy !== true) {
      #>
      
      <el-button
        v-if="permit('add', '复制') && !isLocked"
        plain
        type="primary"
        @click="openCopy"
      >
        <template #icon>
          <ElIconCopyDocument />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('复制') }}</span><#
        } else {
        #>
        <span>复制</span><#
        }
        #>
      </el-button><#
        }
      #><#
      }
      #><#
      if (opts.noEdit !== true) {
      #>
      
      <el-button
        v-if="permit('edit', '编辑') && !isLocked"
        plain
        type="primary"
        @click="openEdit"
      >
        <template #icon>
          <ElIconEdit />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('编辑') }}</span><#
        } else {
        #>
        <span>编辑</span><#
        }
        #>
      </el-button><#
      }
      #><#
      if (hasAudit) {
      #>
      
      <el-button
        v-if="!isLocked &&
          (
            permit('audit_submit', '审核提交') ||
            permit('audit_pass', '审核通过') ||
            permit('audit_reject', '审核拒绝') ||
            permit('audit_review', '复核通过')
          )
        "
        plain
        type="primary"
        @click="openAudit"
      >
        <template #icon>
          <ElIcon>
            <div un-i="iconfont-audit"></div>
          </ElIcon>
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('审核') }}</span><#
        } else {
        #>
        <span>审核</span><#
        }
        #>
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
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('删除') }}</span><#
        } else {
        #>
        <span>删除</span><#
        }
        #>
      </el-button><#
        }
      #>
      
      <el-button
        plain
        @click="openView"
      >
        <template #icon>
          <ElIconReading />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('查看') }}</span><#
        } else {
        #>
        <span>查看</span><#
        }
        #>
      </el-button>
      
      <el-button
        plain
        @click="onRefresh"
      >
        <template #icon>
          <ElIconRefresh />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('刷新') }}</span><#
        } else {
        #>
        <span>刷新</span><#
        }
        #>
      </el-button><#
      for (let ii = 0; ii < columns.length; ii++) {
        const column = columns[ii];
        if (!column.foreignTabs) {
          continue;
        }
        const tabGroup = column.COLUMN_NAME || "";
        for (let iii = 0; iii < column.foreignTabs.length; iii++) {
          const foreignTab = column.foreignTabs[iii];
          if (foreignTab.linkType !== "button") {
            continue;
          }
          const label = foreignTab.label;
      #>
      
      <el-button
        plain
        @click="onOpenForeignTabs('<#=tabGroup#>', '<#=label#>')"
      >
        <template #icon>
          <ElIconTickets />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('<#=label#>') }}</span><#
        } else {
        #>
        <span><#=label#></span><#
        }
        #>
      </el-button><#
        }
      }
      #><#
      if (opts.noExport !== true) {
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
            v-if="exportExcel.workerStatus === 'RUNNING'"
            un-text="red"
          ><#
            if (isUseI18n) {
            #>
            {{ ns('正在导出') }}<#
            } else {
            #>
            正在导出<#
            }
            #>
          </span>
          <span
            v-else-if="exportExcel.loading"
            un-text="red"
          ><#
            if (isUseI18n) {
            #>
            {{ ns('正在为导出加载数据') }}<#
            } else {
            #>
            正在为导出加载数据<#
            }
            #>
          </span>
          <span
            v-else
          ><#
            if (isUseI18n) {
            #>
            {{ ns('更多操作') }}<#
            } else {
            #>
            更多操作<#
            }
            #>
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
              v-if="exportExcel.workerStatus !== 'RUNNING' && !exportExcel.loading"
              un-justify-center
              @click="onExport"
            ><#
              if (isUseI18n) {
              #>
              <span>{{ ns('导出') }}</span><#
              } else {
              #>
              <span>导出</span><#
              }
              #>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-else-if="!exportExcel.loading"
              un-justify-center
              @click="onCancelExport"
            ><#
              if (isUseI18n) {
              #>
              <span un-text="red">{{ ns('取消导出') }}</span><#
              } else {
              #>
              <span un-text="red">取消导出</span><#
              }
              #>
            </el-dropdown-item><#
              }
            #><#
              if (opts.noEdit !== true && opts.noAdd !== true && opts.noImport !== true) {
            #>
            
            <el-dropdown-item
              v-if="permit('add', '导入') && !isLocked"
              un-justify-center
              @click="onImportExcel"
            ><#
              if (isUseI18n) {
              #>
              <span>{{ ns('导入') }}</span><#
              } else {
              #>
              <span>导入</span><#
              }
              #>
            </el-dropdown-item><#
              }
            #><#
              if (hasEnabled && opts.noEdit !== true && !columns.find((item) => item.COLUMN_NAME === "is_enabled").readonly) {
            #>
            
            <el-dropdown-item
              v-if="permit('edit', '编辑') && !isLocked"
              un-justify-center
              @click="onEnableByIds(1)"
            ><#
              if (isUseI18n) {
              #>
              <span>{{ ns('启用') }}</span><#
              } else {
              #>
              <span>启用</span><#
              }
              #>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('edit', '编辑') && !isLocked"
              un-justify-center
              @click="onEnableByIds(0)"
            ><#
              if (isUseI18n) {
              #>
              <span>{{ ns('禁用') }}</span><#
              } else {
              #>
              <span>禁用</span><#
              }
              #>
            </el-dropdown-item><#
            }
            #><#
              if (hasLocked && opts.noEdit !== true && !columns.find((item) => item.COLUMN_NAME === "is_locked").readonly) {
            #>
            
            <el-dropdown-item
              v-if="permit('edit', '编辑') && !isLocked"
              un-justify-center
              @click="onLockByIds(1)"
            ><#
              if (isUseI18n) {
              #>
              <span>{{ ns('锁定') }}</span><#
              } else {
              #>
              <span>锁定</span><#
              }
              #>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-if="permit('edit', '编辑') && !isLocked"
              un-justify-center
              @click="onLockByIds(0)"
            ><#
              if (isUseI18n) {
              #>
              <span>{{ ns('解锁') }}</span><#
              } else {
              #>
              <span>解锁</span><#
              }
              #>
            </el-dropdown-item><#
            }
            #><#
            if (opts?.isUseDynPageFields) {
            #>
            
            <el-dropdown-item
              v-if="permit('dyn_page_fields', '新增字段') && !isLocked || true"
              un-justify-center
              @click="onDynPageFields"
            >
              <span>新增字段</span>
            </el-dropdown-item><#
            }
            #><#
            for (let ii = 0; ii < columns.length; ii++) {
              const column = columns[ii];
              if (!column.foreignTabs) {
                continue;
              }
              const tabGroup = column.COLUMN_NAME || "";
              for (let iii = 0; iii < column.foreignTabs.length; iii++) {
                const foreignTab = column.foreignTabs[iii];
                if (foreignTab.linkType !== "button") {
                  continue;
                }
                const label = foreignTab.label;
            #>
            
            <el-dropdown-item
              un-justify-center
              @click="onOpenForeignTabs('<#=tabGroup#>', '<#=label#>')"
            >
              <template #icon>
                <ElIconTickets />
              </template><#
              if (isUseI18n) {
              #>
              <span>{{ ns('<#=label#>') }}</span><#
              } else {
              #>
              <span><#=label#></span><#
              }
              #>
            </el-dropdown-item><#
              }
            }
            #>
            
          </el-dropdown-menu>
        </template>
      </el-dropdown><#
      }
      #>
      
    </template>
    
    <template v-else><#
      if (opts.noDelete !== true && opts.noRevert !== true && hasIsDeleted) {
      #>
      
      <el-button
        v-if="permit('delete') && !isLocked"
        plain
        type="primary"
        @click="onRevertByIds"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('还原') }}</span><#
        } else {
        #>
        <span>还原</span><#
        }
        #>
      </el-button><#
      }
      #><#
      if (opts.noDelete !== true && opts.noForceDelete !== true && hasIsDeleted) {
      #>
      
      <el-button
        v-if="permit('force_delete') && !isLocked"
        plain
        type="danger"
        @click="onForceDeleteByIds"
      >
        <template #icon>
          <ElIconCircleClose />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('彻底删除') }}</span><#
        } else {
        #>
        <span>彻底删除</span><#
        }
        #>
      </el-button><#
      }
      #>
      
      <el-button
        plain
        @click="openView"
      >
        <template #icon>
          <ElIconReading />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('查看') }}</span><#
        } else {
        #>
        <span>查看</span><#
        }
        #>
      </el-button>
      
      <el-button
        plain
        @click="onSearch(true)"
      >
        <template #icon>
          <ElIconRefresh />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('刷新') }}</span><#
        } else {
        #>
        <span>刷新</span><#
        }
        #>
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
            v-if="exportExcel.workerStatus === 'RUNNING'"
          ><#
            if (isUseI18n) {
            #>
            {{ ns('正在导出') }}<#
            } else {
            #>
            正在导出<#
            }
            #>
          </span>
          <span
            v-else-if="exportExcel.loading"
            un-text="red"
          ><#
            if (isUseI18n) {
            #>
            {{ ns('正在为导出加载数据') }}<#
            } else {
            #>
            正在为导出加载数据<#
            }
            #>
          </span>
          <span
            v-else
          ><#
            if (isUseI18n) {
            #>
            {{ ns('更多操作') }}<#
            } else {
            #>
            更多操作<#
            }
            #>
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
              v-if="exportExcel.workerStatus !== 'RUNNING' && !exportExcel.loading"
              un-justify-center
              @click="onExport"
            ><#
              if (isUseI18n) {
              #>
              <span>{{ ns('导出') }}</span><#
              } else {
              #>
              <span>导出</span><#
              }
              #>
            </el-dropdown-item>
            
            <el-dropdown-item
              v-else-if="!exportExcel.loading"
              un-justify-center
              @click="onCancelExport"
            ><#
              if (isUseI18n) {
              #>
              <span un-text="red">{{ ns('取消导出') }}</span><#
              } else {
              #>
              <span un-text="red">取消导出</span><#
              }
              #>
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
    ><#
      if (isUseI18n) {
      #>
      {{ ns('列操作') }}<#
      } else {
      #>
      列操作<#
      }
      #>
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
        v-header-order-drag="() => ({ tableColumns, storeColumns })"
        :data="tableData"
        :row-class-name="rowClassName"
        border
        size="small"
        height="100%"
        row-key="id"
        :default-sort="defaultSort"<#
        if (isUseI18n) {
        #>
        :empty-text="inited ? undefined : ns('加载中...')"<#
        } else {
        #>
        :empty-text="inited ? undefined : '加载中...'"<#
        }
        #><#
        if (hasSummary) {
        #>
        show-summary
        :summary-method="summaryMethod"<#
        }
        #>
        @select="onSelect"
        @select-all="onSelect"
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
            if (column.isFluentEditor) {
              continue;
            }
            const foreignKey = column.foreignKey;
            const data_type = column.DATA_TYPE;
            const column_type = column.COLUMN_TYPE;
            const column_comment = column.COLUMN_COMMENT || "";
            const isPassword = column.isPassword;
            if (isPassword) continue;
            const foreignTabs = column.foreignTabs || [ ];
            const foreignPage = column.foreignPage;
            const isEncrypt = column.isEncrypt;
            const prefix = column.prefix || "";
            const canSearch = column.canSearch;
            const isAuditColumn = hasAudit && auditColumn === column_name;
            const isIcon = column.isIcon;
            const isVirtual = column.isVirtual;
          #><#
          if (isIcon) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>_lbl' === col.prop<#
          if (canSearch && !isVirtual) {
          #> && (showBuildIn || builtInSearch?.<#=column_name#> == null)<#
          }
          #>">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row }">
                <div
                  un-flex="~ nowrap"
                  un-items-center
                  un-justify-center
                >
                  <CustomIcon
                    v-model="row.<#=column_name#>"
                    v-model:model-lbl="row.<#=column_name#>_lbl"
                    :readonly="true"
                    un-w="8"
                    un-h="8"
                  ></CustomIcon>
                </div>
              </template>
            </el-table-column>
          </template><#
          } else if (column.isImg) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop<#
          if (canSearch && !isVirtual) {
          #> && (showBuildIn || builtInSearch?.<#=column_name#> == null)<#
          }
          #>">
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
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop<#
          if (canSearch && !isVirtual) {
          #> && (showBuildIn || builtInSearch?.<#=column_name#> == null)<#
          }
          #>">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            ><#
              if (prefix) {
              #>
              <template #default="{ row, column }">
                <#=prefix#>{{ row[column.property] }}
              </template><#
              }
              #>
            </el-table-column>
          </template><#
            } else if (isEncrypt) {
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
                  @click="openForeignTabs(row.id, '<#=column.COLUMN_NAME#>', row[column.property]<#
                  if (opts.lbl_field) {
                  #> + ' - ' + row.<#=opts.lbl_field#><#
                  }
                  #>)"
                >
                  <#=prefix#>{{ row[column.property] }}
                </el-link>
              </template><#
              } else if (foreignPage) {
                const queryKeys = Object.keys(foreignPage.query || { });
                if (!foreignPage.routeName) {
                  throw new Error(`表: ${ table_name } 字段: ${ column_name } 未配置 foreignPage.routeName`);
                }
              #>
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  @click="openForeignPage(
                    '<#=foreignPage.routeName#>',<#
                    if (foreignPage.tabNameField) {
                    #>
                    row.<#=foreignPage.tabNameField#>,<#
                    } else {
                    #>
                    undefined,<#
                    }
                    #>
                    {<#
                      for (const key of queryKeys) {
                        const value = foreignPage.query[key];
                      #><#
                      if (key === "showBuildIn") {
                      #>
                      showBuildIn: '<#=value#>',<#
                      } else {
                      #>
                      <#=key#>: row.<#=value#>,<#
                      }
                      #><#
                      }
                      #>
                    },
                  )"
                >
                  <#=prefix#>{{ row[column.property] }}
                </el-link>
              </template><#
              } else if (prefix) {
              #>
              <template #default="{ row, column }">
                <#=prefix#>{{ row[column.property] }}
              </template><#
              }
              #>
            </el-table-column>
          </template><#
          } else if (column.isAtt) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop<#
          if (canSearch && !isVirtual) {
          #> && (showBuildIn || builtInSearch?.<#=column_name#> == null)<#
          }
          #>">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row, column }">
                <LinkAtt
                  v-model="row[column.property]"<#
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
                  #><#
                  if (column.isPublicAtt) {
                  #>
                  :is-public="true"<#
                  } else {
                  #>
                  :is-public="false"<#
                  }
                  #><#
                  if (column.readonly) {
                  #>
                  :readonly="true"<#
                  } else {
                  #>
                  :readonly="isLocked"<#
                  }
                  #>
                  @change="onLinkAtt(row, column.property)"
                ></LinkAtt>
              </template>
            </el-table-column>
          </template><#
            } else if (column_name === "order_by") {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop<#
          if (canSearch && !isVirtual) {
          #> && (showBuildIn || builtInSearch?.<#=column_name#> == null)<#
          }
          #>">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            ><#
              if (opts.noEdit !== true && !column.readonly) {
            #>
              <template #default="{ row }">
                <CustomInputNumber
                  v-if="permit('edit', '编辑')<#
                  if (hasLocked) {
                  #> && row.is_locked !== 1<#
                  }
                  #> && row.is_deleted !== 1 && !isLocked"
                  v-model="row.order_by"
                  :min="0"
                  @change="updateById<#=Table_Up#>(
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
                  @keydown.stop
                  @dblclick.stop
                  @keydown.enter="() => tableFocus()"
                ></CustomInputNumber>
              </template><#
              } else if (prefix) {
              #>
              <template #default="{ row, column }">
                <#=prefix#>{{ row[column.property] }}
              </template><#
              }
              #>
            </el-table-column>
          </template><#
            } else if (column.whitespacePre) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop<#
          if (canSearch && !isVirtual) {
          #> && (showBuildIn || builtInSearch?.<#=column_name#> == null)<#
          }
          #>">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            >
              <template #default="{ row, column }">
                <div
                  un-whitespace-pre
                >
                  <#=prefix#>{{ row[column.property] }}
                </div>
              </template>
            </el-table-column>
          </template><#
            } else if (column.dict || column.dictbiz
              || data_type === "date" || data_type === "datetime" || data_type === "timestamp"
            ) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>_lbl' === col.prop<#
          if (canSearch && !isVirtual) {
          #> && (showBuildIn || builtInSearch?.<#=column_name#> == null)<#
          }
          #>">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            ><#
              if (foreignTabs.some((item) => item.linkType === "link" || item.linkType === undefined)) {
              #>
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  @click="openForeignTabs(row.id, '<#=column.COLUMN_NAME#>', row[column.property]<#
                  if (opts.lbl_field) {
                  #> + ' - ' + row.<#=opts.lbl_field#><#
                  }
                  #>)"
                >
                  <#=prefix#>{{ row[column.property] }}
                </el-link>
              </template><#
              } else if (foreignPage) {
                const queryKeys = Object.keys(foreignPage.query || { });
                if (!foreignPage.routeName) {
                  throw new Error(`表: ${ table_name } 字段: ${ column_name } 未配置 foreignPage.routeName`);
                }
              #>
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  @click="openForeignPage(
                    '<#=foreignPage.routeName#>',<#
                    if (foreignPage.tabNameField) {
                    #>
                    row.<#=foreignPage.tabNameField#>,<#
                    } else {
                    #>
                    undefined,<#
                    }
                    #>
                    {<#
                      for (const key of queryKeys) {
                        const value = foreignPage.query[key];
                      #><#
                      if (key === "showBuildIn") {
                      #>
                      showBuildIn: '<#=value#>',<#
                      } else {
                      #>
                      <#=key#>: row.<#=value#>,<#
                      }
                      #><#
                      }
                      #>
                    },
                  )"
                >
                  <#=prefix#>{{ row[column.property] }}
                </el-link>
              </template><#
              } else if(column.isSwitch && opts.noEdit !== true && !column.readonly && column_name === "is_default") {
              #>
              <template #default="{ row }">
                <CustomSwitch
                  v-if="permit('edit', '编辑')<#
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
                  v-if="permit('edit', '编辑')<#
                  if (hasLocked && column_name !== "is_locked") {
                  #> && row.is_locked !== 1<#
                  }
                  #> && row.is_deleted !== 1 && !isLocked"
                  v-model="row.<#=column_name#>"
                  @change="on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(row.id, row.<#=column_name#>)"
                ></CustomSwitch>
              </template><#
              } else if (isAuditColumn) {
              #>
              <template #default="{ row, column }">
                <el-link
                  v-if="row.<#=auditColumn#>_recent_model"
                  type="primary"
                  @click="openAuditListDialog(row.id)"
                >
                  <#=prefix#>{{ row[column.property] }}
                </el-link>
              </template><#
              } else if (prefix) {
              #>
              <template #default="{ row, column }">
                <#=prefix#>{{ row[column.property] }}
              </template><#
              }
              #>
            </el-table-column>
          </template><#
            } else if (!foreignKey) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>' === col.prop<#
          if (canSearch && !isVirtual) {
          #> && (showBuildIn || builtInSearch?.<#=column_name#> == null)<#
          }
          #>">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            ><#
              if (column.isCountyLbl) {
              #>
              <template #default="{ row }">
                <div
                  v-if="row.<#=province_lbl_column.COLUMN_NAME#> && row.<#=city_lbl_column.COLUMN_NAME#> && row.<#=county_lbl_column.COLUMN_NAME#>"
                >
                  <#=prefix#>{{ row.<#=province_lbl_column.COLUMN_NAME#> }} / {{ row.<#=city_lbl_column.COLUMN_NAME#> }} / {{ row.<#=county_lbl_column.COLUMN_NAME#> }}
                </div>
              </template><#
              } else if (foreignTabs.some((item) => item.linkType === "link" || item.linkType === undefined)) {
              #>
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  @click="openForeignTabs(row.id, '<#=column.COLUMN_NAME#>', row[column.property]<#
                  if (opts.lbl_field) {
                  #> + ' - ' + row.<#=opts.lbl_field#><#
                  }
                  #>)"
                >
                  <#=prefix#>{{ row[column.property] }}
                </el-link>
              </template><#
              } else if (foreignPage) {
                const queryKeys = Object.keys(foreignPage.query || { });
                if (!foreignPage.routeName) {
                  throw new Error(`表: ${ table_name } 字段: ${ column_name } 未配置 foreignPage.routeName`);
                }
              #>
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  @click="openForeignPage(
                    '<#=foreignPage.routeName#>',<#
                    if (foreignPage.tabNameField) {
                    #>
                    row.<#=foreignPage.tabNameField#>,<#
                    } else {
                    #>
                    undefined,<#
                    }
                    #>
                    {<#
                      for (const key of queryKeys) {
                        const value = foreignPage.query[key];
                      #><#
                      if (key === "showBuildIn") {
                      #>
                      showBuildIn: '<#=value#>',<#
                      } else {
                      #>
                      <#=key#>: row.<#=value#>,<#
                      }
                      #><#
                      }
                      #>
                    },
                  )"
                >
                  <#=prefix#>{{ row[column.property] }}
                </el-link>
              </template><#
              } else if (column.isColorPicker) {
              #>
              <template #default="{ row, column }">
                <CustomColorPicker
                  :model-value="row[column.property]"<#
                  if (column.isColorShowAlpha) {
                  #>
                  show-alpha<#
                  }
                  #>
                  readonly
                  :is-readonly-border="false"
                  un-justify="center"
                ></CustomColorPicker>
              </template><#
              } else if (prefix) {
              #>
              <template #default="{ row, column }">
                <#=prefix#>{{ row[column.property] }}
              </template><#
              }
              #>
            </el-table-column>
          </template><#
            } else if (foreignKey) {
          #>
          
          <!-- <#=column_comment#> -->
          <template v<#=colIdx === 0 ? "" : "-else"#>-if="'<#=column_name#>_lbl' === col.prop<#
          if (canSearch && !isVirtual) {
          #> && (showBuildIn || builtInSearch?.<#=column_name#> == null)<#
          }
          #>">
            <el-table-column
              v-if="col.hide !== true"
              v-bind="col"
            ><#
              if (foreignKey.multiple && (foreignKey.showType === "tag" || !foreignKey.showType) && !column.inlineMany2manyTab) {
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
              <template #default="{ row }">
                <el-link
                  type="primary"
                  un-min="w-7.5"
                  @click="on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(row)"
                >
                  {{ row.<#=column_name#>?.length || 0 }}
                </el-link>
              </template><#
              } else if (foreignTabs.some((item) => item.linkType === "link" || item.linkType === undefined)) {
              #>
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  @click="openForeignTabs(row.id, '<#=column.COLUMN_NAME#>', row[column.property]<#
                  if (opts.lbl_field) {
                  #> + ' - ' + row.<#=opts.lbl_field#><#
                  }
                  #>)"
                >
                  <#=prefix#>{{ row[column.property] }}
                </el-link>
              </template><#
              } else if (foreignPage) {
                const queryKeys = Object.keys(foreignPage.query || { });
                if (!foreignPage.routeName) {
                  throw new Error(`表: ${ table_name } 字段: ${ column_name } 未配置 foreignPage.routeName`);
                }
              #>
              <template #default="{ row, column }">
                <el-link
                  type="primary"
                  @click="openForeignPage(
                    '<#=foreignPage.routeName#>',<#
                    if (foreignPage.tabNameField) {
                    #>
                    row.<#=foreignPage.tabNameField#>,<#
                    } else {
                    #>
                    undefined,<#
                    }
                    #>
                    {<#
                      for (const key of queryKeys) {
                        const value = foreignPage.query[key];
                      #><#
                      if (key === "showBuildIn") {
                      #>
                      showBuildIn: '<#=value#>',<#
                      } else {
                      #>
                      <#=key#>: row.<#=value#>,<#
                      }
                      #><#
                      }
                      #>
                    },
                  )"
                >
                  <#=prefix#>{{ row[column.property] }}
                </el-link>
              </template><#
              } else if (column.inlineMany2manyTab) {
              #>
              <template #default="{ row }">
                <el-link
                  type="primary"
                  un-min="w-7.5"
                  @click="on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(row)"
                >
                  {{ row.<#=column_name#>?.length || 0 }}
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
              } else if (prefix) {
              #>
              <template #default="{ row, column }">
                <#=prefix#>{{ row[column.property] }}
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
      un-flex="~"
      un-justify="end"
      un-items="center"
      un-h="10"
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
    const column_comment = column.COLUMN_COMMENT || "";
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
      && (foreignKey && ([ "selectInput", "select" ].includes(foreignKey.selectType) || !foreignKey.selectType))
      && !(foreignSchema && foreignSchema.opts?.list_tree)
    ) {
  #>
  
  <!-- <#=column_comment#> -->
  <ListSelectDialog
    ref="<#=column_name#>ListSelectDialogRef"
    v-slot="listSelectProps"
    :is-locked="isLocked"
  >
    <<#=Foreign_Table_Up#>List<#
      if (mod === "base" && table === "role" && column_name === "menu_ids") {
      #>
      :tenant_ids="[ usrStore.tenant_id ]"<#
      }
      #><#
      if (hasEnabled) {
      #>
      is_enabled="1"
      :props-not-reset="[ 'is_enabled' ]"<#
      }
      #>
      v-bind="(listSelectProps as any)"
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
    v-slot="listSelectProps"
    :is-locked="isLocked"
  >
    <<#=Foreign_Table_Up#>TreeList<#
      if (mod === "base" && table === "role" && column_name === "menu_ids") {
      #>
      :tenant_ids="[ usrStore.tenant_id ]"<#
      }
      #><#
      if (hasEnabled) {
      #>
      is_enabled="1"
      :props-not-reset="[ 'is_enabled' ]"<#
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
    :dialog-visible="isImporting"
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
  #><#
  if (hasAudit && auditTable_Up) {
  #>
  
  <AuditListDialog
    ref="auditListDialogRef"
  ></AuditListDialog><#
  }
  #><#
  if (opts?.isUseDynPageFields) {
  #>
  
  <DynPageDetail
    ref="dynPageDetailRef"
  ></DynPageDetail><#
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
  const column_comment = column.COLUMN_COMMENT || "";
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
    && (foreignKey && ([ "selectInput", "select" ].includes(foreignKey.selectType) || !foreignKey.selectType))
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
  } else if (foreignKey && foreignKey.isSearchBySelectInput) {
#>

import SelectInput<#=Foreign_Table_Up#> from "@/views/<#=foreignKey.mod#>/<#=foreignTable#>/SelectInput.vue";<#
  }
#><#
  if (foreignKey && foreignKey.isLinkForeignTabs) {
#>
import <#=Foreign_Table_Up#>ForeignTabs from "../<#=foreignTable#>/ForeignTabs.vue";<#
  }
#><#
}
#><#
if (hasAudit && auditTable_Up) {
#>

import AuditListDialog from "./AuditListDialog.vue";<#
}
#>

import {
  getPagePath<#=Table_Up#>,
  findAll<#=Table_Up#>,
  findCount<#=Table_Up#>,<#
    if (opts.noDelete !== true && opts.noRevert !== true && hasIsDeleted) {
  #>
  revertByIds<#=Table_Up#>,<#
    }
  #><#
    if (opts.noDelete !== true) {
  #>
  deleteByIds<#=Table_Up#>,<#
    }
  #><#
    if (opts.noDelete !== true && opts.noForceDelete !== true && hasIsDeleted) {
  #>
  forceDeleteByIds<#=Table_Up#>,<#
    }
  #><#
    if (hasDefault && opts.noEdit !== true) {
  #>
  defaultById<#=Table_Up#>,<#
    }
  #><#
    if (hasEnabled && opts.noEdit !== true) {
  #>
  enableByIds<#=Table_Up#>,<#
    }
  #><#
    if (hasLocked && opts.noEdit !== true) {
  #>
  lockByIds<#=Table_Up#>,<#
    }
  #><#
    if (opts.noExport !== true) {
  #>
  useExportExcel<#=Table_Up#>,<#
    }
  #><#
    if (
      opts.noEdit !== true &&
      (hasIsSwitch || hasAtt || hasForeignKeyShowTypeDialog || hasOrderBy)
    ) {
  #>
  updateById<#=Table_Up#>,<#
    }
  #><#
    if (opts.noEdit !== true && opts.noAdd !== true && opts.noImport !== true) {
  #>
  importModels<#=Table_Up#>,
  useDownloadImportTemplate<#=Table_Up#>,<#
    }
  #><#
    if (hasSummary) {
  #>
  findSummary<#=Table_Up#>,<#
    }
  #>
} from "./Api.ts";<#
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
    if (foreignKey && (foreignKey.isSearchByLbl || foreignKey.isSearchBySelectInput)) {
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
    if (foreignKey && (foreignKey.isSearchByLbl || foreignKey.isSearchBySelectInput)) {
      continue;
    }
  #>
  getList<#=Foreign_Table_Up#>, // <#=column_comment#><#
  }
  #>
} from "./Api.ts";<#
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
  if (foreignSchema.opts?.list_tree !== true) {
    continue;
  }
  if (!column.search) {
    continue;
  }
  if (foreignTableArr3.includes(foreignTable)) continue;
  foreignTableArr3.push(foreignTable);
#>

import {
  getTree<#=Foreign_Table_Up#>,
} from "@/views/<#=foreignKey.mod#>/<#=foreignTable#>/Api.ts";<#
}
#><#
if (hasForeignTabs) {
#>

import ForeignTabs from "./ForeignTabs.vue";<#
}
#><#
if (hasForeignPage) {
#>

import {
  useOpenForeignPage,
} from "@/router/util.ts";<#
}
#><#
if (opts?.isRealData) {
#>

import {
  publish,
} from "@/compositions/websocket";<#
}
#><#
if (opts?.isUseDynPageFields) {
#>

import DynPageDetail from "@/views/base/dyn_page/Detail.vue";<#
}
#>

<#
let optionsName = table_comment;
if (list_tree) {
  optionsName = optionsName + "List";
}
#>defineOptions({
  name: "<#=optionsName#>",
});<#
if (hasForeignPage) {
#>

const openForeignPage = useOpenForeignPage();<#
}
#>

const pagePath = getPagePath<#=Table_Up#>();
const __filename = new URL(import.meta.url).pathname;
const pageName = getCurrentInstance()?.type?.name as string;<#
if (isUseI18n) {
#>

const {
  n,
  nAsync,
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns
} = useI18n(pagePath);
<#
}
#><#
if (mod === "base" && table === "role") {
#>
const usrStore = useUsrStore();<#
}
#>
const permitStore = usePermitStore();<#
if (tableFieldPermit) {
#>
const fieldPermitStore = useFieldPermitStore();<#
}
#>
const dirtyStore = useDirtyStore();

const clearDirty = dirtyStore.onDirty(onRefresh, pageName);

const permit = permitStore.getPermit(pagePath);<#
if (tableFieldPermit) {
#>
const field_permit = fieldPermitStore.getFieldPermit(pagePath);<#
}
#>

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
  propsNotReset?: string[];
  isListSelectDialog?: string;
  ids?: string[]; //ids
  selectedIds?: <#=Table_Up#>Id[]; //已选择行的id列表
  isMultiple?: string; //是否多选<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const canSearch = column.canSearch;
    if (!canSearch) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "version") continue;
    if ([
      "create_usr_id",
      "create_time",
      "update_usr_id",
      "update_time",
      "tenant_id",
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
    if (foreignKey || column.dict || column.dictbiz) {
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
  isMultiple: "0|1",
  isLocked: "0|1",
  isFocus: "0|1",
  isListSelectDialog: "0|1",
  ids: "string[]",<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const canSearch = column.canSearch;
    if (!canSearch) continue;
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
    if (foreignKey) {
      data_type = data_type+"[]";
    }
  #><#
    if (foreignKey) {
  #>
  <#=column_name#>: "string[]",
  <#=column_name#>_lbl: "string[]",<#
    } else if ((column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(column.DATA_TYPE)) {
  #>
  <#=column_name#>: "number[]",
  <#=column_name#>_lbl: "string[]",<#
    } else if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(column.DATA_TYPE)) {
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
  "propsNotReset",
  "isListSelectDialog",
];

/** 内置查询条件 */
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
const multiple = $computed(() => props.isMultiple !== "0");
/** 是否显示内置变量 */
const showBuildIn = $computed(() => props.showBuildIn === "1");
/** 是否分页 */
const isPagination = $computed(() => !props.isPagination || props.isPagination === "1");
/** 是否只读模式 */
const isLocked = $computed(() => props.isLocked === "1");
/** 是否 focus, 默认为 true */
const isFocus = $computed(() => props.isFocus !== "0");
const isListSelectDialog = $computed(() => props.isListSelectDialog === "1");<#
if (opts?.isUseDynPageFields) {
#>

/** 动态页面表单字段 */
const {
  dyn_page_field_models,
  refreshDynPageFields,
} = $(useDynPageFields(pagePath));<#
}
#>

/** 表格 */
const tableRef = $(useTemplateRef<InstanceType<typeof ElTable>>("tableRef"));<#
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

/** 查询 */
function initSearch() {
  const search = {<#
    if (hasIsDeleted) {
    #>
    is_deleted: 0,<#
    }
    #>
  } as <#=searchName#>;
  props.propsNotReset?.forEach((key) => {
    search[key] = builtInSearch[key];
  });
  return search;
}

let search = $ref(initSearch());<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  const data_type = column.DATA_TYPE;
  const column_type = column.COLUMN_TYPE;
  const column_comment = column.COLUMN_COMMENT || "";
  const require = column.require;
  const search = column.search;
  if (!search) continue;
  const foreignKey = column.foreignKey;
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
#><#
  if (foreignKey || column.dict || column.dictbiz) {
#>

// <#=column_comment#>
const <#=column_name#>_search = $computed({
  get() {
    return search.<#=column_name#> || [ ];
  },
  set(val) {
    if (!val || val.length === 0) {
      search.<#=column_name#> = undefined;
    } else {
      search.<#=column_name#> = val;
    }
  },
});<#
  } else if (data_type === "datetime") {
#>

// <#=column_comment#>
const <#=column_name#>_search = $computed({
  get() {
    return search.<#=column_name#> || [ ];
  },
  set(val) {
    if (!val || val.length === 0) {
      search.<#=column_name#> = undefined;
    } else {
      search.<#=column_name#> = [
        dayjs(val[0]).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        dayjs(val[1]).endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
      ];
    }
  },
});<#
  } else if (data_type === "date") {
#>

// <#=column_comment#>
const <#=column_name#>_search = $computed({
  get() {
    return search.<#=column_name#> || [ ];
  },
  set(val) {
    if (!val || val.length === 0) {
      search.<#=column_name#> = undefined;
    } else {
      search.<#=column_name#> = [
        dayjs(val[0]).startOf("day").format("YYYY-MM-DD"),
        dayjs(val[1]).endOf("day").format("YYYY-MM-DD"),
      ];
    }
  },
});<#
  }
#><#
}
#><#
if (hasSearchExpand) {
#>
let isSearchExpand = $(useStorage(`isSearchExpand-${ __filename }`, false));<#
}
#>

/** 回收站 */
async function onRecycle() {
  tableFocus();
  selectedIds = [ ];
  await dataGrid(true);
}

/** 查询 */
async function onSearch(isFocus: boolean) {
  if (isFocus) {
    tableFocus();
  }
  await dataGrid(true);
}

/** 暂存查询 */
async function onSearchStaging(searchStaging?: <#=searchName#>) {
  if (!searchStaging) {
    return;
  }
  search = searchStaging;
  await onSearch(true);
}

/** 刷新 */
async function onRefresh() {
  tableFocus();
  emit("refresh");
  await dataGrid(true);
}

let isSearchReset = $ref(false);

/** 重置查询 */
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

/** 清空查询框事件 */
async function onSearchClear() {
  tableFocus();
  await dataGrid(true);
}

/** 点击已选择 */
async function onIdsChecked() {
  tableFocus();
  await dataGrid(true);
}

/** 分页功能 */
const {
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
const tableSelected = useSelect<<#=modelName#>, <#=Table_Up#>Id>(
  $$(tableRef),
  {
    multiple: $$(multiple),
    isListSelectDialog,<#
    if (opts?.tableSelectable) {
    #>
    tableSelectable,<#
    }
    #>
  },
);

const {
  onSelect,
  rowClassName,
  onRow,
  onRowUp,
  onRowDown,
  onRowLeft,
  onRowRight,
  onRowHome,
  onRowEnd,
  tableFocus,
} = tableSelected;

let selectedIds = $(tableSelected.selectedIds);

watch(
  () => selectedIds,
  (oldVal, newVal) => {
    if (!inited) {
      return;
    }
    if (oldVal.length === newVal.length && oldVal.every((v, i) => v === newVal[i])) {
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
    if (column.isFluentEditor) {
      continue;
    }
    const foreignKey = column.foreignKey;
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE;
    const column_comment = column.COLUMN_COMMENT || "";
    const isPassword = column.isPassword;
    if (isPassword) continue;
    if (column_type) {
      if (
        (column_type !== "int(1)" && column_type.startsWith("int") && !column.dict && !column.dictbiz)
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
    let fixed = column.fixed;
    if (fixed === true) {
      fixed = "left";
    }
    const isIcon = column.isIcon;
  #><#
    if (isIcon) {
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
      if (fixed) {
      #>
      fixed: "<#=fixed#>",<#
      }
      #>
    },<#
    } else if (column.isImg) {
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
      if (fixed) {
      #>
      fixed: "<#=fixed#>",<#
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
      if (fixed) {
      #>
      fixed: "<#=fixed#>",<#
      }
      #>
    },<#
    } else if (foreignKey) {
    #>
    {
      label: "<#=column_comment#>",
      prop: "<#=column_name#>_lbl",<#
      if (foreignKey.type !== "multiple") {
      #>
      sortBy: "<#=column_name#>_lbl",<#
      }
      #><#
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
      if (fixed) {
      #>
      fixed: "<#=fixed#>",<#
      }
      #>
    },<#
    } else if (column.dict || column.dictbiz
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
      if (fixed) {
      #>
      fixed: "<#=fixed#>",<#
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
      if (fixed) {
      #>
      fixed: "<#=fixed#>",<#
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
const tableColumns = $ref<ColumnType[]>(getTableColumns());<#
if (isUseI18n) {
#>

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
});<#
}
#>

/** 表格列 */
const {
  headerDragend,
  resetColumns,
  storeColumns,
  initColumns,<#
  if (opts?.isUseDynPageFields) {
  #>
  useDynPageFieldsList,<#
  }
  #>
} = $(useTableColumns<<#=modelName#>>(
  $$(tableColumns),
  {
    persistKey: __filename,
  },
));

const detailRef = $(useTemplateRef<InstanceType<typeof Detail>>("detailRef"));

/** 当前表格数据对应的搜索条件 */
let currentSearch = $ref<<#=searchName#>>({ });

/** 刷新表格 */
async function dataGrid(
  isCount = false,
  opt?: GqlOpt,
) {
  clearDirty();<#
  for (const searchIntColumn of searchIntColumns) {
  #>
  
  // <#=searchIntColumn.COLUMN_COMMENT#>
  if (search.<#=searchIntColumn.COLUMN_NAME#>) {
    search.<#=searchIntColumn.COLUMN_NAME#> = search.<#=searchIntColumn.COLUMN_NAME#>.filter((item) => item != null);
  }<#
  }
  #>
  const search = getDataSearch();
  currentSearch = search;
  if (isCount) {
    await Promise.all([
      useFindAll(search, opt),
      useFindCount(search, opt),<#
      if (hasSummary) {
      #>
      dataSummary(search),<#
      }
      #>
    ]);
  } else {
    await Promise.all([
      useFindAll(search, opt),<#
      if (hasSummary) {
      #>
      dataSummary(search),<#
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
  search: <#=searchName#>,
  opt?: GqlOpt,
) {
  if (isPagination) {
    const pgSize = page.size;
    const pgOffset = (page.current - 1) * page.size;
    tableData = await findAll<#=Table_Up#>(
      search,
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
    tableData = await findAll<#=Table_Up#>(
      search,
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
  search: <#=searchName#>,
  opt?: GqlOpt,
) {
  tableData = await findAll<#=Table_Up#>(
    search,
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
  search: <#=searchName#>,
  opt?: GqlOpt,
) {
  const search2 = getDataSearch();
  page.total = await findCount<#=Table_Up#>(
    search2,
    opt,
  );
}<#
if (defaultSort && defaultSort.prop) {
#>

const _defaultSort: Sort = {
  prop: "<#=defaultSort.prop#>",
  order: "<#=defaultSort.order || 'ascending'#>",
};<#
} else {
#>

const _defaultSort: Sort = {
  prop: "",
  order: "ascending",
};<#
}
#>

const defaultSort: Sort = $computed(() => {
  if (_defaultSort.prop === "") {
    return _defaultSort;
  }
  const sort2: Sort = {
    ..._defaultSort,
  };
  const column = tableColumns.find((item) => item.sortBy === _defaultSort.prop);
  if (column) {
    sort2.prop = column.prop;
  }
  return sort2;
});

let sort = $ref<Sort>({
  ..._defaultSort,
});

/** 排序 */
async function onSortChange(
  { prop, order, column }: { column: TableColumnCtx<<#=modelName#>> } & Sort,
) {
  if (!order) {
    sort = {
      ..._defaultSort,
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

const exportExcel = $ref(useExportExcel<#=Table_Up#>(<#
if (isUseI18n) {
#>pagePath<#
}
#>));

/** 导出Excel */
async function onExport() {
  const search2 = getDataSearch();
  await exportExcel.workerFn(
    toExcelColumns(tableColumns),
    search2,
    [ sort ],
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

async function onLinkAtt(row: <#=modelName#>, key: keyof <#=modelName#>) {<#
    if (opts.noEdit !== true) {
#>
  await updateById<#=Table_Up#>(row.id, { [key]: row[key] });<#
    }
  #>
}<#
}
#><#
if (hasSummary) {
#>

/** 合计 */
let summarys = $ref({ });

async function dataSummary(
  search: <#=searchName#>,
) {
  summarys = await findSummary<#=Table_Up#>(search);
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
  if (!permit("add")) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("无权限"));<#
    } else {
    #>
    ElMessage.warning("无权限");<#
    }
    #>
    return;
  }
  const {
    changedIds,
  } = await detailRef.showDialog({<#
    if (isUseI18n) {
    #>
    title: await nsAsync("新增") + " " + await nsAsync("<#=table_comment#>"),<#
    } else {
    #>
    title: "新增 <#=table_comment#>",<#
    }
    #>
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
  if (!permit("add")) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("无权限"));<#
    } else {
    #>
    ElMessage.warning("无权限");<#
    }
    #>
    return;
  }
  if (selectedIds.length === 0) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("请选择需要 复制 的 {0}", await nsAsync("<#=table_comment#>")));<#
    } else {
    #>
    ElMessage.warning("请选择需要 复制 的 <#=table_comment#>");<#
    }
    #>
    return;
  }
  const id = selectedIds[selectedIds.length - 1];
  const ids = [ id ];
  const {
    changedIds,
  } = await detailRef.showDialog({<#
    if (isUseI18n) {
    #>
    title: await nsAsync("复制") + " " + await nsAsync("<#=table_comment#>"),<#
    } else {
    #>
    title: "复制 <#=table_comment#>",<#
    }
    #>
    action: "copy",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    model: {
      ids,
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

const uploadFileDialogRef = $(useTemplateRef<InstanceType<typeof UploadFileDialog>>("uploadFileDialogRef"));

let importPercentage = $ref(0);
let isImporting = $ref(false);
let isStopImport = $ref(false);

const downloadImportTemplate = $ref(useDownloadImportTemplate<#=Table_Up#>(<#
if (isUseI18n) {
#>pagePath<#
}
#>));

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
    const column_comment = column.COLUMN_COMMENT || "";
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
    if (foreignKey || column.dict || column.dictbiz
      || data_type === "date" || data_type === "datetime" || data_type === "timestamp"
    ) {
      column_name2 = `${column_name}_lbl`;
    }
  #><#
    if (isUseI18n) {
    #>
    [ await nAsync("<#=column_comment#>") ]: "<#=column_name2#>",<#
    } else {
    #>
    [ "<#=column_comment#>" ]: "<#=column_name2#>",<#
    }
    #><#
  }
  #>
  };
  const file = await uploadFileDialogRef.showDialog({<#
    if (isUseI18n) {
    #>
    title: await nsAsync("批量导入"),<#
    } else {
    #>
    title: "批量导入",<#
    }
    #>
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
  try {<#
    if (isUseI18n) {
    #>
    const messageHandler = ElMessage.info(await nsAsync("正在导入..."));<#
    } else {
    #>
    const messageHandler = ElMessage.info("正在导入...");<#
    }
    #>
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
            const column_comment = column.COLUMN_COMMENT || "";
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
            if (foreignKey || column.dict || column.dictbiz
              || data_type === "date" || data_type === "datetime" || data_type === "timestamp"
            ) {
              column_name2 = `${column_name}_lbl`;
            }
            let data_type2 = "string";
            if (foreignKey || column.dict || column.dictbiz) {
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
    const res = await importModels<#=Table_Up#>(
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
  const data_type = column.DATA_TYPE;
  const column_type = column.COLUMN_TYPE;
  const column_comment = column.COLUMN_COMMENT || "";
  if (!column.isSwitch || column.readonly) {
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
  await defaultById<#=Table_Up#>(
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
  await enableByIds<#=Table_Up#>(
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
  await lockByIds<#=Table_Up#>(
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
  await updateById<#=Table_Up#>(
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
  if (!permit("edit")) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("无权限"));<#
    } else {
    #>
    ElMessage.warning("无权限");<#
    }
    #>
    return;
  }
  if (selectedIds.length === 0) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("请选择需要编辑的 {0}", await nsAsync("<#=table_comment#>")));<#
    } else {
    #>
    ElMessage.warning("请选择需要编辑的 <#=table_comment#>");<#
    }
    #>
    return;
  }
  const ids = selectedIds;
  const {
    changedIds,
  } = await detailRef.showDialog({<#
    if (isUseI18n) {
    #>
    title: await nsAsync("编辑") + " " + await nsAsync("<#=table_comment#>"),<#
    } else {
    #>
    title: "编辑 <#=table_comment#>",<#
    }
    #>
    action: "edit",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    isReadonly: $$(isLocked),
    isLocked: $$(isLocked),
    model: {
      ids,
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
#><#
if (hasAudit) {
#>

/** 审核 */
async function openAudit() {
  if (isLocked) {
    return;
  }
  if (!detailRef) {
    return;
  }
  if (
    !permit("audit_submit") &&
    !permit("audit_pass") &&
    !permit("audit_reject") &&
    !permit("audit_review")
  ) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("无权限"));<#
    } else {
    #>
    ElMessage.warning("无权限");<#
    }
    #>
    return;
  }
  if (selectedIds.length === 0) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("请选择需要审核的 {0}", await nsAsync("<#=table_comment#>")));<#
    } else {
    #>
    ElMessage.warning("请选择需要审核的 <#=table_comment#>");<#
    }
    #>
    return;
  }
  const ids = selectedIds;
  const {
    changedIds,
  } = await detailRef.showDialog({<#
    if (isUseI18n) {
    #>
    title: await nsAsync("审核") + " " + await nsAsync("<#=table_comment#>"),<#
    } else {
    #>
    title: "审核 <#=table_comment#>",<#
    }
    #>
    action: "audit",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    isReadonly: $$(isLocked),
    isLocked: $$(isLocked),
    model: {
      ids,
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
#><#
if (hasAudit && auditTable_Up) {
#>

const auditListDialogRef = $(useTemplateRef<InstanceType<typeof AuditListDialog>>("auditListDialogRef"));

/** 打开审核列表 */
async function openAuditListDialog(
  id: <#=Table_Up#>Id,
) {
  if (!auditListDialogRef) {
    return;
  }
  const model = tableData.find((item) => item.id === id);
  if (!model) {
    return;
  }
  await auditListDialogRef.showDialog({<#
    if (isUseI18n) {
    #>
    title: await nsAsync("审核列表")<#
    if (opts?.lbl_field) {
    #> + " - " + await nsAsync("<#=table_comment#>") + " " + model.<#=opts?.lbl_field#><#
    }
    #>,<#
    } else {
    #>
    title: `审核列表 - <#=table_comment#> ${ model.<#=opts?.lbl_field#> }`,<#
    }
    #>
    action: "list",
    model: {
      id,
      is_deleted: search.is_deleted,
    },
  });
}<#
}
#>

/** 键盘回车按键 */
async function onRowEnter(e: KeyboardEvent) {
  if (props.selectedIds != null) {
    emit("rowEnter", e);
    return;
  }<#
  if (opts.noEdit !== true && opts.noAdd !== true) {
  #>
  if (e.ctrlKey) {
    await openEdit();
  } else if (e.shiftKey) {
    await openCopy();
  } else {
    await openView();
  }<#
  } else if (opts.noEdit !== true) {
  #>
  if (e.ctrlKey) {
    await openEdit();
  } else {
    await openView();
  }<#
  } else {
  #>
  await openView();<#
  }
  #>
}

/** 双击行 */
async function onRowDblclick(
  row: <#=modelName#>,
  column: TableColumnCtx<<#=modelName#>>,
) {
  if (column.type === "selection") {
    return;
  }
  if (isListSelectDialog) {
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
  if (selectedIds.length === 0) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("请选择需要查看的 {0}", await nsAsync("<#=table_comment#>")));<#
    } else {
    #>
    ElMessage.warning("请选择需要查看的 <#=table_comment#>");<#
    }
    #>
    return;
  }
  const search = getDataSearch();<#
  if (hasIsDeleted) {
  #>
  const is_deleted = search.is_deleted;<#
  }
  #>
  const ids = selectedIds;
  const {
    changedIds,
  } = await detailRef.showDialog({<#
    if (isUseI18n) {
    #>
    title: await nsAsync("查看") + " " + await nsAsync("<#=table_comment#>"),<#
    } else {
    #>
    title: "查看 <#=table_comment#>",<#
    }
    #>
    action: "view",
    builtInModel,
    showBuildIn: $$(showBuildIn),
    isLocked: $$(isLocked),
    model: {
      ids,<#
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
  if (!permit("delete")) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("无权限"));<#
    } else {
    #>
    ElMessage.warning("无权限");<#
    }
    #>
    return;
  }
  if (selectedIds.length === 0) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("请选择需要删除的 {0}", await nsAsync("<#=table_comment#>")));<#
    } else {
    #>
    ElMessage.warning("请选择需要删除的 <#=table_comment#>");<#
    }
    #>
    return;
  }
  try {<#
    if (isUseI18n) {
    #>
    await ElMessageBox.confirm(`${ await nsAsync("确定删除已选择的 {0} {1}", selectedIds.length, await nsAsync("<#=table_comment#>")) }?`, {
      confirmButtonText: await nsAsync("确定"),
      cancelButtonText: await nsAsync("取消"),
      type: "warning",
    });<#
    } else {
    #>
    await ElMessageBox.confirm(`确定删除已选择的 ${ selectedIds.length } <#=table_comment#>?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });<#
    }
    #>
  } catch (err) {
    return;
  }
  const num = await deleteByIds<#=Table_Up#>(selectedIds);<#
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
  tableData = tableData.filter((item) => !selectedIds.includes(item.id));
  selectedIds = [ ];
  dirtyStore.fireDirty(pageName);
  await dataGrid(true);<#
  if (isUseI18n) {
  #>
  ElMessage.success(await nsAsync("删除 {0} {1} 成功", num, await nsAsync("<#=table_comment#>")));<#
  } else {
  #>
  ElMessage.success(`删除 ${ num } <#=table_comment#> 成功`);<#
  }
  #>
  emit("remove", num);
}<#
}
#><#
if (opts.noDelete !== true && opts.noForceDelete !== true && hasIsDeleted) {
#>

/** 点击彻底删除 */
async function onForceDeleteByIds() {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (!permit("forceDelete")) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("无权限"));<#
    } else {
    #>
    ElMessage.warning("无权限");<#
    }
    #>
    return;
  }
  if (selectedIds.length === 0) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("请选择需要 彻底删除 的 {0}", await nsAsync("<#=table_comment#>")));<#
    } else {
    #>
    ElMessage.warning("请选择需要 彻底删除 的 <#=table_comment#>");<#
    }
    #>
    return;
  }
  try {<#
    if (isUseI18n) {
    #>
    await ElMessageBox.confirm(`${ await nsAsync("确定 彻底删除 已选择的 {0} {1}", selectedIds.length, await nsAsync("<#=table_comment#>")) }?`, {
      confirmButtonText: await nsAsync("确定"),
      cancelButtonText: await nsAsync("取消"),
      type: "warning",
    });<#
    } else {
    #>
    await ElMessageBox.confirm(`确定 彻底删除 已选择的 ${ selectedIds.length } <#=table_comment#>?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });<#
    }
    #>
  } catch (err) {
    return;
  }
  const num = await forceDeleteByIds<#=Table_Up#>(selectedIds);
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
    selectedIds = [ ];<#
    if (isUseI18n) {
    #>
    ElMessage.success(await nsAsync("彻底删除 {0} {1} 成功", num, await nsAsync("<#=table_comment#>")));<#
    } else {
    #>
    ElMessage.success(`彻底删除 ${ num } <#=table_comment#> 成功`);<#
    }
    #>
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
  if (permit("edit") === false) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("无权限"));<#
    } else {
    #>
    ElMessage.warning("无权限");<#
    }
    #>
    return;
  }
  if (selectedIds.length === 0) {
    let msg = "";
    if (is_enabled === 1) {<#
      if (isUseI18n) {
      #>
      msg = await nsAsync("请选择需要 启用 的 {0}", await nsAsync("<#=table_comment#>"));<#
      } else {
      #>
      msg = "请选择需要 启用 的 <#=table_comment#>";<#
      }
      #>
    } else {<#
      if (isUseI18n) {
      #>
      msg = await nsAsync("请选择需要 禁用 的 {0}", await nsAsync("<#=table_comment#>"));<#
      } else {
      #>
      msg = "请选择需要 禁用 的 <#=table_comment#>";<#
      }
      #>
    }
    ElMessage.warning(msg);
    return;
  }
  const num = await enableByIds<#=Table_Up#>(selectedIds, is_enabled);
  if (num > 0) {
    let msg = "";
    if (is_enabled === 1) {<#
      if (isUseI18n) {
      #>
      msg = await nsAsync("启用 {0} {1} 成功", num, await nsAsync("<#=table_comment#>"));<#
      } else {
      #>
      msg = `启用 ${ num } <#=table_comment#> 成功`;<#
      }
      #>
    } else {<#
      if (isUseI18n) {
      #>
      msg = await nsAsync("禁用 {0} {1} 成功", num, await nsAsync("<#=table_comment#>"));<#
      } else {
      #>
      msg = `禁用 ${ num } <#=table_comment#> 成功`;<#
      }
      #>
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
  if (permit("edit") === false) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("无权限"));<#
    } else {
    #>
    ElMessage.warning("无权限");<#
    }
    #>
    return;
  }
  if (selectedIds.length === 0) {
    let msg = "";
    if (is_locked === 1) {<#
      if (isUseI18n) {
      #>
      msg = await nsAsync("请选择需要 锁定 的 {0}", await nsAsync("<#=table_comment#>"));<#
      } else {
      #>
      msg = "请选择需要 锁定 的 <#=table_comment#>";<#
      }
      #>
    } else {<#
      if (isUseI18n) {
      #>
      msg = await nsAsync("请选择需要 解锁 的 {0}", await nsAsync("<#=table_comment#>"));<#
      } else {
      #>
      msg = "请选择需要 解锁 的 <#=table_comment#>";<#
      }
      #>
    }
    ElMessage.warning(msg);
    return;
  }
  const num = await lockByIds<#=Table_Up#>(selectedIds, is_locked);
  if (num > 0) {
    let msg = "";
    if (is_locked === 1) {<#
      if (isUseI18n) {
      #>
      msg = await nsAsync("锁定 {0} {1} 成功", num, await nsAsync("<#=table_comment#>"));<#
      } else {
      #>
      msg = `锁定 ${ num } <#=table_comment#> 成功`;<#
      }
      #>
    } else {<#
      if (isUseI18n) {
      #>
      msg = await nsAsync("解锁 {0} {1} 成功", num, await nsAsync("<#=table_comment#>"));<#
      } else {
      #>
      msg = `解锋 ${ num } <#=table_comment#> 成功`;<#
      }
      #>
    }
    ElMessage.success(msg);
    dirtyStore.fireDirty(pageName);
    await dataGrid(true);
  }
}<#
}
#><#
if (opts.noDelete !== true && opts.noRevert !== true && hasIsDeleted) {
#>

/** 点击还原 */
async function onRevertByIds() {
  tableFocus();
  if (isLocked) {
    return;
  }
  if (permit("delete") === false) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("无权限"));<#
    } else {
    #>
    ElMessage.warning("无权限");<#
    }
    #>
    return;
  }
  if (selectedIds.length === 0) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("请选择需要还原的 {0}", await nsAsync("<#=table_comment#>")));<#
    } else {
    #>
    ElMessage.warning("请选择需要还原的 <#=table_comment#>");<#
    }
    #>
    return;
  }
  try {<#
    if (isUseI18n) {
    #>
    await ElMessageBox.confirm(`${ await nsAsync("确定还原已选择的 {0} {1}", selectedIds.length, await nsAsync("<#=table_comment#>")) }?`, {
      confirmButtonText: await nsAsync("确定"),
      cancelButtonText: await nsAsync("取消"),
      type: "warning",
    });<#
    } else {
    #>
    await ElMessageBox.confirm(`确定还原已选择的 ${ selectedIds.length } <#=table_comment#>?`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });<#
    }
    #>
  } catch (err) {
    return;
  }
  const num = await revertByIds<#=Table_Up#>(selectedIds);
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
    await dataGrid(true);<#
    if (isUseI18n) {
    #>
    ElMessage.success(await nsAsync("还原 {0} {1} 成功", num, await nsAsync("<#=table_comment#>")));<#
    } else {
    #>
    ElMessage.success(`还原 ${ num } <#=table_comment#> 成功`);<#
    }
    #>
    emit("revert", num);
  }
}<#
}
#><#
if (mod === "base" && table === "operation_record") {
  const keys = Object.keys(optTables);
#>

async function getDetailByModule(
  module: string,
) {
  if (!module) {
    return;
  }<#
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const tableSchema = optTables[key];
    if (!tableSchema.opts.log) {
      continue;
    }
  #>
  if (module === "<#=key#>") {
    return await import("@/views/<#=tableSchema.opts.mod#>/<#=tableSchema.opts.table#>/Detail.vue");
  }<#
  }
  #>
}<#
}
#><#
if (hasForeignTabs) {
#>

const foreignTabsRef = $(useTemplateRef<InstanceType<typeof ForeignTabs>>("foreignTabsRef"));<#
if (hasForeignTabsButton || hasForeignTabsMore) {
#>

async function onOpenForeignTabs(
  tabGroup: string,
  title: string,
) {
  tableFocus();
  if (selectedIds.length === 0) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("请选择需要查看的 {0}", await nsAsync("<#=table_comment#>")));<#
    } else {
    #>
    ElMessage.warning("请选择需要查看的 <#=table_comment#>");<#
    }
    #>
    return;
  }
  if (selectedIds.length > 1) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("只能选择 1 {0}", await nsAsync("<#=table_comment#>")));<#
    } else {
    #>
    ElMessage.warning("只能选择 1 <#=table_comment#>");<#
    }
    #>
    return;
  }
  const id = selectedIds[0];
  await openForeignTabs(id, tabGroup, title);
  tableFocus();
}<#
}
#>

async function openForeignTabs(
  id: <#=Table_Up#>Id,
  tabGroup: string,
  title: string,
) {
  if (!foreignTabsRef) {
    return;
  }
  const ids = [ id ];
  await foreignTabsRef.showDialog({
    title,
    tabGroup,
    model: {
      ids,<#
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
#><#
if (isUseI18n) {
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
    const column_comment = column.COLUMN_COMMENT || "";
  #>
    "<#=column_comment#>",<#
  }
  #>
  ];
  await Promise.all([
    initListI18ns(),
    initI18ns(codes),
  ]);
}<#
}
#>

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

async function initFrame() {<#
  if (tableFieldPermit) {
  #>
  await fieldPermitStore.setTableColumnsFieldPermit(
    $$(tableColumns),
    [<#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        if (!column.fieldPermit) continue;
        const column_name = column.COLUMN_NAME;
        if ([
          "id",
          "create_usr_id",
          "create_time",
          "update_usr_id",
          "update_time",
          "tenant_id",
          "is_hidden",
          "is_deleted",
          "is_sys",
        ].includes(column_name)) continue;
        let data_type = column.DATA_TYPE;
        const column_comment = column.COLUMN_COMMENT;
        let is_nullable = column.IS_NULLABLE === "YES";
        const foreignKey = column.foreignKey;
        const foreignTableUp = foreignKey && foreignKey.table && foreignKey.table.substring(0, 1).toUpperCase()+foreignKey.table.substring(1);
        const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        let modelLabel = column.modelLabel;
        let cascade_fields = [ ];
        if (foreignKey) {
          cascade_fields = foreignKey.cascade_fields || [ ];
          if (foreignKey.lbl && cascade_fields.includes(foreignKey.lbl) && !modelLabel) {
            cascade_fields = cascade_fields.filter((item) => item !== column_name + "_" + foreignKey.lbl);
          } else if (modelLabel) {
            cascade_fields = cascade_fields.filter((item) => item !== modelLabel);
          }
        }
        if (foreignKey && foreignKey.lbl && !modelLabel) {
          modelLabel = column_name + "_" + foreignKey.lbl;
        } else if (!foreignKey && !modelLabel) {
          modelLabel = column_name + "_lbl";
        }
        let hasModelLabel = !!column.modelLabel;
        if (column.dict || column.dictbiz || data_type === "date" || data_type === "datetime") {
          hasModelLabel = true;
        } else if (foreignKey && foreignKey.lbl) {
          hasModelLabel = true;
        }
      #><#
      if (!foreignKey && !column.dict && !column.dictbiz
        && column.DATA_TYPE !== "date" && !column.DATA_TYPE === "datetime"
      ) {
      #>
      "<#=column_name#>",<#
      } else if (column.DATA_TYPE === "date" || column.DATA_TYPE === "datetime") {
      #>
      [ "<#=column_name#>", "<#=column_name#>_lbl" ],<#
      } else if (foreignKey) {
      #>
      [ "<#=column_name#>",<#
        if (hasModelLabel) {
      #> "<#=modelLabel#>"<#
        }
      #> ],<#
      } else if (column.dict || column.dictbiz) {
      #>
      [ "<#=column_name#>",<#
        if (hasModelLabel) {
      #> "<#=modelLabel#>"<#
        }
      #> ],<#
      } else {
      #>
      "<#=column_name#>",<#
      }
      #><#
      }
      #>
    ],
    pagePath,
  );<#
  }
  #>
  initColumns(tableColumns);
  await Promise.all([<#
    if (isUseI18n) {
    #>
    initI18nsEfc(),<#
    }
    #>
    dataGrid(true),<#
    if (opts?.isUseDynPageFields) {
    #>
    useDynPageFieldsList(),<#
    }
    #>
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
    if (builtInSearch.is_deleted != null) {
      search.is_deleted = builtInSearch.is_deleted;
    }<#
    }
    #>
    if (showBuildIn) {
      Object.assign(search, builtInSearch);
    }
    const search2 = getDataSearch();
    if (deepCompare(currentSearch, search2, undefined, [ "selectedIds" ])) {
      return;
    }
    await dataGrid(true);
  },
  {
    deep: true,
    immediate: true,
  },
);<#
if (opts?.isUseDynPageFields) {
#>

const dynPageDetailRef = $(useTemplateRef<InstanceType<typeof DynPageDetail>>("dynPageDetailRef"));

/** 新增字段 */
async function onDynPageFields() {
  
  if (!dynPageDetailRef) {
    return;
  }
  
  const {
    changedIds,
  } = await dynPageDetailRef.showDialog({
    action: "add",
    builtInModel: {
      code: getPagePathUsr(),
    },
    title: "新增字段",
  });
  
  if (changedIds.length == 0) {
    return;
  }
  
  await refreshDynPageFields();
  
}<#
}
#>

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
  const column_comment = column.COLUMN_COMMENT || "";
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

const <#=column_name#>ListSelectDialogRef = $(useTemplateRef<InstanceType<typeof ListSelectDialog>>("<#=column_name#>ListSelectDialogRef"));

async function on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(row: <#=modelName#>) {
  if (!<#=column_name#>ListSelectDialogRef) {
    return;
  }
  row.<#=column_name#> = row.<#=column_name#> || [ ];
  const res = await <#=column_name#>ListSelectDialogRef.showDialog({<#
    if (isUseI18n) {
    #>
    title: await nsAsync("选择") + " " + await nsAsync("<#=foreignSchema?.opts?.table_comment#>"),<#
    } else {
    #>
    title: "选择 <#=foreignSchema?.opts?.table_comment#>",<#
    }
    #>
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
  await updateById<#=Table_Up#>(row.id, { <#=column_name#>: selectedIds2 });
  dirtyStore.fireDirty(pageName);
  await dataGrid();
}<#
  }
#><#
  if (column.inlineMany2manyTab) {
#>

// <#=column_comment#>
async function on<#=column_name.substring(0, 1).toUpperCase() + column_name.substring(1)#>(row: <#=modelName#>) {
  selectedIds = [ row.id ];
  await openView();
}<#
  }
#><#
  if (foreignKey && foreignKey.isLinkForeignTabs) {
#>

const <#=foreignTable#>ForeignTabsRef = $(useTemplateRef<InstanceType<typeof <#=Foreign_Table_Up#>ForeignTabs>>("<#=foreignTable#>ForeignTabsRef"));

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
