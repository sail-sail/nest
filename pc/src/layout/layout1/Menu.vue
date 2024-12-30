<template>
<div
  un-flex="~ col"
  un-overflow-hidden
  un-w="full"
>
  <div
    un-flex="~"
    un-overflow-hidden
    un-h="8"
    un-justify-end
    un-items-center
  >
    <div
      un-flex="~ [1_0_0]"
      un-overflow-hidden
      un-w="full"
      un-justify-center
      un-items-center
      un-h="8"
    >
      <div
        v-if="!menuStore.isCollapse"
        un-flex="~ [1_0_0]"
        un-justify-center
        un-items-center
        un-b="1 solid gray-200 dark:gray-600 hover:[var(--el-color-primary)]"
        un-m="l-2"
        un-rounded="md"
        un-text="3 gray hover:[var(--el-color-primary)]"
        un-pos-relative
        un-h="6"
      >
        <div
          v-show="!menuStore.search && !menuSearchForcused"
          un-flex="~ [1_0_0]"
          un-h="full"
          un-justify-center
          un-items-center
          un-cursor-pointer
          @click="menuSearchClk"
        >
          <el-icon
            un-text="3.5"
          >
            <ElIconSearch />
          </el-icon>
          <span
            un-m="l-1"
          >
            {{ ns('菜单导航') }}
          </span>
        </div>
        <input
          v-show="menuStore.search || menuSearchForcused"
          ref="menuSearchInputRef"
          v-model="menuStore.search"
          un-w="full"
          un-h="full"
          un-rounded="md"
          un-text="3 center"
          un-b="0"
          un-p="l-4 r-6"
          un-bg="transparent"
          clearable
          :placeholder="ns('菜单导航')"
          un-pos-absolute
          un-left="0"
          un-top="0"
          un-box-border
          @blur="menuSearchBlur"
        />
        <el-icon
          v-show="menuStore.search"
          un-pos="absolute"
          un-right="2"
          un-text="gray hover:red"
          un-cursor-pointer
          @click="menuStore.search = '';menuSearchForcused = false"
        >
          <ElIconClose />
        </el-icon>
      </div>
      <div
        un-p="x-2"
        un-box-border
        un-cursor-pointer
        un-text="gray-400 hover:[var(--el-color-primary)]"
        @click="menuStore.isCollapse = !menuStore.isCollapse"
      >
        <el-icon
          size="18"
          un-self-center
        >
          <ElIconExpand
            v-if="menuStore.isCollapse"
          />
          <ElIconFold
            v-else
          />
        </el-icon>
      </div>
    </div>
  </div>
  <div
    un-flex="~ [1_0_0] col"
    un-overflow="auto"
    un-p="b-2"
    un-box-border
  >
    <el-menu
      class="AppMenu"
      :class="{
        AppMenuNotInited: !inited,
      }"
      un-w="full"
      :default-active="defaultActive"
      :collapse="menuStore.isCollapse"
      :collapse-transition="false"
      unique-opened
      :router="false"
      @open="(menuOpen as any)"
      @close="(menuClose as any)"
      @select="(menuSelect as any)"
    >
      <AppSubMenu
        :children="(menuStore.menus as any[])"
        :opened-index="openedIndex"
      ></AppSubMenu>
    </el-menu>
  </div>
</div>
</template>

<script lang="ts" setup>
import {
  getMenus,
} from "./Api";

import type {
  LocationQueryRaw,
} from "vue-router";

const menuStore = useMenuStore();
const usrStore = useUsrStore();
const tabsStore = useTabsStore();

const {
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns,
} = useI18n();

let inited = $ref(false);

let menuSearchForcused = $ref(false);
const menuSearchInputRef = $ref<HTMLInputElement>();

function menuSearchClk() {
  menuSearchForcused = true;
  nextTick(() => {
    menuSearchInputRef?.focus();
  });
}

function menuSearchBlur() {
  if (!menuStore.search) {
    menuSearchForcused = false;
  }
}

let openedIndex = $ref<MenuId[]>([ ]);
let selectedRouteNext = $ref(false);

const route = useRoute();
const router = useRouter();

let defaultActive = $ref<MenuId>();

watch(
  [
    () => route.path,
    () => route.query,
  ],
  () => {
    if (selectedRouteNext) return;
    setDefaultActiveByRouter(route.path, route.query);
  },
  {
    immediate: true,
  },
);

function setDefaultActiveByRouter(path: string, query: typeof route.query) {
  const menu = menuStore.getMenuByPath(path, query);
  defaultActive = menu ? menu.id : undefined;
}

function menuOpen(index: MenuId, _indexPath: string[]) {
  openedIndex = [ index, ...menuStore.getParentIds(index) ];
}

function menuClose(index: MenuId, _indexPath: string[]) {
  openedIndex = openedIndex.filter((item) => item !== index);
}

async function menuSelect(id: MenuId) {
  selectedRouteNext = true;
  const model = menuStore.getMenuById(id);
  if (model) {
    const path = model.route_path;
    let query: LocationQueryRaw | undefined = undefined;
    if (model.route_query) {
      query = JSON.parse(model.route_query);
    }
    const hasTab = tabsStore.hasTab({
      path,
      query,
    });
    await router.push({
      path,
      query,
    });
    if (hasTab) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const comp = route.matched[1].instances?.default as any;
      await comp?.refresh?.();
    }
  }
  setTimeout(() => {
    selectedRouteNext = false;
  }, 0);
}

async function getMenusEfc() {
  inited = false;
  const result = await getMenus();
  menuStore.setMenus(result);
  setDefaultActiveByRouter(route.path, route.query);
  inited = true;
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
.AppMenu {
  --el-menu-item-height: 40px;
  --el-menu-sub-item-height: var(--el-menu-item-height);
  border: 0;
  :deep(.el-menu-item.is-active) {
    background-color: var(--el-menu-hover-bg-color);
  }
  :deep(.el-sub-menu.is-active>.el-sub-menu__title) {
    color: var(--el-color-primary);
  }
  :deep(.el-menu-item.is-active:after) {
    content: "";
    width: 6px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--el-color-primary);
  }
}
//.top_menu_item {
//  align-items: center;
//  justify-content: center;
//}
.AppMenuNotInited {
  :deep(.el-menu), :deep(.el-icon) {
    transition: none;
  }
}
</style>
