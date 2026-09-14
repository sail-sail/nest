<template>
<div
  v-if="readonly !== true"
  ref="selectDivRef"
  un-w="full"
  class="custom_select_div"
  :class="{
    'dictbiz_select_isShowModelLabel': isShowModelLabel && inited,
  }"
>
  <ElSelectV2
    ref="selectRef"
    :model-value="modelValueComputed"
    :options="options4SelectV2"
    filterable
    collapse-tags
    collapse-tags-tooltip
    default-first-option
    :height="props.height"
    un-w="full"
    v-bind="$attrs"
    :loading="!inited"
    class="dictbiz_select"
    :class="{
      'dictbiz_select_isShowModelLabel': isShowModelLabel && inited,
    }"
    :multiple="props.multiple"
    :clearable="!props.disabled"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :placeholder="((isShowModelLabel && props.multiple) ? props.modelLabel : props.placeholder) ?? undefined"
    :fit-input-width="fitInputWidth"
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
      v-if="props.hasSelectAdd && !props.disabled && !props.readonly"
      #footer
    >
      <div
        un-flex="~"
        un-justify-center
      >
        <el-button
          plain
          @click="openAddDialog"
        >
          {{ ns("新增选项") }}
        </el-button>
      </div>
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
    un-b="1 solid [var(--el-border-color)]"
    un-p="x-2"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-8"
    un-break-all
    class="dictbiz_select_readonly"
    :class="{
      'custom_select_placeholder': shouldShowPlaceholder,
      'dictbiz_select_isShowModelLabel': isShowModelLabel && inited,
    }"
    v-bind="$attrs"
  >
    <template
      v-if="modelLabels.length === 0"
    >
      <span
        class="dictbiz_select_placeholder"
      >
        {{ props.readonlyPlaceholder ?? "" }}
      </span>
    </template>
    <template
      v-else
    >
      <span
        v-if="isShowModelLabel"
        class="dictbiz_select_readonly"
      >
        {{ props.modelLabel || "" }}
      </span>
      <div
        v-else
        un-flex="~ wrap"
        un-gap="x-1 y-1"
        un-m="y-1"
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
          <el-tooltip
            v-if="modelLabels.length > props.readonlyMaxCollapseTags"
          >
            <el-tag
              type="info"
              :disable-transitions="true"
              un-cursor-pointer
              @click="() => readonlyCollapseTags = false"
            >
              {{ `+${ modelLabels.length - props.readonlyMaxCollapseTags }` }}
            </el-tag>
            <template
              #content
            >
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
            </template>
          </el-tooltip>
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
    un-flex="~ wrap"
    un-items="center"
    un-b="1 solid [var(--el-border-color)]"
    un-p="x-2.75 y-1"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-8"
    un-break-all
    class="dictbiz_select_readonly"
    :class="{
      'dictbiz_select_placeholder': shouldShowPlaceholder,
      'dictbiz_select_isShowModelLabel': isShowModelLabel && inited,
    }"
    v-bind="$attrs"
  >
    <template
      v-if="!modelLabels[0]"
    >
      <span
        class="dictbiz_select_placeholder"
        un-relative
      >
        {{ props.readonlyPlaceholder ?? "" }}
      </span>
    </template>
    <template
      v-else
    >
      <span
        v-if="isShowModelLabel"
        class="dictbiz_select_readonly"
        un-relative
      >
        {{ props.modelLabel || "" }}
      </span>
      <span
        v-else
        class="dictbiz_select_readonly"
        un-relative
      >
        {{ modelLabels[0] || "" }}
      </span>
    </template>
  </div>
</template>

<DictbizDetailDialog
  ref="dictbizDetailDialogRef"
></DictbizDetailDialog>
</template>

<script lang="ts" setup>
import type {
  GetDictbiz,
} from "@/typings/types";

import type {
  OptionType,
} from "element-plus/es/components/select-v2/src/select.types";

