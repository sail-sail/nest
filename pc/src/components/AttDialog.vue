<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
  :close-on-click-modal="true"
>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
  >
    <div
      un-p="y-2.5 x-4"
      un-flex
      un-justify-center
      un-items-center
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
      
      <el-button
        v-if="currentItem"
        :disabled="!canPrintCurrent"
        @click="printClk"
      >
        <template #icon>
          <ElIconPrinter />
        </template>
        <span>{{ ns("打印") }}</span>
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
      
      <div
        v-if="currentItem"
        un-m="r-3"
      >
        <el-color-picker
          v-model="backgroundColor"
          show-alpha
          :predefine="predefineColors"
          @active-change="backgroundColor = ($event ?? undefined)"
        />
      </div>
      
    </div>
    <div
      un-flex="~ [1_0_0] col basis-[inherit]"
      un-overflow-auto
      un-justify-center
      un-items-center
      un-p="x-5"
      un-box-border
      un-pos="relative"
    >
      <template
        v-for="(item, i) in items"
        :key="item.id"
      >
        <template
          v-if="item.loadState === 'error'"
        >
          <div
            v-if="item.shown"
            v-show="i === nowIndex"
            un-flex="~ [1_0_0]"
            un-overflow-auto
            un-w="full"
            un-justify-center
            un-items-center
          >
            {{ ns("预览失败，请下载后查看") }}
          </div>
        </template>
        <template
          v-else-if="item.previewType === 'image'"
        >
          <img
            v-if="item.shown"
            :ref="(el) => setItemRef(item.id, el)"
            :style="{ display: i === nowIndex ? '' : 'none', backgroundColor: backgroundColor || '' }"
            object-fit="scale-down"
            :src="getItemUrl(item)"
            @load="onPreviewLoad(item.id)"
            @error="onPreviewError(item.id)"
          >
        </template>
        <template
          v-else-if="item.previewType === 'excel'"
        >
          <VueOfficeExcel
            v-if="item.shown"
            v-show="i === nowIndex"
            :src="getItemUrl(item)"
            un-flex="~ [1_0_0]"
            un-overflow-auto
            un-w="full"
            @rendered="onPreviewLoad(item.id)"
            @error="onPreviewError(item.id)"
          ></VueOfficeExcel>
        </template>
        <template
          v-else-if="item.previewType === 'docx'"
        >
          <VueOfficeDocx
            v-if="item.shown"
            v-show="i === nowIndex"
            :src="getItemUrl(item)"
            un-flex="~ [1_0_0]"
            un-overflow-auto
            un-w="full"
            @rendered="onPreviewLoad(item.id)"
            @error="onPreviewError(item.id)"
          ></VueOfficeDocx>
        </template>
        <template
          v-else-if="item.previewType === 'binary'"
        >
          <div
            v-if="item.shown"
            v-show="i === nowIndex"
            un-flex="~ [1_0_0]"
            un-overflow-auto
            un-w="full"
            un-justify-center
            un-items-center
          >
            {{ ns("证书文件不支持预览") }}
          </div>
        </template>
        <template
          v-else
        >
          <iframe
            v-if="item.shown"
            :ref="(el) => setItemRef(item.id, el)"
            :style="{ display: i === nowIndex ? '' : 'none', backgroundColor: backgroundColor || '' }"
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

import VueOfficeExcel from "@vue-office/excel";
import VueOfficeDocx from "@vue-office/docx";

import {
  saveAs,
} from "file-saver";

const {
  ns,
  nsAsync,
} = useI18n();

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

const canPrintCurrent = $computed(() => {
  return currentItem != null && (currentItem.previewType === "image" || currentItem.previewType === "iframe");
});

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

const backgroundColor = $ref<string | undefined>("#000000");

const predefineColors = $ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  '#FFFFFF',
  '#CCCCCC',
  '#000000',
  '#c7158577',
]);

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
    const previewType = getAttPreviewType(stat?.contentType);
    return {
      id,
      stat,
      shown: prevItem?.shown ?? index === 0,
      ref: prevItem?.ref,
      previewType,
      loadState: previewType === "binary"
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
  let lbl = item.stat?.lbl || "";
  if (lbl.length > 45) {
    lbl = lbl.substring(0, 45) + "...";
  }
  return lbl;
}

function getItemUrl(item: AttItem) {
  return getDownloadUrl({
    id: item.id,
    filename: getItemFilename(item),
  });
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
  if (item.previewType === "binary") {
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
  body.style.justifyContent = "center";
  body.style.alignItems = "center";
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

// 打印
function printClk() {
  if (!currentItem) {
    return;
  }
  if (currentItem.previewType === "iframe") {
    const iframeWindow = currentItem.ref instanceof HTMLIFrameElement
      ? currentItem.ref.contentWindow
      : undefined;
    if (iframeWindow) {
      iframeWindow.print();
    }
    return;
  }
  if (currentItem.previewType === "image") {
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) {
      ElMessage.warning(ns("请允许弹出新窗口后重试"));
      return;
    }
    const styleEl = printWindow.document.createElement("style");
    styleEl.textContent = `
      html, body {
        margin: 0;
        min-height: 100%;
      }
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
      }
      img {
        max-width: 100%;
        max-height: 100vh;
        object-fit: contain;
      }
    `;
    printWindow.document.head.appendChild(styleEl);
    const imgEl = printWindow.document.createElement("img");
    imgEl.src = getItemUrl(currentItem);
    imgEl.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
    imgEl.addEventListener("error", () => {
      printWindow.close();
      ElMessage.error(ns("图片加载失败，无法打印"));
    });
    printWindow.document.body.appendChild(imgEl);
    return;
  }
  ElMessage.warning(ns("当前附件类型不支持直接打印，请先在网页中打开"));
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
