<template>
<div
  v-if="!props.readonly"
  class="select_input_wrapper"
  :class="{
    label_readonly_1: props.labelReadonly,
    label_readonly_0: !props.labelReadonly,
  }"
  @mouseenter="onMouseEnter"
  @mouseleave="onMouseLeave"
>
  <CustomInput
    v-bind="$attrs"
    ref="inputRef"
    v-model="inputValue"
    :readonly="props.labelReadonly"
    :clearable="false"
    class="select_input"
    :placeholder="props.placeholder"
    :readonly-placeholder="props.placeholder"
    @click="onInput('input')"
    @clear="onClear"
    @keydown.enter="onEnter"
  >
    <template
      v-for="key in $slots"
      :key="key"
      #[key]
    >
      <slot
        :name="key"
      ></slot>
    </template>
    <template
      v-if="!$slots.suffix"
      #suffix
    >
      <template
        v-if="!props.disabled"
      >
        <template
          v-if="modelValue && modelValue.length > 0 && props.labelReadonly"
        >
          <el-icon
            un-cursor="pointer"
            un-m="r-0.5"
            size="14"
            @click="onClear"
          >
            <ElIconCircleClose
              v-if="isHover"
            />
            <ElIconArrowDown
              v-else
            />
          </el-icon>
        </template>
        <template
          v-else
        >
          <el-icon
            un-cursor="pointer"
            un-m="r-0.5"
            size="14"
            @click="onInput('icon')"
          >
            <ElIconArrowDown />
          </el-icon>
        </template>
      </template>
    </template>
  </CustomInput>
  <SelectList
    v-bind="$attrs"
    ref="selectListRef"
    @change="onSelectList"
  ></SelectList>
</div>
<template
  v-else
>
  <div
    un-b="1 solid [var(--el-border-color)]"
    un-p="x-2.75 y-1"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-8"
    un-line-height="normal"
    un-break-words
    class="custom_select_readonly select_input_readonly"
    v-bind="$attrs"
  >
    {{ inputValue ?? "" }}
  </div>
</template>
</template>

<script lang="ts" setup>
import SelectList from "./SelectList.vue";

import {
  findAll,
  getPagePath,
} from "./Api";

const emit = defineEmits<{
  (e: "update:modelValue", value?: UsrId | UsrId[] | null): void,
  (e: "update:modelLabel", value?: string): void,
  (e: "change", value?: UsrModel | (UsrModel | undefined)[] | null): void,
  (e: "validateField"): void,
  (e: "clear"): void,
}>();

const pagePath = getPagePath();

const props = withDefaults(
  defineProps<{
    modelValue?: UsrId | UsrId[] | null;
    multiple?: boolean;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    labelReadonly?: boolean;
  }>(),
  {
    modelValue: undefined,
    multiple: false,
    placeholder: undefined,
    disabled: false,
    readonly: false,
    labelReadonly: true,
  },
);

let inputValue = $ref("");
let oldInputValue = $ref("");

watch(
  () => inputValue,
  (value) => {
    emit("update:modelLabel", value);
  },
);

let modelValue = $ref(props.modelValue);
let selectedValue: UsrModel | (UsrModel | undefined)[] | null | undefined = undefined;

watch(
  () => props.modelValue,
  () => {
    modelValue = props.modelValue;
  },
  {
    immediate: true,
  }
);

watch(
  () => modelValue,
  async () => {
    await refreshInputValue();
  },
  {
    immediate: true,
  },
);

let isHover = $ref(false);

function onMouseEnter() {
  isHover = true;
}

function onMouseLeave() {
  isHover = false;
}

async function onEnter(e: KeyboardEvent) {
  if (e.ctrlKey) {
    return;
  }
  await onInput("icon");
}

function getModelValueArr() {
  let modelValueArr: UsrId[] = [ ];
  if (modelValue) {
    if (Array.isArray(modelValue)) {
      modelValueArr = modelValue;
    } else {
      modelValueArr = modelValue.split(",") as unknown as UsrId[];
    }
  }
  return modelValueArr;
}

async function getModelsByIds(ids: UsrId[]) {
  const res = await findAll(
    {
      ids,
    },
  );
  return res;
}

/** 根据modelValue刷新输入框的值 */
async function refreshInputValue() {
  const modelValueArr = getModelValueArr();
  if (modelValueArr.length === 0) {
    inputValue = "";
    oldInputValue = inputValue;
    return;
  }
  let models: UsrModel[];
  if (selectedValue && Array.isArray(selectedValue)) {
    models = selectedValue.filter((item) => item != null);
  } else if (selectedValue) {
    models = [ selectedValue ];
  } else {
    models = await getModelsByIds(modelValueArr);
  }
  inputValue = models.map((item) => item?.lbl || "").join(", ");
  oldInputValue = inputValue;
}

function onClear(e?: PointerEvent) {
  e?.stopPropagation();
  modelValue = undefined;
  inputValue = "";
  oldInputValue = inputValue;
  emit("update:modelValue", modelValue);
  emit("change");
  emit("clear");
  emit("validateField");
}


const selectListRef = $(useTemplateRef<InstanceType<typeof SelectList>>("selectListRef"));

async function onInput(
  clickType: "input" | "icon",
) {
  if (!selectListRef) {
    return;
  }
  if (props.disabled) {
    return;
  }
  if (!props.labelReadonly && clickType === "input") {
    return;
  }
  const modelValueArr = getModelValueArr();
  const {
    type,
    selectedIds,
  } = await selectListRef.showDialog({
    title: `选择 用户`,
    action: "select",
    multiple: props.multiple,
    isReadonly: () => props.readonly,
    model: {
      ids: modelValueArr,
    },
  });
  focus();
  if (type === "cancel") {
    return;
  }
  if (props.multiple) {
    modelValue = selectedIds;
  } else {
    modelValue = selectedIds[0];
  }
  emit("update:modelValue", modelValue);
}

const inputRef = $(useTemplateRef<InstanceType<typeof CustomInput>>("inputRef"));

function focus() {
  if (!inputRef) {
    return;
  }
  inputRef.focus();
}

function blur() {
  if (!inputRef) {
    return;
  }
  inputRef.blur();
}

async function onSelectList(value?: UsrModel | (UsrModel | undefined)[] | null) {
  selectedValue = value;
  await nextTick();
  if (props.multiple) {
    emit("change", value);
    await nextTick();
    await nextTick();
    emit("validateField");
    if (oldInputValue !== inputValue) {
      await refreshInputValue();
    }
    return;
  }
  if (!Array.isArray(value)) {
    emit("change", value);
    await nextTick();
    await nextTick();
    emit("validateField");
    if (oldInputValue !== inputValue) {
      await refreshInputValue();
    }
    return;
  }
  emit("change", value[0]);
  await nextTick();
  await nextTick();
  emit("validateField");
  if (oldInputValue !== inputValue) {
    await refreshInputValue();
  }
}

defineExpose({
  focus,
  blur,
});
</script>
