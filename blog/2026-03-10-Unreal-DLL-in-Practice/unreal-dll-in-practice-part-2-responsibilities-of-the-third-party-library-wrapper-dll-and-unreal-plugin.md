---
slug: unreal-dll-in-practice-part-2-responsibilities-of-the-third-party-library-wrapper-dll-and-unreal-plugin
title: 【Unreal & DLL 實戰系列】第二篇 —— 第三方函式庫、Wrapper DLL 與 Unreal Plugin 的分工
authors: [supinzhen]
tags: [unreal-engine]
date: 2026-03-10
---

# 【Unreal & DLL 實戰系列】第二篇 —— 第三方函式庫、Wrapper DLL 與 Unreal Plugin 的分工

對 DLL 的角色與「為什麼不把第三方原始碼直接塞進 Unreal Plugin」有了初步認識之後，在正式進入實作前，我們先把整個專案的系統架構釐清。這能讓後續的 DLL 包裝、C API 設計與 Unreal Plugin 整合都有明確的方向。

{/* truncate */}

## 系統架構設計

整體資料流如下：

在 Unreal Engine 專案中直接整合大型第三方 C++ 函式庫，往往會遇到建置系統差異、巨集衝突、編譯旗標不一致等問題。尤其是像 Boost、nmos-cpp、FFmpeg、ST 2110 SDK 這類模板密集、依賴複雜的專案，若直接納入 Unreal 的 Build.cs，整合與維護成本會急遽上升。

為了避免這些風險，本專案採用「第三方函式庫 → Wrapper DLL → Unreal Plugin」的三層式架構，並以 `extern "C"` 的 C API 作為唯一溝通介面。這個設計能在 Unreal 與外部程式庫之間建立清楚的 binary boundary，讓第三方依賴可以獨立管理與升級，同時降低 ABI 衝突、巨集污染與編譯時間等問題，提升整體系統的穩定性與可維護性。

整體資料流如下：

```
[ Third-Party Library ]
          ↓
     Wrapper DLL
          ↓
    Unreal Plugin
          ↓
    Unreal Engine
```

在此架構中，第三方函式庫的所有複雜依賴（如 Boost、asio 或其他 SDK）皆封裝於 Wrapper DLL 內部；Unreal Plugin 僅透過穩定的 C API 與 DLL 溝通，而不直接包含第三方原始碼或標頭。為了讓整個流程更容易理解，本專案將以自行建立的第三方函式庫作為示範，完整走過封裝、匯出與整合的過程。

這個分層設計的核心目的是降低 Unreal 編譯環境與外部函式庫之間的耦合度，避免巨集衝突、ABI 不相容與建置系統差異所帶來的整合風險，並讓第三方依賴能以更工程化的方式管理。

### 各層職責

**Third-Party Library**

- 實作實際功能邏輯
- 可自由使用現代 C++ 與外部依賴
- 由獨立建置系統（如 CMake）編譯

**Wrapper DLL**

- 封裝第三方函式庫
- 對外僅匯出 `extern "C"` 的 C API
- 隱藏內部 C++ 類別與相依
- 作為 Unreal 與第三方之間的隔離層

**Unreal Plugin**

- 負責 DLL 載入與生命週期管理
- 透過 function pointer 呼叫 C API
- 提供 Unreal 端可用的高階介面
- 處理封裝後的錯誤與日誌

好的，就讓我們開始吧。