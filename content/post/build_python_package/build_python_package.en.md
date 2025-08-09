---
title: "How to Build Your Own Python Package"
description: "Package code and publish it to PyPI in under ten minutes." 
slug: build_your_own_python_package
date: 2024-01-29 23:00:00+0800
image: cover_image.png
categories:
    - python
    - blogs
tags:
    - Python
    - blogs
    - packaging
    - python_package
    - pypi
    - setuptools
    - python tutorial
---

## Preface

Many tutorials teach how to write Python code or build machine‑learning models, yet few explain how to distribute your work.  This guide walks through creating a simple library and packaging it for others to install.

## Preparation

### Create the Project Folder

```shell
mkdir build_your_package_demo
```

### Required Files

A minimal package needs:

* `setup.py` – metadata and build settings
* `LICENSE` – licensing terms
* `README.md` – project description

## Writing the Library

Place your code under a package directory such as `demo_pkg/__init__.py`.  You can also add modules like `demo.py` with functions to export.

## Packaging with setuptools

`setuptools` turns the project into an installable distribution:

```python
from setuptools import setup, find_packages

setup(
    name="demo-pkg",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[],
)
```

Run `python setup.py sdist bdist_wheel` to produce source and wheel archives under `dist/`.

## Uploading to PyPI

Install `twine` and upload the generated files:

```shell
pip install twine
python -m twine upload dist/*
```

After publishing, others can install your package with `pip install demo-pkg`.

## Conclusion

Packaging code is straightforward once the folder structure is in place.  Share your utilities with the community and iterate based on feedback.
