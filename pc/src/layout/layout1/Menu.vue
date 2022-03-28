<template>
<el-menu
  :default-active="defaultActive"
  class="AppMenu"
  :collapse="menuStore.isCollapse"
  background-color="#072540"
  text-color="#FFF"
  unique-opened
  @open="menuOpen"
  @close="menuClose"
  @select="menuSelect"
  router
>
  <template
    v-for="item in menuStore.menus"
    :key="item.id"
  >
    <el-sub-menu
      v-if="item.children && item.children.length > 0 && !item.route_path"
      :index="item.id"
    >
      <template #title>
        <el-icon>
          <FolderOpened v-if="openedIndex.includes(item.id)"/>
          <Folder v-else/>
        </el-icon>
        <span>{{ item.lbl }}</span>
      </template>
      <template
        v-for="item2 in item.children"
        :key="item2.id"
      >
        <el-sub-menu
          v-if="item2.children && item2.children.length > 0 && !item2.route_path"
          :index="item2.id"
        >
          <template #title>
            <el-icon>
              <FolderOpened v-if="openedIndex.includes(item2.id)"/>
              <Folder v-else/>
            </el-icon>
            <span>{{ item2.lbl }}</span>
          </template>
          <template
            v-for="item3 in item2.children"
            :key="item3.id"
          >
            <el-menu-item
              v-if="!item3.children || item3.children.length == 0"
              :index="item3.id"
              :route="{ path: item3.route_path, query: item3.route_query }"
            >
              <el-icon>
                <Document/>
              </el-icon>
              <span>
                {{ item3.route_path ? "" : "-" }}
                {{ item3.lbl }}
              </span>
            </el-menu-item>
          </template>
        </el-sub-menu>
        <el-menu-item
          v-if="!item2.children || item2.children.length == 0"
          :index="item2.id"
          :route="{ path: item2.route_path, query: item2.route_query }"
        >
          <el-icon>
            <Document/>
          </el-icon>
          <span>
            {{ item2.route_path ? "" : "-" }}
            {{ item2.lbl }}
          </span>
        </el-menu-item>
      </template>
    </el-sub-menu>
    <el-menu-item
      v-else-if="item.route_path"
      :index="item.id"
      :route="{ path: item.route_path, query: item.route_query }"
      class="top_menu_item"
    >
      <span>
        {{ item.route_path ? "" : "-" }}
        {{ item.lbl }}
      </span>
    </el-menu-item>
  </template>
</el-menu>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import {
  ElMenu,
  ElMenuItem,
  ElSubMenu,
  ElIcon,
} from "element-plus";
import {
  Folder,
  FolderOpened,
  Document,
} from "@element-plus/icons-vue";
import useMenuStore from "@/store/menu";
import useUsrStore from "@/store/usr";
import { getMenus } from "./Api";
import { MenuModel } from "@/views/menu/Model";

const menuStore = useMenuStore();
const usrStore = useUsrStore();

let openedIndex: string[] = $ref([ ]);
let selectedRouteNext = $ref(false);

const route = useRoute();

watch([
  () => route.path,
], () => {
  if (selectedRouteNext) return;
  setDefaultActiveByRouter(route.path);
});

function setDefaultActiveByRouter(path: string) {
  for (let i = 0; i < menuStore.menus.length; i++) {
    const menu = menuStore.menus[i];
    if (menu.route_path === path) {
      defaultActive = menu.id;
      return;
    }
    for (let k = 0; k < menu.children.length; k++) {
      const item = menu.children[k];
      if (item.route_path === path) {
        defaultActive = item.id;
        return;
      }
      if (item.children && item.children.length > 0) {
        for (let j = 0; j < item.children.length; j++) {
          const item2 = item.children[j];
          if (item2.route_path === path) {
            defaultActive = item2.id;
            return;
          }
          if (item2.children && item2.children.length > 0) {
            for (let l = 0; l < item2.children.length; l++) {
              const item3 = item2.children[l];
              if (item3.route_path === path) {
                defaultActive = item3.id;
                return;
              }
            }
          }
        }
      }
    }
  }
}

function getParentIds(id: string): string[] {
  let parentIds: string[] = [ ];
  let menus = menuStore.menus;
  let parentId = id;
  const tmpFn = function(menus: MenuModel[]) {
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      if (menu.id === parentId) {
        parentIds.push(menu.menu_id);
        parentId = menu.menu_id;
      }
      const children = menu.children;
      if (children && children.length > 0) {
        tmpFn(children);
      }
    }
  };
  tmpFn(menus);
  return parentIds;
}

function menuOpen(index: string, indexPath: string[]) {
  openedIndex = [ index, ...getParentIds(index) ];
}

function menuClose(index: string, indexPath: string[]) {
  openedIndex = openedIndex.filter((item) => item !== index);
}

function menuSelect(index: string) {
  selectedRouteNext = true;
  setTimeout(() => {
    selectedRouteNext = false;
  }, 0);
}

let defaultActive = $ref<string>();

async function getMenusEfc() {
  const data = await getMenus({ type: "pc" });
  if (data) {
    menuStore.setMenus(data);
  }
}

watch(
  () => usrStore.access_token,
  async () => {
    if (usrStore.access_token) {
      await getMenusEfc();
    } else {
      menuStore.setMenus([ ]);
    }
  },
  {
    immediate: true,
  },
);
</script>

<style scoped>
.AppMenu {
  width: 100%;
  box-sizing: unset;
}
.top_menu_item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 0;
  padding-bottom: 0;
  height: 40px;
}
</style>
