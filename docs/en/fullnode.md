# Full Node Deployment

## System Requirements

* Memory: 32G
* CPU: 8 cores
* Storage: 700G solid state drive (expandable)

## Node Deployment

We created an Ansible playbook to automate the deployment of complete nodes.

* To install Ansible, use `pip3 install ansible` to install Python3 dependencies and ansible.

* Ensure that Go is not installed on the machine that will be used for deployment. If it is already installed, you will run into issues when setting up a full node via ansible, as ansible requires the installation of a specific Go package.

* Erase any previous BTTC configuration.

* Ascertain that you have access to the remote computer or virtual machine where the full node is being deployed. For additional information, see TBD:NODE-ANSIBLE.

* clone TBD:NODE-ANSIBLE

* `cd node-ansible`

* In the `sentry->hosts` section of the `inventory.yml` file, edit the `inventory.yml` file and add your IP address. For additional information, see TBD:NODE-ANSIBLE.

* Run `ansible sentry -m ping` to determine whether the remote machine can be accessed.

* To perform a test run to confirm whether the correct remote machine/VM is configured, run the following command:

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bor_branch=v0.2.7 heimdall_branch=v0.2.2  network_version=mainnet-v1 node_type=sentry/sentry heimdall_network=mainnet" --list-hosts
```

This will show the IP of your remote machine.

* Use the following command to set up the node

```sh
ansible-playbook -l sentry playbooks/network.yml --extra-var="bor_branch=v0.2.7 heimdall_branch=v0.2.2 network_version=mainnet-v1 node_type=sentry/sentry heimdall_network=mainnet"
```

* If you encounter problems, you can use the following command to delete and clean up all configurations

```sh
ansible-playbook -l sentry playbooks/clean.yml
```

* Log in to the remote machine

* Configure the following content in `~/.bttc/config/bttc-config.toml`

```conf
moniker=<enter unique identifier> seeds="TBD:SEEDS
```

* Add the following flag to `~/node/bor/start.sh` the `bor` startup parameters

```sh
--bootnodes "enode: //0cb82b395094ee4a2915e9714894627de9ed8498fb881cec6db7c65e8b9a5bd7f2f25cc84e71e89d0947e51c76e85d0847de848c7782b13c0255247a6758178c@44.232.55.71: 30303, enode: //88116f4295f5a31538ae409e4d44ad40d22e44ee9342869e7d68bdec55b0f83c1530355ce8b41fbec0928a7d75a5745d528450d30aec92066ab6ba1ee351d710@159.203.9.164: 30303"
```

* If you want to enable trace, add the following parameters to the `bor` startup parameters of `~/node/bor/start.sh`

```sh
--gcmode'archive'
```

## Node & Service Startup

Use the following command to run the full-node TBD: 启动命令中名字

* Mid-tier validator: `sudo service heimdalld start`

* Mid-tier validator rest server: `sudo service heimdalld-rest-server start`

* After synchronizing the middle-tier validator, run the following command: `sudo service bor start`

### Checking logs

* Mid-tier validator: `journalctl -u heimdalld.service -f`

* Mid-tier validator rest server: `journalctl -u heimdalld-rest-server.service -f`

* BTTC: `journalctl -u bor.service -f`

### Port/firewall configuration

Open ports `22`, `26656`, and `30303` on the node firewall to everyone `0.0.0.0/0`. All other ports should be closed.
