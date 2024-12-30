import { Data, WalletApi } from "@lucid-evolution/lucid";

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

// Start Region: Redeemer
export const IdentificationRedeemerSchema = Data.Enum([Data.Literal("Mint"), Data.Literal("Burn")])
export type IdentificationRedeemer = Data.Static<typeof IdentificationRedeemerSchema>;
export const IdentificationRedeemer = IdentificationRedeemerSchema as unknown as IdentificationRedeemer;
// End Region