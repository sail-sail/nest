<template>
<div
  un-flex="~ wrap gap-1"
  un-w="full"
  un-p="y-1"
  un-box-border
>
  <template
    v-if="collapseTags && modelValue && modelValue.length > maxSize"
  >
    <el-tag
      v-for="item in labelValue"
      :key="item"
      type="info"
      :disable-transitions="true"
    >
      {{ item }}
    </el-tag>
    <el-popover
      width="auto"
      :teleported="false"
      :persistent="false"
    >
      <template #reference>
        <el-tag
          type="info"
          style="margin: 1px;"
          :disable-transitions="true"
          un-cursor-pointer
          @click="() => collapseTags = false"
        >
          +{{ modelValue.length - maxSize }}
        </el-tag>
      </template>
      <div
        un-flex="~ wrap gap-1"
        un-w="full"
        un-p="y-1"
        un-box-border
      >
        <el-tag
          v-for="item in modelValue.slice(maxSize)"
          :key="item"
          type="info"
          :style="{ margin: '1px' }"
          :disable-transitions="true"
        >
          {{ item }}
        </el-tag>
      </div>
    </el-popover>
  </template>
  <template v-else>
    <el-tag
      v-for="item in modelValue"
      :key="item"
      type="info"
      :style="{ margin: '1px' }"
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

let collapseTags = $ref(true);

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
