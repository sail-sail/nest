<template>
<div
  v-if="props.readonly !== true"
  un-flex="~"
  un-items-center
  un-w="full"
  class="custom_input_tag"
  :class="{
    'custom_input_tag_align_left': props.align === 'left',
    'custom_input_tag_align_center': props.align === 'center',
    'custom_input_tag_align_right': props.align === 'right',
  }"
>
  <el-input-tag
    ref="inputTagRef"
    :model-value="modelValue"
    v-bind="$attrs"
    class="flex-[1_0_0] overflow-hidden"
    :clearable="props.disabled === true ? false : props.clearable"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    :collapse-tags="props.collapseTags"
    :collapse-tags-tooltip="props.collapseTagsTooltip"
    @update:model-value="onModelValueUpdate"
    @change="onChange"
    @input="onInput"
    @clear="onClear"
    @add-tag="onAddTag"
    @remove-tag="onRemoveTag"
    @drag-tag="onDragTag"
    @focus="onFocus"
    @blur="onBlur"
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
  </el-input-tag>
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
    un-items="stretch"
    un-box-border
    class="custom_input_tag_readonly"
    :class="{
      'custom_input_tag_readonly_border': props.isReadonlyBorder,
      'custom_input_tag_readonly_no_border': !props.isReadonlyBorder,
      'custom_input_tag_align_left': props.align === 'left',
      'custom_input_tag_align_center': props.align === 'center',
      'custom_input_tag_align_right': props.align === 'right',
    }"
  >
    <div
      un-flex="~ [1_0_0] wrap"
      un-overflow-hidden
      un-p="x-2.5 y-0.875"
      un-box-border
      un-w="full"
      un-min="h-7.5"
      un-gap="x-1 y-.5"
      un-break-all
      class="custom_input_tag_readonly_content"
      :class="{
        'items-safe-center': shouldShowPlaceholder,
        'custom_input_tag_placeholder': shouldShowPlaceholder,
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
      <template
        v-else
      >
        <el-tag
          v-for="(tag, index) in modelValue"
          :key="`${ tag }-${ index }`"
          type="info"
          :disable-transitions="true"
        >
          {{ tag }}
        </el-tag>
      </template>
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
const emit = defineEmits<{
  (e: "update:modelValue", value?: string[]): void,
  (e: "change", value?: string[]): void,
  (e: "input", value: string): void,
  (e: "clear"): void,
  (e: "add-tag", value: string | string[]): void,
  (e: "remove-tag", value: string, index: number): void,
  (e: "drag-tag", oldIndex: number, newIndex: number, value: string): void,
  (e: "focus", evt: FocusEvent): void,
  (e: "blur", evt: FocusEvent): void,
}>();

const props = withDefaults(
  defineProps<{
    modelValue?: string[];
    clearable?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
    isReadonlyBorder?: boolean;
    align?: "left" | "center" | "right";
    collapseTags?: boolean;
    collapseTagsTooltip?: boolean;
  }>(),
  {
    modelValue: undefined,
    clearable: true,
    disabled: undefined,
    readonly: undefined,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
    isReadonlyBorder: true,
    align: undefined,
    collapseTags: true,
    collapseTagsTooltip: true,
  },
);

function normalizeModelValue(value?: string[]) {
  return Array.isArray(value) ? value.slice() : [];
}

let modelValue = $ref<string[]>(normalizeModelValue(props.modelValue));

watch(
  () => props.modelValue,
  () => {
    modelValue = normalizeModelValue(props.modelValue);
  },
);

const shouldShowPlaceholder = computed<boolean>(() => {
  return modelValue.length === 0;
});

const inputTagRef = useTemplateRef("inputTagRef");

function onModelValueUpdate(value?: string[]) {
  modelValue = normalizeModelValue(value);
  emit("update:modelValue", modelValue);
}

function onChange(value?: string[]) {
  emit("change", normalizeModelValue(value));
}

function onInput(value: string) {
  emit("input", value);
}

function onClear() {
  modelValue = [];
  emit("update:modelValue", modelValue);
  emit("clear");
}

function onAddTag(value: string | string[]) {
  emit("add-tag", value);
}

function onRemoveTag(
  value: string,
  index: number,
) {
  emit("remove-tag", value, index);
}

function onDragTag(
  oldIndex: number,
  newIndex: number,
  value: string,
) {
  emit("drag-tag", oldIndex, newIndex, value);
}

function onFocus(evt: FocusEvent) {
  emit("focus", evt);
}

function onBlur(evt: FocusEvent) {
  emit("blur", evt);
}

function focus() {
  inputTagRef.value?.focus();
}

function blur() {
  inputTagRef.value?.blur();
}

defineExpose({
  inputTagRef,
  focus,
  blur,
});
</script>

<style lang="scss" scoped>
.custom_input_tag,.custom_input_tag_readonly {
  :deep(.el-tag) {
    height: auto;
    line-height: normal;
    padding-top: 2px;
    padding-bottom: 2px;
    box-sizing: border-box;
    .el-tag__content {
      white-space: normal;
      word-break: break-word;
    }
  }
}
.custom_input_tag_readonly_content {
  align-items: center;
}
.custom_input_tag_readonly_border {
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
  border-radius: 4px;
}
.custom_input_tag_readonly_border:hover {
  box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
}
.custom_input_tag_readonly_no_border {
  .custom_input_tag_readonly_content {
    padding-top: calc(var(--spacing) * 1.5);
    padding-bottom: calc(var(--spacing) * 1.5);
  }
}
.custom_input_tag_readonly_no_border:hover {
  box-shadow: none;
}
.custom_input_tag_placeholder {
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--el-text-color-secondary);
}
.custom_input_tag_align_left {
  .custom_input_tag_readonly_content {
    justify-content: flex-start;
  }
  :deep(.el-input-tag__inner) {
    justify-content: flex-start;
  }
  :deep(.el-input-tag__input) {
    text-align: left;
  }
}
.custom_input_tag_align_center {
  .custom_input_tag_readonly_content {
    justify-content: center;
  }
  :deep(.el-input-tag__inner) {
    justify-content: center;
  }
  :deep(.el-input-tag__input) {
    text-align: center;
  }
}
.custom_input_tag_align_right {
  .custom_input_tag_readonly_content {
    justify-content: flex-end;
  }
  :deep(.el-input-tag__inner) {
    justify-content: flex-end;
  }
  :deep(.el-input-tag__input) {
    text-align: right;
  }
}
</style>