<template>
<div class="wrap_div">
  <Login v-if="!usrStore.access_token"></Login>
  <div class="menu_div" :class="{ menu_collapse: menuStore.isCollapse }">
    <div class="top_div">
      <Top></Top>
    </div>
    <LeftMenu class="left_menu"></LeftMenu>
  </div>
  <div class="center_div">
    <div class="top_div center_top_div">
      <el-icon class="fold_icon" @click="menuStore.isCollapse = !menuStore.isCollapse">
        <Expand v-if="menuStore.isCollapse"/>
        <Fold v-else/>
      </el-icon>
      <Tabs class="tabs_div" :tabs="tabsStore.tabs"></Tabs>
      <div style="display: flex;align-items: center;">
        <div class="tab_dropdown">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-icon size="18" color="#FFF">
                <ArrowDownBold />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu style="white-space: nowrap;">
                <el-dropdown-item @click="closeOtherTabs">关闭其它</el-dropdown-item>
                <el-dropdown-item @click="clearCacheEfc">清空缓存</el-dropdown-item>
                <el-dropdown-item divided @click="logoutClk">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="content_div">
      <router-view v-slot="{ Component, route }">
        <keep-alive :max="20" v-if="!route.meta.notKeepAlive">
          <component :is="Component"/>
        </keep-alive>
        <component :is="Component" v-else/>
      </router-view>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import {
  ElMessage,
  ElMessageBox,
  ElIcon,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from "element-plus";
import {
  Fold,
  Expand,
  ArrowDownBold,
} from "@element-plus/icons-vue";
import {
  RouterView,
} from "vue-router";
import { onMounted, watch } from "vue";
import useTabsStore from "@/store/tabs";
import useUsrStore from "@/store/usr";
import useMenuStore from "@/store/menu";
import useIndexStore from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import Login from "./Login.vue";
import LeftMenu from "./Menu.vue";
import Top from "./Top.vue";
import Tabs from "./Tabs.vue";
import {
  clearCache,
} from "./Api";

const route = useRoute();
const router = useRouter();

const tabsStore = useTabsStore();
const usrStore = useUsrStore();
const indexStore = useIndexStore();
const menuStore = useMenuStore();

watch(
  () => route.path,
  async () => {
    tabsStore.activeTab({
      lbl: String(route.name || ""),
      active: true,
      path: route.path,
      query: route.query,
    });
  }
);

// 关闭其它选项卡
function closeOtherTabs() {
  tabsStore.closeOtherTabs(route.path);
}

// 清空缓存
async function clearCacheEfc() {
  await clearCache();
  ElMessage.success("清空缓存成功!");
}

async function logoutClk() {
  try {
    await ElMessageBox.confirm("确定退出登录?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  usrStore.setAccess_token("");
}

onMounted(async () => {
  await tabsStore.refreshTab();
});
</script>

<style lang="scss" scoped>
.wrap_div {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}
.top_div {
  height: $menu_top_height;
  background-color: #072540;
  color: #FFF;
  display: flex;
  flex-direction: column;
}
.center_top_div {
  display: flex;
  flex-direction: row;
}
.center_div {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.menu_div {
  // overflow-x: hidden;
  // overflow-y: auto;
  width: $menu_left_width;
  background-color: #072540;
  color: #FFF;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.left_menu {
  flex: 1 0 0;
  overflow-y: auto;
}
.menu_collapse {
  width: 60px;
  transition: width 300ms;
}
.content_div {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.tabs_div {
  flex: 1 0 0;
  overflow-x: auto;
  overflow-y: hidden;
  margin-left: 5px;
}
.fold_icon {
  font-size: 18px;
  align-self: center;
  cursor: pointer;
}
.fold_icon:hover {
  color: var(--el-color-primary);
}
.tab_dropdown:hover {
  border-color: #FFF;
}
.tab_dropdown {
  margin-right: 10px;
  position: relative;
  top: 1px;
  border: 1px solid transparent;
  cursor: pointer;
  height: 15px;
  width: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
