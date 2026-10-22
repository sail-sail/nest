<template>
<div class="agent-page">
  <AgentChat />
</div>
</template>

<script setup lang="ts">
import AgentChat from "@/components/AgentChat.vue";

defineOptions({
  name: "智能助手",
});
</script>

<style lang="scss" scoped>
.agent-page {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
</style>
