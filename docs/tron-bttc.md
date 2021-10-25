# TRON &lt;-> BTTC

BTTC引入了一条可靠的，能够连通TRON与BTTC网络的跨链桥。通过跨链桥，用户可以随意通过BTTC来转移自己的代币到TRON上，并且无需考虑第三方机构带来的风险以及流动性限制。

BTTC提供了一种极其高效、低成本并且灵活的扩展方案。

## 代币跨链

当代币通过跨链桥传递时，它的总流通量不会被影响

+ 离开TRON的代币会被锁定，同时在BTTC网络上铸造与其等量的映射代币。

+ 将代币从BTTC转回TRON时，BTTC上的代币将被销毁，同时将解锁TRON上的等量原始代币。

## PoS桥

PoS桥能实现对资产的精确控制、提高存取款速度，并且增强资产的灵活性。作为一种资产转移的方式，它非常适合需要跨链运行的dApp。

### 简介

PoS桥能让用户自由的出入BTTC的生态系统。您可以高效的在链间转移您的TRC-20或者TRC-721代币。PoS桥能够在7-8分钟内完成存款，并在30分钟内完成提款过程。下文将介绍代币转移的流程。

### 使用PoS桥

开始介绍PoS桥的使用之前，我们建议您先了解下面两个概念，以和跨链桥顺利交互：

+ [代币映射](mapping.md)

使用PoS桥的第一步是建立代币映射。只有根链上的代币合约与子链上的子代币合约建立映射之后，才能在两条链之间转移这种资产。请发送邮件提交映射请求。

成功映射后，可以使用各种SDK，或直接通过接口与合约进行交互。

## 代币充提

### 流程简述

此处以ERC-20为例。

#### 充值

1. Approve ERC20Predicate合约，允许它控制需要被存入的代币。

2. 在RootChainManager上调用depositFor。

#### 提取

1. 在BTTC上销毁代币。

2. 在RootChainManager上调用exit方法，以提交销毁证明。需要在包含此销毁交易的checkpoint提交之后调用。

### 详细流程

#### 实例化合约

```js
const mainWeb3 = new Web3(mainProvider)
const bttcWeb3 = new Web3(bttcProvider)
const rootTokenContract = new mainWeb3.eth.Contract(rootTokenABI, rootTokenAddress)
const rootChainManagerContract = new mainWeb3.eth.Contract(rootChainManagerABI, rootChainManagerAddress)
const childTokenContract = new bttcWeb3(childTokenABI, childTokenAddress)
```

#### Approve

批准合约ERC20Predicate消费代币。approve需要两个参数：地址和金额。

```js
await rootTokenContract.methods
  .approve(erc20Predicate, amount)
  .send({ from: userAddress })
```

#### 存款

调用RootChainManager合约的depositFor方法。这个方法需要接收三个参数：BTTC上接收存款的用户地址，代币合约在根链上的地址以及金额（以ABI编码形式体现）。

请在存款之前，确保已经进行过正确的approve操作。

```js
const depositData = mainWeb3.eth.abi.encodeParameter('uint256', amount)
await rootChainManagerContract.methods
  .depositFor(userAddress, rootToken, depositData)
  .send({ from: userAddress })
```

#### 燃烧/销毁

通过调用子代币合约的withdraw方法来销毁BTTC上的代币。这个方法接收一个参数：要销毁的代币数量。销毁代币的证明需要在下一步操作中提交，因此要储存销毁交易的哈希。

```js
const burnTx = await childTokenContract.methods
  .withdraw(amount)
  .send({ from: userAddress })
const burnTxHash = burnTx.transactionHash
```

#### 退出

调用RootChainManager合约的exit方法来解锁并从ERC20Predicate合约接收代币。这个方法接收一个参数：代币的销毁证明。

调用这个方法之前必须要等待包含销毁交易的checkpoint提交成功。销毁证明由RLP编码生成如下字段：

+ headerNumber：包含销毁交易的checkpoint起始块
+ blockProof：确保区块头是提交的默克尔根所在树中叶子的证明
+ blockNumber：包含销毁交易的区块号
+ blockTime：包含销毁交易的区块时间
+ txRoot：区块的交易根
+ receiptRoot：区块的receipt root
+ receipt：销毁交易的receipt
+ receiptProof：销毁交易receipt的默克尔根
+ branchMask：表示receipt在Merkle Patricia Tree中位置的一个32位参数
+ receiptLogIndex：用于从receipt中读取的日志索引

手动生成证明很复杂，因此我们建议使用BTTC SDK。如果您想手动发送交易，请将encodeAbi置为true以获取原始调用数据。

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
