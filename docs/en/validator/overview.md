# Basic

## Why BitTorrent-Chain

A variety of decentralized applications, such as decentralized finance, have become core drivers of the TRON network and other smart contract platforms. Meanwhile more types of decentralized applications are being developed in large numbers, but the current blockchain ecosystem is not sufficient to support the demand for large-scale applications. Poor user experience with Dapps, slow block validation, high transaction fees and low scalability are all factors that prevent users from using blockchain applications at scale. The following sections describe how the BitTorrent-Chain will address these issues.

### Slow Transactions

Currently, the most significant disadvantages of POW(Proof-of-Work) based blockchain platforms are low transaction processing speed and limited throughput.

BitTorrent-Chain will solve this problem by using a high-throughput blockchain. A set of block producers will be selected. Proof of Stake will be applied to validate blocks, and proofs of blocks will be periodically sent to TRON main net or other blockchains. This mechanism ensures blocks will be confirmed in an extremely short time.

### Low Throughput

A certain time interval is required between block production in current mainstream blockchain platforms to ensure sufficient time for block propagation. In addition, there is a limit on the block size to ensure fast block propagation in the network, which leads to a limit on the number of transactions in a block.

BitTorrent-Chain solves this problem by using a block producer layer, where block producers are able to produce blocks at a very fast rate.

### Low Scalability

In the future, BitTorrent-Chain can easily access more public chains while using the same decentralized POS layer to increase scalability.

### High Transaction Fees

The BitTorrent-Chain achieves economies of scale by conducting a large number of transactions at the block producer layer, thus reducing costs and ensuring low transaction costs.

## What is a Validator

A Validator (Validator) is a participant in the network who locks tokens into the network and runs the Super Delegate node to help run the network. A Super Delegate has the following responsibilities.

* Pledging the network token and running the Validator node to join the network as a validator
* Receive pledge rewards by verifying state transitions on the blockchain
* Receive penalties for activities such as downtime

A Blockchain Validator is the person responsible for validating transactions within the blockchain, and for BitTorrent-Chain, any participant can qualify as a BitTorrent-Chain Validator by running a full node for rewards and transaction fees. selected, and these selected super-representatives will participate as block producers and validators.

## What is a Delegator

Delegators do not need to host a full node to participate in validation. They can vote BTT tokens to validators and receive a portion of the reward in exchange. Because they share the reward with the super delegate, the delegate also shares the risk. Principals play a crucial role in the system as they can choose the super delegate if they wish.

## PoS, Staking and voting

### Proof of Stake (PoS)

Proof of Stake (PoS) is a class of consensus algorithm for public blockchains that depends on the economic interest of the Validator in the network. In proof-of-work (PoW)-based public blockchains (such as current implementations of Bitcoin and Ether), the algorithm rewards participants who solve cryptographic puzzles to validate transactions and create new blocks (i.e. mining). In a PoS-based public blockchain, a set of super delegates take turns proposing and voting on the next block, with the weight of each Validator vote depending on the size of its deposit (i.e. equity). significant advantages of PoS include security, reduced risk of centralisation and energy efficiency.

For more detailed information, see https://github.com/ethereum/wiki/wiki/Proof-of-Stake-FAQ.

### Staking

Staking is the process of locking tokens into a deposit in order to gain the right to verify and produce blocks on the blockchain. Usually, pledging is done in the network's native token.

### Voting

Voting is the process by which token holders delegate their shares to a Validator. It allows token holders who do not have the skills or desire to run a node to participate in the network and receive a reward proportional to the number of shares voted.
