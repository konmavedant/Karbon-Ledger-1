import { applyDoubleCborEncoding, applyParamsToScript, Data, Validator } from "@lucid-evolution/lucid";
import {
    identification_nft_identification_nft_mint,
    config_datum_holder_config_datum_holder_spend,
    validator_contract_validator_contract_mint,
    validator_contract_validator_contract_mint_mint

} from "./plutus";

export const identificationPolicyid: Data = "81af3501c07b580374baaf26dd08bc862554869e0d4d9cfff7d04219"
//------------------------------------------------------------------
const identificationNFT_Mint = applyDoubleCborEncoding(
    identification_nft_identification_nft_mint
);


export function IdentificationNFT_MintValidator(params: any[]): Validator {
    return {
        type: "PlutusV3",
        script: applyParamsToScript(identificationNFT_Mint, params),
    }
};

//------------------------------------------------------------------
const configdatumholderscript = applyDoubleCborEncoding(
    config_datum_holder_config_datum_holder_spend
);

export function ConfigDatumHolderValidator(): Validator {
    return {
        type: "PlutusV3",
        script: configdatumholderscript,
    }
};

// --------------------------------------------------------------
const ValidatorContractScript = applyDoubleCborEncoding(
    validator_contract_validator_contract_mint
);
export function ValidatorContract(params: any[]): Validator { //config_nft : PolicyId; validator_contract_mint: PolicyId
    return {
        type: "PlutusV3",
        script: applyParamsToScript(ValidatorContractScript, params),
    }
};


// --------------------------------------------------------------
const ValidatorMinterScript = applyDoubleCborEncoding(
    validator_contract_validator_contract_mint_mint
);
export function ValidatorMinter(params: any[]): Validator { //config_nft : PolicyId;
    return {
        type: "PlutusV3",
        script: applyParamsToScript(ValidatorMinterScript, params),
    }
};