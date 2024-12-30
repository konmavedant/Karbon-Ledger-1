import { Address, applyDoubleCborEncoding, applyParamsToScript, paymentCredentialOf, SpendingValidator } from "@lucid-evolution/lucid"
import alwaysTrueSpend from "./spend.json" with {type: "json"}






const spendingScript = applyDoubleCborEncoding(alwaysTrueSpend.cborHex)
export const spendingValidator: SpendingValidator = {
    script: spendingScript,
    type: "PlutusV3"
}

// =====================for scripts with params=========================
// export function nameofValidatorWithParams(params: string[]): SpendingValidator {
//     const spendingScriptWithParams = applyParamsToScript(
//         spendingScript,
//         params
//     );

//     return {
//         type: "PlutusV3",
//         script: spendingScriptWithParams,
//     };
// }

// // example usage
// // const pkh = paymentCredentialOf("addr_test1...").hash; // PKH
// // const deadline = "17204775965"; // Example deadline
// // const validatorWithParams = nameofValidatorWithParams([pkh, deadline]);

