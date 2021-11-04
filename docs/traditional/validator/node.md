# 節點部署

## 驗證人節點部署

### 入門

要通過在 BitTorrent-chain 上運行節點來參與並成為驗證人，您可以按照如下的文檔進行操作。

### 推薦配置

* 64 GiB of memory
* 16 core CPU (m5d.4xlarge or OVH’s infra-3)
* Minimum 1TB SSD (make sure it is extendable)
* 1Gb/s Bandwidth (expect 3-5 TB data transferred per month)

### 使用Ansible部署驗證人節點

#### 先決條件

* 三台機器--一台本地機器，你將在上面運行Ansible playbook；兩台遠程機器--一台sentry和一台驗證機。
* 在本地機器上，安裝了Ansible。
* 在本地機器上，安裝了Python 3.x。
* 在遠程機器上，確保沒有安裝Go。
* 在遠程機器上，你的本地機器的SSH公鑰在遠程機器上，以便讓Ansible連接到它們。

#### 概述

要進入一個運行中的驗證人節點，請做以下工作。

* 準備好三台機器。
* 通過Ansible建立一個sentry節點。
* 通過Ansible建立一個驗證人節點。
* 配置sentry節點。
* 啟動sentry節點。
* 配置驗證人節點。
* 設置所有者和簽名者密鑰。
* 啟動驗證人節點。

#### 設置sentry節點

###### 在你的本地機器上，git clone node-ansible資源庫

```sh
git clone [https://github.com/bttcprotocol/node-ansible](https://github.com/bttcprotocol/node-ansible)
```

###### 切換至 node-ansible目錄

```sh
cd node-ansible
```

###### 在inventory.yaml文件中添加將成為sentry節點和驗證人節點的遠程機器的IP地址

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

###### 檢查遠程sentry節點機器是否可以到達

在本地機器上，運行`ansible sentry -m ping`

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

###### 對sentry節點的設置進行一次測試

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bttc_branch=v0.2.8 delivery_branch=v0.2.2  network_version=mainnet-v1 node_type=sentry/sentry delivery_network=mainnet" --list-hosts
```

###### 運行sentry節點設置

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bttc_branch=v0.2.8 delivery_branch=v0.2.2  network_version=mainnet-v1 node_type=sentry/sentry delivery_network=mainnet"
```

一旦設置完成，你將在終端上看到一條完成信息。

#### 設置validator節點

至此，你已經建立了sentry節點。

在你的本地機器上，你也已經設置了Ansible playbook來運行驗證人節點的設置。

檢查遠程驗證人的機器是否可達。在本地機器上，運行`ansible validator -m ping`。

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

###### 對驗證人節點設置進行測試運行

```sh
ansible-playbook -l validator playbooks/network.yml --extra-var="bttc_branch=v0.2.8 delivery_branch=v0.2.2 network_version=mainnet-v1 node_type=sentry/validator delivery_network=mainnet" --list-hosts
```

###### 運行驗證人節點設置

```sh
ansible-playbook -l validator playbooks/network.yml --extra-var="bttc_branch=v0.2.8 delivery_branch=v0.2.2  network_version=mainnet-v1 node_type=sentry/validator delivery_network=mainnet"
```

一旦設置完成，你將在終端上看到一條完成信息。

#### 配置sentry節點

登錄到遠程sentry機。

#### 配置Delivery節點

* 編輯 ~/.deliveryd/config/config.toml。

    在config.toml中，修改以下內容。

* moniker - 任何名稱。例如：moniker = "my-sentry-node"。
* seeds - 種子節點地址，由一個節點ID、一個IP地址和一個端口組成。
* pex - 將該值設置為 "true "以啟用對等體交換。例如：pex = true。
* private_peer_ids - 在驗證人機器上設置的delivery的節點ID。

為了獲得validator上delivery的節點ID。登錄到validator上：

運行 deliveryd tendermint show-node-id。

例如：`private_peer_ids = "0ee1de0515f577700a6a4b6ad882eff1eb15f066"`。

* prometheus - 將該值設為true，以啟用Prometheus度量。例如：prometheus = true。
* max_open_connections - 將該值設置為100。例如：max_open_connections = 100。

#### 配置BTTC節點

