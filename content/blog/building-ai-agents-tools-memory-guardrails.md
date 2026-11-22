---
title: Building AI agents: tools, memory and guardrails
description: A practical guide to building AI agents: the agent loop, tool calling with JSON Schema, retrieval, memory, evaluation, and defences against prompt injection.
date: 2026-11-22
topic: AI
---
An AI agent is a language model that can take actions: call tools, look things up and work through a task in several steps. MeetAI, a personal project of mine, lets users create their own AI agent and hold a video meeting with it. This post covers the parts that matter when you build an agent: the loop, tools, retrieval, memory, evaluation, security and cost. For background on the models themselves, see [How large language models work](/blog/how-large-language-models-work).

## The agent loop

Every agent, however it's packaged, runs the same loop:

1. Send the model the instructions, the conversation so far and the list of tools it may use.
2. The model replies either with text for the user or with one or more *tool calls*: a tool name plus arguments in JSON.
3. Your code runs the tools and adds the results to the conversation.
4. Repeat until the model gives a final answer or a limit is reached.

In code, with `callModel`, `tools` and `runTool` standing in for your provider's SDK and your own functions:

```ts
async function runAgent(messages: Message[], maxSteps = 10): Promise<string> {
  for (let step = 0; step < maxSteps; step++) {
    const reply = await callModel({ messages, tools });
    messages.push(reply.message);

    if (reply.toolCalls.length === 0) return reply.text; // final answer

    for (const call of reply.toolCalls) {
      // Validate the arguments and check permissions before running anything.
      const result = await runTool(call.name, call.arguments);
      messages.push({ role: "tool", toolCallId: call.id, content: result });
    }
  }
  throw new Error("Agent stopped: step limit reached");
}
```

The model never runs anything itself. It can only ask, and your code decides what actually happens. That's the most important property for both reliability and security. Always set a step limit and a budget for time and cost, because a confused agent can otherwise loop for a long time.

## Tools: describe them well, validate everything

A tool is described to the model with a name, a description and a JSON Schema for its arguments. Field names differ between providers, but the shape is the same:

```json
{
  "name": "search_orders",
  "description": "Find the signed-in customer's orders by status. Returns at most 20 orders, newest first.",
  "input_schema": {
    "type": "object",
    "properties": {
      "status": { "type": "string", "enum": ["pending", "shipped", "cancelled"] },
      "limit": { "type": "integer", "minimum": 1, "maximum": 20 }
    },
    "required": ["status"]
  }
}
```

Notice that there's no customer ID argument. The tool takes the customer from the signed-in session, so the model can't ask for someone else's orders, however it's prompted.

A few rules of thumb:

- **The description is the documentation the model reads.** Say what the tool does, what it returns and when to use it.
- **Prefer a few clear tools over many overlapping ones.** Similar tools are easy for the model to confuse.
- **Validate arguments in code,** with a library such as Zod, even if the provider enforces the schema. Treat them like any other user input.
- **Return short, structured results and useful errors.** "No orders with status 'shipped'" helps the model recover; a stack trace doesn't.

The Model Context Protocol (MCP) standardises how tools and data sources are offered to models, so one tool server can work with several agent applications.

When your code, rather than a person, consumes the model's answer, ask for *structured output*: JSON that matches a schema. Many APIs can constrain the output to a schema. Validate it anyway.

## Retrieval: giving the agent the right facts

Models don't know your documents, and they can't hold all of them in the context window. Retrieval-augmented generation (RAG) fetches the relevant parts for each question:

1. Split documents into chunks of a few hundred tokens, with some overlap.
2. Turn each chunk into an *embedding*, a vector that captures its meaning, using an embedding model.
3. Store the vectors in a vector index, for example pgvector in PostgreSQL or a dedicated vector database.
4. For each question, embed it, find the nearest chunks and put them in the prompt with an instruction to answer from them and cite them.

In practice:

- **Retrieval quality usually decides answer quality.** Measure it separately: did the right chunks come back?
- **Combine keyword and vector search** for names, IDs and exact terms, which embeddings handle poorly.
- **Apply access control when retrieving,** not after. Only search documents the current user is allowed to see. In PostgreSQL, row-level security can enforce this inside the database.

## Memory

A model remembers nothing between requests, so all memory is something your application designs.

- **Short-term memory** is the conversation in the context window. When it grows too long, summarise older turns and drop tool results that are no longer needed.
- **Long-term memory** is information saved outside the model, such as a user's preferences, and retrieved when it's relevant. Decide explicitly what gets saved, let users see and delete it, and don't keep sensitive data you don't need.

## Evaluation

Changing a prompt or a model can quietly break behaviour that used to work, so treat evaluation like a test suite.

- **Build a set of real tasks** with expected outcomes, and run it on every prompt or model change.
- **Check what you can in code.** Was the right tool called with the right arguments? Does the output match the schema?
- **Use an LLM as a judge carefully** for open-ended answers. Give it a clear rubric and check its scores against human ratings on a sample. Judges have known biases, such as favouring the first answer shown, longer answers or text written by the same model.
- **Log full traces**, including prompts, tool calls and results, so you can see why a run went wrong.

## Security: treat the model's input as untrusted

I started out in cybersecurity internships, and agents raise an old question in a new form: what happens when untrusted input can trigger actions?

The main risk is *prompt injection*. In direct injection, a user tells the model to ignore its instructions. In indirect injection, the instructions are hidden in content the agent reads: a web page, an email, a document or a tool result. Models can't reliably tell data from instructions, and the OWASP Top 10 for LLM Applications puts prompt injection first.

You can't prompt your way out of this, so limit what a successful injection can do:

- **Least privilege.** Give each tool only the access it needs, read-only where possible, and scope it to the current user through the session rather than through IDs the model supplies.
- **Human confirmation for risky actions.** Payments, sending messages and deleting data should wait for the user to approve exactly what will happen.
- **Treat tool output and retrieved text as data.** It must never unlock new tools or change permissions.
- **Handle model output like user input.** Anything the model writes that goes into HTML, SQL, a shell command or a URL needs the same escaping and parameterisation as any untrusted string.
- **Watch for data leaks.** An injected instruction may try to send private data out, for example inside a link or image URL. Restrict which URLs the agent can request and which the interface will render.
- **Keep secrets out of prompts.** Assume the system prompt can leak.
- **Set limits.** Rate limits, step limits and spending caps stop a runaway or abused agent from running up costs.

A good working assumption: anything the agent can do, an attacker who controls part of its input may be able to make it do.

## Cost and latency

- **Use smaller, faster models for simple steps** such as routing, classification and extraction, and save the largest model for hard reasoning.
- **Keep stable content at the start of the prompt.** Instructions and tool definitions that don't change can then be served from the provider's prompt cache.
- **Cache tool and retrieval results** that don't change often.
- **Stream responses** so users see text straight away.
- **Run independent tool calls in parallel.**
- **Trim the context.** Don't keep re-sending large tool results the model no longer needs.

## Summary

- An agent is a loop: the model asks for tool calls, your code runs them, and the results go back to the model.
- Clear tool descriptions, strict validation and session-scoped permissions make tools reliable and safe.
- Retrieval provides facts, memory is an application design decision, and evaluation keeps changes from breaking things.
- Treat everything the model reads as untrusted, and limit what it can do without a person's approval.

## Further reading

- [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
- [Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection](https://arxiv.org/abs/2302.12173)
- [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685)
- [JSON Schema](https://json-schema.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [pgvector](https://github.com/pgvector/pgvector)
