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
        
        un-grid="~ rows-[auto] cols-[repeat(2,380px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
        @keyup.enter="saveClk"
      >
        
        <template v-if="(showBuildIn || builtInModel?.code == null)">
          <el-form-item
            :label="n('编码')"
            prop="code"
            un-h="full"
          >
            <el-input
              v-model="dialogModel.code"
              un-w="full"
              :placeholder="`${ ns('请输入') } ${ n('编码') }`"
              :clearable="true"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.lbl == null)">
          <el-form-item
            :label="n('名称')"
            prop="lbl"
            un-h="full"
          >
            <el-input
              v-model="dialogModel.lbl"
              un-w="full"
              :placeholder="`${ ns('请输入') } ${ n('名称') }`"
              :clearable="true"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.type == null)">
          <el-form-item
            :label="n('数据类型')"
            prop="type"
            un-h="full"
          >
            <DictSelect
              :set="dialogModel.type = dialogModel.type ?? undefined"
              v-model="dialogModel.type"
              code="dict_type"
              un-w="full"
              :placeholder="`${ ns('请选择') } ${ n('数据类型') }`"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.order_by == null)">
          <el-form-item
            :label="n('排序')"
            prop="order_by"
            un-h="full"
          >
            <el-input-number
              :set="dialogModel.order_by = dialogModel.order_by ?? undefined"
              v-model="dialogModel.order_by"
              un-w="full"
              :precision="0"
              :step="1"
              :step-strictly="true"
              :controls="false"
              :placeholder="`${ ns('请输入') } ${ n('排序') }`"
              :clearable="true"
            ></el-input-number>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.rem == null)">
          <el-form-item
            :label="n('备注')"
            prop="rem"
            un-grid="col-span-2"
            un-h="full"
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
        @click="cancelClk"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>{{ n('取消') }}</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="saveClk"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ n('保存') }}</span>
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
  create,
  findById,
  findLastOrderBy,
  updateById,
} from "./Api";

import {
  type DictInput,
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
} = useI18n("/base/dict");

let inited = $ref(false);

type DialogAction = "add" | "copy" | "edit";
let dialogAction = $ref<DialogAction>("add");

let dialogModel = $ref({
} as DictInput);

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
    code: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("编码") }`,
      },
    ],
    lbl: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("名称") }`,
      },
    ],
    type: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("数据类型") }`,
      },
    ],
    is_enabled: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("启用") }`,
      },
    ],
    is_locked: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("锁定") }`,
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
let builtInModel = $ref<DictInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 增加时的默认值 */
async function getDefaultInput() {
  const defaultInput: DictInput = {
    type: "string",
    order_by: 1,
    is_enabled: 1,
    is_locked: 0,
  };
  return defaultInput;
}

let customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    builtInModel?: DictInput;
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
      order_by,
    ] = await Promise.all([
      getDefaultInput(),
      findLastOrderBy(),
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,
      ...model,
      order_by: order_by + 1,
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
        is_locked: undefined,
        is_locked_lbl: undefined,
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
    dialogModel = data;
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

/** 确定 */
async function saveClk() {
  if (!formRef) {
    return;
  }
  try {
    await formRef.validate();
  } catch (err) {
    return;
  }
  let id: string | undefined = undefined;
  let msg = "";
  if (dialogAction === "add" || dialogAction === "copy") {
    const dialogModel2 = {
      ...dialogModel,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    id = await create(dialogModel2);
    dialogModel.id = id;
    msg = await nsAsync("添加成功");
  } else if (dialogAction === "edit") {
    if (!dialogModel.id) {
      return;
    }
    id = await updateById(
      dialogModel.id,
      {
        ...dialogModel,
        ...builtInModel,
      },
    );
    msg = await nsAsync("修改成功");
  }
  if (id) {
    if (!changedIds.includes(id)) {
      changedIds.push(id);
    }
    ElMessage.success(msg);
    const hasNext = await nextId();
    if (hasNext) {
      return;
    }
    onCloseResolve({
      type: "ok",
      changedIds,
    });
  }
}

/** 点击取消关闭按钮 */
function cancelClk() {
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
    "编码",
    "名称",
    "数据类型",
    "排序",
    "启用",
    "备注",
    "锁定",
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
