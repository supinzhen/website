---
sidebar_position: 1
---

# AI 與 AI Agent 
## LLM (Large Language Model) 大型語言模型
大型語言模型是以大量資料預訓練的深度學習模型，能理解字詞、語法與上下文，並生成語言內容。
例如：ChatGPT、Gemini、Claude 等。

LLM 的運作方式可以簡化成：

```text

Input -> LLM -> Output

```

他有幾個特性：

1. 雖然是使用非常大量的資料去訓練，但是**他不會知道特定的資料**，比如他不會知道個人資訊或公司內部的資料。
2. 被動：需要人類提供輸入，它才會產生輸出。
3. 本身不具備流程能力，只能回答問題或生成內容。

## AI Workflow
AI Workflow 是在 LLM 外再提供工具與流程，讓模型能使用外部資訊來解決問題。

例如：
你給 LLM 一個「查詢 Google Calendar」的工具，並告訴它遇到行程相關問題時可以使用這個工具。

流程就會變成：

```text

Input -> LLM -> Output
         | ^
         v |
   Calender, Notion etc..

```

由於所有的流程都是人類做的，因次如果我問了一個跟流程毫不相關的問題，比如"今天天氣如何?"，LLM 就會不知所措。

:::tip[RAG(Retrieval-Augmented Generation) 檢索增強生成]

在大型語言模型回答問題之前，會先參考訓練資料以外的權威知識庫（文件、資料庫、公司內部資料），再讓模型生成答案。原本的大型語言模型透過大量的訓練資料達成理解語意、文法等，用於回覆問題或翻譯。而 RAG 則可以使大型語言模型檢索特定的知識或內部資料，讓語言模型擁有特定領域的知識，而不需要重新訓練模型。

:::

## AI Agent

AI Agent 是再往下一步，不只讓 AI 使用工具，而是讓 AI 自己決定流程、規劃步驟、執行行動。

AI Agent 需要具備：
- Reasoning（推理）：思考下一步該做什麼
- Acting（行動）：使用工具、呼叫 API、執行任務
- React Framework（ReAct 框架）：在推理與行動之間反覆迭代

```text

Input -> LLM(Reason) -> LLM(Act) -> ... ... -> LLM(Reason) -> LLM(Act)-> Output

```

n8n 內建 AI Agent 能力，可以讓流程不再完全由人類定義，而是由 AI 自主決策。

# 相關資源

1. [Run n8n in AWS Cloud! (FREE for a year!) How to host n8n on Amazon Web Services with traefik](https://youtu.be/J7vZhqQmDOA)
2. [AI Agents, Clearly Explained](https://youtu.be/FwOTs4UxQS4)
3. [什麼是 LLM (大型語言模型)？](https://aws.amazon.com/tw/what-is/large-language-model/)