* 編輯 `~/node/bttc/start.sh`。

在start.sh中，通過在末尾添加以下一行，添加由節點ID、IP地址和端口組成的啟動節點地址。

```sh
    --bootnodes "enode://0cb82b395094ee4a2915e9714894627de9ed8498fb881cec6db7c65e8b9a5bd7f2f25cc84e71e89d0947e51c76e85d0847de848c7782b13c0255247a6758178c@44.232.55.71:30303,enode://88116f4295f5a31538ae409e4d44ad40d22e44ee9342869e7d68bdec55b0f83c1530355ce8b41fbec0928a7d75a5745d528450d30aec92066ab6ba1ee351d710@159.203.9.164:30303,enode://3178257cd1e1ab8f95eeb7cc45e28b6047a0432b2f9412cff1db9bb31426eac30edeb81fedc30b7cd3059f0902b5350f75d1b376d2c632e1b375af0553813e6f@35.221.13.28:30303,enode://16d9a28eadbd247a09ff53b7b1f22231f6deaf10b86d4b23924023aea49bfdd51465b36d79d29be46a5497a96151a1a1ea448f8a8666266284e004306b2afb6e@35.199.4.13:30303,enode://ef271e1c28382daa6ac2d1006dd1924356cfd843dbe88a7397d53396e0741ca1a8da0a113913dee52d9071f0ad8d39e3ce87aa81ebc190776432ee7ddc9d9470@35.230.116.151:30303"
```

保存start.sh中的修改。

* 編輯 `~/.bttc/data/bttc/static-nodes.json`。

在static-nodes.json中，改變以下內容。在validator機器上設置的BTTC的節點ID和IP地址。

要獲得validator上BTTC的節點ID, 登錄到驗證機上。

運行 `bootnode -nodekey ~/.bttc/data/bttc/nodekey -writeaddress`

```sh
    示例: "enode://410e359736bcd3a58181cf55d54d4e0bbd6db2939c5f548426be7d18b8fd755a0ceb730fe5cf7510c6fa6f0870e388277c5f4c717af66d53c440feedffb29b4b@134.209.100.175:30303".
```

#### 配置防火牆

sentry節點機器必須對外開放以下端口 0.0.0.0/0。

* 22
* 26656
* 30303

#### 啟動sentry節點

你將首先啟動Delivery節點,一旦Delivery節點同步了，你將啟動BTTC節點。

#### 啟動Delivery節點

* 啟動Delivery服務:

```sh
    sudo service deliveryd start
```

* 啟動Delivery rest-server:

```sh
    sudo service deliveryd-rest-server start
```

* 檢查Delivery服務日誌:

```sh
    journalctl -u deliveryd.service -f
```

* 檢查delivery rest-server的日誌:

```sh
   journalctl -u deliveryd-rest-server.service -f
```

* 檢查delivery的同步狀態:

```sh
    curl localhost:26657/status
```

  在輸出中，catching_up的值是：

* true - delivery節點正在同步。
* false - delivery節點已經完全同步了。

等待delivery節點完全同步。

#### 啟動BTTC節點

一旦delivery節點被完全同步，啟動BTTC節點。

#### 啟動BTTC服務

```sh
sudo service bttc start
```

#### 檢查BTTC服務日誌

```sh
journalctl -u bttc.service -f
```

#### 配置validator節點

###### 配置delivery節點

登錄到遠程驗證人機器上。

編輯 `~/.deliveryd/config/config.toml`，在config.toml中，改變以下內容。

* moniker - 任何名稱。例如：moniker = "my-validator-node"。
* pex - 將該值設為false，以禁用對等體交換。例如：pex = false。
* private_peer_ids - 將該值注釋掉以禁用它。例子。# private_peer_ids = ""。
* persistent_peers - sentry機上設置的delivery的節點ID和sentry機的IP地址。

    為了獲得delivery在sentry機上的節點ID。登錄到sentry機上。

    運行`deliveryd tendermint show-node-id`。

```sh
    Example: persistent_peers = "7d2adb45aa20fdcf053c0e3b8209eb781e501b46@188.166.216.25:26656".
```

* prometheus - 將該值設為true，以啟用Prometheus度量。例子：`prometheus = true`。

