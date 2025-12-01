<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
  @open="onDialogOpen"
  @close="onDialogClose"
  @keydown.page-down="onPageDown"
  @keydown.page-up="onPageUp"
  @keydown.insert="onInsert"
  @keydown.ctrl.i="onInsert"
  @keydown.ctrl.arrow-down="onPageDown"
  @keydown.ctrl.arrow-up="onPageUp"
  @keydown.ctrl.enter="onSaveKeydown"
  @keydown.ctrl.s="onSaveKeydown"
>
  <template #extra_header>
    <div
      title="重置"
    >
      <ElIconRefresh
        class="reset_but"
        @click="onReset"
      ></ElIconRefresh>
    </div>
    <template v-if="!isLocked && !is_deleted && (dialogAction === 'edit' || dialogAction === 'view')">
      <div
        v-if="!isReadonly"
        title="锁定"
      >
        <ElIconUnlock
          class="unlock_but"
          @click="isReadonly = true;"
        >
        </ElIconUnlock>
      </div>
      <div
        v-else
        title="解锁"
      >
        <ElIconLock
          class="lock_but"
          @click="isReadonly = false;"
        ></ElIconLock>
      </div>
    </template>
  </template>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
  >
    <div
      un-flex="~ [1_0_0] col basis-[inherit]"
      un-overflow-auto
      un-p="x-8 y-4"
      un-box-border
      un-gap="4"
      un-justify="start"
      un-items="center-safe"
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
        
        <template
          v-for="field_model in dyn_page_field_models"
          :key="field_model.id"
        >
          <el-form-item
            :label="field_model.lbl"
            :prop="field_model.code"
            :class="{
              'col-span-full':
                field_model.type === 'CustomInput' &&
                field_model._attrs.type === 'textarea',
            }"
          >
            <CustomDynComp
              :model-value="dialogModel.dyn_page_data?.[field_model.code]"
              :name="field_model.type"
              :placeholder="`请输入 ${ field_model.lbl }`"
              v-bind="field_model._attrs"
              :autosize="
                (field_model._attrs.minRows || field_model._attrs.maxRows) && 
                  {
                    minRows: field_model._attrs.minRows,
                    maxRows: field_model._attrs.maxRows,
                  }
              "
              :readonly="field_model._attrs.readonly || isLocked || isReadonly"
              @update:model-value="(val: any) => {
                dialogModel.dyn_page_data = dialogModel.dyn_page_data ?? { };
                dialogModel.dyn_page_data[field_model.code] = val;
              }"
            ></CustomDynComp>
          </el-form-item>
        </template>
        
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
        </template>
        <span>关闭</span>
      </el-button>
      
      <el-button
        v-if="(dialogAction === 'add' || dialogAction === 'copy') && permit('add', '新增') && !isLocked && !isReadonly"
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>保存</span>
      </el-button>
      
      <el-button
        v-if="(dialogAction === 'edit' || dialogAction === 'view') && permit('edit', '编辑') && !isLocked && !isReadonly"
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>保存</span>
      </el-button>
      
      <div
        un-text="3 [var(--el-text-color-regular)]"
        un-pos-absolute
        un-right="2"
        un-flex="~"
        un-gap="x-1"
      >
        <template v-if="(ids && ids.length > 1)">
          <el-button
            link
            :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) <= 0"
            @click="onPrevId"
          >
            <ElIconArrowLeft
              un-w="1em"
              un-h="1em"
            ></ElIconArrowLeft>
          </el-button>
          
          <div>
            {{ (dialogModel.id && ids.indexOf(dialogModel.id) || 0) + 1 }} / {{ ids.length }}
          </div>
          
          <el-button
            link
            :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) >= ids.length - 1"
            @click="onNextId"
          >
            <ElIconArrowRight
              un-w="1em"
              un-h="1em"
            ></ElIconArrowRight>
          </el-button>
        </template>
        
        <div v-if="changedIds.length > 0">
          {{ changedIds.length }}
        </div>
      </div>
      
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>
import type {
  MaybeRefOrGetter,
  WatchStopHandle,
} from "vue";

