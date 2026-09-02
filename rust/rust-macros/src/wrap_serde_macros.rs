use proc_macro2::TokenStream;
use std::env;

pub fn wrap_serde_macros_impl(input: TokenStream, force_proceed: bool) -> TokenStream {
    let proceed = force_proceed || env::var("STRIP_ASYNC_GRAPHQL").as_deref() == Ok("1");
    if !proceed {
        return input;
    }

    input
}
