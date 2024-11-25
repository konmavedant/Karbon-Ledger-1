use aiken/collection/dict
use cardano/assets.{AssetName, PolicyId}
use cardano/transaction.{Input, OutputReference, Transaction, find_input}

pub fn must_consume_utxo(inputs: List<Input>, o_ref: OutputReference) {
  expect Some(_input) = find_input(inputs, o_ref)
  True
}

pub fn must_mint_exactly_one(
  tx: Transaction,
  token_name: AssetName,
  policy_id: PolicyId,
) {
  expect [Pair(asset_name, qty)] =
    tx.mint
      |> assets.tokens(policy_id)
      |> dict.to_pairs()
  and {
    asset_name == token_name,
    qty == 1,
  }
}

pub fn must_burn_exactly_one(
  tx: Transaction,
  token_name: AssetName,
  policy_id: PolicyId,
) {
  expect [Pair(asset_name, qty)] =
    tx.mint
      |> assets.tokens(policy_id)
      |> dict.to_pairs()
  and {
    asset_name == token_name,
    qty < 0,
  }
}
