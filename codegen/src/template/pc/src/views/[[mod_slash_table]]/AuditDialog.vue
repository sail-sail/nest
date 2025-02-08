<#
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const tableUP = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");

// 审核
const hasAudit = !!opts?.audit;
let auditColumn = "";
let auditMod = "";
let auditTable = "";
let auditModelLabel = "";
let auditTableIdColumn = undefined;
let auditTableSchema = undefined;
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
if (hasAudit) {
  auditTableSchema = opts?.audit?.auditTableSchema;
  auditTableIdColumn = auditTableSchema.columns.find(item => item.COLUMN_NAME === `${ table }_id`);
  if (!auditTableIdColumn) {
    throw new Error(`${ auditMod }_${ auditTable }: ${ auditTable }_id 字段不存在`);
  }
  auditModelLabel = auditTableIdColumn.modelLabel;
}
#><template>
<CustomDialog
  ref="customDialogRef"
  @keydown.ctrl.enter="onSaveKeydown"
  @keydown.ctrl.s="onSaveKeydown"
>
  <div
    un-flex="~ col"
  >
    <div
      un-flex="~ col"
      un-overflow-auto
      un-p="x-8 y-4"
      un-box-border
      un-gap="4"
      un-justify-start
      un-items-safe-center
    >
      <el-form
        ref="formRef"
        size="default"
        label-width="auto"
        
        un-grid="~ cols-[repeat(1,380px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
        
        @submit.prevent
      >
        
        <el-form-item<#
          if (isUseI18n) {
          #>
          :label="n('原因')"<#
          } else {
          #>
          label="原因"<#
          }
          #>
          prop="rem"
          un-grid="col-span-full"
        >
          <CustomInput
            v-model="dialogModel.rem"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"<#
            if (isUseI18n) {
            #>
            :placeholder="`${ ns('请输入') } ${ n('原因') }`"<#
            } else {
            #>
            placeholder="请输入 原因"<#
            }
            #>
            @keyup.enter.stop
          ></CustomInput>
        </el-form-item>
        
      </el-form>
    </div>
    <div
      un-p="y-3"
      un-box-border
      un-flex
      un-justify-center
      un-items-center
    >
      
      <el-button
        plain
        @click="onClose"
      >
        <template #icon>
          <ElIconCircleClose />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('关闭') }}</span><#
        } else {
        #>
        <span>关闭</span><#
        }
        #>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('确定') }}</span><#
        } else {
        #>
        <span>确定</span><#
        }
        #>
      </el-button>
      
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>
import {
  getPagePath,
  auditReject,
} from "./Api.ts";

const pagePath = getPagePath();

const permitStore = usePermitStore();

const permit = permitStore.getPermit(pagePath);

let inited = $ref(false);

type DialogAction = "reject";
let dialogAction = $ref<DialogAction>("reject");
let dialogTitle = $ref("");
let dialogNotice = $ref("");

const customDialogRef = $(useTemplateRef<InstanceType<typeof CustomDialog>>("customDialogRef"));

let dialogModel = $ref<<#=auditTable_Up#>Input>({
} as <#=auditTable_Up#>Input);

let id = $ref<<#=Table_Up#>Id>();

const formRef = $(useTemplateRef<InstanceType<typeof ElForm>>("formRef"));

/** 表单校验 */
let form_rules = $ref<Record<string, FormItemRule[]>>({ });

watchEffect(async () => {
  if (!inited) {
    form_rules = { };
    return;
  }
  await nextTick();
  form_rules = {
    // 原因
    rem: [
      {
        required: true,<#
        if (isUseI18n) {
        #>
        message: `${ ns('请输入') } ${ n('原因') }`,<#
        } else {
        #>
        message: "请输入 原因",<#
        }
        #>
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    model?: {
      id?: <#=Table_Up#>Id;
    };
    action: DialogAction;
  },
) {
  inited = false;
  dialogTitle = arg?.title ?? "";
  const notice = arg?.notice;
  dialogNotice = notice ?? "";
  dialogModel = {
  };
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "auto",
    title: $$(dialogTitle),
    pointerPierce: true,
    notice: $$(dialogNotice),
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const model = arg?.model;
  const action = arg?.action;
  dialogAction = action || "reject";
  id = model?.id;
  
  inited = true;
  
  setTimeout(() => {
    formRef?.clearValidate();
    customDialogRef?.focus();
  }, 0);
  return await dialogRes.dialogPrm;
}

/** 快捷键ctrl+回车 */
async function onSaveKeydown(e: KeyboardEvent) {
  e.preventDefault();
  e.stopImmediatePropagation();
  customDialogRef?.focus();
  await onSave();
}

/** 保存 */
async function onSave() {
  if (!formRef) {
    return;
  }
  if (!id) {
    return;
  }
  try {
    await formRef.validate();
  } catch (err) {
    return;
  }
  if (dialogAction === "reject") {
    const dialogModel2 = {
      ...dialogModel,
      id: undefined,
    };
    await auditReject(
      id,
      dialogModel2,
    );
  }
  onCloseResolve({
    type: "ok",
  });
}

async function onClose() {
  onCloseResolve({
    type: "cancel",
  });
}

defineExpose({
  showDialog,
});
</script>
