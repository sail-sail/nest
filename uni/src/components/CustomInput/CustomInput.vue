<template>
<tm-input
  v-if="!readonly"
  ref="inputRef"
  :model-value="modelValue"
  class="custom_input w-full"
  :class="{
    'custom_input_readonly': readonly
  }"
  :transprent="true"
  :show-bottom-botder="false"
  :focus="isFocus"
  :selection-start="selectionStart"
  :selection-end="selectionEnd"
  width="100%"
  v-bind="$attrs"
  :show-clear="props.clearable == null ? ((modelValue != null && modelValue !== '') ? !readonly : false) : props.clearable"
  :readonly="readonly"
  :placeholder="(readonly || !props.pageInited) ? '' : props.placeholder"
  :color="props.color"
  :font-color="props.fontColor ? props.fontColor : (readonly ? 'var(--color-readonly)' : undefined)"
  :type="props.type === 'decimal' ? 'digit' : props.type"
  @update:model-value="onUpdateModelValue"
  @focus="onFocus"
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
    un-items="center-safe"
    :class="{
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
      v-if="(modelValue != null && modelValue !== '') && (props.clearable == null ? (readonly ? false : true) : props.clearable)"
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
    type?: "decimal" | "number" | "text" | "textarea" | "idcard" | "digit" | "tel" | "safe-password" | "nickname" | undefined;
    readonly?: boolean;
    pageInited?: boolean;
    clearable?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
    color?: string;
    fontColor?: string;
    isDecimal?: boolean;
    isNumber?: boolean;
    precision?: number;
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
    isDecimal: false,
    isNumber: false,
    precision: 2,
  },
);

const tmFormItemReadonly = inject<ComputedRef<boolean> | undefined>("tmFormItemReadonly", undefined);

const readonly = $computed(() => {
  if (props.readonly != null) {
    return props.readonly;
  }
  if (tmFormItemReadonly) {
    return tmFormItemReadonly.value;
  }
  return;
});

const modelValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue instanceof Decimal) {
      if (props.modelValue.isNaN() || props.modelValue.isZero()) {
        modelValue.value = "";
      } else {
        modelValue.value = props.modelValue.toString();
      }
    } else if (props.modelValue instanceof Number) {
      if (props.modelValue == 0) {
        modelValue.value = "";
      } else {
        modelValue.value = props.modelValue.toString();
      }
    } else {
      modelValue.value = props.modelValue;
    }
  },
  {
    immediate: true,
  },
);

function onUpdateModelValue(value: string) {
  if (props.isDecimal) {
    let decimalValue = new Decimal(value && value.trim() || 0).toDecimalPlaces(props.precision, Decimal.ROUND_DOWN);
    if (decimalValue.isNaN() || decimalValue.isZero()) {
      modelValue.value = "";
    } else {
      modelValue.value = decimalValue.toString();
    }
    if (decimalValue.isNaN()) {
      decimalValue = new Decimal(0);
    }
    emit("update:modelValue", decimalValue);
  } else if (props.isNumber) {
    let numberValue = Math.round(Number(value) * Math.pow(10, props.precision)) / Math.pow(10, props.precision);
    if (isNaN(numberValue)) {
      numberValue = 0;
    }
    if (numberValue === 0) {
      modelValue.value = "";
    } else {
      modelValue.value = numberValue.toString();
    }
    emit("update:modelValue", numberValue);
  }else {
    modelValue.value = value;
    emit("update:modelValue", modelValue.value);
  }
}

const shouldShowPlaceholder = $computed<boolean>(() => {
  if (props.isDecimal) {
    return modelValue.value == null || modelValue.value === "" || new Decimal(modelValue.value).isZero();
  }
  if (props.isNumber) {
    return modelValue.value == null || modelValue.value === "" || Number(modelValue.value) == 0 || isNaN(Number(modelValue.value));
  }
  if (props.type === "number" || props.type === "digit" || props.type === "decimal") {
    return modelValue.value == null || modelValue.value === "" || Number(modelValue.value) == 0 || isNaN(modelValue.value);
  }
  return modelValue.value == null || modelValue.value === "";
});

const focusValue = ref<string>();

function onFocus() {
  isFocus.value = true;
  selectionStart.value = undefined;
  selectionEnd.value = undefined;
  focusValue.value = modelValue.value;
}

function onBlur(value: string) {
  if (props.isDecimal) {
    const decimalValue = new Decimal(value && value.trim() || 0).toDecimalPlaces(props.precision, Decimal.ROUND_DOWN);
    emit("blur", decimalValue);
    if (decimalValue.equals(new Decimal(focusValue.value || 0))) {
      return;
    }
    emit("change", decimalValue);
  } else if (props.isNumber) {
    let numberValue = Math.round(Number(value) * Math.pow(10, props.precision)) / Math.pow(10, props.precision);
    if (isNaN(numberValue)) {
      numberValue = 0;
    }
    emit("blur", numberValue);
    if (numberValue === Number(focusValue.value)) {
      return;
    }
    emit("change", numberValue);
  } else {
    if (value === focusValue.value || "") {
      return;
    }
    emit("change", modelValue.value);
  }
}

function onClear() {
  if (props.isDecimal) {
    modelValue.value = new Decimal(0).toString();
  } else if (props.isNumber) {
    modelValue.value = 0;
  } else {
    modelValue.value = "";
  }
  emit("update:modelValue", modelValue.value);
  emit("change", modelValue.value);
  emit("clear");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const inputRef = ref<any>();

const isFocus = ref(false);

const selectionStart = ref<number>();
const selectionEnd = ref<number>();

async function focus() {
  isFocus.value = false;
  selectionStart.value = undefined;
  selectionEnd.value = undefined;
  await nextTick();
  const len = modelValue.value?.toString().length || 0;
  selectionStart.value = len;
  selectionEnd.value = len;
  isFocus.value = true;
}

async function blur() {
  isFocus.value = true;
  selectionStart.value = 0;
  selectionEnd.value = 0;
  await nextTick();
  isFocus.value = false;
  selectionStart.value = undefined;
  selectionEnd.value = undefined;
}

defineExpose({
  inputRef: $$(inputRef),
  focus,
  blur,
});
</script>
