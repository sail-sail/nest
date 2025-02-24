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

// 租户
import {
  findById as findByIdTenant,
} from "@/views/base/tenant/Api.ts";

const menuStore = useMenuStore();
const usrStore = useUsrStore();

let app_title = $ref(localStorage.getItem("app_title") ?? "");

if (app_title) {
  useTitle(app_title);
}

async function initFrame() {
  const tenant_id = usrStore.tenant_id;
  if (!tenant_id) {
    return;
  }
  const tenant_model = await findByIdTenant(tenant_id);
  if (!tenant_model) {
    return;
  }
  app_title = tenant_model.title;
  useTitle(app_title);
  localStorage.setItem("app_title", app_title);
}

initFrame();
</script>
