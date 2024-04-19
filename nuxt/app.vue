<template>
<div
  un-text="red"
>
  {{ data }}
  <div un-i="iconfont-moon"></div>
</div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "My Amazing Site",
  description: "This is my amazing site, let me tell you all about it.",
  keywords: "amazing, site, awesome",
  ogTitle: "My Amazing Site",
  ogDescription: "This is my amazing site, let me tell you all about it.",
  ogImage: "https://example.com/image.png",
});

const res = await $fetch("/api/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: /* GraphQL */ `
      query($domain: String!) {
        getLoginTenants(domain: $domain) {
          id
          lbl
        }
      }
    `,
    variables: {
      domain: "localhost:4000",
    },
  }),
});
let data = $ref(res.data);
</script>
