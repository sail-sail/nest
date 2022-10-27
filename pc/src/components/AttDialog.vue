<template>
<el-dialog
  v-model="dialogVisible"
  :fullscreen="fullscreen"
  append-to-body
  :close-on-click-modal="false"
  :class="'custom_dialog AttDialog'"
  top="0"
  :before-close="beforeClose"
>
  <template #header>
    <div
      v-draggable
      class="dialog_title"
    >
      <div class="title_lbl">
        <span class="dialogTitle_span">{{ dialogTitle || " " }}</span>
      </div>
      <el-icon
        class="full_but"
        @click="setFullscreen"
      >
        <FullScreen />
      </el-icon>
    </div>
  </template>
  <div class="wrap_div">
    <div class="toolbox_div">
      
      <el-button
        v-if="!dialogModel.readonly && urlList.length > 0"
        type="primary"
        @click="uploadClk"
      >
        <template #icon>
          <Upload />
        </template>
        <span>上传</span>
      </el-button>
      
      <el-button
        v-if="urlList[nowIndex] && !dialogModel.readonly"
        plain
        type="danger"
        @click="deleteClk"
      >
        <template #icon>
          <Delete />
        </template>
        <span>删除</span>
      </el-button>
      
      <el-button
        v-if="urlList[nowIndex]"
        plain
        @click="downloadClk"
      >
        <template #icon>
          <Download />
        </template>
        <span>下载</span>
      </el-button>
      
      <el-button
        v-if="urlList[nowIndex]"
        @click="printClk"
      >
        <template #icon>
          <Printer />
        </template>
        <span>打印</span>
      </el-button>
      
      <a
        v-if="urlList[nowIndex]"
        class="el-button"
        style="text-decoration: none;"
        target="_blank"
        :href="urlList[nowIndex]"
      >
        网页中打开
      </a>
      
      <el-button
        v-if="urlList[nowIndex]"
        :disabled="nowIndex === 0"
        @click="moveLeftClk"
      >
        <template #icon>
          <ArrowLeft />
        </template>
        <span>前移</span>
      </el-button>
      
      <el-button
        v-if="urlList[nowIndex]"
        :disabled="nowIndex === urlList.length - 1"
        @click="moveRightClk"
      >
        <template #icon>
          <ArrowRight />
        </template>
        <span>后移</span>
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
          @active-change="backgroundColor = $event"
        />
      </div>
      
    </div>
    <div class="content_div">
      <template
        v-for="(url, i) in urlList"
        :key="url"
      >
        <iframe
          v-if="iframeShoweds[i]"
          :ref="(el) => { if (el) iframeRefs[i] = el }"
          :style="{ display: i === nowIndex ? '' : 'none', backgroundColor: backgroundColor || '' }"
          class="iframe"
          :src="url"
          frameborder="0"
          @load="iframeLoad"
        ></iframe>
      </template>
      <div
        v-if="urlList.length === 0"
        class="empty"
      >
        
        <el-button
          v-if="!dialogModel.readonly && urlList.length === 0"
          plain
          type="primary"
          @click="uploadClk"
        >
          <template #icon>
            <Upload />
          </template>
          <span>上传</span>
        </el-button>
        
        <div
          v-else-if="!dialogModel.readonly"
          class="empty"
        >
          <span>(暂无附件)</span>
        </div>
        
      </div>
      <div
        v-if="iframeLoading"
        class="loading_div"
      >
        加载中, 请稍后....
      </div>
    </div>
    <div
      v-if="urlList.length > 1"
      class="pagination_row"
    >
      <div class="pagination_div">
        
        <el-button
          :disabled="nowIndex <= 0"
          size="small"
          @click="previousClk"
        >
          <template #icon>
            <ArrowLeft />
          </template>
        </el-button>
        
        <span class="pagination_span">
          {{ nowIndex + 1 }} / {{ urlList.length }}
        </span>
        
        <el-button
          :disabled="nowIndex >= urlList.length - 1"
          size="small"
          @click="nextClk"
        >
          <template #icon>
            <ArrowRight />
          </template>
        </el-button>
        
      </div>
    </div>
  </div>
  <input
    ref="fileRef"
    type="file"
    :accept="dialogModel.accept"
    
    un-display-none
    
    @change="inputChg"
  />
</el-dialog>
</template>

