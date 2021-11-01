# 节点部署

## 入门

要通过在 BitTorrent-chain 上运行节点来参与并成为验证人，您可以按照如下的文档进行操作。

## 推荐配置

* 64 GiB of memory
* 16 core CPU (m5d.4xlarge or OVH’s infra-3)
* Minimum 1TB SSD (make sure it is extendable)
* 1Gb/s Bandwidth (expect 3-5 TB data transferred per month)

## 使用Ansible部署验证人节点

### 先决条件

* 三台机器--一台本地机器，你将在上面运行Ansible playbook；两台远程机器--一台sentry和一台验证机。
* 在本地机器上，安装了Ansible。
* 在本地机器上，安装了Python 3.x。
* 在远程机器上，确保没有安装Go。
* 在远程机器上，你的本地机器的SSH公钥在远程机器上，以便让Ansible连接到它们。

### 概述

要进入一个运行中的验证人节点，请做以下工作。

* 准备好三台机器。
* 通过Ansible建立一个sentry节点。
* 通过Ansible建立一个验证人节点。
* 配置sentry节点。
* 启动sentry节点。
* 配置验证人节点。
* 设置所有者和签名者密钥。
* 启动验证人节点。

### 设置sentry节点

#### 在你的本地机器上，git clone node-ansible资源库

```sh
git clone [https://github.com/bttcprotocol/node-ansible](https://github.com/bttcprotocol/node-ansible)
```

#### 切换至 node-ansible目录

```sh
cd node-ansible
```

#### 在inventory.yaml文件中添加将成为sentry节点和验证人节点的远程机器的IP地址

```yaml
all:

  hosts:

  children:

    sentry:

      hosts:

        xxx.xxx.xx.xx: # ----- Add IP for sentry node

        xxx.xxx.xx.xx: # ----- Add IP for second sentry node (optional)

    validator:

      hosts:

        xxx.xxx.xx.xx: # ----- Add IP for validator node

**示例：**

all:

  hosts:

  children:

    sentry:

      hosts:

        188.166.216.25:

    validator:

      hosts:

        134.209.100.175: 
```

#### 检查远程sentry节点机器是否可以到达

在本地机器上，运行`ansible sentry -m ping`

```sh
$ ansible sentry -m ping

xxx.xxx.xx.xx | SUCCESS => {

    "ansible_facts": {

        "discovered_interpreter_python": "/usr/bin/python3"

    },

    "changed": false,

    "ping": "pong"

}
```

#### 对sentry节点的设置进行一次测试

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bttc_branch=v0.2.8 delivery_branch=v0.2.2  network_version=mainnet-v1 node_type=sentry/sentry delivery_network=mainnet" --list-hosts
```

#### 运行sentry节点设置

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bttc_branch=v0.2.8 delivery_branch=v0.2.2  network_version=mainnet-v1 node_type=sentry/sentry delivery_network=mainnet"
```

一旦设置完成，你将在终端上看到一条完成信息。

### 设置validator节点

至此，你已经建立了sentry节点。

在你的本地机器上，你也已经设置了Ansible playbook来运行验证人节点的设置。

检查远程验证人的机器是否可达。在本地机器上，运行`ansible validator -m ping`。

```sh
$ ansible validator -m ping

xxx.xxx.xx.xx | SUCCESS => {

    "ansible_facts": {

        "discovered_interpreter_python": "/usr/bin/python3"

    },

    "changed": false,

    "ping": "pong"

}
```

#### 对验证人节点设置进行测试运行

```sh
ansible-playbook -l validator playbooks/network.yml --extra-var="bttc_branch=v0.2.8 delivery_branch=v0.2.2 network_version=mainnet-v1 node_type=sentry/validator delivery_network=mainnet" --list-hosts
```

#### 运行验证人节点设置

```sh
ansible-playbook -l validator playbooks/network.yml --extra-var="bttc_branch=v0.2.8 delivery_branch=v0.2.2  network_version=mainnet-v1 node_type=sentry/validator delivery_network=mainnet"
```

一旦设置完成，你将在终端上看到一条完成信息。

### 配置sentry节点

登录到远程sentry机。

### 配置Delivery节点

* 编辑 ~/.deliveryd/config/config.toml。

    在config.toml中，修改以下内容。

