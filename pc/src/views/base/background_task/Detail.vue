<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
  >
    <div
      un-flex="~ [1_0_0] col basis-[inherit]"
      un-overflow-auto
      un-p="5"
      un-justify-start
      un-items-center
    >
      <el-form
        ref="formRef"
        size="default"
        label-width="auto"
        
        un-grid="~ cols-[repeat(2,380px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
      >
        
        <template v-if="(showBuildIn || builtInModel?.lbl == null)">
          <el-form-item
            :label="n('名称')"
            prop="lbl"
          >
            <el-input
              v-model="dialogModel.lbl"
              un-w="full"
              :placeholder="`${ ns('请输入') } ${ n('名称') }`"
              :clearable="true"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.state == null)">
          <el-form-item
            :label="n('状态')"
            prop="state"
          >
            <DictSelect
              :set="dialogModel.state = dialogModel.state ?? undefined"
              v-model="dialogModel.state"
              code="background_task_state"
              un-w="full"
              :placeholder="`${ ns('请选择') } ${ n('状态') }`"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.type == null)">
          <el-form-item
            :label="n('类型')"
            prop="type"
          >
            <DictSelect
              :set="dialogModel.type = dialogModel.type ?? undefined"
              v-model="dialogModel.type"
              code="background_task_type"
              un-w="full"
              :placeholder="`${ ns('请选择') } ${ n('类型') }`"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.result == null)">
          <el-form-item
            :label="n('执行结果')"
            prop="result"
          >
            <el-input
              v-model="dialogModel.result"
              un-w="full"
              :placeholder="`${ ns('请输入') } ${ n('执行结果') }`"
              :clearable="true"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.err_msg == null)">
          <el-form-item
            :label="n('错误信息')"
            prop="err_msg"
          >
            <el-input
              v-model="dialogModel.err_msg"
              un-w="full"
              :placeholder="`${ ns('请输入') } ${ n('错误信息') }`"
              :clearable="true"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.begin_time == null)">
          <el-form-item
            :label="n('开始时间')"
            prop="begin_time"
          >
            <el-date-picker
              :set="dialogModel.begin_time = dialogModel.begin_time ?? undefined"
              v-model="dialogModel.begin_time"
              un-w="full"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="`${ ns('请选择') } ${ n('开始时间') }`"
            ></el-date-picker>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.end_time == null)">
          <el-form-item
            :label="n('结束时间')"
            prop="end_time"
          >
            <el-date-picker
              :set="dialogModel.end_time = dialogModel.end_time ?? undefined"
              v-model="dialogModel.end_time"
              un-w="full"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="`${ ns('请选择') } ${ n('结束时间') }`"
            ></el-date-picker>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.rem == null)">
          <el-form-item
            :label="n('备注')"
            prop="rem"
            un-grid="col-span-2"
          >
            <el-input
              v-model="dialogModel.rem"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              @keyup.enter.stop
              un-w="full"
              :placeholder="`${ ns('请输入') } ${ n('备注') }`"
              :clearable="true"
            ></el-input>
          </el-form-item>
        </template>
        
      </el-form>
    </div>
    <div
      un-p="y-2.5"
      un-flex
      un-justify-center
      un-items-center
    >
      
      <el-button
        plain
        @click="closeClk"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>{{ n('关闭') }}</span>
      </el-button>
      
      <div
        v-if="(ids && ids.length > 1)"
        un-text="3 [var(--el-text-color-regular)]"
        un-pos-absolute
        un-right="2"
      >
        
        <el-button
          link
          :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) <= 0"
          @click="prevIdClk"
        >
          {{ n('上一项') }}
        </el-button>
        
        <span>
          {{ (dialogModel.id && ids.indexOf(dialogModel.id) || 0) + 1 }} / {{ ids.length }}
        </span>
        
        <el-button
          link
          :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) >= ids.length - 1"
          @click="nextIdClk"
        >
          {{ n('下一项') }}
        </el-button>
        
        <span v-if="changedIds.length > 0">
          {{ changedIds.length }}
        </span>
        
      </div>
      
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>
import {
  findById,
} from "./Api";

import {
  type BackgroundTaskInput,
} from "#/types";

import {
} from "./Api";

const emit = defineEmits<
  (
    e: "nextId",
    value: {
      dialogAction: DialogAction,
      id: string,
    },
  ) => void
