export async function getServerLogDates() {
  const {
    getServerLogDates,
  } = await import("./server_log.service.ts");
  return await getServerLogDates();
}

export async function downloadServerLog(
  log_date: string,
) {
  const {
    downloadServerLog,
  } = await import("./server_log.service.ts");
  return await downloadServerLog(log_date);
}