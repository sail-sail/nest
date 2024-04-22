<template>
<div
  un-text="red"
>
  <div un-i="iconfont-moon"></div>
</div>
</template>

<script setup lang="ts">
import "@/utils/DateUtil";

import {
  useMySeoMeta,
} from "./Api";

await useMySeoMeta();

</script>
