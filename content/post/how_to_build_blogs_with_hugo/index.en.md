---
title: "Building a Static Site with Hugo and GitHub Actions"
description: "From setup to deployment, create a personal site effortlessly." 
slug: build_blogs_with_hugo
date: 2023-10-16 00:00:00+0800
image: cover_hugo_blogs.png
categories:
    - blogs
tags:
    - blogs
    - Hugo
    - Github Action
    - CICD
    - DevOps
---

## Introduction

This article shows how I built a personal site on GitHub Pages using Hugo and GitHub Actions.

## Prerequisites

1. GitHub account
2. SSH key pair for pushing code

Basic familiarity with Git is assumed.

## Choose a Theme

Hugo's community offers many themes. I picked **Stack** by [Jimmy Cai](https://github.com/CaiJimmy/hugo-theme-stack).

## Initialize the Project

```shell
hugo new site my-blog
cd my-blog
git init
```

Add the theme as a submodule and copy example content if needed.

## Writing Posts

Create new articles with:

```shell
hugo new posts/first-post.md
```

Write markdown content under `content/` and store images in `assets/` or `static/`.

## Automating Deployment

Set up a GitHub Actions workflow that builds the site and pushes the `public/` folder to `gh-pages`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: latest
      - run: hugo --minify
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

## Conclusion

With Hugo and GitHub Actions you can quickly create and deploy a static site for notes or blogging.
