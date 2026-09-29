<template>
<tm-modal
  v-model:show="dialogVisible"
  :title="dialogTitle"
  :show-title="currentShowTitle"
  :show-close="currentShowClose"
  :show-footer="currentShowFooter"
  :show-cancel="currentShowCancel"
  :cancel-text="currentCancelText"
  :confirm-text="currentConfirmText"
  :overlay-click="currentCloseOnClickModal"
  :disabled-scroll="currentDisabledScroll"
  :width="currentWidth"
  :height="currentHeight"
  :max-height="currentMaxHeight"
  :content-padding="currentContentPadding"
  :btn-color="currentBtnColor"
  :bg-color="currentBgColor"
  :dark-bg-color="currentDarkBgColor"
  :custom-style="currentCustomStyle"
  :z-index="currentZIndex"
  :before-close="onBeforeTmConfirmClose"
  v-bind="attrs"
  @click="onDialogMaskClick"
  @cancel="onDialogCancel"
  @confirm="onDialogConfirm"
  @open="onDialogOpen"
  @close="onDialogClose"
>
  <template
    v-if="$slots.title || dialogNotice"
    #title
  >
    <slot
      name="title"
      :title="dialogTitle"
      :notice="dialogNotice"
      :visible="dialogVisible"
    >
      <view
        un-flex="~ col"
        un-items="center"
        un-gap="y-1"
      >
        <tm-text
          v-if="dialogTitle"
          font-size="34"
          un-font="bold"
        >
          {{ dialogTitle }}
        </tm-text>

        <view
          v-if="dialogNotice"
          un-text="3.5 gray-500 dark:gray-400"
          un-text-center
        >
          {{ dialogNotice }}
        </view>
      </view>
    </slot>
  </template>

  <slot
    :close="close"
    :resolve="resolve"
    :confirm="confirm"
    :visible="dialogVisible"
  ></slot>

  <template
    v-if="$slots.footer"
    #footer
  >
    <slot
      name="footer"
      :close="close"
      :resolve="resolve"
      :confirm="confirm"
      :visible="dialogVisible"
    ></slot>
  </template>
</tm-modal>
</template>

<script lang="ts" setup>
import type {
  Ref,
  WatchStopHandle,
} from "vue";

defineOptions({
  name: "CustomDialog",
  inheritAttrs: false,
});

type MaybePromise<T> = T | Promise<T>;
type MaybeDialogText = Ref<string | undefined> | string | undefined;

type CustomDialogType = "auto" | "medium" | "large";
type CustomDialogCloseReason = "close" | "cancel" | "overlay" | "confirm" | "programmatic";

type DialogResultFactory<T> = T | ((reason: CustomDialogCloseReason) => T);

type RuntimeDialogOptions<DialogResult = unknown> = Omit<ShowDialogOptions<DialogResult>, "title" | "notice">;

type ShowDialogOptions<DialogResult = unknown> = {
  title?: MaybeDialogText;
  notice?: MaybeDialogText;
  type?: CustomDialogType;
  width?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  showTitle?: boolean;
  showClose?: boolean;
  showFooter?: boolean;
  showCancel?: boolean;
  closeOnClickModal?: boolean;
  disabledScroll?: boolean;
  contentPadding?: string | number;
  cancelText?: string;
  confirmText?: string;
  btnColor?: string;
  bgColor?: string;
  darkBgColor?: string;
  customStyle?: string;
  zIndex?: string | number;
  beforeConfirm?: () => MaybePromise<boolean | void>;
  closeResult?: DialogResultFactory<DialogResult>;
  confirmResult?: DialogResultFactory<DialogResult>;
};

type DialogPreset = {
  width: string | number;
  height: string | number;
  maxHeight: string | number;
};

