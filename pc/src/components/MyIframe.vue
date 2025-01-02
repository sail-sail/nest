<template>
<div
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  <iframe
    v-if="src"
    ref="iframeRef"
    
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
    un-w="full"
    un-h="full"
    un-box-border
    
    :src="src"
    frameborder="0"
    seamless
    @load="iframeLoad"
  ></iframe>
  <template v-else>
    <div
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
      un-justify-center
    >
      <el-empty description="页面不存在!">
      </el-empty>
    </div>
  </template>
</div>
</template>

<script lang="ts" setup>
const route = useRoute();
const tabs = useTabsStore();

let stopWatch: ReturnType<typeof watch> | undefined;

onActivated(function() {
  stopWatch = watch(
    () => route.query.name,
    () => {
      if (tabs.actTab && route.query.name) {
        tabs.actTab.lbl = route.query.name as string;
      }
    },
    {
      immediate: true,
    },
  );
});

onDeactivated(function() {
  if (stopWatch) {
    stopWatch();
  }
});

const urlPath = $ref("");
const iframeRef = $ref<HTMLIFrameElement>();

function iframeLoad() {
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

const src = $computed(() => {
  return route.query.src ? (route.query.src as string).replace("$", "#") : urlPath;
});
</script>
