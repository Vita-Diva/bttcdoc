# Asset Mapping

Mapping is a critical step in transferring assets between chains. The term "mapping" refers to the use of smart contracts on two networks (such as TRON and BTTC) to establish a one-to-one correspondence between assets, allowing for operations such as locking, destroying, and transferring to be performed more easily.

## Introduction

The "root chain" in the following description refers to public blockchains, such as TRON or Ethereum, and the "subchain" refers to the BTTC main network.

If your token contract is currently deployed on the root chain and you wish to move it to a sub-chain, this document will provide sufficient guidance; if your token contract is currently deployed on a sub-chain, you will encounter a different type of situation, which we refer to as BTTC Mintable Assets. Please refer to this [tutorial] in this case (mintableassets.md).

### Standard Child Token

If the token being mapped is a standard TRC-20 or TRC-721 contract, all you need to do is submit a mapping request at [here](TBD), and our team will quickly deploy it on BTTC. Contract for standard sub-tokens.

You can determine whether your token is a standard contract by visiting the following link:

+ [TRC-20](https://github.com/tronprotocol/TIPs/blob/master/tip-20.md)

+ [TRC-721](https://github.com/tronprotocol/tips/blob/master/tip-721.md)

To learn how to submit a new mapping request, please refer to [here](TBD).

### Custom Child Token

If you wish to map a non-standard (custom) token, you must first deploy a token contract on the sub-chain and then submit your mapping request [here](TBD). Please ensure that you submit the request with accurate token information.

The following is an illustration of how to create a customized child token:

**Any child token contract must adhere to the following requirements:**

+ Provide a method of deposit. This function is invoked whenever a deposit request is initiated from the root chain by the 'ChildChainManagerProxy' contract. This method is used to mint tokens on the child chain. 

+ Have a method of withdrawal. This method must always be available, as it will be used to burn tokens on the sub-chain. Burning is the first step in the withdrawal process and a critical step in ensuring that the total number of tokens issued remains constant.

::: warning
The constructor of the child token contract must not perform token minting.
:::

#### Implementation

The conditions and reasons that the child token contract must meet have been introduced above, and the following is to implement it according to the requirements.

::: warning
Only proxy contracts can call the deposit method.
:::

```javascript
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

Steps:

+ Deploy root tokens on the root chain, for example: TRON

+ Ensure that the child token has deposit and withdraw methods

+ Deploy sub-tokens on sub-chains, namely BTTC

+ Submit a mapping request

### Submit a mapping request

Please submit a mapping request [here](TBD).
