<template>
<tm-input
  class="custom_input n-w-full"
  :class="{
    'custom_input_readonly': props.readonly
  }"
  :transprent="true"
  :show-bottom-botder="false"
  v-bind="$attrs"
  v-model.lazy="modelValue"
  :show-clear="props.readonly ? false : props.showClear"
  @change="onChange"
  @clear="onClear"
  :disabled="props.readonly"
  :placeholder="(props.readonly || !props.pageInited) ? '' : props.placeholder"
  :color="props.color"
  :font-color="props.readonly ? '#666' : undefined"
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
  (e: "update:modelValue", value?: any): void,
  (e: "change", value?: any): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
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

let modelValue = ref(props.modelValue);

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
