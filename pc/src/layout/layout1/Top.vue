<template>
<div
  un-flex="~ [1_0_0] row"
  un-overflow-hidden
  un-box-border
  un-justify-center
  un-items-center
  un-text="4"
  un-font="bold"
  un-whitespace-nowrap
>
  <div
    v-if="!menuStore.isCollapse"
  >
    {{ app_title }}
  </div>
</div>
</template>

<script setup lang="ts">
const menuStore = useMenuStore();

const {
  ns,
  nsAsync,
} = useI18n();

let app_title = $ref(import.meta.env.VITE_APP_TITLE);

async function initFrame() {
  app_title = await nsAsync(import.meta.env.VITE_APP_TITLE);
  document.title = app_title;
}

initFrame();
</script>
