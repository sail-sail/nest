<template>
<div class="tabs_div">
  <div
    v-for="item in tabs"
    :key="item.path"
    class="tab_div"
    :class="{ tab_active: item.active }"
    @click="activeTab(item)"
  >
    <span class="tab_label">{{ item.lbl }}</span>
    <div class="tab_close_div" v-if="tabs.length > 1">
      <Close class="tab_close" @click.stop="closeClk(item)"/>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { toRef } from "vue";
import {
  Close,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

import useTabsStore from "@/store/tabs";
import { TabInf } from "@/store/tabs";

const router = useRouter();

const tabsStore = useTabsStore();

const props = withDefaults(
  defineProps<{
    tabs?: TabInf[ ],
  }>(),
  {
    tabs: () => [ ],
  },
);

let tabs = $ref(toRef(props, "tabs"));

async function activeTab(tab: TabInf) {
  tabsStore.activeTab(tab);
  await router.push({ path: tab.path, query: tab.query });
}

async function closeClk(tab: TabInf) {
  const tabs = tabsStore.tabs;
  let idx = tabs.findIndex((item) => item.path === tab.path);
  if (tab.active) {
    if (idx !== -1) {
      if (tabs[idx + 1]) {
        await activeTab(tabs[idx + 1]);
      } else if (tabs[idx - 1]) {
        await activeTab(tabs[idx - 1]);
      } else {
        await router.push({ path: "/", query: { } });
      }
    }
  }
  if (idx !== -1) {
    tabsStore.removeTab(tab.path);
  }
}
</script>

<style lang="scss" scoped>
.tabs_div {
  display: flex;
}
.tab_div {
  min-width: 80px;
  display: flex;
  position: relative;
  cursor: default;
  padding-left: 6px;
  padding-right: 6px;
}
.tab_div:hover {
  transition: width 1s;
  background-color: #041c31;
  .tab_close {
    visibility: visible;
  }
}
.tab_active {
  color: var(--el-menu-active-color);
  // color: #EEE;
  background-color: rgba(0,0,0,.8);
  box-shadow: inset 0px 0px 2px #34404a;
  .tab_close {
    visibility: visible;
  }
}
.tab_div.tab_active:hover {
  background-color: rgba(0,0,0,.8);
}
.tab_label {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tab_close_div {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: 3px;
  margin-right: -2px;
  width: 13px;
  height: 13px;
}
.tab_close {
  visibility: hidden;
  font-size: 12px;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.tab_close:hover {
  color: red;
  background-color: #FFF;
  border-radius: 50%;
}
</style>
