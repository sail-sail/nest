<template>
<el-date-picker
  v-if="readonly !== true"
  class="custom_date_picker"
  un-w="full"
  v-bind="$attrs"
  v-model="modelValue"
  :clearable="!props.disabled"
  :disabled="props.disabled"
>
  <template
    v-for="(item, key, index) in $slots"
    :key="index"
    #[key]
  >
    <slot :name="key"></slot>
  </template>
</el-date-picker>
<template
  v-else
>
  <div
    un-b="1 solid [var(--el-border-color)]"
    un-p="x-2.75 y-1"
    un-box-border
    un-rounded
    un-m="l-1"
    un-w="full"
    un-min="h-8"
    un-line-height="normal"
    un-break-words
    class="custom_select_readonly"
    v-bind="$attrs"
  >
    {{ modelLabel }}
  </div>
</template>
</template>

<script lang="ts" setup>

const emit = defineEmits<{
  (e: "update:modelValue", value?: any): void,
  (e: "change", value?: any): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
    modelValue?: any;
    format?: string;
    disabled?: boolean;
    readonly?: boolean;
  }>(),
  {
    modelValue: undefined,
    format: "YYYY-MM-DD",
    disabled: undefined,
    readonly: undefined,
  },
);

let modelValue = $ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    modelValue = props.modelValue;
  },
);

watch(
  () => modelValue,
  () => {
    emit("update:modelValue", modelValue);
  },
);

let modelLabel = $computed(() => {
  if (modelValue) {
    return dayjs(modelValue).format(props.format ?? "YYYY-MM-DD");
  }
  return "";
});
</script>
