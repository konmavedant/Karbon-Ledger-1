"use client";
import { ValidatorContract, ValidatorMinter } from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import {
  Constr,
  Data,
  fromText,
  generatePrivateKey,
  mintingPolicyToId,
  OutRef,
  paymentCredentialOf,
  TxSignBuilder,
  Validator,
} from "@lucid-evolution/lucid";
import React from "react";
import { Button } from "@/components/ui/button";
import { getAddress, refUtxo } from "@/libs/utils";
import { Project } from "next/dist/build/swc/types";
import { AssetClass, KarbonDatum, KarbonRedeemerSpend } from "@/types/cardano";
import { get } from "http";
import { accountA, accountC, accountD } from "@/config/emulator";

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
      .pay.ToAddress(accountA.address, { lovelace: 100_000_000n }) //address should be fee address
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
    const refutxo = await refUtxo(lucid);


    const redeemerValidator: KarbonRedeemerSpend = {
      action: "Reject",
      amount: 0n,
      oref: { transaction_id: utxosValidator[0].txHash, output_index: BigInt(utxosValidator[0].outputIndex) },
    }
    const redeemer = Data.to(1n); // Burn

    const tx = await lucid
      .newTx()
      .readFrom(refutxo)
      .collectFrom(utxosValidator, Data.to(redeemerValidator, KarbonRedeemerSpend))
      .attach.SpendingValidator(validatorContract)
      .mintAssets(burnedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .addSigner("addr_test1vzuutq4g88kqshaexh8y06pmasz6njjf7nnadlau9hqyd9ce9yug6")
      .complete();

    lucid.selectWallet.fromSeed(accountC.seedPhrase);
    // const signed = await tx.sign.withWallet().complete();
    // const signed = await tx.sign.withWallet();

    const signedd = await signBY(tx)
    const txHash = await signedd.submit();
    console.log("txHash: ", txHash);

  }

  async function signBY(tx: TxSignBuilder) {
    const p1 = "ed25519_sk1c8k4pg4xrhhzks2vtjhp6ur5v7dle8j9h0uk4aafxuy3ryezalqq4h7efx"
    const a1 = "addr_test1vzuutq4g88kqshaexh8y06pmasz6njjf7nnadlau9hqyd9ce9yug6"
    const p2 = "ed25519_sk1x00twfzxx355x8wchng0k94aamf4sgjhjj7k9y3qm0sxwg972c8qfq8wkm"
    const a2 = "addr_test1vr4wvwxytjnp4c569es5a3yethaxxf2y3j5kxyw30hv978q2xmcx2"
    if (!lucid) throw "Uninitialized Lucid!!!";
    lucid.selectWallet.fromPrivateKey(p1)
    const signed = await tx.sign.withPrivateKey(p1).complete();
    // const signed = await tx.sign.withWallet().complete();
    return signed
  }

  return (
    <div className="flex space-x-4">
      <Button onClick={listProject}>List Project</Button>
      <Button onClick={projectReject}>Project Reject</Button>
    </div>
  );
}
