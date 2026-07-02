import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./message.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

  type Query {
    "获取当前用户未读消息数量"
    getMyUnreadMessageCount: Int!
  }

  type Mutation {
    "发送消息"
    sendMessage(input: MessageInput!, receiver_usr_ids: [UsrId!]!): MessageModel!
  }

`);
