<template>
<tm-input
  class="custom_input n-w-full"
  :transprent="true"
  :show-bottom-botder="false"
  :input-padding="[0, 0]"
  v-bind="$attrs"
  v-model.lazy="modelValue"
  :show-clear="props.readonly ? false : props.showClear"
  @change="onChange"
  @clear="onClear"
  :disabled="props.readonly"
  :placeholder="props.readonly ? '' : props.placeholder"
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
    showClear?: boolean;
    placeholder?: string;
  }>(),
  {
    modelValue: undefined,
    disabled: undefined,
    readonly: undefined,
    showClear: true,
    placeholder: undefined,
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
