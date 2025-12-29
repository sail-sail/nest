<template>
<div
  v-if="!props.readonly"
  ref="wrapperRef"
  class="select_input_wrapper"
  :tabindex="!props.labelReadonly || props.disabled ? -1 : 0"
  :class="{
    label_readonly_1: props.labelReadonly,
    label_readonly_0: !props.labelReadonly,
    'select_input_isShowModelLabel': props.pageInited && !modelLabelRefreshing && hasModelLabel && modelLabel != inputValue,
  }"
  @mouseenter="onMouseEnter"
  @mouseleave="onMouseLeave"
  @keydown.enter="onEnter"
>
  <CustomInput
    v-bind="$attrs"
    :model-value="hasModelLabel ? modelLabel : inputValue"
    :readonly="props.labelReadonly"
    :clearable="false"
    class="select_input"
    :placeholder="props.placeholder"
    :readonly-placeholder="props.placeholder"
    @update:model-value="inputValue = $event"
    @change="onInputChange"
    @click="onInput('input')"
    @clear="onClear"
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
    
    <template
      v-if="!$slots.suffix"
      #suffix
    >
      <div
        v-if="!props.disabled"
        un-flex="~"
        un-items="center"
        un-gap="x-1"
      >
        <template
          v-if="inputValue && inputValue.length > 0 && (isFocus || isHover)"
        >
          <el-icon
            un-cursor="pointer"
            un-m="r-0.5"
            size="14"
            @click="onClear"
          >
            <ElIconCircleClose />
          </el-icon>
        </template>
        
        <el-icon
          un-cursor="pointer"
          un-m="r-0.5"
          size="14"
          @click="onInput('icon')"
        >
          <ElIconArrowDown />
        </el-icon>
      </div>
      
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
    un-p="x-2.5 y-1"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-8"
    un-line-height="normal"
    un-break-words
    class="custom_select_readonly select_input_readonly"
    :class="{
      label_readonly_1: props.labelReadonly,
      label_readonly_0: !props.labelReadonly,
      'select_input_isShowModelLabel': props.pageInited && !modelLabelRefreshing && hasModelLabel && modelLabel != inputValue,
    }"
    v-bind="$attrs"
  >
    {{ hasModelLabel ? modelLabel : inputValue }}
  </div>
</template>
</template>

<script lang="ts" setup>
import {
  useFormItem,
} from "element-plus";

import SelectList from "./SelectList.vue";

import {
  findByIdsDynPage,
  getPagePathDynPage,
} from "./Api.ts";

const emit = defineEmits<{
  (e: "update:modelValue", value?: DynPageId | DynPageId[] | null): void,
  (e: "update:modelLabel", value?: string): void,
  (e: "change", value?: DynPageModel | (DynPageModel | undefined)[] | null): void,
  (e: "clear"): void,
}>();

const {
  formItem,
} = useFormItem();

const pagePath = getPagePathDynPage();

const props = withDefaults(
  defineProps<{
    modelValue?: DynPageId | DynPageId[] | null;
    modelLabel?: string | null;
    multiple?: boolean;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    labelReadonly?: boolean;
    selectListReadonly?: boolean;
    validateEvent?: boolean;
    pageInited?: boolean;
  }>(),
  {
    modelValue: undefined,
    modelLabel: undefined,
    multiple: false,
    placeholder: undefined,
    disabled: false,
    readonly: false,
    labelReadonly: true,
    selectListReadonly: true,
    validateEvent: undefined,
    pageInited: false,
  },
);

let inputValue = $ref("");
let oldInputValue = $ref("");

let modelValue = $ref(props.modelValue);
let selectedValue: DynPageModel | (DynPageModel | undefined)[] | null | undefined = undefined;

let modelLabel = $ref(props.modelLabel);
let hasModelLabel = $ref(false);

let modelLabelRefreshing = $ref(false);

let isInputChanging = false;

watch(
  () => props.modelLabel,
  () => {
    hasModelLabel = true;
    modelLabel = props.modelLabel;
  },
);

watch(
  () => props.modelValue,
  () => {
    modelValue = props.modelValue;
  },
  {
    immediate: true,
  },
);

watch(
  () => [
    modelValue,
    props.multiple,
  ],
  async () => {
    await refreshInputValue();
  },
  {
    immediate: true,
  },
);

watch(
  () => props.pageInited,
  () => {
    formItem?.clearValidate();
  },
);

let isFocus = $ref(false);

function onFocus() {
  isFocus = true;
}

function onBlur() {
  isFocus = false;
}

