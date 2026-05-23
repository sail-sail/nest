<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
  >
    <div
      un-p="y-2.5 x-4"
      un-box-border
      un-flex
      un-justify="center-safe"
      un-items="center-safe"
    >
      
      <el-button
        v-if="!dialogModel.readonly && items.length > 0"
        plain
        type="primary"
        @click="onUpload"
      >
        <template #icon>
          <ElIconUpload />
        </template>
        <span>{{ ns("上传") }}</span>
      </el-button>
      
      <el-button
        v-if="currentItem && !dialogModel.readonly"
        plain
        type="danger"
        @click="deleteClk"
      >
        <template #icon>
          <ElIconDelete />
        </template>
        <span>{{ ns("删除") }}</span>
      </el-button>
      
      <el-button
        v-if="currentItem"
        plain
        @click="downloadClk"
      >
        <template #icon>
          <ElIconDownload />
        </template>
        <span>{{ ns("下载") }}</span>
      </el-button>
      
      <a
        v-if="currentItem"
        class="el-button"
        target="_blank"
        rel="noopener noreferrer"
        :href="getItemUrl(currentItem)"
        un-no-underline
      >
        {{ ns("网页中打开") }}
      </a>
      
      <el-button
        v-if="currentItem"
        :disabled="nowIndex === 0"
        @click="moveLeftClk"
      >
        <template #icon>
          <ElIconArrowLeft />
        </template>
        <span>{{ ns("前移") }}</span>
      </el-button>
      
      <el-button
        v-if="currentItem"
        :disabled="nowIndex === items.length - 1"
        @click="moveRightClk"
      >
        <template #icon>
          <ElIconArrowRight />
        </template>
        <span>{{ ns("后移") }}</span>
      </el-button>
      
      <div
        un-flex="[1_0_0]"
      >
      </div>
      
    </div>
    <div
      un-flex="~ [1_0_0] col basis-[inherit]"
      un-overflow-auto
      un-justify="center-safe"
      un-items="center-safe"
      un-p="x-5"
      un-box-border
      un-pos="relative"
    >
      <template
        v-for="(item, i) in items"
        :key="item.id"
      >
        
        <!-- 加载失败 -->
        <template
          v-if="item.loadState === 'error'"
        >
          <div
            v-if="item.shown"
            v-show="i === nowIndex"
            un-flex="~ [1_0_0]"
            un-overflow-auto
            un-w="full"
            un-justify="center-safe"
            un-items="center-safe"
          >
            {{ ns("预览失败，请下载后查看") }}
          </div>
        </template>
        
        <!-- flyfish -->
        <template
          v-else-if="item.previewType === 'flyfish'"
        >
          <div
            v-if="item.shown"
            v-show="i === nowIndex"
            un-flex="~ [1_0_0]"
            un-overflow-auto
            un-w="full"
            un-h="full"
          >
            <FileViewer
              un-w="full"
              un-h="full"
              :file="fileCache.get(item.id)"
            />
          </div>
        </template>
        
        <!-- iframe -->
        <template
          v-else
        >
          <iframe
            v-if="item.shown"
            :ref="(el) => setItemRef(item.id, el)"
            :style="{ display: i === nowIndex ? '' : 'none' }"
            un-flex="~ [1_0_0]"
            un-overflow-hidden
            un-w="full"
            :src="getItemUrl(item)"
            frameborder="0"
            @load="onPreviewLoad(item.id)"
            @error="onPreviewError(item.id)"
          ></iframe>
        </template>
        
      </template>
      <div
        v-if="items.length === 0"
        un-flex="~ [1_0_0]"
        un-overflow-hidden
        un-justify-center
        un-items-center
        un-text="var(--el-text-color-regular) [22px]"
      >
        
        <el-button
          v-if="!dialogModel.readonly && items.length === 0"
          plain
          type="primary"
          @click="onUpload"
        >
          <template #icon>
            <ElIconUpload />
          </template>
          <span>{{ ns("上传") }}</span>
        </el-button>
        
        <div
          v-else-if="dialogModel.readonly"
          un-flex="~ [1_0_0]"
          un-overflow-hidden
          un-justify-center
          un-items-center
          un-text="4 gray-400"
        >
          <span>{{ ns("(暂无附件)") }}</span>
        </div>
        
      </div>
      <div
        v-if="currentItem && currentItem.loadState === 'loading'"
        un-flex="~ [1_0_0]"
        un-overflow-hidden
        un-justify-center
        un-items-center
        un-text="[18px]"
        un-pos="absolute"
        un-inset-0
        un-bg="[#FFF]"
      >
        {{ ns("加载中, 请稍后...") }}
      </div>
    </div>
    <div
      v-if="items.length > 1"
      un-p="b-[5px]"
      un-flex="~"
      un-justify-center
    >
      <div
        un-flex="~"
        un-items-center
      >
        
        <el-button
          :disabled="nowIndex <= 0"
          size="small"
          @click="previousClk"
        >
          <template #icon>
            <ElIconArrowLeft />
          </template>
        </el-button>
        
        <span
          un-text="[var(--el-text-color-regular)]"
          un-m="x-3"
          un-flex="~ col"
          un-justify-center
        >
          {{ nowIndex + 1 }} / {{ items.length }}
        </span>
        
        <el-button
          :disabled="nowIndex >= items.length - 1"
          size="small"
          @click="nextClk"
        >
          <template #icon>
            <ElIconArrowRight />
          </template>
        </el-button>
        
      </div>
    </div>
    
    <div
      un-p="y-2.5"
      un-box-border
      un-flex
      un-justify-center
      un-items-center
    >
      
      <el-button
        plain
        @click="onClose"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>{{ ns('关闭') }}</span>
      </el-button>
    </div>
    
  </div>
  <input
    ref="fileRef"
    type="file"
    :accept="dialogModel.accept"
    un-hidden
    @change="inputChg"
  />