* moniker - 任何名称。例如：moniker = "my-sentry-node"。
* seeds - 种子节点地址，由一个节点ID、一个IP地址和一个端口组成。
* pex - 将该值设置为 "true "以启用对等体交换。例如：pex = true。
* private_peer_ids - 在验证人机器上设置的delivery的节点ID。

为了获得validator上delivery的节点ID。登录到validator上：

运行 deliveryd tendermint show-node-id。

例如：`private_peer_ids = "0ee1de0515f577700a6a4b6ad882eff1eb15f066"`。

* prometheus - 将该值设为true，以启用Prometheus度量。例如：prometheus = true。
* max_open_connections - 将该值设置为100。例如：max_open_connections = 100。

### 配置BTTC节点

* 编辑 `~/node/bttc/start.sh`。

在start.sh中，通过在末尾添加以下一行，添加由节点ID、IP地址和端口组成的启动节点地址。

```sh
    --bootnodes "enode://0cb82b395094ee4a2915e9714894627de9ed8498fb881cec6db7c65e8b9a5bd7f2f25cc84e71e89d0947e51c76e85d0847de848c7782b13c0255247a6758178c@44.232.55.71:30303,enode://88116f4295f5a31538ae409e4d44ad40d22e44ee9342869e7d68bdec55b0f83c1530355ce8b41fbec0928a7d75a5745d528450d30aec92066ab6ba1ee351d710@159.203.9.164:30303,enode://3178257cd1e1ab8f95eeb7cc45e28b6047a0432b2f9412cff1db9bb31426eac30edeb81fedc30b7cd3059f0902b5350f75d1b376d2c632e1b375af0553813e6f@35.221.13.28:30303,enode://16d9a28eadbd247a09ff53b7b1f22231f6deaf10b86d4b23924023aea49bfdd51465b36d79d29be46a5497a96151a1a1ea448f8a8666266284e004306b2afb6e@35.199.4.13:30303,enode://ef271e1c28382daa6ac2d1006dd1924356cfd843dbe88a7397d53396e0741ca1a8da0a113913dee52d9071f0ad8d39e3ce87aa81ebc190776432ee7ddc9d9470@35.230.116.151:30303"
```

保存start.sh中的修改。

* 编辑 `~/.bttc/data/bttc/static-nodes.json`。

在static-nodes.json中，改变以下内容。在validator机器上设置的BTTC的节点ID和IP地址。

要获得validator上BTTC的节点ID, 登录到验证机上。

运行 `bootnode -nodekey ~/.bttc/data/bttc/nodekey -writeaddress`

```sh
    示例: "enode://410e359736bcd3a58181cf55d54d4e0bbd6db2939c5f548426be7d18b8fd755a0ceb730fe5cf7510c6fa6f0870e388277c5f4c717af66d53c440feedffb29b4b@134.209.100.175:30303".
```

### 配置防火墙

sentry节点机器必须对外开放以下端口 0.0.0.0/0。

* 22
* 26656
* 30303

### 启动sentry节点

你将首先启动Delivery节点,一旦Delivery节点同步了，你将启动BTTC节点。

### 启动Delivery节点

* 启动Delivery服务:

```sh
    sudo service deliveryd start
```

* 启动Delivery rest-server:

```sh
    sudo service deliveryd-rest-server start
```

* 检查Delivery服务日志:

```sh
    journalctl -u deliveryd.service -f
```

* 检查delivery rest-server的日志:

```sh
   journalctl -u deliveryd-rest-server.service -f
```

* 检查delivery的同步状态:

```sh
    curl localhost:26657/status
```

  在输出中，catching_up的值是：

* true - delivery节点正在同步。
* false - delivery节点已经完全同步了。

等待delivery节点完全同步。

### 启动BTTC节点

一旦delivery节点被完全同步，启动BTTC节点。

### 启动BTTC服务

```sh
sudo service bttc start
```

### 检查BTTC服务日志

```sh
journalctl -u bttc.service -f
```

### 配置validator节点

#### 配置delivery节点

登录到远程验证人机器上。

编辑 `~/.deliveryd/config/config.toml`，在config.toml中，改变以下内容。

* moniker - 任何名称。例如：moniker = "my-validator-node"。
* pex - 将该值设为false，以禁用对等体交换。例如：pex = false。
* private_peer_ids - 将该值注释掉以禁用它。例子。# private_peer_ids = ""。
* persistent_peers - sentry机上设置的delivery的节点ID和sentry机的IP地址。

    为了获得delivery在sentry机上的节点ID。登录到sentry机上。

    运行`deliveryd tendermint show-node-id`。

