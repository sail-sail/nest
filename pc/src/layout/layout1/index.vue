<template>
<Login
  v-if="!usrStore.authorization || usrStore.isLogining"
></Login>
<div
  v-else
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
      un-text="gray-500 dark:gray-300"
      un-flex="~ col"
      un-pos-relative
    >
      <Top></Top>
    </div>
    <LeftMenu
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
    ></LeftMenu>
  </div>
  <div
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
  >
    <div
      ref="tabs_divRef"
      un-h="10"
      un-text="gray-500 dark:gray-300"
      un-flex="~ row"
      un-pos-relative
    >
      <Tabs
        ref="tabsRef"
        un-flex="~ [1_0_0]"
        un-overflow-hidden
        :tabs="tabsStore.tabs"
        @refresh-active_line="refreshTab_active_line"
        @refresh-scroll-visible="refreshScrollVisible"
      ></Tabs>
      <div
        un-flex="~"
        un-h="full"
      >
        <div
          v-if="scrollLeftVisible || scrollRightVisible"
          un-flex="~"
          un-h="full"
          un-justify-center
          un-items-center
        >
          <el-icon
            v-if="scrollLeftVisible"
            un-p="x-1"
            un-h="full"
            un-cursor-pointer
            un-bg="hover:gray-200"
            un-text="hover:black"
            @click="scrollLeftClk"
          >
            <ElIconArrowLeft />
          </el-icon>
          <el-icon
            v-if="scrollRightVisible"
            un-p="x-1"
            un-h="full"
            un-cursor-pointer
            un-bg="hover:gray-200"
            un-text="hover:black"
            @click="scrollRightClk"
          >
            <ElIconArrowRight />
          </el-icon>
        </div>
      </div>
      <div
        un-flex="~"
        un-items-center
        un-gap="x-3"
        un-m="r-4"
      >
        <template
          v-if="
            loginInfo &&
              loginInfo.org_id_models &&
              loginInfo.org_id_models.length > 0 &&
              !(loginInfo.org_id_models.length === 1 && loginInfo.org_id_models[0].lbl === '默认组织')
          "
        >
          <el-dropdown
            trigger="click"
          >
            <span
              un-text="white hover:[var(--el-color-primary)]"
              un-cursor-pointer
              un-whitespace-nowrap
            >
              <template
                v-if="loginInfo?.org_id"
              >
                {{ loginInfo.org_id_models.find(item => item.id === loginInfo?.org_id)?.lbl || '' }}
              </template>
              <template
                v-else
              >
                ({{ ns('全部') }})
              </template>
            </span>
            <template #dropdown>
              <el-dropdown-menu
                un-whitespace-nowrap
              >
                <el-dropdown-item
                  @click="onDeptSelect()"
                >
                  <div
                    :style="{
                      color: !loginInfo?.org_id ? 'var(--el-color-primary)' : ''
                    }"
                    un-flex="~"
                    un-items-center
                  >
                    <div
                      un-w="3.5"
                      un-h="3.5"
                      un-m="r-1"
                    >
                      <el-icon
                        v-if="!loginInfo?.org_id"
                        :size="14"
                      >
                        <ElIconCheck />
                      </el-icon>
                    </div>
                    <span>
                      {{ ns('(全部)') }}
                    </span>
                  </div>
                </el-dropdown-item>
                
                <template
                  v-for="item of loginInfo.org_id_models"
                  :key="item.id"
                >
                  <el-dropdown-item
                    @click="onDeptSelect(item.id)"
                  >
                    <div
                      :style="{
                        color: item.id === loginInfo?.org_id ? 'var(--el-color-primary)' : ''
                      }"
                      un-flex="~"
                      un-items-center
                    >
                      <div
                        un-w="3.5"
                        un-h="3.5"
                        un-m="r-1"
                      >
                        <el-icon
                          v-if="item.id === loginInfo?.org_id"
                          :size="14"
                        >
                          <ElIconCheck />
                        </el-icon>
                      </div>
                      <span>
                        {{ item.lbl }}
                      </span>
                    </div>
                  </el-dropdown-item>
                </template>
                
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
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
            <div
              un-flex="~"
              un-text="3 gray-500 dark:gray-300 hover:[var(--el-color-primary)]"
            >
              <div>
                {{ loginInfo?.lbl }}
              </div>
              <el-icon
                :size="14"
              >
                <ElIconCaretBottom />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu
                un-whitespace-nowrap
              >
                
                <el-dropdown-item @click="onToggleDark(!isDark)">
                  <template v-if="!isDark">
                    <ElIcon>
                      <div un-i="iconfont-moon-fill"></div>
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
                
                <el-dropdown-item
                  v-if="usrStore.username === 'admin'"
                  @click="onClearCache"
                >
                  <ElIcon>
                    <ElIconDelete />
                  </ElIcon>
                  <span>{{ ns('清空缓存') }}</span>
                </el-dropdown-item>
                
                <el-dropdown-item
                  v-if="!config.indexIsEmpty"
                  divided
                  @click="goIndex"
                >
                  <ElIcon>
                    <ElIconHomeFilled />
                  </ElIcon>
                  <span>{{ ns('打开首页') }}</span>
                </el-dropdown-item>
                
                <el-dropdown-item
                  @click="onChangePassword"
                >
                  <ElIcon>
                    <ElIconLock />
                  </ElIcon>
                  <span>{{ ns('修改密码') }}</span>
                </el-dropdown-item>
                
                <el-dropdown-item
                  divided
                  @click="onLogout"
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
      un-top="-.5"
    >
      <div
        ref="tab_active_lineRef"
        
        :class="{
          tab_active_line: inited,
        }"
        un-hidden
        un-pos-absolute
        un-bottom-0
        un-left="[23px]"
        un-bg="[var(--el-menu-active-color)]"
        un-h="0.5"
        un-border-rounded
        un-ease-in
      ></div>
    </div>
    <div
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
      un-box-border
      un-m="t--.5"
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
  
  <!-- 修改密码 -->
  <ChangePassword
    ref="changePasswordRef"
  ></ChangePassword>
