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
        v-model="dyn_page_field_input"
        :label-width="180"
        :rules="form_rules"
        @submit="onSave"
      >
        
        <!-- 编码 -->
        <tm-form-item
          label="编码"
          name="code"
          :required="false"
        >
          <CustomInput
            v-model="dyn_page_field_input.code"
            placeholder="请输入 编码"
          ></CustomInput>
        </tm-form-item>
        
        <!-- 动态页面 -->
        <tm-form-item
          label="动态页面"
          name="dyn_page_id"
        >
          <CustomSelectModal
            v-model="dyn_page_field_input.dyn_page_id"
            placeholder="请选择 动态页面"
            :method="getListDynPage"
          ></CustomSelectModal>
        </tm-form-item>
        
        <!-- 名称 -->
        <tm-form-item
          label="名称"
          name="lbl"
        >
          <CustomInput
            v-model="dyn_page_field_input.lbl"
            placeholder="请输入 名称"
          ></CustomInput>
        </tm-form-item>
        
        <!-- 类型 -->
        <tm-form-item
          label="类型"
          name="type"
          :required="false"
        >
          <CustomInput
            v-model="dyn_page_field_input.type"
            placeholder="请输入 类型"
          ></CustomInput>
        </tm-form-item>
        
        <!-- 属性 -->
        <tm-form-item
          label="属性"
          name="attrs"
          :required="false"
        >
          <CustomInput
            v-model="dyn_page_field_input.attrs"
            placeholder="请输入 属性"
          ></CustomInput>
        </tm-form-item>
        
        <!-- 计算公式 -->
        <tm-form-item
          label="计算公式"
          name="formula"
          :required="false"
        >
          <CustomInput
            v-model="dyn_page_field_input.formula"
            placeholder="请输入 计算公式"
          ></CustomInput>
        </tm-form-item>
        
        <!-- 必填 -->
        <tm-form-item
          label="必填"
          name="is_required"
        >
          <DictSelect
            v-model="dyn_page_field_input.is_required"
            placeholder="请选择 必填"
            code="yes_no"
          ></DictSelect>
        </tm-form-item>
        
        <!-- 查询条件 -->
        <tm-form-item
          label="查询条件"
          name="is_search"
        >
          <DictSelect
            v-model="dyn_page_field_input.is_search"
            placeholder="请选择 查询条件"
            code="yes_no"
          ></DictSelect>
        </tm-form-item>
        
        <!-- 宽度 -->
        <tm-form-item
          label="宽度"
          name="width"
          :required="false"
        >
          <CustomInput
            v-model="dyn_page_field_input.width"
            type="number"
            placeholder="请输入 宽度"
          ></CustomInput>
        </tm-form-item>
        
        <!-- 对齐方式 -->
        <tm-form-item
          label="对齐方式"
          name="align"
        >
          <DictSelect
            v-model="dyn_page_field_input.align"
            placeholder="请选择 对齐方式"
            code="dyn_page_field_align"
          ></DictSelect>
        </tm-form-item>
        
        <!-- 排序 -->
        <tm-form-item
          label="排序"
          name="order_by"
        >
          <CustomInput
            v-model="dyn_page_field_input.order_by"
            type="number"
            placeholder="请输入 排序"
          ></CustomInput>
        </tm-form-item>
        
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
      v-if="dialogAction === 'edit' && dyn_page_field_id"
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
  findOneDynPageField,
  createDynPageField,
  updateByIdDynPageField,
  getDefaultInputDynPageField,
  intoInputDynPageField,
} from "./Api.ts";

import {
  getListDynPage,
} from "./Api.ts";

import TmForm from "@/uni_modules/tm-ui/components/tm-form/tm-form.vue";

let inited = $ref(false);

let dyn_page_field_id = $ref<DynPageFieldId>();

let dyn_page_field_input = $ref<DynPageFieldInput>({ });
let dyn_page_field_model = $ref<DynPageFieldModel>();

const form_rules: Record<string, TM.FORM_RULE[]> = {
  dyn_page_id: [
    {
      required: true,
      message: "请选择 动态页面",
    },
  ],
  lbl: [
    {
      required: true,
      message: "请输入 名称",
    },
  ],
  is_required: [
    {
      required: true,
      message: "请选择 必填",
    },
  ],
  is_search: [
    {
      required: true,
      message: "请选择 查询条件",
    },
  ],
  align: [
    {
      required: true,
      message: "请选择 对齐方式",
    },
  ],
  order_by: [
    {
      required: true,
      message: "请输入 排序",
    },
  ],
};

