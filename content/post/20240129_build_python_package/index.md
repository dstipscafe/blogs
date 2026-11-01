---
title: 不知道如何建立自己的Python套件？快讓我一步步教你
description: 讓你在10分鐘內建構出專屬於自己的Python套件
slug: build_your_own_python_package
date: 2024-01-29 23:00:00+0800
image: cover_image.png
categories:
    - python
    - blogs
tags:
    - Python
    - blogs
    - packaging
    - python_package
    - pypi
    - setuptools
    - python tutorial
---

## 前言

市面上，教讀者如何如何撰寫Python程式的書籍很多。關於如何進行數據分析或是深度學習的程式撰寫，更是不勝枚舉。但對於如何將自己所撰寫的程式進行打包、分享，並讓其他人可以安裝使用的教學，卻不是非常多。在本文中，將會介紹如何建構簡易的Python程式，並示範如何將其打包成容易分享的方式。

## 前置準備

### 建立資料夾
首先，需要先準備一個資料夾作為套件的根目錄。在Linux系統中，可以利用以下指令建立一個資料夾：

```shell
mkdir build_your_package_demo
```
這樣，就會在現有的目錄中，建立一個名為`build_your_package_demo`的資料夾。

### 建立必要檔案

要建立一個Python套件，在套件的根目錄中有幾個檔案是必要的。以下是必要的檔案列表：

* `setup.py`： 用以描述套件資訊以及相關建構的設定。
* `LICENSE`：用以描述套件授權條款。
* `README.md`：用來提供使用者關於本套件的相關訊息。

我們可以用以下指令快速建立所需要的檔案：

```shell 
cd build_your_package_demo/
touch setup.py
touch LICENSE
touch README.md
```

此時，套件的資料夾之中應該會有以下結構：

```
build_your_package_demo/
├── LICENSE
├── README.md
└── setup.py

0 directories, 3 files
```
除了上述的三個必要檔案，我們還要在`build_your_package_demo`的資料夾下面建立一個屬於套件程式碼的資料夾。假設我們將要建立一個名為`Bifrost`的套件，那我們需要在`build_your_package_demo`的資料夾中建立一個名為`Bifrost`的資料夾：
```shell 
mkdir Bifrost
```
為了讓Python在建立套件時，能夠解析到`Bifrost`這個資料夾，我們需要在`Bifrost`資料夾中建立一個名為`__init__.py`的檔案。我們可以用以下指令建立`__init__.py`：

```shell 
touch Bifrost/__init__.py
```

> `__init__.py`檔案可以是空的，也可以用來建立一些關聯性，這邊先不去在這個檔案著墨太多。

## 為檔案填入內容

### `LICENSE`

常見的軟體授權條款有：

* MIT授權
* GPL授權
* LGPL授權
* BSD授權
* APACHE授權

在此我們就不一一介紹，僅用一張表格來表達各個授權的差異。詳見下表：


| 條款                 | GPL                  | LGPL                 |   BSD              |   APACHE            |   MIT                |
|:----------           |:--------:            |:--------:           |:---:               |:---:                |:---:                 |
|  公開原始碼           |  ✅   | ✅  |                    |                     |                      |
|  以相同方式授權        |  ✅   | ✅  |                    |                     |                     |
|  標注修改部份          |  ✅   | ✅ |                     |  ✅ |                     |
|  必須包含智慧財產權標記  |  ✅   | ✅ | ✅  | ✅  | ✅  |
|  必須包含授權條款       |  ✅   | ✅ |                     | ✅  | ✅  |

> 表格來源：為[Medium文章](https://medium.com/@ellierellier/%E6%A6%82%E5%BF%B5%E7%AD%86%E8%A8%98-%E4%BB%80%E9%BA%BC%E6%98%AF%E8%BB%9F%E9%AB%94%E6%8E%88%E6%AC%8A%E6%A2%9D%E6%AC%BE-software-license-%E6%8E%88%E6%AC%8A%E6%A2%9D%E6%AC%BE%E7%9B%B8%E9%97%9C%E6%A6%82%E5%BF%B5%E4%B8%80%E6%AC%A1%E9%87%90%E6%B8%85-9d70e29f3a29)之重製版本。

在此我們可以使用MIT授權條款作為軟體授權使用。只要將以下內容加入`LICENSE`檔案中即可：

```
Copyright (c) 2022 <put your name here>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### `README.md`

`README.md`是一個基於[Markdown語法](https://markdown.tw/)的介紹文件。編寫此文件的目的在於提供給使用者的「說明書」。`README`文件的主要目的為讓使用者了解以下資訊：

* 這是什麽套件
* 這套件能提供什麽功能
* 該如何使用這個套件
* 使用範例
* 授權條款

為求簡單，我們可以先只用一行描述來構成我們的`README.md`檔案。輸入以下指令可以將一段文字加入到`README.md`之中：

```shell 
echo "This is a demo for building your own python package." > README.md
```

:::info
有興趣了解如何撰寫一篇好的README文件，可以參考這篇[文章](http://gitqwerty777.github.io/art-of-readme/)
:::

### `setup.py`

`setup.py`是一個在建立套件時，最重要的一個檔案。其內容跟以下資訊有關：

* 作者資訊
* 版本資訊
* 套件名稱
* 套件描述
* 套件所需的相依套件
* .......

我們可以依照下方所提供的內容來編寫`setup.py`：

```python
import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="Bifrost",
    version="0.0.1",
    author="<your name>",
    author_email="<your email>",
    description="A demo project about how to build your own python package.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
    install_requires=[
        'numpy>=1'
    ]
)
```

## 建構套件程式碼

接下來，我們可以開始為`Bifrost`套件加入程式碼了。在開始之前，我們先回顧一下現有的檔案架構。在現有的資料夾下，我們有三個檔案以及一個目錄，如下方所示：

```
build_your_package_demo/
├── Bifrost
│   └── __init__.py
├── LICENSE
├── README.md
└── setup.py

