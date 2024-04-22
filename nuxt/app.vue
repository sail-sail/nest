<template>
<div>
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
