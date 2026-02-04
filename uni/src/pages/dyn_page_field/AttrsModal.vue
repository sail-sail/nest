<template>
<tm-modal
  v-model:show="dialogVisible"
  :closeable="true"
  height="90%"
  :title="dialogTitle"
  disabled-scroll
  show-close
  :show-footer="false"
  :content-padding="0"
  max-height="90%"
  :overlay-click="true"
>
  
  <view
    un-h="full"
    un-flex="~ [1_0_0] col"
    un-overflow="hidden"
  >
      
    <scroll-view
      un-flex="~ [1_0_0] col"
      un-overflow="hidden"
      scroll-y
      :rebound="false"
      :scroll-with-animation="true"
    >
      
      <view
        un-m="x-1"
      >
        
        <template
          v-if="propsConfig.length === 0"
        >
          <view
            un-p="4"
            un-text="center gray-500"
          >
            该组件暂无可配置属性
          </view>
        </template>
        
        <tm-form
          ref="formRef"
          v-model="dialogModel"
          :label-width="180"
        >
          
          <template
            v-for="config in propsConfig"
            :key="config.prop"
          >
            
            <!-- 字符串类型 -->
            <tm-form-item
              v-if="config.type === 'string'"
              :label="config.label"
              :name="config.prop"
              :required="false"
            >
              <CustomInput
                v-model="dialogModel[config.prop]"
                :placeholder="`请输入 ${ config.label }`"
              ></CustomInput>
            </tm-form-item>
            
            <!-- 数字类型 -->
            <tm-form-item
              v-if="config.type === 'number'"
              :label="config.label"
              :name="config.prop"
              :required="false"
            >
              <CustomInput
                v-model="dialogModel[config.prop]"
                type="number"
                :placeholder="`请输入 ${ config.label }`"
              ></CustomInput>
            </tm-form-item>
            
            <!-- 布尔类型 -->
            <tm-form-item
              v-if="config.type === 'boolean'"
              :label="config.label"
              :name="config.prop"
              :required="false"
            >
              <DictSelect
                v-model="dialogModel[config.prop]"
                code="yes_no"
                :placeholder="`请选择 ${ config.label }`"
              ></DictSelect>
            </tm-form-item>
            
            <!-- 选择类型 - 选项配置 -->
            <tm-form-item
              v-if="config.type === 'select' && config.isOptionsConfig"
              :label="config.label"
              :name="config.prop"
              :required="false"
            >
              <CustomInputModal
                v-model="optionsInputStr"
                :placeholder="`${ config.label } (每行一个选项)`"
              ></CustomInputModal>
            </tm-form-item>
            
            <!-- 选择类型 - 从预定义选项中选择 -->
            <tm-form-item
              v-if="config.type === 'select' && !config.isOptionsConfig && config.options"
              :label="config.label"
              :name="config.prop"
              :required="false"
            >
              <CustomSelectModal
                v-model="dialogModel[config.prop]"
                :placeholder="`请选择 ${ config.label }`"
                :method="() => config.options!.map((opt) => ({ lbl: opt.label, id: opt.value }))"
              ></CustomSelectModal>
            </tm-form-item>
            
          </template>
          
        </tm-form>
        
      </view>
      
      <view
        un-p="t-[150px]"
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
        un-flex="1"
      >
        <tm-button
          block
          color="info"
          @click="onClose"
        >
          取消
        </tm-button>
      </view>
      
      <view
        un-flex="1"
      >
        <tm-button
          block
          @click="onSave"
        >
          确定
        </tm-button>
      </view>
      
    </view>
    
  </view>
  
</tm-modal>
</template>

<script lang="ts" setup>
import type {
  ComponentPropConfig,
} from "@/components/CustomDynComp/ComponentMap.ts";

import {
  componentPropsConfig,
} from "@/components/CustomDynComp/ComponentMap.ts";

import TmForm from "@/uni_modules/tm-ui/components/tm-form/tm-form.vue";
import CustomInputModal from "@/components/CustomInputModal/CustomInputModal.vue";

