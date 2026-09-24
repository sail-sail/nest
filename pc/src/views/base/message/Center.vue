<template>
  <div
    un-flex="~ col"
    un-overflow-hidden
    un-w="full"
    un-h="full"
    un-p="4"
    un-box-border
    un-bg="[var(--el-bg-color)]"
  >
    <div
      un-flex="~ justify-between items-center"
      un-m="b-4"
    >
      <div>
        <div un-text="2xl font-semibold">
          消息中心
        </div>
        <div un-m="t-1" un-text="gray-500">
          共 {{ totalCount }} 条消息，未读 {{ unreadCount }} 条，已读 {{ readCount }} 条
        </div>
      </div>
      <el-button
        plain
        @click="refreshMessageTabs()"
      >
        <template #icon>
          <ElIconRefresh />
        </template>
        刷新
      </el-button>
    </div>

    <div
      shadow="never"
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
    >
      <el-tabs
        v-model="activeTab"
        class="el-flex-tabs"
        type="card"
      >
        <el-tab-pane
          :label="`未读(${unreadCount})`"
          name="unread"
          un-flex="~ [1_0_0] col"
          un-overflow-hidden
          un-p="4"
          un-box-border
        >
          <div
            un-min="h-80"
          >
            <div un-flex="~ items-center justify-between" un-m="b-3">
              <div un-flex="~ items-center" un-gap="x-2">
                <el-checkbox
                  :model-value="isCurrentTabAllSelected"
                  :indeterminate="isCurrentTabIndeterminate"
                  @change="toggleCurrentTabSelectAll"
                />
                <span un-text="gray-500 sm">全选</span>
              </div>
              <el-button
                :disabled="selectedUnreadIds.length === 0"
                @click="markSelectedAsRead"
              >
                设为已读
              </el-button>
            </div>
            <div
              v-if="unreadItems.length > 0"
              class="message-list"
              un-flex="~ [1_0_0] col"
              un-overflow="x-hidden y-auto"
            >
              <div
                v-for="item in unreadItems"
                :key="item.receiver.id"
                class="message-card unread"
                :class="{ 'is-selected': isItemSelected(item, 'unread') }"
              >
                <div un-flex="~ items-start" un-gap="x-3">
                  <div class="selection-cell" @click.stop>
                    <el-checkbox
                      :model-value="isItemSelected(item, 'unread')"
                      @change="toggleItemSelection(item, 'unread')"
                    />
                  </div>
                  <div un-flex="~ col" un-w="full" @click="openDetail(item)">
                    <div un-flex="~ justify-between items-start">
                      <div un-flex="~ col" un-gap="y-1">
                        <div un-flex="~ items-center" un-gap="x-2">
                          <el-tag type="danger" size="small">未读</el-tag>
                          <span un-font="semibold">
                            {{ item.message?.title || item.message?.content || item.receiver.message_id_content || '系统消息' }}
                          </span>
                        </div>
                        <div un-text="gray-500 sm" un-line-clamp="2">
                          {{ item.message?.content || item.receiver.message_id_content || '暂无内容' }}
                        </div>
                      </div>
                      <div un-text="gray-400 sm" un-whitespace-nowrap>
                        {{ formatTime(item.receiver.create_time) }}
                      </div>
                    </div>
                    <div v-if="item.message?.route_path" un-m="t-5">
                      <el-button
                        link
                        type="primary"
                        @click.stop="goToRoute(item)"
                      >
                        跳转
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-empty
              v-else-if="inited"
              description="暂无未读消息"
            />
            <el-empty
              v-else
              description="加载中, 请稍候..."
            />
          </div>
        </el-tab-pane>

        <el-tab-pane
          :label="`已读(${readCount})`"
          name="read"
          un-flex="~ [1_0_0] col"
          un-overflow-hidden
          un-p="4"
          un-box-border
        >
          <div
            un-min="h-80"
            un-flex="~ [1_0_0] col"
            un-overflow="hidden"
          >
            <div un-flex="~ items-center justify-between" un-m="b-3">
              <div un-flex="~ items-center" un-gap="x-2">
                <el-checkbox
                  :model-value="isCurrentTabAllSelected"
                  :indeterminate="isCurrentTabIndeterminate"
                  @change="toggleCurrentTabSelectAll"
                />
                <span un-text="gray-500 sm">全选</span>
              </div>
              <el-button
                :disabled="selectedReadIds.length === 0"
                @click="deleteSelectedReadMessages"
              >
                删除已选
              </el-button>
            </div>
            <div
              v-if="readItems.length > 0"
              class="message-list"
              un-flex="~ [1_0_0] col"
              un-overflow="x-hidden y-auto"
            >
              <div
                v-for="item in readItems"
                :key="item.receiver.id"
                class="message-card"
                :class="{ 'is-selected': isItemSelected(item, 'read') }"
              >
                <div un-flex="~ items-start" un-gap="x-3">
                  <div class="selection-cell" @click.stop>
                    <el-checkbox
                      :model-value="isItemSelected(item, 'read')"
                      @change="toggleItemSelection(item, 'read')"
                    />
                  </div>
                  <div un-flex="~ col" un-w="full" @click="openDetail(item)">
                    <div un-flex="~ justify-between items-start">
                      <div un-flex="~ col" un-gap="y-1">
                        <div un-flex="~ items-center" un-gap="x-2">
                          <el-tag type="info" size="small">已读</el-tag>
                          <span un-font="semibold">
                            {{ item.message?.title || item.message?.content || item.receiver.message_id_content || '系统消息' }}
                          </span>
                        </div>
                        <div un-text="gray-500 sm" un-line-clamp="2">
                          {{ item.message?.content || item.receiver.message_id_content || '暂无内容' }}
                        </div>
                      </div>
                      <div un-text="gray-400 sm" un-whitespace-nowrap>
                        {{ formatTime(item.receiver.create_time) }}
                      </div>
                    </div>
                    <div un-flex="~ justify-between items-center" un-m="t-3">
                      <div un-text="gray-400 sm">
                        <div v-if="item.message?.route_path" un-m="t-2">
                          <el-button
                            link
                            type="primary"
                            @click.stop="goToRoute(item)"
                          >
                            跳转
                          </el-button>
                        </div>
                      </div>
                      <div un-text="blue-500 hover:blue-600">
                        查看详情
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-empty
              v-else-if="inited"
              description="暂无已读消息"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div
      v-if="activePage.total > 0"
      un-flex="~ justify-end"
      un-m="t-4"
    >
      <el-pagination
        background
        :page-sizes="pageSizes"
        :page-size="activePage.size"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="activePage.current"
        :total="activePage.total"
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrentChange"
      />
    </div>

    <el-dialog
      v-model="detailVisible"
      title=" "
      width="640px"
      @closed="selectedItem = null"
    >
      <div v-if="selectedItem" class="detail">
        <div un-flex="~ justify-between items-center">
          <div un-text="xl font-semibold">
            {{ selectedItem.message?.title || selectedItem.message?.content || selectedItem.receiver.message_id_content || '系统消息' }}
          </div>
        </div>

        <div un-m="t-3" un-text="gray-500">
          <div>发送时间：{{ formatTime(selectedItem.receiver.create_time) }}</div>
          <div v-if="selectedItem.message?.sender_usr_id_lbl">发送人：{{ selectedItem.message.sender_usr_id_lbl }}</div>
        </div>

        <div un-m="t-4" un-leading="7">
          {{ selectedItem.message?.content || selectedItem.receiver.message_id_content || '暂无内容' }}
        </div>

        <div v-if="selectedItem.message?.route_path" un-m="t-2">
          <el-button
            link
            type="primary"
            @click="goToRoute(selectedItem)"
          >
            跳转
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { usePage } from "@/compositions/List";
import { query } from "@/utils/graphql";
import { markMessageReceiverAsRead } from "@/views/base/message/Api2";
import { deleteByIdsMessageReceiver } from "@/views/base/message_receiver/Api";

