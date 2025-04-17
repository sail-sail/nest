<template>
<div
  v-if="readonly !== true"
  ref="selectDivRef"
  un-w="full"
  class="custom_select_div"
  :class="{
    'custom_select_isShowModelLabel': isShowModelLabel && inited,
  }"
>
  <ElSelectV2
    ref="selectRef"
    :options="options4SelectV2Compt"
    filterable
    collapse-tags
    collapse-tags-tooltip
    default-first-option
    :height="props.height"
    un-w="full"
    v-bind="$attrs"
    :model-value="modelValueComputed"
    :loading="!inited"
    class="custom_select"
    :class="{
      'custom_select_space_normal': true,
    }"
    :multiple="props.multiple"
    :clearable="!props.disabled"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :placeholder="((isShowModelLabel && props.multiple) ? props.modelLabel : props.placeholder) ?? undefined"
    @visible-change="handleVisibleChange"
    @change="onValueChange"
    @clear="onClear"
    @update:model-value="modelValueUpdate"
    @keyup.enter.stop
    @keydown.ctrl.c.stop="copyModelLabel"
    @keyup.ctrl.delete.stop="onClear"
    @keyup.ctrl.backspace.stop="onClear"
  >
    <template
      v-if="props.multiple && props.showSelectAll && !props.disabled && !props.readonly && options4SelectV2.length > 0"
      #header
    >
      <el-checkbox
        v-model="isSelectAll"
        :indeterminate="isIndeterminate"
        un-w="full"
        un-p="l-3"
        un-box-border
      >
        <span>
          ({{ ns("全选") }})
        </span>
      </el-checkbox>
    </template>
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
  </ElSelectV2>
</div>
<template
  v-else
>
  <div
    v-if="props.multiple"
    un-flex="~ gap-1 wrap"
    un-items-center
    un-b="1 solid [var(--el-border-color)]"
    un-p="x-1"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-8"
    un-line-height="normal"
    un-break-all
    class="custom_select_readonly"
    :class="{
      'custom_select_placeholder': shouldShowPlaceholder,
      'custom_select_isShowModelLabel': isShowModelLabel && inited,
    }"
    v-bind="$attrs"
  >
    <template
      v-if="modelLabels.length === 0"
    >
      <span
        v-if="isShowModelLabel && props.modelLabel"
        class="custom_select_readonly"
      >
        {{ props.modelLabel || "" }}
      </span>
      <span
        v-else
        class="custom_select_placeholder"
      >
        {{ props.readonlyPlaceholder ?? "" }}
      </span>
    </template>
    <template
      v-else
    >
      <span
        v-if="isShowModelLabel"
        class="custom_select_readonly"
      >
        {{ props.modelLabel || "" }}
      </span>
      <div
        v-else
        un-flex="~ wrap"
        un-gap="x-1 y-.5"
        un-m="y-.5"
      >
        <template
          v-if="readonlyCollapseTags"
        >
          <el-tag
            v-for="label in modelLabels.slice(0, props.readonlyMaxCollapseTags)"
            :key="label"
            type="info"
            :disable-transitions="true"
          >
            {{ label }}
          </el-tag>
          <el-popover
            v-if="modelLabels.length > props.readonlyMaxCollapseTags"
            width="auto"
            :teleported="false"
            :persistent="false"
          >
            <template #reference>
              <el-tag
                type="info"
                :disable-transitions="true"
                un-cursor-pointer
                @click="() => readonlyCollapseTags = false"
              >
                {{ `+${ modelLabels.length - props.readonlyMaxCollapseTags }` }}
              </el-tag>
            </template>
            <div
              un-flex="~ wrap"
              un-gap="x-1 y-1"
              un-m="y-1"
            >
              <el-tag
                v-for="label in modelLabels.slice(props.readonlyMaxCollapseTags)"
                :key="label"
                type="info"
                :disable-transitions="true"
              >
                {{ label }}
              </el-tag>
            </div>
          </el-popover>
        </template>
        <template
          v-else
        >
          <el-tag
            v-for="label in modelLabels"
            :key="label"
            type="info"
            :disable-transitions="true"
          >
            {{ label }}
          </el-tag>
        </template>
      </div>
    </template>
  </div>
  <div
    v-else
    un-flex="~ gap-1 wrap"
    un-items-center
    un-b="1 solid [var(--el-border-color)]"
    un-p="x-2.5 y-1.25"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-8"
    un-line-height="normal"
    un-break-words
    class="custom_select_readonly"
    :class="{
      'custom_select_placeholder': shouldShowPlaceholder,
      'custom_select_isShowModelLabel': isShowModelLabel && inited,
    }"
    v-bind="$attrs"
  >
    <template
      v-if="!modelLabels[0]"
    >
      <span
        v-if="isShowModelLabel && props.modelLabel"
        class="custom_select_readonly"
      >
        {{ props.modelLabel || "" }}
      </span>
      <span
        v-else
        class="custom_select_placeholder"
      >
        {{ props.readonlyPlaceholder ?? "" }}
      </span>
    </template>
    <template
      v-else
    >
      <span
        v-if="isShowModelLabel"
        class="custom_select_readonly"
      >
        {{ props.modelLabel || "" }}
      </span>
      <span
        v-else
        class="custom_select_readonly"
      >
        {{ modelLabels[0] || "" }}
      </span>
    </template>
  </div>
