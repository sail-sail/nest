<template>
<div
  un-flex="~"
  un-items-center
  un-w="full"
  un-h="8"
  class="custom_icon"
  :class="{
    'custom_icon_readonly': !!props.readonly,
    'custom_icon_align_left': props.align === 'left',
    'custom_icon_align_center': props.align === 'center',
    'custom_icon_align_right': props.align === 'right',
  }"
>
  <div
    ref="wrapDivRef"
    class="custom_icon_inner"
    un-b="1 solid [var(--el-border-color)] hover:[var(--el-border-color-hover)] focus-visible:[var(--el-color-primary)]"
    un-outline="none"
    un-transition="border-color 0.3s"
    un-cursor="pointer"
    un-rounded
    un-flex="~"
    un-items-center
    un-justify-center
    un-h="full"
    un-aspect="square"
    un-p=".5"
    un-box-border
    un-relative
    tabindex="0"
    :style="{
      cursor: (modelLabel || !props.readonly) ? 'pointer' : 'default',
    }"
    @click="onIcon"
    @keydown.enter="onIcon"
  >
    
    <div
      v-if="showDeleteButton"
      un-absolute
      un-top="-2"
      un-right="-2"
      un-z="2"
      un-rounded-full
      un-bg="hover:red"
      un-text="red hover:white"
      un-border-none
      un-cursor="pointer"
      :aria-label="ns('删除图标')"
      @click.stop="onDelete"
      @keydown.enter.stop.prevent="onDelete"
    >
      <div
        un-i="iconfont-close"
      ></div>
    </div>
    
    <div
      v-if="modelLabel && useMaskMode"
      :style="{
        'mask-image': `url('${ modelLabel }')`,
        '-webkit-mask-image': `url('${ modelLabel }')`,
      }"
      class="iconfont"
    ></div>
    <div
      v-else-if="modelLabel"
      un-flex="~ col"
      un-items-center
      un-justify-center
      un-w="full"
    >
      <img
        :src="modelLabel"
        un-w="full"
        un-aspect="square"
        un-rounded="sm"
      >
    </div>
    <div
      v-else-if="props.pageInited"
      un-flex="~ col"
      un-items-center
      un-justify-center
      style="color: var(--readonly_font_color)"
    >
      {{ ns("(无)") }}
    </div>
  </div>
  
  <CustomIconSelect
    ref="customIconSelectRef"
  ></CustomIconSelect>
  
  <ElImageViewer
    v-if="props.isPreview !== false && showViewer"
    :teleported="true"
    :url-list="urlList"
    :hide-on-click-modal="true"
    :initial-index="0"
    :close-on-press-escape="true"
    @close="showViewer = false"
  >
    
    <template
      #viewer-error="{ src }"
    >
      <div
        un-flex="~"
        un-items-center
        un-justify-center
        un-w="full"
        un-h="full"
        :style="{
          'mask-image': `url('${ src }')`,
        }"
        @click="isSvg && (showViewer = false)"
      >
        
        <!-- oxlint-disable vue/no-v-html -->
        <div
          class="el-icon custom_icon_viewer"
          un-w="full"
          un-h="full"
          v-html="src"  
        >
        </div>
        
      </div>
    </template>
    
    <template
      v-if="isSvg"
      #toolbar
    >
      <div
        class="custom_icon_toolbar"
      ></div>
    </template>
    
  </ElImageViewer>
  
</div>
</template>

<script setup lang="ts">
import {
  useFormItem,
} from "element-plus";

import {
  decodeSvgDataUri,
  isSvgDataUri,
  shouldMaskSvg,
} from "@/utils/svg_icon.ts";

import CustomIconSelect from "./CustomIconSelect.vue";

const emit = defineEmits<{
  (e: "change", value: { id: string, lbl: string }): void,
}>();

const props = withDefaults(
  defineProps<{
    align?: "left" | "center" | "right";
    readonly?: boolean;
    validateEvent?: boolean;
    pageInited?: boolean;
    isPreview?: boolean;
  }>(),
  {
    align: undefined,
    readonly: undefined,
    validateEvent: undefined,
    pageInited: undefined,
    isPreview: undefined,
  },
);

const {
  ns,
  nsAsync,
  initSysI18ns,
} = useI18n();

const {
  formItem,
} = useFormItem();


const modelValue = defineModel<string | null>();

const modelLabel = defineModel<string | null>("modelLabel");

watch(
  modelLabel,
  async () => {
    if (props.validateEvent !== false && !props.readonly) {
     try {
        await formItem?.validate("change");
      } catch (err) { /* empty */ }
    } else {
      formItem?.clearValidate();
    }
  },
);

const showViewer = ref(false);

const isSvg = computed(() => {
  return isSvgDataUri(modelLabel.value);
});

const useMaskMode = computed(() => {
  return shouldMaskSvg(modelLabel.value);
});

const showDeleteButton = computed(() => {
  return !props.readonly && !!modelLabel.value;
});

const urlList = computed(() => {
  const list: string[] = [ ];
  if (modelLabel.value) {
    if (isSvg.value && useMaskMode.value) {
      const svgStr = decodeSvgDataUri(modelLabel.value);
      if (svgStr) {
        list.push(svgStr);
        return list;
      }
    }
    list.push(modelLabel.value);
  }
  return list;
});

const wrapDivRef = $(useTemplateRef("wrapDivRef"));
const customIconSelectRef = $(useTemplateRef("customIconSelectRef"));

async function onIcon(e: KeyboardEvent | MouseEvent) {
  e.preventDefault();
  if (e.ctrlKey || e.metaKey || e.shiftKey) {
    return;
  }
  if (!modelLabel.value && props.readonly) {
    return;
  }
  if (props.readonly) {
    if (props.isPreview !== false) {
      showViewer.value = true;
    }
    return;
  }
  if (!customIconSelectRef) {
    return;
  }
  const {
    type,
    changedId,
    changedIdLbl,
  } = await customIconSelectRef.showDialog({
    title: await nsAsync("选择图标"),
    model: {
      id: modelValue.value,
      lbl: modelLabel.value,
    },
  });
  wrapDivRef?.focus();
  if (type === "cancel") {
    return;
  }
  modelLabel.value = changedIdLbl;
  modelValue.value = changedId;
  emit("change", { id: changedId!, lbl: changedIdLbl! });
}

async function onDelete(e: KeyboardEvent | MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  if (props.readonly || !modelLabel.value) {
    return;
  }
  modelLabel.value = "";
  modelValue.value = "";
  emit("change", { id: "", lbl: "" });
  wrapDivRef?.focus();
}

async function initFrame() {
  await initSysI18ns([
    "(无)",
    "选择图标",
    "删除图标",
  ]);
}

initFrame();
</script>

<style scoped lang="scss">
.iconfont {
  // -webkit-mask: var(--un-icon) no-repeat;
  // mask-image: var(--un-icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  background-color: currentColor;
  // color: inherit;
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  height: 100%;
  color: var(--el-text-color-regular);
}
.custom_icon_align_left {
  justify-content: flex-start;
}
.custom_icon_align_center {
  justify-content: center;
}
.custom_icon_align_right {
  justify-content: flex-end;
}
</style>
