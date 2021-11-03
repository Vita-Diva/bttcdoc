# Fullnode部署

## 系统要求

- 内存：32G
- CPU：16核心
- 存储：700G固态硬盘（可扩展）

## 部署节点

我们创建了一个Ansible playbook来部署全节点。

- Ansible需要Python3.x版本来安装，使用pip3 install ansible来安装Python3依赖项以及ansible。

- 需要检查用于部署的机器上没有安装Go。如果已经安装，那么通过ansible设置全节点时会遇到一些问题，因为ansible需要安装特定的Go包

- 删除任何之前的BTTC的配置。

- 确保您有权访问正在设置完整节点的远程计算机或 VM。

- `git clone https://github.com/bttcprotocol/node-ansible`

- `cd node-ansible`

- 编辑inventory.yml文件并在该sentry->hosts部分插入您的 IP 。

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

- 通过运行检查远程机器是否可访问 ansible sentry -m ping
- 要进行测试运行以确认是否配置了正确的远程机器/VM，请运行以下命令：

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bttc_branch=v0.2.7 delivery_branch=v0.2.2  network_version=mainnet-v1 node_type=sentry/sentry delivery_network=mainnet" --list-hosts
```

它应该输出您配置的远程机器IP。

- 使用以下命令设置节点

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bttc_branch=v0.2.7 delivery_branch=v0.2.2  network_version=mainnet-v1 node_type=sentry/sentry delivery_network=mainnet"
```

- 如果遇到问题，可以用以下命令删除并清理所有配置

```sh
ansible-playbook -l sentry playbooks/clean.yml
```

- 登录到远程机器

- 在`~/.bttc/config/config.toml`配置如下内容

```toml
moniker=<enter unique identifier> seeds="TBD:SEEDS
```

- 将下面的flag添加到`~/node/bor/bttc-start.sh`的bttc启动参数中

```sh
--bootnodes "enode://0cb82b395094ee4a2915e9714894627de9ed8498fb881cec6db7c65e8b9a5bd7f2f25cc84e71e89d0947e51c76e85d0847de848c7782b13c0255247a6758178c@44.232.55.71:30303,enode://88116f4295f5a31538ae409e4d44ad40d22e44ee9342869e7d68bdec55b0f83c1530355ce8b41fbec0928a7d75a5745d528450d30aec92066ab6ba1ee351d710@159.203.9.164:30303"
```

- 如果您希望开启trace，在`~/node/bttc/start.sh`的bttc启动参数中添加如下参数`--gcmode 'archive'`

## 启动节点和服务

### 运行全节点

- 启动中间层验证人 `sudo service delivery start`

- 启动中间层验证人 `rest server：sudo service deliveryd-rest-server start`

- 同步中间层验证人后，运行以下命令：`sudo service bttc start`

### 查看日志

- 查看中间层验证人日志：`journalctl -u delivery.service -f`

- 查看中间层验证人rest server日志：`journalctl -u deliveryd-rest-server.service -f`

- 查看BTTC日志：`journalctl -u bttc.service -f`

### 端口/防火墙设置

在节点防火墙上向所有人 `(0.0.0.0/0)` 开放端口 22、26656 和 30303。其他端口都应该关闭。
