---
title: "Terraform簡介"
description: "什麼？原來可以把所有的環境設定變成程式碼？"
slug: terraform_intro
date: 2024-10-03 00:00:00+0800
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

接下來將示範如何使用Terraform來管理Docker映像檔案以及容器。在這個示範中，我們將會：

1. 建立專案
2. 設定專案以及所需要的`Provider`
3. 設定映像檔以及容器資源
4. 初始化、建立規劃並套用設定

### 建立專案

首先，我們需要先建立一個資料夾，名為`terraform_demo`。我們將會把這個示範中所使用的設定檔案存放在這個資料夾之下。

```shell
mkdir terraform_demo
```

### 基礎設定以及Provider

接下來，我們需要宣告需要的`Provider`，用以管理環境。`Provider`在Terraform生態中，由不同的團隊或是公司所提供，可以協助我們控管不同資源的工具。

建立`provider.tf`檔案，並加入以下內容：

```
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}
```

在上方的設定中，我們將`kreuzwerker/docker`列為必須的`provider`，並指令了版本。並且我們設定了一個名為`docker`的`provider`物件，並且指定`host`參數。

### 新增映像檔清單

接下來，我們將新增映像檔到我們的設定之中。

建立`images.tf`檔案，並加入以下內容：

```
resource "docker_image" "ubuntu" {
  name = "ubuntu:latest"
}
```

{{< notice note >}}

詳細設定手冊可以參考此文件：[https://registry.terraform.io/providers/kreuzwerker/docker/latest/docs/resources/container](https://registry.terraform.io/providers/kreuzwerker/docker/latest/docs/resources/container)

{{< /notice >}}

### 設定容器

接下來，我們將使用我們上一步驟所宣告的映像檔案，建立一個新的容器。

建立`containers.tf`檔案，並加入以下內容：

```
resource "docker_container" "test" {
  image = docker_image.ubuntu.image_id
  name  = "test"
  
  tty = true
  command = ["/bin/bash"]
}
```

### 初始化專案

在完成了上述準備後，我們可以進行專案的初始化。使用以下指令進行初始化：

```shell
terraform init
```

### 查看資源規劃

在專案完成初始化後，我們將可以使用`plan`指令來查看哪一些資源將會被建立或是刪除。執行`terraform plan`指令，可以注意到Terraform提供了一個計劃內容。其計劃新增一個`docker_container.test`
資源，以及`docker_image.ubuntu`資源。

```
$ terraform plan                                                                                                    ─╯

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the
following symbols:
  + create

Terraform will perform the following actions:

  # docker_container.test will be created
  + resource "docker_container" "test" {
      + attach                                      = false
      + bridge                                      = (known after apply)
      + command                                     = (known after apply)
      + container_logs                              = (known after apply)
      + container_read_refresh_timeout_milliseconds = 15000
      + entrypoint                                  = (known after apply)
      + env                                         = (known after apply)
      + exit_code                                   = (known after apply)
      + hostname                                    = (known after apply)
      + id                                          = (known after apply)
      + image                                       = (known after apply)
      + init                                        = (known after apply)
      + ipc_mode                                    = (known after apply)
      + log_driver                                  = (known after apply)
      + logs                                        = false
      + must_run                                    = true
      + name                                        = "test"
      + network_data                                = (known after apply)
      + read_only                                   = false
      + remove_volumes                              = true
      + restart                                     = "no"
      + rm                                          = false
      + runtime                                     = (known after apply)
      + security_opts                               = (known after apply)
      + shm_size                                    = (known after apply)
      + start                                       = true
      + stdin_open                                  = false
      + stop_signal                                 = (known after apply)
      + stop_timeout                                = (known after apply)
      + tty                                         = false
      + wait                                        = false
      + wait_timeout                                = 60

      + healthcheck (known after apply)

      + labels (known after apply)
    }

  # docker_image.ubuntu will be created
  + resource "docker_image" "ubuntu" {
      + id          = (known after apply)
      + image_id    = (known after apply)
      + name        = "ubuntu:latest"
      + repo_digest = (known after apply)
    }

Plan: 2 to add, 0 to change, 0 to destroy.

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Note: You didn't use the -out option to save this plan, so Terraform can't guarantee to take exactly these actions if
you run "terraform apply" now.
```

### 套用設定

當檢查完`terraform plan`所提出的計畫，並確認沒有問題之後，我們就可以使用`terraform apply`來將計劃付諸實行，套用至系統之中。

```
$ terraform apply                                                                                                   ─╯

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the
following symbols:
  + create

Terraform will perform the following actions:

  # docker_container.test will be created
  + resource "docker_container" "test" {
      + attach                                      = false
      + bridge                                      = (known after apply)
      + command                                     = [
          + "/bin/bash",
        ]
      + container_logs                              = (known after apply)
      + container_read_refresh_timeout_milliseconds = 15000
      + entrypoint                                  = (known after apply)
      + env                                         = (known after apply)
      + exit_code                                   = (known after apply)
      + hostname                                    = (known after apply)
      + id                                          = (known after apply)
      + image                                       = "sha256:c22ec0081bf1bc159b97b27b55812319e99b710df960a16c2f2495dc7fc61c00"
      + init                                        = (known after apply)
      + ipc_mode                                    = (known after apply)
      + log_driver                                  = (known after apply)
      + logs                                        = false
      + must_run                                    = true
      + name                                        = "test"
      + network_data                                = (known after apply)
      + read_only                                   = false
      + remove_volumes                              = true
      + restart                                     = "no"
      + rm                                          = false
      + runtime                                     = (known after apply)
      + security_opts                               = (known after apply)
      + shm_size                                    = (known after apply)
      + start                                       = true
      + stdin_open                                  = false
      + stop_signal                                 = (known after apply)
      + stop_timeout                                = (known after apply)
      + tty                                         = true
      + wait                                        = false
      + wait_timeout                                = 60

      + healthcheck (known after apply)

      + labels (known after apply)
    }

  # docker_image.ubuntu will be created
  + resource "docker_image" "ubuntu" {
      + id          = (known after apply)
      + image_id    = (known after apply)
      + name        = "ubuntu:latest"
      + repo_digest = (known after apply)
    }

Plan: 2 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value:
```

需要注意的是，`terraform apply`指令會要求你輸入`yes`來作為最終確認，否則將不會執行。

### 檢查結果

我們可以透過`docker ps`來檢查我們所設定的容器是否正常的被啟動了：

```
$ docker ps                                                                             

CONTAINER ID   IMAGE          COMMAND       CREATED         STATUS         PORTS     NAMES
8a2571ef83e7   c22ec0081bf1   "/bin/bash"   3 seconds ago   Up 3 seconds             test
```

可以注意到有一個名為`test`的容器被建立，這代表我們的示範正常的運作了。

## 結語

在這篇文章中，我們簡單介紹了如何安裝並使用Terraform來管理環境中的Docker映像檔以及容器。後續我們將會示範如何使用Terraform來建立多個模組，病控管多個不同的環境。