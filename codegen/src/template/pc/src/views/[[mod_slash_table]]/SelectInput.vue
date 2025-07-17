<#
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
}
#><template>
<div
  v-if="!props.readonly"
  ref="wrapperRef"
  class="select_input_wrapper"
  tabindex="0"
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
    @click="onInput('input')"
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
  findByIds<#=Table_Up#>,
  getPagePath<#=Table_Up#>,
} from "./Api.ts";

const emit = defineEmits<{
  (e: "update:modelValue", value?: <#=Table_Up#>Id | <#=Table_Up#>Id[] | null): void,
  (e: "update:modelLabel", value?: string): void,
  (e: "change", value?: <#=modelName#> | (<#=modelName#> | undefined)[] | null): void,
  (e: "clear"): void,
}>();

const {
  formItem,
} = useFormItem();

const pagePath = getPagePath<#=Table_Up#>();<#
if (isUseI18n) {
#>

const {
  n,
  ns,
  nAsync,
  nsAsync,
} = useI18n(pagePath);<#
}
#>

const props = withDefaults(
  defineProps<{
    modelValue?: <#=Table_Up#>Id | <#=Table_Up#>Id[] | null;
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
let selectedValue: <#=modelName#> | (<#=modelName#> | undefined)[] | null | undefined = undefined;

let modelLabel = $ref(props.modelLabel);
let hasModelLabel = $ref(false);

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
  () => modelValue,
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
  let modelValueArr: <#=Table_Up#>Id[] = [ ];
  if (modelValue) {
    if (Array.isArray(modelValue)) {
      modelValueArr = modelValue;
    } else {
      modelValueArr = modelValue.split(",") as unknown as <#=Table_Up#>Id[];
    }
  }
  return modelValueArr;
}

async function getModelsByIds(ids: <#=Table_Up#>Id[]) {
  if (ids.length === 0) {
    return [ ];
  }
  const <#=table#>_models = await findByIds<#=Table_Up#>(
    ids,
    {
      notLoading: true,
    },
  );
  return <#=table#>_models;
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

let modelLabelRefreshing = $ref(false);

/** 根据modelValue刷新输入框的值 */
async function refreshInputValue() {
  const modelValueArr = getModelValueArr();
  if (modelValueArr.length === 0) {
    inputValue = "";
    oldInputValue = inputValue;
    return;
  }
  let models: <#=modelName#>[];
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
  inputValue = models.map((item) => item?.<#=opts?.lbl_field || "lbl"#> || "").join(",");
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
  formItem?.clearValidate();
  const modelValueArr = getModelValueArr();
  const {
    type,
    selectedIds,
    selectedModels,
  } = await selectListRef.showDialog({<#
    if (isUseI18n) {
    #>
    title: `${ await nsAsync("选择") } ${ await nAsync("<#=table_comment#>") }`,<#
    } else {
    #>
    title: `选择 <#=table_comment#>`,<#
    }
    #>
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
  inputValue = selectedModels.map((item) => item.<#=opts?.lbl_field#> || "").join(",");
  oldInputValue = inputValue;
  emit("update:modelValue", modelValue);
  modelLabel = inputValue;
  emit("update:modelLabel", inputValue);
}

const wrapperRef = $(useTemplateRef<InstanceType<typeof HTMLDivElement>>("wrapperRef"));

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

async function onSelectList(value?: <#=modelName#> | (<#=modelName#> | undefined)[] | null) {
  selectedValue = value;
  if (props.multiple) {
    emit("change", value);
    if (oldInputValue !== inputValue) {
      await refreshInputValue();
    }
    return;
  }
  if (!Array.isArray(value)) {
    emit("change", value);
    if (oldInputValue !== inputValue) {
      await refreshInputValue();
    }
    return;
  }
  emit("change", value[0]);
  if (oldInputValue !== inputValue) {
    await refreshInputValue();
  }
}

defineExpose({
  focus,
  blur,
});
</script>
