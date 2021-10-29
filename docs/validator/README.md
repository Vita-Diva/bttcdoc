# 概述

BitTorrent-Chain 是一个区块链应用平台,如果您希望通过为BitTorrent-Chain设置节点来成validator,或者希望成为委托人以将代币委托给validator并获得奖励，可以通过该文档进行快速了解相关内容。

## 成为validator

## 架构

BitTorrent-Chain 是一个区块链应用平台，整体结构分为三层：

* Root Contracts层：TRON及其他区块链网络上的Root合约，支持用户通过存取款的方式将代币映射到 BitTorrent-Chain，及支持质押等功能。
* Validator层: 验证BitTorrent-Chain区块，定期发送Checkpoint至支持的TRON及其他区块链网络。

    **Bridge**：负责监听各链路事件，发送事件消息等。

    **Core**：共识模块，包括Checkpoint(BitTorrent-Chain链的状态快照)的验证，Statesync事件&Staking事件的共识。  

    **REST-Server**：提供相关API服务。

* BitTorrent-Chain层。

## 代码库

BitTorrent-Chain的代码库，用于了解BitTorrent-Chain 核心组件如何工作。

一旦熟悉了架构和代码库，您就可以设置您的节点。请注意，上面的文档只是为了让您熟悉多边形内部的工作原理，您可以直接设置节点而不熟悉上面的规格。

## 设置你的节点

请参考节点设置[文档](http://doc.bittorrentchain.io/v1/doc/validator/node.html "文档")

## 成为委托人

委托人可以将BTT代币委托给validator，并获得部分收入作为交换。成为BitTorrent-Chain 的委托人没有先决条件，只需要拥有一个TRON账户。