編輯 `~/.deliveryd/config/delivery-config.toml`，在delivery-config.toml中，修改以下內容。

* eth_rpc_url - 一個完全同步的Ethereum主網節點的RPC端點。Example: eth_rpc_url = "[https://nd-123-456-789.p2pify.com/60f2a23810ba11c827d3da642802412a](https://nd-123-456-789.p2pify.com/60f2a23810ba11c827d3da642802412a)"
* bsc_rpc_url- 一個完全同步的bsc主網節點的RPC端點.Example:bsc_rpc_url = "[https://data-seed-prebsc-1-s2.binance.org:8545](https://data-seed-prebsc-1-s2.binance.org:8545)"
* tron_rpc_url- tron主網節點的rpc端點，用來發送交易到這個端點。Example:tron_rpc_url = "47.252.19.181:50051"
* tron_grid_url -tron主網節點的事件服務,用來查詢事件日誌.Example:tron_grid_url = "http://47.252.35.194:8547"

###### 配置BTTC節點

編輯 `~/.bttc/data/bttc/static-nodes.json`，在 static-nodes.json 中，修改以下內容。

使用"<enode://sentry_machine_enodeID@sentry_machine_ip:30303>"替換在sentry節點機器上設置的BTTC的節點ID和IP地址。

要獲得sentry節點上BTTC的節點ID，登錄到sentry機上。

運行 `bootnode -nodekey ~/.bttc/data/bttc/nodekey -writeaddress`。

例如

```sh
"enode://a8024075291c0dd3467f5af51a05d531f9e518d6cd229336156eb6545581859e8997a80bc679fdb7a3bd7473744c57eeb3411719b973b2d6c69eff9056c0578f@188.166.216.25:30303"
```

#### 設置Owner和Signer的密鑰

在BTTC，建議你保持Onwer和Signer Key的不同。

* Signer - 簽署checkpoint交易的地址。
* Owner - 進行staking交易的地址。

###### 生成一個delivery私鑰

你必須只在validator上生成一個delivery私鑰，不要在sentry節點上生成delivery私鑰。

要生成私鑰，請運行：

```sh
deliverycli generate-validatorkey ETHEREUM_PRIVATE_KEY
```

其中：

ETHEREUM_PRIVATE_KEY - 你的以太坊地址私鑰。

這將生成priv_validator_key.json，將生成的JSON文件移到delivery配置目錄中。

```sh
mv ./priv_validator_key.json ~/.deliveryd/config
```

###### 生成一BTTC keystore文件

你必須只在validator機器上生成一個BTTC keystore文件,不要在sentry節點生成BTTC keystore文件。

要生成私鑰，請運行：

```sh
deliverycli generate-keystore ETHEREUM_PRIVATE_KEY
```

其中

ETHEREUM_PRIVATE_KEY - 你的以太坊地址私鑰。

當提示時，設置密鑰庫文件的密碼, 這將生成一個 `UTC-<time>-<address> keystore`文件。

將生成的keystore文件移到BTTC配置目錄下。

```sh
mv ./UTC-<time>-<address> ~/.bttc/keystore/
```

###### 添加password.txt

在 ~/.bttc/password.txt 文件中添加BTTC keystore文件密碼。

###### 添加你的以太坊地址

編輯/etc/bttc/metadata，在metadata中，添加你的以太坊地址。

例如：

```sh
VALIDATOR_ADDRESS=0xca67a8D767e45056DC92384b488E9Af654d78DE2.
```

#### 啟動validator節點

至此，你必須：

* sentry上的delivery節點已完全同步並運行。
* sentry上的BTTC節點正在運行。
* 配置好validator上的delivery節點和BTTC節點。
* 你的Owner和Signer密鑰已配置。

###### 啟動delivery節點

現在你將在validator上啟動delivery節點,一旦delivery節點同步了，你將在validator上啟動BTTC節點。

* 啟動delivery服務:

```sh
    sudo service deliveryd start
```

* 啟動delivery rest-server:

```sh
    sudo service deliveryd-rest-server start
```

* 啟動delivery bridge:

```sh
    sudo service deliveryd-bridge start
```

* 檢查delivery服務日誌:

```sh
    journalctl -u deliveryd.service -f
```

