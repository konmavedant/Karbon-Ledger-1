use aiken/collection/list
use cardano/address.{Script, from_script}
use cardano/assets.{PolicyId}
use cardano/transaction.{
  InlineDatum, Output, OutputReference, Transaction, find_input,
}
use modules/functions.{
  atleast_signedby, correct_asset_name_in_datum, find_ref_input_with_config_nft,
  funds_sent_to_developer, is_category_from_supported_categories,
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

    // expect must_burn_less_than_0(mint, validator_contract_mint)
    // expect
    //   atleast_signedby(extra_signatories, ref_datum.multisig_validator_group)
    when redeemer.action is {
      Accept -> funds_sent_to_developer(outputs, datum, redeemer, script_hash)
      Reject -> and {
          must_burn_less_than_0(mint, validator_contract_mint),
          atleast_signedby(
            extra_signatories,
            ref_datum.multisig_validator_group,
          ),
        }
    }
  }

  mint(redeemer: KarbonRedeemer, policy_id: PolicyId, tx: Transaction) {
    let Transaction { inputs, mint, .. } = tx
    let script_address = from_script(policy_id)
    // 
    // atleast_signedby(extra_signatories, ref_datum.multisig_validator_group)
    and {
      must_mint_tokens(mint, policy_id, redeemer),
      must_spend_script_input(inputs, script_address),
    }
  }

  // About rules of Minting policy "C" (Note that it could be part of single script if one likes via CIP - 69)
  // * redeemer takes the output reference that is being spent along with the carbon credit amount.

  // * Goes through inputs to find given reference, let it be I.
  // * Parse the datum of input I.
  // * Make sure it has the required NFT.
  // * Check that this NFT is being burnt.
  // * Multi-sig is satisfied where multi-sig is obtained from reference configuration UTxO.
  // * The asset name of minted carbon credit is hash of output reference. Of course, require that only one
  //   asset name is being minted under this minting policy of given credit amount.
  // * All minted tokens are being sent to owner's address.

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
        expect InlineDatum(script_data) = script_output.datum
        expect script_datum: KarbonDatum = script_data

        and {
          is_category_from_supported_categories(
            ref_datum.categories,
            script_datum.category,
          ),
          correct_asset_name_in_datum(mint, policy_id, script_datum.asset_name),
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
//DONE  MINT + Category that the credit belongs to, check that the category is one of supported ones from configuration UTxO
//DONE  MINT + NFT asset name in datum