let dialogTitle = $ref("配置属性");
let dialogVisible = $ref(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dialogModel = $ref<Record<string, any>>({});

let componentType = $ref<string>("");

const formRef = $ref<InstanceType<typeof TmForm>>();

// 用于选项配置的字符串（每行一个选项）
let optionsInputStr = $ref("");

// 当前组件的属性配置列表
const propsConfig = $computed<ComponentPropConfig[]>(() => {
  if (!componentType) {
    return [];
  }
  
  // 如果是 SelectInput 类型,使用通用配置
  if (componentType.endsWith("SelectInput")) {
    return componentPropsConfig["_SelectInput"] || [];
  }
  
  return componentPropsConfig[componentType] || [];
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  attrs?: string;
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

function cloneDefaultValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.slice() as unknown as T;
  }
  if (value && typeof value === "object") {
    return {
      ...(value as Record<string, unknown>),
    } as unknown as T;
  }
  return value;
}

function buildDefaultsFromConfig(configs: ComponentPropConfig[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaults: Record<string, any> = {};
  for (const config of configs) {
    if (config.default !== undefined) {
      defaults[config.prop] = cloneDefaultValue(config.default);
    }
  }
  return defaults;
}

/** 打开对话框 */
async function showDialog(
  arg: {
    componentType: string;
    attrs?: string;
  },
) {
  componentType = arg.componentType;
  dialogTitle = `配置属性`;
  
  const defaults = buildDefaultsFromConfig(propsConfig);

  // 解析现有的 attrs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsedAttrs: Record<string, any> = {};
  if (arg.attrs) {
    try {
      const attrsObj = JSON.parse(arg.attrs);
      parsedAttrs = attrsObj;
    } catch (err) {
      console.error("解析 attrs 失败:", err);
    }
  }

  dialogModel = {
    ...defaults,
    ...parsedAttrs,
  };
  
  // 处理选项配置字段，将数组转为换行分隔的字符串
  const optionsConfig = propsConfig.find((c) => c.isOptionsConfig);
  if (optionsConfig && Array.isArray(dialogModel[optionsConfig.prop])) {
    optionsInputStr = dialogModel[optionsConfig.prop].join("\n");
  } else {
    optionsInputStr = "";
  }
  
  const dialogPrm = new Promise<OnCloseResolveType>((resolve) => {
    onCloseResolve = function(arg: OnCloseResolveType) {
      dialogVisible = false;
      resolve(arg);
    };
  });
  
  dialogVisible = true;
  
  return await dialogPrm;
}

function onSave() {
  // 处理选项配置字段，将换行分隔的字符串转回数组
  const optionsConfig = propsConfig.find((c) => c.isOptionsConfig);
  if (optionsConfig && optionsInputStr) {
    dialogModel[optionsConfig.prop] = optionsInputStr
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s);
  } else if (optionsConfig) {
    dialogModel[optionsConfig.prop] = [];
  }
  
  // 过滤掉空值,布尔类型的 0 不保存
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalAttrs: Record<string, any> = {};
  for (const key in dialogModel) {
    const value = dialogModel[key];
    // 跳过 undefined、null、空字符串
    if (value === undefined || value === null || value === "") {
      continue;
    }
    // 布尔类型: 0 或 false 不保存, 1 才保存
    const config = propsConfig.find((c) => c.prop === key);
    if (config?.type === "boolean") {
      if (value === 1) {
        finalAttrs[key] = 1;
      }
      // 0 或其他值不保存
      continue;
    }
    // 选项配置类型: 空数组不保存
    if (config?.isOptionsConfig && Array.isArray(value) && value.length === 0) {
      continue;
    }
    finalAttrs[key] = value;
  }
  
  const attrsStr = Object.keys(finalAttrs).length > 0 ? JSON.stringify(finalAttrs) : "";
  
  onCloseResolve({
    type: "ok",
    attrs: attrsStr,
  });
}

function onClose() {
  onCloseResolve({
    type: "cancel",
  });
}

defineExpose({
  showDialog,
});
</script>
