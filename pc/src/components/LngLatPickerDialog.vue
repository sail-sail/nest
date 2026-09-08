<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
    un-h="full"
  >
    
    <div
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
      un-p="x-4"
      un-box-border
      un-gap="y-2"
    >
      <div
        un-flex="~ items-center"
        un-justify="center"
        un-text="sm [var(--el-text-color-regular)]"
      >
        <span class="status-dot" :class="{ 'status-dot--ready': hasCoordinate }"></span>
        <span>{{ statusText }}</span>
      </div>

      <div
        un-flex="~ [1_0_0]"
        un-overflow-hidden
      >
        <iframe
          v-if="pickerUrl"
          class="picker-frame"
          :src="pickerUrl"
          frameborder="0"
          allow="clipboard-read; clipboard-write; accelerometer; gyroscope; magnetometer"
        ></iframe>
      </div>
    </div>

    <div
      un-p="x-6 y-4"
      un-box-border
      un-flex="~ justify-center items-center gap-2"
    >
      <el-button
        plain
        @click="cancelClk"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>关闭</span>
      </el-button>

      <el-button
        plain
        type="primary"
        @click="onConfirm"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>确定</span>
      </el-button>
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>
import { parseCoordinateText } from "@/utils/lngLat";
import { copyText } from "@/utils/common";

const pickerUrl = "https://lbs.amap.com/tools/picker";
const clipboardPollMs = 1000;

type OnCloseResolveType = {
  type: "cancel" | "confirm";
  longitude?: number;
  latitude?: number;
};

let onCloseResolve = function(_value: OnCloseResolveType) { };
const customDialogRef = $(useTemplateRef("customDialogRef"));

let dialogTitle = $ref("拾取经纬度");
let currentAddress = $ref("");
let statusText = $ref("正在复制地址，请先粘贴到高德地图搜索框...");
let hasCoordinate = $ref(false);
let coordinate = $ref<{ longitude: number; latitude: number } | undefined>();
let clipboardTimer: ReturnType<typeof setInterval> | undefined;

function stopPolling() {
  if (clipboardTimer) {
    clearInterval(clipboardTimer);
    clipboardTimer = undefined;
  }
}

function startPolling() {
  stopPolling();
  if (typeof navigator === "undefined" || !navigator.clipboard?.readText) {
    statusText = "当前浏览器不支持读取系统剪贴板，请手动复制坐标后再点确定。";
    return;
  }
  clipboardTimer = setInterval(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = parseCoordinateText(text);
      if (!parsed) {
        return;
      }
      if (!hasCoordinate || coordinate?.longitude !== parsed.longitude || coordinate?.latitude !== parsed.latitude) {
        coordinate = parsed;
        hasCoordinate = true;
        statusText = `已检测到坐标：${ parsed.longitude }, ${ parsed.latitude }`;
      }
    } catch (err) {
      // console.error(err);
    }
  }, clipboardPollMs);
}

async function copyAddress() {
  if (!currentAddress) {
    statusText = "当前地址为空，请先填写详细地址。";
    return;
  }
  await copyText(currentAddress);
  statusText = "已复制地址，请粘贴到高德地图搜索框后，再复制地图坐标。";
}

async function showDialog(arg?: {
  title?: string;
  address?: string;
}) {
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    title: arg?.title || "拾取经纬度",
    type: "large",
    fullscreen: true,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  dialogTitle = arg?.title || "拾取经纬度";
  currentAddress = arg?.address || "";
  coordinate = undefined;
  hasCoordinate = false;
  statusText = "正在复制地址，请先粘贴到高德地图搜索框...";
  startPolling();
  await copyAddress();
  return await dialogRes.dialogPrm;
}

function cancelClk() {
  stopPolling();
  onCloseResolve({
    type: "cancel",
  });
}

async function onConfirm() {
  if (!hasCoordinate || !coordinate) {
    return;
  }
  stopPolling();
  onCloseResolve({
    type: "confirm",
    longitude: coordinate.longitude,
    latitude: coordinate.latitude,
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  stopPolling();
  done(false);
  onCloseResolve({
    type: "cancel",
  });
}

defineExpose({ showDialog });
</script>

<style lang="scss" scoped>
.picker-frame {
  width: 100%;
  height: 100%;
  min-height: 60vh;
  border: 0;
}

.status-dot {
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 999px;
}

</style>
