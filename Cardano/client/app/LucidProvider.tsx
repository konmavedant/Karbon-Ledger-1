'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { Address, Blockfrost, Lucid, LucidEvolution, Network } from "@lucid-evolution/lucid";
import { Wallet } from "@/types/cardano";

interface LucidContextType {
  lucid: LucidEvolution | undefined;
  address: Address;
  balance: number | undefined;
  result: string;
  // onConnectWallet: (wallet: Wallet) => Promise<void>;
  resetLucid: () => void;
}

const LucidContext = createContext<LucidContextType | undefined>(undefined);

const BF_URL = process.env.NEXT_PUBLIC_BF_URL!;
const BF_PID = process.env.NEXT_PUBLIC_BF_PID!;
const NETWORK = process.env.NEXT_PUBLIC_CARDANO_NETWORK as Network;

export const LucidProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lucid, setLucid] = useState<LucidEvolution>();
  const [address, setAddress] = useState<Address>("");
  const [balance, setBalance] = useState<number>();
  const [result, setResult] = useState("");

  useEffect(() => {
    if (!BF_URL || !BF_PID || !NETWORK) {
      setResult("Missing environment variables for Blockfrost or network.");
      return;
    }

    const blockfrost = new Blockfrost(BF_URL, BF_PID);
    Lucid(blockfrost, NETWORK).then(setLucid).catch(handleError);
  }, []);

  function resetLucid() {
    setLucid(undefined);
    setBalance(undefined);
    setAddress("");
    const blockfrost = new Blockfrost(BF_URL, BF_PID);
    Lucid(blockfrost, NETWORK).then(setLucid).catch(handleError);
  }

  function handleError(error: any) {
    const { info, message } = error;

    function toJSON(error: any) {
      try {
        return JSON.parse(JSON.stringify(error));
      } catch {
        return {};
      }
    }

    const { cause } = toJSON(error);
    const { failure } = cause ?? {};
    const failureMessage = failure?.cause?.message;

    setResult(`${failureMessage ?? info ?? message ?? error}`);
    console.error(failure ?? { error });
  }

  // async function onConnectWallet(wallet: Wallet) {
  //   try {
  //     if (!lucid) throw new Error("Uninitialized Lucid");

  //     const api = await wallet.enable();
  //     lucid.selectWallet.fromAPI(api);

  //     const walletAddress = await lucid.wallet().address();
  //     const utxos = await lucid.utxosAt(walletAddress);
  //     const totalLovelace = utxos.reduce((sum, utxo) => sum + (utxo.assets.lovelace || 0n), 0n);

  //     setBalance(Number(totalLovelace / 1_000_000n));
  //     setAddress(walletAddress);
  //   } catch (error) {
  //     handleError(error);
  //   }
  // }

  return (
    <LucidContext.Provider value={{ lucid, address, balance, result, resetLucid }}>
      {children}
    </LucidContext.Provider>
  );
};

export const useLucid = () => {
  const context = useContext(LucidContext);
  if (!context) throw new Error("useLucid must be used within a LucidProvider");
  return context;
};