const props = withDefaults(
  defineProps<{
    title?: string;
    notice?: string;
    type?: CustomDialogType;
    width?: string | number;
    height?: string | number;
    maxHeight?: string | number;
    showTitle?: boolean;
    showClose?: boolean;
    showFooter?: boolean;
    showCancel?: boolean;
    closeOnClickModal?: boolean;
    disabledScroll?: boolean;
    contentPadding?: string | number;
    cancelText?: string;
    confirmText?: string;
    btnColor?: string;
    bgColor?: string;
    darkBgColor?: string;
    customStyle?: string;
    zIndex?: string | number;
    beforeConfirm?: () => MaybePromise<boolean | void>;
  }>(),
  {
    title: "",
    notice: "",
    type: "large",
    width: undefined,
    height: undefined,
    maxHeight: undefined,
    showTitle: true,
    showClose: true,
    showFooter: false,
    showCancel: true,
    closeOnClickModal: false,
    disabledScroll: true,
    contentPadding: 0,
    cancelText: "取消",
    confirmText: "确定",
    btnColor: "primary",
    bgColor: "white",
    darkBgColor: "",
    customStyle: "",
    zIndex: 1105,
    beforeConfirm: undefined,
  },
);

const emit = defineEmits([
  "click",
  "cancel",
  "confirm",
  "open",
  "close",
]);

const attrs = useAttrs();
const dialogVisible = defineModel<boolean>("show", {
  default: false,
});

let runtimeOptions = $ref<RuntimeDialogOptions<unknown> | null>(null);
let dialogTitle = $ref("");
let dialogNotice = $ref("");
let lastCloseReason = $ref<CustomDialogCloseReason>("close");
let dialogResolved = $ref(false);

let titleWatchHandle: WatchStopHandle | undefined;
let noticeWatchHandle: WatchStopHandle | undefined;
let pendingResolve: ((value: unknown) => void) | undefined;

const currentType = $computed(() => runtimeOptions?.type ?? props.type);
const currentPreset = $computed(() => getDialogPreset(currentType));

const currentShowTitle = $computed(() => runtimeOptions?.showTitle ?? props.showTitle);
const currentShowClose = $computed(() => runtimeOptions?.showClose ?? props.showClose);
const currentShowFooter = $computed(() => runtimeOptions?.showFooter ?? props.showFooter);
const currentShowCancel = $computed(() => runtimeOptions?.showCancel ?? props.showCancel);
const currentCloseOnClickModal = $computed(() => runtimeOptions?.closeOnClickModal ?? props.closeOnClickModal);
const currentDisabledScroll = $computed(() => runtimeOptions?.disabledScroll ?? props.disabledScroll);
const currentContentPadding = $computed(() => runtimeOptions?.contentPadding ?? props.contentPadding);
const currentCancelText = $computed(() => runtimeOptions?.cancelText ?? props.cancelText);
const currentConfirmText = $computed(() => runtimeOptions?.confirmText ?? props.confirmText);
const currentBtnColor = $computed(() => runtimeOptions?.btnColor ?? props.btnColor);
const currentBgColor = $computed(() => runtimeOptions?.bgColor ?? props.bgColor);
const currentDarkBgColor = $computed(() => runtimeOptions?.darkBgColor ?? props.darkBgColor);
const currentCustomStyle = $computed(() => runtimeOptions?.customStyle ?? props.customStyle);
const currentZIndex = $computed(() => runtimeOptions?.zIndex ?? props.zIndex);

const currentWidth = $computed(() => runtimeOptions?.width ?? props.width ?? currentPreset.width);
const currentHeight = $computed(() => runtimeOptions?.height ?? props.height ?? currentPreset.height);
const currentMaxHeight = $computed(() => runtimeOptions?.maxHeight ?? props.maxHeight ?? currentPreset.maxHeight);

function getDialogPreset(
  type?: CustomDialogType,
): DialogPreset {
  switch (type) {
    case "auto":
      return {
        width: "84%",
        height: "auto",
        maxHeight: "80%",
      };
    case "medium":
      return {
        width: "90%",
        height: "72%",
        maxHeight: "86%",
      };
    case "large":
    default:
      return {
        width: "94%",
        height: "90%",
        maxHeight: "90%",
      };
  }
}

function bindDialogText(
  value: MaybeDialogText,
  setter: (value: string) => void,
) {
  if (isRef(value)) {
    return watch(
      value,
      () => {
        setter(unref(value) || "");
      },
      {
        immediate: true,
      },
    );
  }

  setter(value || "");
  return undefined;
}

function clearDialogTextWatchers() {
  if (titleWatchHandle) {
    titleWatchHandle();
    titleWatchHandle = undefined;
  }

  if (noticeWatchHandle) {
    noticeWatchHandle();
    noticeWatchHandle = undefined;
  }
}

