---
title: "Host Your Own GitLab"
description: "Quickly spin up a personal GitLab instance with Docker."
slug: host_your_gitlab
date: 2024-02-24 14:00:00+0800
image: cover.png
categories:
    - DevOps
    - blogs
tags:
    - cicd
    - blogs
    - devops
    - gitlab
    - docker
    - openssl
    - docker-ce
    - docker-compose
---

## Introduction

DevOps has become mainstream and spawned variants like DevSecOps, DataOps and MLOps.  To keep private services on a homelab, this series shows how to build a CI/CD environment locally starting with a self‑hosted GitLab via Docker.

## Requirements

### Hardware

1. Desktop‑class CPU
2. At least 8 GB RAM
3. Disk space according to needs

### Software / OS

* An operating system capable of running Docker
* `docker-ce`
* `docker-ce-cli`
* `docker-compose`

## Generate TLS Certificates

Use `openssl` to create certificates for HTTPS access:

```shell
openssl req -newkey rsa:4096 -nodes -keyout gitlab.key -x509 -days 365 -out gitlab.crt
```

## Docker Compose

Define GitLab in a `docker-compose.yml`:

```yaml
version: '3'
services:
  web:
    image: gitlab/gitlab-ce:latest
    container_name: gitlab
    restart: always
    hostname: gitlab.example.com
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./config:/etc/gitlab
      - ./logs:/var/log/gitlab
      - ./data:/var/opt/gitlab
```

Start the service with `docker-compose up -d` and visit `https://gitlab.example.com` to finish setup.

## Conclusion

With Docker and a few commands you can run a private GitLab instance at home, forming the foundation for a full CI/CD environment.
