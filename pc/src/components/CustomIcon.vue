<template>
<div
  un-flex="~"
  un-items-center
  un-w="full"
  un-h="8"
  :class="{
    'custom_icon_align_left': props.align === 'left',
    'custom_icon_align_center': props.align === 'center',
    'custom_icon_align_right': props.align === 'right',
  }"
>
  <div
    ref="wrapDivRef"
    un-b="1 solid transparent hover:[var(--el-border-color)]"
    un-transition="border-color 0.3s"
    un-rounded
    :style="{
      cursor: props.readonly ? undefined : 'pointer',
    }"
    un-flex="~"
    un-items-center
    un-justify-center
    un-h="full"
    un-aspect="square"
    un-p=".5"
    un-box-border
    tabindex="0"
    @click="onIcon"
    @keydown.enter="onIcon"
  >
    <div
      v-if="modelLbl && modelLbl.startsWith('data:image/svg+xml;')"
      :style="{
        'mask-image': `url(${ modelLbl })`,
        '-webkit-mask-image': `url(${ modelLbl })`,
      }"
      class="iconfont"
    ></div>
    <div
      v-else-if="modelLbl"
      un-flex="~ col"
      un-items-center
      un-justify-center
      un-w="full"
    >
      <img
        :src="modelLbl"
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
  ></ElImageViewer>
  
</div>
</template>

<script setup lang="ts">
import {
  useFormItem,
} from "element-plus";

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

const modelLbl = defineModel<string | null>("modelLbl");

watch(
  modelLbl,
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

const urlList = $computed(() => {
  const list: string[] = [ ];
  if (modelLbl.value) {
    list.push(modelLbl.value);
  }
  return list;
});

const wrapDivRef = $(useTemplateRef<InstanceType<typeof HTMLDivElement>>("wrapDivRef"));
const customIconSelectRef = $(useTemplateRef<InstanceType<typeof CustomIconSelect>>("customIconSelectRef"));

async function onIcon(e: KeyboardEvent | MouseEvent) {
  e.preventDefault();
  if (e.ctrlKey || e.metaKey || e.shiftKey) {
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
      lbl: modelLbl.value,
    },
  });
  wrapDivRef?.focus();
  if (type === "cancel") {
    return;
  }
  modelLbl.value = changedIdLbl;
  modelValue.value = changedId;
  emit("change", { id: changedId!, lbl: changedIdLbl! });
}

async function initFrame() {
  await initSysI18ns([
    "(无)",
    "选择图标",
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
  @apply justify-start;
}
.custom_icon_align_center {
  @apply justify-center;
}
.custom_icon_align_right {
  @apply justify-end;
}
</style>
