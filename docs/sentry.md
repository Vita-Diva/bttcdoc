# Fullnode Deployment

## System Requirements

- Memory: 32G
- CPU: 16 cores
- Storage: 700G solid state drive (expandable)

## Node Deployment

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

## Start nodes and services

### Run full node

- Start the middle-tier validator `sudo service delivery start`

- Start the middle-tier verifier `rest server: sudo service deliveryd-rest-server start`

- After synchronizing the middle-tier verifier, run the following command: `sudo service bttc start`

### View log

- View the middle-tier validator log: `journalctl -u delivery.service -f`

- View the middle-tier validator rest server log: `journalctl -u deliveryd-rest-server.service -f`

- View BTTC log: `journalctl -u bttc.service -f`

### Port/Firewall Settings

Open ports 22, 26656 and 30303 to everyone `(0.0.0.0/0)` on the node firewall. All other ports should be closed.
