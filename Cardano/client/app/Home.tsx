import ConfigDatumHolder from "@/components/transactions/configDatumHolder";
import Identification from "@/components/transactions/identificationnft";
import ProjectLister from "@/components/transactions/projectLister";
import WalletConnector from "@/components/WalletConnector/client";
import DisconnectButton from "@/components/WalletConnector/disconnect";
import EmulatorConnector from "@/components/WalletConnector/emulatorClient";
import { useWallet } from "@/context/walletContext";

export default function Home() {
  const [walletConnection, setWalletConnection] = useWallet();
  const { address } = walletConnection

  if (!address) {
    return (
      <div className="space-y-6 mx-auto max-w-2xl flex flex-col min-h-screen items-center">
        {/* <WalletConnector /> */}
        <EmulatorConnector />
      </div>
    )
  }
  return (
    <div className="space-y-6 mx-auto max-w-2xl flex flex-col min-h-screen items-center">
      <DisconnectButton />
      <Identification />
      <ConfigDatumHolder />
      <ProjectLister />
    </div>
  );
}
