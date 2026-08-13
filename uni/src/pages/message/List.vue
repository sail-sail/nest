<template>
<view
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
  un-bg="gray-50"
>
  <view
    un-p="x-4 y-3"
    un-bg="white"
    un-border="b gray-100"
  >
    <view un-flex="~ justify-between items-start">
      <view>
        <view un-text="lg font-semibold">
          消息中心
        </view>
        <view
          un-m="t-1"
          un-text="gray-500 sm"
        >
          共 {{ totalCount }} 条消息，未读 {{ unreadCount }} 条
        </view>
      </view>
      
      <view
        un-flex="~ items-center"
        un-gap="x-2"
      >
        <view
          un-flex="~ items-center"
          un-p="x-3 y-1.5"
          un-rounded="full"
          un-bg="gray-100"
          un-text="gray-600 sm"
          un-cursor="pointer"
          @click="refreshMessages()"
        >
          刷新
        </view>
        <view
          un-flex="~ items-center"
          un-p="x-3 y-1.5"
          un-rounded="full"
          un-bg="gray-100"
          un-text="gray-600 sm"
          un-cursor="pointer"
          @click="toggleEditMode"
        >
          {{ isEditing ? '取消' : '编辑' }}
        </view>
      </view>
    </view>

    <view
      un-flex="~"
      un-m="t-3"
      un-p="1"
      un-bg="gray-100"
      un-rounded="full"
    >
      <view
        v-for="tab in tabs"
        :key="tab.value"
        un-flex="~ [1_0_0] items-center justify-center"
        un-p="y-1.5"
        un-rounded="full"
        un-cursor="pointer"
        :class="{
          'bg-white text-blue-600 shadow-sm': activeTab === tab.value,
          'text-gray-500': activeTab !== tab.value,
        }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </view>
    </view>
  </view>

  <scroll-view
    un-flex="~ [1_0_0] col"
    un-overflow="hidden"
    scroll-y
    enable-back-to-top
    enable-flex
    refresher-enabled
    :refresher-triggered="refresherTriggered"
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="onLoadMore"
  >
    <view
      v-if="!inited && visibleItems.length === 0"
      un-m="x-3 t-3"
      un-p="x-4 y-6"
      un-box-border
      un-flex="~ [1_0_0]"
      un-overflow-hidden
      un-rounded="lg"
      un-text="gray-500"
      un-justify="center"
      un-items="center"
      un-bg="white"
    >
      加载中，请稍候...
    </view>

    <view
      v-else-if="inited && visibleItems.length === 0"
      un-m="x-3 t-3"
      un-p="x-4 y-6"
      un-box-border
      un-flex="~ [1_0_0]"
      un-overflow-hidden
      un-rounded="lg"
      un-text="gray-500"
      un-justify="center"
      un-items="center"
      un-bg="white"
    >
      暂无{{ activeTab === 'unread' ? '未读' : '已读' }}消息
    </view>

    <view
      v-else
      un-flex="~ col"
      un-gap="y-2"
      un-m="x-3 y-3"
    >
      <view
        v-if="isEditing"
        un-flex="~ justify-between items-center"
        un-p="x-1"
      >
        <tm-radio
          v-model="isCurrentTabAllSelected"
          :size="28"
          :label-font-size="22"
          label="全选"
        />

        <view
          un-flex="~ items-center"
          un-gap="x-2"
        >
          <view
            v-if="activeTab === 'unread'"
            un-p="x-3 y-1.5"
            un-rounded="full"
            un-bg="blue-500"
            un-text="white sm"
            un-cursor="pointer"
            @click="markSelectedAsRead"
          >
            标为已读
          </view>
          <view
            v-if="activeTab === 'read'"
            un-p="x-3 y-1.5"
            un-rounded="full"
            un-bg="red-500"
            un-text="white sm"
            un-cursor="pointer"
            @click="deleteSelectedReadMessages"
          >
            删除
          </view>
        </view>
      </view>

      <view
        v-for="item in visibleItems"
        :key="item.receiver.id"
        un-flex="~"
        un-gap="x-2"
      >
        <view
          v-if="isEditing"
          un-flex="~ items-start"
          un-p="t-3"
        >
          <tm-radio
            :model-value="isItemSelected(item)"
            :size="26"
            :show-label="false"
            @change="toggleItemSelection(item, $event)"
          />
        </view>

        <view
          un-flex="~ [1_0_0] col"
          un-p="x-3 y-3"
          un-rounded="lg"
          un-bg="white"
          un-border="1 gray-100"
          un-shadow="sm"
          un-cursor="pointer"
          @click="handleMessageTap(item)"
        >
          <view un-flex="~ justify-between items-start">
            <view
              un-flex="~ items-center"
              un-gap="x-2"
              un-overflow-hidden
            >
              <view
                v-if="!isRead(item.receiver)"
                un-p="x-2 y-1"
                un-rounded="full"
                un-bg="red-50"
                un-text="red-500 xs"
                un-whitespace="nowrap"
              >
                未读
              </view>
              <view
                v-else
                un-p="x-2 y-1"
                un-rounded="full"
                un-bg="gray-100"
                un-text="gray-500 xs"
                un-whitespace="nowrap"
              >
                已读
              </view>
              <view
                un-font="semibold"
                un-text="gray-800"
                un-overflow-hidden
                un-text-ellipsis
              >
                {{ getMessageTitle(item) }}
              </view>
            </view>
            <view
              un-text="gray-400 xs"
              un-whitespace="nowrap"
            >
              {{ formatTime(item.receiver.create_time) }}
            </view>
          </view>

          <view
            un-m="t-2"
            un-text="gray-500 sm"
            un-line-clamp="2"
          >
            {{ getMessageContent(item) }}
          </view>

          <view
            v-if="item.message?.route_path"
            un-m="t-2"
            un-text="blue-500 sm"
          >
            可查看相关内容
          </view>
        </view>
      </view>
    </view>

    <view
      v-if="isLoading && visibleItems.length > 0"
      un-p="x-3 y-3"
      un-text="gray-500 sm"
    >
      加载中...
    </view>

    <view
      v-else-if="!isEnd && visibleItems.length > 0"
      un-p="x-3 y-3"
      un-text="center blue-500 sm"
      un-cursor="pointer"
      @click="onLoadMore"
    >
      加载更多
    </view>
  </scroll-view>

  <tm-drawer
    v-model:show="detailVisible"
    title="消息详情"
    :show-close="true"
    :show-footer="false"
  >
    <view
      v-if="selectedItem"
      un-p="x-4 y-2"
    >
      <view un-flex="~ justify-between items-start">
        <view un-text="lg font-semibold">
          {{ getMessageTitle(selectedItem) }}
        </view>
        <view
          v-if="!isRead(selectedItem.receiver)"
          un-p="x-2 y-1"
          un-rounded="full"
          un-bg="red-50"
          un-text="red-500 xs"
        >
          未读
        </view>
      </view>

      <view
        un-m="t-3"
        un-text="gray-500 sm"
      >
        <view>发送时间：{{ formatTime(selectedItem.receiver.create_time) }}</view>
        <view v-if="selectedItem.message?.sender_usr_id_lbl">
          发送人：{{ selectedItem.message.sender_usr_id_lbl }}
        </view>
      </view>

      <view
        un-m="t-4"
        un-leading="7"
        un-text="gray-700"
      >
        {{ getMessageContent(selectedItem) }}
      </view>

      <view
        v-if="!isRead(selectedItem.receiver)"
        un-m="t-5"
        un-flex="~ justify-end"
      >
        <view
          un-p="x-4 y-2"
          un-rounded="full"
          un-bg="[var(--color-primary)]"
          un-text="white"
          un-cursor="pointer"
          @click="markAsRead(selectedItem)"
        >
          标为已读
        </view>
      </view>
    </view>
  </tm-drawer>
  
  <AppLoading></AppLoading>