```sh
    Example: persistent_peers = "7d2adb45aa20fdcf053c0e3b8209eb781e501b46@188.166.216.25:26656".
```

* prometheus - 将该值设为true，以启用Prometheus度量。例子：`prometheus = true`。

编辑 `~/.deliveryd/config/delivery-config.toml`，在delivery-config.toml中，修改以下内容。

* eth_rpc_url - 一个完全同步的Ethereum主网节点的RPC端点。Example: eth_rpc_url = "[https://nd-123-456-789.p2pify.com/60f2a23810ba11c827d3da642802412a](https://nd-123-456-789.p2pify.com/60f2a23810ba11c827d3da642802412a)"
* bsc_rpc_url- 一个完全同步的bsc主网节点的RPC端点.Example:bsc_rpc_url = "[https://data-seed-prebsc-1-s2.binance.org:8545](https://data-seed-prebsc-1-s2.binance.org:8545)"
* tron_rpc_url- tron主网节点的rpc端点，用来发送交易到这个端点。Example:tron_rpc_url = "47.252.19.181:50051"
* tron_grid_url -tron主网节点的事件服务,用来查询事件日志.Example:tron_grid_url = "http://47.252.35.194:8547"

#### 配置BTTC节点

编辑 `~/.bttc/data/bttc/static-nodes.json`，在 static-nodes.json 中，修改以下内容。

使用"<enode://sentry_machine_enodeID@sentry_machine_ip:30303>"替换在sentry节点机器上设置的BTTC的节点ID和IP地址。

要获得sentry节点上BTTC的节点ID，登录到sentry机上。

运行 `bootnode -nodekey ~/.bttc/data/bttc/nodekey -writeaddress`。

例如

```sh
"enode://a8024075291c0dd3467f5af51a05d531f9e518d6cd229336156eb6545581859e8997a80bc679fdb7a3bd7473744c57eeb3411719b973b2d6c69eff9056c0578f@188.166.216.25:30303"
```

### 设置Owner和Signer的密钥

在BTTC，建议你保持Onwer和Signer Key的不同。

* Signer - 签署checkpoint交易的地址。
* Owner - 进行staking交易的地址。

#### 生成一个delivery私钥

你必须只在validator上生成一个delivery私钥，不要在sentry节点上生成delivery私钥。

要生成私钥，请运行：

```sh
deliverycli generate-validatorkey ETHEREUM_PRIVATE_KEY
```

其中：

ETHEREUM_PRIVATE_KEY - 你的以太坊地址私钥。

这将生成priv_validator_key.json，将生成的JSON文件移到delivery配置目录中。

```sh
mv ./priv_validator_key.json ~/.deliveryd/config
```

#### 生成一BTTC keystore文件

你必须只在validator机器上生成一个BTTC keystore文件,不要在sentry节点生成BTTC keystore文件。

要生成私钥，请运行：

```sh
deliverycli generate-keystore ETHEREUM_PRIVATE_KEY
```

其中

ETHEREUM_PRIVATE_KEY - 你的以太坊地址私钥。

当提示时，设置密钥库文件的密码, 这将生成一个 `UTC-<time>-<address> keystore`文件。

将生成的keystore文件移到BTTC配置目录下。

```sh
mv ./UTC-<time>-<address> ~/.bttc/keystore/
```

#### 添加password.txt

在 ~/.bttc/password.txt 文件中添加BTTC keystore文件密码。

#### 添加你的以太坊地址

编辑/etc/bttc/metadata，在metadata中，添加你的以太坊地址。

例如：

```sh
VALIDATOR_ADDRESS=0xca67a8D767e45056DC92384b488E9Af654d78DE2.
```

### 启动validator节点

至此，你必须：

* sentry上的delivery节点已完全同步并运行。
* sentry上的BTTC节点正在运行。
* 配置好validator上的delivery节点和BTTC节点。
* 你的Owner和Signer密钥已配置。

#### 启动delivery节点

现在你将在validator上启动delivery节点,一旦delivery节点同步了，你将在validator上启动BTTC节点。

* 启动delivery服务:

```sh
    sudo service deliveryd start
```

* 启动delivery rest-server:

```sh
    sudo service deliveryd-rest-server start
```

* 启动delivery bridge:

```sh
    sudo service deliveryd-bridge start
```

* 检查delivery服务日志:

```sh
    journalctl -u deliveryd.service -f
```

* 检查delivery rest-server的日志:

```sh
    journalctl -u deliveryd-rest-server.service -f
```

* 检查delivery桥的日志:

```sh
    journalctl -u deliveryd-bridge.service -f
```

* 检查delivery的同步状态:

```sh
    curl localhost:26657/status
```

在输出中，catching_up的值是:

* true - delivery节点正在同步。
* false - delivery节点已经完全同步了。

等待delivery节点完全同步。

#### 启动BTTC节点

一旦validator上的delivery节点完全同步，启动validator上的BTTC节点。

启动BTTC服务:

```sh
sudo service bttc start
```

检查BTTC服务日志:

```sh
journalctl -u bttc.service -f
```

## 使用Binaries部署验证人节点

本节将指导您使用从Binaries启动和运行验证人节点。

### 先决条件

* 两台机器--一台sentry和一台validator。
* 在sentry机和validator机上安装build-essential。

    安装命令：

```sh
    sudo apt-get install build-essential
```

* 在sentry和validator上安装Go 1.15+。

    安装命令：

```sh
    wget https://gist.githubusercontent.com/ssandeep/a6c7197811c83c71e5fead841bab396c/raw/e38212982ab8cdfc11776fa1a3aaf92b69e1cb15/go-install.sh

    bash go-install.sh

    sudo ln -nfs ~/.go/bin/go /usr/bin/go
```

* 在sentry机和validator机上安装RabbitMQ。请参阅 "[下载和安装 RabbitMQ](https://www.rabbitmq.com/download.html)"。

### 概述

要运行一个验证人节点，请做以下工作：

* 准备好两台机器。
* 将delivery和BTTC的二进制文件安装在sentry和validator上。
* 在sentry和validator上设置delivery和BTTC的节点文件。
* 在sentry和validator上设置delivery和BTTC服务。
* 配置sentry节点。
* 启动sentry节点。
* 配置validator节点。
* 设置Owner和Signer的密钥。
* 启动validator节点。

### 安装二进制文件

注:

在sentry和validator上都要运行本节。

#### 安装delivery

```sh
#Clone the delivery repository:
git clone https://github.com/bttcprotocol/delivery

#Install delivery:
make install

#Check the installation:
deliveryd version --long 
```

#### 安装BTTCr

```sh
#Clone the BTTC repository:
git clone https://github.com/bttcprotocol/bttc

#Install BTTC:
make bttc-all

#Create symlinks:
sudo ln -nfs ~/bttc/build/bin/bttc /usr/bin/bttc
sudo ln -nfs ~/bttc/build/bin/bootnode /usr/bin/bootnode

#Check the installation:
bttc version
```

### 设置节点文件

注:

在sentry和validator上都要运行本节。

#### 获取 launch repository

```sh
#Clone the launch repository:
git clone https://github.com/bttcprotocol/launch
```

#### 设置目录

##### sentry机器上

```sh
#Create a node directory:
mkdir -p node

#Copy the files and scripts from the launch directory to the node directory:
cp -rf launch/mainnet-v1/sentry/sentry ~/node
cp launch/mainnet-v1/service.sh ~/node
```

##### validator机器上

```sh
#Create a node directory:
mkdir -p node

#Copy the files and scripts from the launch directory to the node directory:
cp -rf launch/mainnet-v1/sentry/sentry ~/node
cp launch/mainnet-v1/service.sh ~/node
```

#### 设置网络目录

#### 设置delivery

```sh
#Change to the node directory:
cd ~/node/delivery
#Run the setup script:
bash setup.sh
```

#### 设置BTTC

```sh
#Change to the node directory:
cd ~/node/bttc
#Run the setup script:
bash setup.sh
```

### 设置服务

注:

在sentry和validator上都要运行本节。

```sh
#Change to the node directory:
cd ~/node
#Run the setup script:
bash service.sh
#Copy the service file to the system directory:
sudo cp *.service /etc/systemd/system/
```

### 配置sentry节点

登录到sentry机。

#### 配置delivery节点

* 编辑 ~/.deliveryd/config/config.toml。

    在config.toml中，修改以下内容。

