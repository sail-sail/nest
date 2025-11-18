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
        
        <template v-if="(showBuildIn || builtInModel?.code == null)">
          <el-form-item
            label="路由"
            prop="code"
          >
            <CustomInput
              v-model="dialogModel.code"
              placeholder="请输入 路由"
              :readonly="isLocked || isReadonly"
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
            label="动态页面字段"
            name="动态页面字段"
            un-flex="~ [1_0_0] col"
            un-overflow-hidden
          >
            <el-table
              ref="dyn_page_fieldRef"
              un-m="t-2"
              size="small"
              height="100%"
              :data="dyn_page_fieldData"
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
                prop="code"
                label="编码"
                width="150"
                header-align="center"
                align="center"
              >
                <template #default="{ row }">
                  <template v-if="row._type !== 'add'">
                    <CustomInput
                      v-model="row.code"
                      placeholder=" "
                      :readonly="isLocked || isReadonly"
                    ></CustomInput>
                  </template>
                </template>
              </el-table-column>
              
              <el-table-column
                prop="lbl"
                label="名称"
                width="210"
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
                prop="type"
                label="类型"
                width="130"
                header-align="center"
              >
                <template #default="{ row }">
                  <template v-if="row._type !== 'add'">
                    <CustomInput
                      v-model="row.type"
                      placeholder=" "
                      :readonly="isLocked || isReadonly"
                    ></CustomInput>
                  </template>
                </template>
              </el-table-column>
              
              <el-table-column
                prop="attrs"
                label="属性"
                width="210"
                header-align="center"
                align="center"
              >
                <template #default="{ row }">
                  <template v-if="row._type !== 'add'">
                    <CustomInput
                      v-model="row.attrs"
                      placeholder=" "
                      :readonly="isLocked || isReadonly"
                    ></CustomInput>
                  </template>
                </template>
              </el-table-column>
              
              <el-table-column
                prop="formula"
                label="计算公式"
                width="190"
                header-align="center"
              >
                <template #default="{ row }">
                  <template v-if="row._type !== 'add'">
                    <CustomInput
                      v-model="row.formula"
                      placeholder=" "
                      :readonly="isLocked || isReadonly"
                    ></CustomInput>
                  </template>
                </template>
              </el-table-column>
              
              <el-table-column
                prop="is_required"
                label="必填"
                width="95"
                header-align="center"
                align="center"
              >
                <template #default="{ row }">
                  <template v-if="row._type !== 'add'">
                    <CustomCheckbox
                      v-model="row.is_required"
                      placeholder=" "
                      :readonly="isLocked || isReadonly"
                    ></CustomCheckbox>
                  </template>
                </template>
              </el-table-column>
              
              <el-table-column
                prop="is_search"
                label="查询条件"
                width="95"
                header-align="center"
                align="center"
              >
                <template #default="{ row }">
                  <template v-if="row._type !== 'add'">
                    <CustomCheckbox
                      v-model="row.is_search"
                      placeholder=" "
                      :readonly="isLocked || isReadonly"
                    ></CustomCheckbox>
                  </template>
                </template>
              </el-table-column>
              
              <el-table-column
                prop="width"
                label="宽度"
                width="190"
                header-align="center"
                align="center"
              >
                <template #default="{ row }">
                  <template v-if="row._type !== 'add'">
                    <CustomInputNumber
                      v-model="row.width"
                      un-text="right"
                      placeholder=" "
                      :readonly="isLocked || isReadonly"
                      align="center"
                      :is-hide-zero="true"
                    ></CustomInputNumber>
                  </template>
                </template>
              </el-table-column>
              
              <el-table-column
                prop="align"
                label="对齐方式"
                width="110"
                header-align="center"
              >
                <template #default="{ row }">
                  <template v-if="row._type !== 'add'">
                    <DictSelect
                      v-model="row.align"
                      :set="row.align = row.align ?? undefined"
                      code="dyn_page_field_align"
                      placeholder=" "
                      :readonly="isLocked || isReadonly"
                    ></DictSelect>
                  </template>
                </template>
              </el-table-column>
              
              <el-table-column
                v-if="!isLocked &&
                  !isReadonly &&
                  dyn_page_fieldData.some((item) => item._type === 'add')
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
                    @click="dyn_page_fieldAdd"
                  >
                    新增
                  </el-button>
                  
                  <el-button
                    v-else
                    size="small"
                    plain
                    type="danger"
                    @click="dyn_page_fieldRemove(row)"
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
  createDynPage,
  findOneDynPage,
  findLastOrderByDynPage,
  updateByIdDynPage,
  getDefaultInputDynPage,
  getPagePathDynPage,
  intoInputDynPage,
} from "./Api.ts";

import {
  getDefaultInputDynPageField,
} from "@/views/base/dyn_page_field/Api";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: DynPageId,
    },
  ],
}>();

