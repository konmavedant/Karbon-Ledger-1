use aiken/collection/list
use cardano/assets.{PolicyId}
use cardano/transaction.{InlineDatum, Output, Transaction}
use modules/functions.{
  atleast_signedby, find_ref_input_with_config_nft, funds_sent_to_developer,
  must_burn_less_than_0, must_mint_exactly_one, must_send_fees_to_address,
  must_send_nft_and_datum_to_script,
}
use modules/types.{Accept, AcceptRejectAction, ConfigDatum, Reject}

// separate the spend and mint handlers
validator validator_contract(
  config_nft: PolicyId,
  validator_contract_mint: PolicyId,
) {
  spend(_datum, redeemer: AcceptRejectAction, _oref, tx: Transaction) {
    let Transaction { mint, reference_inputs, extra_signatories, .. } = tx
    let ref_input = find_ref_input_with_config_nft(reference_inputs, config_nft)
    expect InlineDatum(ref_input_datum) = ref_input.output.datum
    expect ref_datum: ConfigDatum = ref_input_datum

    // TODO: 
    // funds sent to developer address
    // carbon token sent to developer
    // policyid of carbon token in configDatum??
    // carbon token mint ? or send 
    expect must_burn_less_than_0(mint, validator_contract_mint)
    expect
      atleast_signedby(extra_signatories, ref_datum.multisig_validator_group)
    when redeemer is {
      Accept -> funds_sent_to_developer()
      Reject -> True
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
