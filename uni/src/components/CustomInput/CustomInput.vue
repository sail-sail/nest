<template>
<tm-input
  v-model.lazy="modelValue"
  class="custom_input n-w-full"
  :class="{
    'custom_input_readonly': props.readonly
  }"
  :transprent="true"
  :show-bottom-botder="false"
  v-bind="$attrs"
  :show-clear="props.readonly ? false : props.showClear"
  :disabled="props.readonly"
  :placeholder="(props.readonly || !props.pageInited) ? '' : props.placeholder"
  :color="props.color"
  :font-color="props.readonly ? '#666' : undefined"
  @change="onChange"
  @clear="onClear"
>
  <template #left>
    <slot name="left"></slot>
  </template>
  <template #right>
    <slot name="right"></slot>
  </template>
</tm-input>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "update:modelValue", value?: any): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value?: any): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue?: any;
    disabled?: boolean;
    readonly?: boolean;
    pageInited?: boolean;
    showClear?: boolean;
    placeholder?: string;
    color?: string;
  }>(),
  {
    modelValue: undefined,
    disabled: undefined,
    readonly: undefined,
    pageInited: true,
    showClear: true,
    placeholder: undefined,
    color: "transparent",
  },
);

const modelValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    modelValue.value = props.modelValue;
  },
);

watch(
  () => modelValue.value,
  () => {
    emit("update:modelValue", modelValue.value);
  },
);

function onChange() {
  emit("update:modelValue", modelValue.value);
  emit("change", modelValue.value);
}

function onClear() {
  modelValue.value = "";
  emit("update:modelValue", modelValue.value);
  emit("clear");
}
</script>