</div>
</template>

<script lang="ts" setup>
import LeftMenu from "./Menu.vue";
import Top from "./Top.vue";
import Tabs from "./Tabs.vue";

import Login from "../Login.vue";

import ChangePassword from "../change_password/ChangePassword.vue";

import {
  getLoginInfo,
  deptLoginSelect,
  clearCache,
  getUsrPermits,
} from "./Api";

import config from "@/utils/config";

const router = useRouter();

const {
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns,
} = useI18n();

const route = useRoute();

const indexStore = useIndexStore();
const tabsStore = useTabsStore();
const permitStore = usePermitStore();
const usrStore = useUsrStore();
const menuStore = useMenuStore();

// 黑暗模式
const isDark = useDark();
const toggleDark = useToggle(isDark);

function onToggleDark(
  isDark: boolean,
) {
  document.documentElement.style.removeProperty("color-scheme");
  return toggleDark(isDark);
}

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
    const menuLbl = menuStore.getLblByPath(route.path);
    const lbl = menuLbl || (route.meta?.name as string) || name || "";
    const closeable = route.meta?.closeable as boolean ?? true;
    const icon = route.meta?.icon as string | undefined;
    tabsStore.activeTab({
      name,
      lbl,
      active: true,
      path: route.path,
      query: route.query,
      closeable,
      icon,
    });
  },
  {
    immediate: true,
  },
);

let inited = $ref(false);

const tabs_divRef = $ref<HTMLDivElement>();
const tabsRef = $ref<InstanceType<typeof Tabs>>();
const tab_active_lineRef = $ref<HTMLDivElement>();

let scrollLeftVisible = $ref(false);
let scrollRightVisible = $ref(false);

async function refreshScrollVisible() {
  const tabs_divRef = tabsRef?.tabs_divRef;
  if (!tabs_divRef) {
    return;
  }
  const clientWidth = tabs_divRef.clientWidth;
  const scrollWidth = tabs_divRef.scrollWidth;
  const scrollLeft = tabs_divRef.scrollLeft;
  if (scrollLeft === 0) {
    scrollLeftVisible = false;
  } else {
    scrollLeftVisible = true;
  }
  if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth) {
    scrollRightVisible = false;
  } else {
    scrollRightVisible = true;
  }
  await nextTick();
  await nextTick();
  await nextTick();
  resetTab_active_line();
}

async function scrollLeftClk() {
  const tabs_divRef = tabsRef?.tabs_divRef;
  if (!tabs_divRef) {
    return;
  }
  tabs_divRef.scrollLeft -= 228;
  await refreshScrollVisible();
}

async function scrollRightClk() {
  const tabs_divRef = tabsRef?.tabs_divRef;
  if (!tabs_divRef) {
    return;
  }
  tabs_divRef.scrollLeft += 228;
  await refreshScrollVisible();
}

