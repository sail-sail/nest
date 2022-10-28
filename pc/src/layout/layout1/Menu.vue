<template>
<el-menu
  
  un-w="full"
  
  :default-active="defaultActive"
  :collapse="menuStore.isCollapse"
  background-color="#072540"
  text-color="#FFF"
  unique-opened
  :router="false"
  @open="menuOpen"
  @close="menuClose"
  @select="menuSelect"
>
  <AppSubMenu
    :children="(menuStore.menus as any[])"
    :opened-index="openedIndex"
  ></AppSubMenu>
</el-menu>
</template>

<script setup lang="ts">
import { watch } from "vue";

import {
  useRoute,
  useRouter,
} from "vue-router";

import {
  ElMenu,
} from "element-plus";

import useMenuStore from "@/store/menu";
import useUsrStore from "@/store/usr";
import { getMenus } from "./Api";
import AppSubMenu from "./AppSubMenu.vue";

const menuStore = useMenuStore();
const usrStore = useUsrStore();

let openedIndex = $ref<string[]>([ ]);
let selectedRouteNext = $ref(false);

const route = useRoute();
const router = useRouter();

watch(
  [
    () => route.path,
    () => route.query,
  ],
  () => {
    if (selectedRouteNext) return;
    setDefaultActiveByRouter(route.path, route.query);
  },
);

function setDefaultActiveByRouter(path: string, query: typeof route.query) {
  const menu = menuStore.getMenuByPath(path, query);
  defaultActive = menu ? menu.id : undefined;
}

function menuOpen(index: string, _indexPath: string[]) {
  openedIndex = [ index, ...menuStore.getParentIds(index) ];
}

function menuClose(index: string, _indexPath: string[]) {
  openedIndex = openedIndex.filter((item) => item !== index);
}

async function menuSelect(id: string) {
  selectedRouteNext = true;
  const model = menuStore.getMenuById(id);
  if (model) {
    await router.push({
      path: model.route_path,
      query: model.route_query,
    });
  }
  setTimeout(() => {
    selectedRouteNext = false;
  }, 0);
}

let defaultActive = $ref<string | undefined>();

async function getMenusEfc() {
  const result = await getMenus({ type: "pc" });
  if(result && result.length > 0) {
    menuStore.setMenus(result);
  }
  setDefaultActiveByRouter(route.path, route.query);
}

async function initFrame() {
  if (usrStore.authorization) {
    await getMenusEfc();
  } else {
    menuStore.setMenus([ ]);
  }
}

usrStore.onLogin(initFrame);

initFrame();
</script>
