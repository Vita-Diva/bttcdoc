# 资产映射

映射是资产跨链转移的重要步骤。所谓映射，就是利用两个网络（比如TRON和BTTC）上的智能合约进行资产的一一对应，便于诸如锁定、销毁以及转移等操作。

## 介绍

下文的描述中，“根链”代表如TRON或者以太坊，子链则代表BTTC主网。

如果您的代币合约部署在根链上，并想将其转移到子链，那么这篇文档将给予足够的指引；如果您的代币合约部署在子链上，这将是一种不同的情况，我们称为BTTC Mintable Assets。对于这种情况，请参考这篇[教程](mintable.md)。

## 标准子代币

如果您需要映射的代币是标准的TRC-20或TRC-721合约，只需要在[此处](TBD)提交映射请求即可，我们的团队将以最快的速度为您在BTTC上部署标准的子代币合约。

您可以通过以下链接来确定您的代币是否为标准合约：

+ [TRC-20](https://github.com/tronprotocol/TIPs/blob/master/tip-20.md)

+ [TRC-721](https://github.com/tronprotocol/tips/blob/master/tip-721.md)

请参考[这里](TBD)来了解如何提交一个新的映射请求。

## 自定义子代币

如果您需要映射自定义（非标准）的代币，首先您需要在子链上自行部署代币合约，然后在[这里](<span style="text-decoration:underline;">TBD</span>)提交您的映射请求。请确保在提交请求时您提供了准确的代币信息。

下面是一个创建自定义子代币的例子：

**自定义子合约必须满足如下条件：**

+ 拥有一个存款方法。每当从根链上发起存款请求时，`ChildChainManagerProxy`合约都会调用这个函数。这个方法会在子链上铸造代币。

+ 拥有一个取款方法。您必须确保这个方法是始终可用的，因为它将被用于燃烧子链上的代币。燃烧是取款过程的第一步，也是维持代币总发行量不变的重要步骤。

::: warning
注意：子代币合约的构造器中不进行代币铸造。
:::

### 实现

上文已经介绍了子代币合约必须满足的条件及其原因，下面就是按照要求来实现它。

::: warning
请注意，只有代理合约能调用deposit方法。
:::

```js
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SubToken is ERC20 {

   address public childChainManagerProxy;
   address private owner;
  
   constructor(string memory name, string memory symbol, uint8 decimals, address _childChainManagerProxy) public ERC20(name, symbol) {
       _setupDecimals(decimals);
       // minting in subcontract is restricted.
       childChainManagerProxy = _childChainManagerProxy;
       owner = msg.sender;
   }

   function updateSubChainManager(address newChildChainManagerProxy) external {
       require(newChildChainManagerProxy != address(0), "The proxy cannot be the blackhole.");
       require(msg.sender == owner, "This can only be done by the owner.");

       childChainManagerProxy = newChildChainManagerProxy;
   }

   function deposit(address recipient, bytes calldata depositData) external {
       require(msg.sender == childChainManagerProxy, "You are not allowed.");

       uint256 amount = abi.decode(depositData, (uint256));

       // the 'amount' of tokens will be minted, and the same amount
       // will be locked on the root chain in RootChainManager

       _totalSupply += amount;
       _balances[user] += amount;

       emit Transfer(address(0), user, amount);
   }

   function withdraw(uint256 amount) external {
       _balances[msg.sender] -= amount;
       _totalSupply -= amount;

       emit Transfer(msg.sender, address(0), amount);
   }
}
```

步骤：

+ 在根链上部署根代币，例如：TRON

+ 确保子代币有deposit以及withdraw方法

+ 在子链上部署子代币，即BTTC

+ 提交一个映射请求

## 提交映射请求

请在[此处](TBD)提交映射请求。