>();

const {
  n,
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns,
} = useI18n("/base/background_task");

let inited = $ref(false);

type DialogAction = "add" | "copy" | "edit";
let dialogAction = $ref<DialogAction>("add");

let dialogModel = $ref({
} as BackgroundTaskInput);

let ids = $ref<string[]>([ ]);
let changedIds = $ref<string[]>([ ]);

let formRef = $ref<InstanceType<typeof ElForm>>();

/** 表单校验 */
let form_rules = $ref<Record<string, FormItemRule[]>>({ });

watchEffect(async () => {
  if (!inited) {
    form_rules = { };
    return;
  }
  await nextTick();
  form_rules = {
    lbl: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("名称") }`,
      },
    ],
    state: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("状态") }`,
      },
    ],
    type: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("类型") }`,
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: string[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<BackgroundTaskInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 增加时的默认值 */
async function getDefaultInput() {
  const defaultInput: BackgroundTaskInput = {
  };
  return defaultInput;
}

let customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    builtInModel?: BackgroundTaskInput;
    showBuildIn?: Ref<boolean> | boolean;
    model?: {
      id?: string;
      ids?: string[];
    };
    action: DialogAction;
  },
) {
  inited = false;
  const title = arg?.title;
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "auto",
    title,
    pointerPierce: true,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const model = arg?.model;
  const action = arg?.action;
  builtInModel = arg?.builtInModel;
  showBuildIn = unref(arg?.showBuildIn) ?? false;
  dialogAction = action || "add";
  ids = [ ];
  changedIds = [ ];
  dialogModel = {
  };
  if (dialogAction === "copy" && !model?.id) {
    dialogAction = "add";
  }
  if (action === "add") {
    const [
      defaultModel,
    ] = await Promise.all([
      getDefaultInput(),
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,
      ...model,
    };
  } else if (dialogAction === "copy") {
    if (!model?.id) {
      return await dialogRes.dialogPrm;
    }
    const data = await findById(model.id);
    if (data) {
      dialogModel = {
        ...data,
        id: undefined,
      };
    }
  } else if (action === "edit") {
    if (!model || !model.ids) {
      return await dialogRes.dialogPrm;
    }
    ids = model.ids;
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
      await refreshEfc();
    }
  }
  inited = true;
  return await dialogRes.dialogPrm;
}

/** 刷新 */
async function refreshEfc() {
  if (!dialogModel.id) {
    return;
  }
  const data = await findById(dialogModel.id);
  if (data) {
    dialogModel = {
      ...data,
    };
  }
}

/** 点击上一项 */
async function prevIdClk() {
  await prevId();
}

/** 上一项 */
async function prevId() {
  if (!dialogModel.id) {
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
    }
  } else {
    const idx = ids.indexOf(dialogModel.id);
    if (idx > 0) {
      dialogModel.id = ids[idx - 1];
    } else {
      return false;
    }
  }
  await refreshEfc();
  emit(
    "nextId",
    {
      dialogAction,
      id: dialogModel.id!,
    },
  );
  return true;
}

/** 点击下一项 */
async function nextIdClk() {
  await nextId();
}

/** 下一项 */
async function nextId() {
  if (!dialogModel.id) {
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
    } else {
      return false;
    }
  } else {
    const idx = ids.indexOf(dialogModel.id);
    if (idx >= 0 && idx < ids.length - 1) {
      dialogModel.id = ids[idx + 1];
    } else {
      return false;
    }
  }
  await refreshEfc();
  emit(
    "nextId",
    {
      dialogAction,
      id: dialogModel.id!,
    },
  );
  return true;
}

/** 点击取消关闭按钮 */
function closeClk() {
  onCloseResolve({
    type: "cancel",
    changedIds,
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  done(false);
  onCloseResolve({
    type: "cancel",
    changedIds,
  });
}

/** 初始化ts中的国际化信息 */
async function initI18nsEfc() {
  const codes: string[] = [
    "名称",
    "状态",
    "类型",
    "执行结果",
    "错误信息",
    "开始时间",
    "结束时间",
    "备注",
    "创建人",
    "创建时间",
    "更新人",
    "更新时间",
  ];
  await Promise.all([
    initDetailI18ns(),
    initI18ns(codes),
  ]);
}
initI18nsEfc();

defineExpose({ showDialog });
</script>
