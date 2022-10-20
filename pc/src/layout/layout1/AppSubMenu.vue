<template>
<template
  v-for="item in menus"
  :key="item.id"
>
  <el-sub-menu
    v-if="!item.route_path"
    :index="item.id"
  >
    <template #title>
      <el-icon>
        <FolderOpened v-if="openedIndex.includes(item.id)" />
        <Folder v-else />
      </el-icon>
      <span>{{ item.lbl }}</span>
    </template>
    <AppSubMenu
      v-if="item.children"
      :children="(item.children as MenuModel[])"
      :opened-index="openedIndex"
      :lvl="lvl"
    ></AppSubMenu>
  </el-sub-menu>
  <el-menu-item
    v-else
    :index="item.id"
    :route="{ path: item.route_path }"
    :class="{ top_menu_item: lvl === 1 }"
  >
    <el-icon v-if="lvl > 0">
      <Document />
    </el-icon>
    <span>
      {{ item.route_path ? "" : "-" }}
      {{ item.lbl }}
    </span>
  </el-menu-item>
</template>
</template>

<script setup lang="ts">
import { toRef } from "vue";

import {
  ElMenuItem,
  ElSubMenu,
  ElIcon,
} from "element-plus";

import {
  Folder,
  FolderOpened,
  Document,
} from "@element-plus/icons-vue";

import AppSubMenu from "./AppSubMenu2.vue";

import { MenuModel as MenuModel0 } from "#/types";

type MenuModel = MenuModel0 & {
  children: MenuModel[];
}

const props = withDefaults(
  defineProps<{
    children: MenuModel[];
    openedIndex: string[];
    lvl?: number;
  }>(),
  {
    children: () => [ ],
    openedIndex: () => [ ],
    lvl: 0,
  },
);

let menus = $ref(toRef(props, "children"));
let openedIndex = $ref(toRef(props, "openedIndex"));
let lvl = $ref(props.lvl);
lvl++;

</script>

<style lang="scss" scoped>
.top_menu_item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0;
  padding-bottom: 0;
  height: 40px;
}
</style>
