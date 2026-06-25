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
          共 {{ totalCount }} 条消息，未读 {{ unreadCount }} 条
        </div>
      </div>
      <el-button
        plain
        @click="refreshMessages"
      >
        <template #icon>
          <ElIconRefresh />
        </template>
        刷新
      </el-button>
    </div>

    <el-card
      shadow="never"
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
    >
      <el-tabs v-model="activeTab" un-h="full">
        <el-tab-pane
          label="未读消息"
          name="unread"
        >
          <div
            un-min="h-80"
          >
            <div
              v-if="unreadItems.length > 0"
              class="message-list"
            >
              <div
                v-for="item in unreadItems"
                :key="item.receiver.id"
                class="message-card unread"
                @click="openDetail(item)"
              >
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
          label="已读消息"
          name="read"
        >
          <div
            un-min="h-80"
          >
            <div
              v-if="readItems.length > 0"
              class="message-list"
            >
              <div
                v-for="item in readItems"
                :key="item.receiver.id"
                class="message-card"
                @click="openDetail(item)"
              >
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
                    <span v-if="item.message?.route_path">跳转 链接</span>
                    <span v-else>无链接</span>
                  </div>
                  <div un-text="blue-500 hover:blue-600">
                    查看详情
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
    </el-card>

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

        <div v-if="selectedItem.message?.route_path" un-m="t-5">
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

<script lang="ts" setup vapor>
import { query } from "@/utils/graphql";
import { updateByIdMessageReceiver } from "@/views/base/message_receiver/Api";

defineOptions({
  name: "消息中心",
});

type MessageCenterItem = {
  receiver: MessageReceiverModel;
  message?: MessageModel;
};

const router = useRouter();
const usrStore = useUsrStore();

let activeTab = $ref("unread");
let detailVisible = $ref(false);
let selectedItem = $ref<MessageCenterItem | null>(null);
let items = $ref<MessageCenterItem[]>([]);

const totalCount = $computed(() => items.length);
const unreadItems = $computed(() => items.filter((item) => !isRead(item.receiver)));
const readItems = $computed(() => items.filter((item) => isRead(item.receiver)));
const unreadCount = $computed(() => unreadItems.length);

function isRead(receiver: MessageReceiverModel) {
  return Number(receiver.is_read) === 1;
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

async function refreshMessages() {
  if (!usrStore.usr_id) {
    items = [];
    return;
  }
  const data: {
    findAllMessageReceiver: MessageReceiverModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: MessageReceiverSearch) {
        findAllMessageReceiver(search: $search) {
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
      },
    },
  }, {
    notLoading: true,
  });

  const receivers = data.findAllMessageReceiver || [];
  if (receivers.length === 0) {
    items = [];
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
  items = receivers
    .map((receiver) => ({
      receiver,
      message: messageMap.get(String(receiver.message_id)),
    }))
    .sort((a, b) => {
      const aTime = a.receiver.create_time || "";
      const bTime = b.receiver.create_time || "";
      return bTime.localeCompare(aTime);
    });
}

async function markAsRead(item: MessageCenterItem) {
  if (!item.receiver.id || isRead(item.receiver)) {
    return;
  }
  try {
    await updateByIdMessageReceiver(item.receiver.id, {
      id: item.receiver.id,
      is_read: 1,
      read_time: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
    } as MessageReceiverInput);
    item.receiver.is_read = 1;
    item.receiver.read_time = dayjs().format("YYYY-MM-DDTHH:mm:ss");
    window.dispatchEvent(new CustomEvent("message-count-changed"));
  } catch (err) {
    console.error(err);
    ElMessage.error("更新消息状态失败");
  }
}

async function openDetail(item: MessageCenterItem) {
  await markAsRead(item);
  selectedItem = item;
  detailVisible = true;
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
  await refreshMessages();
  inited = true;
}

initFrame();

onActivated(() => {
  refreshMessages();
});

onMounted(() => {
  window.addEventListener("message-count-changed", refreshMessages);
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

.message-card.unread {
  background: var(--el-color-primary-light-9);
}

.detail {
  display: flex;
  flex-direction: column;
}
</style>
