pub mod menu;
pub mod message;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct BaseAppQuery(
    self::menu::menu_graphql::MenuQuery,
    self::message::message_graphql::MessageQuery,
);

#[derive(MergedObject, Default)]
pub struct BaseAppMutation(
    self::message::message_graphql::MessageMutation,
);

