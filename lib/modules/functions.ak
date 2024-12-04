use aiken/collection/dict
use aiken/collection/list
use cardano/assets.{AssetName, PolicyId, Value}
use cardano/transaction.{
  InlineDatum, Input, Output, OutputReference, Transaction,
} as tx
use modules/types.{ConfigDatum, ScriptDatum}

pub fn must_consume_utxo(
  inputs: List<Input>,
  o_ref: OutputReference,
  tx: Transaction,
) {
  expect Some(_input) = tx.find_input(inputs, o_ref)
  True
}

pub fn must_mint_exactly_one(policy_id: PolicyId, tx: Transaction) -> Bool {
  expect [Pair(_, qty)] =
    tx.mint
      |> assets.tokens(policy_id)
      |> dict.to_pairs()
  (qty == 1)?
}

pub fn must_burn_exactly_one(policy_id: PolicyId, tx: Transaction) -> Bool {
  expect [Pair(_, qty)] =
    tx.mint
      |> assets.tokens(policy_id)
      |> dict.to_pairs()
  trace @"policy_id": policy_id
  trace @"qty": qty
  (qty == -1)?
}

pub fn must_burn_less_than_0(mint: Value, policy_id: PolicyId) -> Bool {
  //TODO: test if it throws error when mint has not found token for `policy_id` then throws error or not
  let values: Pairs<AssetName, Int> =
    mint
      |> assets.tokens(policy_id)
      |> dict.to_pairs()

  list.all(values, fn(Pair(_, amount)) { amount < 0 })
}

pub fn find_ref_input_with_config_nft(
  inputs: List<Input>,
  nft: PolicyId,
  _tx: Transaction,
) -> Input {
  expect Some(ref_input) =
    list.find(
      inputs,
      fn(input) { list.has(input.output.value |> assets.policies, nft) },
    )
  ref_input
}

pub fn must_send_fees_to_address(
  outputs: List<Output>,
  ref_datum: ConfigDatum,
) -> Bool {
  list.any(
    outputs,
    fn(output) {
      and {
        (output.address == ref_datum.fees_address)?,
        (assets.lovelace_of(output.value) == ref_datum.fees)?,
      }
    },
  )
}

pub fn must_send_nft_and_datum_to_script(output: Output, policy_id: PolicyId) {
  expect InlineDatum(output_datum) = output.datum
  expect _: ScriptDatum = output_datum
  // output_datum.fee == configDatum.fee (should be check)
  list.has(output.value |> assets.policies, policy_id)?
}
