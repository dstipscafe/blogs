---
title: "[Interactive Crawling 1] Selenium Basics"
description: "Let the browser operate itself for data collection." 
slug: selenium_basic
date: 2024-07-09 22:00:00+0800
image: cover.jpg
categories:
    - side_projects
    - blogs
    - python
tags:
    - blogs
    - Data pipeline
    - Web Scaping
---

## Introduction

When datasets are unavailable, web scraping becomes essential.  This series introduces [Selenium](https://www.selenium.dev/), an automation tool that controls browsers, using the Central Weather Administration site as an example.

## Preparation

### Install Selenium

```shell
pip install selenium
```

### Install WebDriver

Use `webdriver_manager` to automatically download drivers:

```shell
pip install webdriver-manager
```

## Basic Usage

```python
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())
driver.get("https://www.cwa.gov.tw/")
print(driver.title)
driver.quit()
```

This script opens Chrome, navigates to the site, prints the page title, and closes the browser.

## Conclusion

Selenium simplifies automating browser actions and lays the foundation for more advanced crawling techniques.