</view>
</template>

<script setup lang="ts">
import type { MessageReceiverModel as MessageReceiverModelType } from "#/types.ts";
import { query, mutation } from "@/utils/graphql";
import useUsrStore from "@/store/usr";

type MessageCenterItem = {
  receiver: MessageReceiverModelType;
  message?: MessageModel;
};

type TabValue = "unread" | "read";

const usrStore = useUsrStore();
let inited = $ref(false);
let isLoading = $ref(false);
let isEnd = false;
let isEditing = $ref(false);
let activeTab = $ref<TabValue>("unread");
let detailVisible = $ref(false);
let selectedItem = $ref<MessageCenterItem | null>(null);
let items = $ref<MessageCenterItem[]>([]);
let selectedUnreadIds = $ref<string[]>([]);
let selectedReadIds = $ref<string[]>([]);

const tabs: Array<{ label: string; value: TabValue }> = [
  { label: "未读", value: "unread" },
  { label: "已读", value: "read" },
];

let pgOffset = 0;
const pgSize = 20;
let total = $ref(0);
let unreadTotal = $ref(0);
let readTotal = $ref(0);

const totalCount = $computed(() => total);
const unreadCount = $computed(() => unreadTotal);
const readCount = $computed(() => readTotal);
const unreadItems = $computed(() => items.filter((item) => !isRead(item.receiver)));
const readItems = $computed(() => items.filter((item) => isRead(item.receiver)));
const visibleItems = $computed(() => activeTab === "unread" ? unreadItems : readItems);
const currentTabSelectionIds = $computed(() => activeTab === "unread" ? selectedUnreadIds : selectedReadIds);
const isCurrentTabAllSelected = $computed({
  get() {
    return visibleItems.length > 0 && currentTabSelectionIds.length === visibleItems.length;
  },
  set(value: boolean) {
    toggleCurrentTabSelectAll(value);
  },
});

