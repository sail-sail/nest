<template>
<el-config-provider
  :locale="locale"
  :button="{ autoInsertSpace: false }"
>
  <router-view
    v-slot="{ Component }"
  >
    <template v-if="Component">
      <component :is="Component"></component>
    </template>
    <template v-else-if="$route.fullPath === '/'">
    </template>
    <template v-else>
      <div
        un-flex="~ [1_0_0] col"
        un-overflow="hidden"
        un-justify="center"
      >
        <el-empty
          :description="ns('页面不存在')"
        >
          <el-button
            un-w="50"
            
            size="large"
            type="danger"
            @click="goHome"
          >
            <span un-text="4.5">
              {{ ns("返回首页") }}
            </span>
          </el-button>
        </el-empty>
      </div>
    </template>
  </router-view>
  <Background_taskListDialog></Background_taskListDialog>
</el-config-provider>
</template>

<script setup lang="ts">
import locale from "@/locales";
import Background_taskListDialog from "./views/base/background_task/ListDialog.vue";

const {
  ns,
  initSysI18ns,
} = useI18n();

const tabsStore = useTabsStore();

const route = useRoute();

async function goHome() {
  if (tabsStore.actTab) {
    tabsStore.closeCurrentTab(tabsStore.actTab);
  }
  window.location.href = "/";
}

// const warn = console.warn;
// console.warn = (...args: any[]) => {
//   if (args[0] === "[HMR] Something went wrong during Vue component hot-reload. Full reload required.") {
//     window.location.reload();
//     return;
//   }
//   warn(...args);
// };

async function initI18nsEfc() {
  const codes: string[] = [
    "(无)",
    "全选",
  ];
  await initSysI18ns(codes);
}
initI18nsEfc();

onMounted(async () => {
  await tabsStore.refreshTab(route);
});
</script>
