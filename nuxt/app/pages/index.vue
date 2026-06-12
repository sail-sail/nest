<template>
<div>
  <div
    un-bg="blue-500"
    un-text="white"
    un-p="p-4"
    un-mb="mb-4"
    un-h="12"
    un-w="full"
  >
    index
  </div>

  <WebsiteEditDiv
    group="home"
    lbl="hero_text"
    :allow_types="[ 'text', 'textarea', 'image' ]"
    v-slot="{ val, type }"
  >
    <template v-if="type === 'image'">
      <img
        :src="getImageUrlByIds(val)[0]"
        alt="hero image"
        un-h="40"
        un-w="full"
        un-object-cover
      />
    </template>
    <template v-else>
      {{ val || "点击编辑英雄文本" }}
    </template>
  </WebsiteEditDiv>
</div>
</template>

<script setup lang="ts">
</script>
