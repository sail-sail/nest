<template>
<view
  un-flex="~ [1_0_0]"
  un-overflow="hidden"
  class="audit_history_field"
  :class="{
    'audit_history_field_disabled': disabled,
  }"
  :style="{
    cursor: disabled ? 'default' : 'pointer',
  }"
>
  <view
    un-flex="~ [1_0_0]"
    un-overflow="hidden"
    un-items="center"
    un-h="full"
    un-w="full"
    un-p="l-3 r-2 y-1"
    un-box-border
    un-gap="2"
    @click="onOpen"
  >

    <view
      un-flex="~ [1_0_0] wrap"
      un-overflow="hidden"
      un-items="center"
      un-h="full"
      :class="displayLabel ? 'text-gray-700 dark:text-gray-200' : 'text-[var(--color-placeholder)]'"
    >
      {{ pageInited ? (displayLabel || placeholderText) : '' }}
    </view>

    <tm-icon
      v-if="!disabled"
      :size="42"
      color="#b1b1b1"
      name="arrow-right-s-line"
    ></tm-icon>

  </view>

  <CustomDialog
    v-model:show="dialogVisible"
    :title="title"
    type="large"
    :show-footer="false"
    :close-on-click-modal="true"
  >
    <view
      un-flex="~ [1_0_0] col"
      un-overflow="hidden"
    >

      <scroll-view
        scroll-y
        enable-flex
        un-flex="~ [1_0_0] col"
        un-overflow="hidden"
      >

        <view
          v-if="isLoading"
          un-p="x-4 y-8"
          un-box-border
          un-flex="~"
          un-justify="center"
          un-text="3.5 gray-500"
        >
          加载中...
        </view>

        <view
          v-else-if="historyList.length === 0"
          un-p="x-4 y-8"
          un-box-border
          un-flex="~"
          un-justify="center"
          un-text="3.5 gray-500"
        >
          (暂无审核记录)
        </view>

        <view
          v-else
          un-p="x-4 y-4"
          un-box-border
        >
          <tm-steps
            :model-value="currentStepIndex"
            vertical
            :disabled="true"
          >
            <tm-steps-item
              v-for="(item, index) of historyList"
              :key="item.id || index"
              :color="getStepColor(item.audit)"
              :active-color="getStepColor(item.audit)"
            >
              <template #default>
                <view
                  un-flex="~ col"
                  un-gap="y-2"
                >
                  <view
                    un-flex="~ wrap"
                    un-items="center"
                    un-gap="x-2"
                  >
                    <view
                      :class="getStatusClass(item.audit)"
                    >
                      {{ item.audit_lbl || '未知状态' }}
                    </view>

                    <view
                      v-if="item.audit_usr_id_lbl"
                      un-text="3.5 gray-500 dark:gray-400"
                    >
                      {{ item.audit_usr_id_lbl }}
                    </view>
                  </view>
                </view>
              </template>

              <template #desc>
                <view
                  un-flex="~ col"
                  un-gap="y-2"
                  un-p="t-1"
                >
                  <view
                    v-if="item.audit_time_lbl"
                    un-text="3.5 gray-500 dark:gray-400"
                  >
                    {{ item.audit_time_lbl }}
                  </view>

                  <view
                    v-if="item.rem"
                    un-text="3.5 gray-700 dark:gray-200"
                    :class="{
                      'text-red-500': isRejected(item.audit),
                    }"
                  >
                    {{ item.rem }}
                  </view>
                </view>
              </template>
            </tm-steps-item>
          </tm-steps>
        </view>

      </scroll-view>

      <view
        un-p="x-4 b-4"
        un-box-border
      >
        <tm-button
          block
          color="info"
          @click="dialogVisible = false"
        >
          关闭
        </tm-button>
      </view>

    </view>
  </CustomDialog>
</view>
</template>

<script lang="ts" setup>
import type { GetDict } from "#/types";
import CustomDialog from "@/components/CustomDialog/CustomDialog.vue";
import { getDict } from "@/utils/common";

type AuditHistoryItem = {
  id?: string | number;
  audit?: string | null;
  audit_lbl?: string | null;
  audit_usr_id_lbl?: string | null;
  audit_time_lbl?: string | null;
  rem?: string | null;
};

type AuditHistoryPageInput = {
  pgOffset?: number;
  pgSize?: number;
};

type AuditHistoryMethod = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search?: Record<string, any>,
  page?: AuditHistoryPageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) => Promise<AuditHistoryItem[]>;

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null;
    modelLabel?: string | null;
    title?: string;
    placeholder?: string;
    readonlyPlaceholder?: string;
    pageInited?: boolean;
    disabled?: boolean;
    method?: AuditHistoryMethod;
    dictCode?: string;
    recordId?: string | number | null;
    recordKey?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchParams?: Record<string, any> | MaybeRef<Record<string, any> | undefined>;
  }>(),
  {
    modelValue: undefined,
    modelLabel: "",
    title: "审核历史",
    placeholder: "请选择 审核",
    readonlyPlaceholder: "暂无审核记录",
    pageInited: true,
    disabled: false,
    method: undefined,
    dictCode: "audit",
    recordId: undefined,
    recordKey: undefined,
    searchParams: undefined,
  },
);

