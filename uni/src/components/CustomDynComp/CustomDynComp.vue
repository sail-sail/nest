<template>
<component
  :is="component"
  v-if="component"
  v-bind="mergedAttrs"
></component>
</template>

<script lang="ts" setup>
import componentMap, { nameMapping, autoProps } from "./ComponentMap.ts";

const props = withDefaults(
  defineProps<{
    name: string;
  }>(),
  {
  },
);

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
const component = computed(() => {
  const name = props.name;
  // 优先使用原始名称查找（如 CustomInputNumber）
  if (componentMap[name]) {
    return componentMap[name];
  }
  // 再尝试映射后的名称
  const mapped = nameMapping[name];
  if (mapped && componentMap[mapped]) {
    return componentMap[mapped];
  }
  console.warn(`Component not found in whitelist: ${name}`);
  return null;
});

// 合并属性（自动添加特定组件所需的属性）
const mergedAttrs = computed(() => {
  const name = props.name;
  const extra = autoProps[name] || {};
  return {
    ...extra,
    ...attrs,
  };
});
</script>
