<template>
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
        v-model="dyn_page_data_input"
        :label-width="160"
        :rules="form_rules"
        @submit="onSave"
      >
        
      </tm-form>
      
    </view>
    
    <view
      un-p="t-[300px]"
      un-box-border
    ></view>
    
  </scroll-view>
  
  <view
    v-if="dialogAction !== 'view'"
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
        un-w="full"
      >

        <view
          v-if="dialogAction === 'edit'"
          un-flex="~"
          un-gap="x-2"
        >

          <CustomActionButton
            v-if="permit('add', '新增') && dyn_page_data_id"
            report
            color="info"
            un-w="full"
            @click="actionBarRef?.close(); onCopy();"
          >
            复制
          </CustomActionButton>

          <CustomActionButton
            v-if="permit('edit', '编辑')"
            report
            un-w="full"
            :disabled="!inited || is_form_hydrating || isReadonly"
            @click="actionBarRef?.close(); formRef?.submit();"
          >
            保存
          </CustomActionButton>

        </view>

        <CustomDivider
          v-if="dialogAction === 'edit'"
          class="custom-action-bar-single-hide"
          :show-text="false"
          un-p="y-0 x-0"
        ></CustomDivider>

        <template
          v-if="dialogAction === 'copy' || dialogAction === 'add'"
        >

          <CustomActionButton
            v-if="permit('add', '新增')"
            report
            :disabled="!inited || is_form_hydrating"
            @click="actionBarRef?.close(); formRef?.submit();"
          >
            保存
          </CustomActionButton>

        </template>

        <CustomDivider
          v-if="dialogAction === 'copy' || dialogAction === 'add'"
          class="custom-action-bar-single-hide"
          :show-text="false"
          un-p="y-0 x-0"
        ></CustomDivider>
      </CustomActionBar>
    </view>

  </view>
  
  <AppLoading></AppLoading>
  
</view>
</template>

<script setup lang="ts">
import {
  findOneDynPageData,
  createDynPageData,
  updateByIdDynPageData,
  getDefaultInputDynPageData,
  intoInputDynPageData,
  getPagePathDynPageData,
} from "./Api.ts";

import {
} from "./Api.ts";

import TmForm from "@/uni_modules/tm-ui/components/tm-form/tm-form.vue";

const pagePath = getPagePathDynPageData();
const permitStore = usePermitStore();

const {
  permit,
  permitAsync,
} = permitStore.getPermit(pagePath);

let inited = $ref(false);

let dyn_page_data_id = $ref<DynPageDataId>();

let dyn_page_data_input = $ref<DynPageDataInput>({ });
let dyn_page_data_model = $ref<DynPageDataModel>();

