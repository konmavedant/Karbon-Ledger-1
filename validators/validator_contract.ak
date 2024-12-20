use aiken/collection/list
use cardano/address.{Script, from_script}
use cardano/assets.{PolicyId}
use cardano/transaction.{
  InlineDatum, Output, OutputReference, Transaction, find_input,
}
use modules/functions.{
  atleast_signedby, find_ref_input_with_config_nft, funds_sent_to_developer,
  must_burn_less_than_0, must_mint_exactly_one, must_mint_tokens,
  must_send_fees_to_address, must_send_nft_and_datum_to_script,
  must_spend_script_input,
}
use modules/types.{Accept, ConfigDatum, KarbonDatum, KarbonRedeemer, Reject}

// separate the spend and mint handlers
validator validator_contract(
  config_nft: PolicyId,
  validator_contract_mint: PolicyId,
) {
  spend(
    datum: Option<KarbonDatum>,
    redeemer: KarbonRedeemer,
    oref: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum
    let Transaction {
      mint,
      inputs,
      reference_inputs,
      extra_signatories,
      outputs,
      ..
    } = tx
    expect Some(script_input) = find_input(inputs, oref)
    expect Script(script_hash) = script_input.output.address.payment_credential
    let ref_input = find_ref_input_with_config_nft(reference_inputs, config_nft)
    expect InlineDatum(ref_input_datum) = ref_input.output.datum
    expect ref_datum: ConfigDatum = ref_input_datum

    expect must_burn_less_than_0(mint, validator_contract_mint)
    expect
      atleast_signedby(extra_signatories, ref_datum.multisig_validator_group)
    when redeemer.action is {
      Accept -> funds_sent_to_developer(outputs, datum, redeemer, script_hash)
      Reject -> True
    }
  }

  mint(redeemer: KarbonRedeemer, policy_id: PolicyId, tx: Transaction) {
    let Transaction { inputs, mint, .. } = tx
    let script_address = from_script(policy_id)
    and {
      must_mint_tokens(mint, policy_id, redeemer),
      must_spend_script_input(inputs, script_address),
    }
  }

  else(_) {
    fail
  }
}

validator validator_contract_mint(config_nft: PolicyId) {
  mint(redeemer: Int, policy_id: PolicyId, tx: Transaction) {
    let Transaction { mint, reference_inputs, outputs, .. } = tx
    when redeemer is {
      0 -> {
        let ref_input =
          find_ref_input_with_config_nft(reference_inputs, config_nft)
        expect InlineDatum(ref_input_datum) = ref_input.output.datum
        expect ref_datum: ConfigDatum = ref_input_datum

        expect [script_output] =
          list.filter(
            outputs,
            fn(output) { output.address == ref_datum.spend_address },
          )
        and {
          must_mint_exactly_one(mint, policy_id),
          must_send_fees_to_address(outputs, ref_datum),
          must_send_nft_and_datum_to_script(script_output, policy_id),
        }
      }
      1 -> must_burn_less_than_0(mint, policy_id)

      _ -> fail
    }
  }

  else(_) {
    fail
  }
}
// redeemer will have amount that must be sent to the developver
// add mint to the contract thta wil mint amount set on redeemer
