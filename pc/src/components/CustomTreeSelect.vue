<template>
<el-tree-select
  v-if="readonly !== true"
  :model-value="modelValueComputed"
  filterable
  collapse-tags
  collapse-tags-tooltip
  default-first-option
  :height="props.height"
  class="custom_tree_select"
  :class="{
    hideDisabledCheckbox: props.hideDisabledCheckbox,
    'custom_select_isShowModelLabel': isShowModelLabel && inited,
  }"
  node-key="id"
  vaule-key="id"
  :props="props.props"
  :multiple="props.multiple"
  :data="data"
  :check-strictly="true"
  :default-expand-all="true"
  :show-checkbox="true"
  :check-on-click-node="true"
  un-w="full"
  v-bind="$attrs"
  :loading="!inited"
  :clearable="!props.disabled"
  @keyup.enter.stop
  @clear="onClear"
  @update:model-value="modelValueUpdate"
  @change="onChange"
  @check-change="onCheck"
  @node-click="onNodeClick"
  @keydown.ctrl.c.stop="copyModelLabel"
  @keyup.ctrl.delete.stop="onClear"
  @keyup.ctrl.backspace.stop="onClear"
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
</el-tree-select>
<template
  v-else
>
  <div
    v-if="props.multiple"
    un-flex="~ gap-1 wrap"
    un-b="1 solid [var(--el-border-color)]"
    un-p="y-0.75 x-1.5"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-8"
    un-line-height="normal"
    un-break-all
    class="custom_tree_select_readonly"
    :class="{
      'custom_select_isShowModelLabel': isShowModelLabel && inited,
    }"
    v-bind="$attrs"
  >
    <template
      v-if="modelLabels.length === 0 || modelLabels.every((item) => !item)"
    >
      <span
        v-if="isShowModelLabel && props.modelLabel"
      >
        {{ props.modelLabel || "" }}
      </span>
    </template>
    <template
      v-else
    >
      <span
        v-if="isShowModelLabel"
      >
        {{ props.modelLabel || "" }}
      </span>
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
    </template>
  </div>
  <div
    v-else
    un-b="1 solid [var(--el-border-color)]"
    un-p="x-2.5 y-1"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-8"
    un-line-height="normal"
    un-break-all
    class="custom_select_readonly"
    :class="{
      'custom_select_isShowModelLabel': isShowModelLabel && inited,
    }"
    v-bind="$attrs"
  >
    <template
      v-if="!modelLabels[0]"
    >
      <span
        v-if="isShowModelLabel && props.modelLabel"
      >
        {{ props.modelLabel || "" }}
      </span>
    </template>
    <template
      v-else
    >
      <span
        v-if="isShowModelLabel"
      >
        {{ props.modelLabel || "" }}
      </span>
      <span
        v-else
      >
        {{ modelLabels[0] || "" }}
      </span>
    </template>
  </div>
</template>
</template>

<script lang="ts" setup>
import type {
  TreeNode,
} from "element-plus";

import type {
  TreeOptionProps,
} from "element-plus/es/components/tree/src/tree.type";

import type {
  ExtractPropTypes,
} from "vue";

import {
  copyText,
} from "@/utils/common";

const emit = defineEmits<{
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "data", value: any[]): void;
  (e: "update:modelValue", value?: string | string[] | null): void;
  (e: "update:modelLabel", value?: string | null): void;
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value?: any | any[] | null): void;
  (e: "clear"): void;
}>();

const props = withDefaults(
  defineProps<{
    // oxlint-disable-next-line @typescript-eslint/no-explicit-any
    method: () => Promise<any[]>; // 用于获取数据的方法
    height?: number;
    // oxlint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue?: any | any[] | null;
    modelLabel?: string | null;
    autoWidth?: boolean;
    maxWidth?: number;
    multiple?: boolean;
    init?: boolean;
    pageInited?: boolean;
    props?: ExtractPropTypes<TreeOptionProps>;
    disabled?: boolean;
    readonly?: boolean;
    hideDisabledCheckbox?: boolean;
  }>(),
  {
    height: 400,
    modelValue: undefined,
    modelLabel: undefined,
    autoWidth: true,
    maxWidth: 550,
    multiple: false,
    init: true,
    pageInited: undefined,
    props: () => ({
      label: 'lbl',
      children: 'children',
    }),
    disabled: undefined,
    readonly: undefined,
    hideDisabledCheckbox: true,
  },
);

const {
  nsAsync,
} = useI18n();

async function copyModelLabel() {
  const text = modelLabels.join(",");
  if (!text) {
    return;
  }
  copyText(text);
  ElMessage.success(text + " " + await nsAsync("复制成功"));
}

let inited = $ref(false);

// oxlint-disable-next-line @typescript-eslint/no-explicit-any
let data = $ref<any[]>([ ]);

let modelValue = $ref(props.modelValue);

let modelLabel = $ref(props.modelLabel);

watch(
  () => props.modelLabel,
  () => {
    modelLabel = props.modelLabel;
  },
);

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

watch(
  () => props.pageInited,
  async (value, oldValue) => {
    if (value === true && oldValue === false) {
      await onRefresh();
    }
  },
);

