<template>
  <button
    v-if="!onAgentPage"
    v-bind="$attrs"
    class="agent-fab"
    type="button"
    title="打开智能助手"
    @click="open = true"
  >
    <!-- <span class="agent-fab__logo">AI</span> -->
    <span class="agent-fab__text">AI</span>
  </button>

  <el-drawer
    v-model="open"
    class="agent-drawer"
    direction="rtl"
    :size="drawerSize"
    :resizable="!narrow"
    :with-header="false"
    append-to-body
    @open="onDrawerOpen"
    @resize-end="onDrawerResizeEnd"
  >
    <AgentChat ref="chatRef" />
  </el-drawer>
</template>

<script setup lang="ts">
import AgentChat from "./AgentChat.vue";
import { registerAssistantCollapse } from "@/utils/pageAgentBridge";

/** 抽屉默认宽度(px) */
const DRAWER_DEFAULT_WIDTH = 640;
/** 抽屉最小宽度(px) */
const DRAWER_MIN_WIDTH = 420;
/** 抽屉最大宽度占视口比例 */
const DRAWER_MAX_WIDTH_RATIO = 0.92;

const open = ref(false);
const chatRef = ref<InstanceType<typeof AgentChat>>();
const route = useRoute();
const narrow = useMediaQuery("(max-width: 720px)");
const { width: windowWidth } = useWindowSize();

/** 智能助手抽屉宽度，拖拽后持久化到 localStorage */
const drawerWidth = useStorage<number>("store.agent.drawerWidth", DRAWER_DEFAULT_WIDTH);

const drawerSize = computed(() => (narrow.value ? "100%" : `${ clampDrawerWidth(drawerWidth.value) }px`));
const onAgentPage = computed(() => route.path === "/agent");

/** 限制抽屉宽度在 [最小宽度, 视口比例] 之间 */
function clampDrawerWidth(width: number) {
  if (!Number.isFinite(width) || width <= 0) {
    return DRAWER_DEFAULT_WIDTH;
  }
  const viewport = windowWidth.value || window.innerWidth;
  const maxWidth = Math.max(DRAWER_MIN_WIDTH, Math.round(viewport * DRAWER_MAX_WIDTH_RATIO));
  return Math.min(Math.max(Math.round(width), DRAWER_MIN_WIDTH), maxWidth);
}

/** 拖拽结束：记录宽度 */
function onDrawerResizeEnd(_evt: MouseEvent, size: number) {
  if (!Number.isFinite(size)) {
    return;
  }
  drawerWidth.value = clampDrawerWidth(size);
}

function onDrawerOpen() {
  nextTick(() => chatRef.value?.onOpen());
}

watch(
  () => route.path,
  (path) => {
    if (path === "/agent") open.value = false;
  },
);

registerAssistantCollapse(async () => {
  if (!open.value) return;
  open.value = false;
  // 等 el-drawer 的收起动画结束，否则它仍会盖在页面元素上
  await new Promise((resolve) => setTimeout(resolve, 320));
});

onUnmounted(() => registerAssistantCollapse(null));
</script>

<style lang="scss" scoped>
.agent-fab {
  position: fixed;
  right: 7px;
  bottom: 41px;
  z-index: 2000;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  width: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #4f7cff, #7a5cff);
  color: #fff;
  box-shadow: 0 8px 24px rgba(79, 124, 255, 0.35);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.agent-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(79, 124, 255, 0.45);
}

.agent-fab__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.agent-fab__text {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
</style>

<style lang="scss">
.agent-drawer .el-drawer__body {
  padding: 0;
  overflow: hidden;
}

/* 桌面端限制宽度区间，拖拽时既不会缩没，也不会盖满整个视口 */
@media (min-width: 721px) {
  .agent-drawer {
    min-width: 420px;
    max-width: 92vw;
  }
}

/* 拖拽手柄：hover 前给一条淡色提示线，便于发现可拖宽 */
.agent-drawer .el-drawer__dragger::before {
  background-color: var(--el-border-color);
  opacity: 0.75;
}

.agent-drawer .el-drawer__dragger:hover::before {
  background-color: var(--el-color-primary);
  opacity: 1;
}
</style>
