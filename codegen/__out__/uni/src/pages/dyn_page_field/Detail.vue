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
          :readonly="isReadonly"
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
          :readonly="isReadonly"
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
          :readonly="isReadonly"
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
          :readonly="isReadonly"
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
          :readonly="isReadonly"
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
          :readonly="isReadonly"
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
          :readonly="isReadonly"
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
          :readonly="isReadonly"
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
          :readonly="isReadonly"
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
          :readonly="isReadonly"
        >
          <DictSelect
            v-model="dyn_page_field_input.align"
            placeholder="请选择 对齐方式"
            code="dyn_page_field_align"
          ></DictSelect>
        </tm-form-item>
        
        <!-- 手机列表显示 -->
        <tm-form-item
          label="手机列表显示"
          name="is_mobile_list"
          :readonly="isReadonly"
        >
          <DictSelect
            v-model="dyn_page_field_input.is_mobile_list"
            placeholder="请选择 手机列表显示"
            code="yes_no"
          ></DictSelect>
        </tm-form-item>
        
        <!-- 手机列表查询 -->
        <tm-form-item
          label="手机列表查询"
          name="is_mobile_search"
          :readonly="isReadonly"
        >
          <DictSelect
            v-model="dyn_page_field_input.is_mobile_search"
            placeholder="请选择 手机列表查询"
            code="yes_no"
          ></DictSelect>
        </tm-form-item>
        
        <!-- 排序 -->
        <tm-form-item
          label="排序"
          name="order_by"
          :readonly="isReadonly"
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
    v-if="dialogAction !== 'view'"
    un-p="x-2 b-2"
    un-box-border
    un-flex="~"
    un-justify="center"
    un-items="center"
    un-gap="x-4"
  >
    
    <tm-drawer
      v-model:show="operationDrawerShow"
      title="操作"
      un-w="full"
      :show-close="true"
      :show-footer="true"
      size="auto"
    >
      
      <template #trigger>
        <tm-button
          block
          color="info"
          @click="operationDrawerShow = true"
        >
          <view
            un-flex="~"
            un-justify="center"
            un-items="center"
          >
            
            <view>
              操作
            </view>
            
            <view
              un-i="iconfont-caret_top"
            ></view>
            
          </view>
        </tm-button>
      </template>
      
      <template #footer>
        <tm-button
          block
          color="info"
          @click="operationDrawerShow = false;"
        >
          <view
            un-flex="~"
            un-justify="center"
            un-items="center"
            un-gap="x-1"
          >
            
            <view>
              关闭
            </view>
            
            <view
              un-i="iconfont-caret_bottom"
            ></view>
            
          </view>
        </tm-button>
      </template>
      
      <view
        un-p="4"
        un-box-border
        un-w="full"
        un-flex="~ col"
        un-gap="y-4"
      >
        
        <template
          v-if="dialogAction === 'edit'"
        >
        
          <tm-button
            v-if="permit('add', '新增')"
            block
            color="info"
            @click="onCopy"
          >
            复制
          </tm-button>
          
          <tm-button
            v-if="permit('edit', '编辑')"
            :disabled="!inited || is_form_hydrating"
            block
            @click="operationDrawerShow = false; formRef?.submit();"
          >
            编辑
          </tm-button>
          
          <CustomDivider
            :show-text="false"
            un-p="y-0 x-0"
          ></CustomDivider>
          
        </template>
        
        <template
          v-if="dialogAction === 'copy' || dialogAction === 'add'"
        >
          
          <tm-button
            v-if="permit('add', '新增')"
            :disabled="!inited || is_form_hydrating"
            block
            @click="formRef?.submit()"
          >
            新增
          </tm-button>
          
          <CustomDivider
            :show-text="false"
            un-p="y-0 x-0"
          ></CustomDivider>
          
        </template>
        
      </view>
      
    </tm-drawer>
    
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
  getPagePathDynPageField,
} from "./Api.ts";

import {
  getListDynPage,
} from "./Api.ts";

import TmForm from "@/uni_modules/tm-ui/components/tm-form/tm-form.vue";

const pagePath = getPagePathDynPageField();
const permitStore = usePermitStore();

const permit = permitStore.getPermit(pagePath);

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
  is_mobile_list: [
    {
      required: true,
      message: "请选择 手机列表显示",
    },
  ],
  is_mobile_search: [
    {
      required: true,
      message: "请选择 手机列表查询",
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

let operationDrawerShow = $ref(false);

/** 复制 */
async function onCopy() {
  if (!dyn_page_field_id) {
    return;
  }
  if (!permit('add')) {
    uni.showToast({
      title: "无新增权限",
      icon: "none",
    });
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
  if (dialogAction === "view") {
    return;
  }
  if (!inited || is_form_hydrating) {
    return;
  }
  if (dialogAction === "add" || dialogAction === "copy") {
    if (!permit('add')) {
      uni.showToast({
        title: "无新增权限",
        icon: "none",
      });
      return;
    }
  }
  if (dialogAction === "edit") {
    if (!permit('edit')) {
      uni.showToast({
        title: "无修改权限",
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
    const canSave = await props.beforeSave(dyn_page_field_input);
    if (!canSave) {
      return;
    }
  }
  
  if (dialogAction === "copy" || dialogAction === "add") {
    await createDynPageField(
      dyn_page_field_input,
    );
    await uni.showModal({
      content: "新增成功",
      showCancel: false,
    });
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
    await uni.showModal({
      content: "修改成功",
      showCancel: false,
    });
    await uni.navigateBack();
    uni.$emit("/pages/dyn_page_field/List:refresh");
  }
  
}

/** 刷新 */
async function onRefresh() {
  is_form_hydrating = true;
  try {
    formRef?.resetValidation();
    if (dialogAction === "add") {
      dyn_page_field_input = await getDefaultInputDynPageField();
      if (props.order_by) {
        dyn_page_field_input.order_by = props.order_by;
      }
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
      if (props.order_by) {
        dyn_page_field_input.order_by = props.order_by;
      }
    } else if (dialogAction === "edit" || dialogAction === "view") {
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
  } finally {
    await nextTick();
    is_form_hydrating = false;
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
