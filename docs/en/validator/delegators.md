# Delegation

This is a distribution guide to help you become a delegate on the BitTorrent-chain. There are no prerequisites to become a delegate on the BitTorrent-chain. All you have to do is have a TRON account.

## What is a Principal

A principal does not need to host a full node to participate in the verification. They can stake BTT tokens to a super delegate and receive a portion of the reward in exchange. Because they share the reward with the super delegate, and because they share the reward with the super delegate, the delegate also shares the risk. Delegates play a crucial role in the system because they can choose the Validator as they wish.

## How to vote for a Validator

Please refer to the user guidance document: How to vote for a Validator [Graphical Operations - TBD - wait here for the product to provide the relevant graphical operations document].

Related contractual methods.

## Claiming rewards

Please refer to the user guide: Claiming your rewards [graphic manipulation - TBD - wait for the product to provide the relevant graphic manipulation documentation here].

Related contractual methods: `StakeManagerProxy:withdrawRewards(uint256)`

Parameters:

+ validatorId：The id of the validator claiming the reward

## Cancelling a vote

Please refer to the user guidance document: Claiming Rewards [Graphical Operations - TBD - Waiting here for the product to provide relevant graphical operations documentation]

Related contractual methods: `ValidatorShare:(uint256, uint256)`

Parameters:

+ uint256 claimAmount：claiming amount
+ uint256 maximumSharesToBurn：可接受的燃烧最大代理币数量

## Reward reinvestment

Please refer to the user guidance document: Reward Reinvestment [Graphical Operations - TBD - wait here for the product to provide the relevant graphical operations document].

Related contractual methods: `ValidatorShare:reStake()`

## Transfer Vote

Please refer to the user guidance document: Transfer Polling [Graphical Operations - TBD - wait here for the product to provide the relevant graphical operations documentation].

Related contractual methods: `StakeManagerProxy:sellVoucher_new(uint256, uint256)`

参数：

+ uint256 claimAmount：解释数量
+ uint256 maximumSharesToBurn：可接受的燃烧最大代理币数量
