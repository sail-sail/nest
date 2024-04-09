
/** 获取当前角色的首页轮播图路由 */
export async function getHomeUrls() {
  const {
    getHomeUrls,
  } = await import("./role.service.ts");
  
  const data = await getHomeUrls();
  
  return data;
}
