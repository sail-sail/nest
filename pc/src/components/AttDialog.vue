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
        v-if="!dialogModel.readonly && urlList.length > 0"
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
        v-if="urlList[nowIndex] && !dialogModel.readonly"
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
        v-if="urlList[nowIndex]"
        plain
        @click="downloadClk"
      >
        <template #icon>
          <ElIconDownload />
        </template>
        <span>{{ ns("下载") }}</span>
      </el-button>
      
      <el-button
        v-if="urlList[nowIndex]"
        @click="printClk"
      >
        <template #icon>
          <ElIconPrinter />
        </template>
        <span>{{ ns("打印") }}</span>
      </el-button>
      
      <a
        v-if="urlList[nowIndex]"
        class="el-button"
        target="_blank"
        :href="urlList[nowIndex]"
        
        un-no-underline
      >
        {{ ns("网页中打开") }}
      </a>
      
      <el-button
        v-if="urlList[nowIndex]"
        :disabled="nowIndex === 0"
        @click="moveLeftClk"
      >
        <template #icon>
          <ElIconArrowLeft />
        </template>
        <span>{{ ns("前移") }}</span>
      </el-button>
      
      <el-button
        v-if="urlList[nowIndex]"
        :disabled="nowIndex === urlList.length - 1"
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
        v-if="urlList[nowIndex]"
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
      un-p="5"
      un-pos="relative"
    >
      <template
        v-for="(url, i) in urlList"
        :key="url"
      >
        <template
          v-if="fileStats && fileStats.length > 0"
        >
          
          <!-- 判断是否为图片 -->
          <template
            v-if="fileStats[i]?.contentType?.startsWith('image/')"
          >
            <img
              v-if="iframeShoweds[i]"
              :ref="(el) => { if (el) iframeRefs[i] = el as HTMLImageElement }"
              :style="{ display: i === nowIndex ? '' : 'none', backgroundColor: backgroundColor || '' }"
              object-fit="scale-down"
              :src="url"
            >
          </template>
          
          <!-- 判断是否为xlsx文件 -->
          <template
            v-else-if="fileStats[i]?.contentType?.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
              || fileStats[i]?.contentType?.startsWith('application/vnd.ms-excel.sheet')"
          >
            <VueOfficeExcel
              v-if="iframeShoweds[i]"
              v-show="i === nowIndex"
              :src="url"
              un-flex="~ [1_0_0]"
              un-overflow-auto
              un-w="full"
            ></VueOfficeExcel>
          </template>
          
          <!-- 判断是否为docx文件 -->
          <template
            v-else-if="fileStats[i]?.contentType?.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
              || fileStats[i]?.contentType?.startsWith('application/msword')"
          >
            <VueOfficeDocx
              v-if="iframeShoweds[i]"
              v-show="i === nowIndex"
              :src="url"
              un-flex="~ [1_0_0]"
              un-overflow-auto
              un-w="full"
            ></VueOfficeDocx>
          </template>
          
          <template
            v-else
          >
            <iframe
              v-if="iframeShoweds[i]"
              :ref="(el) => { if (el) iframeRefs[i] = el as HTMLIFrameElement }"
              :style="{ display: i === nowIndex ? '' : 'none', backgroundColor: backgroundColor || '' }"
              
              un-flex="~ [1_0_0]"
              un-overflow-hidden
              un-w="full"
              
              :src="url"
              frameborder="0"
              @load="iframeLoad"
            ></iframe>
          </template>
          
        </template>
        
      </template>
      <div
        v-if="urlList.length === 0"
        un-flex="~ [1_0_0]"
        un-overflow-hidden
        un-justify-center
        un-items-center
        un-text="var(--el-text-color-regular) [22px]"
      >
        
        <el-button
          v-if="!dialogModel.readonly && urlList.length === 0"
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
        v-if="iframeLoading"
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
      v-if="urlList.length > 1"
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
          {{ nowIndex + 1 }} / {{ urlList.length }}
        </span>
        
        <el-button
          :disabled="nowIndex >= urlList.length - 1"
          size="small"
          @click="nextClk"
        >
          <template #icon>
            <ElIconArrowRight />
          </template>
        </el-button>
        
      </div>
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
import { baseURL } from '@/utils/request';

import {
  getStatsOss,
} from "./Api";

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

// 文件名列表
let fileStats = $ref<{
  id: string;
  lbl: string;
  contentType?: string;
  size?: number;
}[]>();

