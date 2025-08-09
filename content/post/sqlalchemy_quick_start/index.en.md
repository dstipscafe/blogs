---
title: "SQLAlchemy – Your Database Companion"
description: "A quick start guide to SQLAlchemy." 
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

## Introduction

SQLAlchemy goes beyond simple connections; it offers an ORM and powerful abstractions.  This primer covers connecting to databases, defining tables and relationships, and performing basic CRUD operations.

## Connecting to Databases

Use `create_engine` to define the connection.

### SQLite

```python
from sqlalchemy import create_engine
engine = create_engine("sqlite://", echo=True)
```

### PostgreSQL

```python
engine = create_engine("postgresql+psycopg2://user:password@localhost/dbname")
```

## Defining Tables

```python
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
```

Create the schema with `Base.metadata.create_all(engine)`.

## Relationships

```python
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Address(Base):
    __tablename__ = 'addresses'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='addresses')

User.addresses = relationship('Address', back_populates='user')
```

## CRUD Operations

```python
from sqlalchemy.orm import Session

with Session(engine) as session:
    user = User(name='Alice')
    session.add(user)
    session.commit()
```

## Conclusion

SQLAlchemy's ORM and connection tools make database interaction in Python concise and maintainable.
