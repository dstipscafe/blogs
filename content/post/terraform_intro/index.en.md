---
title: "Terraform Introduction"
description: "Turn infrastructure configuration into code." 
slug: terraform_intro
date: 2024-10-03 00:00:00+0800
image: cover.jpg
categories:
    - blogs
tags:
    - blogs
    - Container
    - Docker
    - IaC
    - Terraform
---

## Overview

[Terraform](https://www.terraform.io/) is an Infrastructure as Code tool that describes resources using declarative configuration.  It supports multiple providers and enables version control and automation of environments.

## Installation

### macOS

```shell
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

If Homebrew reports an outdated Command Line Tools version, update with:

```shell
softwareupdate --install-rosetta
```

### Linux

Download the binary from HashiCorp and place it in `PATH`.

## Basic Usage

1. Write configuration files (`.tf`).
2. Run `terraform init` to download provider plugins.
3. Preview with `terraform plan`.
4. Apply changes using `terraform apply`.

## Conclusion

Terraform brings reproducibility to infrastructure provisioning across cloud and on-premises environments.
