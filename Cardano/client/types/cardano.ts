import { WalletApi } from "@lucid-evolution/lucid";

/**
 * Wallet type definition
 */
export type Wallet = {
    name: string;
    icon: string;
    apiVersion: string;
    enable(): Promise<WalletApi>;
    isEnabled(): Promise<boolean>;
};
