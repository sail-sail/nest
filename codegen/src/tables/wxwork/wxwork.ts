import { defineConfig } from "../../config";

export default defineConfig({
  // 企微应用
  wxwork_wxw_app: {
    opts: {
      cache: true,
      uniques: [
        [ "lbl" ],
        [ "corpid", "agentid" ],
        [ "domain_id" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        width: 300,
      },
      {
        COLUMN_NAME: "corpid",
        search: true,
        width: 180,
      },
      {
        COLUMN_NAME: "agentid",
        search: true,
        width: 120,
      },
      {
        COLUMN_NAME: "domain_id",
        width: 220,
        align: "left",
      },
      {
        COLUMN_NAME: "corpsecret",
        width: 220,
        isEncrypt: true,
      },
      {
        COLUMN_NAME: "contactsecret",
        width: 220,
        isEncrypt: true,
      },
      {
        COLUMN_NAME: "is_locked",
      },
      {
        COLUMN_NAME: "is_enabled",
      },
      {
        COLUMN_NAME: "order_by",
      },
      {
        COLUMN_NAME: "rem",
      },
    ],
  },
  // 企微应用接口凭据
  wxwork_wxw_app_token: {
    opts: {
      cache: true,
      uniques: [
        [ "wxw_app_id", "type" ],
        [ "access_token" ],
      ],
      onlyCodegenDeno: true,
    },
    columns: [
      {
        COLUMN_NAME: "wxw_app_id",
      },
      {
        COLUMN_NAME: "type",
      },
      {
        COLUMN_NAME: "corpid",
      },
      {
        COLUMN_NAME: "corpsecret",
      },
      {
        COLUMN_NAME: "contactsecret",
      },
      {
        COLUMN_NAME: "access_token",
      },
      {
        COLUMN_NAME: "token_time",
      },
      {
        COLUMN_NAME: "expires_in",
      },
      {
        COLUMN_NAME: "jsapi_ticket",
      },
      {
        COLUMN_NAME: "jsapi_ticket_time",
      },
      {
        COLUMN_NAME: "jsapi_ticket_expires_in",
      },
      {
        COLUMN_NAME: "jsapi_ticket_agent_config",
      },
      {
        COLUMN_NAME: "jsapi_ticket_agent_config_time",
      },
      {
        COLUMN_NAME: "jsapi_ticket_agent_config_expires_in",
      },
    ],
  },
  // 企微用户
  wxwork_wxw_usr: {
    opts: {
      cache: true,
      uniques: [
        [ "corpid", "userid" ],
        [ "corpid", "lbl" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "wxw_app_id",
        fixed: "left",
      },
      {
        COLUMN_NAME: "corpid",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "agentid",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "lbl",
        align: "center",
        width: 200,
      },
      {
        COLUMN_NAME: "userid",
        width: 200,
      },
      {
        COLUMN_NAME: "mobile",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "gender",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "email",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "biz_email",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "direct_leader",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "position",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "avatar",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "thumb_avatar",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "qr_code",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "rem",
      },
    ],
  },
  // 企微消息
  wxwork_wxw_msg: {
    opts: {
      noAdd: true,
      noEdit: true,
      defaultSort: {
        prop: "create_time",
        order: "descending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "wxw_app_id",
        search: true,
        width: 160,
      },
      {
        COLUMN_NAME: "errcode",
        search: true,
        width: 100,
      },
      {
        COLUMN_NAME: "touser",
        width: 140,
      },
      {
        COLUMN_NAME: "title",
        width: 280,
        align: "left",
      },
      {
        COLUMN_NAME: "description",
        width: 380,
        align: "left",
      },
      {
        COLUMN_NAME: "url",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "btntxt",
        width: 100,
      },
      {
        COLUMN_NAME: "create_time",
        COLUMN_COMMENT: "发送时间",
        search: true,
      },
      {
        COLUMN_NAME: "errmsg",
        width: 160,
      },
      {
        COLUMN_NAME: "msgid",
        onlyCodegenDeno: true,
      },
    ],
  },
});
