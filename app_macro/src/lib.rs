#![crate_type = "proc-macro"]
#![recursion_limit = "192"]

extern crate proc_macro;
extern crate proc_macro2;
#[macro_use]
extern crate quote;
extern crate syn;

use darling::FromMeta;
use proc_macro::TokenStream;
use syn::{Fields, Type};

macro_rules! my_quote {
  ($($t:tt)*) => (quote_spanned!(proc_macro2::Span::call_site() => $($t)*))
}

fn map_fields<F>(fields: &Fields, mapper:&mut F) -> proc_macro2::TokenStream
where
    F: FnMut((&Option<proc_macro2::Ident> ,  &Type)) -> proc_macro2::TokenStream,
{
    let fs = fields.iter().map(|field| mapper((&field.ident ,&field.ty)) );
    let stream2 = proc_macro2::TokenStream::from_iter(fs);
    stream2
}

#[proc_macro_derive(FromModel)]
pub fn from_model(input: TokenStream) -> TokenStream {
  let ast = syn::parse(input).unwrap();
  into_macro(&ast)
}

fn into_macro(ast: &syn::DeriveInput) -> TokenStream {
  let name = &ast.ident;
  let mut name_model = name.to_string();
  if name_model.ends_with("Input") {
    name_model = name_model[0..name_model.len()-5].to_string();
  }
  let name_model = syn::Ident::from_string(&format!("{}Model", name_model)).unwrap();
  let data_struct = match &ast.data {
    syn::Data::Struct(data_struct) => data_struct,
    _ => panic!("FromModel can only be derived for structs"),
  };
  let builder_fields = map_fields(&data_struct.fields, &mut |(ident, ty)| {
      quote!(
        #ident: model.#ident.into(),
      ) 
  });
  let gen = my_quote! {
    impl From<#name_model> for #name {
      fn from(model: #name_model) -> Self {
        Self {
          #builder_fields
        }
      }
    }
  };
  gen.into()
}
