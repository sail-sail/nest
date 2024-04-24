<template>
<div
  id="app"
>
  <TransitionGroup
    class="app_message"
    name="app_message"
    tag="div"
  >
    <div
      v-for="(item, i) in msgs.filter(item => item.hide === false)"
      :key="i"
      class="app_message_inner"
      :class="{
        app_message_error: item.type === 'error',
        app_message_info: item.type === 'info',
      }"
    >
      {{ item.content }}
    </div>
  </TransitionGroup>
  <NuxtPage />
</div>
</template>

<script setup lang="ts">
import "@/utils/DateUtil";

import {
  useMsgs,
} from "./compositions/msg";

import {
  useMySeoMeta,
} from "./Api";


const { msgs } = $(useMsgs());

await useMySeoMeta();
</script>

<style lang="scss">
#app,#__nuxt {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.app_message-move,
.app_message-enter-active,
.app_message-leave-active {
  transition: all 0.3s ease;
}
.app_message-enter-from,
.app_message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.app_message-leave-active {
  position: absolute;
}
</style>
