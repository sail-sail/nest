<template>
<el-dialog
  v-model="dialogVisible"
  :fullscreen="isFullscreen"
  append-to-body
  destroy-on-close
  :close-on-click-modal="false"
  class="custom_dialog"
  :class="{
    auto_dialog: dialogType === 'auto',
    medium_dialog: dialogType === 'medium',
    large_dialog: dialogType === 'large',
    pointer_pierce_dialog: pointerPierce,
  }"
  top="0"
  :before-close="beforeClose"
  v-bind="$attrs"
  :style="{ height: isFullscreen ? undefined : props.height }"
>
  <template #header>
    <div
      v-draggable
      class="dialog_title"
    >
      <div
        class="title_lbl"
      >
        <span
          v-if="dialogTitle"
          class="title_span"
        >
          {{ dialogTitle }}
        </span>
      </div>
      <ElIconFullScreen
        v-if="fullscreen"
        class="full_but"
        @click="setFullscreen"
      ></ElIconFullScreen>
    </div>
  </template>
  <slot></slot>
</el-dialog>
</template>

<script setup lang="ts">
import {
  type Ref,
} from "vue";

import {
  type WatchStopHandle,
} from "vue";

let {
  fullscreen: isFullscreen,
  setFullscreen,
} = $(useFullscreenEfc());

let dialogVisible = $ref(false);
let dialogTitle = $ref("");
let fullscreen = $ref(true);
let dialogType = $ref<"auto" | "medium" | "large" | "default">("default");

let pointerPierce = $ref(false);

watch(
  () => dialogVisible,
  () => {
    if (dialogVisible) {
      isFullscreen = false;
    }
  },
);

const props = defineProps<{
  height?: string;
}>();

let titleWatchHandle: WatchStopHandle | undefined;

function showDialog<OnCloseResolveType>(
  arg: {
    type?: typeof dialogType;
    title?: Ref<string> | string;
    pointerPierce?: boolean;
    fullscreen?: boolean;
  },
): {
  dialogPrm: Promise<OnCloseResolveType>;
  onCloseResolve: (arg: OnCloseResolveType) => void;
} {
  dialogVisible = true;
  if (isRef(arg.title)) {
    titleWatchHandle = watch(
      arg.title,
      () => {
        dialogTitle = resolveUnref(arg.title) || "";
      },
      {
        immediate: true,
      },
    );
  } else {
    dialogTitle = arg.title || "";
  }
  fullscreen = arg.fullscreen ?? true;
  dialogType = arg.type ?? "default";
  pointerPierce = arg.pointerPierce ?? false;
  let onCloseResolve: ((arg: OnCloseResolveType) => void) | undefined = undefined;
  const dialogPrm = new Promise<OnCloseResolveType>((resolve) => {
    onCloseResolve = function(arg: OnCloseResolveType) {
      dialogVisible = false;
      resolve(arg);
    };
  });
  return { dialogPrm, onCloseResolve: onCloseResolve! };
}

async function beforeClose(done: (cancel: boolean) => void) {
  done(false);
  if (titleWatchHandle) {
    titleWatchHandle();
  }
}

defineExpose({ showDialog });
</script>
