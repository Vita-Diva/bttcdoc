# 节点搭建

## 入门

要通过在 BitTorrent-chain 上运行节点来参与并成为验证人，您可以按照如下的文档进行操作。

节点设置指南：

在启动 Staking 过程之前，请确保节点的健康检查已完成。

## 搭建

【TBD-等待开发提供完整文档】参考文档：[http://wiki.tronoffice.com:8090/pages/viewpage.action?pageId=23438321](http://wiki.tronoffice.com:8090/pages/viewpage.action?pageId=23438321)

### 申请测试币

(1).申请eth测试币:[https://faucet.goerli.mudit.blog/](https://faucet.goerli.mudit.blog/)

(2).申请trx/btt测试币：【TBD】

### 安装matic-cli [TBD] 脚本

```js
npm install -g @maticnetwork/matic-cli
```

### 安装前置依赖(标注版本的请严格装指定版本):

* Git
* Node/npm v11.24.0
* Go 1.16.4
* Rabbitmq (Latest stable version)
* Solc v0.5.11 ([https://solidity.readthedocs.io/en/v0.5.3/installing-solidity.html#binary-packages](https://solidity.readthedocs.io/en/v0.5.3/installing-solidity.html#binary-packages))

安装完成之后，请检查下对应软件是否可以正常运行，以及版本是否正确

### 部署单个节点

使用命令

```sh
matic-cli setup localnet
```

依次填写下面几个问题:

Please enter Bor chain id 15001
Please enter Heimdall chain id heimdall-15001
Do you have private key? (If not, we will generate it for you) No (如果有现成私钥，直接填，否则会自动生成)
Choose keystore password * (这里填写密码)
Please enter Bor branch or tag  v0.2.8
Please enter Heimdall branch or tag  master
Please enter Contracts branch or tag  stake

<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: Definition term(s) &uarr;&uarr; missing definition? </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


上面涉及代码版本，没有特殊要求，填默认

### 修改validator配置

#### 修改persistent_peers来做p2p发现

在config.toml文件中，找到persistent_peers节点

* To get your NodeID, you will need run this command on the Sentry node instance: \
heimdalld tendermint show-node-id  \
and add it in the following format as mentioned below \
persistent_peers = "node-id@instance_ip:26656"

#### enode修改

执行sh bor-start.sh 在控制台上看到类似日志:

```sh
Started P2P networking                   self=enode://695ad828ae88fa289cd6e48d2561e054eaf9bd883f0bcb35508240271a3f39a72c0b07bb802ee7db29b56f1dfd168e86adeebb561f00327c21a1b926e35e0e32@127.0.0.1:30303
```

这个enode就是这个bor节点的node_id

后续如果要接入已有的bor节点, `vi ~/node/bor_start.sh` 里面添加参数:

```sh
--bootnodes "enode://0cb82b395094ee4a2915e9714894627de9ed8498fb881cec6db7c65e8b9a5bd7f2f25cc84e71e89d0947e51c76e85d0847de848c7782b13c0255247a6758178c@44.232.55.71:30303,enode://88116f4295f5a31538ae409e4d44ad40d22e44ee9342869e7d68bdec55b0f83c1530355ce8b41fbec0928a7d75a5745d528450d30aec92066ab6ba1ee351d710@159.203.9.164:30303"
```

#### genesis.json里面chain_params里面的合约地址替换为我们自己的合约地址。** 

参照附件中的文件

```conf
"chainmanager": {

"params": {

"mainchain_tx_confirmations": "6",

"maticchain_tx_confirmations": "10",

"tronchain_tx_confirmations": "2",

"chain_params": {

"bor_chain_id": "137",

"matic_token_address": "416DA52943065C6B8B54D4023CC8583CE74B0D01E6",

"staking_manager_address": "0x657b58f1bB1Aa3BD6c1c4A553C9fD4dC841b483b",

"slash_manager_address": "0x0000000000000000000000000000000000000000",

"root_chain_address": "0xcC08112A1775a1a28B2df66F2eFfdF1676CFa134",

"staking_info_address": "0x60AD1150554f23dcE89297e83d92D1Ed64e4c06E",

"state_sender_address": "0xDC7D698Fd019975478aF0f32C0a313257FcA52F7",

"state_receiver_address": "0x0000000000000000000000000000000000001001",

"validator_set_address": "0x0000000000000000000000000000000000001000",

"tron_chain_address": "412FB651C7362CE2210F7EB38FF1CE682EE60BDD1C",

"tron_state_sender_address": "4155656FF3AE29C102B24935275A325622EA4B1D34",

"tron_staking_manager_address": "41741B157998BAE098A579B150543A4708A877AD49",

"tron_state_info_address": "41A7928E02832B1DE37BDED662C80313396AA831B0"

}}

}
```
 
上面地址替换里面，上面几个是以太坊地址，直接从部署好的以太坊合约地址替换即可；下面tron合约地址，需要将tron合约地址进行转码。详见[https://tronscan.org/#/tools/tron-convert-tool](https://tronscan.org/#/tools/tron-convert-tool)

#### Tron url修改

下面是测试环境api，测试过程中可以用下面默认

tron_rpc_url = "47.252.19.181:50051"

tron_grid_url = "[http://47.94.0.13:30080](http://47.94.0.13:30080/)"

5.5.修改heimdalld/config/heimdall-config.toml里面的eth_RPC_URL

格式:eth_rpc_url = "https://goerli.infura.io/v3/&lt;YOUR_INFURA_KEY>"

这里需要自己生成[INFURA_KEY](https://goerli.infura.io/v3/%3CYOUR_INFURA_KEY)以便来跟以太坊通信。

通过[https://ethereumico.io/knowledge-base/infura-api-key-guide](https://ethereumico.io/knowledge-base/infura-api-key-guide) 来申请以太坊测试网goerli的API KEY.

已注册:[https://goerli.infura.io/v3/b2bbafdc094249a687e7ecec8358fa32](https://goerli.infura.io/v3/b2bbafdc094249a687e7ecec8358fa32)

### 使用脚本启动

步骤3会生成启动脚本(请严格按照这个顺序执行脚本)

```sh
Start all heimdall instances (it will run all services - rabbitmq, heimdall, bridge, server)

sh heimdall-bridge-start.sh

sh heimdall-server-start.sh

sh heimdall-start.sh

Setup bor #(只在第一次启动时使用)
```

```sh
sh bor-setup.sh
```

```sh
Start bor
```

```sh
sh bor-start.sh
```

## 验证人节点搭建

这是一个分步指南，可帮助您成为BitTorrent-Chain的验证人。以下命令列表将帮助您设置 Validator 和 BitTorrent-Chain层 节点以进行抵押和执行验证人职责。

### 先决条件

你应该在你的机器上建立并运行Validator和BitTorrent-Chain设置。如果你还没有设置你的节点，你应该使用以下说明进行设置：【TBD- 节点设置链接】

### 账户信息

通过运行如下命令，获取账户相关信息，确保该命令是运行在验证人节点。

```sh
                    heimdalld show-account [TBD-等待命令名称确定]                                           
```

你的输出应该以下列格式出现。

```json
{
   "address": "0x6c468CF8c9879006E22EC4029696E005C2319C9D",
   "pub_key": "0x04b12d8b2f6e3d45a7ace12c4b2158f79b95e4c28ebe5ad54c439be9431d7fc9dc1164210bf6a5c3b8523528b931e772c86a307e8cff4b725e6b4a77d21417bf19"
}
```

这将显示你的验证器节点的地址和公钥。注意，这个地址必须与你在以太坊上的签名者地址相匹配。

### 私钥信息

你可以通过运行下面的命令对你的私钥做另一次检查。请注意，这是一个可选的步骤，不需要是一个强制性的步骤

```sh
                  heimdalld show-privatekey [TBD-等待命令名称确定]
```

应该出现以下输出:

```json
{
   "priv_key": "0x********************************************************"
}
```

到此您已经做了基本的检查，并分别为BitTorrent-Chain和Validator生成了密钥库和私钥，现在您可以质押您的代币，并成为一个验证人。

你可以通过使用验证人仪表板进行质押：

请参考用户指导文档：如何成为验证人【**图形操作 - TBD-**此处等待产品提供相关图形化操作文档】

**命令api 操作** - 特学

* 保证卡槽数量validatorThreshold（StakeManagerProxy读方法查询）大于当前validator数量（通过StakeManagerProxy合约validatorState方法查看）。
* 准备一个拥有至少500TRX的TRON地址Address_A。
* 给地址Address_A转一定数量BTT，至少2个token（注意精度的18个0）。
* 地址Address_A调用StakeManagerProxy的approve方法进行指定数量的BTT。
* 使用地址Address_A调用StakeManagerProxy的stakeFor方法进行质押，参数如下： \
 user：账户A地址 \
 amount：质押量，小于授权量，需精度的18个0 \
 heimdallFee：手续费，大于等于1个token，需精度的18个0 \
 acceptDelegation：false（如果为true的话，stakeFor不能通过tronscan调用，因为tronscan费用限制为300TRX，可通过wallet cli、API等调用） \
 signerPubkey：账户A公钥，需要把前导“04”去掉

* 交易执行成功即质押成功。
* 用户质押成功后可通过地址Address_A的address，访问stakeManagerProxy的getValidatorId方法获取validator id，然后通过validators方法，输入id获取validator详细信息，判断质押是否成功。

### 余额信息

可以通过如下命令检查您的地址余额

```sh
heimdallcli query auth account <signer-address> --chain-id <chain-id> [TBD-等待命令名称确定]
```

应该出现以下输出:

```s
address: 0x6c468cf8c9879006e22ec4029696e005c2319c9d
coins:
- denom: BTT
amount:
   i: "1000000000000000000000"
accountnumber: 0
sequence: 0
```