* moniker - 任何名称。例如：moniker = "my-sentry-node"。
* seeds - 种子节点地址，由一个节点ID、一个IP地址和一个端口组成。
* pex - 将该值设置为 "true "以启用对等体交换。例如：pex = true。
* private_peer_ids - 在验证人机器上设置的delivery的节点ID。

    为了获得validator上delivery的节点ID。登录到validator上：

    运行 `deliveryd tendermint show-node-id`。

    例如：`private_peer_ids = "0ee1de0515f577700a6a4b6ad882eff1eb15f066"`。

* prometheus - 将该值设为true，以启用Prometheus度量。例如：prometheus = true。
* max_open_connections - 将该值设置为100。例如：max_open_connections = 100。

#### 配置BTTC节点

* 编辑 ~/node/bttc/start.sh。

    在start.sh中，通过在末尾添加以下一行，添加由节点ID、IP地址和端口组成的启动节点地址。

```sh
    --bootnodes "enode://0cb82b395094ee4a2915e9714894627de9ed8498fb881cec6db7c65e8b9a5bd7f2f25cc84e71e89d0947e51c76e85d0847de848c7782b13c0255247a6758178c@44.232.55.71:30303,enode://88116f4295f5a31538ae409e4d44ad40d22e44ee9342869e7d68bdec55b0f83c1530355ce8b41fbec0928a7d75a5745d528450d30aec92066ab6ba1ee351d710@159.203.9.164:30303,enode://3178257cd1e1ab8f95eeb7cc45e28b6047a0432b2f9412cff1db9bb31426eac30edeb81fedc30b7cd3059f0902b5350f75d1b376d2c632e1b375af0553813e6f@35.221.13.28:30303,enode://16d9a28eadbd247a09ff53b7b1f22231f6deaf10b86d4b23924023aea49bfdd51465b36d79d29be46a5497a96151a1a1ea448f8a8666266284e004306b2afb6e@35.199.4.13:30303,enode://ef271e1c28382daa6ac2d1006dd1924356cfd843dbe88a7397d53396e0741ca1a8da0a113913dee52d9071f0ad8d39e3ce87aa81ebc190776432ee7ddc9d9470@35.230.116.151:30303"
```

保存start.sh中的修改。

#### 配置防火墙

sentry节点机器必须对外开放以下端口 0.0.0.0/0。

* 22
* 26656
* 30303

### 启动sentry节点

你将首先启动delivery节点,一旦delivery节点同步了，你将启动BTTC节点。

#### 启动delivery节点

* 启动delivery服务:

```sh
    sudo service deliveryd start
```

* 启动delivery rest-server:

```sh
    sudo service deliveryd-rest-server start
```

* 检查delivery服务日志:

```sh
    journalctl -u deliveryd.service -f
```

* 检查delivery rest-server的日志:

```sh
    journalctl -u deliveryd-rest-server.service -f
```

* 检查delivery的同步状态:

```sh
    curl localhost:26657/status
```

  在输出中，catching_up的值是。

* true - delivery节点正在同步。
* false - delivery节点已经完全同步了。

等待delivery节点完全同步。

#### 启动BTTC节点

一旦delivery节点被完全同步，启动BTTC节点。

#### 启动BTTC服务

```sh
sudo service bttc start
```

#### 检查BTTC服务日志

```sh
journalctl -u bttc.service -f
```

### 配置validator节点

#### 配置delivery节点

登录到远程validator机器上。

编辑 `~/.deliveryd/config/config.toml`，在config.toml中，改变以下内容。

* moniker - 任何名称。例如：moniker = "my-validator-node"。
* pex - 将该值设为false，以禁用对等体交换。例如：pex = false。
* private_peer_ids - 将该值注释掉以禁用它。例子。# private_peer_ids = ""。
* persistent_peers - sentry机上设置的delivery的节点ID和sentry机的IP地址。

    为了获得delivery在sentry机上的节点ID。登录到sentry机上。

    运行`deliveryd tendermint show-node-id`。

    Example: `persistent_peers = "7d2adb45aa20fdcf053c0e3b8209eb781e501b46@188.166.216.25:26656"`.

* prometheus - 将该值设为true，以启用Prometheus度量。例子：prometheus = true。

编辑 `~/.deliveryd/config/delivery-config.toml`，在delivery-config.toml中，修改以下内容。

