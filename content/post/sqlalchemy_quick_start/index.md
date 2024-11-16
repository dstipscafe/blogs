---
title: "SQLAlchemy - 你的Database互動好幫手"
description: "SQLAlchemy 入門篇"
slug: sqlalchemy_quick_start
date: 2024-11-16 13:00:00+0800
image: cover.jpg
categories:
    - blogs
    - Python
tags:
    - blogs
    - Python
    - SQLAlchemy

---

## 簡介

在資料科學的入門階段，使用SQLAlchemy建立與資料庫的連線，並透過Pandas進行資料的讀取以及寫入是非常基礎的做法。然而SQLAlchemy所提供的功能可不只是建立連線那麼陽春。我們將會在SQLAlchemy的系列文章中，為大家介紹SQLAlchemy所提供的各種好用功能。在本文中，我們將會為讀者介紹：

1. 使用SQLAlchemy建立與資料庫的連線
2. 使用Cursor進行資料庫操作
3. 透過SQLAlchemy建構資料表
4. 透過SQLAlchemy建構資料表之間的關聯性
5. 透過SQLAlchemy進行資料的新增、更新以及刪除

## 使用SQLAlchemy建立與資料庫的連線

使用SQLAlchemy建立對各個資料庫的連線，是最基礎也最重要的功能。在使用上，需要使用`create_engine`這個功能，搭配宣告資料庫以及對應的連線工具等資訊來進行連線的建立。以下簡單示範如何建立與`SQLite`以及`PostgreSQL`資料庫的連線。

### SQLite

在這邊我們簡單示範如何建立與使用記憶體空間建立的`SQLite`資料庫之間的連線：

```python
from sqlalchemy import create_engine
engine = create_engine("sqlite://", echo=True)
```

### PostgreSQL

要使用SQlalchemy建立與`PostgreSQL`之間的連線，需要先安裝額外的工具`psycopg2`或是`asyncpg`。（後者支援`async`的操作）

```shell
pip install psycopg2 asyncpg
```

接下來，我們需要準備一個`database_url`來宣告以下資訊：

* 資料庫類型
* 資料庫連線工具
* 資料庫IP以過Port
* 使用者名稱以及密碼
* 資料庫Schema

```python
# psycopg2
database_url = "postgresql+psycopg2://<使用者名稱>:<密碼>@<資料庫IP>:<資料庫Port>/<資料庫Schema>"

# asyncpg
database_url = "postgresql+asyncpg://<使用者名稱>:<密碼>@<資料庫IP>:<資料庫Port>/<資料庫Schema>"
```

接下來，我們可以使用`create_engine`或是`create_async_engine`來建立連線：

```python
# create_engine
engine = create_engine(database_url, echo=True)

# create_async_engine
engine = create_async_engine(database_url, echo=True)
```

## 使用Cursor進行資料庫操作

在SQLAlchemy所提供的功能中，可以使用`cursor`來直接與資料庫進行互動。使用`cursor`進行互動可以說是最直接，但也最浪費SQLAlchemy所提供的各種好用功能的做法。接下來我將示範如何建立`cursor`並與資料庫進行互動。`cursor`物件可以透過`engine.conntect()`所產生的物件來獲得：

```python
connect = engine.connect()
cursor = connect.cursor()
```

接下來，我們可以使用`cursor.execute`搭配SQL語法來進行互動。

```python
statement = """
CREATE TABLE cars (
  brand VARCHAR(255),
  model VARCHAR(255),
  year INT
);
"""

cursor.execute(statement)
```

通過以上的操作，我們可以使用`cursor`建立一個具有`brand`、`year`以及`model`三個欄位的`cars`資料表。

## 透過SQLAlchemy建構資料表

在上一個章節中，我們提到直接使用`cursor`來與資料庫進行互動是非常不推薦的做法。接下來我們將介紹如何使用SQLAlchemy所提供的功能來建立資料表以及其內部的欄位。SQLAlchemy提供基於**對象關係對映**（Object Relational Mapping, ORM）來進行資料互動的方法。實作上，我們可以使用`DeclarativeBase`、`Column`來建立資料表：

```python
from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class Car(Base):
    __tablename__ = "cars"

    id = Column("id", Integer, primary_key=True)
    brand = Column("brand", String)
    model = Column("model", String)
    year = Column("year", Integer)
```

在上面的程式碼中，我們首先建立了一個基於`DeclarativeBase`的`Base`物件，並使用此物件來建構後續的資料表。接下來，我們繼承`Base`類別的基礎之上，建立了一個`Car`類別。這個`Car`類別將是一個資料表。

