use cardano/transaction.{Transaction}
// Incomplete
use modules/functions
use modules/types.{ConfigDatum}

validator config_datum_holder {
  spend(datum: Option<ConfigDatum>, _redeemer, _oref, tx: Transaction) {
    expect Some(datum) = datum
    let Transaction { extra_signatories, .. } = tx
    // must be true when atleast_signedby from datum value
    functions.atleast_signedby(extra_signatories, datum.multisig_refutxoupdate)
  }

  else(_) {
    fail
  }
}
