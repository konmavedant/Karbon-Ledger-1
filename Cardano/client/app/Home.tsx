import WalletConnector from "@/components/WalletConnector/client";
import DisconnectButton from "@/components/WalletConnector/disconnect";
import { useWallet } from "@/context/walletContext";

export default function Home() {
  const [walletConnection, setWalletConnection] = useWallet();
  const { address } = walletConnection
  return (
    <div className="space-y-6 mx-auto max-w-2xl flex flex-col min-h-screen items-center">
      {address ?
        <DisconnectButton /> :
        <WalletConnector />
      }
    </div>
  );
}