defineOptions({
  name: "消息中心",
});

type MessageCenterItem = {
  receiver: MessageReceiverModel;
  message?: MessageModel;
};

type MessageTab = "unread" | "read";

const router = useRouter();
const usrStore = useUsrStore();

const pageSizes = [ 20, 50, 100 ];

let activeTab = $ref<MessageTab>("unread");
let detailVisible = $ref(false);
let selectedItem = $ref<MessageCenterItem | null>(null);
let unreadItems = $ref<MessageCenterItem[]>([]);
let readItems = $ref<MessageCenterItem[]>([]);
let selectedUnreadIds = $ref<string[]>([]);
let selectedReadIds = $ref<string[]>([]);

const { page: unreadPage, pgSizeChg: unreadPgSizeChg, pgCurrentChg: unreadPgCurrentChg } = $(usePage(async (isCount = true) => {
  await refreshMessages("unread", isCount);
}, {
  pageSizes,
  isPagination: true,
}));

const { page: readPage, pgSizeChg: readPgSizeChg, pgCurrentChg: readPgCurrentChg } = $(usePage(async (isCount = true) => {
  await refreshMessages("read", isCount);
}, {
  pageSizes,
  isPagination: true,
}));

const activePage = $computed(() => activeTab === "unread" ? unreadPage : readPage);
const totalCount = $computed(() => unreadPage.total + readPage.total);
const unreadCount = $computed(() => unreadPage.total);
const readCount = $computed(() => readPage.total);
const currentTabSelectionIds = $computed(() => activeTab === "unread" ? selectedUnreadIds : selectedReadIds);
const currentTabItems = $computed(() => activeTab === "unread" ? unreadItems : readItems);
const isCurrentTabAllSelected = $computed(() => currentTabItems.length > 0 && currentTabSelectionIds.length === currentTabItems.length);
const isCurrentTabIndeterminate = $computed(() => currentTabSelectionIds.length > 0 && currentTabSelectionIds.length < currentTabItems.length);