import {
  copyText,
} from "@/utils/common";

import DictbizDetailDialog from "@/views/base/dictbiz_detail/Detail.vue";

import {
  findOneDictbiz,
} from "@/views/base/dictbiz/Api.ts";

import {
  findAllDictbizDetail,
} from "@/views/base/dictbiz_detail/Api.ts";

export type DictbizModel = GetDictbiz;

const emit = defineEmits<{
  (e: "data", value: DictbizModel[]): void;
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "update:modelValue", value?: any): void;
  (e: "update:modelLabel", value?: string | null): void;
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value?: any): void;
  (e: "clear"): void;
}>();

type OptionsMap = (item: DictbizModel) => OptionType;

const props = withDefaults(
  defineProps<{
    code: string;
    optionsMap?: OptionsMap;
    height?: number;
    // oxlint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue?: any;
    modelLabel?: string | null;
    autoWidth?: boolean;
    maxWidth?: number;
    multiple?: boolean;
    showSelectAll?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string | null;
    readonlyPlaceholder?: string;
    readonlyCollapseTags?: boolean;
    readonlyMaxCollapseTags?: number;
    hasSelectAdd?: boolean;
    pageInited?: boolean;
    dirtyKey?: string | string[];
  }>(),
  {
    optionsMap: function(item: DictbizModel) {
      if ([ "number", "time", "boolean" ].includes(item.type)) {
        return {
          label: item.lbl,
          value: Number(item.val),
        };
      }
      return {
        label: item.lbl,
        value: item.val,
      };
    },
    height: 400,
    modelValue: undefined,
    modelLabel: undefined,
    autoWidth: true,
    maxWidth: 550,
    multiple: false,
    showSelectAll: true,
    disabled: undefined,
    readonly: undefined,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
    readonlyCollapseTags: true,
    readonlyMaxCollapseTags: 1,
    hasSelectAdd: false,
    pageInited: undefined,
    dirtyKey: "业务字典",
  },
);