* 檢查delivery rest-server的日誌:

```sh
    journalctl -u deliveryd-rest-server.service -f
```

* 檢查delivery橋的日誌:

```sh
    journalctl -u deliveryd-bridge.service -f
```

* 檢查delivery的同步狀態:

```sh
    curl localhost:26657/status
```

在輸出中，catching_up的值是:

* true - delivery節點正在同步。
* false - delivery節點已經完全同步了。

等待delivery節點完全同步。

###### 啟動BTTC節點

一旦validator上的delivery節點完全同步，啟動validator上的BTTC節點。

啟動BTTC服務:

```sh
sudo service bttc start
```

檢查BTTC服務日誌:

```sh
journalctl -u bttc.service -f
```

### 使用Binaries部署驗證人節點

本節將指導您使用從Binaries啟動和運行驗證人節點。

#### 先決條件

* 兩台機器--一台sentry和一台validator。
* 在sentry機和validator機上安裝build-essential。

    安裝命令：

```sh
    sudo apt-get install build-essential
```

* 在sentry和validator上安裝Go 1.15+。

    安裝命令：

```sh
    wget https://gist.githubusercontent.com/ssandeep/a6c7197811c83c71e5fead841bab396c/raw/e38212982ab8cdfc11776fa1a3aaf92b69e1cb15/go-install.sh

    bash go-install.sh

    sudo ln -nfs ~/.go/bin/go /usr/bin/go
```

* 在sentry機和validator機上安裝RabbitMQ。請參閱 "[下載和安裝 RabbitMQ](https://www.rabbitmq.com/download.html)"。

#### 概述

要運行一個驗證人節點，請做以下工作：

* 準備好兩台機器。
* 將delivery和BTTC的二進制文件安裝在sentry和validator上。
* 在sentry和validator上設置delivery和BTTC的節點文件。
* 在sentry和validator上設置delivery和BTTC服務。
* 配置sentry節點。
* 啟動sentry節點。
* 配置validator節點。
* 設置Owner和Signer的密鑰。
* 啟動validator節點。

#### 安裝二進制文件

注:

在sentry和validator上都要運行本節。

###### 安裝delivery

```sh
#Clone the delivery repository:
git clone https://github.com/bttcprotocol/delivery

#Install delivery:
make install

#Check the installation:
deliveryd version --long 
```

###### 安裝BTTCr

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

#### 設置節點文件

注:

在sentry和validator上都要運行本節。

###### 獲取 launch repository

```sh
#Clone the launch repository:
git clone https://github.com/bttcprotocol/launch
```

###### 設置目錄

####### sentry機器上

```sh
#Create a node directory:
mkdir -p node

#Copy the files and scripts from the launch directory to the node directory:
cp -rf launch/mainnet-v1/sentry/sentry ~/node
cp launch/mainnet-v1/service.sh ~/node
```

####### validator機器上

```sh
#Create a node directory:
mkdir -p node

#Copy the files and scripts from the launch directory to the node directory:
cp -rf launch/mainnet-v1/sentry/sentry ~/node
cp launch/mainnet-v1/service.sh ~/node
```

###### 設置網絡目錄

###### 設置delivery

```sh
#Change to the node directory:
cd ~/node/delivery
#Run the setup script:
bash setup.sh
```

###### 設置BTTC

```sh
#Change to the node directory:
cd ~/node/bttc
#Run the setup script:
bash setup.sh
```

#### 設置服務

注:

在sentry和validator上都要運行本節。

```sh
#Change to the node directory:
cd ~/node
#Run the setup script:
bash service.sh
#Copy the service file to the system directory:
sudo cp *.service /etc/systemd/system/
```

#### 配置sentry節點

登錄到sentry機。

###### 配置delivery節點

* 編輯 ~/.deliveryd/config/config.toml。

    在config.toml中，修改以下內容。

* moniker - 任何名稱。例如：moniker = "my-sentry-node"。
* seeds - 種子節點地址，由一個節點ID、一個IP地址和一個端口組成。
* pex - 將該值設置為 "true "以啟用對等體交換。例如：pex = true。
* private_peer_ids - 在驗證人機器上設置的delivery的節點ID。

    為了獲得validator上delivery的節點ID。登錄到validator上：

    運行 `deliveryd tendermint show-node-id`。

    例如：`private_peer_ids = "0ee1de0515f577700a6a4b6ad882eff1eb15f066"`。

