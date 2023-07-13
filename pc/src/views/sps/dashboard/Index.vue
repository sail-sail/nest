<!--
 * Dashboard for sps
 * @author: jinweibin
 * @since: 2023-07-09
 * Index.vue
-->
<template>
  <div class="dashboard__container">
    <el-row :gutter="15">
      <el-col>
        <el-form 
          inline-message
          label-width="auto"
          un-grid="~ cols-[repeat(auto-fit,400px)]"
          un-gap="x-2 y-2"
          un-justify-items-end
          un-items-center
        >
          <el-form-item>
            <el-radio-group size="default" v-model="shortcutData" @change="onShortcutChange">
              <el-radio-button 
              v-for="(item, index) in shortcutDict" 
              :key="index"
              :label="item.value"
              > {{ item.lbl }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              size="default"
              v-model="dateRange"
              type="datetimerange"
              range-separator="至"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="onDateRangeChange"
              :default-value="[new Date(), new Date()]"
            />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row 
    class="dashboard__card-one" 
    :gutter="15">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6"
      v-for="(v, k) in numbers"
      :key="k"
      :class="{ 'dashboard__media dashboard__media--lg': k > 1, 'dashboard__media--sm': k == 1}"
      >
        <div 
        class="dashboard__card-item" 
        un-flex>
          <div
            un-ma
            un-flex
            un-w-screen
            :class="`dashboard_card-one-animation${k}`"
          >
            <div
              un-overflow-hidden
              un-flex-1>
              <span
                un-text="30px">
              {{ v.num1 || 0 }}
              </span>
              <div 
                un-mt="10px"
                un-w="130px">
              {{ v.num3 || 0 }}
              </div>
            </div>
            <div 
              un-flex
              :style="{background: `var(${v.color2})`}"
              class="dashboard__icon">
              <el-icon
                :style="{color:`var(${v.color3})`, margin: 'auto!important'}"
                :size="32">
                <component :is="v.num4"></component>
              </el-icon>
            </div>
          </div>
        </div>
    
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">

let shortcutDict = $ref([
  { "lbl": "今天", "value": "today" },
  { "lbl": "昨天", "value": "yesterday" },
  { "lbl": "最近一周", "value": "1week" },
  { "lbl": "最近一月", "value": "1month" },
]);

let shortcutData = $ref('today');
let dateRange = $ref([]);
let numbers = $ref([
  {
    num1: '125,12',
    num2: '-12.32',
    num3: '告警总数',
    num4: 'House',
    color1: '#FF6462',
    color2: '--next-color-primary-lighter',
    color3: '--el-color-primary',
  },
  {
    num1: '653,33',
    num2: '+42.32',
    num3: '故障总数',
    num4: 'InfoFilled',
    color1: '#6690F9',
    color2: '--next-color-success-lighter',
    color3: '--el-color-success',
  },
  {
    num1: '125,65',
    num2: '+17.32',
    num3: '已处理故障数',
    num4: 'StarFilled',
    color1: '#6690F9',
    color2: '--next-color-warning-lighter',
    color3: '--el-color-warning',
  },
  {
    num1: '520,43',
    num2: '-10.01',
    num3: '未处理故障数',
    num4: 'Film',
    color1: '#FF6462',
    color2: '--next-color-danger-lighter',
    color3: '--el-color-danger',
  },
  {
    num1: '520,43',
    num2: '-10.01',
    num3: '已分派故障数',
    num4: 'Picture',
    color1: '#FF6462',
    color2: '--next-color-danger-lighter',
    color3: '--el-color-danger',
  },
  {
    num1: '125,65',
    num2: '+17.32',
    num3: '短信用量',
    num4: 'Box',
    color1: '#6690F9',
    color2: '--next-color-warning-lighter',
    color3: '--el-color-warning',
  },
  {
    num1: '125,12',
    num2: '-12.32',
    num3: '知识总量',
    num4: 'Notebook',
    color1: '#FF6462',
    color2: '--next-color-primary-lighter',
    color3: '--el-color-primary',
  },
  {
    num1: '653,33',
    num2: '+42.32',
    num3: '故障集总数',
    num4: 'MostlyCloudy',
    color1: '#6690F9',
    color2: '--next-color-success-lighter',
    color3: '--el-color-success',
  },]);

function onShortcutChange(value: string) {
  // todo: reload the data

}

function onDateRangeChange() {
  // todo reload the data
}



</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none !important;
}
.dashboard {
  &__container {
    overflow: hidden;
    padding: 30px;
    background: #f8f8f8;
  }
  &__card-one,
  &__card-two {
    padding-top: 30px;
    .dashboard__card-item {
      width: 100%;
      height:130px;
      border-radius: 4px;
      transition: all ease 0.3s;
      padding: 20px;
      overflow: hidden;
      background: var(--el-color-white);
      color: var(--el-text-color-primary);
      border: 1px solid var(--next-border-color-light);
      &:hover {
        box-shadow: 0 2px 12px var(--next-border-color-light);
        transition: all ease 0.3s;
      }
    .dashboard__icon {
      width: 70px;
      height: 70px;
      border-radius: 100%;
      flex-shrink: 1;
      i {
        color: var(--el-text-color-placeholder);
      }
    }
    }
  }
  &__card-one {
    @for $i from 0 through 3 {
      .dashboard__animation#{$i} {
        opacity: 0;
        animation-name: error-num;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        animation-delay: calc($i/10) + s;
      }
    }
  }
}
</style>
