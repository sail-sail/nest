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
>
  {{ ns(app_title) }}
</div>
</template>

<script setup lang="ts">
const app_title = import.meta.env.VITE_APP_TITLE;

const {
  ns,
} = useI18n();

</script>

<style lang="scss" scoped>
.top_wrap {
  border-bottom: 1px solid hsla(0,0%,50.2%,.2);
}
</style>
