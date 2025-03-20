---
title: "淺談pre-commit如何讓開發流程更加有條理"
description: "讓pre-commit為你省下一些檢查的時間"
slug: precommit_intro
date: 2025-03-29 18:00:00+0800
image: cover.jpg
categories:
    - blogs
    - python
tags:
    - blogs
    - Python
    - pre-commit
    - version control
    - git
    - GitHub
    - GitLab
    - Docker Compose

---

## 前言

在軟體開發流程爭，Git、CI/CD、或是DevOps都是大家耳熟能詳的名詞以及概念。透過版本控制以及分支管理，可以讓團隊合作更加順暢；在版本控制之上，加入了DevOps後，能讓整體測試以及交付的流程更加順利且自動化。不過在這些之上，其實還是有一些團隊合作時，不得不面對的挑戰。例如：A成員跟B成員的Coding Style不同，又或是一些開發規範不一定能很好的被落實，都是團隊合作時可能會發生的問題。或許讀者會說：「那在CI流程中加入更多測試不就好了？」，但如果能在更早期的階段就避免這個問題，何樂不為？所以今天將為各位介紹`pre-commit`，一個能夠在`commit`時執行檢查，提供錯誤報告，並且能夠整合到CI/CD流程中的一個好用工具。

## 什麼事pre-commit？

[pre-commit](https://pre-commit.com/#plugins)是一個可以協助使用者在使用版本控制工具時，簡化檢查流程並提升可靠性的一個工具。藉由`pre-commit`所提供的功能，當使用者在`commit`新的版本時，會自動觸發`pre-commit`並執行預定的各項檢查，包含但不限於：程式碼格式、是否有隱私或是金鑰資訊存在、或是內容是否符合規範。使用者可以使用開源社群提供的工具，也可以自行撰寫，並讓`pre-commit`來執行。

## 如何安裝`pre-commit`？

`pre-commit`的安裝非常簡單，只要使用`pip`指令安裝即可。

```shell
pip install precommit
```

## 如何設定`pre-commit`?

要使用`pre-commit`之前，需要進行兩個動作，分別為：

1. 撰寫設定
2. 安裝設定

接下來我們將示範一次如何進行。

### 撰寫設定

`pre-commit`工具有提供一個指令`pre-commit sample-config`，協助使用者產生範例設定。設定檔案名稱必須為`.pre-commit-config.yaml`。我們可以使用以下使令來產生設定檔案：

```shell
pre-commit sample-config > .pre-commit-config.yaml
```

執行後，我們可以查看生成的檔案內容：

```text
# See https://pre-commit.com for more information
# See https://pre-commit.com/hooks.html for more hooks
repos:
-   repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v3.2.0
    hooks:
    -   id: trailing-whitespace
    -   id: end-of-file-fixer
    -   id: check-yaml
    -   id: check-added-large-files
```

在範例的設定中，我們可以注意到，設定主要由三個部分組成：`repo`、`rev`、以及`hooks`。這三個部分分別對應到：

1. `repo`：`hook`工具來源的位置。
2. `rev`：`hook`工具的版本。
3. `hooks`：要使用的`hook`工具。

你可以同時使用多個`repo`並設定不同的測試，只需要在`repos`部分中新增新的`repo`內容即可。

### 安裝設定

在完成設定檔案的撰寫後，只要執行以下指令，就可以把這些`hook`安裝到`.git`資料夾的`hooks/`資料夾之中。

```shell
pre-commit install
```

在安裝完成後，可以執行`pre-commit run --all-files`來對所有的程式碼進行檢查。參考官方範例，將會出現類似下方的結果：

```text
$ pre-commit run --all-files
[INFO] Initializing environment for https://github.com/pre-commit/pre-commit-hooks.
[INFO] Initializing environment for https://github.com/psf/black.
[INFO] Installing environment for https://github.com/pre-commit/pre-commit-hooks.
[INFO] Once installed this environment will be reused.
[INFO] This may take a few minutes...
[INFO] Installing environment for https://github.com/psf/black.
[INFO] Once installed this environment will be reused.
[INFO] This may take a few minutes...
Check Yaml...............................................................Passed
Fix End of Files.........................................................Passed
Trim Trailing Whitespace.................................................Failed
- hook id: trailing-whitespace
- exit code: 1

Files were modified by this hook. Additional output:

Fixing sample.py

black....................................................................Passed
```

你也可以嘗試對檔案進行改動，並使用`commit`來記錄新版本，並觀察`pre-commit`是如何運作的。

## 將`pre-commit`整合到CI/CD流程中

`pre-commit`除了在開發環境中可以協助我們在`commit`的當下進行檢查，也可以整合在CI/CD流程中來進行自動化的檢查。目前有三種方法，可以自行選擇一個來使用：


### 使用`pre-commit.ci`

目前有一個工具，[pre-commit.ci](https://pre-commit.ci/)可以協助使用者在CI流程中整合`pre-commit`服務。做法很簡單，直接在設定檔案中加入一個`ci`章節即可。以下是一個範例：

```yaml
ci:
    autofix_commit_msg: |
        [pre-commit.ci] auto fixes from pre-commit.com hooks

        for more information, see https://pre-commit.ci
    autofix_prs: true
    autoupdate_branch: ''
    autoupdate_commit_msg: '[pre-commit.ci] pre-commit autoupdate'
    autoupdate_schedule: weekly
    skip: []
    submodules: false
```

### 使用GitHub Action整合`pre-commit`

先前所提到的`pre-commit.ci`，也有提供GitHub Action的整合，若有需要使用可以參考[相關文件](https://pre-commit.ci/lite.html)。

### 自行撰寫

除了前述的兩種方法，使用者也可以自行撰寫CI流程，並執行`pre-commit run`指令來進行檢查。以下是GitLab版本的設定：

```yaml
stages:
  - precommit

precommit:
  tags:
    - ci
  stage: precommit
  image: python:3.12
  script:
    - pip install uv && uv pip install -r requirements.txt --system
    - pre-commit run --all-files
```

## 小結

使用`pre-commit`可以在相當早期的階段就協助我們根據設定的項目來進行檢查，並提供我們即時的改進分析。同時，`pre-commit`也可以被整合到CI/CD流程，進一步的為程式碼品質把關做出貢獻。非常推薦大家使用這個工具來增進團隊合作的效率以及成效。


---

如果覺得我的文章對你有幫助，歡迎請我喝一杯咖啡～


<a href="https://www.buymeacoffee.com/ds_cafe_and_tips"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=ds_cafe_and_tips&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>