* prometheus - 將該值設為true，以啟用Prometheus度量。例如：prometheus = true。
* max_open_connections - 將該值設置為100。例如：max_open_connections = 100。

###### 配置BTTC節點

* 編輯 ~/node/bttc/start.sh。

    在start.sh中，通過在末尾添加以下一行，添加由節點ID、IP地址和端口組成的啟動節點地址。

```sh
    --bootnodes "enode://0cb82b395094ee4a2915e9714894627de9ed8498fb881cec6db7c65e8b9a5bd7f2f25cc84e71e89d0947e51c76e85d0847de848c7782b13c0255247a6758178c@44.232.55.71:30303,enode://88116f4295f5a31538ae409e4d44ad40d22e44ee9342869e7d68bdec55b0f83c1530355ce8b41fbec0928a7d75a5745d528450d30aec92066ab6ba1ee351d710@159.203.9.164:30303,enode://3178257cd1e1ab8f95eeb7cc45e28b6047a0432b2f9412cff1db9bb31426eac30edeb81fedc30b7cd3059f0902b5350f75d1b376d2c632e1b375af0553813e6f@35.221.13.28:30303,enode://16d9a28eadbd247a09ff53b7b1f22231f6deaf10b86d4b23924023aea49bfdd51465b36d79d29be46a5497a96151a1a1ea448f8a8666266284e004306b2afb6e@35.199.4.13:30303,enode://ef271e1c28382daa6ac2d1006dd1924356cfd843dbe88a7397d53396e0741ca1a8da0a113913dee52d9071f0ad8d39e3ce87aa81ebc190776432ee7ddc9d9470@35.230.116.151:30303"
```

保存start.sh中的修改。

###### 配置防火牆

sentry節點機器必須對外開放以下端口 0.0.0.0/0。

* 22
* 26656
* 30303

#### 啟動sentry節點

你將首先啟動delivery節點,一旦delivery節點同步了，你將啟動BTTC節點。

###### 啟動delivery節點

* 啟動delivery服務:

```sh
    sudo service deliveryd start
```

* 啟動delivery rest-server:

```sh
    sudo service deliveryd-rest-server start
```

* 檢查delivery服務日誌:

```sh
    journalctl -u deliveryd.service -f
```

* 檢查delivery rest-server的日誌:

```sh
    journalctl -u deliveryd-rest-server.service -f
```

* 檢查delivery的同步狀態:

```sh
    curl localhost:26657/status
```

  在輸出中，catching_up的值是。

* true - delivery節點正在同步。
* false - delivery節點已經完全同步了。

等待delivery節點完全同步。

###### 啟動BTTC節點

一旦delivery節點被完全同步，啟動BTTC節點。

###### 啟動BTTC服務

```sh
sudo service bttc start
```

###### 檢查BTTC服務日誌

```sh
journalctl -u bttc.service -f
```

#### 配置validator節點

###### 配置delivery節點

登錄到遠程validator機器上。

編輯 `~/.deliveryd/config/config.toml`，在config.toml中，改變以下內容。

* moniker - 任何名稱。例如：moniker = "my-validator-node"。
* pex - 將該值設為false，以禁用對等體交換。例如：pex = false。
* private_peer_ids - 將該值注釋掉以禁用它。例子。# private_peer_ids = ""。
* persistent_peers - sentry機上設置的delivery的節點ID和sentry機的IP地址。

    為了獲得delivery在sentry機上的節點ID。登錄到sentry機上。

    運行`deliveryd tendermint show-node-id`。

    Example: `persistent_peers = "7d2adb45aa20fdcf053c0e3b8209eb781e501b46@188.166.216.25:26656"`.

* prometheus - 將該值設為true，以啟用Prometheus度量。例子：prometheus = true。

編輯 `~/.deliveryd/config/delivery-config.toml`，在delivery-config.toml中，修改以下內容。

