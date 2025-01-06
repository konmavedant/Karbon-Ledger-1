import { ValidatorContract, ValidatorMinter } from "@/config/scripts/scripts";
import { useWallet, WalletConnection } from "@/context/walletContext";
import {
    Data,
    fromText,
    mintingPolicyToId,
    paymentCredentialOf,
    TxSignBuilder,
    Validator,
} from "@lucid-evolution/lucid";
import {
    getAddress,
    privateKeytoAddress,
    refUtxo,
} from "@/libs/utils";
import { AssetClass, KarbonDatum } from "@/types/cardano";
import { SIGNER3 } from "@/config/constants";





export async function submit(tx: TxSignBuilder) {
    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    return txHash
}



export async function submitProject(walletConnection: WalletConnection, fileHash: string, category: string, projectTitle: string) {
    const { lucid, address } = walletConnection;
    if (!lucid) throw new Error("Uninitialized Lucid!");
    if (!address) throw new Error("Wallet Not Connected!");

    const validatorContractAddress = getAddress(ValidatorContract);
    const mintingValidator: Validator = ValidatorMinter();

    const policyID = mintingPolicyToId(mintingValidator);
    const projectAssetName = projectTitle;
    const mintedAssets = { [policyID + fromText(projectAssetName)]: 1n };

    const refutxo = await refUtxo(lucid);

    const redeemer = Data.to(0n);

    const assestClass: AssetClass = {
        policyid: "",
        asset_name: fromText(""),
    };

    const datum: KarbonDatum = {
        developer: paymentCredentialOf(address).hash,
        document: fileHash,
        categories: fromText(category),
        asset_name: fromText(projectAssetName),
        fees_amount: 100_000_000n,
        fees_asset_class: assestClass,
    };

    const tx = await lucid
        .newTx()
        .readFrom(refutxo)
        .pay.ToAddressWithData(
            validatorContractAddress,
            { kind: "inline", value: Data.to(datum, KarbonDatum) },
            { lovelace: 5_000_000n, ...mintedAssets }
        )
        .pay.ToAddress(await privateKeytoAddress(SIGNER3), {
            lovelace: 100_000_000n,
        })
        .mintAssets(mintedAssets, redeemer)
        .attach.MintingPolicy(mintingValidator)
        .complete();


    const txHash = await submit(tx);

    console.log("-----------ProjectLister---------");
    console.log("txHash: ", txHash);
    console.log("assetname: ", projectAssetName);
    console.log("policyID+AssetName: ", mintedAssets);
}


