use proc_macro2::{Delimiter, Group, TokenStream, TokenTree};
use std::collections::HashMap;

pub type SlotCheck = Box<dyn Fn(&TokenTree) -> bool>;
pub type SlotReplacement = Option<Vec<TokenTree>>;
pub type Slot = (SlotCheck, SlotReplacement);

pub fn remove_token_sequences_matching(tokens: TokenStream, mut slot_checks: Vec<SlotCheck>) -> TokenStream {
    let mut slots: Vec<Slot> = Vec::new();
    for check in slot_checks.drain(0..slot_checks.len()) {
        slots.push((check, None));
    }
    replace_token_sequences_matching(tokens, &slots)
}

pub fn replace_token_sequences_matching(tokens: TokenStream, slots: &Vec<Slot>) -> TokenStream {
    let mut token_replacements_planned: HashMap<usize, SlotReplacement> = HashMap::new();
    let mut tokens_so_far: Vec<TokenTree> = Vec::new();

    for token in tokens {
        tokens_so_far.push(token);
        if tokens_so_far.len() >= slots.len() {
            let token_index_for_first_slot = tokens_so_far.len() - slots.len();
            let all_checks_pass = slots.iter().enumerate().all(|(i, slot)| {
                let token = &tokens_so_far[token_index_for_first_slot + i];
                let check = &slot.0;
                check(token)
            });

            if all_checks_pass {
                for (i2, slot) in slots.iter().enumerate() {
                    let index_to_replace = token_index_for_first_slot + i2;
                    let replacement_tokens_final = match &slot.1 {
                        Some(replacement_tokens) => {
                            let mut new_tokens = Vec::with_capacity(replacement_tokens.len());
                            for replacement_token in replacement_tokens {
                                let mut new_token = replacement_token.clone();
                                new_token.set_span(tokens_so_far[index_to_replace].span());
                                new_tokens.push(new_token);
                            }
                            Some(new_tokens)
                        }
                        None => None,
                    };
                    token_replacements_planned.insert(index_to_replace, replacement_tokens_final);
                }
            }
        }
    }

    let mut result: Vec<TokenTree> = Vec::new();
    for (i, token) in tokens_so_far.into_iter().enumerate() {
        if token_replacements_planned.contains_key(&i) {
            let replace_with = token_replacements_planned.remove(&i).unwrap();
            if let Some(mut replace_with) = replace_with {
                result.append(&mut replace_with);
            }
            continue;
        }
        result.push(token);
    }

    let result_processed: Vec<TokenTree> = result
        .into_iter()
        .map(|token| match token {
            TokenTree::Group(data) => {
                let new_stream = replace_token_sequences_matching(data.stream(), slots);
                let mut new_token = TokenTree::Group(Group::new(data.delimiter(), new_stream));
                new_token.set_span(data.span());
                new_token
            }
            _ => token,
        })
        .collect();

    TokenStream::from_iter(result_processed)
}

pub fn remove_token_sequences_for_macros(tokens: TokenStream, macros_to_remove: &'static [&'static str]) -> TokenStream {
    remove_token_sequences_matching(tokens, get_slot_checks_for_removing_macros(macros_to_remove))
}

pub fn get_slot_checks_for_removing_macros(macros_to_remove: &'static [&'static str]) -> Vec<SlotCheck> {
    let is_macro_to_block: SlotCheck = Box::new(move |token: &TokenTree| match token {
        TokenTree::Group(data) if data.delimiter() == Delimiter::Bracket => {
            let children: Vec<TokenTree> = data.stream().into_iter().collect();
            if let Some(first_child) = children.first()
                && let TokenTree::Ident(data) = first_child
                    && macros_to_remove.contains(&data.to_string().as_str()) {
                        return true;
                    }
            false
        }
        _ => false,
    });

    let is_hash: SlotCheck = Box::new(|token: &TokenTree| matches!(token, TokenTree::Punct(data) if data.as_char() == '#'));

    vec![is_hash, is_macro_to_block]
}

pub fn remove_token_sequences_for_derive_macros(tokens: TokenStream, derive_macros_to_remove: &'static [&'static str]) -> TokenStream {
    let result = remove_token_sequences_matching(tokens, vec![
        Box::new(move |token: &TokenTree| {
            matches!(token, TokenTree::Ident(data) if derive_macros_to_remove.contains(&data.to_string().as_str()))
        }),
        Box::new(|token: &TokenTree| matches!(token, TokenTree::Punct(data) if data.as_char() == ',')),
    ]);

    let result = remove_token_sequences_matching(result, vec![
        Box::new(|token: &TokenTree| matches!(token, TokenTree::Punct(data) if data.as_char() == ',')),
        Box::new(move |token: &TokenTree| {
            matches!(token, TokenTree::Ident(data) if derive_macros_to_remove.contains(&data.to_string().as_str()))
        }),
    ]);

    remove_token_sequences_matching(result, vec![
        Box::new(move |token: &TokenTree| {
            matches!(token, TokenTree::Ident(data) if derive_macros_to_remove.contains(&data.to_string().as_str()))
        }),
    ])
}
