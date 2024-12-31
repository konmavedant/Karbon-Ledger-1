"use client";
import { ValidatorContract } from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import {
  Constr,
  Data,
  fromText,
  mintingPolicyToId,
  Validator,
} from "@lucid-evolution/lucid";
import React from "react";
import { Button } from "@/components/ui/button";

export default function Identification() {
  const [WalletConnection] = useWallet();

  const { lucid, address } = WalletConnection;
  async function mint() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";

    const utxos = await lucid.utxosAt(address);

    const orefHash = String(utxos[0].txHash);
    const orefIndex = BigInt(utxos[0].outputIndex);
    const oref = new Constr(0, [orefHash, orefIndex]);

    const mintingValidator: Validator = ValidatorContract([oref]);
    const policyID = mintingPolicyToId(mintingValidator);
    const ref_assetName = "KarbonIdentificationNFT";
    const mintedAssets = { [policyID + fromText(ref_assetName)]: 1n };
    const redeemer = Data.void();
    const tx = await lucid
      .newTx()
      .mintAssets(mintedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
  }

  return <Button onClick={mint}>mint</Button>;
}
