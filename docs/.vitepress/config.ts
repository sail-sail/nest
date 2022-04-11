import { defineConfigWithTheme } from "vitepress";

export default defineConfigWithTheme({
  title: "文档",
  description: "文档描述",
  lang: "zh-CN",
  outDir: '../build/docs',
  base: "/docs/",
  themeConfig: {
    sidebar: [
      {
        text: '数据库',
        link: '/database'
      },
      {
        text: '登录逻辑',
        link: '/login'
      },
      {
        text: '自动生成代码',
        children: [
          {
            text: '1. 创建数据库',
            link: '/frame/1.html',
          },
          {
            text: '2. 执行生成命令',
            link: '/frame/2.html',
          },
          {
            text: '3. 生成增删改查',
            link: '/frame/3.html',
          },
          {
            text: '4. 后端redis缓存机制',
            link: '/frame/4.html',
          },
          {
            text: '5. 后台任务列表',
            link: '/frame/background_task.html',
          },
        ],
      },
      {
        text: '前端 Vue',
        children: [
          {
            text: 'Vue 的优点',
            link: '/vue/1.html',
          },
          {
            text: 'Vue2 跟 Vue3 的区别',
            link: '/vue/2.html',
          },
          {
            text: 'Vue2 的 OptionAPI 的缺陷',
            link: '/vue/3.html',
          },
          {
            text: 'Vue3 的 组合式API',
            link: '/vue/4.html',
          },
          {
            text: 'Vue3 的 组合式API 示例',
            link: '/vue/5.html',
          },
        ]
      },
    ],
  },
});