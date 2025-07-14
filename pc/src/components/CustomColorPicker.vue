<template>
<div
  v-if="props.readonly !== true"
  un-flex="~"
  un-items-center
  class="custom_color_picker"
  :title="modelValue ?? undefined"
>
  <el-color-picker
    ref="inputRef"
    v-model="modelValue"
    :set="modelValue = modelValue ?? undefined"
    v-bind="$attrs"
  ></el-color-picker>
</div>
<template
  v-else
>
  <div
    un-whitespace-nowrap
    un-flex="~"
    un-justify="start"
    un-items="center"
    class="custom_color_picker_readonly"
    :title="modelValue ?? undefined"
  >
    <div
      class="el-color-picker__trigger"
      un-cursor="default"
      :style="{
        border: props.isReadonlyBorder === true ? undefined : 'none',
      }"
    >
      <div
        un-h="full"
        un-aspect="square"
        un-rounded="sm"
        class="el-color-picker__color is-alpha"
      >
        <div
          un-h="full"
          un-w="full"
          :style="{
            backgroundColor: modelValue ?? undefined,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>
</template>

<script lang="ts" setup>
import type {
  ColorPickerProps,
} from "element-plus";

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    isReadonlyBorder?: boolean;
  } & Partial<ColorPickerProps>>(),
  {
    readonly: undefined,
    isReadonlyBorder: true,
  },
);

const inputRef = $ref<InstanceType<typeof ElColorPicker>>();

const modelValue = defineModel<string | null>();

function focus() {
  inputRef?.focus();
}

defineExpose({
  inputRef: $$(inputRef),
  focus,
});
</script>

<style lang="scss" scoped>
.custom_color_picker_readonly {
  --el-color-picker-alpha-bg-a: #ccc;
  --el-color-picker-alpha-bg-b: transparent;
}
</style>
