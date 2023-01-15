<template>
<div class="tabs_div">
  <div
    v-for="(item, i) in tabs"
    :key="item.path"
    class="tab_div"
    :class="{ tab_active: item.active }"
    @click="activeTab(item)"
  >
    <el-dropdown
      trigger="contextmenu"
      @command="menuCommand($event, item)"
      @visible-change="visibleChange($event, i)"
      ref="dropdownRef"
    >
      <template #default>
        <span
          class="tab_label"
          :title="item.lbl"
        >
          {{ item.lbl }}
        </span>
      </template>
      <template #dropdown>
        <el-dropdown-menu>
          
          <el-dropdown-item
            command="close"
          >
            关闭
          </el-dropdown-item>
          
          <el-dropdown-item
            command="closeOther"
            :disabled="tabs.length <= 3"
          >
            关闭其他
          </el-dropdown-item>
          
          <el-dropdown-item
            command="closeAll"
            :disabled="tabs.length <= 3"
          >
            全部关闭
          </el-dropdown-item>
          
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div
      v-if="tabs.length > 1"
      class="tab_close_div"
    >
      <Close
        class="tab_close"
        @click.stop="closeClk(item)"
      />
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
import {
  type TabInf,
} from "@/store/tabs";

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
  await router.push({
    path: tab.path,
    query: tab.query,
  });
}

async function closeClk(tab: TabInf) {
  await tabsStore.removeTab(tab);
  if (tabsStore.actTab) {
    await activeTab(tabsStore.actTab);
  }
}

async function menuCommand(command: string, tab: TabInf) {
  switch (command) {
    case "close":
      await closeClk(tab);
      break;
    case "closeOther":
      await tabsStore.closeOtherTabs(tab);
      break;
    case "closeAll":
      await tabsStore.closeOtherTabs();
      break;
  }
}

let dropdownRef = $ref<InstanceType<typeof ElDropdown>[]>([ ]);

function visibleChange(visible: boolean, index: number) {
  if (!visible) {
    return;
  }
  for (let i = 0; i < dropdownRef.length; i++) {
    const dropdownRefItem = dropdownRef[i];
    if (i === index) {
      continue;
    }
    dropdownRefItem.handleClose();
  }
}
</script>

<style lang="scss" scoped>
.tabs_div {
  display: flex;
}
.tab_div {
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
    opacity: 1;
  }
}
.tab_active {
  color: var(--el-menu-active-color);
  // color: #EEE;
  background-color: rgba(0,0,0,.8);
  box-shadow: inset 0px 0px 2px #34404a;
  .tab_close {
    opacity: 1;
  }
}
.tab_div.tab_active:hover {
  background-color: rgba(0,0,0,.8);
}
.tab_label {
  min-width: 80px;
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  color: #FFF;
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
  opacity: 0;
  transition: opacity .5s,background-color .5s;
  font-size: 12px;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 50%;
}
.tab_close:hover {
  color: red;
  background-color: #FFF;
}
</style>