* eth_rpc_url - 一个完全同步的Ethereum主网节点的RPC端点。Example: eth_rpc_url = "[https://nd-123-456-789.p2pify.com/60f2a23810ba11c827d3da642802412a](https://nd-123-456-789.p2pify.com/60f2a23810ba11c827d3da642802412a)"
* bsc_rpc_url- 一个完全同步的bsc主网节点的RPC端点.Example:bsc_rpc_url = "[https://data-seed-prebsc-1-s2.binance.org:8545](https://data-seed-prebsc-1-s2.binance.org:8545)"
* tron_rpc_url- tron主网节点的rpc端点，用来发送交易到这个端点。Example:tron_rpc_url = "47.252.19.181:50051"
* tron_grid_url -tron主网节点的事件服务,用来查询事件日志.Example:tron_grid_url = "http://47.252.35.194:8547"

#### 配置BTTC节点

编辑 `~/.bttc/data/bttc/static-nodes.json`，在 static-nodes.json 中，修改以下内容。

使用"<enode://sentry_machine_enodeID@sentry_machine_ip:30303>"替换在sentry节点机器上设置的BTTC的节点ID和IP地址。

要获得sentry节点上BTTC的节点ID，登录到sentry机上。

运行 `bootnode -nodekey ~/.bttc/data/bttc/nodekey -writeaddress`。

例如

```sh
"enode://a8024075291c0dd3467f5af51a05d531f9e518d6cd229336156eb6545581859e8997a80bc679fdb7a3bd7473744c57eeb3411719b973b2d6c69eff9056c0578f@188.166.216.25:30303".
```

### 设置Owner和Signer的密钥

在BTTC，建议你保持Onwer和Signer Key的不同。

* Signer - 签署checkpoint交易的地址。
* Owner - 进行staking交易的地址。

#### 生成一个delivery私钥

你必须只在validator上生成一个delivery私钥，不要在sentry节点上生成delivery私钥。

要生成私钥，请运行：

```sh
deliverycli generate-validatorkey ETHEREUM_PRIVATE_KEY
```

其中：

ETHEREUM_PRIVATE_KEY - 你的以太坊地址私钥。

这将生成priv_validator_key.json，将生成的JSON文件移到delivery配置目录中。

```sh
mv ./priv_validator_key.json ~/.deliveryd/config
```

#### 生成一个BTTC keystore文件

你必须只在validator机器上生成一个BTTC keystore文件,不要在sentry节点生成BTTC keystore文件。

要生成私钥，请运行：

```sh
deliverycli generate-keystore ETHEREUM_PRIVATE_KEY
```

其中

ETHEREUM_PRIVATE_KEY - 你的以太坊地址私钥。

当提示时，设置密钥库文件的密码, 这将生成一个 `UTC-<time>-<address> keystore`文件。

将生成的keystore文件移到BTTC配置目录下。

```sh
mv ./UTC-<time>-<address> ~/.bttc/keystore/
```

#### 添加password.txt

在 `~/.bttc/password.txt` 文件中添加BTTC keystore文件密码。

#### 添加你的以太坊地址

编辑/etc/bttc/metadata，在metadata中，添加你的以太坊地址。

例如

```sh
VALIDATOR_ADDRESS=0xca67a8D767e45056DC92384b488E9Af654d78DE2.
```

### 启动validator节点

至此，你必须：

* sentry上的delivery节点已完全同步并运行。
* sentry上的BTTC节点正在运行。
* 配置好validator上的delivery节点和BTTC节点。
* 你的Owner和Signer密钥已配置。

#### 启动delivery节点

现在你将在validator上启动delivery节点,一旦delivery节点同步了，你将在validator上启动BTTC节点。

* 启动delivery服务:

```sh
    sudo service deliveryd start
```

* 启动delivery rest-server:

```sh
    sudo service deliveryd-rest-server start
```

* 启动delivery bridge:

```sh
    sudo service deliveryd-bridge start
```

* 检查delivery服务日志:

```sh
    journalctl -u deliveryd.service -f
```

* 检查delivery rest-server的日志:

```sh
    journalctl -u deliveryd-rest-server.service -f
```

* 检查delivery桥的日志:

```sh
    journalctl -u deliveryd-bridge.service -f
```

* 检查delivery的同步状态:

```sh
    curl localhost:26657/status
```

在输出中，catching_up的值是:

* true - delivery节点正在同步。
* false - delivery节点已经完全同步了。

等待delivery节点完全同步。

#### 启动BTTC节点

一旦validator上的delivery节点完全同步，启动validator上的BTTC节点。

启动BTTC服务:

```sh
sudo service bttc start
```

检查BTTC服务日志:

```sh
journalctl -u bttc.service -f
```