* eth_rpc_url - 一個完全同步的Ethereum主網節點的RPC端點。Example: eth_rpc_url = "[https://nd-123-456-789.p2pify.com/60f2a23810ba11c827d3da642802412a](https://nd-123-456-789.p2pify.com/60f2a23810ba11c827d3da642802412a)"
* bsc_rpc_url- 一個完全同步的bsc主網節點的RPC端點.Example:bsc_rpc_url = "[https://data-seed-prebsc-1-s2.binance.org:8545](https://data-seed-prebsc-1-s2.binance.org:8545)"
* tron_rpc_url- tron主網節點的rpc端點，用來發送交易到這個端點。Example:tron_rpc_url = "47.252.19.181:50051"
* tron_grid_url -tron主網節點的事件服務,用來查詢事件日誌.Example:tron_grid_url = "http://47.252.35.194:8547"

###### 配置BTTC節點

編輯 `~/.bttc/data/bttc/static-nodes.json`，在 static-nodes.json 中，修改以下內容。

使用"<enode://sentry_machine_enodeID@sentry_machine_ip:30303>"替換在sentry節點機器上設置的BTTC的節點ID和IP地址。

要獲得sentry節點上BTTC的節點ID，登錄到sentry機上。

運行 `bootnode -nodekey ~/.bttc/data/bttc/nodekey -writeaddress`。

例如

```sh
"enode://a8024075291c0dd3467f5af51a05d531f9e518d6cd229336156eb6545581859e8997a80bc679fdb7a3bd7473744c57eeb3411719b973b2d6c69eff9056c0578f@188.166.216.25:30303".
```

#### 設置Owner和Signer的密鑰

在BTTC，建議你保持Onwer和Signer Key的不同。

* Signer - 簽署checkpoint交易的地址。
* Owner - 進行staking交易的地址。

###### 生成一個delivery私鑰

你必須只在validator上生成一個delivery私鑰，不要在sentry節點上生成delivery私鑰。

要生成私鑰，請運行：

```sh
deliverycli generate-validatorkey ETHEREUM_PRIVATE_KEY
```

其中：

ETHEREUM_PRIVATE_KEY - 你的以太坊地址私鑰。

這將生成priv_validator_key.json，將生成的JSON文件移到delivery配置目錄中。

```sh
mv ./priv_validator_key.json ~/.deliveryd/config
```

###### 生成一個BTTC keystore文件

你必須只在validator機器上生成一個BTTC keystore文件,不要在sentry節點生成BTTC keystore文件。

要生成私鑰，請運行：

```sh
deliverycli generate-keystore ETHEREUM_PRIVATE_KEY
```

其中

ETHEREUM_PRIVATE_KEY - 你的以太坊地址私鑰。

當提示時，設置密鑰庫文件的密碼, 這將生成一個 `UTC-<time>-<address> keystore`文件。

將生成的keystore文件移到BTTC配置目錄下。

```sh
mv ./UTC-<time>-<address> ~/.bttc/keystore/
```

###### 添加password.txt

在 `~/.bttc/password.txt` 文件中添加BTTC keystore文件密碼。

###### 添加你的以太坊地址

編輯/etc/bttc/metadata，在metadata中，添加你的以太坊地址。

例如

```sh
VALIDATOR_ADDRESS=0xca67a8D767e45056DC92384b488E9Af654d78DE2.
```

#### 啟動validator節點

至此，你必須：

* sentry上的delivery節點已完全同步並運行。
* sentry上的BTTC節點正在運行。
* 配置好validator上的delivery節點和BTTC節點。
* 你的Owner和Signer密鑰已配置。

###### 啟動delivery節點

現在你將在validator上啟動delivery節點,一旦delivery節點同步了，你將在validator上啟動BTTC節點。

* 啟動delivery服務:

```sh
    sudo service deliveryd start
```

* 啟動delivery rest-server:

```sh
    sudo service deliveryd-rest-server start
```

* 啟動delivery bridge:

```sh
    sudo service deliveryd-bridge start
```

* 檢查delivery服務日誌:

```sh
    journalctl -u deliveryd.service -f
```

* 檢查delivery rest-server的日誌:

```sh
    journalctl -u deliveryd-rest-server.service -f
```

* 檢查delivery橋的日誌:

```sh
    journalctl -u deliveryd-bridge.service -f
```