const form_rules: Record<string, TM.FORM_RULE[]> = {
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
  if (!dyn_page_data_id) {
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
    url: `/pages/dyn_page_data/Detail?dyn_page_data_id=${ encodeURIComponent(dyn_page_data_id) }&action=copy`,
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
  if (dialogAction === "add" || dialogAction === "copy") {
    if (!await permitAsync('add')) {
      uni.showToast({
        title: "无新增权限",
        icon: "none",
      });
      return;
    }
  }
  if (dialogAction === "edit") {
    if (!await permitAsync('edit')) {
      uni.showToast({
        title: "无编辑权限",
        icon: "none",
      });
      return;
    }
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
    const canSave = await props.beforeSave(dyn_page_data_input);
    if (!canSave) {
      return;
    }
  }
  const currentAction = dialogAction;
  
  if (currentAction === "copy" || currentAction === "add") {
    const created_id = await createDynPageData(
      dyn_page_data_input,
    );
    await uni.showModal({
      content: "新增成功",
      showCancel: false,
    });
    if (backAfterSaveInner) {
      await uni.navigateBack();
    } else {
      dyn_page_data_id = created_id;
      dialogAction = "edit";
      await onRefresh();
    }
    uni.$emit("/pages/dyn_page_data/List:refresh", {
      action: currentAction,
    });
  } else if (currentAction === "edit") {
    if (!dyn_page_data_id) {
      uni.showToast({
        title: "编辑失败, id 不能为空",
        icon: "none",
      });
      return;
    }
    await updateByIdDynPageData(
      dyn_page_data_id,
      dyn_page_data_input,
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
    uni.$emit("/pages/dyn_page_data/List:refresh");
  }
  
}

/** 刷新 */
async function onRefresh() {
  is_form_hydrating = true;
  try {
    formRef?.resetValidation();
    if (dialogAction === "add") {
      dyn_page_data_input = await getDefaultInputDynPageData();
      dyn_page_data_input = {
        ...dyn_page_data_input,
        ...getMergedInputPatch(),
      };
    } else if (dialogAction === "copy") {
      if (!dyn_page_data_id) {
        uni.showToast({
          title: "复制失败, id 不能为空",
          icon: "none",
        });
        return;
      }
      const [
        defaultInput,
      ] = await Promise.all([
        getDefaultInputDynPageData(),
      ]);
      dyn_page_data_model = await findOneModel(
        {
          id: dyn_page_data_id,
          is_deleted: 0,
        },
        undefined,
        {
          notLoading: true,
        },
      );
      if (!dyn_page_data_model) {
        uni.showToast({
          title: "动态页面数据 已被删除",
          icon: "none",
        });
      }
      dyn_page_data_input = intoInputDynPageData(
        dyn_page_data_model,
      );
      dyn_page_data_input = {
        ...dyn_page_data_input,
        ...getMergedInputPatch(),
        id: undefined,
      };
    } else if (dialogAction === "edit" || dialogAction === "view") {
      dyn_page_data_model = await findOneModel(
        {
          id: dyn_page_data_id,
          is_deleted: 0,
        },
        undefined,
        {
          notLoading: true,
        },
      );
      if (!dyn_page_data_model) {
        uni.showToast({
          title: "动态页面数据 已被删除",
          icon: "none",
        });
      }
      dyn_page_data_input = intoInputDynPageData(
        dyn_page_data_model,
      );
    }
  } finally {
    await nextTick();
    is_form_hydrating = false;
  }
}

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
    dyn_page_data_id?: DynPageDataId;
    findOne?: typeof findOneDynPageData;
    beforeSave?: (input: DynPageDataInput) => Promise<boolean>;
    inputPatch?: Partial<DynPageDataInput>;
    backAfterSave?: boolean;
    hideFields?: string[];
    hasCloseBtn?: boolean;
    closeBtnFn?: () => Promise<void> | void;
    drawerDisableTeleport?: boolean;
  }>(),
  {
    init: true,
    action: undefined,
    dyn_page_data_id: undefined,
    findOne: undefined,
    beforeSave: undefined,
    inputPatch: undefined,
    backAfterSave: true,
    hideFields: undefined,
    hasCloseBtn: undefined,
    closeBtnFn: undefined,
    drawerDisableTeleport: undefined,
  },
);

let inputPatchByQuery = $ref<Partial<DynPageDataInput>>({ });
let backAfterSaveInner = $ref(true);

function getMergedInputPatch(): Partial<DynPageDataInput> {
  return {
    ...inputPatchByQuery,
    ...props.inputPatch,
  };
}

let findOneModel: typeof findOneDynPageData = findOneDynPageData;

watch(
  () => [
    props.action,
    props.dyn_page_data_id,
    props.findOne,
    props.backAfterSave,
  ],
  () => {
    if (props.action) {
      dialogAction = props.action;
    }
    if (props.dyn_page_data_id) {
      dyn_page_data_id = props.dyn_page_data_id;
    }
    if (props.findOne) {
      findOneModel = props.findOne;
    } else {
      findOneModel = findOneDynPageData;
    }
    backAfterSaveInner = props.backAfterSave ?? true;
  },
  {
    immediate: true,
  },
);

onLoad(async function(query?: AnyObject) {
  const dyn_page_data_id_str = query?.dyn_page_data_id;
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
        inputPatchByQuery = data as Partial<DynPageDataInput>;
      }
    } catch (err) {
      console.error(err);
    }
  }
  if (dyn_page_data_id_str) {
    dyn_page_data_id = decodeURIComponent(dyn_page_data_id_str) as DynPageDataId | undefined;
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
