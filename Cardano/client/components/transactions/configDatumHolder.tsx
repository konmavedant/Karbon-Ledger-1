import { NETWORK } from '@/config/lucid';
import { useWallet } from '@/context/walletContext'
import { AssetClass, ConfigDatum, Multisig } from '@/types/cardano';
import { Data, fromText, paymentCredentialOf, Script, scriptHashToCredential, SpendingValidator, Validator, validatorToAddress, validatorToScriptHash } from '@lucid-evolution/lucid';
import React from 'react'
import { Button } from '../ui/button';
import { ConfigDatumHolderValidator, identificationPolicyid, ValidatorContract } from '@/config/scripts/scripts';
import { handleError, privateKeytoAddress } from '@/libs/utils';
import { accountB, accountC } from '@/config/emulator';

export default function ConfigDatumHolder() {
    const [WalletConnection] = useWallet()
    const { lucid, address } = WalletConnection

    async function deposit() {
        if (!lucid || !address) throw "Uninitialized Lucid!!!";
        try {

            const configNFT = { [identificationPolicyid + fromText('KarbonIdentificationNFT')]: 1n };
            const validator: SpendingValidator = ConfigDatumHolderValidator();
            const contractAddress = validatorToAddress(NETWORK, validator);
            const validatorContract: SpendingValidator = ValidatorContract();
            const validatorContractAddress = validatorToAddress(NETWORK, validatorContract);

            const assestClass: AssetClass = {
                policyid: "",
                asset_name: fromText(""),
            }
            const signer: Multisig = {
                required: 2n,
                signers: [
                    paymentCredentialOf(await privateKeytoAddress(process.env.NEXT_PUBLIC_SIGNER_1 as string)).hash,
                    paymentCredentialOf(await privateKeytoAddress(process.env.NEXT_PUBLIC_SIGNER_2 as string)).hash,
                    paymentCredentialOf(await privateKeytoAddress(process.env.NEXT_PUBLIC_SIGNER_3 as string)).hash,
                ],
            }
            // scriptHashToCredential
            console.log("validatorhash", paymentCredentialOf(validatorContractAddress).hash)
            const datum: ConfigDatum = {
                fees_address: paymentCredentialOf(address).hash,
                fees_amount: 100_000_000n,
                fees_asset_class: assestClass, // need verification form sourabh
                spend_address: paymentCredentialOf(validatorContractAddress).hash, // need verification form sourabh (how to pass address directly?)
                categories: [fromText("forest"), fromText("water")],
                multisig_validator_group: signer,
                multisig_refutxoupdate: signer,
            };
            const tx = await lucid
                .newTx()
                .pay.ToAddressWithData(
                    contractAddress,
                    { kind: "inline", value: Data.to(datum, ConfigDatum) },
                    { lovelace: 5_000_000n, ...configNFT }
                )
                .complete();


            const signed = await tx.sign.withWallet().complete();
            const txHash = await signed.submit();
            console.log("txHash: ", txHash);
        } catch (error) {
            handleError(error);
        }
    }

    return (
        <div className='flex gap-4'>
            <Button onClick={deposit}>send configDatum</Button>
            <Button disabled>modify configDatum</Button>
        </div>
    )
}


