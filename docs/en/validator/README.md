# Overview

BitTorrent-Chain is a blockchain application platform. If you wish to become a validator by setting up a node for BitTorrent-Chain, or to become a delegate to entrust tokens to a validator and receive rewards, you can use this document to get a quick overview of what is involved.

## To Become a Validator

### Architecture

BitTorrent-Chain is a blockchain application platform with an overall structure divided into three layers.

* Root Contracts layer: Root contracts on TRON and other blockchain networks, support for users to map tokens to BitTorrent-Chain by accessing funds, and support for features such as pledges.
* Validator layer: Validates BitTorrent-Chain blocks and regularly sends checkpoints to the supporting TRON and other blockchain networks.

           Bridge: Listens for events on each chain, sends event messages, etc.

           Core: Consensus module, including validation of Checkpoint (snapshot of BitTorrent-Chain state), consensus on Statesync events & Staking events.  

            REST-Server: provides related API services.

* BitTorrent-Chain layer.

### Github Code

BitTorrent-Chain's code base for understanding how the core BitTorrent-Chain components work.

Once you are familiar with the architecture and code base, you can set up your node. Please note that the above documentation is only intended to familiarise you with the inner workings of the polygon, you can set up your nodes directly without familiarising yourself with the specifications above.

### Setting up your node

## To become a Delegator

Delegators are token holders who cannot, or do not want to run a validator themselves. They can delegate staking tokens to a validator and obtain a part of their revenue in exchange. There are no prerequisites to become a principal of BitTorrent-Chain, only a TRON account is required.