function isRead(receiver: MessageReceiverModelType) {
  return Number(receiver.is_read) === 1;
}

function getItemSelectionId(item: MessageCenterItem) {
  return String(item.receiver.id);
}

function isItemSelected(item: MessageCenterItem) {
  const id = getItemSelectionId(item);
  if (activeTab === "unread") {
    return selectedUnreadIds.includes(id);
  }
  return selectedReadIds.includes(id);
}

function toggleItemSelection(item: MessageCenterItem, isSelected: boolean) {
  const id = getItemSelectionId(item);
  if (activeTab === "unread") {
    selectedUnreadIds = isSelected
      ? [...new Set([...selectedUnreadIds, id])]
      : selectedUnreadIds.filter((currentId) => currentId !== id);
    return;
  }
  selectedReadIds = isSelected
    ? [...new Set([...selectedReadIds, id])]
    : selectedReadIds.filter((currentId) => currentId !== id);
}

function toggleCurrentTabSelectAll(selectAll?: boolean) {
  const shouldSelectAll = selectAll ?? !isCurrentTabAllSelected;
  if (!shouldSelectAll) {
    if (activeTab === "unread") {
      selectedUnreadIds = [];
    } else {
      selectedReadIds = [];
    }
    return;
  }

  const ids = visibleItems.map((item) => getItemSelectionId(item));
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

function toggleEditMode() {
  isEditing = !isEditing;
  if (!isEditing) {
    selectedUnreadIds = [];
    selectedReadIds = [];
  }
}

function getMessageTitle(item: MessageCenterItem) {
  return item.message?.title || item.message?.content || item.receiver.message_id_content || "系统消息";
}

function getMessageContent(item: MessageCenterItem) {
  return item.message?.content || item.receiver.message_id_content || "暂无内容";
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

async function refreshMessages(isCount = true) {
  if (isLoading) {
    return;
  }

  const usrId = usrStore.getUsrId();
  if (!usrId) {
    items = [];
    total = 0;
    unreadTotal = 0;
    readTotal = 0;
    inited = true;
    return;
  }

  isLoading = true;
  pgOffset = 0;

  try {
    const shouldCount = isCount !== false;

    isEnd = false;

    const [receiverData, unreadCountData, readCountData] = await Promise.all([
      query({
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
            receiver_usr_id: usrId,
          },
          page: {
            pgOffset: 0,
            pgSize,
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
      }),
      shouldCount
        ? query({
          query: /* GraphQL */ `
            query($search: MessageReceiverSearch) {
              findCountMessageReceiver(search: $search)
            }
          `,
          variables: {
            search: {
              receiver_usr_id: usrId,
              is_read: [0],
            },
          },
        }, {
          notLoading: true,
        })
        : Promise.resolve({ findCountMessageReceiver: unreadTotal }),
      shouldCount
        ? query({
          query: /* GraphQL */ `
            query($search: MessageReceiverSearch) {
              findCountMessageReceiver(search: $search)
            }
          `,
          variables: {
            search: {
              receiver_usr_id: usrId,
              is_read: [1],
            },
          },
        }, {
          notLoading: true,
        })
        : Promise.resolve({ findCountMessageReceiver: readTotal }),
    ]);

    const receivers = receiverData.findAllMessageReceiver || [];
    if (receivers.length === 0) {
      items = [];
      if (shouldCount) {
        total = 0;
        unreadTotal = 0;
        readTotal = 0;
      }
      inited = true;
      return;
    }

    const messageIds = receivers
      .map((item: MessageReceiverModelType) => item.message_id)
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
    items = receivers
      .map((receiver: MessageReceiverModelType) => ({
        receiver,
        message: messageMap.get(String(receiver.message_id)),
      }))
      .sort((a, b) => {
        const aTime = a.receiver.create_time || "";
        const bTime = b.receiver.create_time || "";
        return bTime.localeCompare(aTime);
      });

    if (shouldCount) {
      total = Number(receiverData.findAllMessageReceiver?.length || 0);
      unreadTotal = Number(unreadCountData.findCountMessageReceiver || 0);
      readTotal = Number(readCountData.findCountMessageReceiver || 0);
    }

    syncSelectionIds();
    inited = true;
  } finally {
    isLoading = false;
  }
}

async function onRefresh() {
  await refreshMessages();
}

async function onLoadMore() {
  if (isLoading || isEnd) {
    return;
  }

  const usrId = usrStore.getUsrId();
  if (!usrId) {
    return;
  }

  isLoading = true;
  try {
    const data: {
      findAllMessageReceiver: MessageReceiverModelType[];
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
          receiver_usr_id: usrId,
        },
        page: {
          pgOffset: pgOffset + pgSize,
          pgSize,
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
      isEnd = true;
      return;
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
    const extraItems = receivers
      .map((receiver) => ({
        receiver,
        message: messageMap.get(String(receiver.message_id)),
      }))
      .sort((a, b) => {
        const aTime = a.receiver.create_time || "";
        const bTime = b.receiver.create_time || "";
        return bTime.localeCompare(aTime);
      });

    items = [...items, ...extraItems];
    pgOffset += receivers.length;
    isEnd = receivers.length < pgSize;
  } finally {
    isLoading = false;
  }
}

async function markAsRead(item: MessageCenterItem) {
  if (!item.receiver.id || isRead(item.receiver)) {
    selectedItem = item;
    detailVisible = true;
    return;
  }

  try {
    const ok = await mutation({
      query: /* GraphQL */ `
        mutation($id: MessageReceiverId!) {
          markMessageReceiverAsRead(id: $id)
        }
      `,
      variables: {
        id: item.receiver.id,
      },
    }, {
      notLoading: true,
    });
    if (!ok) {
      uni.showToast({
        title: "更新消息状态失败",
        icon: "none",
      });
      return;
    }
    item.receiver.is_read = 1;
    item.receiver.read_time = dayjs().format("YYYY-MM-DDTHH:mm:ss");
    syncSelectionIds();
    await refreshMessages(false);
  } catch (err) {
    console.error(err);
    uni.showToast({
      title: "更新消息状态失败",
      icon: "none",
    });
  }
}

function handleMessageTap(item: MessageCenterItem) {
  if (isEditing) {
    toggleItemSelection(item, !isItemSelected(item));
    return;
  }
  selectedItem = item;
  detailVisible = true;
  void markAsRead(item);
}

async function markSelectedAsRead() {
  const ids = selectedUnreadIds.filter(Boolean);
  if (ids.length === 0) {
    return;
  }

  try {
    let successCount = 0;
    for (const id of ids) {
      const ok = await mutation({
        query: /* GraphQL */ `
          mutation($id: MessageReceiverId!) {
            markMessageReceiverAsRead(id: $id)
          }
        `,
        variables: {
          id,
        },
      }, {
        notLoading: true,
      });
      if (ok) {
        successCount += 1;
      }
    }

    if (successCount === 0) {
      uni.showToast({
        title: "更新消息状态失败",
        icon: "none",
      });
      return;
    }

    selectedUnreadIds = [];
    await refreshMessages(false);
    uni.showToast({
      title: `已将 ${successCount} 条消息设为已读`,
      icon: "none",
    });
  } catch (err) {
    console.error(err);
    uni.showToast({
      title: "更新消息状态失败",
      icon: "none",
    });
  }
}

async function deleteSelectedReadMessages() {
  const ids = selectedReadIds.filter(Boolean);
  
  if (ids.length === 0) {
    return;
  }
  
  const {
    confirm
  } = await uni.showModal({
    title: "确认删除",
    content: `确定要删除 ${ids.length} 条已读消息吗？`,
    confirmText: "删除",
    cancelText: "取消",
  });
  
  if (!confirm) {
    return;
  }
  
  const count = (await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MessageReceiverId!]!) {
        deleteByIdsMessageReceiver(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }))?.length;

  selectedReadIds = [];
  await refreshMessages();
  uni.showToast({
    title: `已删除 ${count} 条消息`,
    icon: "none",
  });
  
}

let refresherTriggered = $ref(false);

async function onRefresherrefresh() {
  refresherTriggered = true;
  try {
    await refreshMessages();
  } finally {
    refresherTriggered = false;
  }
}

onShow(() => {
  void refreshMessages();
});

initFrame();

async function initFrame() {
  await refreshMessages();
  inited = true;
}
</script>

