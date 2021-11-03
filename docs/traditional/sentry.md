# Fullnode部署

## 系統要求

- 內存：32G
- CPU：16核心
- 存儲：700G固態硬盤（可擴展）

## 部署節點

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

## 啟動節點和服務

### 運行全節點

- 啟動中間層驗證人 `sudo service delivery start`

- 啟動中間層驗證人 `rest server：sudo service deliveryd-rest-server start`

- 同步中間層驗證人後，運行以下命令：`sudo service bttc start`

### 查看日誌

- 查看中間層驗證人日誌：`journalctl -u delivery.service -f`

- 查看中間層驗證人rest server日誌：`journalctl -u deliveryd-rest-server.service -f`

- 查看BTTC日誌：`journalctl -u bttc.service -f`

### 端口/防火牆設置

在節點防火牆上向所有人 `(0.0.0.0/0)` 開放端口 22、26656 和 30303。其他端口都應該關閉。