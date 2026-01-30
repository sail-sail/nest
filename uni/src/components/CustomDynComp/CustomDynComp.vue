<template>
<view>
  
  <template
    v-if="resolvedName === 'CustomInput'"
  >
    <CustomInput
      v-bind="mergedAttrs"
      @update:model-value="onModelValue"
      @change="onChange"
      @clear="onClear"
    ></CustomInput>
  </template>
  
  <template
    v-else-if="resolvedName === 'CustomSelectModal'"
  >
    <CustomSelectModal
      v-bind="mergedAttrs"
      @update:model-value="onModelValue"
      @change="onChange"
      @clear="onClear"
    ></CustomSelectModal>
  </template>
  
  <template
    v-else-if="resolvedName === 'CustomDate'"
  >
    <CustomDate
      v-bind="mergedAttrs"
      @update:model-value="onModelValue"
      @change="onChange"
      @clear="onClear"
    ></CustomDate>
  </template>
  
  <template
    v-else-if="resolvedName === 'DictSelect'"
  >
    <DictSelect
      v-bind="mergedAttrs"
      @update:model-value="onModelValue"
      @change="onChange"
      @clear="onClear"
    ></DictSelect>
  </template>
  
  <template
    v-else-if="resolvedName === 'DictbizSelect'"
  >
    <DictbizSelect
      v-bind="mergedAttrs"
      @update:model-value="onModelValue"
      @change="onChange"
      @clear="onClear"
    ></DictbizSelect>
  </template>
  
</view>
</template>

<script lang="ts" setup>
import componentMap, { nameMapping, autoProps } from "./ComponentMap.ts";

import CustomInput from "@/components/CustomInput/CustomInput.vue";
import CustomSelectModal from "@/components/CustomSelectModal/CustomSelectModal.vue";
import CustomDate from "@/components/CustomDate/CustomDate.vue";
import DictSelect from "@/components/DictSelect/DictSelect.vue";
import DictbizSelect from "@/components/DictbizSelect/DictbizSelect.vue";

const props = withDefaults(
  defineProps<{
    name: string;
  }>(),
  {
  },
);

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "update:modelValue", value?: any): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value?: any): void,
  (e: "clear"): void,
}>();

const attrs = useAttrs();

// 解析组件名（处理 PC 端名称映射）
const resolvedName = computed(() => {
  const name = props.name;
  // 先检查是否需要映射
  if (nameMapping[name]) {
    return nameMapping[name];
  }
  return name;
});

// 获取组件
// const component = computed(() => {
//   const name = props.name;
//   // 优先使用原始名称查找（如 CustomInputNumber）
//   if (componentMap[name]) {
//     return componentMap[name];
//   }
//   // 再尝试映射后的名称
//   const mapped = nameMapping[name];
//   if (mapped && componentMap[mapped]) {
//     return componentMap[mapped];
//   }
//   console.warn(`Component not found in whitelist: ${name}`);
//   return null;
// });

// // 合并属性（自动添加特定组件所需的属性）
const mergedAttrs = computed(() => {
  const name = props.name;
  const extra = autoProps[name] || {};
  return {
    ...extra,
    ...attrs,
  };
});

function onClear() {
  emit("clear");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onModelValue(value: any) {
  emit("update:modelValue", value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onChange(value: any) {
  emit("change", value);
}
</script>
