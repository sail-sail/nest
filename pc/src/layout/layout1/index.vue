<template>
<div
  w="full"
  h="full"
  overflow-hidden
  flex
  pos-relative
>
  <div
    text="[#FFF]"
    flex="~ col"
    overflow-hidden
    transition="width"
    :style="{ width: menuStore.isCollapse ? '60px': '250px' }"
  >
    <div
      h="[40px]"
      bg="[#072540] dark:[black]"
      text="[#FFF]"
      flex="~ col"
      pos-relative
    >
      <Top></Top>
    </div>
    <LeftMenu
      flex="[1_0_0]"
      overflow-y-auto
    ></LeftMenu>
  </div>
  <div
    flex="~ [1_0_0] col"
    overflow-hidden
  >
    <div
      ref="tabs_divRef"
      
      h="[40px]"
      bg="[#072540] dark:[black]"
      text="[#FFF]"
      flex="~ row"
      pos-relative
    >
      <el-icon
        text="[18px] hover:[var(--el-color-primary)]"
        self-center
        cursor-pointer
        @click="menuStore.isCollapse = !menuStore.isCollapse"
      >
        <Expand v-if="menuStore.isCollapse" />
        <Fold v-else />
      </el-icon>
      <Tabs
        flex="[1_0_0]"
        overflow="x-auto y-hidden"
        m="l-[5px]"
        
        :tabs="tabsStore.tabs"
      ></Tabs>
      <div
        flex
        items-center
      >
        <div
          m="r-[10px]"
          pos-relative
          top="[1px]"
          border-1px
          border-transparent
          cursor-pointer
          h="[15px]"
          w="[15px]"
          flex="~ col"
          items-center
          justify-center
        >
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-icon
                size="18"
                color="#FFF"
              >
                <ArrowDownBold />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu
                whitespace-nowrap
              >
                
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
                  <i
                    w="1em"
                    h="1em"
                  ></i>
                  <span>关闭其它</span>
                </el-dropdown-item>
                
                <el-dropdown-item @click="clearCacheEfc">
                  <i
                    w="1em"
                    h="1em"
                  ></i>
                  <span>清空缓存</span>
                </el-dropdown-item>
                
                <el-dropdown-item
                  divided
                  @click="logoutClk"
                >
                  <i
                    w="1em"
                    h="1em"
                  ></i>
                  <span>退出登录</span>
                </el-dropdown-item>
                
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div
      h="[3px]"
      w="[full]"
      pos-relative
      bg="[rgba(0,0,0,20%)]"
    >
      <div
        ref="tab_active_lineRef"
        
        display-none
        pos-absolute
        bottom-0
        left="[23px]"
        bg="[var(--el-menu-active-color)]"
        h="[3px]"
        border-rounded
        transition="property-[width,left] duration-[300ms]"
        ease-in
      ></div>
    </div>
    <div
      flex="~ [1_0_0] col"
      overflow-hidden
      box-border
    >
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <Transition mode="out-in">
            <KeepAlive>
              <Suspense>
                <!-- 主要内容 -->
                <component :is="Component"></component>

                <!-- 加载中状态 -->
                <template #fallback>
                  <div
                    v-if="errorMessage"
                    flex="~ [1_0_0]"
                    items-center
                    justify-center
                    overflow-hidden
                    text="[red] [28px]"
                  >
                    {{ errorMessage }}
                  </div>
                  <div
                    v-else
                    flex="~ [1_0_0]"
                    items-center
                    justify-center
                    overflow-hidden
                    text="[18px]"
                  >
                    正在加载...
                  </div>
                </template>
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>
      </router-view>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { onErrorCaptured } from "vue";

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
  getLoginInfo,
  clearCache,
} from "./Api";

import {
  useDark,
  useToggle,
} from "@vueuse/core";

import {
  type GetLoginInfo,
} from "#/types";

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
    if (route.path === "/" || route.path === "") {
      return;
    }
    tabsStore.activeTab({
      lbl: String(route.name || ""),
      active: true,
      path: route.path,
      query: route.query,
    });
  },
  {
    immediate: true,
  },
);

let inited = $ref(false);

let tabs_divRef = $ref<HTMLDivElement | undefined>();
let tab_active_lineRef = $ref<HTMLDivElement | undefined>();

function refreshTab_active_line() {
  if (!tab_active_lineRef) {
    return;
  }
  const tab_activeEl = tabs_divRef?.getElementsByClassName("tab_active")[0] as HTMLDivElement | undefined;
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

let errorMessage = $ref("");

onErrorCaptured(function(err) {
  errorMessage = err instanceof Error ? err.message : (err || "系统错误");
});

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
  usrStore.logout();
}

let loginInfo = $ref<GetLoginInfo | undefined>();

async function initFrame() {
  if (usrStore.authorization) {
    const [
      loginInfoTmp,
    ] = await Promise.all([
      getLoginInfo(),
    ]);
    loginInfo = loginInfoTmp;
  }
  inited = true;
}

usrStore.onLogin(initFrame);

initFrame();

// onMounted(async () => {
//   await tabsStore.refreshTab();
// });
</script>