// 当前弹出框的标题
const dialogTitle = $computed(() => {
  let title = "";
  const fileStat = fileStats?.[nowIndex];
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

let inited = $ref(false);

let nowIndex = $ref(0);

let iframeLoading = $ref(false);

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

let modelValue = $ref<string | null>();

// let tenantHost = $ref("");

const urlList = $computed(() => {
  const list: string[] = [];
  if (!modelValue) return list;
  const ids = modelValue.split(",").filter((x) => x);
  
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const fileStat = fileStats && fileStats[i];
    let lbl = fileStat?.lbl || "";
    if (lbl.length > 45) {
      lbl = lbl.substring(0, 45) + "...";
    }
    const url = getDownloadUrl({
      id,
      filename: lbl,
    });
    list.push(url);
  }
  return list;
});

// 已经加载过的iframe索引
let iframeShoweds = $ref<boolean[]>([ ]);

const customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

// 打开对话框
async function showDialog(
  {
    model,
  }: {
    model?: typeof dialogModel,
  },
): Promise<void> {
  inited = false;
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "medium",
    title: $$(dialogTitle),
    pointerPierce: true,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  // const tenantStore = usrTenantStore();
  // const { host } = await tenantStore.getHost();
  // tenantHost = host;
  let isChg = false;
  if (model?.modelValue !== modelValue) {
    isChg = true;
  }
  dialogModel = {
    modelValue: "",
    ...model,
  };
  modelValue = dialogModel.modelValue;
  if (isChg) {
    nowIndex = 0;
    iframeRefs = [ ];
    fileStats = [ ];
    iframeShoweds = [ true ];
    await getStatsOssEfc();
  }
  inited = true;
}

async function getStatsOssEfc() {
  const ids = modelValue?.split(",").filter((x) => x) || [ ];
  fileStats = await getStatsOss(ids);
}

function beforeNextIframe() {
  const eleRef = iframeRefs[nowIndex];
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

async function afterNextIframe() {
  const eleRef = iframeRefs[nowIndex];
  if (eleRef instanceof HTMLIFrameElement) {
    if (!iframeShoweds[nowIndex]) {
      iframeLoading = true;
      setTimeout(() => {
        iframeLoading = false;
      }, 2000);
      iframeShoweds[nowIndex] = true;
      return;
    }
    const iframeWindow = eleRef?.contentWindow;
    const iframeDocument = iframeWindow?.document;
    if (iframeDocument) {
      const videoEls = iframeDocument.getElementsByTagName("video");
      for (let i = 0; i < videoEls.length; i++) {
        const videoEl = videoEls[i];
        videoEl.play();
      }
    }
    return;
  }
}

async function previousClk() {
  if (nowIndex > 0) {
    beforeNextIframe();
    nowIndex--;
    await afterNextIframe();
  }
}

async function nextClk() {
  if (nowIndex < urlList.length - 1) {
    beforeNextIframe();
    nowIndex++;
    await afterNextIframe();
  }
  const eleRef = iframeRefs[nowIndex];
  // 如果不是iframe
  if (!(eleRef instanceof HTMLIFrameElement)) {
    iframeShoweds[nowIndex] = true;
  }
}

function iframeLoad() {
  iframeShoweds[nowIndex] = true;
  iframeLoading = false;
  for (let i = 0; i < iframeRefs.length; i++) {
    const iframeRef = iframeRefs[i];
    if (iframeRef instanceof HTMLIFrameElement) {
      try {
        initIframeEl(iframeRef);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

let iframeRefs = $ref<(HTMLIFrameElement | HTMLImageElement)[]>([ ]);

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
  if (!modelValue) {
    return;
  }
  const ids = modelValue.split(",").filter((x) => x);
  const id = ids[nowIndex];
  const url = getDownloadUrl(id);
  saveAs(url);
}

// 打印
function printClk() {
  const eleRef = iframeRefs[nowIndex];
  if (eleRef instanceof HTMLIFrameElement) {
    const iframeWindow = eleRef?.contentWindow;
    if (iframeWindow) {
      iframeWindow.print();
    }
  }
}

const fileRef = $ref<HTMLInputElement>();

async function inputChg() {
  if (!fileRef) return;
  modelValue = modelValue || "";
  const ids = modelValue.split(",").filter((x) => x);
  if (dialogModel.maxSize && ids.length >= dialogModel.maxSize) {
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
  if (ids.length > 0) {
    nowIndex++;
  }
  ids.splice(nowIndex, 0, id);
  modelValue = ids.join(",");
  await getStatsOssEfc();
  await afterNextIframe();
  iframeShoweds[nowIndex] = true;
  emit("change", modelValue);
}

// 点击上传附件
async function onUpload() {
  if (!fileRef) return;
  const ids = modelValue?.split(",").filter((x) => x) || [];
  if (dialogModel.maxSize && ids.length >= dialogModel.maxSize) {
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
  const ids = modelValue?.split(",").filter((x) => x);
  if (!ids || ids.length === 0) {
    return;
  }
  const ids2 = ids.filter((_, i) => i !== nowIndex);
  iframeShoweds = iframeShoweds.filter((_, i) => i !== nowIndex);
  fileStats = (fileStats || [ ]).filter((_, i) => i !== nowIndex);
  iframeRefs = iframeRefs.filter((_, i) => i !== nowIndex);
  modelValue = ids2.join(",");
  if (nowIndex >= ids2.length && ids2.length > 0) {
    nowIndex = ids2.length - 1;
    await afterNextIframe();
  }
  ElMessage.success(await nsAsync("删除成功"));
  emit("change", modelValue);
}

// 当前附件向前移动
function moveLeftClk() {
  const ids = modelValue?.split(",").filter((x) => x);
  if (!ids || ids.length === 0) {
    return;
  }
  const ids2 = ids.filter((_, i) => i !== nowIndex);
  const id = ids[nowIndex];
  ids2.splice(nowIndex - 1, 0, id);
  modelValue = ids2.join(",");
  previousClk();
  emit("change", modelValue);
}

// 当前附件向后移动
function moveRightClk() {
  const ids = modelValue?.split(",").filter((x) => x);
  if (!ids || ids.length === 0) {
    return;
  }
  const ids2 = ids.filter((_, i) => i !== nowIndex);
  const id = ids[nowIndex];
  ids2.splice(nowIndex + 1, 0, id);
  modelValue = ids2.join(",");
  nextClk();
  emit("change", modelValue);
}

function beforeClose(done: (cancel: boolean) => void) {
  beforeNextIframe();
  done(false);
  onCloseResolve({
    type: "cancel",
  });
}

defineExpose({ showDialog });
</script>