const pagePath = getPagePathDynPage();

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

let dialogModel: DynPageInput = $ref({
} as DynPageInput);

let dyn_page_model = $ref<DynPageModel>();

let ids = $ref<DynPageId[]>([ ]);
let is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<DynPageId[]>([ ]);

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
    // 名称
    lbl: [
      {
        required: true,
        message: "请输入 名称",
      },
      {
        type: "string",
        max: 40,
        message: "名称 长度不能超过 40",
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
  changedIds: DynPageId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<DynPageInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

const customDialogRef = $(useTemplateRef<InstanceType<typeof CustomDialog>>("customDialogRef"));

let findOneModel = findOneDynPage;

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    builtInModel?: DynPageInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: DynPageId[];
      is_deleted?: 0 | 1 | null;
    };
    findOne?: typeof findOneDynPage;
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
    type: "medium",
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
    findOneModel = findOneDynPage;
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
  };
  dyn_page_model = undefined;
  if (dialogAction === "copy" && !model?.ids?.[0]) {
    dialogAction = "add";
  }
  if (action === "add") {
    const [
      defaultModel,
      order_by,
    ] = await Promise.all([
      getDefaultInputDynPage(),
      findLastOrderByDynPage({
        notLoading: !inited,
      }),
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
      findLastOrderByDynPage({
        notLoading: !inited,
      }),
    ]);
    if (data) {
      dialogModel = {
        ...data,
        id: undefined,
        order_by: order_by + 1,
        dyn_page_field: data.dyn_page_field?.map((item) => ({
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
  if (dialogAction === "add" || dialogAction === "copy") {
    const [
      defaultModel,
      order_by,
    ] = await Promise.all([
      getDefaultInputDynPage(),
      findLastOrderByDynPage({
        notLoading: !inited,
      }),
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,
      order_by: order_by + 1,
    };
    nextTick(() => nextTick(() => formRef?.clearValidate()));
  } else if (dialogAction === "edit" || dialogAction === "view") {
    await onRefresh();
  }
  ElMessage({
    message: "表单重置完毕",
    type: "success",
  });
}

/** 刷新 */
async function onRefresh() {
  const id = dialogModel.id;
  if (!id) {
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
    dialogModel = intoInputDynPage({
      ...data,
    });
    dialogTitle = `${ oldDialogTitle } - ${ dialogModel.lbl }`;
  }
  dyn_page_model = data;
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
  let id: DynPageId | undefined = undefined;
  let msg = "";
  if (dialogAction === "add" || dialogAction === "copy") {
    const dialogModel2 = {
      ...dialogModel,
      dyn_page_field: [
        ...(dialogModel.dyn_page_field || [ ]).map((item) => ({
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
    id = await createDynPage(dialogModel2);
    dialogModel.id = id;
    msg = "新增成功";
  } else if (dialogAction === "edit" || dialogAction === "view") {
    if (!dialogModel.id) {
      return;
    }
    const dialogModel2 = {
      ...dialogModel,
      dyn_page_field: [
        ...(dialogModel.dyn_page_field || [ ]).map((item) => ({
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
    id = await updateByIdDynPage(
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

const inlineForeignTabLabel = $ref("动态页面字段");

// 动态页面字段
const dyn_page_fieldRef = $(useTemplateRef<InstanceType<typeof ElTable>>("dyn_page_fieldRef"));

const dyn_page_fieldData = $computed(() => {
  if (!isLocked && !isReadonly) {
    return [
      ...dialogModel.dyn_page_field ?? [ ],
      {
        _type: 'add',
      },
    ];
  }
  return dialogModel.dyn_page_field ?? [ ];
}) as (DynPageFieldInput & { _type?: "add", is_sys: 0|1 })[];

async function dyn_page_fieldAdd() {
  if (!dialogModel.dyn_page_field) {
    dialogModel.dyn_page_field = [ ];
  }
  const defaultModel = await getDefaultInputDynPageField();
  dialogModel.dyn_page_field.push(defaultModel);
  dyn_page_fieldRef?.setScrollTop(Number.MAX_SAFE_INTEGER);
}

function dyn_page_fieldRemove(row: DynPageFieldModel) {
  if (!dialogModel.dyn_page_field) {
    return;
  }
  const idx = dialogModel.dyn_page_field.indexOf(row);
  if (idx >= 0) {
    dialogModel.dyn_page_field.splice(idx, 1);
  }
}

watch(
  () => [
    dialogModel.dyn_page_field,
    dialogModel.dyn_page_field?.length,
  ],
  () => {
    if (!dialogModel.dyn_page_field) {
      return;
    }
    for (let i = 0; i < dialogModel.dyn_page_field.length; i++) {
      const item = dialogModel.dyn_page_field[i];
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
