# 委托

这是一个分布指南，可帮助您成为BitTorrent-chain上的委托人，成为 BitTorrent-chain 的委托人没有先决条件。您所要做的就是拥有一个TRON帐户。

## 什么是委托人

委托人无需托管完整节点即可参与验证。他们可以将BTT代币委托给验证人，并获得部分奖励作为交换。因为他们与验证人共享奖励，因为他们与验证人分享奖励，所以委托人也分担风险。委托人在系统中起着至关重要的作用，因为他们可以根据自己的意愿选择验证人。

## 如何为验证人投票

请参考用户指导文档：如何为验证人投票【**图形操作 - TBD-**此处等待产品提供相关图形化操作文档】

## 领取奖励

请参考用户指导文档：领取奖励【**图形操作 - TBD-**此处等待产品提供相关图形化操作文档】

相关合约方法：`StakeManagerProxy:withdrawRewards(uint256)`

参数：

+ validatorId：领取奖励的validator id

## 取消投票

请参考用户指导文档：领取奖励【**图形操作 - TBD-**此处等待产品提供相关图形化操作文档】

相关合约方法：`ValidatorShare:(uint256, uint256)`

参数：

+ uint256 claimAmount：数量
+ uint256 maximumSharesToBurn：可接受的燃烧最大代理币数量

## 奖励复投

请参考用户指导文档：奖励复投【**图形操作 - TBD-**此处等待产品提供相关图形化操作文档】

相关合约方法：`ValidatorShare:reStake()`

## 转移投票

请参考用户指导文档：转移投票【**图形操作 - TBD-**此处等待产品提供相关图形化操作文档】

相关合约方法：`StakeManagerProxy:sellVoucher_new(uint256, uint256)`

参数：

+ uint256 claimAmount：解释数量
+ uint256 maximumSharesToBurn：可接受的燃烧最大代理币数量
