---
title: "[Interactive Crawling 2] Selenium Hands-on – Scraping CODiS Weather Data"
description: "Use automated browser actions to collect daily observations." 
slug: selenium_basic_codis_hands_on
date: 2024-07-15 10:00:00+0800
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

Building on the basics, this tutorial demonstrates how to scrape daily weather observations from Taiwan's CODiS service using Selenium.

## About CODiS

The CODiS portal lets users query station data for specific dates, but the new version uses sessions and POST requests, making traditional API calls harder.  Selenium simulates user actions to retrieve the formatted tables.

## Workflow

1. Open the CODiS site and locate station markers on the interactive map.
2. Click a region, then a specific station.
3. Choose the desired date and submit the form.
4. Wait for the result table to render and extract data.

## Sample Code

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

url = "https://codis.cwa.gov.tw/StationData"
driver = webdriver.Chrome(ChromeDriverManager().install())

driver.get(url)
# interact with map and date pickers...
rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
for r in rows:
    cols = [c.text for c in r.find_elements(By.TAG_NAME, 'td')]
    print(cols)
```

Include proper waits (e.g., `WebDriverWait`) to handle dynamic loading.

## Saving Results

Write the scraped rows to CSV for later analysis.

## Conclusion

Selenium enables automated access to CODiS's processed tables when direct API fetching is inconvenient.
