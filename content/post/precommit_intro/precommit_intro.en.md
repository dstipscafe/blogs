---
title: "How pre-commit Streamlines Development"
description: "Automate checks and enforce style before code reaches CI." 
slug: precommit_intro
date: 2025-03-20 16:00:00+0800
image: cover.jpg
categories:
    - blogs
    - python
tags:
    - blogs
    - Python
    - pre-commit
    - version control
    - git
    - GitHub
    - GitLab
    - Docker Compose
---

## Preface

Git and CI/CD have become standard in collaborative development, yet inconsistent coding styles and missed conventions still creep in.  `pre-commit` catches such issues early by running checks before each commit.

## What is pre-commit?

[pre-commit](https://pre-commit.com/#plugins) is a framework for managing Git hooks.  It can format code, scan for secrets, and enforce project rules using built‑in or custom plugins.

## Installation

```shell
pip install pre-commit
```

## Configuration

Create a `.pre-commit-config.yaml` specifying the hooks to run.  For example:

```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 24.3.0
    hooks:
      - id: black
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: end-of-file-fixer
```

Enable the hooks with `pre-commit install`.  Now every `git commit` triggers the checks.

## Integration with CI

Add `pre-commit run --all-files` to CI pipelines so that hooks run consistently on servers like GitHub or GitLab.

## Conclusion

Running `pre-commit` locally saves CI resources and keeps a clean, consistent codebase.
