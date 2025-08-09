---
title: "Managing AWS with Terraform"
description: "Provision a basic cloud environment from code." 
slug: terraform_aws
date: 2024-10-29 20:00:00+0800
image: cover.jpg
categories:
    - blogs
tags:
    - blogs
    - Container
    - Docker
    - IaC
    - Terraform
    - AWS
    - EC2
    - VPC
---

## Overview

[Terraform](https://www.terraform.io/) treats infrastructure as code.  This article demonstrates building an AWS environment consisting of public and private subnets across two availability zones in `ap-northeast-1`.

## Architecture

* Region: `ap-northeast-1`
* AZs: `ap-northeast-1a`, `ap-northeast-1c`
* Public subnets: `10.0.0.0/24`, `10.0.128.0/24`
* Private subnets: `10.0.16.0/24`, `10.0.144.0/24`

Each subnet hosts an EC2 instance with proper routing and security groups.

![architecture](aws_infra.jpg)

## Prerequisites

Install Terraform and configure AWS credentials.  Ensure Docker is available if you plan to run Terraform inside a container.

## Terraform Configuration

Example `main.tf`:

```hcl
provider "aws" {
  region = "ap-northeast-1"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.0.0/24"
  availability_zone = "ap-northeast-1a"
  map_public_ip_on_launch = true
}
```

Continue declaring private subnets, route tables and EC2 instances.

Initialize and apply:

```shell
terraform init
terraform apply
```

## Cleanup

Destroy resources when finished:

```shell
terraform destroy
```

## Conclusion

Terraform allows reproducible infrastructure setups and version control for cloud configurations.