<script lang="ts" setup>
import {
  ElIcon,
  ElDialog,
  ElButton,
  ElMessage,
  ElMessageBox,
  ElColorPicker,
} from "element-plus";

import {
  Upload,
  Delete,
  Download,
  Printer,
  FullScreen,
  ArrowLeft,
  ArrowRight,
} from "@element-plus/icons-vue";

import { useFullscreenEfc } from "@/compositions/fullscreen";
import { baseURL, uploadFile } from '@/utils/axios';

import {
  getStatsOss,
} from "./Api";
// import usrTenantStore from "@/store/tenant";

let { fullscreen, setFullscreen } = $(useFullscreenEfc());

const emit = defineEmits([
  "change",
]);

// 文件名列表
let fileStats = $ref<{
  id: string,
  lbl: string,
  content_type: string,
}[]>([ ]);

// 当前弹出框的标题
let dialogTitle = $computed(() => {
  let title = "";
  if (fileStats.length > 0) {
    title = fileStats[nowIndex]?.lbl;
  }
  return title;
});

let dialogVisible = $ref(false);

type DialogModel = {
  modelValue?: string,
  maxSize?: number,
  maxFileSize?: number,
  readonly?: boolean,
  accept?: string,
}

let dialogModel = $ref<DialogModel>({
  modelValue: "",
  maxSize: 1,
  maxFileSize: 1024 * 1024 * 50,
  readonly: false,
  accept: "",
});

let inited = $ref(false);

let nowIndex = $ref(0);

let iframeLoading = $ref(false);

let backgroundColor = $ref<string | null>("#000000");

let predefineColors = $ref([
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

let modelValue = $ref<string | undefined>("");

// let tenantHost = $ref("");

let urlList = $computed(() => {
  const list: string[] = [];
  if (!modelValue) return list;
  let ids = modelValue.split(",").filter((x) => x);
  
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const fileStat = fileStats && fileStats[i];
    let lbl = fileStat?.lbl || "";
    // let content_type = fileStat?.content_type || "";
    if (lbl.length > 45) {
      lbl = lbl.substring(0, 45) + "...";
    }
    let url = `${ baseURL }/api/oss/download/${ encodeURIComponent(lbl) }?id=${ encodeURIComponent(id) }`;
    // if (tenantHost) {
    //   if (content_type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    //     url = "https://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(tenantHost + url);
    //   }
    // }
    list.push(url);
  }
  return list;
});

// 已经加载过的iframe索引
let iframeShoweds = $ref<boolean[]>([ ]);

// 打开对话框
async function showDialog(
  { model }: { model?: typeof dialogModel },
): Promise<void> {
  inited = false;
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
    const ids = modelValue?.split(",").filter((x) => x);
    await getStatsOssEfc(ids);
  }
  inited = true;
  dialogVisible = true;
}

async function getStatsOssEfc(ids?: string[]): Promise<{
  id: string,
  lbl: string,
}[]> {
  if (!ids) {
    return [];
  }
  const data = await getStatsOss(ids);
  fileStats = fileStats.concat(data);
  return data;
}

function beforeNextIframe() {
  const iframeWindow = iframeRefs[nowIndex]?.contentWindow;
  const iframeDocument = iframeWindow?.document;
  if (iframeDocument) {
    const videoEls = iframeDocument.getElementsByTagName("video");
    for (let i = 0; i < videoEls.length; i++) {
      const videoEl = videoEls[i];
      videoEl.pause();
    }
  }
}

function afterNextIframe() {
  if (!iframeShoweds[nowIndex]) {
    iframeLoading = true;
    setTimeout(() => {
      iframeLoading = false;
    }, 2000);
    iframeShoweds[nowIndex] = true;
    return;
  }
  const iframeWindow = iframeRefs[nowIndex]?.contentWindow;
  const iframeDocument = iframeWindow?.document;
  if (iframeDocument) {
    const videoEls = iframeDocument.getElementsByTagName("video");
    for (let i = 0; i < videoEls.length; i++) {
      const videoEl = videoEls[i];
      videoEl.play();
    }
  }
}

function previousClk() {
  if (nowIndex > 0) {
    beforeNextIframe();
    nowIndex--;
    afterNextIframe();
  }
}

function nextClk() {
  if (nowIndex < urlList.length - 1) {
    beforeNextIframe();
    nowIndex++;
    afterNextIframe();
  }
}

