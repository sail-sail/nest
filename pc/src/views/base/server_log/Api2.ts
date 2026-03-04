import {
  saveAs
} from "file-saver";

/**
 * 下载指定日期的原始日志文件
 */
export async function downloadServerLog(
  log_date: string,
  opt?: GqlOpt,
): Promise<void> {
  
  const data: {
    downloadServerLog: string;
  } = await query({
    query: /* GraphQL */ `
      query($log_date: String!) {
        downloadServerLog(log_date: $log_date)
      }
    `,
    variables: {
      log_date,
    },
  }, opt);
  
  const content = data.downloadServerLog;
  const blob = new Blob(
    [ content ],
    { type: "text/plain;charset=utf-8" },
  );
  saveAs(blob, `server_log_${ log_date }.log`);
}
