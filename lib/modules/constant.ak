// use cardano/address.{from_verification_key}
// use cardano/assets
// use cardano/transaction.{OutputReference}
// use mocktail/virgin_address.{mock_pub_key_address}
// use mocktail/virgin_key_hash.{mock_script_hash}
// use modules/types.{ConfigDatum, KarbonDatum}

// pub const output_reference =
//   OutputReference(
//     #"0000000000000000000000000000000000000000000000000000000000000064",
//     0,
//   )

// pub const address1 =
//   from_verification_key(
//     #"00000000000000000000000000000000000000000000000000000056",
//   )

// pub const token_policyid = "karbon_policy"

// pub const token_name = assets.from_asset(token_policyid, "KARBON_TOKEN", 1)

// // pub const in_datum =
// //   KarbonDatum {
// //     developer: from_script(
// //       #"00000000000000000000000000000000000000000000000000000056",
// //     ),
// //     document: #"00000000000000000000000000000000000000000000000000000000",
// //     fees: 0,
// //   }

// // pub const confi_d =
// //   ConfigDatum {
// //     fees_address: from_verification_key(
// //       #"00000000000000000000000000000000000000000000000000000056",
// //     ),
// //     fees: 2_000_000,
// //     spend_address: from_script(
// //       #"00000000000000000000000000000000000000000000000000000001",
// //     ),
// //   }

// pub const in_datum =
//   KarbonDatum {
//     developer: mock_pub_key_address(0, None),
//     document: mock_script_hash(0),
//     fees: 0,
//   }

// pub const confi_d =
//   ConfigDatum {
//     fees_address: mock_pub_key_address(0, None),
//     fees: 2_000_000,
//     spend_address: mock_pub_key_address(0, None),
//   }
