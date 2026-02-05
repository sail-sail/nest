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
      un-m="x-1"
    >
      
      <tm-form
        ref="formRef"
        v-model="dyn_page_data_input"
        :label-width="180"
        :rules="form_rules"
        @submit="onSave"
      >
        
      </tm-form>
      
    </view>
    
    <view
      un-p="t-[350px]"
      un-box-border
    ></view>
    
  </scroll-view>
  
  <view
    un-p="x-2 b-2"
    un-box-border
    un-flex="~"
    un-justify="center"
    un-items="center"
    un-gap="x-4"
  >
    
    <view
      v-if="dialogAction === 'edit' && dyn_page_data_id"
      un-flex="1"
    >
      <tm-button
        block
        color="info"
        @click="onCopy"
      >
        复制
      </tm-button>
    </view>
    
    <view
      un-flex="1"
    >
      <tm-button
        :disabled="!inited"
        block
        @click="formRef?.submit()"
      >
        确定
      </tm-button>
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
} from "./Api.ts";

import {
} from "./Api.ts";

import TmForm from "@/uni_modules/tm-ui/components/tm-form/tm-form.vue";

let inited = $ref(false);

let dyn_page_data_id = $ref<DynPageDataId>();

let dyn_page_data_input = $ref<DynPageDataInput>({ });
let dyn_page_data_model = $ref<DynPageDataModel>();

const form_rules: Record<string, TM.FORM_RULE[]> = {
};

type ActionType = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<ActionType>("add");

const formRef = $ref<InstanceType<typeof TmForm>>();

/** 复制 */
async function onCopy() {
  if (!dyn_page_data_id) {
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
  if (!inited) {
    return;
  }
  if (formSubmitResult?.isPass === false) {
    const firstValid = formSubmitResult.firstValid;
    if (firstValid) {
      uni.showToast({
        title: firstValid.message,
        icon: "error",
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
  
  if (dialogAction === "copy" || dialogAction === "add") {
    await createDynPageData(
      dyn_page_data_input,
    );
    await uni.showModal({
      content: "新增成功",
      showCancel: false,
    });
    await uni.navigateBack();
    uni.$emit("/pages/dyn_page_data/List:refresh");
  } else if (dialogAction === "edit") {
    if (!dyn_page_data_id) {
      uni.showToast({
        title: "修改失败, id 不能为空",
        icon: "none",
      });
      return;
    }
    await updateByIdDynPageData(
      dyn_page_data_id,
      dyn_page_data_input,
    );
    await uni.showModal({
      content: "修改成功",
      showCancel: false,
    });
    await uni.navigateBack();
    uni.$emit("/pages/dyn_page_data/List:refresh");
  }
  
}

/** 刷新 */
async function onRefresh() {
  formRef?.resetValidation();
  if (dialogAction === "add") {
    dyn_page_data_input = await getDefaultInputDynPageData();
  } else if (dialogAction === "copy") {
    if (!dyn_page_data_id) {
      uni.showToast({
        title: "复制失败, id 不能为空",
        icon: "none",
      });
      return;
    }
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
  } else if (dialogAction === "edit") {
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
  }>(),
  {
    init: true,
    action: undefined,
    dyn_page_data_id: undefined,
    findOne: undefined,
    beforeSave: undefined,
  },
);

let findOneModel: typeof findOneDynPageData = findOneDynPageData;

watch(
  () => [
    props.action,
    props.dyn_page_data_id,
    props.findOne,
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
  },
  {
    immediate: true,
  },
);

onLoad(async function(query?: AnyObject) {
  const dyn_page_data_id_str = query?.dyn_page_data_id;
  const action = query?.action;
  if (action === "add") {
    dialogAction = "add";
  } else if (action === "copy") {
    dialogAction = "copy";
  } else if (action === "edit") {
    dialogAction = "edit";
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
