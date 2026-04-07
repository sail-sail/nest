export default defineNuxtRouteMiddleware(to => {
  if (import.meta.server || !document.startViewTransition) { return }

  // 禁用内置 Vue 过渡
  to.meta.pageTransition = false
  to.meta.layoutTransition = false
})