function isEmptySelectValue(value: unknown): boolean {
  if (value == null) {
    return true;
  }
  if (typeof value === "string") {
    return value === "";
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
}

async function copyModelLabel() {
  const text = modelLabels.join(",");
  if (!text) {
    return;
  }
  copyText(text);
  ElMessage.success(text + " " + await nsAsync("复制成功"));
}

let inited = $ref(false);

let modelValue = $ref(props.modelValue);

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

watch(
  () => props.pageInited,
  async (value, oldValue) => {
    if (value === true && oldValue === false) {
      await onRefresh();
    }
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
    if (isEmptySelectValue(modelValue)) {
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
  if (isEmptySelectValue(modelValue)) {
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
    if (isEmptySelectValue(modelValue)) {
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
  if (modelLabel == null) {
    return false;
  }
  return modelValueComputed === modelLabel;
});

const shouldShowPlaceholder = $computed(() => {
  if (props.multiple) {
    return isEmptySelectValue(modelValue);
  }
  return isEmptySelectValue(modelValue);
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

function onValueChange() {
  emit("update:modelValue", modelValue);
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
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  const models: any[] = [ ];
  for (const id of modelValues) {
    const model = findModelById(id);
    if (model) {
      models.push(model);
    }
  }
  return models;
}

let options4SelectV2 = $shallowRef<OptionType[]>([ ]);
let fitInputWidth = $ref<number | boolean>(true);

const dropdownWidthPadding = 56;

const textMeasureCanvas = typeof document === "undefined"
  ? undefined
  : document.createElement("canvas");

const textMeasureContext = textMeasureCanvas?.getContext("2d") ?? null;

function getFallbackTextWidth(textContent: string) {
  const text = textContent.replace(/[\u0391-\uFFE5]/g, "aa");
  const upperCaseSize = text.match(/[A-Z]/g)?.length || 0;
  return (text.length - upperCaseSize) * 8 + upperCaseSize * 10.5;
}

function getDropdownMeasureFont() {
  if (typeof window === "undefined" || !selectDivRef) {
    return undefined;
  }
  const wrapper = selectDivRef.querySelector(".el-select__wrapper") as HTMLDivElement | null | undefined;
  const styleTarget = wrapper ?? selectDivRef;
  const style = window.getComputedStyle(styleTarget);
  if (style.font) {
    return style.font;
  }
  return `${ style.fontStyle } ${ style.fontVariant } ${ style.fontWeight } ${ style.fontSize } / ${ style.lineHeight } ${ style.fontFamily }`;
}

function measureTextWidth(text: string, font?: string) {
  if (!text) {
    return 0;
  }
  if (textMeasureContext && font) {
    textMeasureContext.font = font;
    return Math.ceil(textMeasureContext.measureText(text).width);
  }
  return Math.ceil(getFallbackTextWidth(text));
}

function getFitInputWidthLimit(width: number) {
  if (!Number.isFinite(width) || width <= 0) {
    return undefined;
  }
  const normalizedWidth = Math.ceil(width);
  if (props.maxWidth != null && props.maxWidth > 0) {
    return Math.min(normalizedWidth, props.maxWidth);
  }
  return normalizedWidth;
}

function getSelectInputWidth() {
  if (!selectDivRef) {
    return 0;
  }
  const wrapper = selectDivRef.querySelector(".el-select__wrapper") as HTMLDivElement | null | undefined;
  const width = wrapper?.getBoundingClientRect().width ?? selectDivRef.getBoundingClientRect().width;
  return Math.ceil(width || 0);
}

function getDropdownMeasureTexts() {
  const texts = options4SelectV2
    .map((item) => item.label == null ? "" : String(item.label))
    .filter((item) => item);
  if (props.multiple && props.showSelectAll && !props.disabled && !props.readonly && options4SelectV2.length > 0) {
    texts.push(`(${ ns("全选") })`);
  }
  if (props.hasSelectAdd && !props.disabled && !props.readonly) {
    texts.push(ns("新增选项"));
  }
  return texts;
}

async function refreshFitInputWidth() {
  if (!props.autoWidth) {
    fitInputWidth = true;
    return;
  }
  await nextTick();
  const font = getDropdownMeasureFont();
  const measureTexts = getDropdownMeasureTexts();
  let maxTextWidth = 0;
  for (const text of measureTexts) {
    const textWidth = measureTextWidth(text, font);
    if (textWidth > maxTextWidth) {
      maxTextWidth = textWidth;
    }
  }
  const inputWidth = getSelectInputWidth();
  const estimatedWidth = maxTextWidth > 0 ? (maxTextWidth + dropdownWidthPadding) : 0;
  fitInputWidth = getFitInputWidthLimit(Math.max(inputWidth, estimatedWidth)) ?? true;
}

let data = $ref<DictbizModel[]>([ ]);

const {
  ns,
  nsAsync,
  initSysI18ns,
} = useI18n();

const dirtyStore = useDirtyStore();

const modelLabels: string[] = $computed(() => {
  if (isEmptySelectValue(modelValue) && modelValue !== 0) {
    return [ "" ];
  }
  if (!props.multiple) {
    const model = data.find((item) => modelValue != null && String(props.optionsMap(item).value) === String(modelValue));
    if (!model) {
      return [ "" ];
    }
    return [ props.optionsMap(model).label || "" ];
  }
  const labels: string[] = [ ];
  const modelValues = (modelValue || [ ]) as string[];
  for (const value of modelValues) {
    const model = data.find((item) => value != null && String(props.optionsMap(item).value) === String(value));
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

let dirtyWatchHandles: Array<() => void> = [ ];

function getDirtyKeys() {
  if (!props.dirtyKey) {
    return [ ];
  }
  const dirtyKey = Array.isArray(props.dirtyKey)
    ? props.dirtyKey
    : [ props.dirtyKey ];
  return dirtyKey.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function resetDirtyWatch() {
  for (const stopDirtyWatch of dirtyWatchHandles) {
    stopDirtyWatch();
  }
  dirtyWatchHandles = [ ];
  for (const dirtyKey of getDirtyKeys()) {
    dirtyWatchHandles.push(
      dirtyStore.onDirty(async () => {
        await onRefresh();
      }, dirtyKey, false),
    );
  }
}

watch(
  () => props.dirtyKey,
  () => {
    resetDirtyWatch();
  },
  {
    deep: true,
    immediate: true,
  },
);

async function onRefresh() {
  const code = props.code;
  if (!code) {
    inited = false;
    data = [ ];
    fitInputWidth = true;
    return;
  }
  inited = false;
  await nextTick();
  [ data ] = await getDictbiz([ code ]);
  options4SelectV2 = data.map(props.optionsMap);
  inited = true;
  emit("data", data);
  await refreshFitInputWidth();
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
  ],
  () => {
    refreshWrapperHeight();
  },
);

watch(
  () => [
    props.autoWidth,
    props.maxWidth,
    props.multiple,
    props.showSelectAll,
    props.disabled,
    props.readonly,
    props.hasSelectAdd,
  ],
  async () => {
    await refreshFitInputWidth();
  },
);

watch(
  () => props.code,
  async () => {
    await onRefresh();
  },
);

useResizeObserver($$(selectDivRef), async function() {
  await refreshFitInputWidth();
});

const dictbizDetailDialogRef = $(useTemplateRef("dictbizDetailDialogRef"));

/**
 * 打开新增选项对话框
 */
async function openAddDialog() {
  if (!dictbizDetailDialogRef) {
    return;
  }
  const code = props.code;
  if (!code) {
    return;
  }
  const dictbiz_model = await findOneDictbiz({
    code,
  });
  if (!dictbiz_model) {
    ElMessage.error(await nsAsync("系统字典 {0} 不存在", code));
    return;
  }
  const dictbiz_id = dictbiz_model.id;
  const {
    changedIds,
  } = await dictbizDetailDialogRef.showDialog({
    title: await nsAsync("新增选项"),
    action: "add",
    builtInModel: {
      dictbiz_id,
    },
  });
  if (changedIds.length === 0) {
    return;
  }
  await onRefresh();
  const dict_detail_models = await findAllDictbizDetail({
    ids: changedIds,
  });
  const vals = changedIds
    .map((item) => dict_detail_models.find((item2) => item2.id === item)?.val)
    .filter((item) => item);
  if (props.multiple) {
    modelValue = [ ...modelValue, ...vals ];
  } else {
    modelValue = vals[0];
  }
}

async function initFrame() {
  const codes = [
    "全选",
    "新增选项"
  ];
  await initSysI18ns(codes);
  await refreshFitInputWidth();
}

initFrame();
onRefresh();

onMounted(async function() {
  await refreshFitInputWidth();
});

onUnmounted(() => {
  for (const stopDirtyWatch of dirtyWatchHandles) {
    stopDirtyWatch();
  }
  dirtyWatchHandles = [ ];
});

function focus() {
  selectRef?.focus();
}

function blur() {
  selectRef?.blur();
}

defineExpose({
  refresh: onRefresh,
  focus,
  blur,
});
</script>

<style scoped lang="scss">
.custom_select_div,.custom_select_readonly {
  :deep(.el-tag) {
    height: auto;
    line-height: normal;
    padding-top: 3px;
    padding-bottom: 3px;
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
.dictbiz_select_space_normal {
  height: auto;
  :deep(.el-select__placeholder) {
    line-height: normal;
    white-space: normal;
    top: calc(50% - 2px);
  }
}
.dictbiz_select_isShowModelLabel {
  :deep(.el-select__placeholder),.dictbiz_select_readonly {
    color: red;
  }
}
</style>

