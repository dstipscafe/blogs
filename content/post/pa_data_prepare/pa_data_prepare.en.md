---
title: "Project Amaterasu – Data Collection"
description: "Downloading freeway traffic records with wget and ThreadPoolExecutor." 
slug: project_amaterasu_data_prepare
date: 2023-10-22 22:00:00+0800
image: pa_data_prepare.png
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

Project Amaterasu uses Taiwan freeway traffic data.  This article shows how to fetch and organize the required files.

## Downloading Data

### Preparation

The open data site at the Ministry of Transportation hosts the M03A dataset, containing vehicle counts by type.  Files are offered either as directories of recent data or as compressed archives for older days.

Because manual downloads would be tedious, we automate the process.

### Fetch Files Automatically

By inspecting the webpage we find that each file can be retrieved simply by appending the filename to the base URL.  With that knowledge we can craft a script using `wget`:

```python
import subprocess
from concurrent.futures import ThreadPoolExecutor

FILES = [...]  # list of URLs

def fetch(url):
    subprocess.run(["wget", url])

with ThreadPoolExecutor() as ex:
    ex.map(fetch, FILES)
```

This approach downloads multiple files concurrently, greatly reducing total time.

## Organizing Data

After downloading, unzip archives and arrange them into a consistent folder structure ready for later preprocessing.

## Summary

Automating downloads with `wget` and `ThreadPoolExecutor` makes gathering large volumes of traffic data manageable, paving the way for subsequent steps in Project Amaterasu.
