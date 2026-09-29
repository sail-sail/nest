
export async function getUsrPermits(route_path?: string) {
  const {
    getUsrPermits: getUsrPermitsService,
  } = await import("./permit.service.ts");
  
  const data = await getUsrPermitsService(route_path);
  
  return data;
}
