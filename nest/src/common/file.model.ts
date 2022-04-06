import { Readable } from "stream";

export interface FileModel {
  data: Readable|Buffer|string;
  size?: number;
  filename: string;
  mimetype: string;
  encoding?: string;
  limit?: boolean;
}
