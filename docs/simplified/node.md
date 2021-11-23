# 节点部署

## 相关依赖及工具

- Git v2.30.1
- g++
- Go 1.16 +
- Nodejs v11.0
- Rabbitmq(latest stable version)

## 编译安装Delivery和BTTC二进制包

### clone delivery代码

```sh
git clone https://github.com/bttcprotocol/delivery.git
```

### 安装delivery

```sh
cd delivery
make install
```

### clone BTTC代码

```sh
git clone https://github.com/bttcprotocol/bttc
```

### 安装BTTC

```sh
cd bttc
make bttc
```

## 安装bttc-cli脚本

::: tip NOTE
当bttc-cli有更新时，请先卸载本地旧版本，再重新安装最新版本。
:::

```sh
npm uninstall -g bttc-cli
npm install -g @tronnetwork/bttc-cli
```

### 检查bttc-cli版本

```sh
bttc-cli -V
```

## 部署节点

使用如下命令初始化节点目录：

```sh
bttc-cli setup devnet
```

然后依次填写以下问题，请注意主网和测试网的区别

### BTTC主网（199）

### BTTC测试网（）

运行上述脚本后，会生成如下的node目录

![image]()