---
title: PyTorch基礎-建立自己的資料管線
description: 不要在一次把所有資料讀取到記憶體裡面了
slug: torch_build_your_data_pipeline
date: 2024-03-24 14:00:00+0800
image: cover.png
categories:
    - Deep Learning
    - blogs
tags:
    - blogs
    - PyTorch
    - Data pipeline
    - Map Style Dataset
---

## 前言

建構資料管線對於深度學習專案來說，是基本且重要的一個部分。大部分入門的書籍並不太會對於這方面有過多的著墨，通常會一次性把所有資料讀取到記憶體裡面進行使用。對於常見的示範用資料集（例如：MNIST資料集）而言，這並不會造成問題。但當資料集的數量非常龐大（數百萬張甚至是數千萬張），是不可能一次把所有資料都載入到記憶體之中的。在這邊文章中，我將會示範如何建立一個在需要的時候才將資料讀取至記憶體中的方法。

## 先備知識

在示範如何建立資料管線之前，我們需要先了解Python的一些進階知識。串列（List）是一個對Python使用者來說，再熟悉不過的物件。但實際上背後是怎樣的實作讓串列可以使用`[]`來取出指定位置的值呢？這要講到Python類別（Class）物件的`__gititem__()`方法。對於一個類別而言，若是在這個類別中有建立`__getitem__`方法，並撰寫其取值邏輯，就可以使用`[]`搭配指定的`index`來進行取值。

假設有一個名為`Demo`的類別物件，這物件中具有三個屬性：`a`, `b`, `c`，每個屬性分別對應到一個字串（String）。我們希望以`0-2`的數字來取出對應的`a-c`屬性以及這三個屬性所對應到的字串。這時候我們就需要使用`__getitem__()`方法來進行實作。

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


我們可以將`Demo`類別進行實例化，並嘗試使用`[]`進行取值，觀察運做的狀況：

```python
demo = Demo()

print(demo[0])
# 'string_a'

print(demo[1])
# 'string_b'

print(demo[4])
# IndexError: Given index: 4 out of range.
```

可以發現經由`[]`搭配數字進行取值。以建立資料管線的使用場景來說，我們可以將照片的檔案位置進行記錄，並在指定編號的照片被呼叫時，再從硬碟中讀取檔案，並進行預處理。

## PyTorch資料管線建立須知

以上一章節中所提及，建立一個具有`__getitem__()`方法的物件來構建資料管線，此種方式被稱為`Map Style Dataset`[1](https://pytorch.org/docs/stable/data.html#map-style-datasets)。在PyTorch的要求中，以`Map Style Dataset`建立的資料物件必須要滿足以下幾個要求：

1. 繼承`torch.utils.data.Dataset`物件
2. 有進行`__getitem__()`方法的實作

第一點要求是為了能夠繼承一些PyTorch所預先撰寫好的處理以及屬性；第二點是為了能夠讓此物件能夠以給定編號的方式進行取值。當使用者需要進行一些自訂的採樣方法時，則需要額外進行`__len__()`的操作來讓`DataLoader`以及`Sampler`獲取資料集的長度資訊。另外，使用者也可以實作`__getitems__()`來讓批次的讀取流程可以更加的快速。

## 簡單範例——建立影像讀取資料管線

假設有一些影像資料儲存在`images`資料夾，檔案類型為`jpg`，同時在`label`資料夾下有相同檔案名稱的文字檔案，記錄對應影像的類別。我們希望能夠在在需要時才進行資料的讀取以及預處理，則可以透過建構一個`Map Style Dataset`來達成。

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

        with open(self.label_path[index], 'r')as file:
            _label = torch.tensor(int(file.readlines()[0]))

        return _img, F.one_hot(_label, num_classes=self.n_class)
```

只要將上方的`ImageDataset`類別進行實例化，並透過`torch.utils.data.DataLoader`進行包裝，同時宣告其他必要的參數（例如：`Batch Size`, `num_workers`等），就可以完成資料管線的建立。

```python
train_dataset = torch.utils.data.DataLoader(
    ImageDataset(img_path, label_path, n_class=800, transform_fn=my_transform), 
    batch_size=2, 
    num_workers=10,
)
```

## 小結

在本文中，我們介紹了如何建立`Map Style Dataset`並在需要時才進行資料的讀取。在PyTorch的資料管線中，還有另一種建立資料管線的方法，被稱為`IterableDataset`[2](https://pytorch.org/docs/stable/data.html#iterable-style-datasets)，有機會可以再針對`IterableDataset`進行介紹。