use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address}
use cardano/assets.{AssetName, PolicyId}

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
  // minter_policyid: 
  multisig_validator_group: Multisig,
  multisig_refutxoupdate: Multisig,
}

pub type KarbonDatum {
  developer: Address,
  document: ByteArray,
  fees_amount: Int,
  fees_asset_class: AssetClass,
}
