<template>
<div
  un-w="full"
  un-h="full"
  un-overflow-hidden
  un-flex
  un-pos-relative
>
  <div
    un-text="[#FFF]"
    un-flex="~ col"
    un-overflow-hidden
    
    transition="width"
    :style="{ width: menuStore.isCollapse ? '60px': '250px' }"
  >
    <div
      un-h="[40px]"
      un-bg="[#072540] dark:[black]"
      un-text="[#FFF]"
      un-flex="~ col"
      un-pos-relative
    >
      <Top></Top>
    </div>
    <LeftMenu
      un-flex="[1_0_0]"
      un-overflow-y-auto
    ></LeftMenu>
  </div>
  <div
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
  >
    <div
      ref="tabs_divRef"
      
      un-h="[40px]"
      un-bg="[#072540] dark:[black]"
      un-text="[#FFF]"
      un-flex="~ row"
      un-pos-relative
    >
      <el-icon
        un-text="[18px] hover:[var(--el-color-primary)]"
        un-self-center
        un-cursor-pointer
        
        @click="menuStore.isCollapse = !menuStore.isCollapse"
      >
        <Expand v-if="menuStore.isCollapse" />
        <Fold v-else />
      </el-icon>
      <Tabs
        un-flex="[1_0_0]"
        un-overflow="x-auto y-hidden"
        un-m="l-[5px]"
        
        :tabs="tabsStore.tabs"
      ></Tabs>
      <div
        un-flex
        un-items-center
      >
        <template v-if="loginInfo">
          <el-select
            v-model="(loginInfo.dept_id as string)"
            size="small"
            suffix-icon=""
            class="dept_select"
            
            un-m="r-2"
            
            @change="deptSelectChg"
          >
            <el-option
              v-for="item of loginInfo.dept_idModels"
              :key="item.id"
              :value="item.id"
              :label="item.lbl"
            ></el-option>
          </el-select>
        </template>
        <div
          un-m="r-2"
          un-pos-relative
          un-top="[1px]"
          un-border-1px
          un-border-transparent
          un-cursor-pointer
          un-flex="~ col"
          un-items-center
          un-justify-center
        >
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-icon
                :size="16"
                color="#FFF"
              >
                <Setting />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu
                whitespace-nowrap
              >
                
                <el-dropdown-item @click="toggleDark(!isDark)">
                  <template v-if="!isDark">
                    <ElIcon>
                      <div un-i="iconfont-moon"></div>
                    </ElIcon>
                    <span>黑暗模式</span>
                  </template>
                  <template v-else>
                    <ElIcon>
                      <div un-i="iconfont-sun"></div>
                    </ElIcon>
                    <span>明亮模式</span>
                  </template>
                </el-dropdown-item>
                
                <el-dropdown-item @click="closeOtherTabs">
                  <ElIcon>
                    <CircleClose />
                  </ElIcon>
                  <span>关闭其它</span>
                </el-dropdown-item>
                
                <el-dropdown-item @click="clearCacheEfc">
                  <ElIcon>
                    <Delete />
                  </ElIcon>
                  <span>清空缓存</span>
                </el-dropdown-item>
                
                <el-dropdown-item
                  divided
                  @click="logoutClk"
                >
                  <ElIcon>
                    <div un-i="iconfont-logout"></div>
                  </ElIcon>
                  <span>退出登录</span>
                </el-dropdown-item>
                
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div
      un-h="0.5"
      un-w="full"
      un-pos-relative
    >
      <div
        ref="tab_active_lineRef"
        
        un-display-none
        un-pos-absolute
        un-bottom-0
        un-left="[23px]"
        un-bg="[var(--el-menu-active-color)]"
        un-h="0.5"
        un-border-rounded
        un-transition="property-[width,left] duration-[300ms]"
        un-ease-in
      ></div>
    </div>
    <div
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
      un-box-border
    >
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <KeepAlive>
            <component :is="Component"></component>
          </KeepAlive>
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
  ElSelect,
  ElOption,
} from "element-plus";

import {
  Fold,
  Expand,
  Setting,
  CircleClose,
  Delete,
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
  deptLoginSelect,
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

async function deptSelectChg() {
  const dept_id = loginInfo?.dept_id;
  if (!dept_id) {
    return;
  }
  const token = await deptLoginSelect({
    dept_id,
  });
  if (token) {
    usrStore.dept_id = dept_id;
    await usrStore.login(token);
  }
}

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

<style lang="scss" scoped>
.dept_select {
  position: relative;
  top: 2px;
  width: 100px;
  :deep(.el-input__inner) {
    text-align: right;
    background-color: transparent;
  }
  :deep(.el-input) {
    --el-input-bg-color: transparent;
    --el-input-text-color: #FFF;
    --el-input-border-color: transparent;
  }
}
</style>