let isHover = $ref(false);

function onMouseEnter() {
  isHover = true;
}

function onMouseLeave() {
  isHover = false;
}

async function onEnter(e: KeyboardEvent) {
  if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
    return;
  }
  e.stopImmediatePropagation();
  await onInput("icon");
}

function getModelValueArr() {
  let modelValueArr: DynPageId[] = [ ];
  if (modelValue) {
    if (Array.isArray(modelValue)) {
      modelValueArr = modelValue;
    } else {
      modelValueArr = modelValue.split(",") as unknown as DynPageId[];
    }
  }
  return modelValueArr;
}

async function getModelsByIds(ids: DynPageId[]) {
  if (ids.length === 0) {
    return [ ];
  }
  const dyn_page_models = await findByIdsDynPage(
    ids,
    {
      notLoading: true,
    },
  );
  return dyn_page_models;
}

async function validateField() {
  if (props.validateEvent !== false && !props.readonly) {
    try {
      await formItem?.validate("change");
    } catch (err) { /* empty */ }
  } else {
    formItem?.clearValidate();
  }
}

/** 根据modelValue刷新输入框的值 */
async function refreshInputValue() {
  if (isInputChanging) {
    isInputChanging = false;
    modelLabel = inputValue || "";
    emit("update:modelLabel", modelLabel);
    return;
  }
  const modelValueArr = getModelValueArr();
  if (modelValueArr.length === 0) {
    inputValue = "";
    oldInputValue = inputValue;
    return;
  }
  let models: DynPageModel[];
  if (selectedValue && Array.isArray(selectedValue)) {
    models = selectedValue.filter((item) => item != null);
  } else if (selectedValue) {
    models = [ selectedValue ];
  } else {
    modelLabelRefreshing = true;
    models = await getModelsByIds(modelValueArr);
    modelLabelRefreshing = false;
  }
  selectedValue = undefined;
  inputValue = models.map((item) => item?.lbl || "").join(",");
  oldInputValue = inputValue;
}

async function onClear(e?: PointerEvent) {
  e?.stopPropagation();
  modelValue = undefined;
  inputValue = "";
  oldInputValue = inputValue;
  emit("update:modelValue", modelValue);
  modelLabel = inputValue;
  emit("update:modelLabel", inputValue);
  emit("change");
  emit("clear");
  await validateField();
}


const selectListRef = $(useTemplateRef("selectListRef"));

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
  formItem?.clearValidate();
  const modelValueArr = getModelValueArr();
  const {
    type,
    selectedIds,
    selectedModels,
  } = await selectListRef.showDialog({
    title: `选择 动态页面`,
    action: "select",
    multiple: props.multiple,
    isReadonly: () => props.selectListReadonly,
    model: {
      ids: modelValueArr,
    },
  });
  formItem?.clearValidate();
  focus();
  if (type === "cancel" || !selectedIds || !selectedModels) {
    return;
  }
  if (props.multiple) {
    modelValue = selectedIds;
  } else {
    modelValue = selectedIds[0];
  }
  inputValue = selectedModels.map((item) => item.lbl || "").join(",");
  oldInputValue = inputValue;
  emit("update:modelValue", modelValue);
  modelLabel = inputValue;
  emit("update:modelLabel", inputValue);
}

async function onInputChange() {
  isInputChanging = true;
  if (props.multiple) {
    modelValue = [ ];
    emit("update:modelValue", modelValue);
    return;
  }
  modelValue = "" as DynPageId;
  emit("update:modelValue", modelValue);
}

const wrapperRef = $(useTemplateRef("wrapperRef"));

function focus() {
  if (!wrapperRef) {
    return;
  }
  wrapperRef.focus();
}

function blur() {
  if (!wrapperRef) {
    return;
  }
  wrapperRef.focus();
}

async function onSelectList(value?: DynPageModel | (DynPageModel | undefined)[] | null) {
  selectedValue = value;
  if (props.multiple) {
    if (oldInputValue !== inputValue) {
      await refreshInputValue();
    }
    emit("update:modelLabel", modelLabel || "");
    emit("change", value);
    return;
  }
  if (!Array.isArray(value)) {
    if (oldInputValue !== inputValue) {
      await refreshInputValue();
    }
    emit("update:modelLabel", modelLabel || "");
    emit("change", value);
    return;
  }
  if (oldInputValue !== inputValue) {
    await refreshInputValue();
  }
  emit("update:modelLabel", modelLabel || "");
  emit("change", value[0]);
}

defineExpose({
  focus,
  blur,
});
</script>
