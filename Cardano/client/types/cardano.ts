import { Constr, Data, TLiteral, WalletApi } from "@lucid-evolution/lucid";
import { Exo } from "next/font/google";

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

//#region Redeemer
// export const CampaignActionRedeemer = {
//   Cancel: Data.to(new Constr(0, [])),
//   Finish: Data.to(new Constr(1, [])),
//   Refund: Data.to(new Constr(2, [])),
// };

// export const IdentificationRedeemerSchema = {
//   Mint: Data.to(new Constr(0, [])),
//   Burn: Data.to(new Constr(1, [])),
// };

export type IdentificationAction = "Mint" | "Burn";

export const IdentificationRedeemerSchema: Record<
  IdentificationAction,
  {
    Title: IdentificationAction;
    Schema: TLiteral<IdentificationAction>;
    Constr: Constr<[]>;
  }
> = {
  Mint: {
    Title: "Mint",
    Schema: Data.Literal("Mint"),
    Constr: new Constr(0, []),
  },
  Burn: {
    Title: "Burn",
    Schema: Data.Literal("Burn"),
    Constr: new Constr(1, []),
  },
};

// export const IdentificationRedeemerSchema = Data.Enum([
//   Data.Literal("Mint"),
//   Data.Literal("Burn"),
// ]);
// export type IdentificationRedeemer = Data.Static<
//   typeof IdentificationRedeemerSchema
// >;
// export const IdentificationRedeemer =
//   IdentificationRedeemerSchema as unknown as IdentificationRedeemer;
// //------------------------------------------------

export const AcceptRedeemerSchema = Data.Enum([
  Data.Literal("Accept"),
  Data.Literal("Reject"),
]);

export type AcceptRedeemer = Data.Static<typeof AcceptRedeemerSchema>;
export const AcceptRedeemer = AcceptRedeemerSchema as unknown as AcceptRedeemer;
//----------------------------------------
export const KarbonRedeemerSpendSchema = Data.Object({
  action: AcceptRedeemerSchema,
  amount: Data.Integer(),
  oref: Data.Bytes(),
});
export type KarbonRedeemerSpend = Data.Static<typeof KarbonRedeemerSpendSchema>;
export const KarbonRedeemerSpend =
  KarbonRedeemerSpendSchema as unknown as KarbonRedeemerSpend;
//----------------------------------------------
export const KarbonRedeemerMintSchema = Data.Object({
  action: Data.Enum([
    IdentificationRedeemerSchema.Mint.Schema,
    IdentificationRedeemerSchema.Burn.Schema,
  ]),
  oref: Data.Bytes(),
  amount: Data.Integer(),
});

export type KarbonRedeemerMint = Data.Static<typeof KarbonRedeemerMintSchema>;
export const KarbonRedeemerMint =
  KarbonRedeemerMintSchema as unknown as KarbonRedeemerMint;
//#endregion

//#region Datum

export const AssetClassSchema = Data.Object({
  policyid: Data.Bytes(),
  asset_name: Data.Bytes(),
});

export type AssetClass = Data.Static<typeof AssetClassSchema>;
export const AssetClass = AssetClassSchema as unknown as AssetClass;
//--------------------------------------------------------
export const Atleast = Data.Integer();

//-----------------------------
export const MultisigSchema = Data.Object({
  required: Atleast,
  signers: Data.Array(Data.Bytes()),
});
export type Multisig = Data.Static<typeof MultisigSchema>;
export const Multisig = MultisigSchema as unknown as Multisig;
//-----------------------------------

export const ConfigDatumSchema = Data.Object({
  fees_address: Data.Bytes(),
  fees_amount: Data.Integer(),
  fees_asset_class: AssetClassSchema,
  spend_address: Data.Bytes(),
  categories: Data.Array(Data.Bytes()),
  multisig_validator_group: MultisigSchema,
  multisig_refutxoupdate: MultisigSchema,
});
export type ConfigDatum = Data.Static<typeof ConfigDatumSchema>;
export const ConfigDatum = ConfigDatumSchema as unknown as ConfigDatum;
//----------------------------------------------------
export const KarbonDatumSchema = Data.Object({
  developer: Data.Bytes(),
  document: Data.Bytes(),
  categories: Data.Bytes(),
  asset_name: Data.Bytes(),
  fees_amount: Data.Integer(),
  fees_asset_class: AssetClassSchema,
});
export type KarbonDatum = Data.Static<typeof KarbonDatumSchema>;
export const KarbonDatum = KarbonDatumSchema as unknown as KarbonDatum;
//----------------------------------------------

///ARIDAY EXPORTS
// export type CampaignState = "Running" | "Cancelled" | "Finished";
// export const CampaignState: Record<
//   CampaignState,
//   { Title: CampaignState; Schema: TLiteral<CampaignState>; Constr: Constr<[]> }
// > = {
//   Running: {
//     Title: "Running",
//     Schema: Data.Literal("Running"),
//     Constr: new Constr(0, []),
//   },
//   Cancelled: {
//     Title: "Cancelled",
//     Schema: Data.Literal("Cancelled"),
//     Constr: new Constr(1, []),
//   },
//   Finished: {
//     Title: "Finished",
//     Schema: Data.Literal("Finished"),
//     Constr: new Constr(2, []),
//   },
// };
// export const CampaignStateSchema = Data.Enum([
//   CampaignState.Running.Schema,
//   CampaignState.Cancelled.Schema,
//   CampaignState.Finished.Schema,
// ]);

// export const IdentificationRedeemerSchema = Data.Enum([
//   Data.Literal("Mint"),
//   Data.Literal("Burn"),
// ]);

// export const KarbonRedeemerMintSchema = Data.Object({
//   action: IdentificationRedeemerSchema,
//   oref: Data.Bytes(),
//   amount: Data.Integer(),
// });
