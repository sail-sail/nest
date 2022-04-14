import { Readable } from "stream";

export interface FileModel {
  data: Readable|Buffer|string;
  size?: number;
  filename: string;
  mimetype: string;
  encoding?: string;
  limit?: boolean;
  /** @description 是否不允许多次下载 */
  notDownloadMulti?: boolean;
}
