<template>
<div
  un-flex="~ wrap"
  un-w="full"
>
  <el-tag
    v-for="item in labelValue"
    :key="item"
    type="info"
    style="margin: 1px;"
    :disable-transitions="true"
  >
    {{ item }}
  </el-tag>
  <el-popover
    v-if="modelValue && modelValue.length > maxSize"
    :width="modelValue && modelValue.length > 5 ? 500 : 'auto'"
  >
    <template #reference>
      <el-tag
        type="info"
        style="margin: 1px;"
        :disable-transitions="true"
        un-cursor-default
      >
        +{{ modelValue.length - maxSize }}
      </el-tag>
    </template>
    <el-tag
      v-for="item in modelValue.slice(maxSize)"
      :key="item"
      type="info"
      style="margin: 1px;"
      :disable-transitions="true"
    >
      {{ item }}
    </el-tag>
  </el-popover>
  <template v-else>
    <el-tag
      v-for="item in modelValue"
      :key="item"
      type="info"
      style="margin: 1px;"
      :disable-transitions="true"
    >
      {{ item }}
    </el-tag>
  </template>
</div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: string[] | undefined;
    maxSize?: number;
  }>(),
  {
    modelValue: undefined,
    maxSize: 3,
  },
);

let maxSize = $toRef(props, "maxSize");

let modelValue = $ref<string[]>();
let labelValue = $ref<string[]>();

watch(
  () => props.modelValue,
  (newVal) => {
    modelValue = newVal;
    if (newVal) {
      labelValue = newVal.slice(0, maxSize);
    }
  },
  {
    immediate: true,
  },
);

</script>
