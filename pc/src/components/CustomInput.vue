<template>
<div
  v-if="readonly !== true"
  un-flex="~"
  un-items-center
  un-w="full"
  class="custom_input"
  :class="{
    'custom_input_align_left': props.align === 'left',
    'custom_input_align_center': props.align === 'center',
    'custom_input_align_right': props.align === 'right',
  }"
>
  <el-input
    ref="inputRef"
    v-model="modelValue"
    :type="props.type"
    v-bind="$attrs"
    class="flex-[1_0_0] overflow-hidden"
    :clearable="props.disabled === true ? false : props.clearable"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    @change="onChange"
    @clear="onClear"
  >
    <template
      v-for="(_, name) of $slots"
      :key="name"
      #[name]="slotProps"
    >
      <slot
        :name="name"
        v-bind="slotProps"
      ></slot>
    </template>
  </el-input>
  <slot name="myAppend"></slot>
</div>
<template
  v-else
>
  <div
    un-w="full"
    un-min="h-8"
    un-whitespace-nowrap
    un-flex="~"
    un-justify="start"
    un-items="center"
    un-box-border
    class="custom_input_readonly"
    :class="{
      'custom_input_readonly_border': props.isReadonlyBorder,
      'custom_input_readonly_no_border': !props.isReadonlyBorder,
    }"
  >
    <div
      un-flex="~ [1_0_0]"
      un-overflow-hidden
      un-p="x-2.5 y-0.875"
      un-box-border
      un-w="full"
      un-min="h-7.5"
      un-break-all
      un-whitespace-pre-wrap
      class="custom_input_readonly_content"
      :class="{
        'items-safe-center': type !== 'textarea',
        'custom_input_placeholder': shouldShowPlaceholder,
      }"
      :style="{
        'min-height': textareaHeight != null ? textareaHeight + 'px' : undefined,
      }"
      v-bind="$attrs"
    >
      <span
        v-if="shouldShowPlaceholder"
        un-relative
        un-top="-1px"
      >
        {{ props.readonlyPlaceholder ?? "" }}
      </span>
      <span
        v-else
        un-relative
        un-top="-1px"
      >
        {{ modelValue ?? "" }}
      </span>
    </div>
    <div
      v-if="$slots.suffix"
      un-flex="~"
      un-overflow-hidden
      un-p="x-2.5"
      un-box-border
      un-min="h-7.5"
      un-items="center"
    >
      <slot name="suffix"></slot>
    </div>
  </div>
</template>
</template>

<script lang="ts" setup>
import type {
  InputProps,
} from "element-plus";

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
    type?: string;
    clearable?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
    isReadonlyBorder?: boolean;
    align?: "left" | "center" | "right";
  } & Partial<InputProps>>(),
  {
    modelValue: undefined,
    type: "text",
    clearable: true,
    disabled: undefined,
    readonly: undefined,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
    isReadonlyBorder: true,
    align: undefined,
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

const shouldShowPlaceholder = $computed<boolean>(() => {
  return modelValue == null || modelValue === "";
});

const inputRef = $ref<InstanceType<typeof ElInput>>();
let textareaHeight = $shallowRef<number>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
useResizeObserver($$(inputRef) as any, (entries) => {
  if (props.type !== "textarea") {
    return;
  }
  const [ entry ] = entries;
  const { height } = entry.contentRect;
  textareaHeight = height - 2;
});

function onChange() {
  emit("update:modelValue", modelValue);
  emit("change", modelValue);
}

function onClear() {
  modelValue = "";
  emit("update:modelValue", modelValue);
  emit("clear");
}

function focus() {
  inputRef?.focus();
}

function blur() {
  inputRef?.blur();
}

defineExpose({
  inputRef: $$(inputRef),
  focus,
  blur,
});
</script>

<style lang="scss" scoped>
.custom_input_readonly_content {
  align-items: center;
}
.custom_input_readonly_border {
  border-width: 1px;
  border-style: solid;
  border-color: var(--el-border-color);
  border-radius: 4px;
}
.custom_input_readonly_no_border {
  .custom_input_readonly_content {
    padding-top: calc(var(--spacing) * 1.5);
    padding-bottom: calc(var(--spacing) * 1.5);
  }
}
.custom_input_align_center {
  :deep(.el-input__wrapper) {
    .el-input__inner {
      margin-right: calc(var(--spacing) * 5.5);
      position: relative;
      right: calc(var(--spacing) * -2.75);
    }
  }
  :deep(.el-input__wrapper:has(.el-input__suffix)) {
    .el-input__inner {
      margin-right: 0;
    }
  }
}
.custom_input_align_left {
  .custom_input_readonly_content {
    text-align: left;
  }
  :deep(el-input__inner) {
    text-align: left;
  }
}
.custom_input_align_center {
  .custom_input_readonly_content {
    text-align: center;
  }
  :deep(.el-input__inner) {
    text-align: center;
  }
}
.custom_input_align_right {
  .custom_input_readonly_content {
    text-align: right;
  }
  :deep(.el-input__inner) {
    text-align: right;
  }
}
</style>