* 檢查delivery的同步狀態:

```sh
    curl localhost:26657/status
```

在輸出中，catching_up的值是:

* true - delivery節點正在同步。
* false - delivery節點已經完全同步了。

等待delivery節點完全同步。

###### 啟動BTTC節點

一旦validator上的delivery節點完全同步，啟動validator上的BTTC節點。

啟動BTTC服務:

```sh
sudo service bttc start
```

檢查BTTC服務日誌:

```sh
journalctl -u bttc.service -f
```

## Fullnode部署

### 系統要求

- 內存：32G
- CPU：16核心
- 存儲：700G固態硬盤（可擴展）

### 部署節點

我們創建了一個Ansible playbook來部署全節點。

- Ansible需要Python3.x版本來安裝，使用pip3 install ansible來安裝Python3依賴項以及ansible。

- 需要檢查用於部署的機器上沒有安裝Go。如果已經安裝，那麼通過ansible設置全節點時會遇到一些問題，因為ansible需要安裝特定的Go包

- 刪除任何之前的BTTC的配置。

- 確保您有權訪問正在設置完整節點的遠程計算機或 VM。

- `git clone https://github.com/bttcprotocol/node-ansible`

- `cd node-ansible`

- 編輯inventory.yml文件並在該sentry->hosts部分插入您的 IP 。

```yml
all:
  hosts:
  children:
    sentry:
      hosts:
        xxx.xxx.xx.xx: # <----- Add IP for sentry node
        xxx.xxx.xx.xx: # <----- Add IP for second sentry node (optional)
    validator:
      hosts:
        xxx.xxx.xx.xx: # <----- Add IP for validator node
```

示例如下

```yml
all:
  hosts:
  children:
    sentry:
      hosts:
        188.166.216.25:
    validator:
      hosts:
```

- 通過運行檢查遠程機器是否可訪問 ansible sentry -m ping
- 要進行測試運行以確認是否配置了正確的遠程機器/VM，請運行以下命令：

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bttc_branch=v0.2.7 delivery_branch=v0.2.2  network_version=mainnet-v1 node_type=sentry/sentry delivery_network=mainnet" --list-hosts
```

它應該輸出您配置的遠程機器IP。

- 使用以下命令設置節點

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bttc_branch=v0.2.7 delivery_branch=v0.2.2  network_version=mainnet-v1 node_type=sentry/sentry delivery_network=mainnet"
```

- 如果遇到問題，可以用以下命令刪除並清理所有配置

```sh
ansible-playbook -l sentry playbooks/clean.yml
```

- 登錄到遠程機器

- 在`~/.bttc/config/config.toml`配置如下內容

```toml
moniker=<enter unique identifier> seeds="TBD:SEEDS
```

- 將下面的flag添加到`~/node/bor/bttc-start.sh`的bttc啟動參數中

```sh
--bootnodes "enode://0cb82b395094ee4a2915e9714894627de9ed8498fb881cec6db7c65e8b9a5bd7f2f25cc84e71e89d0947e51c76e85d0847de848c7782b13c0255247a6758178c@44.232.55.71:30303,enode://88116f4295f5a31538ae409e4d44ad40d22e44ee9342869e7d68bdec55b0f83c1530355ce8b41fbec0928a7d75a5745d528450d30aec92066ab6ba1ee351d710@159.203.9.164:30303"
```

- 如果您希望開啟trace，在`~/node/bttc/start.sh`的bttc啟動參數中添加如下參數`--gcmode 'archive'`

### 啟動節點和服務

#### 運行全節點

- 啟動中間層驗證人 `sudo service delivery start`

- 啟動中間層驗證人 `rest server：sudo service deliveryd-rest-server start`

- 同步中間層驗證人後，運行以下命令：`sudo service bttc start`

#### 查看日誌

- 查看中間層驗證人日誌：`journalctl -u delivery.service -f`

- 查看中間層驗證人rest server日誌：`journalctl -u deliveryd-rest-server.service -f`

- 查看BTTC日誌：`journalctl -u bttc.service -f`

#### 端口/防火牆設置

在節點防火牆上向所有人 `(0.0.0.0/0)` 開放端口 22、26656 和 30303。其他端口都應該關閉。