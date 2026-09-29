export async function getUniReleasing() {
  const {
    getUniReleasing: getUniReleasingService,
  } = await import("./optbiz.service.ts");

  return await getUniReleasingService();
}