import {
  createDynPageData,
  findOneDynPageData,
  updateByIdDynPageData,
  getDefaultInputDynPageData,
  getPagePathDynPageData,
  intoInputDynPageData,
  getFieldCommentsDynPageData,
} from "./Api.ts";

import {
  Parser as ExprParser,
} from "expr-eval";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: DynPageDataId,
    },
  ],
}>();

const pagePath = getPagePathDynPageData();

const permitStore = usePermitStore();

const permit = permitStore.getPermit(pagePath);

// 创建公式解析器
const exprParser = new ExprParser();

let inited = $ref(false);

type DialogAction = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<DialogAction>("add");
let dialogTitle = $ref("");
let oldDialogTitle = "";
let oldDialogNotice: string | undefined = undefined;
let oldIsLocked = $ref(false);
let dialogNotice = $ref("");

let dialogModel: DynPageDataInput = $ref({
  dyn_page_data: { },
} as DynPageDataInput);

let dyn_page_data_model = $ref<DynPageDataModel>();

let ids = $ref<DynPageDataId[]>([ ]);
let is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<DynPageDataId[]>([ ]);

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
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: DynPageDataId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<DynPageDataInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

/** 动态页面表单字段 */
const {
  dyn_page_field_models,
  refreshDynPageFields,
} = $(useDynPageFields(pagePath));

refreshDynPageFields();

/** 有公式的字段 */
const dyn_page_field_formula_models = $computed(() => {
  return dyn_page_field_models.filter((fm) => fm.formula);
});

let field_comments = $ref<DynPageDataFieldComment>();

