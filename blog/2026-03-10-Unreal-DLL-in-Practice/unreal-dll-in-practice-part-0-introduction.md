---
slug: unreal-dll-in-practice-part-0-introduction
title: 【Unreal & DLL 實戰系列】第零篇
authors: [supinzhen]
tags: [unreal-engine]
date: 2026-03-10
---

# 【Unreal & DLL 實戰系列】第零篇

故事開始於我嘗試把一個第三方函式庫直接塞進 Unreal Plugin，結果完全不意外，專案瞬間炸裂。

{/* truncate */}

那一刻我才真正意識到：如果要把外部庫整合進 Unreal，又不想讓整個專案變成依賴地獄，勢必要找一個更乾淨、穩定、可維護的方式。

於是我開始研究把第三方程式碼包成 **Wrapper DLL** ——用一組簡單的 C 風格介面，把 Unreal 與外部世界隔離開來。選擇 C 介面的原因很單純：**C ABI 穩定、跨編譯器與跨語言都比較友善。** 這種做法不但能保留效能，也能把 ABI、例外處理、記憶體管理等高風險問題鎖在 DLL 裡，讓 Plugin 的生命週期更可控、部署更輕鬆。

也因為這次的踩雷經驗，我決定做一個完整的練習專案，採用「**第三方函式庫 → Wrapper DLL → Unreal Plugin**」的分層架構。從理解 DLL 的角色、建立一個簡單的第三方測試函式庫、將其包成 DLL，到最後在 Unreal Engine 中建立 Plugin 並成功呼叫 DLL 裡的功能，完整走一遍乾淨整合的流程。

這系列將會變分成五篇文章：

- [第一篇：先從 DLL 說起](https://supinzhen.github.io/pzn-dev/notes/unreal-dll-in-practice-part-1-concepts-and-system-design)
- [第二篇：第三方函式庫、Wrapper DLL 與 Unreal](https://supinzhen.github.io/pzn-dev/notes/unreal-dll-in-practice-part-2-responsibilities-of-the-third-party-library-wrapper-dll-and-unreal-plugin)
- [第三篇：Third‑Party Library](https://supinzhen.github.io/pzn-dev/notes/unreal-dll-in-practice-part-3-third-party-library)
- [第四篇：Wrapper DLL](https://supinzhen.github.io/pzn-dev/notes/unreal-dll-in-practice-part-4-wrapper-dll)
- [第五篇：Unreal Engine 專案與 Third Party Plugin 建置](https://supinzhen.github.io/pzn-dev/notes/unreal-dll-in-practice-part-5-building-unreal-engine-projects-and-thirdparty-plugins)

讓我們開始吧。