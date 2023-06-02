
export async function getUsrPermits() {
  const {
    getUsrPermits,
  } = await import("./permit.service.ts");
  const data = await getUsrPermits();
  return data;
}
