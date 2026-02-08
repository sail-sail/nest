<template>
<CustomSelect
  v-bind="$attrs"
  v-model="modelValue"
  v-model:model-label="modelLabel"
  :method="dataMethod"
  :options-map="optionsMap"
  @change="onChange"
  @data="onData"
  @confirm="onConfirm"
  @clear="onClear"
></CustomSelect>
</template>

<script lang="ts" setup>
import type {
  GetDictbiz,
} from "#/types";

import {
  DictbizType,
} from "#/types";

const emit = defineEmits<{
  (e: "data", data: GetDictbiz[]): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "confirm", value?: any): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value: any): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
    code?: string;
  }>(),
  {
    code: undefined,
  },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelValue = defineModel<any>();
const modelLabel = defineModel<string | null>();

function onChange(value: GetDictbiz | GetDictbiz[] | null) {
  emit("change", value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onConfirm(value?: any) {
  emit("confirm", value);
}

function onClear() {
  emit("clear");
}

function onData(data: GetDictbiz[]) {
  emit("data", data);
}

async function dataMethod() {
  if (!props.code) {
    return [ ];
  }
  const res = await getDictbiz([
    props.code,
  ]);
  const data = res[0];
  return data;
}

function optionsMap(item: GetDictbiz) {
  const item2 = item as { lbl: string; val: string; };
  if (item.type === DictbizType.Number) {
    return {
      label: item2.lbl,
      value: Number(item2.val),
    };
  }
  if (item.type === DictbizType.Boolean) {
    return {
      label: item2.lbl,
      value: Number(item2.val),
    };
  }
  return {
    label: item2.lbl,
    value: item2.val,
  };
}
</script>
