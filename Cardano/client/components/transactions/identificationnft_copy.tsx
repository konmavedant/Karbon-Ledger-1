"use client";
import { IdentificationNFT_MintValidator } from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import {
  Constr,
  Data,
  fromText,
  mintingPolicyToId,
  Validator,
  TxSignBuilder,
} from "@lucid-evolution/lucid";
import React from "react";
import { Button } from "@/components/ui/button";
import { IdentificationRedeemer } from "@/types/cardano";
import { emulator } from "@/config/emulator";

export default function Identification() {
  const [WalletConnection] = useWallet();
  const { lucid, address } = WalletConnection;

  async function submitTx(tx: TxSignBuilder) {
    const signedTx = await tx.sign.withWallet().complete();
    const txHash = await signedTx.submit();

    // Emulator integration
    emulator.awaitTx(txHash);
    emulator.log();

    return txHash;
  }

  async function mint() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";

    try {
      const utxos = await lucid.utxosAt(address);

      const orefHash = String(utxos[0].txHash);
      const orefIndex = BigInt(utxos[0].outputIndex);
      const oref = new Constr(0, [orefHash, orefIndex]);

      const mintingValidator: Validator = IdentificationNFT_MintValidator([
        oref,
      ]);
      const policyID = mintingPolicyToId(mintingValidator);
      const ref_assetName = "KarbonIdentificationNFT";
      const mintedAssets = { [policyID + fromText(ref_assetName)]: 1n };

      const mint = new Constr(0, []);
      const redeemer = Data.to(mint);

      console.log("Policy ID:", policyID);

      const tx = await lucid
        .newTx()
        .collectFrom([utxos[0]])
        .mintAssets(mintedAssets, redeemer)
        .attach.MintingPolicy(mintingValidator)
        .complete();

      const txHash = await submitTx(tx);
      console.log("Mint Tx Hash:", txHash);
    } catch (error) {
      console.error("Mint Error:", error);
    }
  }

  async function burn() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";

    try {
      const utxos = await lucid.utxosAt(address);
      const ref_assetName = "KarbonIdentificationNFT";

      const oref = utxos.filter((utxo) => {
        const assets = utxo.assets;
        return Object.keys(assets).includes(ref_assetName);
      });

      if (!oref.length) throw "NFT not found in wallet.";

      const mintingValidator: Validator = IdentificationNFT_MintValidator([
        oref,
      ]);
      const policyID = mintingPolicyToId(mintingValidator);
      const assetUnit = `${policyID}${fromText(ref_assetName)}`;
      const burnedAssets = { [assetUnit]: -1n };

      const utxosWithUnit = await lucid.utxosAtWithUnit(address, assetUnit);

      const mint = new Constr(1, []);
      const redeemer = Data.to(mint);

      console.log("Policy ID:", policyID);

      const tx = await lucid
        .newTx()
        .collectFrom(utxosWithUnit)
        .mintAssets(burnedAssets, redeemer)
        .attach.MintingPolicy(mintingValidator)
        .complete();

      const txHash = await submitTx(tx);
      console.log("Burn Tx Hash:", txHash);
    } catch (error) {
      console.error("Burn Error:", error);
    }
  }

  return (
    <div className="flex gap-4">
      <Button onClick={mint}>mint</Button>
      <Button onClick={burn}>burn</Button>
    </div>
  );
}
