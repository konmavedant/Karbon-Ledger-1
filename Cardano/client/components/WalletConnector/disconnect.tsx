import { Button } from "@nextui-org/button";

import { useWallet } from "@/context/walletContext";

export default function DisconnectButton() {
    const [walletConnection, setWalletConnection] = useWallet();


    function disconnect() {
        setWalletConnection((walletConnection) => {
            return {
                ...walletConnection,
                wallet: undefined,
                address: "",
            };
        });
    }

    return (
        <Button
            className=""
            onPress={disconnect}
        >
            Disconnect
        </Button>
    );
}