<#
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");

const foreignTabColumns = columns.map((column) => {
  const foreignTabs = (column.foreignTabs || [ ]).filter((item) => {
    return !!optTables[item.mod + "_" + item.table]?.opts?.isUniPage;
  });
  return {
    columnName: column.COLUMN_NAME,
    foreignTabs,
  };
}).filter((column) => column.foreignTabs.length > 0);
const defaultForeignTabGroup = foreignTabColumns[0]?.columnName || "";

function toPascalCase(str) {
  return str.split(/[_-]/g).map(function(item) {
    return item ? item.substring(0, 1).toUpperCase() + item.substring(1) : "";
  }).join("");
}

const foreignTabGroups = foreignTabColumns.map((column) => {
  const column_name = column.columnName;
  const foreignTabs = column.foreignTabs;
  const tabs = foreignTabs.map((item, itemIndex) => {
    const itemSchema = optTables[item.mod + "_" + item.table];
    if (!itemSchema) {
      throw new Error(`表: ${ mod }_${ table } 的 foreignTabs 中的 ${ item.mod }_${ item.table } 不存在`);
    }
    const itemColumns = itemSchema.columns;
    const itemTable = item.table;
    const itemTableUp = itemTable.substring(0, 1).toUpperCase() + itemTable.substring(1);
    const itemTablePascal = itemTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const foreignColumn = itemColumns.find((col) => col.COLUMN_NAME === item.column);
    if (!foreignColumn) {
      throw new Error(`表: ${ item.mod }_${ item.table } 中字段 ${ item.column } 不存在`);
    }
    const foreignLabelField = foreignColumn.modelLabel
      || itemColumns.find((col) => col.COLUMN_NAME === `${ item.column }_lbl`)?.COLUMN_NAME;
    const isBizForeignTab = item.column === "biz_id";
    const hasBizType = isBizForeignTab && itemColumns.some((col) => col.COLUMN_NAME === "biz_type");
    const hasBizLbl = isBizForeignTab && itemColumns.some((col) => col.COLUMN_NAME === "biz_lbl");
    const searchIsArray = !!foreignColumn.foreignKey;
    const fnSuffix = toPascalCase(`${ column_name }_${ itemTable }_${ itemIndex }`);
    return {
      mod: item.mod,
      table: itemTable,
      label: item.label,
      column: item.column,
      itemTablePascal,
      foreignLabelField,
      hasBizType,
      hasBizLbl,
      searchIsArray,
      tabId: `${ column_name }__${ itemTable }__${ itemIndex }`,
      totalVar: `${ column_name }_${ itemTable }_${ itemIndex }_total`,
      fnSuffix,
    };
  });
  return {
    columnName: column_name,
    tabs,
  };
});

const uniqueChildTables = [ ];
for (const group of foreignTabGroups) {
  for (const tab of group.tabs) {
    if (!uniqueChildTables.some((item) => item.table === tab.table)) {
      uniqueChildTables.push({
        table: tab.table,
        itemTablePascal: tab.itemTablePascal,
      });
    }
  }
}
const hasFollowBizTypeTabs = foreignTabGroups.some((group) => {
  return group.tabs.some((tab) => tab.hasBizType);
});
#>
<template>
<view
  un-flex="~ [1_0_0]"
  un-overflow="hidden"
  un-relative
  un-h="screen"
