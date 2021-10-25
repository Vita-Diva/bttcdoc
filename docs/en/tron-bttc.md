# TRON &lt;-> BTTC

BTTC launched a secure cross-chain bridge capable of connecting the TRON and BTTC networks. Users can freely transfer their tokens to TRON via BTTC via the cross-chain bridge, without having to consider the risks and liquidity constraints imposed by third-party institutions.

BTTC offers a highly efficient, cost-effective, and adaptable expansion solution.

## Token Cross-chain

When tokens are transferred across chains, their total circulation is unaffected.

+ Tokens that leave the TRON network will be locked, and an equivalent number of mapped tokens will be minted on the BTTC network.

+ When tokens are transferred from BTTC to TRON, the tokens on BTTC are destroyed and the corresponding amount of original tokens on TRON are unlocked.

## PoS Bridge

The PoS bridge enables precise asset control, increases deposit and withdrawal speeds, and increases asset flexibility. As a method of asset transfer, it is ideal for decentralized applications (dApps) that need to run across chains.

### Description

Users can freely enter and exit the BTTC ecosystem via the PoS bridge. You can transfer your TRC-20 or TRC-721 tokens between chains efficiently. The PoS bridge can complete the deposit process in as little as 7-8 minutes and the withdrawal process in as little as 30 minutes. The process of token transfer will be discussed in greater detail below.

### Using the PoS Bridge

Prior to introducing the use of PoS bridges, we recommend that you familiarize yourself with the following two concepts to ensure that you can interact with cross-chain bridges smoothly:

+ [Token Mapping](mapping.md)

To begin using a PoS bridge, a token mapping must be established. This asset cannot be transferred between the two chains until the root chain's token contract and the sub-token contract on the sub-chain are mapped. Kindly send us your request for token mapping through email.

After successful mapping, you can interact with the contract via the interface or via various SDKs.

### Token Deposit & Withdraw

Having ERC-20 as an example.

#### Deposit

The Approve ERC20Predicate contract enables it to manage the required token deposits.

On RootChainManager, call depositFor.

#### Withdraw

Destroy BTTC tokens.

To submit the destruction certificate, invoke the exit method on RootChainManager. It must be invoked following the submission of the checkpoint containing this destruction transaction.

### Detailed Process

#### Instantiate Contract

```js
const mainWeb3 = new Web3(mainProvider)
const bttcWeb3 = new Web3(bttcProvider)
const rootTokenContract = new mainWeb3.eth.Contract(rootTokenABI, rootTokenAddress)
const rootChainManagerContract = new mainWeb3.eth.Contract(rootChainManagerABI, rootChainManagerAddress)
const childTokenContract = new bttcWeb3(childTokenABI, childTokenAddress)
```

#### Approve

Approve the contract ERC20Predicate consumption tokens. Approve requires two parameters: address and amount.

```js
await rootTokenContract.methods
  .approve(erc20Predicate, amount)
  .send({ from: userAddress })
```

#### Deposit

Invoke the RootChainManager contract's depositFor method. This method requires three parameters: the user's BTTC address, the root chain address of the token contract, and the deposit amount (in the form of ABI encoding).

Please ensure that the appropriate approval operation has been performed prior to depositing.

```js
const depositData = mainWeb3.eth.abi.encodeParameter('uint256', amount)
await rootChainManagerContract.methods
  .depositFor(userAddress, rootToken, depositData)
  .send({ from: userAddress })
```

#### Burn/Destroy

Call the withdraw method of the child token contract to destroy the tokens on BTTC. This method accepts a single parameter: the quantity of tokens to destroy. The proof of token destruction must be submitted in the subsequent operation, which means that the hash of the token destruction transaction must be stored.

```js
const burnTx = await childTokenContract.methods
  .withdraw(amount)
  .send({ from: userAddress })
const burnTxHash = burnTx.transactionHash
```

#### Exit

To unlock and receive tokens from the ERC20Predicate contract, invoke the RootChainManager contract's exit method. This method accepts a single parameter: the proof of the token's destruction.

Prior to calling this method, you must ensure that the checkpoint containing the destroyed transaction was successfully submitted. The destruction certificate uses RLP encoding rules to generate the following fields:

+ headerNumber: The checkpoint starting block containing the destruction transaction

+ blockProof: Ensure that the block header is the proof of the leaf in the tree where the submitted Merkel root is located

+ blockNumber: contains the block number of the destruction transaction

+ blockTime: contains the block time of the destroyed transaction

+ txRoot: the transaction root of the block

+ receiptRoot: the receipt root of the block

+ receipt: the receipt of the destroyed transaction

+ receiptProof: Merkel root that destroys the transaction receipt

+ branchMask: a 32-bit parameter indicating the position of receipt in the Merkle Patricia Tree

+ receiptLogIndex: log index used to read from receipt

Because manually generating the certificate is inconvenient, we recommend using the BTTC SDK. If you wish to manually send the transaction, set encodeAbi to true to obtain the original call data.

```js
const exitCalldata = await bttcPOSClient
  .exitERC20(burnTxHash, { from, encodeAbi: true })
```

```js
await mainWeb3.eth.sendTransaction({
  from: userAddress,
  to: rootChainManagerAddress,
  data: exitCalldata.data
})
```
