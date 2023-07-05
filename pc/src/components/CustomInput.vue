<template>
<el-input
  v-if="readonly !== true"
  un-w="full"
  v-bind="$attrs"
  v-model="modelValue"
  class="custom_input"
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
</el-input>
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
    {{ modelValue ?? "" }}
  </div>
</template>
</template>

<script lang="ts" setup>

const emit = defineEmits<{
  (e: "update:modelValue", value?: string | string[] | null): void,
  (e: "change", value?: any | any[] | null): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
    modelValue?: any;
    disabled?: boolean;
    readonly?: boolean;
  }>(),
  {
    modelValue: undefined,
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
</script>
