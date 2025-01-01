import { NETWORK } from '@/config/lucid';
import { useWallet } from '@/context/walletContext'
import { AssetClass, ConfigDatum, Multisig } from '@/types/cardano';
import { Data, fromText, mintingPolicyToId, paymentCredentialOf, Script, SpendingValidator, Validator, validatorToAddress, validatorToScriptHash } from '@lucid-evolution/lucid';
import React from 'react'
import { Button } from '../ui/button';
import { ConfigDatumHolderValidator, identificationPolicyid, ValidatorContract } from '@/config/scripts/scripts';
import { handleError } from '@/libs/utils';

export default function ConfigDatumHolder() {
    const [WalletConnection] = useWallet()
    const { lucid, address } = WalletConnection

    function getAddress(validatorFunction: { (): Validator; (): Script; }) {
        const validator: Validator = validatorFunction();
        const address = validatorToAddress(NETWORK, validator);
        return address
    }
    function getPolicyId(validatorFunction: { (): Validator; (): Script; }) {
        const validator: Validator = validatorFunction();
        const policyID = mintingPolicyToId(validator);
        return policyID
    }

    async function deposit() {
        if (!lucid || !address) throw "Uninitialized Lucid!!!";
        try {

            const configNFT = { [identificationPolicyid + fromText('KarbonIdentificationNFT')]: 1n };
            const validator: SpendingValidator = ConfigDatumHolderValidator();
            const contractAddress = validatorToAddress(NETWORK, validator);
            const validatorContract: SpendingValidator = ValidatorContract();
            const validatorContractAddress = validatorToAddress(NETWORK, validatorContract);
            console.log('validatorContractAddress', validatorContractAddress)

            const assestClass: AssetClass = {
                policyid: "",
                asset_name: fromText(""),
            }
            const signer: Multisig = {
                required: 1n,
                signers: [
                    paymentCredentialOf(address).hash,
                    paymentCredentialOf(address).hash,
                ],
            }
            const datum: ConfigDatum = {
                fees_address: fromText(address),
                fees_amount: 100_000_000n,
                fees_asset_class: assestClass, // need verification form sourabh
                spend_address: fromText(validatorContractAddress), // need verification form sourabh (how to pass address directly?)
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


