/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  BackgroundTaskInput as BackgroundTaskInputType,
  BackgroundTaskModel as BackgroundTaskModelType,
  BackgroundTaskSearch as BackgroundTaskSearchType,
  BackgroundTaskFieldComment as BackgroundTaskFieldCommentType,
} from "#/types";

declare global {
  
  /** 后台任务 */
  interface BackgroundTaskModel extends BackgroundTaskModelType {
  }
  
  /** 后台任务 */
  interface BackgroundTaskInput extends BackgroundTaskInputType {
  }
  
  /** 后台任务 */
  interface BackgroundTaskSearch extends BackgroundTaskSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 后台任务 */
  interface BackgroundTaskFieldComment extends BackgroundTaskFieldCommentType {
  }
  
}

export const backgroundTaskFields = [
  // ID
  "id",
  // 名称
  "lbl",
  // 状态
  "state",
  "state_lbl",
  // 类型
  "type",
  "type_lbl",
  // 执行结果
  "result",
  // 错误信息
  "err_msg",
  // 开始时间
  "begin_time",
  "begin_time_lbl",
  // 结束时间
  "end_time",
  "end_time_lbl",
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

export const backgroundTaskQueryField = `
  ${ backgroundTaskFields.join(" ") }
`;
