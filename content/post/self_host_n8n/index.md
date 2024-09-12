---
title: "一步一步帶你自架n8n"
description: "來架設自己的自動化軟體吧？"
slug: self_host_n8n
date: 2024-09-12 14:00:00+0800
image: cover.jpg
categories:
    - blogs
    - automation
tags:
    - blogs
    - Container
    - Docker
    - Docker Compose
---

## 簡介

[n8n](https://n8n.io/)是一個No-code的自動化工具。n8n提供了雲端以及自架兩種使用方式，我們將在這篇文章中介紹如何在地端架設自己的n8n服務。

## 自架的好處與壞處

### 好處

* 隱私性較高
* 免費
  
### 壞處

* 需要自己動手設定、維護
* 個別場景需要自己的網域才能運作

## 安裝教學

### 先決條件

* 請確保環境中已安裝Docker CE、Docker Desktop或OrbStack。
* 確保Docker Compose的版本為`v2.14.0`或更新版本。
* 安裝環境需要至少4GB的RAM。

### 下載設定檔案

我們將使用官方所提供的設定檔，搭配`Docker Compose`來進行架設。請先將GitHub上的`n8n-hosting`倉庫下載到地端。（[連結](https://github.com/n8n-io/n8n-hosting)）

在這個教學中，我們將使用`docker-compose/withPostgres`資料夾中的檔案。

### 直接使用預設設定

如果不進行額外設定，可以直接使用以下的指令啟動n8n服務。

```shell
docker-compose up -d
```

### 進行客製化設定

當你需要進行客製化設定，例如把n8n放在不同的電腦運作，或是要更改預設資料庫的使用者以及密碼時，可以將`docker-compose.yml`檔案中的內容進行修改。以下是一些範例：

#### 將n8n部署在不同的機器

```yaml
version: '3.8'

volumes:
  db_storage:
  n8n_storage:

services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB
      - POSTGRES_NON_ROOT_USER
      - POSTGRES_NON_ROOT_PASSWORD
    volumes:
      - db_storage:/var/lib/postgresql/data
      - ./init-data.sh:/docker-entrypoint-initdb.d/init-data.sh
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -h localhost -U ${POSTGRES_USER} -d ${POSTGRES_DB}']
      interval: 5s
      timeout: 5s
      retries: 10

  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=${POSTGRES_DB}
      - DB_POSTGRESDB_USER=${POSTGRES_NON_ROOT_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_NON_ROOT_PASSWORD}
    ports:
      - "<your ip>:5678:5678"      # 修改此處來將容器的port與宿主機的port做綁定
    links:
      - postgres
    volumes:
      - n8n_storage:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy
```

#### 修改資料庫使用者資訊

要對資料庫的使用者資訊進行修改，可以修改`.env`檔案內的設定：

```
POSTGRES_USER=changeUser
POSTGRES_PASSWORD=changePassword
POSTGRES_DB=n8n

POSTGRES_NON_ROOT_USER=changeUser
POSTGRES_NON_ROOT_PASSWORD=changePassword
```

## 結語

在這篇教學中，我們示範了如何使用`Docker Compose`在地端建立n8n服務，我們將會在後續的文章中示範如何為自架的n8n設定域名，並連結Google OAuth驗證。