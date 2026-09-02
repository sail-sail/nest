use proc_macro2::TokenStream;
use std::{
    env,
    str::FromStr,
    time::{SystemTime, UNIX_EPOCH},
};

use crate::utils::{remove_token_sequences_for_derive_macros, remove_token_sequences_for_macros};

pub const SKIP_AGQL_WRAPPING: bool = false;

pub fn wrap_async_graphql_impl(input: TokenStream, force_proceed: bool) -> TokenStream {
    if SKIP_AGQL_WRAPPING {
        return input;
    }

    let proceed = force_proceed || {
        env::var("STRIP_ASYNC_GRAPHQL").map(|v| v == "1").unwrap_or(false)
    };

    if !proceed {
        return input;
    }

    let output = remove_graphql_tags(input);
    let unique = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();

    let pre_tokens = TokenStream::from_str(&format!("use async_graphql as _async_graphql_unused_alias_{unique};")).unwrap();
    pre_tokens.into_iter().chain(output).collect()
}

static MACROS_TO_REMOVE: &[&str] = &["graphql", "Object", "Subscription"];
static DERIVE_MACROS_TO_REMOVE: &[&str] = &["SimpleObject", "MergedObject", "MergedSubscription", "InputObject"];

fn remove_graphql_tags(tokens: TokenStream) -> TokenStream {
    let mut result = tokens;
    result = remove_token_sequences_for_macros(result, MACROS_TO_REMOVE);
    result = remove_token_sequences_for_derive_macros(result, DERIVE_MACROS_TO_REMOVE);
    result
}
