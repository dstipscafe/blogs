---
title: "Dask Introduction — Quickly Loading Large Datasets"
description: "Still using Pandas with a for-loop to read massive CSV files? Learn Dask instead!"
slug: dask_load_file
date: 2024-01-12 10:00:00+0800
image: dask_cover_image.png
categories:
    - python
    - blogs
tags:
    - Python
    - Deep Learning
    - blogs
    - Data Preprocessing
---

## Preface

In big data scenarios, it's very common to load large amounts of data into programs for processing. For users familiar with Pandas, using a for-loop to continuously add new data to an existing DataFrame is a common approach. Although reading all files sequentially with a for-loop works, the process can become time-consuming as the data volume grows. This is where `Dask` shines. Fully compatible with Numpy and Pandas, Dask provides parallel data loading and processing capabilities. This article introduces how to use Dask to simplify the loading of large numbers of CSV files.

## Review of Pandas

Before introducing Dask's solution, let's review how to read large datasets using Pandas. Assume there are hundreds of CSV files in the `data` directory with filenames like:

```
# ls data
467440-2020-01-01.csv
467440-2020-01-02.csv
467440-2020-01-03.csv
467440-2020-01-04.csv
467440-2020-01-05.csv
...(omitted)
```

Using Pandas, the process to read these files sequentially would be:

```python
import pandas as pd
from glob import glob

file_list = sorted(glob("./data/*.csv"))

df = pd.DataFrame()

for _file_path in file_list:
    tmp_df = pd.read_csv(_file_path)
    df = pd.concat([df, tmp_df], ignore_index=True)
```

In the code above, we use `glob` to get all CSV filenames in the `data` directory and `sorted` to sort them. We create an empty DataFrame before reading. Then, a for-loop reads each CSV file sequentially and appends it to the DataFrame. While straightforward, this method has a few issues:

1. We need to create an empty DataFrame before using `concat` to append data.
2. When the number of files is very large, the for-loop takes a lot of time to read the data.

Of course, we could avoid creating an empty DataFrame by using `if` with `enumerate` to handle the first file differently, but that would make the process slower due to additional `if...else` checks.

## Introduction to Dask

[Dask](https://www.dask.org/) is a Python library that provides parallel and distributed computing capabilities. Its core design uses **lazy evaluation**, delaying computation until `.compute()` is called, which reduces workload and improves efficiency. With Dask, code isn't executed immediately; instead, operations are scheduled and only computed when needed. This helps reduce memory usage and enables parallel processing. For example, Dask can parallelize the process of reading all CSV files into memory before combining them. Alternatively, we can modify the workflow to process each file as it's read and combine the results later.

## How to Quickly Load Large Datasets with Dask

Here's a simple example demonstrating how to load data using `Dask`:

```python
import dask.dataframe as dd
from glob import glob

file_list = sorted(glob("./data/*.csv"))

df = dd.read_csv(file_list).compute()
```

As you can see, using Dask to read data is straightforward. Simply pass the list of file paths to the `read_csv` function and call `.compute()` to load all data. `Dask.dataframe` is largely compatible with Pandas, so you can define a series of operations before calling `.compute()`.

## Visualizing Dask's Processing Flow

Dask provides a visualization feature (`.visualize()`) that helps users understand how computations are executed within Dask. To use it, you need to install `graphviz`. We can visualize the previous example to see how Dask processes the files (for better readability, we'll only load ten files):

```python
import dask.dataframe as dd
from glob import glob

file_list = sorted(glob("./data/*.csv"))

df_instance = dd.read_csv(file_list[:10])

df_instance.visualize()
```

Dask will return an image showing the computation graph.

![Dask workflow diagram](dask_flow_viz.png)

Note that only objects that haven't been computed with `.compute()` can use `.visualize()` to display the computation flow.

## Key Takeaways

In this article, we introduced the powerful parallel data processing library `Dask`. By using Dask, we can:

1. Simplify and speed up data loading
2. Accelerate data reading and processing through parallelism
3. Reduce computation via lazy evaluation

When using Dask, remember that no computation occurs until `.compute()` is called.
