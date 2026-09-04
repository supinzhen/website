---
sidebar_position: 1
---

# Unreal Reflection System
C++ 本身沒有 runtime reflection，而 Unreal 透過 UObject 系統 + UHT（Unreal Header Tool）+ 巨集（UCLASS / UPROPERTY / UFUNCTION） 建立了自己的反射系統，使程式碼能：
- 被引擎識別
- 被序列化
- 被 Garbage Collection 追蹤
- 被 Blueprint 使用
- 被網路複製

## Unreal Engine Class Hierarchy

``` C++
Object //base class for all unreal objects
   Actor // Objects that can be placed or spawn in the world.
        Pawn // actors that can be controlled by players or AI
            Character //pawn that implements walking movement
```

### Object (UObject, Base Type)

Object 是 Unreal Engine 中**最基礎的類別**，所有類別都是由 Object 所衍伸出來的，他提供了很多功能，並且只可在遊戲線程(GameThread)中訪問。

功能包含：
- 記憶體管理(Memory Management)
- 垃圾回收(Garbage Collection)
- 反射系統(Reflection System)
- 序列化(Serialization)：告訴引擎這個變數是暫時的，不要被序列化（儲存）。
- 網路連線(Networking)

### Actor (AActor)
Actor 衍伸自 UObject，他代表所有可以在遊戲地圖中被放置或產生(Spawn)的 Object，不管它是 Static 還是 Moveable。比如武器、一道牆、一顆子彈等。

### Pawn (APawn)
Pawn 衍伸自 Actor，他是讓 AI 或 真人玩家可以 **控制(Control)** 的實體，與 Actor 最大的差異是，Pawn 通常與 Controller 有關，會接收某種輸入。

### Character (ACharacter)
Character 是 Pawn 的子類別，包含了 Walking Movement，通常是給玩家或 NPC 使用。

## Unreal Prefixes
Unreal 要求類別名稱必須有統一的前綴：
- **U - Object**
  - UObject -> UDataAsset
- **A - Actor 及其衍伸類別**
  - AActor -> AMyCar
- **F - Structs 或 Non-UObject 及其衍伸類別**
  - FExplosionParameters, FArchieve
- **E - Enums 及其衍伸類別**
  - EExplosionType
- **I - Interfaces 及其衍伸類別**
- **T - Template 及其衍伸類別**
  - TMyTemplateClass, TUniquePointer\<T\>

:::tip[啟用 Reflection System] 

- #include "MyCode.generated.h" //要放在 include 的最後一行
- 加上標記，class 需要標上 UCLASS()，Struct 標上 USTRUCT()，Enum 標上 UENUM()。
- GENERATED_BODY()

:::

## Reflection Macros
這些巨集負責告訴 UHT (Unreal Header Tool) 一些我們想要設定的東西，UBT (Unreal Builder Tool) 也會參考這裡的設定。
- [**UCLASS**](https://dev.epicgames.com/documentation/unreal-engine/objects-in-unreal-engine)
  - UCLASS 巨集會將一個 C++ 類別註冊進 Unreal 的反射系統，讓引擎知道這個類別是基於 UObject 的 Unreal 類型。
  - 每個 UCLASS 都會建立並維護一個 **Class Default Object（CDO）**。CDO 是由建構子產生的「預設模板物件」，代表該類別的初始狀態，之後不再被修改。所有物件的初始值都會從 CDO 複製而來。
  - UCLASS 與 CDO 都可以從任意 UObject instance 取得：
    - GetClass() → 取得 UClass（類別的反射資料）
    - GetClass()->GetDefaultObject() → 取得 CDO
  - UCLASS 只會列出被反射系統標記的成員：
    - 一個 UObject 類別可以包含一般 C++ 成員（native-only properties）。
    - 但只有**使用 UPROPERTY 或 UFUNCTION 標記的成員才會被加入反射系統**，並出現在對應的 UCLASS 中。
    - 未標記的成員：
      - 不會被 Blueprint 看見
      - 不會被序列化
      - 不會被 GC 追蹤
      - 不會出現在編輯器
- [**UPROPERTY**](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-uproperties)
  - 不能宣告在不是 UClass 的類別
  - 讓 GC 能追蹤這個變數，避免被誤刪。
  - 支援的設定：
    - EditAnywhere：任何地方都能改（Blueprint、Details、Defaults）。
    - EditDefaultOnly：只能改預設參數。
    - VisibleAnywhere：任何地方都可以看到，但是不能改。
    - Replicated：網路同步（Network Replication），需要其他程式碼輔助才能達到此功能。
    - Transient：不會存入 UAsset 檔案、不保留複製值、反序列化時重設。
- [**UFUNCTION**](https://dev.epicgames.com/documentation/unreal-engine/ufunctions-in-unreal-engine)
  - 給函式用的。
  - 支援的設定：
    - BlueprintCallable：可以被 Blueprint 或 Level Blueprint 呼叫與執行的函式。
    - BlueprintCosmetic：不可以被 Dedicated server 執行的函式。
    - Server：在 **Server 端**被執行。宣告的方式為，在函式名稱後面加上 _Implementation。(要搭配 Reliable(保證到達) / Unreliable(不保證到達) 使用)
    - Client：由 Server 呼叫，並在 **Client 端**執行。宣告的方式為，在函式名稱後面加上 _Implementation。(要搭配 Reliable(保證到達) / Unreliable(不保證到達) 使用)
    - NetMulticast：在 Server 端與 Client 端都被執行。
- [**USTRUCT**](https://dev.epicgames.com/documentation/unreal-engine/structs-in-unreal-engine)
  - 支援的設定：BlueprintType
- [**UENUM**](https://dev.epicgames.com/documentation/unreal-engine/metadata-specifiers-in-unreal-engine)
  - 支援的設定：BlueprintType


## 資料來源
- Professional Game Development in C++ and Unreal Engine
- [Unreal engine class hierarchy](https://www.flogamedev.fr/2023/03/08/unreal-engine-class-hierarchy/)
- [C++ Introduction to Unreal Engine for Programmers - Reflection](https://dev.epicgames.com/community/learning/courses/45V/c-introduction-to-unreal-engine-for-programmers/98Oz/unreal-engine-reflection)
- [Unreal Engine Documentation - UFunctions](https://dev.epicgames.com/documentation/unreal-engine/ufunctions-in-unreal-engine)