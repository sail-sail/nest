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
    :style="{ width: menuStore.isCollapse ? '60px': '250px' }"
  >
    <div
      un-h="10"
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
      un-h="10"
      un-bg="[#072540] dark:[black]"
      un-text="white"
      un-flex="~ row"
      un-pos-relative
    >
      <el-icon
        size="18"
        un-text="hover:[var(--el-color-primary)]"
        un-self-center
        un-cursor-pointer
        un-m="x-2"
        @click="menuStore.isCollapse = !menuStore.isCollapse"
      >
        <ElIconExpand
          v-if="menuStore.isCollapse"
        />
        <ElIconFold
          v-else
        />
      </el-icon>
      <Tabs
        un-flex="[1_0_0]"
        un-overflow="x-auto y-hidden"
        :tabs="tabsStore.tabs"
        @tab_active_line="refreshTab_active_line"
      ></Tabs>
      <div
        un-flex="~"
        un-items-center
        un-gap="x-3"
        un-m="r-4"
      >
        <template v-if="loginInfo && loginInfo.dept_idModels">
          <el-dropdown
            trigger="click"
          >
            <span
              un-text="white hover:[var(--el-color-primary)]"
              un-cursor-pointer
            >
              {{ loginInfo.dept_idModels.find(item => item.id === loginInfo?.dept_id)?.lbl || '' }}
            </span>
            <template #dropdown>
              <el-dropdown-menu
                un-whitespace-nowrap
              >
                <el-dropdown-item
                  v-for="item of loginInfo.dept_idModels"
                  :key="item.id"
                  @click="deptSelectClk(item.id)"
                >
                  {{ item.lbl }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <div
          un-flex="~"
          un-items-center
          un-h="full"
          un-m="r-1"
        >
          <el-dropdown
            trigger="click"
          >
            <IconFontLocales
              un-w="4"
              un-h="4"
              un-pos-relative
              un-top="0.5"
              un-text="white hover:[var(--el-color-primary)]"
              un-cursor-pointer
            ></IconFontLocales>
            <template #dropdown>
              <el-dropdown-menu
                un-whitespace-nowrap
              >
                <el-dropdown-item
                  v-for="item of locales"
                  :key="item.code"
                  @click="selectLangClk(item.code)"
                >
                  <span
                    :style="{
                      color: item.code === loginInfo?.lang ? 'var(--el-color-primary)' : ''
                    }"
                  >
                    {{ item.lbl }}
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div
          un-pos-relative
          un-top="[1px]"
          un-border-1px
          un-border-transparent
          un-cursor-pointer
          un-flex="~ col"
          un-items-center
          un-justify-center
        >
          <el-dropdown
            trigger="click"
          >
            <el-icon
              :size="16"
              color="#FFF"
            >
              <ElIconSetting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu
                whitespace-nowrap
              >
                
                <el-dropdown-item @click="toggleDark(!isDark)">
                  <template v-if="!isDark">
                    <ElIcon>
                      <div un-i="iconfont-moon"></div>
                    </ElIcon>
                    <span>{{ ns('黑暗模式') }}</span>
                  </template>
                  <template v-else>
                    <ElIcon>
                      <div un-i="iconfont-sun"></div>
                    </ElIcon>
                    <span>{{ ns('明亮模式') }}</span>
                  </template>
                </el-dropdown-item>
                
                <el-dropdown-item @click="closeOtherTabs">
                  <ElIcon>
                    <ElIconCircleClose />
                  </ElIcon>
                  <span>{{ ns('关闭其它') }}</span>
                </el-dropdown-item>
                
                <el-dropdown-item @click="clearCacheEfc">
                  <ElIcon>
                    <ElIconDelete />
                  </ElIcon>
                  <span>{{ ns('清空缓存') }}</span>
                </el-dropdown-item>
                
                <el-dropdown-item
                  divided
                  @click="logoutClk"
                >
                  <ElIcon>
                    <div un-i="iconfont-logout"></div>
                  </ElIcon>
                  <span>{{ ns('退出登录') }}</span>
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
        <KeepAlive
          :include="tabsStore.keepAliveNames"
        >
          <component
            :is="Component"
          ></component>
        </KeepAlive>
      </router-view>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import LeftMenu from "./Menu.vue";
import Top from "./Top.vue";
import Tabs from "./Tabs.vue";

import {
  getLoginInfo,
  deptLoginSelect,
  clearCache,
  selectLang,
} from "./Api";

import {
  type GetLoginInfo,
} from "#/types";

const {
  n,
  ns,
  initI18ns,
  initSysI18ns,
} = useI18n();

const route = useRoute();

const tabsStore = useTabsStore();
const usrStore = useUsrStore();
const menuStore = useMenuStore();

let locales = $ref([
  {
    code: "zh-cn",
    lbl: "简体中文",
  },
  {
    code: "en-us",
    lbl: "English",
  },
]);

// 黑暗模式
const isDark = useDark();
const toggleDark = useToggle(isDark);

// 设置选项卡到当前的路由
watch(
  [
    () => route.path,
    () => route.query,
  ],
  async () => {
    if (route.path === "/" || route.path === "") {
      return;
    }
    const name = route.name as string;
    tabsStore.activeTab({
      name,
      lbl: (route.meta?.name as string) || name || "",
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

let tabs_divRef = $ref<HTMLDivElement>();
let tab_active_lineRef = $ref<HTMLDivElement>();

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
  if (tabsStore.actTab) {
    tabsStore.closeOtherTabs(tabsStore.actTab);
  }
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

let loginInfo = $ref<GetLoginInfo>();

async function selectLangClk(lang: string) {
  const authorization = await selectLang({
    lang,
  });
  if (authorization) {
    usrStore.authorization = authorization;
    usrStore.setLang(lang);
    window.location.reload();
  }
}

async function deptSelectClk(dept_id: string) {
  if (!loginInfo) {
    return;
  }
  loginInfo.dept_id = dept_id;
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
      getLoginInfo({ notLoading: true }),
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
