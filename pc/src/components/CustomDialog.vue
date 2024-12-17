<template>
<el-dialog
  ref="dialogRef"
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
      @dblclick="setFullscreen"
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
        <span
          v-if="dialogNotice"
          class="notice_span"
        >
          {{ dialogNotice }}
        </span>
      </div>
      <slot
        name="extra_header"
      ></slot>
      <template
        v-if="fullscreen"
      >
        <ElIconFullScreen
          v-if="!isFullscreen"
          class="full_but"
          @click="setFullscreen"
        ></ElIconFullScreen>
        <ElIconCopyDocument
          v-if="isFullscreen"
          class="full_but"
          @click="setFullscreen"
        ></ElIconCopyDocument>
      </template>
    </div>
  </template>
  <slot></slot>
</el-dialog>
</template>

<script setup lang="ts">
import type {
  Ref,
} from "vue";

import type {
  WatchStopHandle,
} from "vue";

const {
  fullscreen: isFullscreen,
  setFullscreen,
} = useFullscreenEfc();

export type CustomDialogType = "auto" | "medium" | "large" | "default";

let dialogVisible = $ref(false);
let dialogTitle = $ref("");
let dialogNotice = $ref("");
let fullscreen = $ref(true);
let dialogType = $ref<CustomDialogType>("default");

let pointerPierce = $ref(false);

const dialogRef = $ref<InstanceType<typeof ElDialog>>();

watch(
  () => dialogVisible,
  () => {
    if (dialogVisible) {
      isFullscreen.value = false;
    }
  },
);

const props = defineProps<{
  height?: string;
}>();

let titleWatchHandle: WatchStopHandle | undefined;
let noticeWatchHandle: WatchStopHandle | undefined;

function showDialog<OnCloseResolveType>(
  arg: {
    type?: typeof dialogType;
    title?: Ref<string> | string;
    notice?: Ref<string> | string;
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
  if (isRef(arg.notice)) {
    noticeWatchHandle = watch(
      arg.notice,
      () => {
        dialogNotice = resolveUnref(arg.notice) || "";
      },
      {
        immediate: true,
      },
    );
  } else {
    dialogNotice = arg.notice || "";
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
  focus();
  return { dialogPrm, onCloseResolve: onCloseResolve! };
}

async function focus() {
  const activeElement = document.activeElement;
  if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
    (activeElement as HTMLInputElement).blur();
    (activeElement as HTMLInputElement).focus();
    return;
  }
  await nextTick();
  if (!dialogRef) {
    return;
  }
  const el = dialogRef.dialogContentRef.$el as (HTMLElement | undefined);
  if (el) {
    const tableEl = el.querySelector(".el-table") as (HTMLTableElement | undefined);
    if (tableEl) {
      await nextTick();
      await nextTick();
      tableEl.focus();
    } else {
      const firstInput = el.querySelector("textarea:not([disabled]), input:not([disabled]):not([type='file']") as (HTMLInputElement | undefined);
      if (firstInput) {
        firstInput.focus();
      } else {
        el.focus();
      }
    }
  }
}

async function beforeClose(done: (cancel: boolean) => void) {
  done(false);
  if (titleWatchHandle) {
    titleWatchHandle();
  }
  if (noticeWatchHandle) {
    noticeWatchHandle();
  }
}

watch(
  () => dialogRef?.dialogContentRef?.$el,
  () => {
    if (!dialogRef?.dialogContentRef?.$el) {
      return;
    }
    const dialogEl = dialogRef.dialogContentRef.$el as HTMLElement;
    const closeBut = dialogEl.querySelector(".el-dialog__header>.el-dialog__headerbtn");
    if (closeBut) {
      closeBut.setAttribute("tabindex", "-1");
    }
  },
);

onUnmounted(() => {
  if (titleWatchHandle) {
    titleWatchHandle();
  }
  if (noticeWatchHandle) {
    noticeWatchHandle();
  }
});

defineExpose({
  showDialog,
  focus,
});
</script>
