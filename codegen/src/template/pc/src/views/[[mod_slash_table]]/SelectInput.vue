<#
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  Table_Up = Table_Up.substring(0, Table_Up.length - 1) + Table_Up.substring(Table_Up.length - 1).toUpperCase();
  modelName = Table_Up + "model";
  fieldCommentName = Table_Up + "fieldComment";
  inputName = Table_Up + "input";
  searchName = Table_Up + "search";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
}
#><template>
<div
  class="flex items-stretch w-full box-border"
  :class="{
    'p-l-1': dialog_visible,
  }"
>
  <el-input
    v-bind="$attrs"
    @click="inputClk"
    v-model="inputValue"
    @clear="clearClk"
    readonly
    clearable
    class="cursor-pointer box-border flex-[1_0_0]"
    un-cursor-pointer
    :placeholder="props.placeholder"
    @mouseenter="inputEnter"
    @mouseleave="inputLeave"
  >
    <template
      v-for="(item, key, index) in $slots"
      :key="index"
      #[key]
    >
      <slot
        :name="key"
      ></slot>
    </template>
    <template
      #suffix
      v-if="!$slots.suffix"
    >
      <el-icon
        class="mx-1 hover:text-red-500"
        @click="clearClk"
      >
        <ElIconCircleClose
          v-if="isHover"
        />
        <ElIconSearch
          v-else
        />
      </el-icon>
    </template>
  </el-input>
  <SelectList
    ref="selectListRef"
    @change="selectListChg"
  ></SelectList>
</div>
</template>

<script lang="ts" setup>
import SelectList from "./SelectList.vue";

import {
  findAll,
} from "./Api";

import {
  type <#=modelName#>,
} from "#/types";

let emit = defineEmits<{
  (e: "update:modelValue", value?: string | string[] | null): void,
  (e: "change", value?: <#=modelName#> | (<#=modelName#> | undefined)[] | null): void,
}>();

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[] | null;
    multiple?: boolean;
    placeholder?: string;
  }>(),
  {
    modelValue: undefined,
    multiple: false,
    placeholder: "请选择 菜单",
  },
);

let inputValue = $ref("");

let modelValue = $ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    modelValue = props.modelValue;
  },
  {
    immediate: true,
  }
);

watch(
  () => modelValue,
  async () => {
    await refreshInputValue();
  },
  {
    immediate: true,
  },
);

let isHover = $ref(false);

function inputEnter() {
  isHover = true;
}

function inputLeave() {
  isHover = false;
}

function getModelValueArr() {
  let modelValueArr: string[] = [ ];
  if (modelValue) {
    if (Array.isArray(modelValue)) {
      modelValueArr = modelValue;
    } else {
      modelValueArr = modelValue.split(",");
    }
  }
  return modelValueArr;
}

async function getModelsByIds(ids: string[]) {
  const res = await findAll(
    {
      ids,
    },
  );
  return res;
}

// 根据modelValue刷新输入框的值
async function refreshInputValue() {
  const modelValueArr = getModelValueArr();
  if (modelValueArr.length === 0) {
    inputValue = "";
    return;
  }
  const models = await getModelsByIds(modelValueArr);
  inputValue = models.map((item) => item?.lbl || "").join(", ");
}

function clearClk() {
  modelValue = "";
  inputValue = "";
  emit("update:modelValue", modelValue);
}

let dialog_visible = $ref(false);

let selectListRef = $ref<InstanceType<typeof SelectList>>();

async function inputClk() {
  if (!selectListRef) {
    return;
  }
  dialog_visible = true;
  const modelValueArr = getModelValueArr();
  const {
    type,
    selectedIds,
  } = await selectListRef.showDialog({
    title: "选择 菜单",
    action: "select",
    multiple: props.multiple,
    model: {
      ids: modelValueArr,
    },
  });
  dialog_visible = false;
  if (type === "cancel") {
    return;
  }
  if (props.multiple) {
    modelValue = selectedIds;
  } else {
    modelValue = selectedIds[0] || "";
  }
  emit("update:modelValue", modelValue);
}

function selectListChg(value?: <#=modelName#> | (<#=modelName#> | undefined)[] | null) {
  if (props.multiple) {
    emit("change", value);
    return;
  }
  if (!Array.isArray(value)) {
    emit("change", value);
    return;
  }
  emit("change", value[0]);
}
</script>
