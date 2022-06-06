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
      <template #header>
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
          <template #header>
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

const menuStore = useMenuStore();
const usrStore = useUsrStore();

let openedIndex: string[] = $ref([ ]);
let selectedRouteNext = $ref(false);

const route = useRoute();

watch(
  () => route.path,
  () => {
    if (selectedRouteNext) return;
    setDefaultActiveByRouter(route.path);
  },
);

function setDefaultActiveByRouter(path: string) {
  const menu = menuStore.getMenuByPath(path);
  defaultActive = menu ? menu.id : undefined;
}

function menuOpen(index: string, _indexPath: string[]) {
  openedIndex = [ index, ...menuStore.getParentIds(index) ];
}

function menuClose(index: string, _indexPath: string[]) {
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
  menuStore.setMenus(data);
  setDefaultActiveByRouter(route.path);
}

watch(
  () => usrStore.authorization,
  async () => {
    if (usrStore.authorization) {
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
