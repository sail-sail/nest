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
  :show-clear="props.clearable == null ? (props.readonly ? false : true) : props.clearable"
  :readonly="props.readonly"
  :placeholder="(props.readonly || !props.pageInited) ? '' : props.placeholder"
  :color="props.color"
  :font-color="props.fontColor ? props.fontColor : (props.readonly ? 'var(--color-readonly)' : undefined)"
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
    :style="{
      color: props.fontColor ? props.fontColor : 'var(--color-readonly)',
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
    
    <view
      un-flex="[1_0_0]"
      un-overflow-hidden
    ></view>
    
    <view
      v-if="modelValue && (props.clearable == null ? (props.readonly ? false : true) : props.clearable)"
      @tap.stop=""
      @click="onClear"
    >
      <tm-icon
        _style="transition:color 0.24s"
        :size="30"
        color="#b1b1b1"
        name="close-circle-fill"
        @tap.stop=""
        @click="onClear"
      >
      </tm-icon>
    </view>
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
    clearable?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
    color?: string;
    fontColor?: string;
  }>(),
  {
    modelValue: undefined,
    type: undefined,
    readonly: undefined,
    pageInited: true,
    clearable: undefined,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
    color: "transparent",
    fontColor: undefined,
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
