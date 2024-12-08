use aiken/collection/dict
use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/assets.{AssetName, PolicyId, Value}
use cardano/transaction.{InlineDatum,
  Input, Output, OutputReference, find_input}
use modules/types.{ConfigDatum, KarbonDatum, Multisig}

pub fn must_consume_utxo(inputs: List<Input>, o_ref: OutputReference) {
  expect Some(_input) = find_input(inputs, o_ref)
  True
}

pub fn must_mint_exactly_one(mint: Value, policy_id: PolicyId) -> Bool {
  expect [Pair(_, qty)] =
    mint
      |> assets.tokens(policy_id)
      |> dict.to_pairs()
  (qty == 1)?
}

pub fn must_burn_exactly_one(mint: Value, policy_id: PolicyId) -> Bool {
  expect [Pair(_, qty)] =
    mint
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
        (assets.lovelace_of(output.value) == ref_datum.fees_amount)?,
      }
    },
  )
}

pub fn must_send_nft_and_datum_to_script(output: Output, policy_id: PolicyId) {
  expect InlineDatum(output_datum) = output.datum
  expect _: KarbonDatum = output_datum
  // output_datum.fee == configDatum.fee (should be check)
  list.has(output.value |> assets.policies, policy_id)?
}

pub fn atleast_signedby(
  signatories: List<VerificationKeyHash>,
  atleast_signatories: Multisig,
) -> Bool {
  let Multisig { required, signers } = atleast_signatories
  (required <= list.count(signers, fn(signer) { list.has(signatories, signer) }))?
}

pub fn funds_sent_to_developer() {
  todo
}
