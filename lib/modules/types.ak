use aiken/crypto.{Script, VerificationKeyHash}
use cardano/assets.{Lovelace}

pub type KDatum {
  developer: VerificationKeyHash,
  document: Script,
  fees: Lovelace,
  funds: Lovelace,
}

pub type Action =
  Int
