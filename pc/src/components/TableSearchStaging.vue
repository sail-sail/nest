<template>
<div
  un-overflow-hidden
>
  <el-dropdown
    v-if="searchList.length > 0"
    un-line-height="unset"
  >
    <div
      un-flex="~"
      un-justify-center
      un-text="3 gray hover:[var(--el-color-primary)]"
      un-gap="x-0.5"
      un-outline-width="0"
    >
      <span
        un-cursor-pointer
        @click="onOpenAdd"
      >
        暂存
      </span>
      <el-icon
        un-h="full"
      >
        <ElIconArrowDown />
      </el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(item, i) in searchList"
          :key="item.name + i"
          @click="onSearch(item.value as T)"
        >
          <span>
            {{ i + 1 }}.
          </span>
          <span
            un-m="l-1"
          >
            {{ item.name }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <div
    v-else
    un-flex="~"
    un-justify-center
    un-text="3 gray hover:[var(--el-color-primary)]"
    un-gap="x-0.5"
    un-overflow-hidden
  >
    <span
      un-cursor-pointer
      @click="onOpenAdd"
    >
      暂存
    </span>
  </div>
  <TableSearchStagingDialog
    ref="tableSearchStagingDialogRef"
    :search="props.search"
    @search="onSearch"
    @change="onRefresh"
  ></TableSearchStagingDialog>
</div>
</template>

<script lang="ts" setup generic="T">
import TableSearchStagingDialog from "./TableSearchStagingDialog.vue";

const emit = defineEmits<{
  (e: "search", searchStaging?: T): void,
}>();

const props = defineProps<{
  search: T;
  pagePath: string;
  filename: string;
}>();

export type SearchStagingType = {
  name: string;
  value: T;
};

const {
  ns,
  nsAsync,
} = useI18n();

let tableSearchStagingDialogRef = $ref<InstanceType<typeof TableSearchStagingDialog>>();

let searchList = $ref<SearchStagingType[]>([ ]);

const persistKey = $computed(() => {
  return `TableSearchStaging-${ props.pagePath }--${ props.filename }`;
});

async function onOpenAdd() {
  if (!tableSearchStagingDialogRef) {
    return;
  }
  const {
    type,
  } = await tableSearchStagingDialogRef.showDialog({
    title: await nsAsync("查询条件暂存"),
    model: {
      persistKey,
      search: props.search,
    },
  });
  onRefresh();
}

function onSearch(searchStaging: T) {
  searchStaging = searchStaging ?? props.search;
  emit("search", searchStaging);
}

function onRefresh() {
  const searchListStr = localStorage.getItem(persistKey);
  if (searchListStr) {
    try {
      searchList = JSON.parse(searchListStr);
      searchList = searchList || [ ];
    } catch (e) {
      console.error(e);
      localStorage.removeItem(persistKey);
      searchList = [ ];
    }
  }
}

onRefresh();

defineExpose({
  refresh: onRefresh,
});
</script>
