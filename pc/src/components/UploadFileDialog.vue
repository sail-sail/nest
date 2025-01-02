<template>
<el-dialog
  v-model="dialogVisible"
  draggable
  :fullscreen="fullscreen"
  append-to-body
  :close-on-click-modal="false"
  class="custom_dialog auto_dialog UploadFileDialog"
  top="0"
  :before-close="beforeClose"
>
  <template #header>
    <div
      v-draggable
      class="dialog_title"
    >
      <div class="title_lbl">
        <span class="title_span">{{ dialogTitle || " " }}</span>
      </div>
      <ElIconFullScreen
        class="full_but"
        @click="setFullscreen"
      ></ElIconFullScreen>
    </div>
  </template>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
  >
    <div
      un-flex="~ [1_0_0] col basis-[inherit]"
      un-justify-start
      un-items-center
      un-p="[40px]"
    >
      <div
        un-justify-end
        un-items-end
        un-grid="~ rows-[auto] cols-[repeat(1,minmax(min-content,max-content)_280px)]"
        un-gap="x-[16px] y-[16px]"
        un-place-content-center
      >
        
        <label
          un-m="l-1"
          un-text-right
          un-self-center
          un-whitespace-nowrap
          un-after="content-[quoted::]"
        >
          <span style="color: red;">*</span>
          <span>{{ ns("文件") }}</span>
        </label>
        <div
          un-w="full"
          un-justify-start
        >
          <div
            un-w="full"
            un-h="[200px]"
            un-border="[#ccc] dashed"
            un-rounded="[6px]"
            un-cursor-pointer
            un-flex="~"
            un-justify-center
            un-items-center
            un-p="[10px]"
            un-box-border
            un-overflow-auto
            
            @click="fileRef?.click()"
          >
            <template v-if="fileInfo.name">
              <span style="font-size: 16px;">
                {{ fileInfo.name }}
              </span>
            </template>
            <template v-else>
              <el-icon
                size="48px"
                color="#ccc"
              >
                <ElIconPlus />
              </el-icon>
            </template>
          </div>
        </div>
        
        <template v-if="template">
          <label
            un-m="l-1"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            un-after="content-[quoted::]"
          >
            <span>{{ ns("导入模板") }}</span>
          </label>
          <div
            un-w="full"
            un-justify-start
          >
            <el-link
              un-m="l-1"
              type="primary"
              @click="onDownloadImportTemplate"
            >
              {{ ns("下载导入模板") }}
            </el-link>
          </div>
        </template>
        
      </div>
    </div>
    <div
      un-p="t-[10px] b-5"
      un-flex="~"
      un-justify-center
      un-items-center
    >
      
      <el-button
        plain
        @click="cancelClk"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>{{ ns("取消") }}</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        :disabled="!fileInfo.name"
        @click="confirmClk"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ ns("确定") }}</span>
      </el-button>
      
    </div>
  </div>
  <input
    ref="fileRef"
    type="file"
    :accept="accept"
    un-hidden
    @change="inputChg"
  />
</el-dialog>
</template>

<script lang="ts" setup>
const {
  ns,
  nsAsync,
} = useI18n();

const {
  fullscreen,
  setFullscreen,
} = $(useFullscreenEfc());

let dialogTitle = $ref(ns("上传"));
let dialogVisible = $ref(false);

let template = $ref(true);

let accept = $ref<string>();

const emit = defineEmits<{
  downloadImportTemplate: [],
}>();

const fileRef = $ref<HTMLInputElement>();

let fileObj: File;
let fileInfo = $ref({
  name: "",
  size: 0,
});

let onCloseResolve = function(value?: File) { };

async function showDialog(
  arg?: {
    title?: string,
    template?: boolean,
    templateName?: string,
    accept?: string,
  },
) {
  if (arg) {
    dialogTitle = arg.title || await nsAsync("上传");
  }
  if (arg?.template != null) {
    template = arg.template;
  }
  if (arg?.accept != null) {
    accept = arg.accept;
  }
  
  fileInfo = {
    name: "",
    size: 0,
  };
  dialogVisible = true;
  if (fileRef) {
    fileRef.value = "";
  } else {
    nextTick(() => {
      if (fileRef) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fileRef as any).value = "";
      }
    });
  }
  const reslut = await new Promise<File|undefined>((resolve) => {
    onCloseResolve = resolve;
  });
  return reslut;
}

/**
 * 下载导入模板
 */
function onDownloadImportTemplate() {
  emit("downloadImportTemplate");
}

async function inputChg() {
  if (!fileRef) {
    return;
  }
  const file = fileRef.files?.[0];
  if (!file) {
    return;
  }
  fileRef.value = "";
  fileInfo.name = file.name;
  fileInfo.size = file.size;
  fileObj = file;
}

async function confirmClk() {
  if (!fileObj) {
    return;
  }
  dialogVisible = false;
  onCloseResolve(fileObj);
}

async function cancelClk() {
  if (fileObj && fileInfo.name) {
    try {
      await ElMessageBox.confirm(await nsAsync(`文件 {0} 尚未上传, 确定取消?`, fileInfo.name), {
        confirmButtonText: await nsAsync("取消"),
        cancelButtonText: await nsAsync("我再想想"),
        type: "warning",
      });
    } catch (err) {
      return;
    }
  }
  dialogVisible = false;
  onCloseResolve();
}

async function beforeClose(done: (cancel: boolean) => void) {
  if (fileObj && fileInfo.name) {
    try {
      await ElMessageBox.confirm(await nsAsync(`文件 {0} 尚未上传, 确定取消?`, fileInfo.name), {
        confirmButtonText: await nsAsync("取消"),
        cancelButtonText: await nsAsync("我再想想"),
        type: "warning",
      });
    } catch (err) {
      return;
    }
  }
  done(false);
  onCloseResolve();
}
defineExpose({ showDialog });
</script>
