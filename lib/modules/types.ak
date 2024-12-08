use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address}
use cardano/assets.{AssetName, PolicyId}

pub type AssetClass {
  policy_id: PolicyId,
  asset_name: AssetName,
}

pub type KarbonDatum {
  developer: Address,
  document: ByteArray,
  fees_amount: Int,
  fees_asset_class: AssetClass,
}

pub type Action =
  Int

pub type Atleast =
  Int

pub type ConfigDatum {
  fees_address: Address,
  fees_amount: Int,
  fees_asset_class: AssetClass,
  spend_address: Address,
  multisig_validator_group: (List<VerificationKeyHash>, Atleast),
  multisig_refutxoupdate: (List<VerificationKeyHash>, Atleast),
}