</CustomDialog>
</template>

<script lang="ts" setup>
import { filesize } from "filesize";

import {
  getAttDialogPreviewInfo,
  getAttPreviewType,
  splitAttIds,
} from "./AttDialogUtil";

import type {
  AttFileStat,
  AttPreviewType,
} from "./AttDialogUtil";

import {
  FileViewer,
} from "@flyfish-group/file-viewer3";

import {
  saveAs,
} from "file-saver";

const {
  ns,
  nsAsync,
} = useI18n();

const isDark = useDark();

const emit = defineEmits([
  "change",
]);

type PreviewLoadState = "idle" | "loading" | "loaded" | "error";
type PreviewRef = HTMLIFrameElement | HTMLImageElement;

type AttItem = {
  id: string;
  stat?: AttFileStat;
  shown: boolean;
  ref?: PreviewRef;
  previewType: AttPreviewType;
  loadState: PreviewLoadState;
};

let items = $ref<AttItem[]>([ ]);
let nowIndex = $ref(0);

const currentItem = $computed(() => items[nowIndex]);

// 当前弹出框的标题
const dialogTitle = $computed(() => {
  let title = "";
  const fileStat = currentItem?.stat;
  if (fileStat) {
    const fileSizeStr = filesize(fileStat.size || 0, { round: 0 });
    title = `${ fileStat.lbl } (${ fileSizeStr })`;
  }
  return title;
});

type DialogModel = {
  modelValue?: string,
  maxSize?: number,
  maxFileSize?: number,
  readonly?: boolean,
  accept?: string,
  db?: string,
  isPublic?: boolean,
}

let dialogModel = $ref<DialogModel>({
  modelValue: "",
  maxSize: 1,
  maxFileSize: 1024 * 1024 * 50,
  readonly: false,
  accept: "",
  db: undefined,
  isPublic: false,
});

let modelValue = $ref("");

// let tenantHost = $ref("");

const customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

function createItem(
  id: string,
  index: number,
): AttItem {
  return {
    id,
    stat: undefined,
    shown: index === 0,
    ref: undefined,
    previewType: "iframe",
    loadState: "idle",
  };
}

function mergeItems(
  ids: string[],
  stats?: Array<AttFileStat | undefined>,
): AttItem[] {
  const itemMap = new Map(items.map((item) => [item.id, item]));
  return ids.map((id, index) => {
    const prevItem = itemMap.get(id);
    const stat = stats?.[index] ?? prevItem?.stat;
    const previewType = getAttPreviewType(stat);
    return {
      id,
      stat,
      shown: prevItem?.shown ?? index === 0,
      ref: prevItem?.ref,
      previewType,
      loadState: previewType === "flyfish"
        ? "loaded"
        : prevItem?.loadState ?? "idle",
    };
  });
}

function syncModelValue() {
  modelValue = items.map((item) => item.id).join(",");
}

function clampNowIndex() {
  if (items.length === 0) {
    nowIndex = 0;
    return;
  }
  if (nowIndex > items.length - 1) {
    nowIndex = items.length - 1;
  }
}

function getItemFilename(item: AttItem) {
  return item.stat?.lbl || "";
}

let fileCache = $ref(new Map<string, File>());

