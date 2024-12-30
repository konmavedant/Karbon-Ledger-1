"use client";

import dynamic from "next/dynamic";

const WalletConnectors = dynamic(() => import("@/components/WalletConnector/WalletConnectors"), { ssr: false });

export default function WalletClient() {
  return <WalletConnectors />;
}