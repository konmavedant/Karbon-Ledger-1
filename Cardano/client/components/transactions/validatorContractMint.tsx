"use client";
import { ValidatorContract, ValidatorMinter } from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import {
  Constr,
  Data,
  fromText,
  mintingPolicyToId,
  paymentCredentialOf,
  Validator,
} from "@lucid-evolution/lucid";
import React from "react";
import { Button } from "@/components/ui/button";
import { getAddress, refUtxo } from "@/libs/utils";
import { Project } from "next/dist/build/swc/types";
import {
  AssetClass,
  IdentificationRedeemerSchema,
  KarbonDatum,
  KarbonRedeemerMint,
} from "@/types/cardano";
import { get } from "http";

export default function Validator_contract() {
  const [WalletConnection] = useWallet();

  const { lucid, address } = WalletConnection;
  async function validatormint() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";
    //----------minter validtor--------------------
    const validatorContractAddress = getAddress(ValidatorContract);
    const mintingValidator: Validator = ValidatorMinter();
    const policyID = mintingPolicyToId(mintingValidator);
    //------------------------------------------------------
    //-------------------validator contract------------------------------
    const validatorminter: Validator = ValidatorContract();
    const contractPolicyId = mintingPolicyToId(validatorminter);
    //--------------------------------------------------------

    console.log("policyID", policyID);
    console.log("contractPolicyId", contractPolicyId);

    const projectAssetName = "ProjectTitle";
    const mintedAssets = { [policyID + fromText(projectAssetName)]: -1n };
    const refutxo = await refUtxo(lucid);

    const token_name = "water";
    const tokenmintedAssets = {
      [contractPolicyId + fromText(token_name)]: 100n,
    };

    const datum: KarbonRedeemerMint = {
      action: IdentificationRedeemerSchema.Mint,
      oref: fromText("abc"),
      amount: 100n,
    };
    const assestClass: AssetClass = {
      policyid: "",
      asset_name: fromText(""),
    };
    const karbondatum: KarbonDatum = {
      developer: paymentCredentialOf(address).hash,
      document: fromText("documentHash"),
      categories: fromText("forest"),
      asset_name: fromText(projectAssetName),
      fees_amount: 100_000_000n,
      fees_asset_class: assestClass,
    };

    const actionConstr = new Constr(0, []);
    const redeemeraction = Data.to(actionConstr);

    const tx = await lucid
      .newTx()
      .readFrom(refutxo)
      //   .pay.ToAddressWithData(
      //     validatorContractAddress,
      //     { kind: "inline", value: Data.to(0n) },
      //     { lovelace: 5_000_000n, ...mintedAssets }
      //   )
      .pay.ToAddressWithData(
        address,
        { kind: "inline", value: Data.to(karbondatum, KarbonDatum) },
        { lovelace: 100_000_000n, ...tokenmintedAssets }
      )
      .mintAssets(mintedAssets, redeemeraction)
      .mintAssets(tokenmintedAssets, redeemeraction)
      .attach.MintingPolicy(validatorminter)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
  }

  return (
    <>
      <Button onClick={validatormint}>Validator minter</Button>
      {/* <Button onClick={delistProect}>Delist Project</Button> */}
    </>
  );
}
