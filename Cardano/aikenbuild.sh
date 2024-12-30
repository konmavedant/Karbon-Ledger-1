aiken build -t verbose
aiken blueprint convert -v identification_nft.identification_nft.mint > ./client/components/compiled/identification_nft.json
aiken blueprint convert -v validator_contract.validator_contract.spend > ./client/components/compiled/validator_contractSpend.json
aiken blueprint convert -v validator_contract.validator_contract.mint > ./client/components/compiled/validator_contractMint.json