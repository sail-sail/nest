/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  TsdbAppInput as TsdbAppInputType,
  TsdbAppModel as TsdbAppModelType,
  TsdbAppSearch as TsdbAppSearchType,
  TsdbAppFieldComment as TsdbAppFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 时序数据库 */
  interface TsdbAppModel extends TsdbAppModelType {
  }
  
  /** 时序数据库 */
  interface TsdbAppInput extends TsdbAppInputType {
  }
  
  /** 时序数据库 */
  interface TsdbAppSearch extends TsdbAppSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 时序数据库 */
  interface TsdbAppFieldComment extends TsdbAppFieldCommentType {
  }
  
}

export const tsdbAppFields = [
  // ID
  "id",
  // 名称
  "lbl",
  // 类型
  "type",
  "type_lbl",
  // 协议
  "protocol",
  "protocol_lbl",
  // 主机名
  "hostname",
  // 端口
  "port",
  // 数据库
  "database",
  // 令牌
  "token",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
  // 排序
  "order_by",
  // 备注
  "rem",
  // 创建人
  "create_usr_id",
  "create_usr_id_lbl",
  // 创建时间
  "create_time",
  "create_time_lbl",
  // 更新人
  "update_usr_id",
  "update_usr_id_lbl",
  // 更新时间
  "update_time",
  "update_time_lbl",
  "is_deleted",
];

export const tsdbAppQueryField = `
  ${ tsdbAppFields.join(" ") }
`;
