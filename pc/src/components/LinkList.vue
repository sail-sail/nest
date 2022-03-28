<template>
<el-popover
  v-if="modelValue && modelValue.length > maxSize"
  :width="modelValue && modelValue.length > 5 ? 500 : 'auto'"
>
  <template #reference>
    <el-link :underline="false" type="primary">
      <el-tag
        v-for="item in labelValue"
        :key="item"
        type="info"
        style="margin: 1px;"
      >
        {{ item }}
      </el-tag>
      ...
    </el-link>
  </template>
  <template v-for="item in modelValue" :key="item">
    <el-tag
      type="info"
      style="margin: 1px;"
    >
      {{ item }}
    </el-tag>
  </template>
</el-popover>
<template v-else>
  <el-tag
    v-for="item in modelValue"
    :key="item"
    type="info"
    style="margin: 1px;"
  >
    {{ item }}
  </el-tag>
</template>
</template>

<script lang="ts" setup>
import { toRef, watch } from "vue";
import {
  ElPopover,
  ElTag,
  ElLink,
} from "element-plus";

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

let maxSize = $ref(toRef(props, "maxSize"));

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
