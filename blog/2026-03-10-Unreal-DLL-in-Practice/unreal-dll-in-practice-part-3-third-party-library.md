---
slug: unreal-dll-in-practice-part-3-third-party-library
title: 【Unreal & DLL 實戰系列】第三篇 —— Third-Party Library
authors: [supinzhen]
tags: [unreal-engine]
date: 2026-03-10
---


# 【Unreal & DLL 實戰系列】第三篇 —— Third-Party Library

在開始封裝 DLL 與設計 C API 之前，我們需要一個可以被包裝的「第三方函式庫」。

{/* truncate */}

第三方庫通常具備以下特性：

- 使用 C++ 類別與物件狀態
- 具有多個方法與邏輯
- 可能需要輸出字串或處理緩衝區
- 內部依賴其他標頭或外部套件
- 不能直接暴露給 Unreal（因為 ABI、巨集、編譯旗標等問題）

為了讓整個流程更容易理解，本章將建立一個**小而完整、具代表性**的示範函式庫。後續章節會將它包成 DLL，並在 Unreal Plugin 中載入、呼叫與管理生命週期。

這個示範函式庫刻意具備三種「真實第三方庫常見的特性」：

- **內部狀態（Multiplier）**：展示 DLL 內部物件如何跨 API 管理生命週期
- **計算邏輯（Multiply）**：展示一般 C++ 方法如何被包裝
- **字串輸出（Hello）**：展示跨 DLL 邊界的緩衝區管理與字串傳遞

這些特性會在後續 DLL 封裝與 C API 設計中逐一示範。

首先會需要建立一個資料夾，裡面包含兩個檔案`ThirdPartyTest.h` 與  `ThirdPartyTest.cpp`，資料夾結構如下：

```powershell
+---ThirdPartyTest
|   ThirdPartyTest.h
|   ThirdPartyTest.cpp
```

### ThirdPartyTest.h 的內容如下：

```cpp
#pragma once
#include <string>

class ThirdPartyTestProcessor
{
public:
    ThirdPartyTestProcessor();

    // Set the internal multiplier; demonstrates a stateful object
    void SetMultiplier(int m);

    // Perform multiplication using the internal multiplier
    int Multiply(int value) const;

    // Write "Hello, <name>!" into the caller-provided buffer
    // - name: input name
    // - outBuffer: buffer provided by the caller
    // - bufferSize: size of the buffer (including the '\0')
    // Returns the actual required string length (excluding '\0')
    int Hello(const char* name, char* outBuffer, int bufferSize) const;

private:
    int Multiplier = 1;
};
```

`ThirdPartyTest.h` 定義了一個名為 `ThirdPartyTestProcessor` 的類別。這個類別具有一個整數型態的內部成員 `Multiplier`，用來示範有狀態物件的存在。它提供三個公開方法：`SetMultiplier` 用於設定內部狀態，`Multiply` 使用該狀態進行計算，而 `Hello` 則負責將格式化字串寫入呼叫端提供的緩衝區。

### ThirdPartyTest.cpp 的內容如下：

```cpp
#include "ThirdPartyTest.h"
#include <sstream>
#include <string>
#include <cstring>  // std::strncpy

ThirdPartyTestProcessor::ThirdPartyTestProcessor()
    : Multiplier(1)
{
}

void ThirdPartyTestProcessor::SetMultiplier(int m)
{
    Multiplier = m;
}

int ThirdPartyTestProcessor::Multiply(int value) const
{
    return value * Multiplier;
}

int ThirdPartyTestProcessor::Hello(const char* name, char* outBuffer, int bufferSize) const
{
    std::string msg = "Hello, " + std::string(name) + "!";
    int required = static_cast<int>(msg.size());

    if (bufferSize > 0)
        strncpy_s(outBuffer, bufferSize, msg.c_str(), _TRUNCATE);

    return required;
}
```

雖然這個類別看起來小小的，但它在後續章節會扮演非常核心的角色。

- **在 DLL 章節**
我們會把這個 C++ 類別包進 DLL 裡，並替它設計一組 `extern "C"` 的 C API。
其中包含：
    - C++ 類別怎麼轉成 C 介面
    - DLL 裡的物件要怎麼建立、保存、銷毀
    - 字串與緩衝區跨 DLL 邊界時要注意什麼
- **在 Unreal Plugin 章節**
我們會從 Unreal 動態載入 DLL，抓出 function pointer，然後真的呼叫它。
其中包含：
    - Unreal 怎麼安全地呼叫外部 DLL
    - 錯誤處理與日誌要怎麼做
    - 如何把 DLL 的功能包成 Blueprint-friendly API
- **在整個系列的架構中**
它扮演「真實第三方庫」的角色，但又不會複雜到讓人迷路。
這讓我們可以專注在 DLL 與 Unreal 整合的流程，而不是被第三方庫本身的細節拖住。

換句話說，這個類別就是我們後面所有章節的共同基礎。

你會一直看到它、一直用到它，直到整個 DLL → Plugin 的流程跑完。