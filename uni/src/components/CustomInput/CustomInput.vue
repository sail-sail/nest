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
  :show-clear="props.clearable == null ? ((modelValue != null && modelValue !== '') ? !readonly : false) : props.clearable"
  :readonly="readonly"
  :placeholder="(readonly || !props.pageInited) ? '' : props.placeholder"
  :placeholder-style="($attrs['placeholder-style'] as (string | undefined))"
  :maxlength="($attrs['maxlength'] as (number | undefined))"
  :color="props.color"
  :font-color="props.fontColor ? props.fontColor : (readonly ? 'var(--color-readonly)' : undefined)"
  :type="props.type === 'decimal' ? 'digit' : props.type"
  :password="($attrs.password as (boolean | undefined))"
  :show-eye="($attrs['show-eye'] as (boolean | undefined))"
  :placeholder-class="($attrs['placeholder-class'] as (string | undefined))"
  :align="($attrs.align as ('left' | 'right' | 'center' | undefined))"
  :dark-bg-color="($attrs['dark-bg-color'] as (string | undefined))"
  :font-size="($attrs['font-size'] as (string | undefined))"
  :height="($attrs.height as (string | undefined))"
  :min-height="($attrs['min-height'] as (string | undefined))"
  :input-padding="($attrs['input-padding'] as (string | undefined))"
  :round="($attrs.round as (string | undefined))"
  :show-char-count="($attrs['show-char-count'] as (boolean | undefined))"
  :clear-color="($attrs['clear-color'] as (string | undefined))"
  :dark-font-color="($attrs['dark-font-color'] as (string | undefined))"
  :focus-font-color="($attrs['focus-font-color'] as (string | undefined))"
  :left-icon="($attrs['left-icon'] as (string | undefined))"
  :icon-color="($attrs['icon-color'] as (string | undefined))"
  :right-icon="($attrs['right-icon'] as (string | undefined))"
  :right-text="($attrs['right-text'] as (string | undefined))"
  :left-text="($attrs['left-text'] as (string | undefined))"
  :disabled="($attrs.disabled as (boolean | undefined))"
  :confirm-type="($attrs['confirm-type'] as ('send' | 'search' | 'next' | 'done' | undefined))"
  :cursor-spacing="($attrs['cursor-spacing'] as (number | undefined))"
  :confirm-hold="($attrs['confirm-hold'] as (boolean | undefined))"
  :cursor="($attrs.cursor as (number | undefined))"
  :cursor-color="($attrs['cursor-color'] as (string | undefined))"
  :adjust-position="($attrs['adjust-position'] as (boolean | undefined))"
  :auto-blur="($attrs['auto-blur'] as (boolean | undefined))"
  :ignore-composition-event="($attrs['ignore-composition-event'] as (boolean | undefined))"
  :always-embed="($attrs['always-embed'] as (boolean | undefined))"
  :hold-keyboard="($attrs['hold-keyboard'] as (boolean | undefined))"
  :safe-password-cert-path="($attrs['safe-password-cert-path'] as (string | undefined))"
  :safe-password-length="($attrs['safe-password-length'] as (number | undefined))"
  :safe-password-time-stamp="($attrs['safe-password-time-stamp'] as (number | undefined))"
  :safe-password-nonce="($attrs['safe-password-nonce'] as (string | undefined))"
  :safe-password-salt="($attrs['safe-password-salt'] as (string | undefined))"
  :safe-password-custom-hash="($attrs['safe-password-custom-hash'] as (string | undefined))"
  :random-number="($attrs['random-number'] as (boolean | undefined))"
  :controlled="($attrs['controlled'] as (boolean | undefined))"
  :always-system="($attrs['always-system'] as (boolean | undefined))"
  :inputmode="($attrs.inputmode as ('text' | 'tel' | 'search' | 'url' | 'email' | 'numeric' | 'none' | 'decimal' | undefined))"
  :auto-height="($attrs['auto-height'] as (boolean | undefined))"
  :fixed="($attrs.fixed as (boolean | undefined))"
  :show-confirm-bar="($attrs['show-confirm-bar'] as (boolean | undefined))"
  :focus-highlight="($attrs['focus-highlight'] as (boolean | undefined))"
  :focus-highlight-style="($attrs['focus-highlight-style'] as (string | undefined))"
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
      {{ modelValue ?? "" }}
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
  (e: "focus"): void,
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
    isHideZero?: boolean;
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
    isHideZero: true,
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
      if (props.modelValue.isNaN() || (props.isHideZero && props.modelValue.isZero())) {
        modelValue.value = "";
      } else {
        modelValue.value = props.modelValue.toString();
      }
    } else if (props.modelValue instanceof Number) {
      if (props.isHideZero && props.modelValue == 0) {
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
    return modelValue.value == null || modelValue.value === "" || (props.isHideZero && new Decimal(modelValue.value).isZero());
  }
  if (props.isNumber) {
    return modelValue.value == null || modelValue.value === "" || (props.isHideZero && Number(modelValue.value) == 0) || isNaN(Number(modelValue.value));
  }
  if (props.type === "number" || props.type === "digit" || props.type === "decimal") {
    return modelValue.value == null || modelValue.value === "" || (props.isHideZero && Number(modelValue.value) == 0) || isNaN(modelValue.value);
  }
  return modelValue.value == null || modelValue.value === "";
});

const focusValue = ref<string>();

function onFocus() {
  isFocus.value = true;
  selectionStart.value = undefined;
  selectionEnd.value = undefined;
  focusValue.value = modelValue.value;
  emit("focus");
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
