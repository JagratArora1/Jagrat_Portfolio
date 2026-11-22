---
title: How large language models work: a guide for developers
description: Tokens, embeddings, attention, training and sampling: a clear guide for developers to how large language models turn a prompt into text, and why they fail.
date: 2026-11-22
topic: AI
---
I build with large language models, including in MeetAI, a personal project where users create their own AI agent and hold video meetings with it. This post explains what happens between sending a prompt and getting text back. It's aimed at developers: enough detail to reason about cost, limits and failure modes, without the maths of a research paper.

## Text becomes tokens

A model doesn't read characters or words. It reads *tokens*, chunks of text from a fixed vocabulary that typically has tens of thousands to a few hundred thousand entries.

Most tokenisers use a variant of byte-pair encoding (BPE). Starting from single bytes or characters, the tokeniser repeatedly merges the pairs that appear together most often in its training text. Common words end up as a single token, and rarer words are split into pieces: "tokenisation" might become "token" and "isation".

This has practical consequences:

- **Prices and limits are counted in tokens, not words.** In English a token averages roughly three-quarters of a word. Many other languages, including Hindi, and code often need more tokens for the same content.
- **Character-level tasks are awkward.** Counting the letters in a word or reversing a string is hard partly because the model never sees individual letters.

## Tokens become vectors

Each token ID is used to look up an *embedding*: a learned vector of hundreds or thousands of numbers. During training, tokens used in similar ways end up with similar vectors. From here on, the model works only with these vectors, refining them layer by layer.

## The transformer

Almost every modern language model is a *transformer*, the architecture introduced in the 2017 paper "Attention Is All You Need". Chat models are usually *decoder-only* transformers: a stack of identical blocks, each with two main parts, self-attention and a feed-forward network.

### Self-attention

Self-attention lets each token gather information from the tokens before it. For every token, the model computes three vectors from its current representation:

- a **query**: what this token is looking for
- a **key**: what this token offers
- a **value**: the information it passes on

Each token's query is compared with the keys of the earlier tokens. The scores are scaled, turned into weights that add up to one with the softmax function, and used to take a weighted average of the values:

```text
Attention(Q, K, V) = softmax(Q·Kᵀ / √d) · V
```

In "The bank raised its rates", attention is what lets "its" pick up information from "bank".

In a decoder, each token can only attend to itself and earlier tokens. This *causal mask* is what makes the model a next-token predictor: it can't peek at the answer.

Models run many attention operations in parallel, called *heads*, each with its own learned projections. Different heads can track different relationships, and their outputs are combined.

### Positional information

Attention on its own has no sense of order: shuffle the tokens and the scores are the same. So the model is given positions explicitly. The original transformer added fixed sine and cosine patterns to the embeddings. Many current models use rotary position embeddings (RoPE), which rotate the queries and keys by an angle that depends on each token's position.

### Feed-forward layers and the residual stream

After attention, each token's vector goes through a feed-forward network: two linear layers with a non-linear function between them, applied to every position separately. In a standard transformer these layers hold most of the parameters.

Each part adds its output back onto its input instead of replacing it. A useful picture is a *residual stream* for each token, which every layer reads from and writes to. Normalisation layers keep the numbers in a stable range.

## Predicting the next token

At the top of the stack, the final vector for the last position is turned into one score per vocabulary token, called a *logit*. The softmax function turns the logits into probabilities. The model picks a token, appends it to the text and runs again.

Your prompt is processed in one parallel pass, often called *prefill*. The answer is then generated one token at a time, called *decode*. That's why output tokens are slower, and why most APIs charge more for them than for input tokens.

## Training in stages

1. **Pre-training.** The model learns to predict the next token over a very large body of text and code. The loss measures how surprised it was by the real next token. This is where it picks up grammar, facts and patterns of reasoning, along with the errors and biases in its data.
2. **Supervised fine-tuning.** The model is trained on curated examples of instructions and good responses, so it behaves like an assistant instead of continuing documents.
3. **Preference tuning.** People, or other models, compare pairs of responses. In RLHF (reinforcement learning from human feedback), a reward model learns those preferences and the language model is optimised against it. Direct Preference Optimisation (DPO) reaches a similar goal without a separate reward model. Many recent models are also trained with reinforcement learning on tasks whose answers can be checked automatically, such as maths and code.

## Inference: from probabilities to text

The probabilities still have to become text, and how you pick tokens changes the output:

- **Greedy decoding** always takes the most likely token. It's predictable, but it can be repetitive.
- **Temperature** divides the logits by a number *T* before the softmax. Below 1 the distribution gets sharper and the output more predictable; above 1 it flattens and the output varies more.
- **Top-p, or nucleus sampling,** samples only from the smallest set of tokens whose probabilities add up to *p*, such as 0.9. **Top-k** keeps only the *k* most likely tokens.

Because sampling involves randomness, the same prompt can produce different answers. For extraction or classification, a low temperature and a structured output format make results more consistent.

During generation, the keys and values of earlier tokens don't change, so they're stored in a *KV cache* instead of being recomputed at every step. This makes generation much faster, but the cache grows with the length of the context and uses a lot of GPU memory, which is one reason long contexts cost more. The prompt caching that API providers offer works on the same principle: requests that share the same beginning can reuse work that was already done.

## Context windows

The *context window* is the maximum number of tokens, prompt and output together, that a model can handle in one request. Everything the model knows about your conversation has to fit inside it. The model itself remembers nothing between requests; chat apps re-send the history every time.

In standard attention every token is compared with every earlier token, so the work grows with the square of the length. Optimisations reduce this in practice, but long prompts are still slower and more expensive.

A bigger window doesn't mean everything in it is used equally well. Research has found that models use information at the start and end of a long context more reliably than information in the middle. Put important instructions and data where they're easy to find, and don't fill the window just because you can.

## Why models hallucinate

A language model is trained to produce likely text, not to check facts. When it doesn't have the information, the most likely continuation can still be a fluent, confident and wrong answer. Training and evaluation have also often rewarded giving an answer over admitting uncertainty.

What helps:

- **Provide the facts.** Retrieval-augmented generation (RAG) puts relevant documents into the prompt, so the model answers from them rather than from memory.
- **Ask for sources,** such as quotes from the documents you supplied, and check them.
- **Allow "I don't know"** explicitly in your instructions.
- **Use tools** for what models do badly: arithmetic, dates, database lookups.
- **Validate outputs in code,** with schemas and lists of allowed values.
- **Measure on your own data** rather than relying on impressions.

## Summary

- Text is split into tokens, and each token becomes a vector.
- A transformer refines those vectors with attention, which mixes in information from earlier tokens, and feed-forward layers.
- The model outputs a probability for every possible next token, and sampling settings decide which one is chosen.
- Pre-training gives knowledge, fine-tuning and preference tuning shape behaviour.
- Context windows, the KV cache and token counts explain most of the cost and latency.
- Hallucinations come from predicting likely text. Grounding, tools and validation reduce them.

## Further reading

- [Attention Is All You Need (Vaswani et al., 2017)](https://arxiv.org/abs/1706.03762)
- [Neural Machine Translation of Rare Words with Subword Units (byte-pair encoding)](https://arxiv.org/abs/1508.07909)
- [RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
- [Language Models are Few-Shot Learners (GPT-3)](https://arxiv.org/abs/2005.14165)
- [Training language models to follow instructions with human feedback (InstructGPT)](https://arxiv.org/abs/2203.02155)
- [Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [The Curious Case of Neural Text Degeneration (nucleus sampling)](https://arxiv.org/abs/1904.09751)
- [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172)
