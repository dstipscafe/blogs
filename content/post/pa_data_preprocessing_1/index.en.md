---
title: "Project Amaterasu – Data Preprocessing I"
description: "Matching freeway gantries with nearby weather stations." 
slug: project_amaterasu_data_preprocessing_geo
date: 2023-11-26 22:00:00+0800
image: pa_data_preprocessing_1.png
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
    - Data Preprocessing
    - GIS
---

## Preface

With traffic and weather datasets ready, the next step is to link each freeway gantry to its closest weather station using geographic coordinates.

## Gantry Locations

Download gantry latitude and longitude from the [open data portal](https://data.gov.tw/dataset/21165).

## Matching Algorithm

Combine gantry and station coordinates, then compute distances using a simplified Pythagorean formula—sufficient for short ranges within Taiwan.

```python
import pandas as pd
import numpy as np

stations = pd.read_csv('stations.csv')
gantries = pd.read_csv('gantries.csv')

s = stations[['lat','lon']].to_numpy()
g = gantries[['lat','lon']].to_numpy()

# compute all pairwise distances
dists = np.sqrt(((g[:,None,:]-s[None,:,:])**2).sum(axis=2))
indices = dists.argmin(axis=1)

gantries['station_id'] = stations.iloc[indices]['id'].values
```

The resulting mapping lets us attach weather features from the nearest station to each gantry for model training.

## Summary

This preprocessing step ensures that traffic records can be enriched with corresponding meteorological data.