function applyRuntimeOptions<DialogResult>(
  arg?: ShowDialogOptions<DialogResult>,
) {
  clearDialogTextWatchers();

  if (arg) {
    const {
      title: _title,
      notice: _notice,
      ...rest
    } = arg;
    runtimeOptions = {
      ...rest,
    } as RuntimeDialogOptions<unknown>;
  } else {
    runtimeOptions = { };
  }

  titleWatchHandle = bindDialogText(arg?.title, (value) => {
    if (value) {
      dialogTitle = value;
    }
  });
  noticeWatchHandle = bindDialogText(arg?.notice, (value) => {
    dialogNotice = value;
  });
}

function getFactoryResult(
  key: "closeResult" | "confirmResult",
  reason: CustomDialogCloseReason,
): {
  hasValue: boolean;
  value: unknown;
} {
  if (!runtimeOptions || !(key in runtimeOptions)) {
    return {
      hasValue: false,
      value: undefined,
    };
  }

  const rawValue = runtimeOptions[key];
  if (typeof rawValue === "function") {
    return {
      hasValue: true,
      value: rawValue(reason),
    };
  }

  return {
    hasValue: true,
    value: rawValue,
  };
}

function settle(value: unknown) {
  if (dialogResolved) {
    return;
  }

  dialogResolved = true;
  pendingResolve?.(value);
  pendingResolve = undefined;
}

function resolve(value?: unknown) {
  lastCloseReason = "programmatic";
  settle(value);
  dialogVisible.value = false;
}

function close(value?: unknown) {
  lastCloseReason = "programmatic";

  if (arguments.length > 0) {
    resolve(value);
    return;
  }

  const closeResult = getFactoryResult("closeResult", lastCloseReason);
  if (closeResult.hasValue) {
    settle(closeResult.value);
  }

  dialogVisible.value = false;
}

function confirm(value?: unknown) {
  lastCloseReason = "confirm";

  if (arguments.length > 0) {
    resolve(value);
    return;
  }

  const confirmResult = getFactoryResult("confirmResult", lastCloseReason);
  if (confirmResult.hasValue) {
    settle(confirmResult.value);
  }

  dialogVisible.value = false;
}

async function onBeforeTmConfirmClose() {
  const beforeConfirm = runtimeOptions?.beforeConfirm ?? props.beforeConfirm;
  if (!beforeConfirm) {
    return true;
  }

  const result = await beforeConfirm();
  return result !== false;
}

async function showDialog<DialogResult = unknown>(
  arg?: ShowDialogOptions<DialogResult>,
) {
  if (pendingResolve && !dialogResolved) {
    settle(undefined);
  }

  dialogResolved = false;
  lastCloseReason = "close";
  applyRuntimeOptions(arg);

  return await new Promise<DialogResult>((resolve) => {
    pendingResolve = resolve as (value: unknown) => void;
    dialogVisible.value = true;
  });
}

watch(
  () => props.title,
  (newTitle) => {
    if (!newTitle) {
      return;
    }
    dialogTitle = newTitle || "";
  },
  {
    immediate: true,
  },
);

function resetRuntimeState() {
  clearDialogTextWatchers();
  runtimeOptions = null;
  // dialogTitle = "";
  // dialogNotice = "";
  lastCloseReason = "close";
  dialogResolved = false;
  pendingResolve = undefined;
}

function onDialogMaskClick() {
  if (currentCloseOnClickModal) {
    lastCloseReason = "overlay";
  }

  emit("click");
}

function onDialogCancel() {
  lastCloseReason = "cancel";
  emit("cancel");
}

function onDialogConfirm() {
  lastCloseReason = "confirm";
  const confirmResult = getFactoryResult("confirmResult", lastCloseReason);
  if (confirmResult.hasValue) {
    settle(confirmResult.value);
  }

  emit("confirm");
}

function onDialogOpen() {
  emit("open");
}

function onDialogClose() {
  if (!dialogResolved) {
    const closeResult = getFactoryResult("closeResult", lastCloseReason);
    if (closeResult.hasValue) {
      settle(closeResult.value);
    } else if (pendingResolve) {
      settle(undefined);
    }
  }

  emit("close");
  resetRuntimeState();
}

onUnmounted(() => {
  clearDialogTextWatchers();
});

defineExpose({
  showDialog,
  resolve,
  close,
  confirm,
  visible: dialogVisible,
});
</script>