function iframeLoad() {
  iframeShoweds[nowIndex] = true;
  iframeLoading = false;
  for (let i = 0; i < iframeRefs.length; i++) {
    const iframeRef = iframeRefs[i];
    try {
      initIframeEl(iframeRef);
    } catch (err) {
      console.error(err);
    }
  }
}

let iframeRefs = $ref<any[]>([ ]);

function initIframeEl(iframeRef: HTMLIFrameElement) {
  const iframeWindow = iframeRef?.contentWindow;
  const iframeDocument = iframeWindow?.document;
  if (!iframeDocument) {
    return;
  }
  let cssText = `
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
  let ids = modelValue.split(",").filter((x) => x);
  const id = ids[nowIndex];
  const url = `${ baseURL }/api/oss/download/?inline=0&id=${ encodeURIComponent(id) }`;
  window.location.href = url;
}

// 打印
function printClk() {
  const iframeWindow = iframeRefs[nowIndex]?.contentWindow;
  if (iframeWindow) {
    iframeWindow.print();
  }
}

let fileRef: HTMLInputElement|undefined = $ref(undefined);

async function inputChg() {
  if (!fileRef) return;
  modelValue = modelValue || "";
  const ids = modelValue.split(",").filter((x) => x);
  if (dialogModel.maxSize && ids.length >= dialogModel.maxSize) {
    fileRef.value = "";
    ElMessage.error(`最多只能上传 ${ dialogModel.maxSize } 个附件`);
    return;
  }
  const file = fileRef?.files?.[0];
  fileRef.value = "";
  if (!file) return;
  if (dialogModel?.maxFileSize && file.size > dialogModel.maxFileSize) {
    ElMessage.error(`文件大小不能超过 ${ dialogModel.maxFileSize / 1024 / 1024 }M`);
    return;
  }
  const id = await uploadFile(file);
  if (!id) {
    return;
  }
  if (ids.length > 0) {
    nowIndex++;
  }
  ids.splice(nowIndex, 0, id);
  modelValue = ids.join(",");
  afterNextIframe();
  await getStatsOssEfc([ id ]);
  emit("change", modelValue);
}

// 点击上传附件
function uploadClk() {
  if (!fileRef) return;
  const ids = modelValue?.split(",").filter((x) => x) || [];
  if (dialogModel.maxSize && ids.length >= dialogModel.maxSize) {
    fileRef.value = "";
    ElMessage.error(`最多只能上传 ${ dialogModel.maxSize } 个附件!`);
    return;
  }
  fileRef.click();
}

// 删除附件
async function deleteClk() {
  try {
    await ElMessageBox.confirm("确定删除当前附件吗？");
  } catch (err) {
    return;
  }
  const ids = modelValue?.split(",").filter((x) => x);
  if (!ids || ids.length === 0) {
    return;
  }
  const ids2 = ids.filter((_, i) => i !== nowIndex);
  iframeShoweds = iframeShoweds.filter((_, i) => i !== nowIndex);
  fileStats = fileStats.filter((_, i) => i !== nowIndex);
  iframeRefs = iframeRefs.filter((_, i) => i !== nowIndex);
  modelValue = ids2.join(",");
  if (nowIndex >= ids2.length && ids2.length > 0) {
    nowIndex = ids2.length - 1;
    afterNextIframe();
  }
  ElMessage.success("删除成功!");
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
}

defineExpose({ showDialog });
</script>

<style lang="scss" scoped>
.wrap_div {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-basis: inherit;
}
.content_div {
  flex: 1 0 0;
  overflow: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  flex-basis: inherit;
  padding-left: 5px;
  padding-right: 5px;
  padding-bottom: 5px;
  position: relative;
}
.toolbox_div {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  display: flex;
  align-items: center;
}
.pagination_row {
  padding-bottom: 5px;
  display: flex;
  justify-content: center;
}
.pagination_div {
  display: flex;
  align-items: center;
  // margin-right: 5px;
}
.pagination_span {
  color: gray;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.iframe {
  display: flex;
  flex: 1 0 0;
  overflow: hidden;
  width: 100%;
}
.empty {
  display: flex;
  flex: 1 0 0;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  color: gray;
  font-size: 22px;
}
.loading_div {
  display: flex;
  flex: 1 0 0;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  background-color: #FFF;
}
</style>

<style lang="scss">
.AttDialog {
  width: 900px;
}
</style>
