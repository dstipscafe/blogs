---
title: "Deploy Airflow with Docker Compose"
description: "Set up your own automation platform"
slug: hosting_airflow_docker_compose
date: 2024-08-30 16:00:00+0800
image: cover.jpg
categories:
    - blogs
    - automation
tags:
    - blogs
    - Container
    - Docker
    - Airflow
    - Docker Compose
---

## Introduction

Airflow can be deployed in many ways. In this post we demonstrate how to deploy Airflow with Docker Compose.

## Prerequisites

* Docker CE, Docker Desktop, or OrbStack installed
* Docker Compose version `v2.14.0` or newer
* At least 4GB of RAM

## Download configuration file

To deploy Airflow with Docker Compose we first need the `docker-compose.yaml` file. Download it from the [Airflow website](https://airflow.apache.org/docs/helm-chart/stable/index.html) or run:

```shell
curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.10.0/docker-compose.yaml'
```

## Components

The configuration file defines the components required by Airflow:

* `airflow-scheduler` – monitors DAGs and tasks, triggering task instances when dependencies are met
* `airflow-webserver` – Airflow web interface available at `http://localhost:8080`
* `airflow-worker` – executes tasks assigned by the scheduler
* `airflow-triggerer` – runs event loops for deferrable tasks
* `airflow-init` – initialization service
* `postgres` – database
* `redis` – broker that forwards messages from the scheduler to workers

## Start Airflow services

By default the configuration starts Airflow with `CeleryExecutor` and binds several directories into the containers. The root directory can be configured through `AIRFLOW_PROJ_DIR` in the `.env` file. If not set, the directory where you run `docker-compose` is mounted and the following subdirectories are created:

* `dags` – place DAG files
* `logs` – contains task and scheduler logs
* `config` – add custom log formatters or `airflow_local_settings.py`
* `plugins` – place custom plugins

Before starting the services, add the following to `.env`:

```shell
echo -e "AIRFLOW_UID=$(id -u)" > .env
```

Then start the services:

```shell
docker-compose up -d
```

The Airflow web UI is available at `http://localhost:8080`.

## Configuration guide

### Set Airflow image version

The script pulls image `v2.10.0` from Docker Hub by default. To change the version, set the following variable in `.env`:

```
AIRFLOW_IMAGE_NAME=apache/airflow:<your option>
```

### Monitor Celery with Flower

`Flower` is disabled by default. Enable it with:

```shell
docker-compose up flower
```

or

```shell
docker-compose up -d --profile flower
```

The Flower UI is available at `http://localhost:5555`.

### Use a custom image

* Build while starting

  Docker Compose allows building images when starting containers instead of building them beforehand. See the [Docker Compose build documentation](https://docs.docker.com/reference/compose-file/build/).

* Build ahead of time

  Build the image first and specify it with the `AIRFLOW_IMAGE_NAME` variable.

### Clean up

To stop Airflow and clean up generated data and unused containers:

```shell
docker-compose down --volumes --remove-orphans
```

## References

* [Airflow documentation – Running Airflow in Docker](https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html)
