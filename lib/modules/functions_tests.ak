use cardano/address.{Address, VerificationKey}
use cardano/assets.{from_asset, from_lovelace}
use cardano/transaction.{
  InlineDatum, Input, NoDatum, Output, Transaction, placeholder,
}
use mocktail/virgin_address.{mock_pub_key_address}
use mocktail/virgin_key_hash.{
  mock_policy_id, mock_pub_key_hash, mock_script_hash,
}
use mocktail/virgin_output_reference.{mock_utxo_ref}
use modules/functions as function
use modules/types.{ConfigDatum, ScriptDatum}

// use tx_util/builder/txn.{add_mint, add_tx_input}
// use tx_util/builder/txn.{add_mint, add_tx_input}

test must_consume_utxo_pass() {
  let inputs1 =
    Input {
      output_reference: mock_utxo_ref(0, 0),
      output: Output {
        address: Address {
          payment_credential: VerificationKey(mock_pub_key_hash(0)),
          stake_credential: None,
        },
        value: from_lovelace(9000),
        datum: NoDatum,
        reference_script: None,
      },
    }

  let o_ref = mock_utxo_ref(0, 0)

  let tx = Transaction { ..placeholder, inputs: [inputs1] }

  function.must_consume_utxo([inputs1], o_ref, tx)
}

test must_consume_utxo_fail_other_utxo() fail {
  let inputs1 =
    Input {
      output_reference: mock_utxo_ref(0, 0),
      output: Output {
        address: Address {
          payment_credential: VerificationKey(mock_pub_key_hash(0)),
          stake_credential: None,
        },
        value: from_lovelace(9000),
        datum: NoDatum,
        reference_script: None,
      },
    }

  let o_ref = mock_utxo_ref(1, 0)

  let tx = Transaction { ..placeholder, inputs: [inputs1] }

  function.must_consume_utxo([inputs1], o_ref, tx)
}

test must_consume_utxo_fail_other_input_oref() fail {
  let inputs1 =
    Input {
      output_reference: mock_utxo_ref(1, 0),
      output: Output {
        address: Address {
          payment_credential: VerificationKey(mock_pub_key_hash(0)),
          stake_credential: None,
        },
        value: from_lovelace(9000),
        datum: NoDatum,
        reference_script: None,
      },
    }

  let o_ref = mock_utxo_ref(0, 0)

  let tx = Transaction { ..placeholder, inputs: [inputs1] }

  function.must_consume_utxo([inputs1], o_ref, tx)
}

test mock_minting_exactly_one() {
  let mock_token_name = "ABC"
  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, 1),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_mint_exactly_one(policy_id1, tx)
}

test mock_minting_exactly_one_fail_minting2() fail {
  let mock_token_name = "ABC"
  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, 2),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_mint_exactly_one(policy_id1, tx)
}

test mock_minting_exactly_one_fail_policyid_dontmatch() fail {
  let mock_token_name = "ABC"
  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, 1),
    }
  let policy_id1 = mock_policy_id(1)

  function.must_mint_exactly_one(policy_id1, tx)
}

test mock_minting_exactly_one_fail_qty_0() fail {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, 0),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_mint_exactly_one(policy_id1, tx)
}

test mock_minting_exactly_one_fail_negative_qty() fail {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, -1),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_mint_exactly_one(policy_id1, tx)
}

test must_burn_exactly_one_pass() {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, -1),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_burn_exactly_one(policy_id1, tx)
}

test must_burn_exactly_one_fail_burn2() fail {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, -2),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_burn_exactly_one(policy_id1, tx)
}

test must_burn_exactly_one_fail_diff_poilicyid() fail {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, -1),
    }
  let policy_id1 = mock_policy_id(1)

  function.must_burn_exactly_one(policy_id1, tx)
}

test must_burn_exactly_one_fail_qty_0() fail {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, 0),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_burn_exactly_one(policy_id1, tx)
}

test must_burn_exactly_one_fail_qty_1() fail {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, 1),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_burn_exactly_one(policy_id1, tx)
}

test find_ref_input_with_config_nft_pass() {
  let inputs1 =
    Input {
      output_reference: mock_utxo_ref(0, 0),
      output: Output {
        address: Address {
          payment_credential: VerificationKey(mock_pub_key_hash(0)),
          stake_credential: None,
        },
        value: from_asset(mock_policy_id(0), "ABC", 10_000_000),
        datum: NoDatum,
        reference_script: None,
      },
    }
  let nft = mock_policy_id(0)
  let tx =
    Transaction {
      ..placeholder,
      inputs: [inputs1],
      mint: from_asset(nft, "ABC", 0),
    }
  function.find_ref_input_with_config_nft([inputs1], nft, tx) == inputs1
}

