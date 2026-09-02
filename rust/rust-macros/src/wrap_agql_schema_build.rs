use proc_macro2::TokenStream;
use std::{env, str::FromStr};

use crate::wrap_async_graphql::SKIP_AGQL_WRAPPING;

pub fn wrap_agql_schema_type_impl(input: TokenStream, force_proceed: bool) -> TokenStream {
    if SKIP_AGQL_WRAPPING {
        return input;
    }

    let proceed = force_proceed || env::var("STRIP_ASYNC_GRAPHQL").as_deref() == Ok("1");
    if !proceed {
        return input;
    }

    TokenStream::from_str("Schema<EmptyMutation, EmptyMutation, EmptySubscription>").unwrap()
}

pub fn wrap_agql_schema_build_impl(input: TokenStream, force_proceed: bool) -> TokenStream {
    if SKIP_AGQL_WRAPPING {
        return input;
    }

    let proceed = force_proceed || env::var("STRIP_ASYNC_GRAPHQL").as_deref() == Ok("1");
    if !proceed {
        return input;
    }

    TokenStream::from_str("Schema::build(EmptyMutation, EmptyMutation, EmptySubscription)").unwrap()
}
