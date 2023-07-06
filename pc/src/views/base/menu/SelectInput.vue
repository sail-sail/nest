<template>
<div
  v-if="!props.readonly"
  class="flex items-stretch w-full box-border"
  :class="{
    'p-l-1': dialog_visible,
  }"
>
  <el-input
    v-bind="$attrs"
    @click="inputClk"
    v-model="inputValue"
    @clear="clearClk"
    readonly
    clearable
    class="cursor-pointer box-border flex-[1_0_0]"
    un-cursor-pointer
    :placeholder="props.placeholder"
    @mouseenter="inputEnter"
    @mouseleave="inputLeave"
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
          v-if="modelValue && modelValue.length > 0"
        >
          <el-icon
            @click="clearClk"
            un-cursor-pointer
            un-text="hover:red-500"
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
            @click="inputClk"
            un-cursor-pointer
            un-m="r-0.5"
            size="14"
          >
            <ElIconArrowDown />
          </el-icon>
        </template>
      </template>
    </template>
  </el-input>
  <SelectList
    ref="selectListRef"
    @change="selectListChg"
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
    un-m="l-1"
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
import {
  type MaybeRefOrGetter,
  type WatchStopHandle,
} from "vue";

import SelectList from "./SelectList.vue";

import {
  findAll,
} from "./Api";

import {
  type MenuModel,
} from "#/types";

let emit = defineEmits<{
  (e: "update:modelValue", value?: string | string[] | null): void,
  (e: "change", value?: MenuModel | (MenuModel | undefined)[] | null): void,
  (e: "clear"): void,
}>();

const {
  n,
  ns,
  nAsync,
  nsAsync,
} = useI18n("/base/menu");

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[] | null;
    multiple?: boolean;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
  }>(),
  {
    modelValue: undefined,
    multiple: false,
    placeholder: undefined,
    disabled: false,
    readonly: false,
  },
);

let inputValue = $ref("");

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

function inputEnter() {
  isHover = true;
}

function inputLeave() {
  isHover = false;
}

function getModelValueArr() {
  let modelValueArr: string[] = [ ];
  if (modelValue) {
    if (Array.isArray(modelValue)) {
      modelValueArr = modelValue;
    } else {
      modelValueArr = modelValue.split(",");
    }
  }
  return modelValueArr;
}

async function getModelsByIds(ids: string[]) {
  const res = await findAll(
    {
      ids,
    },
  );
  return res;
}

// 根据modelValue刷新输入框的值
async function refreshInputValue() {
  const modelValueArr = getModelValueArr();
  if (modelValueArr.length === 0) {
    inputValue = "";
    return;
  }
  const models = await getModelsByIds(modelValueArr);
  inputValue = models.map((item) => item?.lbl || "").join(", ");
}

function clearClk() {
  modelValue = "";
  inputValue = "";
  emit("update:modelValue", modelValue);
  emit("change", undefined);
  emit("clear");
}

let dialog_visible = $ref(false);

let selectListRef = $ref<InstanceType<typeof SelectList>>();

async function inputClk() {
  if (!selectListRef) {
    return;
  }
  dialog_visible = true;
  const modelValueArr = getModelValueArr();
  const {
    type,
    selectedIds,
  } = await selectListRef.showDialog({
    title: `${ await nsAsync("选择") } ${ await nAsync("菜单") }`,
    action: "select",
    multiple: props.multiple,
    isReadonly: () => props.readonly,
    model: {
      ids: modelValueArr,
    },
  });
  dialog_visible = false;
  if (type === "cancel") {
    return;
  }
  if (props.multiple) {
    modelValue = selectedIds;
  } else {
    modelValue = selectedIds[0] || "";
  }
  emit("update:modelValue", modelValue);
}

function selectListChg(value?: MenuModel | (MenuModel | undefined)[] | null) {
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
</script>
