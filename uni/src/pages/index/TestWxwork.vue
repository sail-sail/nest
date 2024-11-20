<template>
<view
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  <view
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
  >
    <view
      un-flex="~ [1_0_0] col"
      un-overflow-auto
    >
      {{ data }}
    </view>
    <view
      un-m="x-2"
    >
      <tm-button
        @click="findAllRoleEfc"
        label="测试调用接口"
        block
      ></tm-button>
    </view>
  </view>
  <AppLoading></AppLoading>
</view>
</template>

<script lang="ts" setup>
import type {
  RoleModel,
} from "@/typings/types";

import {
  findAllRole,
} from "./Api";

let data = $ref<RoleModel[]>();

async function findAllRoleEfc() {
  data = await findAllRole();
}
</script>
