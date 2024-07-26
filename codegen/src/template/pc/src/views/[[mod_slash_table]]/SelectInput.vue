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
  class="select_input_wrapper"
  :class="{
    label_readonly_1: props.labelReadonly,
    label_readonly_0: !props.labelReadonly,
  }"
>
  <CustomInput
    v-bind="$attrs"
    ref="inputRef"
    @click="onInput('input')"
    v-model="inputValue"
    @clear="(onClear as any)"
    :readonly="props.labelReadonly"
    :clearable="false"
    class="select_input"
    :placeholder="props.placeholder"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
    @keydown.enter="onEnter"
  >
    <template
      v-for="(item, key, index) in $slots"
      :key="index"
      #[key]
    >
      <slot
        :name="key"
      ></slot>
    </template>
    <template
      #suffix
      v-if="!$slots.suffix"
    >
      <template
        v-if="!props.disabled"
      >
        <template
          v-if="modelValue && modelValue.length > 0 && props.labelReadonly"
        >
          <el-icon
            @click="onClear"
            un-cursor-pointer
            un-m="r-0.5"
            size="14"
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
            @click="onInput('icon')"
            un-cursor-pointer
            un-m="r-0.5"
            size="14"
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
    class="custom_select_readonly"
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
} from "./Api";

let emit = defineEmits<{
  (e: "update:modelValue", value?: <#=Table_Up#>Id | <#=Table_Up#>Id[] | null): void,
  (e: "update:modelLabel", value?: string): void,
  (e: "change", value?: <#=modelName#> | (<#=modelName#> | undefined)[] | null): void,
  (e: "clear"): void,
}>();

const {
  n,
  ns,
  nAsync,
  nsAsync,
} = useI18n("/<#=mod#>/<#=table#>");

const props = withDefaults(
  defineProps<{
    modelValue?: <#=Table_Up#>Id | <#=Table_Up#>Id[] | null;
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

watch(
  () => inputValue,
  (value) => {
    emit("update:modelLabel", value);
  },
);

let modelValue = $ref(props.modelValue);

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

function mouseEnter() {
  isHover = true;
}

function mouseLeave() {
  isHover = false;
}

async function onEnter(e: KeyboardEvent) {
  if (e.ctrlKey) {
    return;
  }
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
    return;
  }
  const models = await getModelsByIds(modelValueArr);
  inputValue = models.map((item) => item?.<#=opts?.lbl_field || "lbl"#> || "").join(", ");
}

function onClear(e?: PointerEvent) {
  e?.stopPropagation();
  modelValue = undefined;
  inputValue = "";
  emit("update:modelValue", modelValue);
  emit("change");
  emit("clear");
}


let selectListRef = $ref<InstanceType<typeof SelectList>>();

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
    title: `${ await nsAsync("选择") } ${ await nAsync("<#=table_comment#>") }`,
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

let inputRef = $ref<InstanceType<typeof ElInput>>();

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

async function onSelectList(value?: <#=modelName#> | (<#=modelName#> | undefined)[] | null) {
  await nextTick();
  await nextTick();
  await nextTick();
  if (props.multiple) {
    emit("change", value);
    return;
  }
  if (!Array.isArray(value)) {
    emit("change", value);
    return;
  }
  emit("change", value[0]);
}

defineExpose({
  focus,
  blur,
});
</script>
