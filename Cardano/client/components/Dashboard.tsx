import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Data, TxSignBuilder, validatorToAddress } from "@lucid-evolution/lucid";
import { spendingValidator } from "@/components/compiled/Validators";
import { callLucid, usingEmulator } from "@/config/lucid";
import { emulator } from "@/config/emulator";

export default function Dashboard(props: {
  setActionResult: (result: string) => void;
  onError: (error: any) => void;
}) {
  const { setActionResult, onError } = props;
  const lucid = callLucid()
  async function submitTx(tx: TxSignBuilder) {
    const txSigned = await tx.sign.withWallet().complete();
    const txHash = await txSigned.submit();

    if (usingEmulator) {
      emulator.awaitTx(txHash)
      emulator.log()
    }

    return txHash;
  }

  type Action = () => Promise<void>;
  type ActionGroup = Record<string, Action>;

  const actions: Record<string, ActionGroup> = {
    AlwaysTrue: {
      deposit: async () => {
  const lucid = callLucid()

        if (!lucid) throw ("lucid not Initailized")
        try {
          const validatorAddress = validatorToAddress(lucid.config().network, spendingValidator);
          const datum = Data.void();

          const tx = await lucid
            .newTx()
            .pay.ToAddressWithData(
              validatorAddress,
              { kind: "inline", value: datum },
              { lovelace: 10_000_000n }
            )
            .complete();

          submitTx(tx).then(setActionResult).catch(onError);
        } catch (error) {
          onError(error);
        }
      },

      withdrawal: async () => {
  const lucid = callLucid()

        if (!lucid) throw "lucid not Initailized"
        try {
          const validatorAddress = validatorToAddress(lucid.config().network, spendingValidator);
          const allUTxOs = await lucid.utxosAt(validatorAddress);

          const redeemer = Data.void();

          const tx = await lucid
            .newTx()
            .collectFrom(allUTxOs, redeemer)
            .attach.SpendingValidator(spendingValidator)
            .complete();

          submitTx(tx).then(setActionResult).catch(onError);
        } catch (error) {
          onError(error);
        }
      },
    },
  };


  return (
    <div className="flex flex-col gap-2 py-2">
      <Accordion variant="splitted">
        {/* Always True */}
        <AccordionItem key="1" aria-label="Accordion 1" title="Always True">
          <div className="flex flex-wrap gap-2 mb-2">
            <Button className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg capitalize" radius="full" onClick={actions.AlwaysTrue.deposit}>
              deposit
            </Button>
            <Button className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg capitalize" radius="full" onClick={actions.AlwaysTrue.withdrawal}>
              withdrawal
            </Button>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}