watch(
  () => currentItem,
  async () => {
    if (!currentItem) {
      return;
    }
    if (currentItem.previewType !== "flyfish") {
      return;
    }
    let file = fileCache.get(currentItem.id);
    if (!file) {
      file = await getItemFile(currentItem);
      fileCache.set(currentItem.id, file);
    }
  },
  {
    immediate: true,
    deep: true,
  },
);

async function getItemFile(item: AttItem) {
  const url = getItemUrl(item);
  const response = await fetch(url);
  if (!response.ok) {
    ElMessage.error(await nsAsync("获取文件失败"));
    throw new Error(`Failed to fetch file: ${ response.status } ${ response.statusText }`);
  }
  const blob = await response.blob();
  const file = new File([blob], getItemFilename(item));
  return file;
}

function getItemUrl(item: AttItem) {
  let url = location.origin + location.pathname;
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  url += getDownloadUrl({
    id: item.id,
    filename: getItemFilename(item),
  });
  return url;
}

function findItem(itemId: string) {
  return items.find((item) => item.id === itemId);
}

function setItemRef(
  itemId: string,
  el: unknown,
) {
  if (!(el instanceof HTMLIFrameElement) && !(el instanceof HTMLImageElement)) {
    return;
  }
  const item = findItem(itemId);
  if (!item) {
    return;
  }
  item.ref = el;
}

// 打开对话框
async function showDialog(
  {
    model,
  }: {
    model?: typeof dialogModel,
  },
): Promise<void> {
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "medium",
    title: $$(dialogTitle),
    pointerPierce: true,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  // const tenantStore = usrTenantStore();
  // const { host } = await tenantStore.getHost();
  // tenantHost = host;
  const nextModelValue = model?.modelValue || "";
  const isChg = nextModelValue !== modelValue;
  dialogModel = {
    modelValue: "",
    ...model,
  };
  modelValue = nextModelValue;
  if (isChg) {
    nowIndex = 0;
    items = mergeItems(splitAttIds(modelValue));
    await getStatsOssEfc();
  }
  await afterSwitchPreview();
}

async function getStatsOssEfc() {
  const ids = items.map((item) => item.id);
  if (ids.length === 0) {
    items = [ ];
    return;
  }
  const previewInfo = await getAttDialogPreviewInfo(modelValue);
  const stats = previewInfo.items.map((item) => item.stat);
  items = mergeItems(ids, stats);
}

function pauseIframeMedia(item?: AttItem) {
  const eleRef = item?.ref;
  if (eleRef instanceof HTMLIFrameElement) {
    const iframeWindow = eleRef?.contentWindow;
    const iframeDocument = iframeWindow?.document;
    if (iframeDocument) {
      const videoEls = iframeDocument.getElementsByTagName("video");
      for (let i = 0; i < videoEls.length; i++) {
        const videoEl = videoEls[i];
        videoEl.pause();
      }
    }
    return;
  }
}

function playIframeMedia(item?: AttItem) {
  const eleRef = item?.ref;
  if (!(eleRef instanceof HTMLIFrameElement)) {
    return;
  }
  const iframeWindow = eleRef?.contentWindow;
  const iframeDocument = iframeWindow?.document;
  if (!iframeDocument) {
    return;
  }
  const videoEls = iframeDocument.getElementsByTagName("video");
  for (let i = 0; i < videoEls.length; i++) {
    const videoEl = videoEls[i];
    videoEl.play();
  }
}

async function afterSwitchPreview() {
  const item = currentItem;
  if (!item) {
    return;
  }
  if (!item.shown) {
    item.shown = true;
  }
  if (item.previewType === "flyfish") {
    item.loadState = "loaded";
    return;
  }
  if (item.loadState === "idle") {
    item.loadState = "loading";
    return;
  }
  if (item.previewType === "iframe" && item.loadState === "loaded") {
    playIframeMedia(item);
  }
}

async function previousClk() {
  if (nowIndex <= 0) {
    return;
  }
  pauseIframeMedia(currentItem);
  nowIndex--;
  await afterSwitchPreview();
}

async function nextClk() {
  if (nowIndex >= items.length - 1) {
    return;
  }
  pauseIframeMedia(currentItem);
  nowIndex++;
  await afterSwitchPreview();
}

