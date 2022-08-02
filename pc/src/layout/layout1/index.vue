<template>
<div class="wrap_div">
  <div class="menu_div" :class="{ menu_collapse: menuStore.isCollapse }">
    <div class="top_div">
      <Top></Top>
    </div>
    <LeftMenu class="left_menu"></LeftMenu>
  </div>
  <div class="center_div">
    <div class="top_div center_top_div" ref="tabs_divRef">
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
                
                <el-dropdown-item @click="toggleDark(!isDark)">
                  <template v-if="!isDark">
                    <i i="tabler-moon"></i>
                    <span>黑暗模式</span>
                  </template>
                  <template v-else>
                    <i i="tabler-sun"></i>
                    <span>明亮模式</span>
                  </template>
                </el-dropdown-item>
                
                <el-dropdown-item @click="closeOtherTabs">
                  <i w="1em" h="1em"></i>
                  <span>关闭其它</span>
                </el-dropdown-item>
                
                <el-dropdown-item @click="clearCacheEfc">
                  <i w="1em" h="1em"></i>
                  <span>清空缓存</span>
                </el-dropdown-item>
                
                <el-dropdown-item divided @click="logoutClk">
                  <i w="1em" h="1em"></i>
                  <span>退出登录</span>
                </el-dropdown-item>
                
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="tab_active_line_div">
      <div class="tab_active_line" ref="tab_active_lineRef"></div>
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
import {
  nextTick,
  // onMounted,
  watch,
} from "vue";
import useTabsStore from "@/store/tabs";
import useUsrStore from "@/store/usr";
import useMenuStore from "@/store/menu";
import useIndexStore from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import LeftMenu from "./Menu.vue";
import Top from "./Top.vue";
import Tabs from "./Tabs.vue";
import {
  clearCache,
} from "./Api";
import { useDark, useToggle } from "@vueuse/core";

const route = useRoute();
const router = useRouter();

const tabsStore = useTabsStore();
const usrStore = useUsrStore();
const indexStore = useIndexStore();
const menuStore = useMenuStore();

const isDark = useDark();
const toggleDark = useToggle(isDark);

watch(
  [
    () => route.path,
    () => route.query,
  ],
  async () => {
    const menu = menuStore.getMenuByPath(route.path);
    if (!menu && route.path !== "/" && usrStore.authorization) {
      ElMessage.warning("无权限打开此菜单!");
      return;
    }
    // if (route.query) {
    //   menu.route_query = route.query;
    // }
    tabsStore.activeTab({
      lbl: String(route.name || ""),
      active: true,
      path: route.path,
      query: route.query,
    });
  }
);

let tabs_divRef: HTMLDivElement|undefined = $ref();
let tab_active_lineRef: HTMLDivElement|undefined = $ref();

function refreshTab_active_line() {
  if (!tab_active_lineRef) {
    return;
  }
  const tab_activeEl = tabs_divRef?.getElementsByClassName("tab_active")[0] as HTMLDivElement|undefined;
  if (!tab_activeEl) {
    return;
  }
  tab_activeEl.scrollIntoView({ block: "center", inline: "center" });
  const offsetLeft = tab_activeEl.offsetLeft - (tab_activeEl.parentElement?.scrollLeft || 0);
  const offsetWidth = tab_activeEl.offsetWidth;
  tab_active_lineRef.style.display = "block";
  tab_active_lineRef.style.left = `${ offsetLeft }px`;
  tab_active_lineRef.style.width = `${ offsetWidth }px`;
}

watch(
  [
    () => tabsStore.actTab,
    () => tabsStore.tabs.length,
  ],
  () => {
    nextTick(refreshTab_active_line);    
  },
  {
    immediate: true,
  },
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
  usrStore.setAuthorization("");
}

// onMounted(async () => {
//   await tabsStore.refreshTab();
// });
</script>

<style lang="scss" scoped>
.wrap_div {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
}
.top_div {
  height: $menu_top_height;
  background-color: #072540;
  color: #FFF;
  display: flex;
  flex-direction: column;
  position: relative;
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
  margin-top: 2px;
  box-sizing: border-box;
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
.tab_active_line_div {
  height: 3px;
  width: 100%;
  position: relative;
  background-color: rgba(0,0,0, 20%);
}
.tab_active_line {
  display: none;
  position: absolute;
  bottom: 0;
  left: 23px;
  background-color: var(--el-menu-active-color);
  height: 3px;
  border-radius: 3px;
  transition-property: width, left;
  transition-duration: 300ms;
  transition-timing-function: ease-out;
}
</style>