const isShowModelLabel = $computed(() => {
  if (!modelLabel) {
    return false;
  }
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  const labelProp = props.props.label || "label" as any;
  if (!props.multiple) {
    if (modelValue == null || modelValue === "") {
      return true;
    }
    const model = findModelById(data, modelValue as string);
    if (!model) {
      return true;
    }
    const modelLabelFromData = typeof labelProp === "string" ? model[labelProp] : labelProp(data, model);
    if (modelLabelFromData !== modelLabel) {
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

const modelValueComputed = $computed(() => {
  if (!modelLabel) {
    return modelValue;
  }
  if (!props.multiple) {
    if (modelValue == null || modelValue === "") {
      return modelLabel;
    }
    const item = findModelById(data, modelValue as string);
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

// 通过id获取modelLabel
function getModelLabelById() {
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  const labelProp = props.props.label || "label" as any;
  if (!props.multiple) {
    const id = modelValue as string;
    if (!id) {
      return "";
    }
    const model = findModelById(data, id);
    if (!model) {
      return "";
    }
    if (typeof labelProp === "string") {
      return model[labelProp] || "";
    }
    return labelProp(data, model) || "";
  }
  const labels: string[] = [ ];
  const modelValues = (modelValue || [ ]) as string[];
  for (const value of modelValues) {
    const model = findModelById(data, value);
    if (!model) {
      continue;
    }
    if (typeof labelProp === "string") {
      labels.push(model[labelProp] || "");
    } else {
      labels.push(labelProp(data, model) || "");
    }
  }
  return labels.join(",");
}

function refreshModelLabel() {
  modelLabel = getModelLabelById();
  emit("update:modelLabel", modelLabel);
}

const modelLabels: string[] = $computed(() => {
  if (!modelValue) {
    return [ "" ];
  }
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  const label = props.props.label || "label" as any;
  if (!props.multiple) {
    const model = findModelById(data, modelValue as string)!;
    if (!model) {
      return [ "" ];
    }
    if (typeof label === "string") {
      return [ model[label] || "" ];
    }
    return [ label(data, model) || "" ];
  }
  const models: string[] = [ ];
  const modelValues = (modelValue || [ ]) as string[];
  for (const id of modelValues) {
    const model = findModelById(data, id);
    if (!model) {
      models.push("");
      continue;
    }
    if (typeof label === "string") {
      models.push(model[label] || "");
      continue;
    }
    models.push(label(data, model) || "");
  }
  return models;
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

function onChange() {
  nextTick(() => {
    modelLabel = undefined;
  });
  const models = getModelsByValue();
  emit("change", models);
  if (!props.multiple) {
    emit("update:modelLabel", modelLabels[0]);
  } else {
    emit("update:modelLabel", modelLabels.filter((item) => item).join(","));
  }
}

function findModelById<
  T extends {
    id: string;
    children?: T[];
  },
>(data: T[], id: string): T | undefined {
  for (const item of data) {
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      const item2 = findModelById(item.children, id);
      if (item2) {
        return item2;
      }
    }
  }
  return;
}

function getModelsByValue() {
  if (!props.multiple) {
    return findModelById(data, modelValue as string);
  }
  const modelValues = (modelValue || [ ]) as string[];
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  const models: any[] = [ ];
  for (const id of modelValues) {
    const model = findModelById(data, id);
    if (model) {
      models.push(model);
    }
  }
  return models;
}

// oxlint-disable-next-line @typescript-eslint/no-explicit-any
function onNodeClick(data: any, node: TreeNode) {
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  let disabled = props.props.disabled as any;
  if (disabled instanceof Function) {
    disabled = disabled(data);
  }
  if (disabled) {
    return;
  }
  if (props.multiple) {
    // oxlint-disable-next-line @typescript-eslint/no-explicit-any
    const modelValueArr: any = Array.isArray(modelValue) ? modelValue : [ modelValue ];
    if (modelValueArr.includes(data.id)) {
      modelValue = modelValueArr.filter((id: string) => id !== data.id);
      emit("update:modelValue", modelValue);
      nextTick(() => {
        modelLabel = undefined;
      });
      const models = getModelsByValue();
      emit("change", models);
      emit("update:modelLabel", modelLabels.filter((item) => item).join(","));
      return;
    }
    if (modelValueArr.includes(data.id)) {
      modelValueArr.splice(modelValueArr.indexOf(data.id), 1);
    } else {
      modelValueArr.push(data.id);
    }
    modelValue = modelValueArr;
    emit("update:modelValue", modelValue);
    nextTick(() => {
      modelLabel = undefined;
    });
    const models = getModelsByValue();
    emit("change", models);
    emit("update:modelLabel", modelLabels.filter((item) => item).join(","));
  } else {
    if (modelValue === data.id) {
      modelValue = "";
    } else {
      modelValue = data.id;
    }
    emit("update:modelValue", modelValue);
    nextTick(() => {
      modelLabel = undefined;
    });
    const models = getModelsByValue();
    emit("change", models);
    emit("update:modelLabel", modelLabels[0]);
  }
}

function onCheck() {
  const models = getModelsByValue();
  emit("change", models);
}

async function onRefresh() {
  const method = props.method;
  if (!method) {
    inited = true;
    return;
  }
  data = await method();
  inited = true;
  emit("data", data);
}

if (props.init) {
  onRefresh();
}

defineExpose({
  refresh: onRefresh,
  refreshModelLabel,
});
</script>

<style lang="scss">
.custom_select_isShowModelLabel {
  .el-select__placeholder,.custom_tree_select_readonly,.custom_select_readonly {
    color: red;
  }
}
</style>

<style lang="scss" scoped>
.custom_select_isShowModelLabel {
  color: red;
}
:global(.el-select-dropdown__wrap) {
  max-height: 400px;
}
:global(.hideDisabledCheckbox .el-select-dropdown__item.is-disabled) {
  color: inherit;
  cursor: pointer;
}
:global(.hideDisabledCheckbox .el-checkbox.is-disabled) {
  display: none;
}
</style>
