<template>
<el-menu
  class="AppMenu"
  un-w="full"
  :default-active="defaultActive"
  :collapse="menuStore.isCollapse"
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

<style lang="scss" scoped>
.dark .AppMenu {
  --el-menu-bg-color: black;
}
.AppMenu {
  --el-menu-bg-color: #072540;
  --el-menu-border-color: var(--el-border-color-lighter);
  --el-menu-text-color: #FFF;
  --el-menu-item-height: 40px;
  --el-menu-sub-item-height: var(--el-menu-item-height);
  --el-menu-active-color: var(--el-color-primary);
  --el-menu-hover-bg-color: var(--el-color-black);
  :deep(.el-menu-item.is-active) {
    background-color: var(--el-color-black);
  }
  :deep(.el-menu-item.is-active:after) {
    content: "";
    width: 5px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--el-color-primary);
  }
  border: 0;
}
.top_menu_item {
  // align-items: center;
  // justify-content: center;
}
</style>
