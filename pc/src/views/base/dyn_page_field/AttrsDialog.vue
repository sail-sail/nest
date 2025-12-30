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
        
        un-grid="~ cols-[repeat(1,480px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center
        
        :model="dialogModel"
      >
        
        <template
          v-if="propsConfig.length === 0"
        >
          <el-form-item
            label="提示"
          >
            <div un-text-color="[var(--el-text-color-secondary)]">
              该组件暂无可配置属性
            </div>
          </el-form-item>
        </template>
        
        <template
          v-for="config in propsConfig"
          :key="config.prop"
        >
          
          <!-- 字符串类型 -->
          <el-form-item
            v-if="config.type === 'string'"
            :label="config.label"
            :prop="config.prop"
          >
            <CustomInput
              v-model="dialogModel[config.prop]"
              :placeholder="`请输入 ${ config.label }`"
            ></CustomInput>
          </el-form-item>
          
          <!-- 数字类型 -->
          <el-form-item
            v-if="config.type === 'number'"
            :label="config.label"
            :prop="config.prop"
          >
            <CustomInputNumber
              v-model="dialogModel[config.prop]"
              :placeholder="`请输入 ${ config.label }`"
            ></CustomInputNumber>
          </el-form-item>
          
          <!-- 布尔类型 -->
          <el-form-item
            v-if="config.type === 'boolean'"
            :label="config.label"
            :prop="config.prop"
          >
            <CustomCheckbox
              v-model="dialogModel[config.prop]"
            ></CustomCheckbox>
          </el-form-item>
          
          <!-- 选择类型 - 使用 el-input-tag 配置选项 -->
          <el-form-item
            v-if="config.type === 'select' && config.isOptionsConfig"
            :label="config.label"
            :prop="config.prop"
          >
            <el-input-tag
              v-model="dialogModel[config.prop]"
              :placeholder="`请输入 ${ config.label }，按回车添加`"
              un-w="full"
            ></el-input-tag>
          </el-form-item>
          
          <!-- 选择类型 - 从预定义选项中选择 -->
          <el-form-item
            v-if="config.type === 'select' && !config.isOptionsConfig && config.options"
            :label="config.label"
            :prop="config.prop"
          >
            <CustomSelect
              v-model="dialogModel[config.prop]"
              :placeholder="`请选择 ${ config.label }`"
              :method="() => config.options!.map((opt) => ({ lbl: opt.label, id: opt.value }))"
              :options-map="(item) => ({ label: item.lbl, value: item.id })"
            ></CustomSelect>
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
        @click="onClose"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>关闭</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>确定</span>
      </el-button>
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>
import type {
  ComponentPropConfig,
} from "@/components/ComponentMap";

import {
  componentPropsConfig,
} from "@/components/ComponentMap";

let dialogTitle = $ref("配置属性");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dialogModel = $ref<Record<string, any>>({});

let componentType = $ref<string>("");

const formRef = $ref<InstanceType<typeof ElForm>>();

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

const customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

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
  dialogTitle = `配置属性 - ${ componentType }`;
  
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "auto",
    title: $$(dialogTitle),
    pointerPierce: true,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  
  const defaults = buildDefaultsFromConfig(propsConfig);

  // 解析现有的 attrs
  let parsedAttrs: Record<string, unknown> = {};
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
  
  return await dialogRes.dialogPrm;
}

async function onSave() {
  if (!formRef) {
    return;
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

/** 点击关闭按钮 */
function onClose() {
  onCloseResolve({
    type: "cancel",
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  done(false);
  onCloseResolve({
    type: "cancel",
  });
}

defineExpose({
  showDialog,
});
</script>
