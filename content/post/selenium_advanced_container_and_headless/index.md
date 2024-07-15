---
title: "[互動式爬蟲系列3] Selenium 進階 － 使用Headless模式搭配容器運行 "
description: 不用開啟瀏覽器也能玩互動式爬蟲，好像很有趣？
slug: selenium_advanced_container_and_headless
date: 2024-07-15 19:10:00+0800
image: cover.jpg
categories:
    - side_projects
    - blogs
    - python
tags:
    - blogs
    - Data pipeline
    - Web Scaping
    - Container
    - Docker
---

## 前言

在前兩篇文章（[首篇](https://dstipscafe.github.io/blogs/p/selenium_basic/)、[第二篇](https://dstipscafe.github.io/blogs/p/selenium_basic_codis_hands_on/)）中，我們介紹了Selenium的使用，並進行了實作示範。接下來，我們將介紹如何透過Docker搭配Headless模式，讓爬蟲程式在不需要開啟瀏覽器視窗的狀況下進行運作，為自動化以及規模化打下基礎。

## 容器化Chrome瀏覽器

Docker，或者說容器化技術，是現在開發以及部署中非常重要的一個技術。Selenium團隊也提供了這方面得協助，開源了[docker-selenium](https://github.com/SeleniumHQ/docker-selenium)，使我們有機會在容器化的基礎上，使用各個常見的瀏覽器進行互動式爬蟲的操作。

## 處理流程

### Headless模式

要在不開啟瀏覽器的前提下進行運作，需要使用`headless`模式。同樣的，我們以Chrome進行示範。在先前的示範中，我們雖然有使用`Options`，但並未對其進行相關設定；在使用`headless`模式時，需要進行以下處理：

```python
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless")
```

透過把`--headless`加入`Options`，使得`web driver`在啟動瀏覽器時，不會開啟視窗。這樣我們就可以在沒有連接顯示器的環境中運行我們的爬蟲程式。

### 使用容器架設遠端運作的瀏覽器

先前我們有提到，Selenium有提供虛擬化的瀏覽器容器讓我們可以使用遠端的方式來進行爬蟲運作。為了使用遠端運作的模式，我們需要兩個步驟：

1. 啟動容器
2. 將程式設定為遠端運作模式，並指定遠端運作的對象

#### 啟動容器

在啟動容器前，我們需要先建立一個資料夾，用於掛載至容器內部使用。假設家目錄為`/home/ubuntu`：

```shell
mkdir /home/ubuntu/files
chown 1200:1201 /home/ubuntu/files
```

{{< notice note >}}

更改權限是必要的，否則資料將無法正常寫入至資料夾，詳細請參考：
https://github.com/SeleniumHQ/docker-selenium?tab=readme-ov-file#headless

{{< /notice >}}

我們可以透過以下的指令來啟動Chrome的容器：

```shell
docker run -d -p 4444:4444 --shm-size="2g" \
  -v /home/ubuntu/files:/home/seluser/Downloads \
  selenium/standalone-chrome:4.22.0-20240621
```

在啟動成功之後，就可以進入下一步：程式設定。

#### 指定在遠端運行爬蟲程式

在`web driver`的設定上，可以指定使用遠端的對象來進行運作，設定方式如下：

```python
remote_url = "http://127.0.0.1/wd/hub"

driver = webdriver.Remote(
    command_executor=remote_url, options=chrome_options
)
```

只要使用`webdriver.Remote()`搭配`command_executor`參數即可讓爬蟲程式使用遠端對象進行運作。

## 結語

這本篇文章中，我們介紹了如何使用容器來作為遠端運作的對象，並示範了如何進行程式方面的設定。