function onPreviewLoad(itemId: string) {
  const item = findItem(itemId);
  if (!item) {
    return;
  }
  item.loadState = "loaded";
  if (item.ref instanceof HTMLIFrameElement) {
    try {
      initIframeEl(item.ref);
      if (currentItem?.id === itemId) {
        playIframeMedia(item);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

function onPreviewError(itemId: string) {
  const item = findItem(itemId);
  if (!item) {
    return;
  }
  item.loadState = "error";
}

function initIframeEl(iframeRef: HTMLIFrameElement) {
  const iframeWindow = iframeRef?.contentWindow;
  const iframeDocument = iframeWindow?.document;
  if (!iframeDocument) {
    return;
  }
  const cssText = `
    ::-webkit-scrollbar-track-piece {
      background-color: transparent;
    }
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
      background-color: transparent;
      cursor: pointer;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: rgba(144, 146, 152, 0.3);
    }
  `;
  const styleEl = iframeDocument.createElement("style");
  styleEl.appendChild(iframeDocument.createTextNode(cssText));
  iframeDocument.getElementsByTagName("head")[0]?.appendChild(styleEl);
  const body = iframeDocument.body as HTMLBodyElement;
  body.style.display = "flex";
  body.style.justifyContent = "safe center";
  body.style.alignItems = "safe center";
  const imgs = iframeDocument.getElementsByTagName("img");
  if (imgs.length > 0) {
    const clientWidth = body.clientWidth;
    const img: HTMLImageElement = imgs[0];
    img.style.maxWidth = "100%";
    if (img.width > clientWidth) {
      img.style.width = "100%";
    }
  }
}

// 下载
function downloadClk() {
  if (!currentItem) {
    return;
  }
  const url = getItemUrl(currentItem);
  saveAs(url);
}

const fileRef = $ref<HTMLInputElement>();

async function inputChg() {
  if (!fileRef) return;
  if (dialogModel.maxSize && items.length >= dialogModel.maxSize) {
    fileRef.value = "";
    ElMessage.error(await nsAsync(`最多只能上传 {0} 个附件`, dialogModel.maxSize));
    return;
  }
  const file = fileRef?.files?.[0];
  fileRef.value = "";
  if (!file) return;
  if (dialogModel?.maxFileSize && file.size > dialogModel.maxFileSize) {
    ElMessage.error(await nsAsync(`文件大小不能超过 {0}M`, dialogModel.maxFileSize / 1024 / 1024));
    return;
  }
  const id = await uploadFile(file, undefined, {
    db: dialogModel.db,
    isPublic: dialogModel.isPublic,
  });
  if (!id) {
    return;
  }
  const insertIndex = items.length > 0 ? nowIndex + 1 : 0;
  pauseIframeMedia(currentItem);
  const nextItems = [ ...items ];
  nextItems.splice(insertIndex, 0, createItem(id, insertIndex));
  items = nextItems;
  nowIndex = insertIndex;
  syncModelValue();
  await getStatsOssEfc();
  await afterSwitchPreview();
  emit("change", modelValue);
}

// 点击上传附件
async function onUpload() {
  if (!fileRef) return;
  if (dialogModel.maxSize && items.length >= dialogModel.maxSize) {
    fileRef.value = "";
    ElMessage.error(await nsAsync(`最多只能上传 {0} 个附件`, dialogModel.maxSize));
    return;
  }
  fileRef.click();
}

// 删除附件
async function deleteClk() {
  try {
    await ElMessageBox.confirm(await nsAsync("确定删除当前附件吗？"));
  } catch (err) {
    return;
  }
  if (items.length === 0) {
    return;
  }
  pauseIframeMedia(currentItem);
  const nextItems = [ ...items ];
  nextItems.splice(nowIndex, 1);
  items = nextItems;
  clampNowIndex();
  syncModelValue();
  await afterSwitchPreview();
  ElMessage.success(await nsAsync("删除成功"));
  emit("change", modelValue);
}

function reorderItems(
  fromIndex: number,
  toIndex: number,
) {
  const nextItems = [ ...items ];
  const [item] = nextItems.splice(fromIndex, 1);
  if (!item) {
    return;
  }
  nextItems.splice(toIndex, 0, item);
  items = nextItems;
  nowIndex = toIndex;
  syncModelValue();
}

// 当前附件向前移动
async function moveLeftClk() {
  if (!currentItem || nowIndex === 0) {
    return;
  }
  pauseIframeMedia(currentItem);
  reorderItems(nowIndex, nowIndex - 1);
  await afterSwitchPreview();
  emit("change", modelValue);
}

// 当前附件向后移动
async function moveRightClk() {
  if (!currentItem || nowIndex >= items.length - 1) {
    return;
  }
  pauseIframeMedia(currentItem);
  reorderItems(nowIndex, nowIndex + 1);
  await afterSwitchPreview();
  emit("change", modelValue);
}

function beforeClose(done: (cancel: boolean) => void) {
  pauseIframeMedia(currentItem);
  done(false);
  onCloseResolve({
    type: "cancel",
  });
}

async function onClose() {
  pauseIframeMedia(currentItem);
  onCloseResolve({
    type: "cancel",
  });
}

defineExpose({
  showDialog,
});
</script>
