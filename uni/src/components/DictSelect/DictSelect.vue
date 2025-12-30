<template>
<CustomSelect
  v-bind="$attrs"
  v-model="modelValue"
  :method="dataMethod"
  :options-map="optionsMap"
  @change="onChange"
  @data="onData"
></CustomSelect>
</template>

<script lang="ts" setup>
import {
  type GetDict,
  DictType,
} from "#/types";

const emit = defineEmits<{
  (e: "data", data: GetDict[]): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value: any): void,
}>();

const props = withDefaults(
  defineProps<{
    code: string;
  }>(),
  {
  },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelValue = defineModel<any>();

function onChange(value: GetDict | GetDict[] | null) {
  emit("change", value);
}

function onData(data: GetDict[]) {
  emit("data", data);
}

async function dataMethod() {
  if (!props.code) {
    return [ ];
  }
  const res = await getDict([
    props.code,
  ]);
  const data = res[0];
  emit("data", data);
  return data;
}

function optionsMap(item: GetDict) {
  const item2 = item as { lbl: string; val: string; };
  if (item.type === DictType.Number) {
    return {
      label: item2.lbl,
      value: Number(item2.val),
    };
  }
  if (item.type === DictType.Boolean) {
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
