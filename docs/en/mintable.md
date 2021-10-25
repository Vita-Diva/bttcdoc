# Mintable Token

Through the PoS bridge, assets can be transferred between the public blockchain and BTTC, and the majority of assets must be pre-stored on the public blockchain. Another possibility is to create tokens directly on the BTTC blockchain and then transfer them to the public blockchain as required. In comparison to public blockchains, issuing tokens on BTTC is less expensive and faster. These are referred to as BTTC mintable assets.

When BTTC's mintable assets are transferred to the public blockchain, the token must first be destroyed on the BTTC and proof of destruction submitted to the public blockchain. Internally, the `RootChainManager` contract invokes a special contract that can directly invoke the public blockchain's token minting method and mint the tokens to the user address. `MintableAssetPredicate` is the name of this special contract.

## Requirement

You can either manually deploy mintable tokens on BTTC or submit a mapping request that will automatically deploy mintable token contracts on BTTC.

If you intend to deploy the contract manually, here are some sample contract code. You may modify these examples, but you must ensure that the contract includes the `deposit`, `withdraw`, and `mint` functions.

### Contracts on Public Blockchain

The critical point is that when the token contract is deployed on the public blockchain, it must specify the `MintableAssetProxy` contract as the mint. On the public blockchain, only the `MintableAssetPredicate` contract has the authority to mint coins.

This role can be granted by invoking the root chain's token contract's `grantRole` method. The first parameter is the constant value for `PREDICATE_ROLE,` i.e. `0x12ff340d0cd9c652c747ca35727e68c547d0f0bfa7758d2e77f75acef481b4f2`, and the second parameter is the contract address for the corresponding `Predicate` contract:

