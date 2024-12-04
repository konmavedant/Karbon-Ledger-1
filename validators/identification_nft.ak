// use cardano/assets.{PolicyId}
// use cardano/transaction.{OutputReference, Transaction}
// use modules/functions.{
//   must_burn_exactly_one, must_consume_utxo, must_mint_exactly_one,
// }
// use modules/types.{Action}

// // TODO:  separate spend and mint handler
// validator identification_nft(o_ref: OutputReference) {
//   mint(redeemer: Action, policy_id: PolicyId, tx: Transaction) {
//     when redeemer is {
//       // 1 = minting
//       1 -> and {
//           must_consume_utxo(tx.inputs, o_ref, tx)?,
//           must_mint_exactly_one(tx.mint, policy_id)?,
//         }
//       // 0 = burning
//       0 -> must_burn_exactly_one(tx.mint, policy_id)?
//       _ -> fail
//     }
//   }

//   else(_) {
//     fail
//   }
// }
