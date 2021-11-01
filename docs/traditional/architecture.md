# BTTC架構

BTTC是一個高效的區塊鏈應用平台。

我們將會在各個TRON上部署多套用於管理質押的合約，與參與到BTTC網絡中的驗證者一起，確保平台PoS機制的運行。 TRON將是BTTC支持的第一個basechain，但BTTC的生態將不僅於此，我們將根據社區的建議，為更多的公共區塊鏈提供支持。

BTTC具有三層架構：

1. TRON上的智能合約（質押鏈）

2. 驗證層

3. BTTC側鏈

![image](../pics/architecture.jpg)

## BTTC智能合約

BTTC在TRON上部署了一套智能合約，管理下面的事務：

+ PoS層質押

+ 驗證者份額委託

+ 側鏈checkpoint

## PoS驗證層

驗證節點與TRON上的質押合約協同工作，以在BTTC網絡上啟用PoS機制。我們使用了TenderMint引擎並在其之上進行了必要的修改。驗證層負責區塊驗證，出塊者選擇以及提交CheckPoint等各種重要任務。

驗證層將側鏈生產的區塊聚合成默克爾樹，並定期將其發送至TRON。這種定期發送的內容就是checkpoint。對於側鏈上的每幾個區塊，一個驗證層節點需要：

+ 驗證上個checkpoint之後的所有區塊

+ 創建基於區塊哈希的默克爾樹

+ 將默克爾根（merkle root）發送至TRON

checkpoint非常重要，有下面兩個原因：

+ 在提取資產時提供燃燒證明

+ 在TRON上提供終結性

下面是對上述過程的整體描述：

+ 一部分活躍的驗證者將被選出，作為下一個區間的出塊者。出塊者的選舉需要獲得2/3的同意票。這些驗證者將負責生產區塊，並將這些區塊廣播到整個網絡。

+ 每個checkpoint包含了給定區間內的所有區塊的根。驗證節點需要驗證這些根，並在通過驗證之後對其簽名。

+ 一名提議人將在驗證者中產生。提議人負責收集特定checkpoint的所有簽名，並將這些簽名提交到TRON上。

+ 每個驗證者獲得出塊以及提交檢查點權力的概率，取決於該驗證者的權益比重。

## 區塊生產層（側鏈）

BTTC的區塊生產層負責將交易打包進區塊中。

驗證層的委員會定期選出下一個span中的產塊者。區塊由側鏈的節點產生，並且側鏈的虛擬機與以太坊虛擬機完全兼容。驗證層節點會周期性的驗證側鏈區塊，一個包含數個區塊默克爾哈希的checkpoint也會被周期性的提交到TRON上。