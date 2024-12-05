use cardano/address.{from_script, from_verification_key}
use cardano/assets
use cardano/transaction.{OutputReference}
use modules/types.{ConfigDatum, ScriptDatum}

pub const output_reference =
  OutputReference(
    #"0000000000000000000000000000000000000000000000000000000000000064",
    0,
  )

pub const address1 =
  from_verification_key(
    #"00000000000000000000000000000000000000000000000000000056",
  )

pub const token_policyid = "karbon_policy"

pub const token_name = assets.from_asset(token_policyid, "KARBON_TOKEN", 1)

pub const in_datum =
  ScriptDatum {
    developer: from_script(
      #"00000000000000000000000000000000000000000000000000000056",
    ),
    document: #"00000000000000000000000000000000000000000000000000000000",
    fees: 0,
  }

pub const confi_d =
  ConfigDatum {
    fees_address: from_verification_key(
      #"00000000000000000000000000000000000000000000000000000056",
    ),
    fees: 2_000_000,
    spend_address: from_script(
      #"00000000000000000000000000000000000000000000000000000001",
    ),
  }