type ActionType = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<ActionType>("add");

const formRef = $ref<InstanceType<typeof TmForm>>();

/** 复制 */
async function onCopy() {
  if (!dyn_page_field_id) {
    return;
  }
  uni.redirectTo({
    url: `/pages/dyn_page_field/Detail?dyn_page_field_id=${ encodeURIComponent(dyn_page_field_id) }&action=copy`,
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
    return;
  }
  
  if (props.beforeSave) {
    const canSave = await props.beforeSave(dyn_page_field_input);
    if (!canSave) {
      return;
    }
  }
  
  if (dialogAction === "copy" || dialogAction === "add") {
    await createDynPageField(
      dyn_page_field_input,
    );
    await uni.navigateBack();
    uni.$emit("/pages/dyn_page_field/List:refresh");
  } else if (dialogAction === "edit") {
    if (!dyn_page_field_id) {
      uni.showToast({
        title: "修改失败, id 不能为空",
        icon: "none",
      });
      return;
    }
    await updateByIdDynPageField(
      dyn_page_field_id,
      dyn_page_field_input,
    );
    await uni.navigateBack();
    uni.$emit("/pages/dyn_page_field/List:refresh");
  }
  
}

/** 刷新 */
async function onRefresh() {
  formRef?.resetValidation();
  if (dialogAction === "add") {
    dyn_page_field_input = await getDefaultInputDynPageField();
    dyn_page_field_input.order_by = props.order_by;
  } else if (dialogAction === "copy") {
    if (!dyn_page_field_id) {
      uni.showToast({
        title: "复制失败, id 不能为空",
        icon: "none",
      });
      return;
    }
    dyn_page_field_model = await findOneModel(
      {
        id: dyn_page_field_id,
        is_deleted: 0,
      },
      undefined,
      {
        notLoading: true,
      },
    );
    if (!dyn_page_field_model) {
      uni.showToast({
        title: "动态页面字段 已被删除",
        icon: "none",
      });
    }
    dyn_page_field_input = intoInputDynPageField(
      dyn_page_field_model,
    );
    dyn_page_field_input.order_by = props.order_by;
  } else if (dialogAction === "edit") {
    dyn_page_field_model = await findOneModel(
      {
        id: dyn_page_field_id,
        is_deleted: 0,
      },
      undefined,
      {
        notLoading: true,
      },
    );
    if (!dyn_page_field_model) {
      uni.showToast({
        title: "动态页面字段 已被删除",
        icon: "none",
      });
    }
    dyn_page_field_input = intoInputDynPageField(
      dyn_page_field_model,
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
    dyn_page_field_id?: DynPageFieldId;
    findOne?: typeof findOneDynPageField;
    beforeSave?: (input: DynPageFieldInput) => Promise<boolean>;
    order_by?: number;
  }>(),
  {
    init: true,
    action: undefined,
    dyn_page_field_id: undefined,
    findOne: undefined,
    beforeSave: undefined,
    order_by: undefined,
  },
);

let findOneModel: typeof findOneDynPageField = findOneDynPageField;

watch(
  () => [
    props.action,
    props.dyn_page_field_id,
    props.findOne,
  ],
  () => {
    if (props.action) {
      dialogAction = props.action;
    }
    if (props.dyn_page_field_id) {
      dyn_page_field_id = props.dyn_page_field_id;
    }
    if (props.findOne) {
      findOneModel = props.findOne;
    } else {
      findOneModel = findOneDynPageField;
    }
  },
  {
    immediate: true,
  },
);

onLoad(async function(query?: AnyObject) {
  const dyn_page_field_id_str = query?.dyn_page_field_id;
  const action = query?.action;
  if (action === "add") {
    dialogAction = "add";
  } else if (action === "copy") {
    dialogAction = "copy";
  } else if (action === "edit") {
    dialogAction = "edit";
  }
  if (dyn_page_field_id_str) {
    dyn_page_field_id = decodeURIComponent(dyn_page_field_id_str) as DynPageFieldId | undefined;
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
