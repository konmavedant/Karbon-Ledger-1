"use client";
import { ValidatorContract, ValidatorMinter } from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import {
  Constr,
  Data,
  fromText,
  mintingPolicyToId,
  OutRef,
  paymentCredentialOf,
  Validator,
} from "@lucid-evolution/lucid";
import React from "react";
import { Button } from "@/components/ui/button";
import { getAddress, refUtxo } from "@/libs/utils";
import { Project } from "next/dist/build/swc/types";
import { AssetClass, KarbonDatum, KarbonRedeemerSpend } from "@/types/cardano";
import { get } from "http";
import { accountA } from "@/config/emulator";

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
      developer: paymentCredentialOf(address).hash,
      document: fromText("documentHash"),
      categories: fromText("forest"),
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
      .pay.ToAddress(accountA.address, { lovelace: 100_000_000n })//address should be fee address
      .mintAssets(mintedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
  }

  async function projectReject() {
    if (!lucid) throw "Uninitialized Lucid!!!";
    if (!address) throw "Wallet Not Connected";

    const projectAssetName = "ProjectTitle";

    const mintingValidator: Validator = ValidatorMinter();
    const policyID = mintingPolicyToId(mintingValidator);
    const validatorContract = ValidatorContract();
    const validatorContractAddress = getAddress(ValidatorContract)

    const assetUnit = `${policyID}${fromText(projectAssetName)}`;
    const burnedAssets = { [assetUnit]: -1n };
    const utxosValidator = await lucid.utxosAtWithUnit(validatorContractAddress, assetUnit);

    const redeemerValidator: KarbonRedeemerSpend = {
      action: "Reject",
      amount: 0n,
      oref: { transaction_id: utxosValidator[0].txHash, output_index: BigInt(utxosValidator[0].outputIndex) },
    }
    const redeemer = Data.to(1n); // Burn

    console.log(redeemerValidator)
    console.log(Data.to(redeemerValidator, KarbonRedeemerSpend))
    const tx = await lucid
      .newTx()
      .collectFrom(utxosValidator, Data.to(redeemerValidator, KarbonRedeemerSpend))
      .attach.SpendingValidator(validatorContract)
      .mintAssets(burnedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
  }

  return (
    <div className="flex space-x-4">
      <Button onClick={listProject}>List Project</Button>
      <Button onClick={projectReject}>Project Reject</Button>
    </div>
  );
}
