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
import { getAddress, multiSignwithPrivateKey, privateKeytoAddress, refUtxo } from "@/libs/utils";
import { AssetClass, KarbonDatum, KarbonRedeemerMint, KarbonRedeemerSpend } from "@/types/cardano";

export default function ProjectLister() {
  const [WalletConnection] = useWallet();
  const { lucid, address } = WalletConnection;

  let signer1 = process.env.NEXT_PUBLIC_SIGNER_1 as string;
  let signer2 = process.env.NEXT_PUBLIC_SIGNER_2 as string;
  let signer3 = process.env.NEXT_PUBLIC_SIGNER_3 as string;
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
      .pay.ToAddress(await privateKeytoAddress(signer3), { lovelace: 100_000_000n }) //address should be fee address
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
      .addSigner(await privateKeytoAddress(signer1))
      .addSigner(await privateKeytoAddress(signer2))
      .complete();

    const signed = await multiSignwithPrivateKey(tx, [signer1, signer2])
    const signedd = await signed.sign.withWallet().complete();
    const txHash = await signedd.submit();
    console.log("txHash: ", txHash);
  }


  async function ProjectAccept() {
    if (!lucid) throw "Uninitialized Lucid!!!";
    if (!address) throw "Wallet Not Connected";

    const projectAssetName = "ProjectTitle";

    const mintingValidator: Validator = ValidatorMinter();
    const policyIDMinter = mintingPolicyToId(mintingValidator);

    const validatorContract = ValidatorContract();
    const validatorContractAddress = getAddress(ValidatorContract)
    const policyIDCarbon = mintingPolicyToId(validatorContract);

    const assetUnit = `${policyIDMinter}${fromText(projectAssetName)}`;
    const burnedAssets = { [assetUnit]: -1n };

    // const carbonAssetUnit = `${policyIDCarbon}${fromText(projectAssetName)}`;
    const carbonMintAssets = { [policyIDCarbon + fromText(projectAssetName)]: 1n };


    const utxosValidator = await lucid.utxosAtWithUnit(validatorContractAddress, assetUnit);
    const refutxo = await refUtxo(lucid);


    const redeemer = {
      amount: 100n,
      oref: { transaction_id: utxosValidator[0].txHash, output_index: BigInt(utxosValidator[0].outputIndex) },
    }
    const redeemerValidatorSpend: KarbonRedeemerSpend = {
      action: "Accept",
      ...redeemer
    }
    const redeemerValidatorMint: KarbonRedeemerMint = {
      action: "Mint",
      ...redeemer
    }
    const validatorMinterRedeemer = Data.to(1n); // Burn

    // mint carbon tokens
    // minted token to developer
    // DONE: burn validatorMinter NFT
    // DONE: multisig sign
    // DONE: mintredeemer.action = Mint
    // DONE: mintredeemer.oref = utxo from script
    // DONE: spendredeemer.action = Mint
    // DONE: spendredeemer.oref = utxo from script
    const tx = await lucid
      .newTx()
      .readFrom(refutxo) // correct
      .collectFrom(utxosValidator, Data.to(redeemerValidatorSpend, KarbonRedeemerSpend))
      // .pay.ToAddress(address, { ...carbonMintAssets, lovelace: 100n })
      .attach.SpendingValidator(validatorContract) //correct
      // .mintAssets(carbonMintAssets, Data.to(redeemerValidatorMint, KarbonRedeemerMint))
      .attach.MintingPolicy(validatorContract) //correct
      .mintAssets(burnedAssets, validatorMinterRedeemer) //correct
      .attach.MintingPolicy(mintingValidator) //correct
      .addSigner(await privateKeytoAddress(signer1)) //correct
      .addSigner(await privateKeytoAddress(signer2)) //correct
      .complete();

    const signed = await multiSignwithPrivateKey(tx, [signer1, signer2])
    const signedd = await signed.sign.withWallet().complete();
    const txHash = await signedd.submit();
    console.log("txHash: ", txHash);

    const oRef = new Constr(0, [String(utxosValidator[0].txHash), BigInt(utxosValidator[0].outputIndex)]);
    const oRefCBOR = Data.to(oRef);

    // const assetName = blake2bHex(fromHex(oRefCBOR), undefined, 32);


  }
  return (
    <div className="flex space-x-4">
      <Button onClick={listProject}>List Project</Button>
      <Button onClick={projectReject}>Project Reject</Button>
      <Button onClick={ProjectAccept}>Project Accept</Button>
    </div>
  );
}
