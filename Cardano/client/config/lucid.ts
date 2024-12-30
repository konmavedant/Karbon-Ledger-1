import { Network, Blockfrost, LucidEvolution, Lucid } from "@lucid-evolution/lucid";
import { signal } from "@preact/signals-react";
import { emulator } from "@/config/emulator";

const NETWORK = process.env.NEXT_PUBLIC_CARDANO_NETWORK as Network;
const BF_URL = `${process.env.NEXT_PUBLIC_BF_URL}`;
const BF_PID = `${process.env.NEXT_PUBLIC_BF_PID}`;
export const usingEmulator = process.env.NEXT_PUBLIC_Emulator === "true";
const BLOCKFROST = new Blockfrost(BF_URL, BF_PID);



export const lucidInit = signal<LucidEvolution | undefined>(undefined);
export function initializeLucid() {
    if (usingEmulator) {
        Lucid(emulator, "Custom")
            .then((lucidInstance) => {
                lucidInit.value = lucidInstance; // Updating the signal value
            })
            .catch((error) => {
                console.error("Failed to initialize Lucid:", error);
            })
    } else {
        Lucid(BLOCKFROST, NETWORK)
            .then((lucidInstance) => {
                lucidInit.value = lucidInstance; // Updating the signal value
            })
            .catch((error) => {
                console.error("Failed to initialize Lucid:", error);
            });
    }
}
initializeLucid();
export function callLucid() {
    const lucid = lucidInit.value
    if (!lucid) initializeLucid()
    // if (!lucid) throw "lucid not Initailized"
    return lucid
}




