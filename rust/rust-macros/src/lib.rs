extern crate proc_macro;

use proc_macro::TokenStream;
use proc_macro2::TokenStream as TokenStream2;
use quote::quote;
use std::env;

mod utils;
mod wrap_async_graphql;
mod wrap_agql_schema_build;
mod wrap_serde_macros;

#[proc_macro]
pub fn wrap_async_graphql(input: TokenStream) -> TokenStream {
    let output = wrap_async_graphql::wrap_async_graphql_impl(TokenStream2::from(input), false);
    TokenStream::from(output)
}

#[proc_macro]
pub fn wrap_agql_schema_type(input: TokenStream) -> TokenStream {
    let output = wrap_agql_schema_build::wrap_agql_schema_type_impl(TokenStream2::from(input), false);
    TokenStream::from(output)
}

#[proc_macro]
pub fn wrap_agql_schema_build(input: TokenStream) -> TokenStream {
    let output = wrap_agql_schema_build::wrap_agql_schema_build_impl(TokenStream2::from(input), false);
    TokenStream::from(output)
}

#[proc_macro]
pub fn wrap_serde_macros(input: TokenStream) -> TokenStream {
    let output = wrap_serde_macros::wrap_serde_macros_impl(TokenStream2::from(input), false);
    TokenStream::from(output)
}

#[proc_macro]
pub fn wrap_slow_macros(input: TokenStream) -> TokenStream {
    let proceed = env::var("FOR_RUST_ANALYZER").as_deref() == Ok("1");
    if !proceed {
        return input;
    }

    let output = wrap_async_graphql::wrap_async_graphql_impl(TokenStream2::from(input), true);
    let output = wrap_serde_macros::wrap_serde_macros_impl(output, true);
    TokenStream::from(output)
}

#[proc_macro]
pub fn unchanged(input: TokenStream) -> TokenStream {
    input
}

#[proc_macro_attribute]
pub fn unchanged_attr(_args: TokenStream, input: TokenStream) -> TokenStream {
    input
}

#[proc_macro]
pub fn cached_expand(input: TokenStream) -> TokenStream {
    let expanded = TokenStream2::from(input);
    let output = quote! { #expanded };
    TokenStream::from(output)
}