>
  <tm-slider-menu
    v-model="activeTabId"
    width="100%"
    height="100%"
    :slider-width="sliderWidth"
    :list="sliderMenuList"
  >
    <template #menu="{ item }">
      <view
        un-flex="~ col"
        un-items="center"
        un-justify="center"
        un-gap="y-1"
        un-p="x-2 y-1"
      >
        <tm-badge
          v-if="item.count != null"
          :label="item.count"
          bg-color="gray"
          font-color="white"
          :max-count="99"
          :offset="[-1, -2]"
        >
          <text
            un-text="4"
            un-text-center
            :style="{
              fontWeight: activeTabId === item.id ? '700' : '400',
            }"
          >
            {{ item.title }}
          </text>
        </tm-badge>

        <text
          v-else
          un-text="4"
          un-text-center
          :style="{
            fontWeight: activeTabId === item.id ? '700' : '400',
          }"
        >
          {{ item.title }}
        </text>
      </view>
    </template>

    <template #default>
      <view
        un-h="full"
      ></view>
    </template>
  </tm-slider-menu>

  <view
    un-absolute
    un-top="0"
    un-right="0"
    un-bottom="0"
    un-overflow="hidden"
    un-bg="white"
    :style="{
      left: sliderWidth,
    }"
  >
    <view
      v-if="shouldRenderTab(basicInfoTabId)"
      v-show="activeTabId === basicInfoTabId"
      un-h="full"
    >
      <<#=Table_Up#>Detail
        ref="<#=table#>_detail_ref"
        un-h="full"
        :init="false"
        action="edit"
        :<#=table#>_id="<#=table#>_id"
        :back-after-save="false"
      ></<#=Table_Up#>Detail>
    </view><#
    for (const group of foreignTabGroups) {
      for (const tab of group.tabs) {
    #>

    <view
      v-if="shouldRenderTab('<#=tab.tabId#>')"
      v-show="activeTabId === '<#=tab.tabId#>'"
      un-h="full"
    >
      <<#=tab.itemTablePascal#>List
        un-h="full"
        :built-in-search="getSearch<#=tab.fnSuffix#>()"
        :add-query="getAddQuery<#=tab.fnSuffix#>()"
      ></<#=tab.itemTablePascal#>List>
    </view><#
      }
    }
    #>
  </view>
</view>
</template>

<script setup lang="ts">
import <#=Table_Up#>Detail from "./Detail.vue";<#
if (hasFollowBizTypeTabs) {
#>

import {
  FollowBizType,
} from "#/types.ts";<#
}
for (const child of uniqueChildTables) {
#>

import <#=child.itemTablePascal#>List from "@/pages/<#=child.table#>/List.vue";

import {
  findCount<#=child.itemTablePascal#>,
} from "@/pages/<#=child.table#>/Api.ts";<#
}
#>

type SliderMenuItem = {
  id: string;
  title: string;
  count?: number;
  disabled: boolean;
  selected: string[];
};

const foreignTabGroupKeys = [<#
for (let i = 0; i < foreignTabGroups.length; i++) {
  const group = foreignTabGroups[i];
#>
  "<#=group.columnName#>"<#
  if (i < foreignTabGroups.length - 1) {
#>,<#
  }
}
#>
] as const;

const basicInfoTabId = "__basic_info__";
const sliderWidth = "160rpx";

let pageTitle = $ref("");
let tabGroup = $ref("<#=defaultForeignTabGroup#>");
let activeTabId = $ref<string>(basicInfoTabId);
let visitedTabIds = $ref<string[]>([ basicInfoTabId ]);

let <#=table#>_id = $ref<<#=Table_Up#>Id>();

const <#=table#>_detail_ref = $ref<InstanceType<typeof <#=Table_Up#>Detail>>();<#
for (const group of foreignTabGroups) {
  for (const tab of group.tabs) {
#>

let <#=tab.totalVar#> = $ref<number>();<#
  }
}
#>

const sliderMenuList = $computed<SliderMenuItem[]>(() => {
  switch (tabGroup) {<#
  for (const group of foreignTabGroups) {
#>
    case "<#=group.columnName#>":
      return [
        {
          id: basicInfoTabId,
          title: "基本信息",
          disabled: false,
          selected: [ ],
        },<#
        for (const tab of group.tabs) {
#>
        {
          id: "<#=tab.tabId#>",
          title: "<#=tab.label#>",
          count: <#=tab.totalVar#>,
          disabled: false,
          selected: [ ],
        },<#
        }
#>
      ];<#
  }
#>
    default:
      return [
        {
          id: basicInfoTabId,
          title: "基本信息",
          disabled: false,
          selected: [ ],
        },
      ];
  }
});

function shouldRenderTab(
  tabId: string,
) {
  return visitedTabIds.includes(tabId);
}

async function ensureDetailLoaded() {
  if (activeTabId !== basicInfoTabId || !<#=table#>_id) {
    return;
  }
  await nextTick();
  await <#=table#>_detail_ref?.refresh();
}

