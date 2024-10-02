---
title: "Terrform簡介"
description: "什麼？原來可以把所有的環境設定變成程式碼？"
slug: terraform_intro
date: 2024-10-03 14:00:00+0800
image: cover.jpg
categories:
    - blogs
tags:
    - blogs
    - Container
    - Docker
    - IaC
    - Terraform

---

## 簡介

[Terrform](https://www.terraform.io/)是一個基礎設施即程式碼(Infrastructure as Code, IaC)的工具。透過Terraform，我們可以將設定環境以及基礎設施的流程，轉變成以程式碼的方式來進行設定。Terraform的一個好處是可以對應多元的環境，並且可以同時管理雲端以及地端的環境。同時，得利於以程式碼進行設定的風格，我們將可以把基礎設施的設定進行版本控制以及自動化。

## 安裝

### MacOS

在MacOS，我們可以透過Homebrew來進行安裝：

1. 將`hashicorp/tap`加入Homebrew的套件清單

```shell
brew tap hashicorp/tap
```

2. 更新Homebrew並進行安裝

```shell
brew install hashicorp/tap/terraform
```

成功安裝後，可以嘗試執行`terraform -help`。若是安裝成功，將會出現幫助訊息。

```shell
$ terraform -help
Usage: terraform [-version] [-help] <command> [args]

The available commands for execution are listed below.
The most common, useful commands are shown first, followed by
less common or more advanced commands. If you're just getting
started with Terraform, stick with the common commands. For the
other commands, please read the help and docs before usage.
##...
```

{{< notice warning >}}

MacOS使用者若遇到提示`Command Line Tool`版本過舊，可以使用以下的指令更新：

```shell
softwareupdate -i "Command Line Tools for Xcode-16.0"
```

{{< /notice >}}


### Linux

我們可以透過以下步驟在Linux系統中安裝Terraform：

1. 安裝必要的工具

```shell
sudo apt-get update && sudo apt-get install -y gnupg software-properties-common
```

2. 安裝HashiCorp的GPG簽章

```shell
wget -O- https://apt.releases.hashicorp.com/gpg | \
gpg --dearmor | \
sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null
```

3. 驗證簽章

```shell
gpg --no-default-keyring \
--keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg \
--fingerprint
```

4. 將官方資源加入apt資源清單

```shell
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
sudo tee /etc/apt/sources.list.d/hashicorp.list
```

5. 更新並安裝Terraform

```shell
sudo apt-get install terraform
```

成功安裝後，可以嘗試執行`terraform -help`。若是安裝成功，將會出現幫助訊息。

```shell
$ terraform -help
Usage: terraform [-version] [-help] <command> [args]

The available commands for execution are listed below.
The most common, useful commands are shown first, followed by
less common or more advanced commands. If you're just getting
started with Terraform, stick with the common commands. For the
other commands, please read the help and docs before usage.
##...
```

## Terraform x Docker 用Terraform來管理Docker的映像檔以及容器