// 深度监听 dialogModel 的变化，根据公式字段修改其他字段的值, 同时避免循环引用
watch(
  () => dialogModel,
  (value, oldValue) => {
    if (!inited || dyn_page_field_formula_models.length === 0) {
      return;
    }
    if (!field_comments) {
      return;
    }
    // 把 field_comments 的key跟value颠倒过来，方便查找
    const comment_to_code: Record<string, string> = { };
    for (const [code, comment] of Object.entries(field_comments)) {
      if (!comment) {
        continue;
      }
      if (code === "dyn_page_data") {
        for (const [code2, comment2] of Object.entries(comment)) {
          if (!comment2) {
            continue;
          }
          comment_to_code[comment2 as string] = code2;
        }
      } else {
        comment_to_code[comment] = code;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model2: Record<string, any> = { };
    for (const [key, val] of Object.entries(value)) {
      if (key === "dyn_page_data" && val && typeof val === "object") {
        for (const [k2, v2] of Object.entries(val)) {
          model2[k2] = v2;
          if (field_comments[k2]) {
            model2[field_comments[k2]] = v2;
          }
        }
      } else {
        model2[key] = val;
        if (field_comments[key]) {
          model2[field_comments[key]] = val;
        }
      }
    }
    // 计算公式字段的值
    for (const field_model of dyn_page_field_formula_models) {
      const formula = field_model.formula;
      if (!formula || formula.trim() === "") {
        continue;
      }
      try {
        // 转义正则特殊字符并按长度降序排列，避免短词先替换导致长词匹配失败
        const comment_keys = Object.keys(comment_to_code)
          .sort((a, b) => b.length - a.length)
          .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        
        const formula2 = formula.replace(
          new RegExp(comment_keys.join('|'), 'g'),
          (matched) => comment_to_code[matched],
        );
        
        const expr = exprParser.parse(formula2);
        const newVal = expr.evaluate(model2);
        const oldVal = oldValue?.dyn_page_data
          ? oldValue.dyn_page_data[field_model.code]
          : undefined;
        if (newVal !== oldVal) {
          dialogModel.dyn_page_data = dialogModel.dyn_page_data || { };
          dialogModel.dyn_page_data[field_model.code] = newVal;
        }
      } catch (err) {
        ElMessage.error(
          `计算字段 ${field_model.code} 的公式时出错: ${ err }`,
        );
        console.error(
          `计算字段 ${field_model.code} 的公式时出错: `,
          err,
        );
      }
    }
  },
  {
    deep: true,
  },
);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

const customDialogRef = $(useTemplateRef<InstanceType<typeof CustomDialog>>("customDialogRef"));

let findOneModel = findOneDynPageData;

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    builtInModel?: DynPageDataInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: DynPageDataId[];
      is_deleted?: 0 | 1 | null;
    };
    findOne?: typeof findOneDynPageData;
    action: DialogAction;
  },
) {
  inited = false;
  dialogTitle = arg?.title ?? "";
  oldDialogTitle = dialogTitle;
  const notice = arg?.notice;
  oldDialogNotice = notice;
  dialogNotice = notice ?? "";
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "auto",
    title: $$(dialogTitle),
    pointerPierce: true,
    notice: $$(dialogNotice),
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const model = arg?.model;
  const action = arg?.action;
  builtInModel = arg?.builtInModel;
  showBuildIn = false;
  isReadonly = false;
  isLocked = false;
  is_deleted = model?.is_deleted ?? 0;
  if (arg?.findOne) {
    findOneModel = arg.findOne;
  } else {
    findOneModel = findOneDynPageData;
  }
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  readonlyWatchStop = watchEffect(function() {
    showBuildIn = toValue(arg?.showBuildIn) ?? showBuildIn;
    isReadonly = toValue(arg?.isReadonly) ?? isReadonly;
    oldIsLocked = toValue(arg?.isLocked) ?? false;
    
    if (!permit("edit")) {
      isLocked = true;
    } else {
      isLocked = toValue(arg?.isLocked) ?? isLocked;
    }
  });
  dialogAction = action || "add";
  ids = [ ];
  changedIds = [ ];
  dialogModel = {
    dyn_page_data: { },
  };
  dyn_page_data_model = undefined;
  
  field_comments = await getFieldCommentsDynPageData(pagePath);
  
  if (dialogAction === "copy" && !model?.ids?.[0]) {
    dialogAction = "add";
  }
  if (action === "add") {
    const [
      defaultModel,
    ] = await Promise.all([
      getDefaultInputDynPageData(),
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,
      ...model,
    };
  } else if (dialogAction === "copy") {
    const id = model?.ids?.[0];
    if (!id) {
      return await dialogRes.dialogPrm;
    }
    const [
      data,
    ] = await Promise.all([
      findOneModel({
        id,
        is_deleted,
      }),
    ]);
    if (data) {
      dialogModel = {
        ...data,
        id: undefined,
      };
      Object.assign(dialogModel, { is_deleted: undefined });
    }
  } else if (dialogAction === "edit") {
    if (!model || !model.ids) {
      return await dialogRes.dialogPrm;
    }
    ids = model.ids;
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
      await onRefresh();
    }
  } else if (dialogAction === "view") {
    if (!model || !model.ids) {
      return await dialogRes.dialogPrm;
    }
    isReadonly = true;
    ids = model.ids;
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
      await onRefresh();
    }
  }
  inited = true;
  return await dialogRes.dialogPrm;
}

/** 键盘按 Insert */
async function onInsert() {
  isReadonly = !isReadonly;
  await nextTick();
  customDialogRef?.focus();
}

/** 重置 */
async function onReset() {
  if (!formRef) {
    return;
  }
  if (!isReadonly && !isLocked) {
    try {
      await ElMessageBox.confirm(
        "确定要重置表单吗",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        },
      );
    } catch (err) {
      return;
    }
  }
  await onRefresh();
  nextTick(() => nextTick(() => formRef?.clearValidate()));
  ElMessage({
    message: "表单重置完毕",
    type: "success",
  });
}

