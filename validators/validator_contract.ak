use cardano/assets.{PolicyId}
use cardano/transaction.{InlineDatum, Output, Transaction, find_script_outputs}
use modules/functions.{
  find_ref_input_with_config_nft, must_burn_exactly_one,
  must_send_fees_to_address, must_send_nft_and_datum_to_script,
}
use modules/types.{ConfigDatum}

validator validator_contract(config_nft: PolicyId) {
  spend(_datum, _redeemer, _oref, _tx) {
    // funds sent to developer address
    // nft burned
    // multi sig
    True
  }

  mint(redeemer: Int, policy_id: PolicyId, tx: Transaction) {
    let Transaction { mint, reference_inputs, outputs, .. } = tx
    when redeemer is {
      0 -> {
        let ref_input =
          find_ref_input_with_config_nft(reference_inputs, config_nft)
        expect InlineDatum(ref_input_datum) = ref_input.output.datum
        expect ref_datum: ConfigDatum = ref_input_datum

        expect [script_output]: List<Output> =
          find_script_outputs(outputs, policy_id)
        and {
          must_send_fees_to_address(outputs, ref_datum),
          // ref input -- address and fees (ref input match with nft policyId: _config_nft)
          must_send_nft_and_datum_to_script(script_output, policy_id),
        }
      }
      1 -> must_burn_exactly_one(mint, policy_id)
      _ -> fail
    }
  }

  else(_) {
    fail
  }
}
