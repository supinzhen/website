---
sidebar_position: 3
---

# 後續研究方向

## GPU Direct

- 研究 Rivermax 與 GPUDirect 的整合方式，評估是否能讓影像資料直接在 GPU 與 NIC 之間傳輸，減少 CPU 介入。
- 測試 Unreal Engine 在啟用 GPUDirect 時的延遲改善幅度，並確認不同 GPU/NIC/Driver 組合的相容性。

## NMOS for Rivermax（IS‑04 / IS‑05）

- 研究 Rivermax 是否能透過 NMOS API 與現有的 Broadcast Controller（如 Cerebrum、VSM、Evertz Magnum）進行自動化註冊與路由。
- 建立 UE → NMOS → 2110 Receiver 的完整控制流程，讓 Unreal Engine 成為可被 NMOS 管理的「Sender Node」。
- 評估是否能將 Unreal Engine 的 2110 Stream Metadata（Format、Framerate、Colorimetry）自動同步到 NMOS Registry。

## ST 2022‑7 Seamless Switching

- 研究 Unreal Engine + Rivermax 是否能同時輸出 **A/B 雙路 2110 Stream**，以支援 2022‑7 的無縫切換。
- 測試接收端（如 AJA Kona IP、Grass Valley、Imagine、Sony）在 2022‑7 下的切換延遲與容錯能力。
- 探索是否能在 UE 內部建立「雙編碼路徑」或「雙 NIC」架構，以支援高可靠度的 Live Production Pipeline。