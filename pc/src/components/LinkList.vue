<template>
<div
  un-flex="~ wrap gap-1"
  un-w="full"
  un-p="y-1"
  un-box-border
>
  <template
    v-if="collapseTags && modelValue1 && modelValue1.length > maxSize"
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
      :persistent="false"
    >
      <template #reference>
        <el-tag
          type="info"
          :disable-transitions="true"
          un-cursor-pointer
          @click="() => collapseTags = false"
        >
          +{{ modelValue1.length - maxSize }}
        </el-tag>
      </template>
      <div
        un-flex="~ gap-1 col"
        un-w="full"
        un-p="y-1"
        un-box-border
      >
        <el-tag
          v-for="item in modelValue1.slice(maxSize)"
          :key="item"
          type="info"
          :disable-transitions="true"
          un-justify-start
          un-self-start
        >
          {{ item }}
        </el-tag>
      </div>
    </el-popover>
  </template>
  <template v-else>
    <el-tag
      v-for="item in modelValue1"
      :key="item"
      type="info"
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

const collapseTags = $ref(true);

const maxSize = $toRef(props, "maxSize");

let modelValue1 = $ref<string[]>();
let labelValue = $ref<string[]>();

watch(
  () => props.modelValue,
  (newVal) => {
    modelValue1 = newVal;
    if (newVal) {
      labelValue = newVal.slice(0, maxSize);
    }
  },
  {
    immediate: true,
  },
);
</script>
