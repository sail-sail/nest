export async function getMenus(
  type: string,
) {
  const { getMenus } = await import("./menu.service.ts");
  return await getMenus(type);
}