function resetTab_active_line() {
  const tab_activeEl = tabs_divRef?.getElementsByClassName("tab_active")[0] as HTMLDivElement | undefined;
  if (tab_activeEl) {
    const offsetLeft = tab_activeEl.offsetLeft - (tab_activeEl.parentElement?.scrollLeft || 0);
    const offsetWidth = tab_activeEl.offsetWidth;
    if (tab_active_lineRef) {
      tab_active_lineRef.style.display = "block";
      tab_active_lineRef.style.left = `${ offsetLeft }px`;
      tab_active_lineRef.style.width = `${ offsetWidth }px`;
    }
  }
}

function refreshTab_active_line() {
  if (!tab_active_lineRef) {
    return;
  }
  const tab_activeEl = tabs_divRef?.getElementsByClassName("tab_active")[0] as HTMLDivElement | undefined;
  if (!tab_activeEl) {
    tab_active_lineRef.style.display = "none";
    return;
  }
  tab_active_lineRef.style.display = "block";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((tab_activeEl as any).scrollIntoViewIfNeeded) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tab_activeEl as any).scrollIntoViewIfNeeded(true);
  } else {
    tab_activeEl.scrollIntoView({ block: "center", inline: "center" });
  }
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
  async () => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    refreshTab_active_line();
  },
  {
    immediate: true,
  },
);

// 首页
async function goIndex() {
  const tab = tabsStore.setIndexTab(true);
  if (tab) {
    await router.push({
      name: tab.name,
      query: tab.query,
    });
  }
}

// 关闭其它选项卡
function closeOtherTabs() {
  if (tabsStore.actTab) {
    tabsStore.closeOtherTabs(tabsStore.actTab);
  }
}

// 清空缓存
async function onClearCache() {
  try {
    await ElMessageBox.confirm(await nsAsync("确定清空缓存?"), await nsAsync("提示"), {
      confirmButtonText: await nsAsync("确定"),
      cancelButtonText: await nsAsync("取消"),
      type: "warning",
    });
  } catch (err) {
    return;
  }
  indexStore.i18n_version = null;
  localStorage.removeItem("__i18n_version");
  localStorage.removeItem("i18nLblsLang");
  await clearCache();
  window.location.reload();
}

async function onLogout() {
  try {
    await ElMessageBox.confirm(await nsAsync("确定退出登录?"), await nsAsync("提示"), {
      confirmButtonText: await nsAsync("确定"),
      cancelButtonText: await nsAsync("取消"),
      type: "warning",
    });
  } catch (err) {
    return;
  }
  usrStore.logout();
}

let loginInfo = $ref(usrStore.loginInfo);

async function onDeptSelect(org_id?: OrgId) {
  if (!loginInfo) {
    return;
  }
  if (org_id === loginInfo.org_id) {
    return;
  }
  loginInfo.org_id = org_id;
  const token = await deptLoginSelect({
    org_id,
  });
  if (token) {
    if (usrStore.loginInfo) {
      usrStore.loginInfo.org_id = org_id;
    }
    await usrStore.login(token);
  }
}

const changePasswordRef = $ref<InstanceType<typeof ChangePassword>>();

/** 修改密码 */
async function onChangePassword() {
  if (!changePasswordRef) {
    return;
  }
  const {
    type,
  } = await changePasswordRef.showDialog({
    action: "edit",
  });
  if (type === "cancel") {
    return;
  }
}

/** 获取当前用户的权限列表 */
async function getUsrPermitsEfc() {
  const permits = await getUsrPermits();
  permitStore.permits = permits;
}

async function initFrame() {
  if (usrStore.authorization) {
    if (import.meta.env.VITE_SERVER_I18N_ENABLE !== "false") {
      const [
        loginInfoTmp,
        _,
      ] = await Promise.all([
        getLoginInfo({ notLoading: true }),
        getUsrPermitsEfc(),
      ]);
      loginInfo = loginInfoTmp;
      usrStore.loginInfo = loginInfo;
    } else {
      const [
        loginInfoTmp,
        _,
      ] = await Promise.all([
        getLoginInfo({ notLoading: true }),
        getUsrPermitsEfc(),
      ]);
      loginInfo = loginInfoTmp;
      usrStore.loginInfo = loginInfo;
      usrStore.lang = loginInfo.lang ?? "";
      usrStore.username = loginInfo.username;
    }
  }
  inited = true;
}

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
.tab_active_line {
  @apply transition-property-[width,left] duration-[300ms] ease-in;
}
</style>
