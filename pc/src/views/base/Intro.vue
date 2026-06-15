<template>
<div
  un-flex="~ [1_0_0] col"
  un-overflow-auto
  un-w="full"
  un-h="full"
  un-bg="gray-50 dark:gray-900"
>
  <!-- Hero Section -->
  <section
    un-relative
    un-overflow-hidden
    un-bg="gradient-to-r from-blue-600 to-indigo-700"
    un-p="x-8 y-16"
    un-text="white center"
  >
    <!-- 背景装饰 -->
    <div
      un-absolute
      un-top="-20"
      un-right="-20"
      un-w="96"
      un-h="96"
      un-rounded-full
      un-bg="white/10"
    />
    <div
      un-absolute
      un-bottom="-32"
      un-left="-16"
      un-w="64"
      un-h="64"
      un-rounded-full
      un-bg="white/5"
    />
    <div
      un-absolute
      un-top="10"
      un-left="1/3"
      un-w="40"
      un-h="40"
      un-rounded-full
      un-bg="black/5 dark:white/5"
    />

    <div un-relative un-max-w="4xl" un-mx="auto">
      <div
        un-inline-block
        un-mb="4"
        un-px="3"
        un-py="1"
        un-rounded-full
        un-bg="white/20"
        un-text="xl gray-700 dark:gray-200"
        un-font-medium
        un-backdrop-blur-sm
      >
        企业级全栈开发平台
      </div>
      <h1
        un-text="4xl md:5xl"
        un-font-bold
        un-mb="4"
        un-leading-tight
      >
        一套架构，覆盖全生命周期
      </h1>
      <p
        un-text="xl blue-100"
        un-max-w="2xl"
        un-mx="auto"
        un-mb="8"
        un-leading-relaxed
      >
        从数据库设计到上线部署，智能代码生成 + 低代码引擎 + 企业级安全体系
        <br>
        让团队专注于业务，而非重复造轮子
      </p>
      <div
        un-flex="~ wrap"
        un-justify-center
        un-gap="3"
      >
        <div
          v-for="tag in heroTags"
          :key="tag"
          un-px="4"
          un-py="2"
          un-rounded-lg
          un-bg="white/15"
          un-backdrop-blur-sm
          un-text="sm"
          un-font-medium
        >
          {{ tag }}
        </div>
      </div>
    </div>
  </section>

  <!-- 核心数据指标 -->
  <section
    un-p="x-8 y-12"
    un-bg="white dark:gray-800"
    un-border="b gray-200 dark:gray-700"
  >
    <div
      un-max-w="5xl"
      un-mx="auto"
      un-grid="~ cols-2 md:cols-4"
      un-gap="8"
    >
      <div
        v-for="stat in stats"
        :key="stat.label"
        un-text-center
      >
        <div
          un-text="3xl blue-600 dark:blue-400"
          un-font-bold
        >
          {{ stat.value }}
        </div>
        <div
          un-text="sm gray-500 dark:gray-400"
          un-mt="1"
        >
          {{ stat.label }}
        </div>
      </div>
    </div>
  </section>

  <!-- 核心优势 -->
  <section
    un-p="x-8 y-16"
    un-max-w="6xl"
    un-mx="auto"
    un-w="full"
  >
    <div un-text-center un-mb="12">
      <h2
        un-text="3xl gray-800 dark:gray-100"
        un-font-bold
        un-mb="3"
      >
        为什么选择这套架构？
      </h2>
      <p un-text="lg gray-500 dark:gray-400">
        六大核心优势，让开发更快、更安全、更省心
      </p>
    </div>

    <div
      un-grid="~ cols-1 md:cols-2 lg:cols-3"
      un-gap="6"
    >
      <div
        v-for="feature in features"
        :key="feature.title"
        un-bg="white dark:gray-800"
        un-rounded-xl
        un-p="6"
        un-shadow="sm hover:lg"
        un-border="gray-100 dark:gray-700"
        un-transition-all
        un-duration-300
        un-cursor-default
      >
        <div
          un-w="12"
          un-h="12"
          un-rounded-lg
          un-flex="~ items-center justify-center"
          un-text="2xl"
          un-mb="4"
          :un-bg="isDark ? feature.bgColorDark : feature.bgColor"
        >
          {{ feature.icon }}
        </div>
        <h3
          un-text="xl gray-800 dark:gray-100"
          un-font-semibold
          un-mb="2"
        >
          {{ feature.title }}
        </h3>
        <p
          un-text="gray-500 dark:gray-400"
          un-leading-relaxed
          un-mb="4"
        >
          {{ feature.desc }}
        </p>
        <ul un-space-y-2>
          <li
            v-for="point in feature.points"
            :key="point"
            un-flex="~ items-start"
            un-gap="2"
            un-text="sm gray-600 dark:gray-300"
          >
            <span
              un-text="green-500"
              un-mt="0.5"
              un-font-bold
              un-shrink-0
            >✓</span>
            <span>{{ point }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- 开发效率对比 -->
  <section
    un-p="x-8 y-16"
    un-bg="white dark:gray-800"
  >
    <div
      un-max-w="5xl"
      un-mx="auto"
    >
      <div un-text-center un-mb="12">
        <h2
          un-text="3xl gray-800 dark:gray-100"
          un-font-bold
          un-mb="3"
        >
          开发效率对比
        </h2>
        <p un-text="lg gray-500 dark:gray-400">
          传统开发 vs 本架构，同样的业务需求
        </p>
      </div>

      <div
        un-grid="~ cols-1 md:cols-2"
        un-gap="8"
      >
        <!-- 传统方式 -->
        <div
          un-rounded-xl
          un-p="6"
          un-border="2 red-200 dark:red-900"
          un-bg="red-50/50 dark:red-950/30"
        >
          <div
            un-flex="~ items-center"
            un-gap="3"
            un-mb="6"
          >
            <div
              un-w="10"
              un-h="10"
              un-rounded-full
              un-bg="red-100 dark:red-900"
              un-flex="~ items-center justify-center"
              un-text="xl"
            >
              😰
            </div>
            <div>
              <h3
                un-text="lg gray-800 dark:gray-100"
                un-font-semibold
              >
                传统开发方式
              </h3>
              <p un-text="sm red-500 dark:red-400">
                大量重复劳动，容易出错
              </p>
            </div>
          </div>
          <ul un-space-y-4>
            <li
              v-for="item in traditional"
              :key="item.task"
              un-flex="~ items-center justify-between"
              un-text="sm"
            >
              <span un-text="gray-700 dark:gray-300">{{ item.task }}</span>
              <span
                un-font-semibold
                un-text="red-600 dark:red-400"
              >{{ item.time }}</span>
            </li>
          </ul>
          <div
            un-mt="6"
            un-pt="4"
            un-border="t red-200 dark:red-900"
            un-flex="~ items-center justify-between"
            un-font-semibold
          >
            <span un-text="gray-700 dark:gray-300">单个模块合计</span>
            <span un-text="red-600 dark:red-400">5~8 人天</span>
          </div>
        </div>

        <!-- 本架构 -->
        <div
          un-rounded-xl
          un-p="6"
          un-border="2 green-200 dark:green-900"
          un-bg="green-50/50 dark:green-950/30"
        >
          <div
            un-flex="~ items-center"
            un-gap="3"
            un-mb="6"
          >
            <div
              un-w="10"
              un-h="10"
              un-rounded-full
              un-bg="green-100 dark:green-900"
              un-flex="~ items-center justify-center"
              un-text="xl"
            >
              🚀
            </div>
            <div>
              <h3
                un-text="lg gray-800 dark:gray-100"
                un-font-semibold
              >
                本架构开发
              </h3>
              <p un-text="sm green-600 dark:green-400">
                智能生成 + 专注业务逻辑
              </p>
            </div>
          </div>
          <ul un-space-y-4>
            <li
              v-for="item in modern"
              :key="item.task"
              un-flex="~ items-center justify-between"
              un-text="sm"
            >
              <span un-text="gray-700 dark:gray-300">{{ item.task }}</span>
              <span
                un-font-semibold
                un-text="green-600 dark:green-400"
              >{{ item.time }}</span>
            </li>
          </ul>
          <div
            un-mt="6"
            un-pt="4"
            un-border="t green-200 dark:green-900"
            un-flex="~ items-center justify-between"
            un-font-semibold
          >
            <span un-text="gray-700 dark:gray-300">单个模块合计</span>
            <span un-text="green-600 dark:green-400">0.5~1 人天</span>
          </div>
        </div>
      </div>

      <div
        un-mt="8"
        un-text-center
      >
        <div
          un-inline-flex
          un-items-center
          un-gap="2"
          un-px="6"
          un-py="3"
          un-rounded-full
          un-bg="gradient-to-r from-green-500 to-emerald-600"
          un-text="white lg"
          un-font-bold
          un-shadow="md"
        >
          <span>⚡</span>
          <span>效率提升 5~10 倍，且质量更高、更不容易出错</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 数据安全 -->
  <section
    un-p="x-8 y-16"
    un-bg="gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800"
  >
    <div
      un-max-w="5xl"
      un-mx="auto"
    >
      <div un-text-center un-mb="12">
        <h2
          un-text="3xl gray-800 dark:gray-100"
          un-font-bold
          un-mb="3"
        >
          🛡️ 数据安全，滴水不漏
        </h2>
        <p un-text="lg gray-500 dark:gray-400">
          从删除保护到操作审计，全方位守护每一条数据
        </p>
      </div>

      <div
        un-grid="~ cols-1 md:cols-3"
        un-gap="6"
      >
        <!-- 软删除/回收站 -->
        <div
          un-bg="white dark:gray-800"
          un-rounded-xl
          un-p="6"
          un-shadow-sm
          un-border="gray-100 dark:gray-700"
        >
          <div
            un-text="3xl"
            un-mb="3"
          >
            🗑️
          </div>
          <h3
            un-text="lg gray-800 dark:gray-100"
            un-font-semibold
            un-mb="2"
          >
            回收站机制
          </h3>
          <p
            un-text="sm gray-500 dark:gray-400"
            un-leading-relaxed
          >
            所有删除操作均为<strong un-text="gray-700 dark:gray-200">软删除</strong>，数据不会真正丢失。误删后可随时恢复，彻底杜绝数据丢失风险。
          </p>
          <div
            un-mt="4"
            un-p="3"
            un-rounded-lg
            un-bg="blue-50 dark:blue-950/40"
            un-text="xs blue-700 dark:blue-300"
          >
            💡 就像电脑的回收站，删了还能找回来
          </div>
        </div>

        <!-- 操作审计 -->
        <div
          un-bg="white dark:gray-800"
          un-rounded-xl
          un-p="6"
          un-shadow-sm
          un-border="gray-100 dark:gray-700"
        >
          <div
            un-text="3xl"
            un-mb="3"
          >
            📋
          </div>
          <h3
            un-text="lg gray-800 dark:gray-100"
            un-font-semibold
            un-mb="2"
          >
            操作审计追踪
          </h3>
          <p
            un-text="sm gray-500 dark:gray-400"
            un-leading-relaxed
          >
            每一次数据变更都被完整记录：<strong un-text="gray-700 dark:gray-200">谁</strong>在<strong un-text="gray-700 dark:gray-200">什么时间</strong>把<strong un-text="gray-700 dark:gray-200">什么数据</strong>从 A 改成了 B。
          </p>
          <div
            un-mt="4"
            un-p="3"
            un-rounded-lg
            un-bg="amber-50 dark:amber-950/40"
            un-text="xs amber-700 dark:amber-300"
          >
            💡 出了问题可以精确追溯，谁改的、改了什么
          </div>
        </div>

        <!-- 权限控制 -->
        <div
          un-bg="white dark:gray-800"
          un-rounded-xl
          un-p="6"
          un-shadow-sm
          un-border="gray-100 dark:gray-700"
        >
          <div
            un-text="3xl"
            un-mb="3"
          >
            🔐
          </div>
          <h3
            un-text="lg gray-800 dark:gray-100"
            un-font-semibold
            un-mb="2"
          >
            四层权限防护
          </h3>
          <p
            un-text="sm gray-500 dark:gray-400"
            un-leading-relaxed
          >
            菜单权限 → 按钮权限 → 数据行权限 → 字段权限，<strong un-text="gray-700 dark:gray-200">精确控制每个人能看到和操作的内容</strong>。
          </p>
          <div
            un-mt="4"
            un-p="3"
            un-rounded-lg
            un-bg="green-50 dark:green-950/40"
            un-text="xs green-700 dark:green-300"
          >
            💡 销售只看自己的客户，经理看部门的，老板看全部
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 技术架构全景 -->
  <section
    un-p="x-8 y-16"
    un-bg="white dark:gray-800"
  >
    <div
      un-max-w="5xl"
      un-mx="auto"
    >
      <div un-text-center un-mb="12">
        <h2
          un-text="3xl gray-800 dark:gray-100"
          un-font-bold
          un-mb="3"
        >
          🏗️ 架构全景
        </h2>
        <p un-text="lg gray-500 dark:gray-400">
          一套后端，多端覆盖；一次开发，处处可用
        </p>
      </div>

      <!-- 架构图 -->
      <div
        un-flex="~ col"
        un-gap="4"
        un-items-center
      >
        <!-- 前端层 -->
        <div
          un-w="full"
          un-grid="~ cols-1 md:cols-3"
          un-gap="4"
        >
          <div
            un-bg="blue-50 dark:blue-950/40"
            un-border="2 blue-200 dark:blue-800"
            un-rounded-xl
            un-p="5"
            un-text-center
          >
            <div un-text="2xl mb-2">🖥️</div>
            <div
              un-text="md blue-800 dark:blue-300"
              un-font-semibold
            >
              PC 管理端
            </div>
            <div
              un-text="xs blue-500 dark:blue-400"
              un-mt="1"
            >
              Vue 3 + Element Plus
            </div>
          </div>
          <div
            un-bg="green-50 dark:green-950/40"
            un-border="2 green-200 dark:green-800"
            un-rounded-xl
            un-p="5"
            un-text-center
          >
            <div un-text="2xl mb-2">📱</div>
            <div
              un-text="md green-800 dark:green-300"
              un-font-semibold
            >
              移动端 / 小程序
            </div>
            <div
              un-text="xs green-500 dark:green-400"
              un-mt="1"
            >
              Uni-app · 微信/支付宝/App
            </div>
          </div>
          <div
            un-bg="purple-50 dark:purple-950/40"
            un-border="2 purple-200 dark:purple-800"
            un-rounded-xl
            un-p="5"
            un-text-center
          >
            <div un-text="2xl mb-2">🔌</div>
            <div
              un-text="md purple-800 dark:purple-300"
              un-font-semibold
            >
              开放 API
            </div>
            <div
              un-text="xs purple-500 dark:purple-400"
              un-mt="1"
            >
              GraphQL · 第三方对接
            </div>
          </div>
        </div>

        <!-- 箭头 -->
        <div
          un-text="2xl gray-400 dark:gray-500"
          un-py="2"
        >
          ⬇️ GraphQL API ⬇️
        </div>

        <!-- 后端层 -->
        <div
          un-w="full"
          un-bg="gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40"
          un-border="2 indigo-200 dark:indigo-800"
          un-rounded-xl
          un-p="6"
        >
          <div
            un-text="center md indigo-800 dark:indigo-300"
            un-font-bold
            un-mb="4"
          >
            ⚙️ 后端服务层
          </div>
          <div
            un-grid="~ cols-2 md:cols-4"
            un-gap="3"
          >
            <div
              v-for="mod in backendModules"
              :key="mod.name"
              un-bg="white/80 dark:gray-700/60"
              un-rounded-lg
              un-p="3"
              un-text-center
            >
              <div un-text-lg>{{ mod.icon }}</div>
              <div
                un-text="xs gray-700 dark:gray-200"
                un-font-medium
                un-mt="1"
              >
                {{ mod.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- 箭头 -->
        <div
          un-text="2xl gray-400 dark:gray-500"
          un-py="2"
        >
          ⬇️ 数据持久化 ⬇️
        </div>

        <!-- 数据层 -->
        <div
          un-w="full"
          un-grid="~ cols-1 md:cols-3"
          un-gap="4"
        >
          <div
            un-bg="orange-50 dark:orange-950/40"
            un-border="2 orange-200 dark:orange-800"
            un-rounded-xl
            un-p="5"
            un-text-center
          >
            <div un-text="2xl mb-2">🗄️</div>
            <div
              un-text="md orange-800 dark:orange-300"
              un-font-semibold
            >
              MySQL 数据库
            </div>
          </div>
          <div
            un-bg="cyan-50 dark:cyan-950/40"
            un-border="2 cyan-200 dark:cyan-800"
            un-rounded-xl
            un-p="5"
            un-text-center
          >
            <div un-text="2xl mb-2">📦</div>
            <div
              un-text="md cyan-800 dark:cyan-300"
              un-font-semibold
            >
              S3 对象存储
            </div>
          </div>
          <div
            un-bg="rose-50 dark:rose-950/40"
            un-border="2 rose-200 dark:rose-800"
            un-rounded-xl
            un-p="5"
            un-text-center
          >
            <div un-text="2xl mb-2">⚡</div>
            <div
              un-text="md rose-800 dark:rose-300"
              un-font-semibold
            >
              WebSocket 实时推送
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 功能清单 -->
  <section
    un-p="x-8 y-16"
    un-bg="gray-50 dark:gray-900"
  >
    <div
      un-max-w="5xl"
      un-mx="auto"
    >
      <div un-text-center un-mb="12">
        <h2
          un-text="3xl gray-800 dark:gray-100"
          un-font-bold
          un-mb="3"
        >
          📦 开箱即用的功能清单
        </h2>
        <p un-text="lg gray-500 dark:gray-400">
          不需要从零开发，这些能力已经内置在架构中
        </p>
      </div>

      <div
        un-grid="~ cols-1 md:cols-2 lg:cols-3"
        un-gap="4"
      >
        <div
          v-for="item in builtinFeatures"
          :key="item.name"
          un-flex="~ items-start"
          un-gap="3"
          un-bg="white dark:gray-800"
          un-rounded-lg
          un-p="4"
          un-border="gray-100 dark:gray-700"
        >
          <span un-text-xl>{{ item.icon }}</span>
          <div>
            <div
              un-text="sm gray-800 dark:gray-100"
              un-font-semibold
            >
              {{ item.name }}
            </div>
            <div
              un-text="xs gray-500 dark:gray-400"
              un-mt="0.5"
            >
              {{ item.desc }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 总结 CTA -->
  <section
    un-p="x-8 y-16"
    un-bg="gradient-to-r from-blue-600 to-indigo-700"
    un-text="white center"
  >
    <div
      un-max-w="3xl"
      un-mx="auto"
    >
      <h2
        un-text="3xl"
        un-font-bold
        un-mb="4"
      >
        总结：为什么值得投入？
      </h2>
      <div
        un-grid="~ cols-1 md:cols-2"
        un-gap="4"
        un-mb="8"
        un-text-left
      >
        <div
          v-for="reason in reasons"
          :key="reason.title"
          un-flex="~ items-start"
          un-gap="3"
          un-bg="white/10"
          un-rounded-lg
          un-p="4"
          un-backdrop-blur-sm
        >
          <span
            un-text-xl
            un-shrink-0
          >{{ reason.icon }}</span>
          <div>
            <div
              un-font-semibold
              un-mb="1"
            >
              {{ reason.title }}
            </div>
            <div
              un-text="sm blue-100"
            >
              {{ reason.desc }}
            </div>
          </div>
        </div>
      </div>
      <p
        un-text="xl blue-100"
        un-leading-relaxed
      >
        这不只是一个项目模板，而是一套经过实战验证的企业级开发体系。<br>
        <strong un-text-white>投入一次，受益所有项目。</strong>
      </p>
    </div>
  </section>

  <!-- Footer -->
  <footer
    un-p="x-8 y-6"
    un-bg="gray-900"
    un-text="center sm gray-400"
  >
    全栈开发平台 · 智能代码生成 · 企业级安全 · 多端覆盖
  </footer>
</div>
</template>

<script setup lang="ts">

const isDark = useDark();

const heroTags = [
  "🧠 智能代码生成",
  "🛡️ 数据安全保障",
  "📱 多端覆盖",
  "🔐 四层权限体系",
  "📋 操作审计追踪",
  "🌍 国际化支持",
];

const stats = [
  { value: "5~10x", label: "开发效率提升" },
  { value: "4 层", label: "权限防护深度" },
  { value: "3 端", label: "PC + 小程序 + App" },
  { value: "100%", label: "操作可审计追溯" },
];

const features = [
  {
    icon: "⚡",
    title: "智能代码生成",
    desc: "写好数据库表结构，一键生成前后端完整代码，包括接口、页面、权限配置。",
    bgColor: "yellow-100",
    bgColorDark: "yellow-900/40",
    points: [
      "SQL → 全栈代码，分钟级交付",
      "生成的代码规范统一，零技术债",
      "新模块上线周期从天缩短到小时",
    ],
  },
  {
    icon: "🗑️",
    title: "回收站 & 数据安全",
    desc: "所有删除都是软删除，数据永远不丢。配合操作审计，每一次变更都有迹可循。",
    bgColor: "blue-100",
    bgColorDark: "blue-900/40",
    points: [
      "误删数据可随时恢复",
      "操作前后数据完整记录",
      "精确追溯：谁、何时、改了什么",
    ],
  },
  {
    icon: "🔐",
    title: "四层权限体系",
    desc: "菜单 → 按钮 → 数据行 → 字段，从粗到细精确控制每个人的访问范围。",
    bgColor: "red-100",
    bgColorDark: "red-900/40",
    points: [
      "菜单权限：控制能看到哪些页面",
      "按钮权限：控制能执行哪些操作",
      "数据权限：销售只看自己的客户",
      "字段权限：敏感信息按角色隐藏",
    ],
  },
  {
    icon: "🏢",
    title: "多租户 SaaS",
    desc: "内置多租户架构，一套系统服务多个客户/子公司，数据完全隔离。",
    bgColor: "green-100",
    bgColorDark: "green-900/40",
    points: [
      "租户间数据自动隔离",
      "每个租户独立配置菜单和字典",
      "支持域名绑定，独立品牌展示",
    ],
  },
  {
    icon: "🧩",
    title: "低代码动态页面",
    desc: "通过可视化配置创建表单和列表页面，无需写代码即可满足简单业务需求。",
    bgColor: "purple-100",
    bgColorDark: "purple-900/40",
    points: [
      "拖拽配置字段和布局",
      "支持计算公式和校验规则",
      "PC 和移动端同步生效",
    ],
  },
  {
    icon: "📱",
    title: "一套后端，三端覆盖",
    desc: "PC 管理端、微信小程序、移动 App 共享同一套后端接口，无需重复开发。",
    bgColor: "cyan-100",
    bgColorDark: "cyan-900/40",
    points: [
      "GraphQL 统一接口层",
      "PC 端：Vue 3 + Element Plus",
      "移动端：Uni-app 跨平台",
    ],
  },
];

const traditional = [
  { task: "数据库设计 + 建表", time: "0.5 天" },
  { task: "后端接口开发 (CRUD)", time: "1~2 天" },
  { task: "前端列表/表单页面", time: "1~2 天" },
  { task: "权限配置与联调", time: "0.5~1 天" },
  { task: "搜索/排序/分页", time: "0.5~1 天" },
  { task: "测试与 Bug 修复", time: "1~2 天" },
];

const modern = [
  { task: "数据库设计 + 建表", time: "0.5 天" },
  { task: "后端接口 (自动生成)", time: "≈ 0" },
  { task: "前端页面 (自动生成)", time: "≈ 0" },
  { task: "权限配置 (自动生成)", time: "≈ 0" },
  { task: "搜索/排序/分页 (内置)", time: "≈ 0" },
  { task: "业务逻辑定制", time: "0.5 天" },
];

const backendModules = [
  { icon: "🔑", name: "JWT 认证" },
  { icon: "🔐", name: "权限引擎" },
  { icon: "📊", name: "数据权限" },
  { icon: "📋", name: "操作审计" },
  { icon: "🗑️", name: "软删除" },
  { icon: "📡", name: "WebSocket" },
  { icon: "🌍", name: "国际化" },
  { icon: "📦", name: "对象存储" },
  { icon: "🖼️", name: "图片处理" },
  { icon: "🧩", name: "动态页面" },
  { icon: "📖", name: "字典管理" },
  { icon: "🏢", name: "多租户" },
];

const builtinFeatures = [
  { icon: "👤", name: "用户管理", desc: "多租户用户体系，支持组织架构" },
  { icon: "🏗️", name: "组织架构", desc: "公司 → 部门 → 岗位树形管理" },
  { icon: "🎭", name: "角色权限", desc: "灵活的角色-权限分配体系" },
  { icon: "📋", name: "菜单管理", desc: "可视化菜单配置，按角色分配" },
  { icon: "📖", name: "系统字典", desc: "统一管理下拉选项和枚举值" },
  { icon: "🌍", name: "多语言", desc: "系统界面多语言切换" },
  { icon: "📝", name: "操作日志", desc: "自动记录所有数据变更" },
  { icon: "🔑", name: "登录日志", desc: "记录登录IP、设备、成功状态" },
  { icon: "📊", name: "服务器日志", desc: "接口性能监控与异常追踪" },
  { icon: "🧩", name: "动态页面", desc: "零代码配置表单和列表" },
  { icon: "📁", name: "文件管理", desc: "S3 云存储 + 图片处理" },
  { icon: "🔔", name: "实时通知", desc: "WebSocket 消息推送" },
];

const reasons = [
  {
    icon: "💰",
    title: "降低人力成本",
    desc: "同样的项目，更少的人、更短的时间完成",
  },
  {
    icon: "🛡️",
    title: "降低风险",
    desc: "数据不丢、操作可追溯、权限可控",
  },
  {
    icon: "📈",
    title: "快速响应业务",
    desc: "新需求从周级缩短到小时级交付",
  },
  {
    icon: "🔄",
    title: "持续复用",
    desc: "一套架构支撑所有项目，越用越值",
  },
];
</script>
