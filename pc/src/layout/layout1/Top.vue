<template>
<div
  class="top_wrap"
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
    {{ ns(app_title) }}
  </div>
</div>
</template>

<script setup lang="ts">
const menuStore = useMenuStore();

const {
  ns,
} = useI18n();

const app_title = import.meta.env.VITE_APP_TITLE;

</script>

<style lang="scss" scoped>
.top_wrap {
  border-bottom: 1px solid hsla(0,0%,50.2%,.2);
}
</style>