watch(
  () => tabGroup,
  () => {
    if (!sliderMenuList.some((item) => item.id === activeTabId)) {
      activeTabId = basicInfoTabId;
    }
  },
  {
    immediate: true,
  },
);

watch(
  () => activeTabId,
  async (tabId) => {
    if (!visitedTabIds.includes(tabId)) {
      visitedTabIds.push(tabId);
    }
    await ensureDetailLoaded();
  },
  {
    immediate: true,
  },
);<#
for (const group of foreignTabGroups) {
  for (const tab of group.tabs) {
#>

function getSearch<#=tab.fnSuffix#>(): Partial<<#=tab.itemTablePascal#>Search> {
  if (!<#=table#>_id) {
    return { };
  }
  return {
    <#=tab.column#>: <#
    if (tab.searchIsArray) {
    #>[ <#=table#>_id ]<#
    } else {
    #><#=table#>_id<#
    }
    #>,<#
    if (tab.hasBizType) {
    #>
    biz_type: [ FollowBizType.<#=toPascalCase(table)#> ],<#
    }
    #>
  };
}

function getInputPatch<#=tab.fnSuffix#>(): Partial<<#=tab.itemTablePascal#>Input> {
  if (!<#=table#>_id) {
    return { };
  }
  return {
    <#=tab.column#>: <#=table#>_id,<#
    if (tab.foreignLabelField) {
    #>
    <#=tab.foreignLabelField#>: pageTitle || undefined,<#
    }
    if (tab.hasBizType) {
    #>
    biz_type: FollowBizType.<#=toPascalCase(table)#>,<#
    }
    if (tab.hasBizLbl) {
    #>
    biz_lbl: pageTitle || undefined,<#
    }
    #>
  };
}

function getAddQuery<#=tab.fnSuffix#>() {
  return {
    action: "add",
    input_patch: JSON.stringify(getInputPatch<#=tab.fnSuffix#>()),
  };
}

async function useFindCount<#=tab.fnSuffix#>() {
  if (!<#=table#>_id) {
    <#=tab.totalVar#> = undefined;
    return;
  }
  <#=tab.totalVar#> = await findCount<#=tab.itemTablePascal#>(
    getSearch<#=tab.fnSuffix#>(),
    {
      notLoading: true,
    },
  );
}<#
  }
}
#>

async function useAllFindCount() {
  await Promise.all([<#
  for (const group of foreignTabGroups) {
    for (const tab of group.tabs) {
#>
    useFindCount<#=tab.fnSuffix#>(),<#
    }
  }
#>
  ]);
}

async function onChildListRefresh() {
  await useAllFindCount();
}

onLoad(async function(
  query?: AnyObject,
) {
  const <#=table#>_id_str = query?.<#=table#>_id;
  const title = query?.title;
  const tabGroupQuery = query?.tabGroup;
  const activeTabIdQuery = query?.tabId;
  if (<#=table#>_id_str) {
    <#=table#>_id = decodeURIComponent(<#=table#>_id_str) as <#=Table_Up#>Id;
  }
  if (title) {
    pageTitle = decodeURIComponent(title);
    await uni.setNavigationBarTitle({
      title: pageTitle,
    });
  }
  if (tabGroupQuery) {
    const nextTabGroup = decodeURIComponent(tabGroupQuery);
    if (foreignTabGroupKeys.includes(nextTabGroup as typeof foreignTabGroupKeys[number])) {
      tabGroup = nextTabGroup;
    }
  }
  if (activeTabIdQuery) {
    const nextTabId = decodeURIComponent(activeTabIdQuery);
    if (sliderMenuList.some((item) => item.id === nextTabId)) {
      activeTabId = nextTabId;
    }
  }<#
  for (const child of uniqueChildTables) {
#>

  uni.$off("/pages/<#=child.table#>/List:refresh", onChildListRefresh);
  uni.$on("/pages/<#=child.table#>/List:refresh", onChildListRefresh);<#
  }
#>

  await useAllFindCount();
  await ensureDetailLoaded();
});

onUnload(() => {<#
for (const child of uniqueChildTables) {
#>

  uni.$off("/pages/<#=child.table#>/List:refresh", onChildListRefresh);<#
}
#>
});
</script>