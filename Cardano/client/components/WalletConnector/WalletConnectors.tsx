"use client"
import { useEffect, useMemo, useState } from "react";
import { Wallet } from "@/types/cardano";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, cn, DropdownSection } from "@nextui-org/react";
import { Address, Blockfrost, EmulatorAccount, Lucid, Network } from "@lucid-evolution/lucid";
import { initializeLucid, callLucid } from "@/config/lucid";
import { accountA, accountB, accountC, accountD } from "@/config/emulator";

export default function WalletConnectors() {
  const lucid = callLucid()
  const [wallets, setWallets] = useState<Wallet[]>();
  const [selectedwallet, setSelectedWallet] = useState<Wallet | undefined>();
  const [balance, setBalance] = useState<Number>();
  const [emulatorAddress, setEmulatorAddress] = useState<Address>();
  const [emulatoraccounts, setEmulatoraccounts] = useState({
    accountA: accountA,
    accountB: accountB,
    accountC: accountC,
    accountD: accountD,
  });

  useEffect(() => {
    const wallets: Wallet[] = [];

    const { cardano } = window;

    for (const c in cardano) {
      const wallet = cardano[c];

      if (!wallet.apiVersion) continue; // skip
      wallets.push(wallet);
    }

    wallets.sort((l: Wallet, r: Wallet) => {
      return l.name.toUpperCase() < r.name.toUpperCase() ? -1 : 1;
    });
    setWallets(wallets);
  }, []);

  async function onWalletConnect(wallet: Wallet) {
    setSelectedWallet(wallet)
    const lucid = callLucid()

    try {
      if (!lucid) throw "Uninitialized Lucid";

      const api = await wallet.enable();
      lucid.selectWallet.fromAPI(api);

      const address = await lucid.wallet().address();
      const utxos = await lucid.utxosAt(address);
      const totalLovelace = utxos.reduce((sum, utxo) => {
        return sum + (utxo.assets.lovelace || 0n);
      }, 0n);
      setBalance(Number(totalLovelace / 1_000_000n));
    } catch (error) {
      console.log(error);
    }
  }

  function onWalletDisconnect() {
    initializeLucid()
    setBalance(undefined)
    setSelectedWallet(undefined);
  }

  async function selectEmulatorWallet(account: EmulatorAccount) {
    if (!lucid) throw "lucid not initialized"
    lucid.selectWallet.fromSeed(account.seedPhrase);
    const address = await lucid.wallet().address();
    const utxos = await lucid?.utxosAt(address);
    const totalLovelace = utxos.reduce((sum, utxo) => {
      return sum + (utxo.assets.lovelace || 0n);
    }, 0n);
    setEmulatorAddress(address)
    setBalance(Number(totalLovelace / 1_000_000n));
  }



  return (
    <div className="flex flex-wrap gap-2">


      <Dropdown
        showArrow
        classNames={{
          base: "before:bg-default-200 ", // change arrow background
          content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
        }}
      >
        <DropdownTrigger className="rounded-small">
          <Button
            variant="bordered"
            className="text-sm font-normal text-default-600 bg-default-100"
            startContent={selectedwallet && <img className="w-6" src={selectedwallet.icon} alt="X" />}
          >
            {selectedwallet ? (
              balance ? (<>₳ {balance.toFixed(2)} </>) : "Connecting..."
            ) :
              emulatorAddress ? <> {emulatorAddress.slice(0, 15)}...{emulatorAddress.slice(-3)}</> : "Connect Wallet"}
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Wallet connector dropdown menu">
          <DropdownSection>
            {lucid?.config().network === "Custom" ?
              Object.entries(emulatoraccounts).map(([key, account]) => (
                <DropdownItem
                  key={key}
                  classNames={{
                    base: "rounded-small text-center flex justify-center items-center",
                  }}
                  onClick={() => selectEmulatorWallet(account)}
                  description={`${account.address.slice(0, 15)}...${account.address.slice(-3)}`}
                >
                  {key}
                </DropdownItem>
              ))
              :

              !wallets ?
                <DropdownItem
                  key="0"
                  classNames={{
                    base: "rounded-small text-center flex justify-center items-center",
                  }}
                >
                  <>Browsing Cardano Wallet</>
                </DropdownItem>
                : (
                  !wallets.length ?
                    <DropdownItem
                      key="0"
                      classNames={{
                        base: "rounded-small text-center flex justify-center items-center",
                      }}
                    >
                      <>No Cardano Wallets</>
                    </DropdownItem>
                    : (
                      !selectedwallet ?
                        wallets.map((wallet, w) => (
                          <DropdownItem
                            key={`wallet.${w}`}
                            classNames={{
                              base: "rounded-small space-x-2", // change arrow background
                            }}
                            startContent={<img className="w-6" src={wallet.icon} alt="X" />}
                            showDivider={w !== wallets.length - 1}
                            onClick={() => {
                              onWalletConnect(wallet)
                            }}
                          >
                            {(wallet.name).toUpperCase()}
                          </DropdownItem>
                        ))
                        :
                        <DropdownItem
                          key="0"
                          classNames={{
                            base: "rounded-small space-x-2",
                          }}
                          startContent={<img className="w-6" src={selectedwallet.icon} alt="X" />}
                          onClick={onWalletDisconnect}
                        >
                          Disconnect
                        </DropdownItem>

                    )
                )


            }

          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
