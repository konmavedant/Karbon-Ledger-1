use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address}
use cardano/assets.{AssetName, PolicyId}
use cardano/transaction.{OutputReference}

pub type AssetClass {
  policy_id: PolicyId,
  asset_name: AssetName,
}

pub type Action =
  Int

pub type AcceptRejectAction {
  Accept
  Reject
}

pub type Atleast =
  Int

pub type Multisig {
  required: Atleast,
  signers: List<VerificationKeyHash>,
}

pub type ConfigDatum {
  fees_address: Address,
  fees_amount: Int,
  fees_asset_class: AssetClass,
  spend_address: Address,
  categories: List<ByteArray>,
  // minter_policyid: 
  multisig_validator_group: Multisig,
  multisig_refutxoupdate: Multisig,
}

pub type KarbonDatum {
  developer: Address,
  document: ByteArray,
  category: ByteArray,
  asset_name: ByteArray,
  fees_amount: Int,
  fees_asset_class: AssetClass,
}

pub type KarbonRedeemer {
  action: AcceptRejectAction,
  amount: Int,
  oref: OutputReference,
}
