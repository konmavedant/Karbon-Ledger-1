use aiken/crypto.{Script}
//VerificationKeyHash
use cardano/address.{Address}

// use cardano/assets.{Lovelace}

pub type ScriptDatum {
  developer: Address,
  document: Script,
  fees: Int,
}

pub type Action =
  Int

pub type Atleast =
  Int

pub type ConfigDatum {
  fees_address: Address,
  fees: Int,
  spend_address: Address,
}
//multisig_validator_group: (List<VerificationKeyHash>, Atleast),
//multisig_refutxoupdate: List<VerificationKeyHash>,
