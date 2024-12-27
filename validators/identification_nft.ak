use cardano/assets.{PolicyId}
use cardano/transaction.{OutputReference, Transaction}
use modules/functions.{
  must_burn_exactly_one, must_consume_utxo, must_mint_exactly_one,
}
use modules/types.{Action, Burn, Mint}

// TODO:  separate spend and mint handler
validator identification_nft(o_ref: OutputReference) {
  mint(redeemer: Action, policy_id: PolicyId, tx: Transaction) {
    let Transaction { inputs, mint, .. } = tx
    when redeemer is {
      // 1 = minting
      Mint -> and {
          must_consume_utxo(inputs, o_ref)?,
          must_mint_exactly_one(mint, policy_id)?,
        }
      // 0 = burning
      Burn -> must_burn_exactly_one(mint, policy_id)?
    }
  }

  else(_) {
    fail
  }
}
