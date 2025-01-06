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
      v-for="(key, index) in keys"
      :key="index"
      #[key]
    >
      <slot :name="key"></slot>
    </template>
  </el-input>
  <slot name="myAppend"></slot>
</div>
<template
  v-else
>
  <div
    un-w="full"
    un-whitespace-nowrap
    un-flex="~"
    un-justify="start"
    un-items="center"
    class="custom_input_readonly"
    :class="{
      'custom_input_readonly_border': props.isReadonlyBorder,
      'custom_input_readonly_no_border': !props.isReadonlyBorder
    }"
  >
    <div
      un-flex="~ [1_0_0]"
      un-overflow-hidden
      un-p="x-2.5 y-1.25"
      un-box-border
      un-w="full"
      un-min="h-7.5"
      un-break-words
      un-whitespace-pre-wrap
      class="custom_input_readonly_content"
      :class="{
        'custom_input_placeholder': shouldShowPlaceholder
      }"
      :style="{
        'min-height': textareaHeight != null ? textareaHeight + 'px' : undefined,
      }"
      v-bind="$attrs"
    >
      <template
        v-if="!(modelValue ?? '')"
      >
        {{ props.readonlyPlaceholder ?? "" }}
      </template>
      <template
        v-else
      >
        {{ modelValue ?? "" }}
      </template>
    </div>
    <div
      un-flex="~"
      un-overflow-hidden
      un-p="x-2.5 y-1.25"
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slots: any = useSlots();
const keys = Object.keys(slots);

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
  }>(),
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

const t = getCurrentInstance()!.proxy!;

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

defineExpose({
  inputRef: $$(inputRef),
  focus,
});
</script>

<style lang="scss" scoped>
.custom_input_readonly_border {
  @apply b-1 b-solid b-[var(--el-border-color)] rounded;
}
.custom_input_readonly_no_border {
  .custom_input_readonly_content {
    @apply p-y-1.5;
  }
}
.custom_input {
  :deep(.el-input__wrapper) {
    .el-input__inner {
      @apply m-r-5.5;
    }
  }
  :deep(.el-input__wrapper:has(.el-input__suffix)) {
    .el-input__inner {
      @apply m-r-0;
    }
  }
}
.custom_input_align_left {
  .custom_input_readonly_content {
    @apply text-left;
  }
  :deep(el-input__inner) {
    @apply text-left;
  }
}
.custom_input_align_center {
  .custom_input_readonly_content {
    @apply text-center;
  }
  :deep(.el-input__inner) {
    @apply text-center;
  }
}
.custom_input_align_right {
  .custom_input_readonly_content {
    @apply text-right;
  }
  :deep(.el-input__inner) {
    @apply text-right;
  }
}
</style>
