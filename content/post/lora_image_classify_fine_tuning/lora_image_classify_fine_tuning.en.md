---
title: "An Application of LoRA Beyond LLMs"
description: "Fine-tuning ResNet-50 with LoRA—sounds promising?"
slug: lora_image_classify_fine_tuning
date: 2024-02-16 12:00:00+0800
image: cover_image.png
categories:
    - python
    - blogs
    - deep_learning
tags:
    - Python
    - blogs
    - LoRA
    - ResNet-50
    - Image Classification
    - Fine Tuning
    - Low-Rank Adaptation
---

## Preface

With the surge of large language models, using [LoRA](https://arxiv.org/abs/2106.09685) to fine-tune them has become a common technique. However, its use in other model fine-tuning tasks is less frequently discussed. In this article, I demonstrate how to fine-tune ResNet-50 using LoRA and analyze the benefits it brings under different configurations.

{{< notice info >}}
Due to space constraints, I won't explain the concept of LoRA in this article. If you're interested in LoRA, please refer to [this article](https://towardsdatascience.com/understanding-lora-low-rank-adaptation-for-finetuning-large-models-936bce1a07c6).
{{< /notice >}}

## Case Study

I set up four scenarios to fine-tune a ResNet-50 model with different configurations and analyze the outcomes.

| Item                        | Case 1                    | Case 2                   | Case 3                   | Case 4                |
|:---------------------------:|:-------------------------:|:-----------------------:|:-----------------------:|:--------------------:|
| Retrain ResNet-50 output layer? | No                       | Yes                      | Yes                      | Yes                   |
| Modify ResNet-50 output layer? | No                       | No                       | No                       | Yes                   |
| Use LoRA?                   | No                        | Yes                      | Yes                      | No                    |
| LoRA insertion points       | N/A                       | .*.2.conv3               | .*.2.conv                | N/A                   |
| Additional custom output layer? | Yes                      | Yes                      | Yes                      | No                    |
| Structure of custom output layer | 3 Linear layers + SoftMax | 3 Linear layers + SoftMax | 1 Linear layer + SoftMax | N/A                   |

### Design Concept

Cases 1–3 focus on whether LoRA is used and how the output layer structure changes. Case 4 examines the accuracy achieved by retraining only the ResNet-50 output layer without adding extra layers.

### Background Setup

* Model: The pre-trained ResNet-50 model provided by Torchvision, with weights `ResNet50_Weights.IMAGENET1K_V2`.
* Dataset: The full [MNIST dataset](https://zh-yue.wikipedia.org/wiki/MNIST%E6%95%B8%E6%93%9A%E9%9B%86) for fine-tuning.

## Performance Analysis

### Number of Trainable Parameters

The table below summarizes the number of parameters retrained in each configuration.

| Item                   | Case 1        | Case 2        | Case 3        | Case 4        |
|:----------------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| Trainable parameters   | 646K          | 2.7M          | 2.1M          | 20.5K         |

### Model Accuracy

We can compare the performance of each configuration through accuracy. Case 1 performs the worst, while Case 2 achieves the best accuracy. The poor performance in Case 1 is expected, as fine-tuning without modifying the ResNet-50 output layer leads to suboptimal results.

A more interesting comparison is between Cases 3 and 4. Case 4 retrains only about 20K parameters and achieves 0.715 accuracy, whereas Case 3 uses LoRA to train around 7–8% of the parameters and reaches an accuracy above 0.94. However, the parameter difference between 0.715 and 0.965 accuracy is over 130 times. Whether the same accuracy can be achieved with fewer parameters is beyond the scope of this article.

| Item     | Case 1   | Case 2   | Case 3   | Case 4   |
|:--------:|:--------:|:--------:|:--------:|:--------:|
| Accuracy | 0.075    | 0.965    | 0.94     | 0.715    |

## Discussion

This case study shows that using LoRA for model fine-tuning can yield excellent accuracy. But beyond accuracy, what other benefits does LoRA offer? The most significant advantage is **reducing data transfer**.

With LoRA-based fine-tuning, we don't need to upload the entire model when sharing it—only the LoRA adapter needs to be stored and shared. In Case 2, saving the entire model results in a file size of 109 MiB, whereas the LoRA part alone requires only 7.9 MiB. Sharing just the LoRA weights dramatically reduces the amount of data needed.

{{< notice note >}}
In this example, we added a custom output layer, so we still need to share its weights along with the LoRA adapter. Without a custom layer, this wouldn't be an issue.
{{< /notice >}}

{{< notice tip >}}
Readers can also try fine-tuning ResNet-50 using LoRA without adding a custom output layer and retraining the ResNet-50 output layer to observe how the accuracy changes.
{{< /notice >}}

## Summary

LoRA isn't just useful for fine-tuning large language models. It can also deliver powerful results in traditional model fine-tuning tasks.

## References

1. [PEFT - Custom models](https://huggingface.co/docs/peft/developer_guides/custom_models)