</template>
</template>

<script lang="ts" setup>
import type {
  OptionType,
} from "element-plus/es/components/select-v2/src/select.types";

import {
  copyText,
} from "@/utils/common";

const t = getCurrentInstance();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "data", value: any[]): void;
  (e: "update:modelValue", value?: string | string[] | null): void;
  (e: "update:modelLabel", value?: string | null): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value?: any | any[] | null): void;
  (e: "clear"): void;
}>();

const {
  ns,
  nsAsync,
  initSysI18ns,
} = useI18n();

let inited = $ref(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OptionsMap = (item: any) => OptionType;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let data = $ref<any[]>([ ]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let modelValueData = $ref<any[]>([ ]);

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    method: () => Promise<any[]>; // 用于获取数据的方法
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findByValues?: (value: any[]) => Promise<any[]>; // 通过value获取数据的方法
    optionsMap?: OptionsMap;
    height?: number;
    modelValue?: string | string[] | null;
    modelLabel?: string | null;
    options4SelectV2?: OptionType[];
    autoWidth?: boolean;
    maxWidth?: number;
    multiple?: boolean;
    showSelectAll?: boolean;
    init?: boolean;
    pageInited?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string | null;
    readonlyPlaceholder?: string;
    readonlyCollapseTags?: boolean;
    readonlyMaxCollapseTags?: number;
  }>(),
  {
    findByValues: undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    optionsMap: function(item: any) {
      const item2 = item as { lbl: string; id: string; };
      return {
        label: item2.lbl,
        value: item2.id,
      };
    },
    height: 400,
    options4SelectV2: () => [ ],
    modelValue: undefined,
    modelLabel: undefined,
    autoWidth: true,
    maxWidth: 550,
    multiple: false,
    showSelectAll: true,
    init: true,
    pageInited: undefined,
    disabled: undefined,
    readonly: undefined,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
    readonlyCollapseTags: true,
    readonlyMaxCollapseTags: 1,
  },
);

async function copyModelLabel() {
  const text = modelLabels.join(",");
  if (!text) {
    return;
  }
  copyText(text);
  ElMessage.success(text + " " + await nsAsync("复制成功"));
}

let modelValue = $ref(props.modelValue);