在建立了`Car`類別後，我們在類別內部定義了四個欄位：

* `id`：用以作為primary key的欄位。
* `brand`：用以記錄產品資訊的欄位。
* `model`：用以記錄型號的欄位。
* `year`：用以記錄產品年份。

並且，我們使用`__tablename__`來定義了資料表在資料庫之中的名稱。在完成了資料表以及欄位的創建之後，我們可以使用`Base`物件的`create_all`搭配`engine`來建立我們所定義的資料表以及相對應的欄位：

```python
Base.metadata.create_all(engine)
```

這樣就可以建立一個名為`cars`的資料表。

## 透過SQLAlchemy建構資料表之間的關聯性

接下來，我們可以新增另一張表，並在兩張表之間建立關聯性。接下來我們將建立一張`customer`資料表，並記錄每一個使用者的姓名，以及其購買的車輛型號。`customer`資料表中的車輛型號，將會以`cars`資料表的`model`欄位作為Foreign key。

```python
from sqlalchemy import ForeignKey

class Customer(Base):
    __tablename__ = "customer"

    id = Column("id", Integer, primary_key=True)
    first_name = Column("first_name", String)
    last_name = Column("last_name", String)
    car_model = Column("car_model", String, ForeignKey("cars.model"))

```

同樣的，我們可以使用`Base`的`create_all`來進行資料表的建立：

```python
Base.metadata.create_all(engine)
```

## 透過SQLAlchemy進行資料的新增、更新以及刪除

SQLAlchemy提供了`select`、`update`、以及`delete`來進行對記錄的選取、更新以及刪除的功能。接下來我們將會分別示範這三個功能。

### 新增一筆資料

為了後續的示範，我們可以先為我們的資料表新增一筆資料。我們可以使用`sqlalchemy.orm`所提供的`Session`來進行資料的新增等操作：

```python
from sqlalchemy.orm import Session

with Session(engine) as session:
    car = Car(
        id=1,
        brand="test",
        model="test",
        year=2021
    )

    session.add(car)
    session.commit()
```

在上方，我們透過`Session`以及`engine`建立一個`session`，並使用`session`將我們建立的`car`資料新增至資料庫。

### SELECT

在上一個章節，我們為資料表新增了一筆資料。假設我們想要從`cars`資料表中取出所有資料，我們可以使用`select`來進行操作：

```python
from sqlalchemy import select

with Session(engine) as session:
    stmt = select(Car)

    result = session.execute(stmt)

```

或許讀者會注意到我們使用`list`將運算的結果轉換為列表物件。為何會需要使用`list()`來進行轉換呢？這是因為`session.execute`所回傳的物件為一個生成器物件，我們需要使用`list`或是其他方法來將生成器物件轉為可以疊代的物件。

此外，`select`也提供使用`where`方法來進行資料的篩選。假設我們想要取出產品年份為`2021`年的資料，我們可以：

```python
from sqlalchemy import select

with Session(engine) as session:
    stmt = select(Car).where(Car.year = 2021)

    result = session.execute(stmt)

```

### UPDATE

SQLAlchemy除了`select`以外，也提供了`update`功能來讓使用者可以進行資料的更新。以下我們將示範如何將先前的資料，透過`update`來進行更新。

```python
from sqlalchemy import update

with Session(engine) as session:
    stmt = (
        update(Car)
        .where(Car.year == 2021)
        .values(brand="test1")
    )

    session.execute(stmt)
    session.commit()
```

在上方的程式碼中，我們使用`update(Car)`來指定要對`cars`資料表進行操作；接下來我們使用了`where`來指定了需要被更新的欄位。在篩選了要修改的資料之後，我們可以使用`values`來進行資料的更新。

### DELETE

最後，我們將介紹如何使用`delete`來進行資料的刪除。要刪除一筆資料，只需要透過將要處理的資料表作為參數傳遞給`delete`，並使用`where`來限定需要被刪除的資料即可。

```python
from sqlalchemy import delete

with Session(engine) as session:
    stmt = (
        delete(Car)
        .where(Car.year == 2021)
    )

    session.execute(stmt)
    session.commit()
```

## 小節

在這篇文章中，我們介紹了如何透過SQLAlchemy所提供的功能，在基於ORM的概念之上，進行資料表以及欄位的建立和操作。透過這些功能，我們可以避免使用`cursor`以及直接撰寫SQL語法來進行資料的操作，也可以一定程度上的避免SQL Injection。在後續的文章中，我們將會繼續介紹其他SQLAlchemy所提供的好用功能。


<a href="https://www.buymeacoffee.com/ds_cafe_and_tips"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=ds_cafe_and_tips&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>