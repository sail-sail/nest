<template>
<tm-input
  v-if="!props.readonly"
  v-model.lazy="modelValue"
  class="custom_input n-w-full"
  :class="{
    'custom_input_readonly': props.readonly
  }"
  :transprent="true"
  :show-bottom-botder="false"
  v-bind="$attrs"
  :show-clear="props.readonly ? false : props.showClear"
  :readonly="props.readonly"
  :placeholder="(props.readonly || !props.pageInited) ? '' : props.placeholder"
  :color="props.color"
  :font-color="props.readonly ? '#888888' : undefined"
  :type="props.type"
  @blur="onBlur"
  @clear="onClear"
>
  <template #left>
    <slot name="left"></slot>
  </template>
  <template #right>
    <slot name="right"></slot>
  </template>
</tm-input>
<view
  v-else
  un-w="full"
  un-whitespace-nowrap
  un-flex="~"
  un-justify="start"
  un-items="center"
  un-box-border
  class="custom_input_readonly"
>
  <template #left>
    <slot name="left"></slot>
  </template>
  
  <view
    un-flex="~ [1_0_0]"
    un-overflow-hidden
    un-p="x-2.5 y-0.875"
    un-box-border
    un-w="full"
    un-min="h-11"
    un-break-all
    un-whitespace-pre-wrap
    un-text="[1em] gray-600"
    class="custom_input_readonly_content"
    :class="{
      'items-center': type !== 'textarea',
      'custom_input_placeholder': shouldShowPlaceholder,
    }"
  >
    <template
      v-if="shouldShowPlaceholder"
    >
      {{ props.readonlyPlaceholder || "" }}
    </template>
    
    <template
      v-else
    >
      {{ modelValue || "" }}
    </template>
  </view>
  
  <template #right>
    <slot name="right"></slot>
  </template>
</view>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "update:modelValue", value?: any): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value?: any): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "blur", value?: any): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue?: any;
    type?: "number" | "text" | "textarea" | "idcard" | "digit" | "tel" | "safe-password" | "nickname" | undefined;
    readonly?: boolean;
    pageInited?: boolean;
    showClear?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
    color?: string;
  }>(),
  {
    modelValue: undefined,
    type: undefined,
    readonly: undefined,
    pageInited: true,
    showClear: true,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
    color: "transparent",
  },
);

const modelValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    modelValue.value = props.modelValue;
  },
  {
    immediate: true,
  },
);

watch(
  () => modelValue.value,
  () => {
    emit("update:modelValue", modelValue.value);
  },
);

const shouldShowPlaceholder = $computed<boolean>(() => {
  if (props.type === "number" || props.type === "digit") {
    return modelValue.value == null || modelValue.value === "" || modelValue.value == 0 || isNaN(modelValue.value);
  }
  return modelValue.value == null || modelValue.value === "";
});

function onBlur(value: string) {
  emit("blur", value);
  if (value === props.modelValue) {
    return;
  }
  emit("change", modelValue.value);
}

function onClear() {
  modelValue.value = "";
  emit("clear");
}
</script>