function isRead(receiver: MessageReceiverModel) {
  return Number(receiver.is_read) === 1;
}

function getItemSelectionId(item: MessageCenterItem) {
  return String(item.receiver.id);
}

function isItemSelected(item: MessageCenterItem, tabName: "unread" | "read") {
  const id = getItemSelectionId(item);
  if (tabName === "unread") {
    return selectedUnreadIds.includes(id);
  }
  return selectedReadIds.includes(id);
}

function toggleItemSelection(item: MessageCenterItem, tabName: "unread" | "read") {
  const id = getItemSelectionId(item);
  if (tabName === "unread") {
    selectedUnreadIds = selectedUnreadIds.includes(id)
      ? selectedUnreadIds.filter((currentId) => currentId !== id)
      : [...selectedUnreadIds, id];
    return;
  }
  selectedReadIds = selectedReadIds.includes(id)
    ? selectedReadIds.filter((currentId) => currentId !== id)
    : [...selectedReadIds, id];
}

function selectSingleItem(item: MessageCenterItem, tabName: "unread" | "read") {
  const id = getItemSelectionId(item);
  selectedUnreadIds = [];
  selectedReadIds = [];
  if (tabName === "unread") {
    selectedUnreadIds = [id];
    return;
  }
  selectedReadIds = [id];
}

function toggleCurrentTabSelectAll() {
  if (isCurrentTabAllSelected) {
    if (activeTab === "unread") {
      selectedUnreadIds = [];
    } else {
      selectedReadIds = [];
    }
    return;
  }

  const ids = currentTabItems.map((item) => getItemSelectionId(item));
  if (activeTab === "unread") {
    selectedUnreadIds = ids;
  } else {
    selectedReadIds = ids;
  }
}