watch(
  () => [
    modelValue,
    props.findByValues,
    inited,
  ],
  async () => {
    // 通过 modelValue 获取 modelValueData
    if (!inited) {
      return;
    }
    if (!props.findByValues || !modelValue || modelValue.length === 0) {
      modelValueData = [ ];
      return;
    }
    let modelValueArr: string[] = [ ];
    if (props.multiple) {
      modelValueArr = modelValue as string[];
    } else {
      modelValueArr = [ modelValue as string ];
    }
    // 如果已经存在了, 则不用查询了
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelValueData2: any[] = [ ];
    const modelValueArr2: string[] = [ ];
    if (options4SelectV2.length > 0) {
      for (const item of modelValueArr) {
        let isExist = false;
        for (const item2 of data) {
          if (props.optionsMap(item2).value === item) {
            modelValueData2.push(item2);
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          modelValueArr2.push(item);
        }
      }
    }
    if (modelValueArr2.length > 0) {
      const data = await props.findByValues(modelValueArr2);
      modelValueData2.push(...data);
    }
    modelValueData = [ ];
    for (const item of modelValueArr) {
      modelValueData.push(modelValueData2.find((item2) => props.optionsMap(item2).value === item));
    }
  },
  {
    deep: true,
  },
);

watch(
  () => props.modelValue,
  () => {
    modelValue = props.modelValue;
  },
);

let modelLabel = $ref(props.modelLabel);

watch(
  () => props.modelLabel,
  () => {
    modelLabel = props.modelLabel;
  },
);

let readonlyCollapseTags = $ref(props.readonlyCollapseTags);

watch(
  () => props.readonlyCollapseTags,
  () => {
    readonlyCollapseTags = props.readonlyCollapseTags;
  },
);

const selectRef = $ref<InstanceType<typeof ElSelectV2>>();
const selectDivRef = $ref<HTMLDivElement>();

const isSelectAll = $computed({
  get() {
    if (!modelValue) {
      return false;
    }
    if (!Array.isArray(modelValue)) {
      return false;
    }
    if (modelValue.length === 0) {
      return false;
    }
    if (selectRef?.filteredOptions && selectRef.filteredOptions.length > 0) {
      if (modelValue.length === selectRef.filteredOptions.length) {
        return true;
      }
    }
    if (modelValue.length === options4SelectV2.length) {
      return true;
    }
    return false;
  },
  set(val: boolean) {
    if (val) {
      if (selectRef?.filteredOptions) {
        modelValue = selectRef.filteredOptions.map((item: OptionType) => item.value);
      } else {
        modelValue = options4SelectV2.map((item) => item.value);
      }
    } else {
      modelValue = [ ];
    }
    emit("update:modelValue", modelValue);
    const models = getModelsByValue();
    emit("change", models);
  },
});

const isIndeterminate = $computed(() => {
  if (!modelValue) {
    return false;
  }
  if (!Array.isArray(modelValue)) {
    return false;
  }
  if (modelValue.length === 0) {
    return false;
  }
  if (selectRef?.filteredOptions && selectRef.filteredOptions.length > 0) {
    if (modelValue.length === selectRef.filteredOptions.length) {
      return false;
    }
  }
  if (modelValue.length === options4SelectV2.length) {
    return false;
  }
  return true;
});

const modelValueComputed = $computed(() => {
  if (!modelLabel) {
    return modelValue;
  }
  if (!props.multiple) {
    if (modelValue == null || modelValue === "") {
      return modelLabel;
    }
    const item = options4SelectV2.find((item: OptionType) => item.value === modelValue);
    if (!item || item.label !== modelLabel) {
      return modelLabel;
    }
    return modelValue;
  } else {
    if (modelValue == null || modelValue.length === 0) {
      return modelLabel;
    }
    const labels: string[] = modelLabel.split(",")
      .filter((item: string) => item)
      .map((item) => item.trim());
    if (labels.length !== modelValue.length) {
      return modelLabel;
    }
    for (let i = 0; i < modelValue.length; i++) {
      const item = modelValue[i];
      if (item !== labels[i]) {
        return modelLabel;
      }
    }
    return modelValue;
  }
});

const isShowModelLabel = $computed(() => {
  if (!modelLabel) {
    return false;
  }
  if (!props.multiple) {
    if (modelValue == null || modelValue === "") {
      return true;
    }
    const item = options4SelectV2.find((item: OptionType) => item.value === modelValue);
    if (!item || item.label !== modelLabel) {
      return true;
    }
    return false;
  } else {
    if (modelValue == null || modelValue.length === 0) {
      return true;
    }
    const labels: string[] = modelLabel.split(",")
      .filter((item: string) => item)
      .map((item) => item.trim());
    if (labels.length !== modelValue.length) {
      return true;
    }
    for (let i = 0; i < modelValue.length; i++) {
      const item = modelValue[i];
      if (item !== labels[i]) {
        return true;
      }
    }
    return false;
  }
});

// 通过id获取modelLabel
function getModelLabelById() {
  if (!props.multiple) {
    const id = modelValue;
    if (!id) {
      return "";
    }
    const item = options4SelectV2.find((item: OptionType) => item.value === id);
    if (!item) {
      return "";
    }
    return item.label;
  }
  const labels: string[] = [ ];
  const modelValues = (modelValue || [ ]) as string[];
  for (const value of modelValues) {
    const item = options4SelectV2.find((item: OptionType) => item.value === value);
    if (!item) {
      continue;
    }
    labels.push(item.label);
  }
  return labels.join(",");
}

function refreshModelLabel() {
  modelLabel = getModelLabelById();
  emit("update:modelLabel", modelLabel);
}

const shouldShowPlaceholder = $computed(() => {
  if (props.multiple) {
    return modelValue == null || modelValue.length === 0;
  }
  return modelValue == null || modelValue === "";
});

function modelValueUpdate(value?: string | string[] | null) {
  nextTick(() => {
    modelLabel = undefined;
  });
  modelValue = value;
  emit("update:modelValue", value);
  if (!props.multiple) {
    emit("update:modelLabel", modelLabels[0]);
  } else {
    if (Array.isArray(modelLabels)) {
      emit("update:modelLabel", modelLabels.join(","));
    } else {
      emit("update:modelLabel", "");
    }
  }
}

const modelLabels: string[] = $computed(() => {
  if (!modelValue) {
    return [ "" ];
  }
  if (!props.multiple) {
    const model = data.find((item) => props.optionsMap(item).value === modelValue);
    if (!model) {
      return [ "" ];
    }
    return [ props.optionsMap(model).label || "" ];
  }
  const labels: string[] = [ ];
  const modelValues = (modelValue || [ ]) as string[];
  for (const value of modelValues) {
    const model = data.find((item) => props.optionsMap(item).value === value);
    if (!model) {
      continue;
    }
    labels.push(props.optionsMap(model).label || "");
  }
  return labels;
});

function onClear() {
  if (!props.multiple) {
    modelValue = "";
    emit("update:modelValue", modelValue);
    emit("update:modelLabel", "");
    emit("change", undefined);
    emit("clear");
    return;
  }
  modelValue = [ ];
  emit("update:modelValue", modelValue);
  emit("update:modelLabel", "");
  emit("change", [ ]);
  emit("clear");
}

let options4SelectV2 = $shallowRef<OptionType[]>(props.options4SelectV2);

// watch(
//   () => options4SelectV2,
//   async () => {
//     const oldModelValue = modelValue;
//     modelValue = undefined;
//     await nextTick();
//     modelValue = oldModelValue;
//   },
// );

const options4SelectV2Compt = $computed(() => {
  if (modelValueData.length === 0) {
    return options4SelectV2;
  }
  const modelValueDataFilter = modelValueData.filter((item) => {
    return !options4SelectV2.find((item2) => item2.value === props.optionsMap(item).value);
  });
  if (modelValueDataFilter.length === 0) {
    return options4SelectV2;
  }
  return [
    ...modelValueDataFilter.map(props.optionsMap),
    ...options4SelectV2,
  ];
});

async function refreshDropdownWidth() {
  if (!props.autoWidth) {
    return;
  }
  if (!t || !t.proxy || !t.proxy.$el) {
    return;
  }
  await nextTick();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectRef = t.refs.selectRef as any;
  if (!selectRef) {
    return;
  }
  const dropdownListEl = selectRef?.$refs?.menuRef?.listRef?.windowRef;
  if (!dropdownListEl) {
    return;
  }
  dropdownListEl.style.minWidth = "unset";
  const optionItemEls = dropdownListEl.querySelectorAll(".el-select-dropdown__item");
  if (!optionItemEls || optionItemEls.length === 0) {
    return;
  }
  
  const popperWidth = parseInt(dropdownListEl.style.width);
  if (!popperWidth) {
    return;
  }
  let maxWidth = 0;
  for (let i = 0; i < optionItemEls.length; i++) {
    const item = optionItemEls[i];
    const width = item.scrollWidth;
    if (width > maxWidth) {
      maxWidth = width;
    }
  }
  if (maxWidth > popperWidth) {
    dropdownListEl.closest(".el-select-dropdown").style.minWidth = `${ (maxWidth + 56) }px`;
    dropdownListEl.style.minWidth = `${ (maxWidth + 56) }px`;
  }
}

watch(
  () => [ selectRef?.filteredOptions.length, inited ],
  async () => {
    if (!inited) {
      return;
    }
    if (!selectRef || selectRef.filteredOptions.length === 0) {
      return;
    }
    await refreshDropdownWidth();
  },
);

function handleVisibleChange(visible: boolean) {
  if (visible) {
    refreshDropdownWidth();
  }
}

async function onRefresh() {
  const method = props.method;
  if (!method) {
    if (!options4SelectV2 || options4SelectV2.length === 0) {
      inited = false;
    } else {
      inited = true;
    }
    return;
  }
  if (!options4SelectV2 || options4SelectV2.length === 0) {
    inited = false;
  } else {
    inited = true;
  }
  await nextTick();
  data = await method();
  options4SelectV2 = data.map(props.optionsMap);
  inited = true;
  emit("data", data);
}

function onValueChange() {
  const models = getModelsByValue();
  emit("change", models);
}

function findModelById(id: string) {
  return data.find((item) => props.optionsMap(item).value === id);
}

function getModelsByValue() {
  if (!props.multiple) {
    return findModelById(modelValue as string);
  }
  const modelValues = (modelValue || [ ]) as string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const models: any[] = [ ];
  for (const id of modelValues) {
    const model = findModelById(id);
    if (model) {
      models.push(model);
    }
  }
  return models;
}

async function refreshWrapperHeight() {
  await new Promise((resolve) => setTimeout(resolve, 0));
  if (!selectDivRef) {
    return;
  }
  const phder = selectDivRef?.querySelector(".el-select__placeholder") as HTMLDivElement | null | undefined;
  if (!phder) {
    return;
  }
  const wrapper = selectDivRef?.querySelector(".el-select__wrapper") as HTMLDivElement | null | undefined;
  if (!wrapper) {
    return;
  }
  const height = phder.offsetHeight;
  if (height === 0) {
    return;
  }
  wrapper.style.transition = "none";
  wrapper.style.minHeight = `${ (height + 8) }px`;
}

watch(
  () => [
    modelValue,
    inited,
    !props.multiple,
    options4SelectV2.length > 0,
    props.readonly,
  ],
  () => {
    refreshWrapperHeight();
  },
);

if (props.init) {
  onRefresh();
}

async function initFrame() {
  const codes = [
    "全选",
  ];
  await initSysI18ns(codes);
}

initFrame();

onMounted(() => {
  refreshWrapperHeight();
});

function focus() {
  selectRef?.focus();
}

function blur() {
  selectRef?.blur();
}

defineExpose({
  refresh: onRefresh,
  refreshModelLabel,
  focus,
  blur,
});
</script>

<style lang="scss">
.custom_select_isShowModelLabel {
  .el-select__placeholder,.custom_select_readonly {
    color: red;
  }
}
</style>

<style scoped lang="scss">
.custom_select_div,.custom_select_readonly {
  :deep(.el-tag) {
    height: auto;
    line-height: normal;
    padding-top: 2px;
    padding-bottom: 2px;
    box-sizing: border-box;
    .el-tag__content {
      white-space: normal;
      .el-select__tags-text {
        white-space: normal;
      }
    }
  }
}
.custom_select_placeholder {
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--el-text-color-secondary);
}
.custom_select_space_normal {
  :deep(.el-select__placeholder) {
    height: auto;
    line-height: normal;
    white-space: normal;
    top: calc(50% - 1px);
  }
}
</style>
