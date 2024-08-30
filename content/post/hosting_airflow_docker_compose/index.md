---
title: "使用 Docker Compose 部署 Airflow"
description: "來架設自己的自動化軟體吧？"
slug: hosting_airflow_docker_compose
date: 2024-08-30 16:00:00+0800
image: cover.jpg
categories:
    - blogs
    - automation
tags:
    - blogs
    - Container
    - Docker
    - Airflow
    - Docker Compose
---

## 簡介

Airflow可以透過多種方式部署。在本文中，我們將展示如何使用Docker Compose來部署Airflow。

## 先決條件

* 請確保環境中已安裝Docker CE、Docker Desktop或OrbStack。
* 確保Docker Compose的版本為`v2.14.0`或更新版本。
* 安裝環境需要至少4GB的RAM。

## 下載設定檔案

要使用Docker Compose部署Airflow，首先需要取得設定檔案(`docker-compose.yaml`)。該檔案可從[Airflow官網](https://airflow.apache.org/docs/helm-chart/stable/index.html)下載，或者可以使用以下`curl`命令來下載：

```shell
curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.10.0/docker-compose.yaml'
```

## 組成

此設定文件包含多個Airflow所需要的組件：

* `airflow-scheduler` - 調度器監控所有任務和 DAG，並在其依賴關係完成後觸發任務實例。
* `airflow-webserver` - Airflow網頁伺服器，預設可藉由`http://localhost:8080`連線。
* `airflow-worker` - 執行由調度器分配任務的工作者。
* `airflow-triggerer` - 為可延遲的任務運行事件循環的觸發器。
* `airflow-init` - 初始化服務。
* `postgres` - 資料庫。
* `redis` - 將訊息從調度器轉發到工作者的代理。

## 啟動Airflow服務

預設情況下，該設定文件將使用 `CeleryExecutor` 啟動Airflow服務，並將一些目錄綁定到容器中。我們可以通過在`.env`檔案中宣告`AIRFLOW_PROJ_DIR`環境變數來配置要綁定的根目錄。如果未宣告`AIRFLOW_PROJ_DIR`，腳本會將執行`docker-compose`指令的目錄綁定到容器，並自動產生包含以下子目錄：

* `dags`: 可以將 `DAG` 檔案放在此處。
* `logs`: 包含任務執行和調度器的日誌。
* `config`: 可以添加自定義日誌解析器或 `airflow_local_settings.py` 來配置集群策略。
* `plugins`: 可以將自定義插件放在此處。

在啟動服務之前，需要將以下內容添加到`.env`檔案中，才能正常運作：

```shell
echo -e "AIRFLOW_UID=$(id -u)" > .env
```

然後，使用以下命令啟動服務：

```shell
docker-compose up -d
```
預設情況下，Airflow的網頁介面可透過`http://localhost:8080`連線。

## 設定教學

### 設定Airflow容器映像檔版本

預設情況下，腳本將從Docker Hub中拉取`v2.10.0`映像檔案。要更改此設定，可以在`.env`檔案中添加以下環境變數：

```
AIRFLOW_IMAGE_NAME=apache/airflow:<your option>
```

### 使用Flower對Celery進行監控

預設情況下，`Flower`功能不會啟用。我們可以通過以下命令啟用`Flower`：

```shell
docker-compose up flower
```

或是

```shell
docker-compose up -d --profile flower
```

`Flower`的網頁將可通過`http://localhost:5555`連線。

### 使用自定義容器映像檔

* 在啟動服務的同時進行自訂義容器的建構

當使用`Docker Compose`時，可以在啟動容器時構建映像，而不是先構建映像並指定給`Docker Compose`使用。請參閱[Docker Compose文件](https://docs.docker.com/reference/compose-file/build/)來進行設定。

* 預先建構自定義容器映像檔

我們可以先構建所需的映像，然後通過`AIRFLOW_IMAGE_NAME`環境變數進行設定。

### 清理環境

若要關閉Airflow服務，並清理環境，可以執行以下的指令來清理自動產生的資料以及未被使用的容器：

```shell
docker-compose down --volumes --remove-orphans
```


## 參考資料

* [Airflow 官網 - 使用Docker執行Airflow](https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html)