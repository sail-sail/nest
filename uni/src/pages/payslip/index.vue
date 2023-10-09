<template>
<view>
  <text>工资条</text>
  <text>id: {{ id }}</text>
</view>
</template>

<script lang="ts" setup>
import {
  checkLogin,
} from "../index/Api";

checkLogin();

let id = $ref("");

onLoad((query?: AnyObject) => {
  id = query?.id as string;
})
</script>
