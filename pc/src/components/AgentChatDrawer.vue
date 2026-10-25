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
    <span class="agent-fab__text">智能助手</span>
  </button>

  <el-drawer
    v-model="open"
    class="agent-drawer"
    direction="rtl"
    :size="drawerSize"
    :with-header="false"
    append-to-body
    @open="onDrawerOpen"
  >
    <AgentChat ref="chatRef" />
  </el-drawer>
</template>

<script setup lang="ts">
import AgentChat from "./AgentChat.vue";
import { registerAssistantCollapse } from "@/utils/pageAgentBridge";

const open = ref(false);
const chatRef = ref<InstanceType<typeof AgentChat>>();
const route = useRoute();
const narrow = useMediaQuery("(max-width: 720px)");
const drawerSize = computed(() => (narrow.value ? "100%" : "640px"));
const onAgentPage = computed(() => route.path === "/agent");

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
  right: 18px;
  bottom: 18px;
  z-index: 2000;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 8px;
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
</style>
