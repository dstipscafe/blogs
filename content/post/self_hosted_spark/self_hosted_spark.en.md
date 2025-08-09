---
title: "Self-Hosting Spark"
description: "Building a Spark cluster with Docker Compose." 
slug: self_hosted_spark
date: 2025-01-19 16:00:00+0800
image: cover.jpg
categories:
    - blogs
    - python
    - side_projects
tags:
    - blogs
    - Python
    - Data pipeline
    - Side Projects
    - Spark
    - PySpark
    - Docker
    - Container
    - Docker Compose
---

## Introduction

[Apache Spark](https://spark.apache.org/) offers distributed processing for large-scale data tasks.  This article describes setting up a small Spark cluster using Docker and Docker Compose.

## Prerequisites

Install Docker and Docker Compose and have basic networking knowledge.

## Build the Image

Create a `Dockerfile` extending an official Spark image and install extra packages if needed.

## Compose Configuration

A minimal `docker-compose.yml`:

```yaml
version: '3'
services:
  spark-master:
    image: bitnami/spark:latest
    environment:
      - SPARK_MODE=master
    ports:
      - "7077:7077"
      - "8080:8080"
  spark-worker:
    image: bitnami/spark:latest
    environment:
      - SPARK_MODE=worker
      - SPARK_MASTER_URL=spark://spark-master:7077
    depends_on:
      - spark-master
```

Start the cluster with `docker-compose up -d`.

## Submit a Job

Use `spark-submit` to run a simple PySpark script:

```python
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName("demo").getOrCreate()
print(spark.range(5).collect())
```

## Conclusion

Docker Compose makes it easy to experiment with Spark locally before moving to larger environments.
