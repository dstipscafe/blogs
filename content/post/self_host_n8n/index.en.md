---
title: "Tutorial to host n8n in your local environment."
description: "With Docker and Docker Compose"
slug: self_host_n8n
date: 2024-09-12 14:00:00+0800
image: cover.jpg
categories:
    - blogs
    - automation
tags:
    - blogs
    - Container
    - Docker
    - Docker Compose
---

## Introduction

n8n is a low-code automation platform. n8n provides both local and cloud setups for users. In this note, we are going to setup a local n8n service for personal usage.

## Pros and Cons

### Pros 

* Privacy

* Free (n8n cloud requires at least USD$ 24)

### Cons

* DIY

* You may need your own domain for certain use cases.

## Setup

### Prerequisite

#### Docker 

To host n8n with Docker Compose, we need to install Docker and Docker Compose.

```shell
#!/bin/bash

sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt install docker-ce docker-ce-cli containerd.io docker-compsoe
```

### Get Docker Compose Configuration

To get the Docker Compose configuration, we can either download the zip file or clone  from the n8n-hosting repository.

### Prepare Credential

Before the installation, please make sure you change the credentials which located in the .env file.

```
POSTGRES_USER=changeUser
POSTGRES_PASSWORD=changePassword
POSTGRES_DB=n8n

POSTGRES_NON_ROOT_USER=changeUser
POSTGRES_NON_ROOT_PASSWORD=changePassword
```

### Install 

We will use the withPostgres option here. You can find the configuration in this folder[link].

#### Host and use in the same machine (Case 1)

For those who want to host n8n in the same machine, directly execute the following command:

```shell
docker-compose up -d
```

#### Host and use in different machine (Case 2)

To ensure the client can access to the container, we should edit the docker-compose.yml to bind the host port and container port.

```yaml
version: '3.8'

volumes:
  db_storage:
  n8n_storage:

services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB
      - POSTGRES_NON_ROOT_USER
      - POSTGRES_NON_ROOT_PASSWORD
    volumes:
      - db_storage:/var/lib/postgresql/data
      - ./init-data.sh:/docker-entrypoint-initdb.d/init-data.sh
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -h localhost -U ${POSTGRES_USER} -d ${POSTGRES_DB}']
      interval: 5s
      timeout: 5s
      retries: 10

  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=${POSTGRES_DB}
      - DB_POSTGRESDB_USER=${POSTGRES_NON_ROOT_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_NON_ROOT_PASSWORD}
    ports:
      - "<your ip>:5678:5678"      # edit here
    links:
      - postgres
    volumes:
      - n8n_storage:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy
```

Then execute the command to host the services:

```shell
docker-compose up -d
```

{{< notice warning >}}

IMPORTANT!!!!!: Don’t forget to change the credentials!

{{< /notice >}}

### TOGO

Once the service is ready, you may access your n8n service through the following URL:

For case 1: `http://localhost:5678`

For case 2: `http://<n8n ip>:5678`

### Reference

n8n Docker Compose Guide: https://docs.n8n.io/hosting/installation/server-setups/docker-compose/