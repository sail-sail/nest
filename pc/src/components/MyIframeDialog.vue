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
      un-flex="~ [3_0_0] col basis-[inherit]"
      un-overflow-hidden
      un-m="x-4"
      un-pos-relative
    >
      <iframe
        v-if="dialogModel.url"
        ref="iframeRef"
        
        un-flex="~ [1_0_0] col"
        un-overflow-hidden
        un-w="full"
        un-h="full"
        un-box-border
        
        :src="dialogModel.url"
        frameborder="0"
        seamless
        @load="iframeLoad"
      ></iframe>
      <div
        v-if="!iframeLoaded"
        un-pos-absolute
        un-w="full"
        un-h="full"
        un-top="0"
        un-left="0"
        z-index="2"
        un-flex="~ col"
        un-justify-center
        un-items-center
        un-bg="gray-200"
      >
        <div
          un-text="5 black font-bold"
        >
          {{ ns('加载中...') }}
        </div>
      </div>
    </div>
    
    <div
      un-p="y-2.5"
      un-flex
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
        <span>{{ ns('关闭') }}</span>
      </el-button>
      
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>
import {
  type CustomDialogType,
} from "@/components/CustomDialog.vue";

const {
  ns,
} = useI18n("/base/usr");

let inited = $ref(false);

let dialogAction = $ref<"print">("print");

let dialogModel = $ref(getDefaultModel());

/** 增加时的默认值 */
function getDefaultModel() {
  return {
    url: "",
  };
}

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

const customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    type: CustomDialogType,
    model?: {
      url: string;
    };
    action: typeof dialogAction;
  },
) {
  inited = false;
  const title = arg?.title;
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: arg?.type || "default",
    title,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const model = arg?.model;
  const action = arg?.action;
  dialogAction = action || "print";
  dialogModel = {
    ...getDefaultModel(),
    ...model,
  };
  
  inited = true;
  return await dialogRes.dialogPrm;
}

const iframeRef = $ref<HTMLIFrameElement>();

let iframeLoaded = $ref(false);

function iframeLoad() {
  iframeLoaded = true;
  try {
    initIframeEl();
  } catch (err) {
    // console.error(err);
  }
}

// iframe加载完毕之后的后续处理, 固定表头
function initIframeEl() {
  if (!iframeRef) {
    return;
  }
  const iframeWindow = iframeRef.contentWindow;
  if (!iframeWindow) {
    return;
  }
  const iframeDocument = iframeWindow.document;
  // 处理滚动条样式
  iframeDocument.styleSheets[0].insertRule(`
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
    html {
      overflow: auto;
    }
  `);
}

/** 点击取消关闭按钮 */
function cancelClk() {
  dialogModel = getDefaultModel();
  onCloseResolve({
    type: "cancel",
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  dialogModel = getDefaultModel();
  done(false);
  onCloseResolve({
    type: "cancel",
  });
}

defineExpose({ showDialog });
</script>
