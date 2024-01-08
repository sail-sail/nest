export async function getMenus() {
  const {
    getMenus,
  } = await import("./menu.service.ts");
  
  return await getMenus();
}