/** 刷新 */
async function onRefresh() {
  const id = dialogModel.id;
  if (!id) {
    const [
      defaultModel,
    ] = await Promise.all([
      getDefaultInputDynPageData(),
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,
    };
    return;
  }
  const [
    data,
  ] = await Promise.all([
    await findOneModel({
      id,
      is_deleted,
    }),
  ]);
  if (data) {
    dialogModel = intoInputDynPageData({
      ...data,
    });
  }
  dyn_page_data_model = data;
}

/** 键盘按 PageUp */
async function onPageUp(e?: KeyboardEvent) {
  if (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
  const isSucc = await prevId();
  if (!isSucc) {
    ElMessage.warning("已经是第一项了");
  }
}

/** 点击上一项 */
async function onPrevId() {
  await prevId();
  customDialogRef?.focus();
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
  await onRefresh();
  emit(
    "nextId",
    {
      dialogAction,
      id: dialogModel.id!,
    },
  );
  return true;
}

/** 键盘按 PageDown */
async function onPageDown(e?: KeyboardEvent) {
  if (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
  const isSucc = await nextId();
  if (!isSucc) {
    ElMessage.warning("已经是最后一项了");
  }
}

/** 点击下一项 */
async function onNextId() {
  await nextId();
  customDialogRef?.focus();
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
  await onRefresh();
  emit(
    "nextId",
    {
      dialogAction,
      id: dialogModel.id!,
    },
  );
  return true;
}

/** 快捷键ctrl+回车 */
async function onSaveKeydown(e: KeyboardEvent) {
  e.preventDefault();
  e.stopImmediatePropagation();
  customDialogRef?.focus();
  await onSave();
}

/** 保存并返回id */
async function save() {
  if (isReadonly) {
    return;
  }
  if (!formRef) {
    return;
  }
  if ((dialogAction === "edit" || dialogAction === "view") && !permit("edit")) {
    return;
  }
  if (dialogAction === "add" && !permit("add")) {
    return;
  }
  try {
    await formRef.validate();
  } catch (err) {
    return;
  }
  let id: DynPageDataId | undefined = undefined;
  let msg = "";
  if (dialogAction === "add" || dialogAction === "copy") {
    const dialogModel2 = {
      ...dialogModel,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    Object.assign(dialogModel2, { is_deleted: undefined });
    dialogModel2.ref_code = pagePath;
    id = await createDynPageData(dialogModel2);
    dialogModel.id = id;
    msg = "新增成功";
  } else if (dialogAction === "edit" || dialogAction === "view") {
    if (!dialogModel.id) {
      return;
    }
    const dialogModel2 = {
      ...dialogModel,
      id: undefined,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    Object.assign(dialogModel2, { is_deleted: undefined });
    dialogModel2.ref_code = pagePath;
    id = await updateByIdDynPageData(
      dialogModel.id,
      dialogModel2,
    );
    msg = "编辑成功";
  }
  if (id) {
    if (!changedIds.includes(id)) {
      changedIds.push(id);
    }
  }
  if (msg) {
    ElMessage.success(msg);
  }
  return id;
}

/** 保存 */
async function onSave() {
  const id = await save();
  if (!id) {
    return;
  }
  const hasNext = await nextId();
  if (hasNext) {
    return;
  }
  onCloseResolve({
    type: "ok",
    changedIds,
  });
}

async function onDialogOpen() {
}

async function onDialogClose() {
}

async function onBeforeClose() {
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  return true;
}

/** 点击取消关闭按钮 */
async function onClose() {
  if (!await onBeforeClose()) {
    return;
  }
  onCloseResolve({
    type: "cancel",
    changedIds,
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  if (!await onBeforeClose()) {
    return;
  }
  done(false);
  onCloseResolve({
    type: "cancel",
    changedIds,
  });
}

defineExpose({
  showDialog,
  refresh: onRefresh,
});
</script>
