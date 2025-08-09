---
title: "PyTorch Basics - Build Your Own Data Pipeline"
description: "Don't load all data into memory at once"
slug: torch_build_your_data_pipeline
date: 2024-03-24 14:00:00+0800
image: cover.png
categories:
    - deep_learning
    - blogs
tags:
    - blogs
    - PyTorch
    - Data pipeline
    - Map Style Dataset
---

## Preface

Constructing a data pipeline is fundamental for deep learning projects. Introductory books often read the entire dataset into memory at once. That works for small datasets like MNIST, but for millions of images it is impossible. In this article we demonstrate how to load data only when needed.

## Prerequisites

Before building the pipeline we need some advanced Python knowledge. Lists are common objects in Python, but why can we access items with `[]`? The secret is the `__getitem__()` method of a class. By implementing `__getitem__`, a class can return values for a given index.

Suppose we have a class `Demo` with three attributes `a`, `b` and `c` mapped to strings. We want to access them using indices `0-2`. We can implement `__getitem__()` as follows:

```python
class Demo:
    def __init__(self):
        self.a = 'string_a'
        self.b = 'string_b'
        self.c = 'string_c'

    def __getitem__(self, index):
        match index:
            case 1:
                return self.a
            case 2:
                return self.b
            case 3:
                return self.c
            case _:
                raise IndexError(f'Given index: {index} out of range.')
```

We can instantiate `Demo` and fetch values with `[]`:

```python
demo = Demo()

print(demo[0])
# 'string_a'

print(demo[1])
# 'string_b'

print(demo[4])
# IndexError: Given index: 4 out of range.
```

This allows us to record image paths and read files from disk only when a specific index is requested.

## PyTorch data pipeline basics

As mentioned, building an object with `__getitem__()` is called a `Map Style Dataset` [1](https://pytorch.org/docs/stable/data.html#map-style-datasets). For PyTorch such a dataset must:

1. Inherit from `torch.utils.data.Dataset`
2. Implement `__getitem__()`

The first requirement inherits useful properties and methods. The second enables index-based access. If custom sampling is required, implement `__len__()` so `DataLoader` and `Sampler` can know the dataset length. Implementing `__getitems__()` can further speed up batch reading.

## Simple example – build an image loading pipeline

Assume images are stored in an `images` folder with `jpg` files and labels in a `label` folder with text files of the same name. We want to load and preprocess data only when needed. A `Map Style Dataset` can achieve this.

```python
import torch
import glob
import cv2
import torch.nn.functional as F
from torch.utils.data import Dataset

class ImageDataset(Dataset):
    def __init__(self, img_path, label_path, n_class=100, transform_fn=None):
        self.img_path = img_path
        self.label_path = label_path
        self.n_class = n_class
        self.transform_fn = transform_fn

        self.n_files = glob(f"{self.img_path}/*.jpg")

    def __len__(self):
        return self.n_files

    def __getitem__(self, index):
        if self.transform_fn is not None:
            _img = cv2.imread(self.img_path[index])
            _img = self.transform_fn(_img)
        else:
            _img = cv2.imread(self.img_path[index])

        with open(self.label_path[index], 'r') as file:
            _label = torch.tensor(int(file.readlines()[0]))

        return _img, F.one_hot(_label, num_classes=self.n_class)
```

Instantiate `ImageDataset` and wrap it with `torch.utils.data.DataLoader` while specifying `batch_size`, `num_workers`, etc. to complete the pipeline:

```python
train_dataset = torch.utils.data.DataLoader(
    ImageDataset(img_path, label_path, n_class=800, transform_fn=my_transform),
    batch_size=2,
    num_workers=10,
)
```

## Summary

We introduced how to build a `Map Style Dataset` that loads data on demand. PyTorch also provides `IterableDataset` [2](https://pytorch.org/docs/stable/data.html#iterable-style-datasets) for other scenarios, which we may cover in the future.
