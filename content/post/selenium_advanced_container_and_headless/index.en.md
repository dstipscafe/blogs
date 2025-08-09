---
title: "[Interactive Crawling 3] Selenium Advanced – Headless Mode in Containers"
description: "Run Selenium without opening a browser window using Docker." 
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

## Introduction

After the basic Selenium articles, this installment shows how to execute crawlers inside Docker using headless mode, allowing automation on servers without displays.

## Containerizing Chrome

The Selenium project maintains [docker-selenium](https://github.com/SeleniumHQ/docker-selenium), offering images for popular browsers.

## Workflow

### Headless Mode

Use Chrome options to enable headless execution:

```python
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless")
```

### Docker Compose

```yaml
services:
  chrome:
    image: selenium/standalone-chrome
    shm_size: 2g
    ports:
      - "4444:4444"
```

### Sample Script

```python
from selenium import webdriver

options = Options()
options.add_argument("--headless")

driver = webdriver.Remote("http://localhost:4444/wd/hub", options=options)
# ... perform scraping ...
driver.quit()
```

## Conclusion

Running Selenium in headless containers simplifies deployment and paves the way for scalable crawling pipelines.