function syncSelectionIds() {
  const unreadIds = new Set(unreadItems.map((item) => getItemSelectionId(item)));
  selectedUnreadIds = selectedUnreadIds.filter((id) => unreadIds.has(id));

  const readIds = new Set(readItems.map((item) => getItemSelectionId(item)));
  selectedReadIds = selectedReadIds.filter((id) => readIds.has(id));
}

function handlePageSizeChange(size: number) {
  if (activeTab === "unread") {
    return unreadPgSizeChg(size);
  }
  return readPgSizeChg(size);
}

function handlePageCurrentChange(current: number) {
  if (activeTab === "unread") {
    return unreadPgCurrentChg(current);
  }
  return readPgCurrentChg(current);
}

function formatTime(value?: string | null) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRouteQuery(routeQuery?: string | Record<string, unknown> | null) {
  if (!routeQuery) {
    return {};
  }
  if (typeof routeQuery === "string") {
    try {
      return JSON.parse(routeQuery);
    } catch {
      return {};
    }
  }
  return routeQuery as Record<string, unknown>;
}

async function refreshMessages(tab: MessageTab = activeTab, isCount = true) {
  const shouldCount = isCount !== false;
  const currentPage = tab === "unread" ? unreadPage : readPage;
  const tabStatus = tab === "unread" ? 0 : 1;

  if (!usrStore.usr_id) {
    if (tab === "unread") {
      unreadItems = [];
    } else {
      readItems = [];
    }
    if (shouldCount) {
      currentPage.total = 0;
    }
    inited = true;
    return;
  }

  const data: {
    findAllMessageReceiver: MessageReceiverModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: MessageReceiverSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllMessageReceiver(search: $search, page: $page, sort: $sort) {
          id
          message_id
          receiver_usr_id
          is_read
          read_time
          create_time
          message_id_content
        }
      }
    `,
    variables: {
      search: {
        receiver_usr_id: usrStore.usr_id,
        channel: "sys",
        is_read: [ tabStatus ],
      },
      page: {
        pgOffset: (currentPage.current - 1) * currentPage.size,
        pgSize: currentPage.size,
        isResultLimit: true,
      },
      sort: [
        {
          prop: "create_time",
          order: "descending",
        },
      ],
    },
  }, {
    notLoading: true,
  });

  const receivers = data.findAllMessageReceiver || [];
  if (receivers.length === 0) {
    if (tab === "unread") {
      unreadItems = [];
    } else {
      readItems = [];
    }
    if (shouldCount) {
      currentPage.total = 0;
    }
    inited = true;
    return;
  }

  if (shouldCount) {
    const countData: {
      findCountMessageReceiver: number;
    } = await query({
      query: /* GraphQL */ `
        query($search: MessageReceiverSearch) {
          findCountMessageReceiver(search: $search)
        }
      `,
      variables: {
        search: {
          receiver_usr_id: usrStore.usr_id,
          channel: "sys",
          is_read: [ tabStatus ],
        },
      },
    }, {
      notLoading: true,
    });
    currentPage.total = countData.findCountMessageReceiver || 0;
  }

  const messageIds = receivers
    .map((item) => item.message_id)
    .filter(Boolean) as string[];

  let messages: MessageModel[] = [];
  if (messageIds.length > 0) {
    const messageData: {
      findAllMessage: MessageModel[];
    } = await query({
      query: /* GraphQL */ `
        query($search: MessageSearch) {
          findAllMessage(search: $search) {
            id
            title
            content
            route_path
            route_query
            sender_usr_id
            sender_usr_id_lbl
            create_time
          }
        }
      `,
      variables: {
        search: {
          ids: messageIds,
        },
      },
    }, {
      notLoading: true,
    });
    messages = messageData.findAllMessage || [];
  }

  const messageMap = new Map(messages.map((item) => [String(item.id), item]));
  const nextItems = receivers
    .map((receiver) => ({
      receiver,
      message: messageMap.get(String(receiver.message_id)),
    }))
    .sort((a, b) => {
      const aTime = a.receiver.create_time || "";
      const bTime = b.receiver.create_time || "";
      return bTime.localeCompare(aTime);
    });

  if (tab === "unread") {
    unreadItems = nextItems;
  } else {
    readItems = nextItems;
  }

  syncSelectionIds();
  inited = true;
}

async function refreshMessageTabs(isCount = true) {
  await Promise.all([
    refreshMessages("unread", isCount),
    refreshMessages("read", isCount),
  ]);
}

async function markAsRead(item: MessageCenterItem) {
  if (!item.receiver.id || isRead(item.receiver)) {
    return;
  }
  try {
    const ok = await markMessageReceiverAsRead(item.receiver.id);
    if (!ok) {
      ElMessage.error("更新消息状态失败");
      return;
    }
    item.receiver.is_read = 1;
    item.receiver.read_time = dayjs().format("YYYY-MM-DDTHH:mm:ss");
    window.dispatchEvent(new CustomEvent("message-count-changed"));
  } catch (err) {
    console.error(err);
    ElMessage.error("更新消息状态失败");
  }
}

async function openDetail(item: MessageCenterItem) {
  selectSingleItem(item, activeTab === "unread" ? "unread" : "read");
  await markAsRead(item);
  selectedItem = item;
  detailVisible = true;
}

async function markSelectedAsRead() {
  const ids = selectedUnreadIds
    .map((id) => id as MessageReceiverId)
    .filter(Boolean);
  if (ids.length === 0) {
    return;
  }

  try {
    let successCount = 0;
    for (const id of ids) {
      const ok = await markMessageReceiverAsRead(id);
      if (ok) {
        successCount += 1;
      }
    }

    if (successCount === 0) {
      ElMessage.error("更新消息状态失败");
      return;
    }

    selectedUnreadIds = [];
    await refreshMessageTabs();
    window.dispatchEvent(new CustomEvent("message-count-changed"));
    ElMessage.success(`已将 ${successCount} 条消息设为已读`);
  } catch (err) {
    console.error(err);
    ElMessage.error("更新消息状态失败");
  }
}

async function deleteSelectedReadMessages() {
  const ids = selectedReadIds
    .map((id) => id as MessageReceiverId)
    .filter(Boolean);
  if (ids.length === 0) {
    return;
  }

  try {
    const count = await deleteByIdsMessageReceiver(ids);
    if (count <= 0) {
      ElMessage.error("删除消息失败");
      return;
    }

    selectedReadIds = [];
    await refreshMessageTabs();
    window.dispatchEvent(new CustomEvent("message-count-changed"));
    ElMessage.success(`已删除 ${count} 条消息`);
  } catch (err) {
    console.error(err);
    ElMessage.error("删除消息失败");
  }
}

async function goToRoute(item: MessageCenterItem) {
  if (!item.message?.route_path) {
    return;
  }
  detailVisible = false;
  await router.push({
    path: item.message.route_path,
    query: getRouteQuery(item.message.route_query),
  });
}

let inited = $ref(false);

async function initFrame() {
  await refreshMessageTabs();
  inited = true;
}

initFrame();

onActivated(() => {
  refreshMessageTabs();
});

onMounted(() => {
  window.addEventListener("message-count-changed", () => {
    refreshMessageTabs();
  });
});
</script>

<style scoped>
.message-list {
  display: grid;
  gap: 12px;
}

.message-card {
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 14px 16px;
  background: var(--el-bg-color);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.message-card:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
}

.message-card.is-selected {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 1px var(--el-color-primary-light-5) inset;
}

.message-card.unread {
  background: var(--el-color-primary-light-9);
}

.selection-cell {
  display: flex;
  align-items: flex-start;
  padding-top: 2px;
}

.detail {
  display: flex;
  flex-direction: column;
}
</style>
