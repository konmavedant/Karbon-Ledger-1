// use cardano/address
// use cardano/assets.{from_lovelace}
// use cardano/transaction.{InlineDatum, OutputReference}
// use modules/constant.{
//   address1, confi_d, in_datum, output_reference, token_name, token_policyid,
// }
// use modules/functions as function
// use tx_util/builder/txn.{
//   add_asset_to_tx_output, add_mint, add_tx_input, new_tx_input,
//   set_datum_of_tx_output,
// }

// test tx_util_must_consume_utxo_pass() {
//   let output_reference =
//     OutputReference(
//       #"0000000000000000000000000000000000000000000000000000000000000064",
//       0,
//     )

//   let tx_in = new_tx_input(output_reference, address1)

//   let tx =
//     transaction.placeholder
//       |> add_tx_input(tx_in)

//   function.must_consume_utxo([tx_in], output_reference, tx)
// }

// test tx_util_must_consume_utxo_fanother_utxo_fail() fail {
//   let output_reference =
//     OutputReference(
//       #"0000000000000000000000000000000000000000000000000000000000000064",
//       0,
//     )
//   let another_oref = OutputReference("Oref", 0)

//   let tx_in = new_tx_input(output_reference, address1)

//   let tx =
//     transaction.placeholder
//       |> add_tx_input(tx_in)

//   function.must_consume_utxo([tx_in], another_oref, tx)
// }

// test tx_util_must_consume_utxo_fail() fail {
//   let another_oref = OutputReference("Oref", 0)

//   let tx_in = new_tx_input(output_reference, address1)

//   let tx =
//     transaction.placeholder
//       |> add_tx_input(tx_in)

//   function.must_consume_utxo([tx_in], another_oref, tx)
// }

// test tx_util_mock_minting_exactly_one_pass() {
//   // let policy_id1 = "PolicyID"
//   let tx_in = new_tx_input(output_reference, address1)
//   let tx =
//     transaction.placeholder
//       |> add_tx_input(tx_in)
//       |> add_mint(token_name)

//   function.must_mint_exactly_one(token_policyid, tx)
// }

// test tx_util_mock_minting_exactly_one_fail() fail {
//   let policy_id1 = "PolicyID"
//   let tx_in = new_tx_input(output_reference, address1)
//   let tx =
//     transaction.placeholder
//       |> add_tx_input(tx_in)
//       |> add_mint(token_name)

//   function.must_mint_exactly_one(policy_id1, tx)
// }

// test tx_utils_must_send_nft_and_datum_to_script_pass() {
//   let tx_output_1 =
//     txn.new_tx_output(address1)
//       |> set_datum_of_tx_output(in_datum |> InlineDatum)
//       |> add_asset_to_tx_output(token_name)

//   function.must_send_nft_and_datum_to_script(tx_output_1, token_policyid)
// }

// test tx_utils_must_send_nft_and_datum_to_script_fail() fail {
//   let tx_output_1 =
//     txn.new_tx_output(address1)
//       |> set_datum_of_tx_output(in_datum |> InlineDatum)
//       |> add_asset_to_tx_output(token_name)

//   let fakePID = "FakePolicyID"

//   function.must_send_nft_and_datum_to_script(tx_output_1, fakePID)
// }

// test tx_utils_must_send_fees_to_address_pass() {
//   let tx_output_1 =
//     txn.new_tx_output(address1)
//       |> add_asset_to_tx_output(from_lovelace(2_000_000))

//   function.must_send_fees_to_address([tx_output_1], confi_d)
// }

// test tx_utils_must_send_fees_to_address_fail() fail {
//   let wrong_addr = address.from_script("ABCDSADa")
//   let tx_output_1 =
//     txn.new_tx_output(wrong_addr)
//       |> add_asset_to_tx_output(from_lovelace(2_000_000))
//   function.must_send_fees_to_address([tx_output_1], confi_d)
// }