test find_ref_input_with_config_nft_fail() fail {
  let inputs1 =
    Input {
      output_reference: mock_utxo_ref(0, 0),
      output: Output {
        address: Address {
          payment_credential: VerificationKey(mock_pub_key_hash(0)),
          stake_credential: None,
        },
        value: from_asset(mock_policy_id(1), "ABC", 10_000_000),
        datum: NoDatum,
        reference_script: None,
      },
    }
  let nft = mock_policy_id(0)
  let tx =
    Transaction {
      ..placeholder,
      inputs: [inputs1],
      mint: from_asset(nft, "ABC", 0),
    }
  function.find_ref_input_with_config_nft([inputs1], nft, tx) == inputs1
}

test must_send_fees_to_address_pass() {
  let redeemer =
    ConfigDatum {
      fees_address: mock_pub_key_address(0, None),
      fees: 2_000_000,
      spend_address: mock_pub_key_address(0, None),
    }

  let output =
    Output {
      address: mock_pub_key_address(0, None),
      value: from_lovelace(2_000_000),
      datum: NoDatum,
      reference_script: None,
    }
  function.must_send_fees_to_address([output], redeemer)
}

test must_send_fees_to_address_less_fees() fail {
  let redeemer =
    ConfigDatum {
      fees_address: mock_pub_key_address(0, None),
      fees: 2_000_000,
      spend_address: mock_pub_key_address(0, None),
    }

  let output =
    Output {
      address: mock_pub_key_address(0, None),
      value: from_lovelace(1_000_000),
      datum: NoDatum,
      reference_script: None,
    }
  function.must_send_fees_to_address([output], redeemer)
}

test must_send_fees_to_address_more_fees() fail {
  let redeemer =
    ConfigDatum {
      fees_address: mock_pub_key_address(0, None),
      fees: 2_000_000,
      spend_address: mock_pub_key_address(0, None),
    }

  let output =
    Output {
      address: mock_pub_key_address(0, None),
      value: from_lovelace(10_000_000),
      datum: NoDatum,
      reference_script: None,
    }
  function.must_send_fees_to_address([output], redeemer)
}

test must_send_fees_to_address_wrong_fees_address() fail {
  let redeemer =
    ConfigDatum {
      fees_address: mock_pub_key_address(1, None),
      fees: 2_000_000,
      spend_address: mock_pub_key_address(0, None),
    }

  let output =
    Output {
      address: mock_pub_key_address(0, None),
      value: from_lovelace(10_000_000),
      datum: NoDatum,
      reference_script: None,
    }
  function.must_send_fees_to_address([output], redeemer)
}

test must_send_fees_to_address_wrong_output_address() fail {
  let redeemer =
    ConfigDatum {
      fees_address: mock_pub_key_address(0, None),
      fees: 2_000_000,
      spend_address: mock_pub_key_address(0, None),
    }

  let output =
    Output {
      address: mock_pub_key_address(1, None),
      value: from_lovelace(1_000_000),
      datum: NoDatum,
      reference_script: None,
    }
  function.must_send_fees_to_address([output], redeemer)
}

// type MockDatum {
//   ScriptDatum
// }

pub const in_datum =
  ScriptDatum {
    developer: mock_pub_key_address(0, None),
    document: mock_script_hash(0),
    fees: 0,
  }

test must_send_nft_and_datum_to_script_pass() {
  // let target_state = ScriptDatum
  // let target_datum: Data = target_state
  let output =
    Output {
      address: mock_pub_key_address(0, None),
      value: from_asset(mock_policy_id(0), "", 1),
      datum: InlineDatum(in_datum),
      reference_script: None,
    }

  let policy_id1 = mock_policy_id(0)

  function.must_send_nft_and_datum_to_script(output, policy_id1)
}

// let output =
//   mock_output(
//     address: mock_pub_key_address(0, None),
//     value: from_asset(mock_policy_id(0), "", 0),
//     datum: InlineDatum(ScriptDatum),
//     reference_script: None,
//   )

test must_send_nft_and_datum_to_script_output_diff_policy_id() fail {
  let output =
    Output {
      address: mock_pub_key_address(0, None),
      value: from_asset(mock_policy_id(1), "", 1),
      datum: InlineDatum(in_datum),
      reference_script: None,
    }
  let policy_id1 = mock_policy_id(0)

  function.must_send_nft_and_datum_to_script(output, policy_id1)
}

test must_send_nft_and_datum_to_script_output_NoDAtum() fail {
  let output =
    Output {
      address: mock_pub_key_address(0, None),
      value: from_asset(mock_policy_id(1), "", 1),
      datum: NoDatum,
      reference_script: None,
    }
  let policy_id1 = mock_policy_id(0)

  function.must_send_nft_and_datum_to_script(output, policy_id1)
}

test must_send_nft_and_datum_to_script_output_another_datum() fail {
  let datum1 =
    ConfigDatum {
      fees_address: mock_pub_key_address(0, None),
      fees: 0,
      spend_address: mock_pub_key_address(0, None),
    }

  let output =
    Output {
      address: mock_pub_key_address(0, None),
      value: from_asset(mock_policy_id(1), "", 1),
      datum: InlineDatum(datum1),
      reference_script: None,
    }
  let policy_id1 = mock_policy_id(0)

  function.must_send_nft_and_datum_to_script(output, policy_id1)
}
