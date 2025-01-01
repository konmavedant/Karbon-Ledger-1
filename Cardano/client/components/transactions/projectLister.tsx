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
import { AssetClass, KarbonDatum } from "@/types/cardano";
import { get } from "http";

export default function ProjectLister() {
  const [WalletConnection] = useWallet();

  const { lucid, address } = WalletConnection;
  async function listProject() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";

    const validatorContractAddress = getAddress(ValidatorContract);
    const mintingValidator: Validator = ValidatorMinter();
    const policyID = mintingPolicyToId(mintingValidator);
    const projectAssetName = "ProjectTitle";
    const mintedAssets = { [policyID + fromText(projectAssetName)]: 1n };
    const refutxo = await refUtxo(lucid);

    const redeemer = Data.to(0n);
    const assestClass: AssetClass = {
      policyid: "",
      asset_name: fromText(""),
    };
    const datum: KarbonDatum = {
      developer: fromText(address),
      document: fromText("documentHash"),
      categories: fromText("forest"),
      asset_name: fromText(projectAssetName),
      fees_amount: 100_000_000n,
      fees_asset_class: assestClass,
    };
    console.log(paymentCredentialOf(validatorContractAddress));
    const tx = await lucid
      .newTx()
      .readFrom(refutxo)
      .pay.ToAddressWithData(
        validatorContractAddress,
        { kind: "inline", value: Data.to(0n) },
        { lovelace: 5_000_000n, ...mintedAssets }
      )
      .pay.ToAddress(address, { lovelace: 100_000_000n })
      .mintAssets(mintedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
  }

  async function delistProect() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";

    const utxos = await lucid.utxosAt(address);
    const projectAssetName = "ProjectTitle";

    const mintingValidator: Validator = ValidatorMinter();
    const policyID = mintingPolicyToId(mintingValidator);
    const assetUnit = `${policyID}${fromText(projectAssetName)}`;
    const burnedAssets = { [assetUnit]: -1n };
    const utxos1 = await lucid.utxosAtWithUnit(address, assetUnit);
    const redeemer = Data.to(1n);

    const tx = await lucid
      .newTx()
      .collectFrom(utxos1)
      .mintAssets(burnedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
  }

  return (
    <>
      <Button onClick={listProject}>List Project</Button>
      <Button onClick={delistProect}>Delist Project</Button>
    </>
  );
}
