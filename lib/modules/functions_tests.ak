use aiken/crypto
use cardano/address.{Address, VerificationKey}
use cardano/assets.{from_asset, from_lovelace}
// use cardano/crytpo.{VerificationKeyHash}
use cardano/transaction.{
  InlineDatum, Input, NoDatum, Output, OutputReference, Transaction, placeholder,
}
use mocktail/virgin_address.{mock_pub_key_address}
use mocktail/virgin_key_hash.{mock_policy_id, mock_pub_key_hash}
use mocktail/virgin_output_reference.{mock_utxo_ref}
use modules/constant.{config_d, in_datum}
use modules/functions as function
use modules/types.{Multisig}

test atleast_signatories_pass() {
  let signatories =
    [
      mock_pub_key_hash(0),
      mock_pub_key_hash(1),
      mock_pub_key_hash(2),
      mock_pub_key_hash(3),
    ]

  let atleast =
    Multisig {
      required: 3,
      signers: [
        mock_pub_key_hash(0),
        mock_pub_key_hash(1),
        mock_pub_key_hash(2),
      ],
    }
  function.atleast_signedby(signatories, atleast)
}

test atleast_signatories_fail_2_signed() fail {
  let signatories =
    [
      mock_pub_key_hash(3),
      mock_pub_key_hash(1),
      mock_pub_key_hash(2),
      mock_pub_key_hash(5),
    ]

  let atleast =
    Multisig {
      required: 3,
      signers: [
        mock_pub_key_hash(0),
        mock_pub_key_hash(1),
        mock_pub_key_hash(2),
      ],
    }
  function.atleast_signedby(signatories, atleast)
}

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

  function.must_consume_utxo(tx.inputs, o_ref)
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

  function.must_consume_utxo(tx.inputs, o_ref)
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

  function.must_consume_utxo(tx.inputs, o_ref)
}

test mock_minting_exactly_one_passs() {
  let mock_token_name = "ABC"
  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, 1),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_mint_exactly_one(tx.mint, policy_id1)
}

test mock_minting_exactly_one_fail_minting2() fail {
  let mock_token_name = "ABC"
  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, 2),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_mint_exactly_one(tx.mint, policy_id1)
}

test mock_minting_exactly_one_fail_policyid_dontmatch() fail {
  let mock_token_name = "ABC"
  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, 1),
    }
  let policy_id1 = mock_policy_id(1)

  function.must_mint_exactly_one(tx.mint, policy_id1)
}

test mock_minting_exactly_one_fail_qty_0() fail {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, 0),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_mint_exactly_one(tx.mint, policy_id1)
}

test mock_minting_exactly_one_fail_negative_qty() fail {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, -1),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_mint_exactly_one(tx.mint, policy_id1)
}

test must_burn_exactly_one_pass() {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, -1),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_burn_exactly_one(tx.mint, policy_id1)
}

test must_burn_exactly_one_fail_burn2() fail {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, -2),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_burn_exactly_one(tx.mint, policy_id1)
}

test must_burn_exactly_one_fail_diff_poilicyid() fail {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, -1),
    }
  let policy_id1 = mock_policy_id(1)

  function.must_burn_exactly_one(tx.mint, policy_id1)
}

test must_burn_exactly_one_fail_qty_0() fail {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, 0),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_burn_exactly_one(tx.mint, policy_id1)
}

test must_burn_exactly_one_fail_qty_1() fail {
  let mock_token_name = "ABC"

  let tx =
    Transaction {
      ..placeholder,
      mint: from_asset(mock_policy_id(0), mock_token_name, 1),
    }
  let policy_id1 = mock_policy_id(0)

  function.must_burn_exactly_one(tx.mint, policy_id1)
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
        value: from_asset(mock_policy_id(0), "ABC", 1),
        datum: NoDatum,
        reference_script: None,
      },
    }
  let nft = mock_policy_id(0)
  let tx = Transaction { ..placeholder, inputs: [inputs1] }
  //mint: from_asset(nft, "ABC", 0),
  function.find_ref_input_with_config_nft(tx.inputs, nft) == inputs1
}

test find_ref_input_with_config_nft_fail_diff_PID() fail {
  let inputs1 =
    Input {
      output_reference: mock_utxo_ref(0, 0),
      output: Output {
        address: Address {
          payment_credential: VerificationKey(mock_pub_key_hash(0)),
          stake_credential: None,
        },
        value: from_asset(mock_policy_id(1), "ABC", 1),
        datum: NoDatum,
        reference_script: None,
      },
    }
  let nft = mock_policy_id(0)
  let tx = Transaction { ..placeholder, inputs: [inputs1] }
  function.find_ref_input_with_config_nft(tx.inputs, nft) == inputs1
}

// test must_send_fees_to_address_pass() {
//   let output =
//     Output {
//       address: mock_pub_key_address(0, None),
//       value: from_lovelace(2_000_000),
//       datum: NoDatum,
//       reference_script: None,
//     }
//   function.must_send_fees_to_address([output], config_d)
// }

test must_send_fees_to_address_less_fees() fail {
  let output =
    Output {
      address: mock_pub_key_address(0, None),
      value: from_lovelace(1_000_000),
      datum: NoDatum,
      reference_script: None,
    }
  function.must_send_fees_to_address([output], config_d)
}

test must_send_fees_to_address_more_fees() fail {
  let output =
    Output {
      address: mock_pub_key_address(0, None),
      value: from_lovelace(10_000_000),
      datum: NoDatum,
      reference_script: None,
    }
  function.must_send_fees_to_address([output], config_d)
}

test must_send_fees_to_address_wrong_fees_address() fail {
  let output =
    Output {
      address: mock_pub_key_address(1, None),
      value: from_lovelace(10_000_000),
      datum: NoDatum,
      reference_script: None,
    }
  function.must_send_fees_to_address([output], config_d)
}

test must_send_nft_and_datum_to_script_pass() {
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
  let output =
    Output {
      address: mock_pub_key_address(0, None),
      value: from_asset(mock_policy_id(1), "", 1),
      datum: InlineDatum(config_d),
      reference_script: None,
    }
  let policy_id1 = mock_policy_id(0)

  function.must_send_nft_and_datum_to_script(output, policy_id1)
}
// test name_oref_pass() {
//   // let  campaign_nonce = mock_utxo_ref(0, 0)

//   let oref = OutputReference("123", 0)
//   function.token_name_oref(oref) == crypto.blake2b_224("1230")
// }

// test name_oref_fail() {
//   // let  campaign_nonce = mock_utxo_ref(0, 0)

//   let oref = OutputReference("1234", 0)
//   function.token_name_oref(oref) == crypto.blake2b_224("1230")
// }

// test name_oref_pass2() {
//   // let  campaign_nonce = mock_utxo_ref(0, 0)

//   let oref = OutputReference("123", 0)
//   function.token_name_oref2(oref) == "123"
// }

// test name_oref_pass3() {
//   let oref = OutputReference(#"123456", 0)

//   // transaction_id as ByteArray
//   function.token_name_oref2(oref) == #"00123456"
//   // Expected result after pushing 0 as the first byte
// }
