# 可铸造代币

资产可通过PoS桥在公共区块链和BTTC之间转移，多数资产需要预先存在公共区块链上。另一种选择是在BTTC上直接创建代币，并在需要时将其转移到公共区块链上。与公共区块链相比，在BTTC上发行代币手续费较低，且速度更快。这种代币被称为BTTC可铸造资产。

当BTTC的可铸造资转移到公共区块链时，必须先在BTTC上销毁该代币，并在公共区块链上提交此次的销毁证明。`RootChainManager`合约在内部调用一个特殊的合约，它能直接在公共区块链上调用代币的铸造方法，并将代币铸造到用户地址。这个特殊的合约是`MintableAssetPredicate`。

## 需要满足的条件

您可以在BTTC上部署可铸造的代币，或者通过提交映射请求，在BTTC上自动部署可铸造的代币合约。

如果您打算自行部署合约，下面是一些合约代码示例。您可以对这些示例进行更改，但必须确保合约用有`deposit`、`withdraw`以及`mint`功能。

### 部署在BTTC上的合约

TBD：child合约代码示例 ERC20,721,1155

### 部署在公共区块链上的合约

TBD：dummy合约代码示例 ERC20,721,1155

最重要的一点是，部署在公共区块链代币合约需要指定公共区块链上的`MintableAssetProxy`合约为铸币者。只有`MintableAssetPredicate`合约有权在公共区块链上铸币。

这个角色可以通过调用根链上代币合约的`grantRole`方法来授予。第一个参数是`PREDICATE_ROLE`常量值，即`0x12ff340d0cd9c652c747ca35727e68c547d0f0bfa7758d2e77f75acef481b4f2`，第二个参数是相应的`Predicate`合约地址：

TBD：

"MintableERC20PredicateProxy"

"MintableERC721PredicateProxy"

"MintableERC1155PredicateProxy"
