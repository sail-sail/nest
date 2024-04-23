<template>
<div
  id="app"
>
  <NuxtPage />
</div>
</template>

<script setup lang="ts">
import "@/utils/DateUtil";

import {
  useMySeoMeta,
} from "./Api";

await useMySeoMeta();
</script>

<style lang="scss">
#app,#__nuxt {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