let dialogVisible = $ref(false);
let historyList = $ref<AuditHistoryItem[]>([ ]);
let isLoading = $ref(false);
let dictLabel = $ref("");
let dictLoadSeq = 0;
let historyLoadSeq = 0;

function isBlankValue(
  value?: string | number | null,
) {
  return value == null || value === "";
}

const pageInited = $computed(() => props.pageInited !== false);
const hasRecordId = $computed(() => !isBlankValue(props.recordId));
const resolvedSearchParams = $computed(() => {
  const searchParams = props.searchParams == null
    ? undefined
    : unref(props.searchParams);

  if (props.recordKey && hasRecordId) {
    return {
      [props.recordKey]: [ props.recordId ],
      is_deleted: 0,
      // oxlint-disable-next-line unicorn/no-useless-fallback-in-spread
      ...(searchParams || {}),
    };
  }

  return searchParams;
});
const disabled = $computed(() => {
  if (props.disabled || !props.method) {
    return true;
  }
  if (props.recordKey && !hasRecordId && props.searchParams == null) {
    return true;
  }
  return false;
});

const displayLabel = $computed(() => {
  if (props.modelLabel) {
    return props.modelLabel;
  }
  if (dictLabel) {
    return dictLabel;
  }
  if (props.modelValue != null && props.modelValue !== "") {
    return String(props.modelValue);
  }
  return "";
});

const placeholderText = $computed(() => {
  if (disabled) {
    return props.readonlyPlaceholder || "";
  }
  return props.placeholder || "";
});

const currentStepIndex = $computed(() => {
  if (historyList.length === 0) {
    return -1;
  }
  return historyList.length - 1;
});

watch(
  () => [props.modelValue, props.modelLabel, props.dictCode],
  async ([modelValue, modelLabel, dictCode]) => {
    const currentSeq = ++dictLoadSeq;

    if (modelLabel) {
      dictLabel = "";
      return;
    }
    if (!dictCode || isBlankValue(modelValue)) {
      dictLabel = "";
      return;
    }

    try {
      const code = String(dictCode);
      const res = await getDict([code]);
      if (currentSeq !== dictLoadSeq) {
        return;
      }
      const data = (res?.[0] || []) as GetDict[];
      const match = data.find((item: GetDict) => String(item.val) === String(modelValue));
      dictLabel = match?.lbl || "";
    } catch (err) {
      if (currentSeq !== dictLoadSeq) {
        return;
      }
      dictLabel = "";
      console.error(err);
    }
  },
  {
    immediate: true,
  },
);

function isRejected(
  audit?: string | null,
) {
  return audit === "rejected";
}

function getStatusClass(
  audit?: string | null,
) {
  return isRejected(audit)
    ? "text-red-500"
    : "text-gray-700 dark:text-gray-200";
}

function getStepColor(
  audit?: string | null,
) {
  if (audit === "rejected") {
    return "red";
  }
  if (audit === "reviewed") {
    return "orange";
  }
  if (audit === "audited") {
    return "green";
  }
  if (audit === "unaudited") {
    return "blue";
  }
  return "gray";
}

async function loadHistory() {
  const currentSeq = ++historyLoadSeq;
  if (!props.method) {
    historyList = [ ];
    return;
  }
  if (props.recordKey && !hasRecordId && props.searchParams == null) {
    historyList = [ ];
    return;
  }
  isLoading = true;
  try {
    const data = await props.method(
      resolvedSearchParams,
      undefined,
      [
        {
          prop: "audit_time",
          order: "ascending",
        },
      ],
      {
        notLoading: true,
      },
    );
    if (currentSeq !== historyLoadSeq) {
      return;
    }
    historyList = Array.isArray(data)
      ? data
      : [ ];
  } catch (err) {
    if (currentSeq !== historyLoadSeq) {
      return;
    }
    historyList = [ ];
    console.error(err);
    uni.showToast({
      title: "加载审核记录失败",
      icon: "none",
    });
  } finally {
    if (currentSeq === historyLoadSeq) {
      isLoading = false;
    }
  }
}

async function onOpen() {
  if (disabled) {
    return;
  }
  dialogVisible = true;
  await loadHistory();
}

watch(
  () => resolvedSearchParams,
  () => {
    if (!dialogVisible) {
      return;
    }
    void loadHistory();
  },
  {
    deep: true,
  },
);
</script>

<style lang="scss" scoped>
.audit_history_field {
  min-height: 88rpx;
  display: flex;
  align-items: center;
}

.audit_history_field_disabled {
  opacity: 0.86;
}
</style>