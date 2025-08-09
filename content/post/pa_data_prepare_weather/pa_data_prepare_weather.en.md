---
title: "Project Amaterasu – Gathering Weather Data"
description: "Collecting meteorological records from the CWB CODiS portal." 
slug: project_amaterasu__weather_data_prepare
date: 2023-11-19 22:00:00+0800
image: pa_data_prepare_weather.png
categories:
    - python
    - side_projects
    - deep_learning
    - blogs
tags:
    - Python
    - Side Projects
    - Deep Learning
    - blogs
    - Concurrent
---

## Preface

Besides traffic counts, Project Amaterasu also uses weather data from Taiwan's Central Weather Administration to enhance predictions.

## Preparation

### Identify Data Source

The CODiS platform provides historical observations.  We explore how it retrieves and displays data in order to automate downloads.

![CODiS platform screenshot](CODiS.png)

Select a station (e.g., Taipei) and inspect network requests when querying hourly data.

![Parameter settings](CODiS_option.png)

A pop‑up window shows the results:

![Query result](CODiS_result.png)

By examining the network panel we find a URL pattern that accepts parameters such as station ID and date.  With this information we can programmatically fetch CSV files.

## Implementation

Use Python with `requests` and `csv` to download and save the data:

```python
import requests

URL = "https://e-service.cwb.gov.tw/HistoryDataQuery/csv"
params = {"station": "C0A9C0", "start": "2023-10-01", "end": "2023-10-31"}
resp = requests.get(URL, params=params)
with open('taipei_oct.csv', 'wb') as f:
    f.write(resp.content)
```

Automate multiple requests by iterating over station IDs and dates.

## Summary

By reverse‑engineering CODiS network calls, we can systematically gather weather features for Project Amaterasu.
