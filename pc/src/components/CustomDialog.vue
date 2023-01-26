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
>
  <template #header>
    <div
      v-draggable
      class="dialog_title"
    >
      <div
        v-if="dialogTitle"
        class="title_lbl"
      >
        <span class="title_span">
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
let {
  fullscreen: isFullscreen,
  setFullscreen,
} = $(useFullscreenEfc());

let dialogVisible = $ref(false);
let dialogTitle = $ref("");
let fullscreen = $ref(true);
let dialogType = $ref<"auto" | "medium" | "large" | "default">("default");

let pointerPierce = $ref(false);

function showDialog<OnCloseResolveType>(
  arg: {
    type?: typeof dialogType;
    title?: string;
    pointerPierce?: boolean;
    fullscreen?: boolean;
  },
): {
  dialogPrm: Promise<OnCloseResolveType>;
  onCloseResolve: (arg: OnCloseResolveType) => void;
} {
  dialogVisible = true;
  dialogTitle = arg.title || "";
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
}

defineExpose({ showDialog });
</script>
