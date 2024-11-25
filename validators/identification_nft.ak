use cardano/assets.{AssetName, PolicyId}
use cardano/transaction.{OutputReference, Transaction}
use modules/functions.{
  must_burn_exactly_one, must_consume_utxo, must_mint_exactly_one,
}
use modules/types.{Action}

validator identification_nft(o_ref: OutputReference, token_name: AssetName) {
  mint(redeemer: Action, policy_id: PolicyId, tx: Transaction) {
    when redeemer is {
      // 1 = minting
      1 -> and {
          must_consume_utxo(tx.inputs, o_ref)?,
          must_mint_exactly_one(tx, token_name, policy_id)?,
        }
      // 0 = burning
      0 -> must_burn_exactly_one(tx, token_name, policy_id)?
      _ -> fail
    }
  }

  else(_) {
    fail
  }
}
