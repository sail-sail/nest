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
        @dblclick.stop
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
          @dblclick.stop
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
          @dblclick.stop
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
        
        un-grid="~ cols-[repeat(2,380px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
        
        @submit.prevent
      >
        
        <template v-if="(showBuildIn || builtInModel?.code == null)">
          <el-form-item
            label="编码"
            prop="code"
          >
            <CustomInput
              v-model="dialogModel.code"
              placeholder="请输入 编码"
              :readonly="isLocked || isReadonly || !!dialogModel.is_sys"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.lbl == null)">
          <el-form-item
            label="名称"
            prop="lbl"
          >
            <CustomInput
              v-model="dialogModel.lbl"
              placeholder="请输入 名称"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.type == null)">
          <el-form-item
            label="数据类型"
            prop="type"
          >
            <DictSelect
              v-model="dialogModel.type"
              :set="dialogModel.type = dialogModel.type ?? undefined"
              code="dict_type"
              placeholder="请选择 数据类型"
              :readonly="isLocked || isReadonly || !!dialogModel.is_sys"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.order_by == null)">
          <el-form-item
            label="排序"
            prop="order_by"
          >
            <CustomInputNumber
              v-model="dialogModel.order_by"
              placeholder="请输入 排序"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.rem == null)">
          <el-form-item
            label="备注"
            prop="rem"
            un-grid="col-span-full"
          >
            <CustomInput
              v-model="dialogModel.rem"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="请输入 备注"
              :readonly="isLocked || isReadonly"
              @keyup.enter.stop
            ></CustomInput>
          </el-form-item>
        </template>
        
      </el-form>
      <div
        un-w="full"
        un-flex="~ [1_0_0] col"
        un-overflow-hidden
        un-min="h-100"
      >
        <el-tabs
          v-model="inlineForeignTabLabel"
          class="el-flex-tabs"
          type="card"
        >
          
          <el-tab-pane
            label="系统字典明细"
            name="系统字典明细"
            un-flex="~ [1_0_0] col"
            un-overflow-hidden
          >
            <el-table
              ref="dict_detailRef"
              un-m="t-2"
              size="small"
              height="100%"
              :data="dict_detailData"
              class="tr_border_none"
            >
              
              <el-table-column
                prop="_seq"
                label="序号"
                align="center"
                width="80"
              >
              </el-table-column>
              
              <el-table-column
                prop="lbl"
                label="名称"
                width="250"
                header-align="center"
              >
                <template #default="{ row }">
                  <template v-if="row._type !== 'add'">
                    <CustomInput
                      v-model="row.lbl"
                      placeholder=" "
                      :readonly="isLocked || isReadonly"
                    ></CustomInput>
                  </template>
                </template>
              </el-table-column>
              
              <el-table-column
                prop="val"
                label="值"
                width="250"
                header-align="center"
              >
                <template #default="{ row }">
                  <template v-if="row._type !== 'add'">
                    <CustomInput
                      v-model="row.val"
                      placeholder=" "
                      :readonly="isLocked || isReadonly || !!row.is_sys"
                    ></CustomInput>
                  </template>
                </template>
              </el-table-column>
              
              <el-table-column
                prop="rem"
                label="备注"
                width="230"
                header-align="center"
              >
                <template #default="{ row }">
                  <template v-if="row._type !== 'add'">
                    <CustomInput
                      v-model="row.rem"
                      placeholder=" "
                      :readonly="isLocked || isReadonly"
                    ></CustomInput>
                  </template>
                </template>
              </el-table-column>
              
              <el-table-column
                v-if="!isLocked &&
                  !isReadonly &&
                  dict_detailData.some((item) => item._type === 'add' || !item.is_sys)
                "
                prop="_operation"
                label="操作"
                width="90"
                align="center"
                fixed="right"
              >
                <template #default="{ row }">
                  
                  <el-button
                    v-if="row._type === 'add'"
                    size="small"
                    plain
                    type="primary"
                    @click="dict_detailAdd"
                  >
                    新增
                  </el-button>
                  
                  <el-button
                    v-else-if="!row.is_sys"
                    size="small"
                    plain
                    type="danger"
                    @click="dict_detailRemove(row)"
                  >
                    删除
                  </el-button>
                  
                </template>
              </el-table-column>
              
            </el-table>
          </el-tab-pane>
          
        </el-tabs>
      </div>
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
  createDict,
  findOneDict,
  findLastOrderByDict,
  updateByIdDict,
  getDefaultInputDict,
  getPagePathDict,
  intoInputDict,
} from "./Api.ts";

import {
  getDefaultInputDictDetail,
} from "@/views/base/dict_detail/Api";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: DictId,
    },
  ],
}>();

const pagePath = getPagePathDict();

const permitStore = usePermitStore();

const permit = permitStore.getPermit(pagePath);

let inited = $ref(false);

type DialogAction = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<DialogAction>("add");
let dialogTitle = $ref("");
let oldDialogTitle = "";
let oldDialogNotice: string | undefined = undefined;
let oldIsLocked = $ref(false);
let dialogNotice = $ref("");

let dialogModel: DictInput = $ref({
} as DictInput);

let dict_model = $ref<DictModel>();

let ids = $ref<DictId[]>([ ]);
let is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<DictId[]>([ ]);

const formRef = $(useTemplateRef("formRef"));

/** 表单校验 */
let form_rules = $ref<Record<string, FormItemRule[]>>({ });