1 directory, 4 files
```

假設`Bifrost`套件將有一個子模組，名為`functuon`，儲存在`function.py`之中。我們同樣可以使用`touch`指令建立`function.py`

```shell
touch Bifrost/function.py
```

此時，我們的套件資料夾架構將如下圖所示：
```
build_your_package_demo/
├── Bifrost
│   ├── __init__.py
│   └── function.py
├── LICENSE
├── README.md
└── setup.py

1 directory, 5 files
```


### `function.py`

假設我們的核心函式將會在呼叫時回應「你好!」。我們可以在`Bifrost/function.py`中來實作這一項功能：

```python
def greeting():
    print("你好!")
```

### `__init__.py`

在先前，我們暫時將`__init__.py`留白，並未填入內容。但為了在建構套件時，我們的三個子模組能被正確的辨識，我們需要在`__init__.py`之中加入以下幾行文字：
```python
from . import function
```

## 打包套件

### 安裝必要套件

在打包之前，我們需要先安裝必要的套件。必要的套件列表如下：

* `setuptools`
* `wheel`

這兩個套件都可以透過`pip`指令安裝。安裝指令如下：
```shell 
python3 -m pip install setuptools wheel build
```

接下來，我們可以透過幾種方式來打包、安裝我們所建立的套件：

1. 直接安裝
2. 打包成`tar.gz`檔案
3. 打包成`wheel`檔案

#### 直接安裝

我們可以透過直接在`build_your_package_demo`目錄下執行以下指令來將套件安裝到Python函式庫之中：
```shell
python3 -m pip install -e .
```

#### 打包成`tar.gz`檔案

在`pip`指令的使用上，除了直接利用`-e`選項來直接將開發中的程式碼進行安裝以外，還能透過`tar.gz`以及`wheel`檔案來進行安裝。我們可以透過在`build_your_package_demo`目錄下執行以下指令來將套件打包成`tar.gz`檔案：
```shell 
python3 -m build --sdist
```

這個指令會在目前的資料夾之下新增一個`dist/`資料夾，並在其中新增一個`Bifrost-0.0.1.tar.gz`壓縮檔案。我們可以夠過`pip`指令來將打包好的套件安裝到函式庫之中。
```shell 
python3 -m pip install dist/Bifrost-0.0.1.tar.gz
```

#### 打包成`wheel`檔案

在上一小節中，我們示範了如何將套件打包成`tar.gz`並進行安裝。而我們也可以選擇將套件打包成`wheel`檔案並進行安裝。與上一小節所使用的指令相似，只需要將`sdist`參數換成`bdist_wheel`即可打包成`wheel`檔案。
```shell 
python3 setup.py build --wheel
```
這樣一來，我們將會在`dist/`資料夾下得到一個名為`Bifrost-0.0.1-py3-none-any.whl`的檔案。我們同樣可以利用與上一節相同的`pip`指令進行安裝。
```shell 
python3 -m pip install dist/Bifrost-0.0.1-py3-none-any.whl
```

> 對於`setup.py`以及`setuptools`的詳細介紹，可以參考本篇[文章](https://www.gushiciku.cn/pl/gOIm/zh-tw)。
> 也可以參考官方的[教學](https://packaging.python.org/en/latest/)

## 測試

在成功安裝Python套件之後，我們可以透過`pip`指令加上`show`參數來確認我們安裝的套件。執行以下指令即可得到關於`Bifrost`套件的相關資訊。

```shell 
pip3 show Bifrost
```
指令將會回應以下訊息：
```
Name: Bifrost
Version: 0.0.1
Summary: A demo project about how to build your own python package.
Home-page:
Author: <your name>
Author-email: <your email>
License:
Location: /Users/user/Library/Python/3.9/lib/python/site-packages
Requires: numpy
Required-by:
```

我們也可以嘗試在互動模式下導入`Bifrost`模組並進行操作。

1. 進入互動模式

    可以透過以下指令進入互動模式：
```shell
python3
```

2. 導入`Bifrost`套件
在互動模式中導入`Bifrost`套件：
```python
import Bifrost
```

3. 查看套件架構
利用`dir()`函式查看`Bifrost`套件架構：

```python
dir(Bifrost)
```

`dir()`函式將會發送以下回應：

```python
['__builtins__', '__cached__', '__doc__', '__file__', '__loader__', '__name__', '__package__', '__path__', '__spec__', 'function']
```

也可以查看`Bifrost`套件中的`function`子套件架構：

```python
['__builtins__', '__cached__', '__doc__', '__file__', '__loader__', '__name__', '__package__', '__spec__', 'greeting']
```

4. 嘗試執行套建中的函式

可以嘗試執行`Bifrost.utils`的`print_numpy_version`函式來確認套件是否可以正常運作。

```python
>>> Bifrost.function.greeting()
你好!
```

經過以上測試，可以確認套件已經正確的被安裝了。