# Node Deployment

## Node overview

### Validator node (Validator)

The validator node (validator) is mainly responsible for synchronizing pledges, deposits and withdrawals and other events, and is also responsible for submitting checkpoints to the main network.

The validator node is also a super node in the BitTorrent-Chain layer.

To apply to become a verifier, please refer to: [How to Become a Validator](https://bttc.zendesk.com/hc/en-us/articles/4408443786905-How-to-Become-a-Validator)

### Full Node (FullNode)

A full node is a participant of the BTTC network. Anyone can synchronize the BTTC network block and broadcast transactions by deploying the BTTC full node. At the same time, the full node contains all the block data of the BTTC network.

## Validator Node deployment

### Getting Started

To participate and become a verifier by running a node on the BitTorrent-chain, you can follow the documentation below.

### Recommended configuration

* 64 GiB of memory
* 16 core CPU (m5d.4xlarge or OVH's infra-3)
* Minimum 1TB SSD (make sure it is extendable)
* 1Gb/s Bandwidth (expect 3-5 TB data transferred per month)

### Run a Validator Node with Ansible

#### Prerequisites

* Three machines — one local machine on which you will run the Ansible playbook; two remote machines — one sentry and one validator.
* On the local machine, Ansible installed.
* On the local machine, Python 3.x installed.
* On the remote machines, make sure Go is _not_ installed.
* On the remote machines, your local machine's SSH public key is on the remote machines to let Ansible connect to them.

#### Overview

To get to a running validator node, do the following:

1. Have the three machines prepared.
2. Set up a sentry node through Ansible.
3. Set up a validator node through Ansible.
4. Configure the sentry node.
5. Start the sentry node.
6. Configure the validator node.
7. Set the owner and signer keys.
8. Start the validator node.
9. Check node health with the community.

#### Set up the sentry node

On your local machine, clone the [node-ansible repository](https://github.com/bttcprotocol/node-ansible):

```sh
git clone https://github.com/bttcprotocol/node-ansible
```

Change to the cloned repository:

```sh
cd node-ansible
```

Add the IP addresses of the remote machines that will become a sentry node and a validator node to the inventory.yaml file.

```yaml
all:

 hosts:

 children:

   sentry:

     hosts:

       xxx.xxx.xx.xx: # ----- Add IP for sentry node_

       xxx.xxx.xx.xx: # ----- Add IP for second sentry node (optional)_

   validator:

     hosts:

       xxx.xxx.xx.xx: # ----- Add IP for validator node_
```

Example:

```yaml
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

Check that the remote sentry machine is reachable. On the local machine, run `ansible sentry -m ping`:

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

###### Do a test run of the sentry node setup

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bttc_branch=v0.2.9 delivery_branch=v0.2.3  network_version=mainnet-v1 node_type=sentry/sentry delivery_network=mainnet" --list-hosts
```

###### Run the sentry node setup

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bttc_branch=v0.2.9 delivery_branch=v0.2.3  network_version=mainnet-v1 node_type=sentry/sentry delivery_network=mainnet"
```

Once the setup is complete, you will see a message of completion on the terminal.

###### Set up the validator node

At this point, you have the sentry node set up.

On your local machine, you also have the Ansible playbook set up to run the validator node setup.

Check that the remote validator machine is reachable. On the local machine, run `ansible validator -m ping`:

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

Do a test run of the validator node setup:

```sh
ansible-playbook -l validator playbooks/network.yml --extra-var="bttc_branch=v0.2.9 delivery_branch=v0.2.3 network_version=mainnet-v1 node_type=sentry/validator delivery_network=mainnet" --list-hosts
```

Run the validator node setup:

```sh
ansible-playbook -l validator playbooks/network.yml --extra-var="bttc_branch=v0.2.9 delivery_branch=v0.2.3  network_version=mainnet-v1 node_type=sentry/validator delivery_network=mainnet"
```

Once the setup is complete, you will see a message of completion on the terminal.

###### Configure the sentry node

Login to the remote sentry machine.

####### Configure the delivery node

Open for editing `~/.deliveryd/config/config.toml`.

In config.toml, change the following:

* moniker — any name. Example: moniker = "my-sentry-node".
* seeds — the seed node addresses consisting of a node ID, an IP address, and a port. \
Use the following values:
* seeds="f4f605d60b8ffaaf15240564e58a81103510631c@159.203.9.164:26656,4fb1bc820088764a564d4f66bba1963d47d82329@44.232.55.71:26656,2eadba4be3ce47ac8db0a3538cb923b57b41c927@35.199.4.13:26656,3b23b20017a6f348d329c102ddc0088f0a10a444@35.221.13.28:26656,25f5f65a09c56e9f1d2d90618aa70cd358aa68da@35.230.116.151:26656"
* pex — set the value to true to enable the peer exchange. Example: pex = true.
* private_peer_ids — the node ID of delivery set up on the validator machine. \
To get the node ID of delivery on the validator machine:
    1. Login to the valdator machine.
    2. Run deliveryd tendermint show-node-id.
* Example: private_peer_ids = "0ee1de0515f577700a6a4b6ad882eff1eb15f066".
* prometheus — set the value to true to enable the Prometheus metrics. Example: prometheus = true.
* max_open_connections — set the value to 100. Example: max_open_connections = 100.

Save the changes in config.toml.

####### Configure the BTTC node

Open for editing `~/node/bttc/start.sh`.

In start.sh, add the boot node addresses consisting of a node ID, an IP address, and a port by adding the following line at the end:

```sh
--bootnodes "enode://0cb82b395094ee4a2915e9714894627de9ed8498fb881cec6db7c65e8b9a5bd7f2f25cc84e71e89d0947e51c76e85d0847de848c7782b13c0255247a6758178c@44.232.55.71:30303,enode://88116f4295f5a31538ae409e4d44ad40d22e44ee9342869e7d68bdec55b0f83c1530355ce8b41fbec0928a7d75a5745d528450d30aec92066ab6ba1ee351d710@159.203.9.164:30303,enode://3178257cd1e1ab8f95eeb7cc45e28b6047a0432b2f9412cff1db9bb31426eac30edeb81fedc30b7cd3059f0902b5350f75d1b376d2c632e1b375af0553813e6f@35.221.13.28:30303,enode://16d9a28eadbd247a09ff53b7b1f22231f6deaf10b86d4b23924023aea49bfdd51465b36d79d29be46a5497a96151a1a1ea448f8a8666266284e004306b2afb6e@35.199.4.13:30303,enode://ef271e1c28382daa6ac2d1006dd1924356cfd843dbe88a7397d53396e0741ca1a8da0a113913dee52d9071f0ad8d39e3ce87aa81ebc190776432ee7ddc9d9470@35.230.116.151:30303"
```

Save the changes in start.sh.

Open for editing `~/.bttc/data/bttc/static-nodes.json`.

In static-nodes.json, change the following:

* Use "<enode://sentry_machine_enodeID@sentry_machine_ip:30303>" to replace the node ID and IP address of the BTTC set on the sentry node machine.

To get the node ID of BTTC on the validator machine:
    1. Login to the valdator machine.
    2. Run `bootnode -nodekey ~/.bttc/data/bttc/nodekey -writeaddress`.

* Example:

```sh
"enode://410e359736bcd3a58181cf55d54d4e0bbd6db2939c5f548426be7d18b8fd755a0ceb730fe5cf7510c6fa6f0870e388277c5f4c717af66d53c440feedffb29b4b@134.209.100.175:30303".
```

Save the changes in static-nodes.json.

####### Configure firewall

The sentry machine must have the following ports open to the world 0.0.0.0/0:

* 22
* 26656
* 30303

###### Start the sentry node

You will first start the delivery node. Once the delivery node syncs, you will start the BTTC node.

####### Start the delivery node

Start the delivery service:

```sh
sudo service deliveryd start
```

Start the delivery rest-server:

```sh
sudo service deliveryd-rest-server start
```

Check the delivery service logs:

```sh
journalctl -u deliveryd.service -f
```

Check the delivery rest-server logs:

```sh
journalctl -u deliveryd-rest-server.service -f
```

Check the sync status of delivery:

```sh
curl localhost:26657/status
```

In the output, the catching_up value is:

* true — the delivery node is syncing.
* false — the delivery node is fully synced.

Wait for the delivery node to fully sync.

####### Start the BTTCr node

Once the delivery node is fully synced, start the BTTC node.

Start the BTTC service:

```sh
sudo service bttc start
```

Check the BTTC service logs:

```sh
journalctl -u bttc.service -f
```

###### Configure the validator node

####### Configure the delivery node

Login to the remote validator machine.

Open for editing `~/.deliveryd/config/config.toml`.

In config.toml, change the following:

* moniker — any name. Example: moniker = "my-validator-node".
* pex — set the value to false to disable the peer exchange. Example: pex = false.
* private_peer_ids — comment out the value to disable it. Example: # private_peer_ids = "".
* persistent_peers — the node ID of delivery set up on the sentry machine and the IP address of the sentry machine. \

To get the node ID of delivery on the sentry machine:
    1. Login to the sentry machine.
    2. Run deliveryd tendermint show-node-id.

* Example: persistent_peers = "7d2adb45aa20fdcf053c0e3b8209eb781e501b46@188.166.216.25:26656".
* prometheus — set the value to true to enable the Prometheus metrics. Example: prometheus = true.

Save the changes in config.toml.

Open for editing `~/.deliveryd/config/delivery-config.toml`.

In delivery-config.toml, change the following:

* eth_rpc_url — an RPC endpoint for a fully synced Ethereum mainnet node. Example: eth_rpc_url = "[https://nd-123-456-789.p2pify.com/60f2a23810ba11c827d3da642802412a](https://nd-123-456-789.p2pify.com/60f2a23810ba11c827d3da642802412a)"
* bsc_rpc_url- — an RPC endpoint for a fully synced BSC mainnet node. 

    Example: bsc_rpc_url = "[https://data-seed-prebsc-1-s2.binance.org:8545](https://data-seed-prebsc-1-s2.binance.org:8545)"

* tron_rpc_url — an RPC endpoint for a fully synced Tron mainnet node. 

    Example: tron_rpc_url = "47.252.19.181:50051"

* tron_grid_url - event service for Tron mainnet node, used to query event logs.Example:tron_grid_url = "http://47.252.35.194:8547"

Save the changes in delivery-config.toml.

####### Configure the BTTC node

Open for editing ~/.bttc/data/bttc/static-nodes.json.

In static-nodes.json, change the following:

* Use "<enode://sentry_machine_enodeID@sentry_machine_ip:30303>" to replace the node ID and IP address of the BTTC set on the sentry node machine.

To get the node ID of BTTC on the sentry machine:
    1. Login to the sentry machine.
    2. Run bootnode -nodekey ~/.bttc/data/bttc/nodekey -writeaddress.

* Example:

```sh
"enode://a8024075291c0dd3467f5af51a05d531f9e518d6cd229336156eb6545581859e8997a80bc679fdb7a3bd7473744c57eeb3411719b973b2d6c69eff9056c0578f@188.166.216.25:30303".
```

Save the changes in static-nodes.json.

###### Set the owner and signer key

On BTTC, it is recommended that you keep the owner and signer keys different.

* Signer — the address that signs the checkpoint transactions. The recommendation is to keep at least 1 ETH on the signer address.
* Owner — the address that does the staking transactions. The recommendation is to keep the bttc tokens on the owner address.

####### Generate a delivery private key

You must generate a delivery private key only on the validator machine. Do not generate a delivery private key on the sentry machine.

To generate the private key, run:部署验证人节点

deliverycli generate-validatorkey ETHEREUM_PRIVATE_KEY

where

* ETHEREUM_PRIVATE_KEY — your Ethereum address private key.

This will generate priv_validator_key.json. Move the generated JSON file to the delivery configuration directory:

```sh
mv ./priv_validator_key.json ~/.deliveryd/config
```

####### Generate a BTTC keystore file

You must generate a BTTC keystore file only on the validator machine. Do not generate a BTTC keystore file on the sentry machine.

To generate the private key, run:

deliverycli generate-keystore ETHEREUM_PRIVATE_KEY

where

* ETHEREUM_PRIVATE_KEY — your Ethereum address private key.

When prompted, set up a password to the keystore file.

This will generate a `UTC-<time>-<address> keystore` keystore file.

Move the generated keystore file to the BTTC configuration directory:

```sh
mv ./UTC-<time>-<address> ~/.bttc/keystore/
```

####### Add password.txt

Add the BTTC keystore file password in the `~/.bttc/password.txt` file.

####### Add your Ethereum address

Open for editing /etc/bttc/metadata.

In metadata, add your Ethereum address. Example:

```sh
 VALIDATOR_ADDRESS=0xca67a8D767e45056DC92384b488E9Af654d78DE2.
```

Save the changes in metadata.

###### Start the validator node

At this point, you must have:

* The delivery node on the sentry machine fully synced and running.
* The BTTC node on the sentry machine running.
* The delivery node and the BTTC node on the validator machine configured.
* Your owner and signer keys configured.

####### Start the delivery node

You will now start the delivery node on the validator machine. Once the delivery node syncs, you will start the BTTC node on the validator machine.

Start the delivery service:

```sh
sudo service deliveryd start
```

Start the delivery rest-server:

```sh
sudo service deliveryd-rest-server start
```

Start the delivery bridge:

```sh
sudo service deliveryd-bridge start
```

Check the delivery service logs:

```sh
journalctl -u deliveryd.service -f
```

Check the delivery rest-server logs:

```sh
journalctl -u deliveryd-rest-server.service -f
```

Check the delivery bridge logs:

```sh
journalctl -u deliveryd-bridge.service -f
```

Check the sync status of delivery:

```sh
curl localhost:26657/status
```

In the output, the catching_up value is:

* true — the delivery node is syncing.
* false — the delivery node is fully synced.

Wait for the delivery node to fully sync.

####### Start the BTTC node

Once the delivery node on the validator machine is fully synced, start the BTTC node on the validator machine.

Start the BTTC service:

```sh
sudo service bttc start
```

Check the BTTC service logs:

```sh
journalctl -u bttc.service -f
```

### Run a Validator Node from Binaries

#### Prerequisites

* Two machines — one sentry and one validator.
* build-essential installed on both the sentry and the validator machines. \
To install:
* `sudo apt-get install build-essential`
* Go 1.15+ installed on both the sentry and the validator machines. \
To install:

```sh
wget https://gist.githubusercontent.com/ssandeep/a6c7197811c83c71e5fead841bab396c/raw/e38212982ab8cdfc11776fa1a3aaf92b69e1cb15/go-install.sh \
bash go-install.sh \
sudo ln -nfs ~/.go/bin/go /usr/bin/go
```

* RabbitMQ installed on both the sentry and the validator machines. See [Downloading and Installing RabbitMQ](https://www.rabbitmq.com/download.html).

#### To get to a running validator node, do the following

1. Have the two machines prepared.
2. Install the delivery and bttc binaries on the sentry and the validator machines.
3. Set up the delivery and bttc node files on the sentry and the validator machines.
4. Set up the delivery and bttc services on the sentry and the validator machines.
5. Configure the sentry node.
6. Start the sentry node.
7. Configure the validator node.
8. Set the owner and signer keys.
9. Start the validator node.
10. Check node health with the community.

#### Install binaries

NOTE:Run this section both on the sentry and the validator machines.

###### Install delivery

Clone the [delivery repository](https://github.com/bttcprotocol/delivery/):

```sh
git clone https://github.com/bttcprotocol/delivery
```

Install delivery:

```sh
make install
```

Check the installation:

```sh
deliveryd version --long
```

###### Install bttc

Clone the bttc repository:

```sh
git clone https://github.com/bttcprotocol/bttc
```

Install bttc:

```sh
make bttc-all
```

Create symlinks:

```sh
sudo ln -nfs ~/bttc/build/bin/bttc /usr/bin/bttc

sudo ln -nfs ~/bttc/build/bin/bootnode /usr/bin/bootnode
```

Check the installation:

```sh
bttc version
```

#### Set up node files

NOTE:Run this section both on the sentry and the validator machines.

###### Fetch the launch repository

Clone the [launch repository](https://github.com/bttcprotocol/launch):

```sh
git clone https://github.com/bttcprotocol/launch
```

###### Set up the launch directory

####### On the sentry machine

Create a node directory:

```sh
mkdir -p node
```

the files and scripts from the launch directory to the node directory:

```sh
cp -rf launch/mainnet-v1/sentry/sentry ~/node

cp launch/mainnet-v1/service.sh ~/node
```

####### On the validator machine

Create a node directory:

```sh
mkdir -p node
```

the files and scripts from the launch directory to the node directory:

```sh
cp -rf launch/mainnet-v1/sentry/validator ~/node

cp launch/mainnet-v1/service.sh ~/node
```

###### Set up the network directories

NOTE:Run this section both on the sentry and the validator machines.

####### Set up delivery

Change to the node directory:

```sh
cd ~/node/delivery
```

Run the setup script:

```sh
bash setup.sh
```

####### Set up bttc

Change to the node directory:

```sh
cd ~/node/bttc
```

Run the setup script:

```sh
bash setup.sh
```

#### Set up the services

NOTE:Run this section both on the sentry and the validator machines.

Change to the node directory:

```sh
cd ~/node
```

Run the setup script:

```sh
bash service.sh
```

the service file to the system directory:

```sh
sudo cp *.service /etc/systemd/system/
```

#### Configure the sentry node

Login to the remote sentry machine.

###### Configure the delivery node

Open for editing `~/.deliveryd/config/config.toml`.

In config.toml, change the following:

* moniker — any name. Example: moniker = "my-sentry-node".
* seeds — the seed node addresses consisting of a node ID, an IP address, and a port. \
Use the following values:
* seeds="f4f605d60b8ffaaf15240564e58a81103510631c@159.203.9.164:26656,4fb1bc820088764a564d4f66bba1963d47d82329@44.232.55.71:26656,2eadba4be3ce47ac8db0a3538cb923b57b41c927@35.199.4.13:26656,3b23b20017a6f348d329c102ddc0088f0a10a444@35.221.13.28:26656,25f5f65a09c56e9f1d2d90618aa70cd358aa68da@35.230.116.151:26656"
* pex — set the value to true to enable the peer exchange. Example: pex = true.
* private_peer_ids — the node ID of delivery set up on the validator machine. \
To get the node ID of delivery on the validator machine:
    1. Login to the valdator machine.
    2. Run deliveryd tendermint show-node-id.
* Example: private_peer_ids = "0ee1de0515f577700a6a4b6ad882eff1eb15f066".
* prometheus — set the value to true to enable the Prometheus metrics. Example: prometheus = true.
* max_open_connections — set the value to 100. Example: max_open_connections = 100.

Save the changes in config.toml.

###### Configure the bttc node

Open for editing `~/node/bttc/start.sh`.

In start.sh, add the boot node addresses consisting of a node ID, an IP address, and a port by adding the following line at the end:

```sh
--bootnodes "enode://0cb82b395094ee4a2915e9714894627de9ed8498fb881cec6db7c65e8b9a5bd7f2f25cc84e71e89d0947e51c76e85d0847de848c7782b13c0255247a6758178c@44.232.55.71:30303,enode://88116f4295f5a31538ae409e4d44ad40d22e44ee9342869e7d68bdec55b0f83c1530355ce8b41fbec0928a7d75a5745d528450d30aec92066ab6ba1ee351d710@159.203.9.164:30303,enode://3178257cd1e1ab8f95eeb7cc45e28b6047a0432b2f9412cff1db9bb31426eac30edeb81fedc30b7cd3059f0902b5350f75d1b376d2c632e1b375af0553813e6f@35.221.13.28:30303,enode://16d9a28eadbd247a09ff53b7b1f22231f6deaf10b86d4b23924023aea49bfdd51465b36d79d29be46a5497a96151a1a1ea448f8a8666266284e004306b2afb6e@35.199.4.13:30303,enode://ef271e1c28382daa6ac2d1006dd1924356cfd843dbe88a7397d53396e0741ca1a8da0a113913dee52d9071f0ad8d39e3ce87aa81ebc190776432ee7ddc9d9470@35.230.116.151:30303"
```

Save the changes in start.sh.

###### Configure firewall

The sentry machine must have the following ports open to the world 0.0.0.0/0:

* 22
* 26656
* 30303

#### Start the sentry node

You will first start the delivery node. Once the delivery node syncs, you will start the bttc node.

###### Start the delivery node

Start the delivery service:

```sh
sudo service deliveryd start
```

Start the delivery rest-server:

```sh
sudo service deliveryd-rest-server start
```

Check the delivery service logs:

```sh
journalctl -u deliveryd.service -f
```

####### Check the delivery rest-server logs

```sh
journalctl -u deliveryd-rest-server.service -f
```

Check the sync status of delivery:

```sh
curl localhost:26657/status
```

In the output, the catching_up value is:

* true — the delivery node is syncing.
* false — the delivery node is fully synced.

Wait for the delivery node to fully sync.

###### Start the bttc node

Once the delivery node is fully synced, start the bttc node.

Start the bttc service:

```sh
sudo service bttc start
```

Check the bttc service logs:

```sh
journalctl -u bttc.service -f
```

#### Configure the validator node

###### Configure the delivery node

Login to the remote validator machine.

Open for editing `~/.deliveryd/config/config.toml`.

In config.toml, change the following:

* moniker — any name. Example: moniker = "my-validator-node".
* pex — set the value to false to disable the peer exchange. Example: pex = false.
* private_peer_ids — comment out the value to disable it. Example: # private_peer_ids = "".
* persistent_peers — the node ID of delivery set up on the sentry machine and the IP address of the sentry machine. \
To get the node ID of delivery on the sentry machine:
    1. Login to the sentry machine.
    2. Run deliveryd tendermint show-node-id.
* Example: persistent_peers = "7d2adb45aa20fdcf053c0e3b8209eb781e501b46@188.166.216.25:26656".
* prometheus — set the value to true to enable the Prometheus metrics. Example: prometheus = true.

Save the changes in config.toml.

Open for editing ~/.deliveryd/config/delivery-config.toml.

In delivery-config.toml, change the following:

* eth_rpc_url — an RPC endpoint for a fully synced Ethereum mainnet node. Example: eth_rpc_url = "[https://nd-123-456-789.p2pify.com/60f2a23810ba11c827d3da642802412a](https://nd-123-456-789.p2pify.com/60f2a23810ba11c827d3da642802412a)"
* bsc_rpc_url- — an RPC endpoint for a fully synced BSC mainnet node.

     Example: bsc_rpc_url = "[https://data-seed-prebsc-1-s2.binance.org:8545](https://data-seed-prebsc-1-s2.binance.org:8545)"

* tron_rpc_url — an RPC endpoint for a fully synced Tron mainnet node. 

    Example: tron_rpc_url = "47.252.19.181:50051"

* tron_grid_url - event service for Tron mainnet node, used to query event logs.Example:tron_grid_url = "[http://47.252.35.194:8547](http://47.252.35.194:8547)"

Save the changes in delivery-config.toml.

###### Configure the bttc node

Open for editing `~/.bttc/data/bttc/static-nodes.json`.

In static-nodes.json, change the following:

* Use "<enode://sentry_machine_enodeID@sentry_machine_ip:30303>" to replace the node ID and IP address of the BTTC set on the sentry node machine.
To get the node ID of bttc on the sentry machine:
    1. Login to the sentry machine.
    2. Run bootnode -nodekey ~/.bttc/data/bttc/nodekey -writeaddress.
* Example

```sh
 "enode://a8024075291c0dd3467f5af51a05d531f9e518d6cd229336156eb6545581859e8997a80bc679fdb7a3bd7473744c57eeb3411719b973b2d6c69eff9056c0578f@188.166.216.25:30303".
```

Save the changes in static-nodes.json.

#### Set the owner and signer key

On BTTC, it is recommended that you keep the owner and signer keys different.

* Signer — the address that signs the checkpoint transactions. The recommendation is to keep at least 1 ETH on the signer address.
* Owner — the address that does the staking transactions. The recommendation is to keep the bttc tokens on the owner address.

###### Generate a delivery private key

You must generate a delivery private key only on the validator machine. Do not generate a delivery private key on the sentry machine.

To generate the private key, run:

```sh
deliverycli generate-validatorkey ETHEREUM_PRIVATE_KEY
```

where

* ETHEREUM_PRIVATE_KEY — your Ethereum address private key.

This will generate priv_validator_key.json. Move the generated JSON file to the delivery configuration directory:

```sh
mv ./priv_validator_key.json ~/.deliveryd/config
```

###### Generate a bttc keystore file

You must generate a bttc keystore file only on the validator machine. Do not generate a bttc keystore file on the sentry machine.

To generate the private key, run:

deliverycli generate-keystore ETHEREUM_PRIVATE_KEY

where

* ETHEREUM_PRIVATE_KEY — your Ethereum address private key.

When prompted, set up a password to the keystore file.

This will generate a `UTC-<time>-<address> keystore` keystore file.

Move the generated keystore file to the bttc configuration directory:

```sh
mv ./UTC-<time>-<address> ~/.bttc/keystore/
```

###### Add password.txt

Add the bttc keystore file password in the `~/.bttc/password.txt` file.

###### Add your Ethereum address

Open for editing /etc/bttc/metadata.

In metadata, add your Ethereum address. Example:

```sh
VALIDATOR_ADDRESS=0xca67a8D767e45056DC92384b488E9Af654d78DE2.
```

Save the changes in metadata.

#### Start the validator node

At this point, you must have:

* The delivery node on the sentry machine fully synced and running.
* The bttc node on the sentry machine running.
* The delivery node and the bttc node on the validator machine configured.
* Your owner and signer keys configured.

###### Start the delivery node

You will now start the delivery node on the validator machine. Once the delivery node syncs, you will start the bttc node on the validator machine.

Start the delivery service:

```sh
sudo service deliveryd start
```

Start the delivery rest-server:

```sh
sudo service deliveryd-rest-server start
```

Start the delivery bridge:

```sh
sudo service deliveryd-bridge start
```

Check the delivery service logs:

```sh
journalctl -u deliveryd.service -f
```

Check the delivery rest-server logs:

```sh
journalctl -u deliveryd-rest-server.service -f
```

Check the delivery bridge logs:

```sh
journalctl -u deliveryd-bridge.service -f
```

Check the sync status of delivery:

```sh
curl localhost:26657/status
```

In the output, the catching_up value is:

* true — the delivery node is syncing.
* false — the delivery node is fully synced.

Wait for the delivery node to fully sync.

###### Start the bttc node

Once the delivery node on the validator machine is fully synced, start the bttc node on the validator machine.

Start the bttc service:

```sh
sudo service bttc start
```

Check the bttc service logs:

```sh
journalctl -u bttc.service -f
```

## Fullnode Deployment

### System Requirements

- Memory: 32G
- CPU: 16 cores
- Storage: 700G solid state drive (expandable)

### Node Deployment

We created an Ansible playbook to deploy full nodes.

- Ansible requires Python3.x version to install, use `pip3 install ansible` to install Python3 dependencies and ansible.

- You should ensure that Go is not installed on the deployment machine. If it is already installed, you will run into issues when setting up a full node via ansible, as ansible requires the installation of a specific Go package.

- Delete any previous BTTC configuration.

- Make sure you have access to the remote computer or VM where you are setting up a full node.

- `git clone https://github.com/bttcprotocol/node-ansible`

- `cd node-ansible`

- Edit the `inventory.yml` file and insert your IP in the sentry->hosts section.

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

The example is as follows

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

- Check whether the remote machine can be accessed by running `ansible sentry -m ping`

- To verify that the remote machine/VM is configured correctly, run the following command:

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bttc_branch=v0.2.7 delivery_branch=v0.2.2 network_version=mainnet-v1 node_type=sentry/sentry delivery_network=mainnet" --list-hosts
```

It should output the remote machine IP you configured.

- Use the following command to set up the node

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bttc_branch=v0.2.7 delivery_branch=v0.2.2 network_version=mainnet-v1 node_type=sentry/sentry delivery_network=mainnet"
```

- If you encounter difficulties, the following command will delete and clean up all configurations.

```sh
ansible-playbook -l sentry playbooks/clean.yml
```

- Log in to the remote machine

- Configure the following content in `~/.bttc/config/config.toml`

```toml
moniker=<enter unique identifier> seeds="TBD:SEEDS
```

- Add the following flag to the bttc startup parameters of `~/node/bor/bttc-start.sh`

```sh
--bootnodes "enode: //0cb82b395094ee4a2915e9714894627de9ed8498fb881cec6db7c65e8b9a5bd7f2f25cc84e71e89d0947e51c76e85d0847de848c7782b13c0255247a6758178c@44.232.55.71: 30303, enode: //88116f4295f5a31538ae409e4d44ad40d22e44ee9342869e7d68bdec55b0f83c1530355ce8b41fbec0928a7d75a5745d528450d30aec92066ab6ba1ee351d710@159.203.9.164: 30303"
```

- If you want to enable trace, add the following parameter `--gcmode'archive'` to the bttc startup parameters of `~/node/bttc/start.sh`

### Start nodes and services

#### Run full node

- Start the middle-tier validator `sudo service delivery start`

- Start the middle-tier verifier `rest server: sudo service deliveryd-rest-server start`

- After synchronizing the middle-tier verifier, run the following command: `sudo service bttc start`

#### View log

- View the middle-tier validator log: `journalctl -u delivery.service -f`

- View the middle-tier validator rest server log: `journalctl -u deliveryd-rest-server.service -f`

- View BTTC log: `journalctl -u bttc.service -f`

#### Port/Firewall Settings

Open ports 22, 26656 and 30303 to everyone `(0.0.0.0/0)` on the node firewall. All other ports should be closed.