watchEffect(async () => {
  if (!inited) {
    form_rules = { };
    return;
  }
  await nextTick();
  form_rules = {
    // 编码
    code: [
      {
        required: true,
        message: "请输入 编码",
      },
      {
        type: "string",
        max: 50,
        message: "编码 长度不能超过 50",
      },
    ],
    // 名称
    lbl: [
      {
        required: true,
        message: "请输入 名称",
      },
      {
        type: "string",
        max: 200,
        message: "名称 长度不能超过 200",
      },
    ],
    // 数据类型
    type: [
      {
        required: true,
        message: "请选择 数据类型",
      },
    ],
    // 排序
    order_by: [
      {
        required: true,
        message: "请输入 排序",
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: DictId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<DictInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

const customDialogRef = $(useTemplateRef("customDialogRef"));

let findOneModel = findOneDict;

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    builtInModel?: DictInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: DictId[];
      is_deleted?: 0 | 1 | null;
    };
    findOne?: typeof findOneDict;
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
    type: "default",
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
    findOneModel = findOneDict;
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
  nextTick(() => formRef?.clearValidate());
  ids = [ ];
  changedIds = [ ];
  dialogModel = {
  };
  dict_model = undefined;
  if (dialogAction === "copy" && !model?.ids?.[0]) {
    dialogAction = "add";
  }
  if (action === "add") {
    const [
      defaultModel,
      order_by,
    ] = await Promise.all([
      getDefaultInputDict(),
      findLastOrderByDict(
        undefined,
        {
          notLoading: !inited,
        },
      ),
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,
      ...model,
      order_by: order_by + 1,
    };
  } else if (dialogAction === "copy") {
    const id = model?.ids?.[0];
    if (!id) {
      return await dialogRes.dialogPrm;
    }
    const [
      data,
      order_by,
    ] = await Promise.all([
      findOneModel({
        id,
        is_deleted,
      }),
      findLastOrderByDict(
        undefined,
        {
          notLoading: !inited,
        },
      ),
    ]);
    if (data) {
      dialogModel = {
        ...data,
        id: undefined,
        order_by: order_by + 1,
        dict_detail: data.dict_detail?.map((item) => ({
          ...item,
          id: undefined,
        })) || [ ],
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
      order_by,
    ] = await Promise.all([
      getDefaultInputDict(),
      findLastOrderByDict(
        undefined,
        {
          notLoading: !inited,
        },
      ),
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,
      order_by: order_by + 1,
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
    dialogModel = intoInputDict({
      ...data,
    });
    dialogTitle = `${ oldDialogTitle } - ${ dialogModel.lbl }`;
  }
  dict_model = data;
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

watch(
  () => [
    dialogModel.type,
  ],
  () => {
    if (!inited) {
      return;
    }
    if (!dialogModel.type) {
      dialogModel.type_lbl = "";
    }
  },
);

/** 快捷键ctrl+回车 */
async function onSaveKeydown(e: KeyboardEvent) {
  e.preventDefault();
  e.stopImmediatePropagation();
  customDialogRef?.focus();
  await onSave();
}

/** 保存并返回id */
async function save() {
  if (!inited || isReadonly) {
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
  let id: DictId | undefined = undefined;
  let msg = "";
  if (dialogAction === "add" || dialogAction === "copy") {
    const dialogModel2 = {
      ...dialogModel,
      dict_detail: [
        ...(dialogModel.dict_detail || [ ]).map((item) => ({
          ...item,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          order_by: (item as any)._seq,
          _seq: undefined,
          _type: undefined,
        })),
      ],
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    Object.assign(dialogModel2, { is_deleted: undefined });
    id = await createDict(dialogModel2);
    dialogModel.id = id;
    msg = "新增成功";
  } else if (dialogAction === "edit" || dialogAction === "view") {
    if (!dialogModel.id) {
      return;
    }
    const dialogModel2 = {
      ...dialogModel,
      dict_detail: [
        ...(dialogModel.dict_detail || [ ]).map((item) => ({
          ...item,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          order_by: (item as any)._seq,
          _seq: undefined,
          _type: undefined,
        })),
      ],
      id: undefined,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    Object.assign(dialogModel2, { is_deleted: undefined });
    id = await updateByIdDict(
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

const inlineForeignTabLabel = $ref("系统字典明细");

// 系统字典明细
const dict_detailRef = $(useTemplateRef("dict_detailRef"));

const dict_detailData = $computed(() => {
  if (!isLocked && !isReadonly) {
    return [
      ...dialogModel.dict_detail ?? [ ],
      {
        _type: 'add',
      },
    ];
  }
  return dialogModel.dict_detail ?? [ ];
}) as (DictDetailInput & { _type?: "add", is_sys: 0|1 })[];

async function dict_detailAdd() {
  if (!dialogModel.dict_detail) {
    dialogModel.dict_detail = [ ];
  }
  const defaultModel = await getDefaultInputDictDetail();
  dialogModel.dict_detail.push(defaultModel);
  dict_detailRef?.setScrollTop(Number.MAX_SAFE_INTEGER);
}

function dict_detailRemove(row: DictDetailModel) {
  if (!dialogModel.dict_detail) {
    return;
  }
  const idx = dialogModel.dict_detail.indexOf(row);
  if (idx >= 0) {
    dialogModel.dict_detail.splice(idx, 1);
  }
}

watch(
  () => [
    dialogModel.dict_detail,
    dialogModel.dict_detail?.length,
  ],
  () => {
    if (!dialogModel.dict_detail) {
      return;
    }
    for (let i = 0; i < dialogModel.dict_detail.length; i++) {
      const item = dialogModel.dict_detail[i];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item as any)._seq = i + 1;
    }
  },
);

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
