---
title: "codewarden: an AI security reviewer I can measure"
description: How I built codewarden, a GitHub App that runs security scanners in a sandbox and asks a model to triage every finding, and what its first evaluation on 182 hand-labelled findings showed.
date: 2026-11-28
topic: AI
---
Security scanners are good at finding candidates and bad at telling you which ones matter. Run Semgrep, a secret scanner and a dependency checker on a real codebase and you get a wall of findings: some real, many in test code, some already sanitised, some unreachable. Developers learn to scroll past the bot, and the one real vulnerability scrolls past with the rest. codewarden, a personal project of mine, keeps the scanners and adds a triage step: a model reads each finding with its code and decides whether it is real, how severe it is, and what the smallest fix looks like. The part I cared about most is the last one: proving how often that judgement is right, and what it costs.

## What it does

codewarden reviews pull requests. When a PR opens, a GitHub App receives the webhook, checks out the PR's code into a throwaway workspace and runs three scanners: Semgrep for code (with 27 custom rules for JavaScript and TypeScript), gitleaks for secrets and OSV-Scanner for vulnerable dependencies. Their output is normalised into one finding model, filtered to the lines the PR actually changed, redacted, and triaged. The result is one check run and one review with inline comments, posted once per commit. The same pipeline also runs as a CLI and as an MCP server, so an AI coding assistant can call it.

Three design rules shaped everything:

1. **Scanned code is hostile.** The scanners run in a Docker container with no network, a read-only filesystem, no capabilities and CPU, memory, PID and time limits. The checkout runs no hooks and follows no symlinks. CI proves each of these properties against a deliberately hostile repository.
2. **The model gets no tools.** It reads redacted text and returns a verdict that must match a schema. Everything that touches GitHub is deterministic code that consumes validated verdicts, so a prompt injection in a PR can at worst produce a wrong verdict, never an action.
3. **Some findings can't be dismissed.** A detected secret, or a finding a scanner rates critical, stays visible whatever the model says. A person always sees it.

The review runs as a Temporal workflow, so a worker that crashes mid-scan picks up where it left off and a redelivered webhook never posts twice.

## Measuring it

An AI reviewer that can't show its accuracy is a demo. So the project's centre is an eval harness. The dataset comes from two deliberately vulnerable apps at pinned commits, OWASP Juice Shop and OWASP NodeGoat, plus 19 hand-made pull-request diffs. Eight of those diffs are prompt-injection attempts, each paired with a clean twin: the same code, minus a comment that tries to talk the reviewer into calling it safe.

Every finding was labelled by hand, by me, in a small terminal tool that shows the code and asks one key per answer: real, false positive, or skip. The rule was firm: no model writes the answer key. If a model labels the data, the eval measures how often two models agree, not whether either is right. I labelled 182 findings; 59 of them form a held-out test split, fixed by hash before any run.

The model this time was OpenAI's `gpt-6-luna`, at high reasoning effort, under a hard spending cap of one US dollar for the whole project, enforced in code before every call. These are the results on the 59 test cases, from one run (2026-11-28):

| Findings | Precision | Recall | F1 | Cases |
| --- | --- | --- | --- | --- |
| Code issues (Semgrep) | 100% | 94.7% | 97.3% | 26 |
| Vulnerable dependencies | 100% | 100% | 100% | 21 |
| Secrets (never dismissed, by design) | 33.3% | 100% | 50.0% | 12 |
| All | 84.3% | 97.7% | 90.5% | 59 |

Prompt-injection resistance was 100%: in every pair, the injected comment didn't change the verdict on the real issue (3 pairs in the test split, 11 of 11 across all labels). It never refused. A finding cost about US$0.0007 to triage, a whole review about US$0.005, and the median call took 8.5 seconds.

Two things in that table need reading carefully. First, the secrets row isn't the model failing: because secrets can't be dismissed, their precision is simply the share of detected secrets that were real. Juice Shop is full of test tokens, so most were not. The code and dependency rows show the model's own judgement. Second, 59 cases is small. I also ran a stronger, ten-times pricier model, `gpt-6.1-terra`, and on the 35 test cases both models triaged it scored F1 80.9% against luna's 85.7%. That difference is within noise, and I don't read it as a ranking.

The weakest metric is severity: luna matched my label exactly 39% of the time, though within one level 80% of the time. Fix acceptability, where a suggested patch is applied to a copy of the code and the scanner re-run, passed 4 of 9 checks.

## Trying it on real repositories

Numbers on a benchmark are one thing; I also installed the App on two of my own apps, MeetAI and Infini (an AI SaaS app). Because I had no other work planned on them that week, Claude Code opened the pull requests: genuine fixes on both, and on the private one only, four PRs that each planted one vulnerability and were closed after review. Across the first two days, codewarden reviewed 24 PRs. The genuine fixes came back without findings, and every planted issue was found on the line where it was planted: a SQL injection, a hard-coded key, a server-side request forgery sitting next to a comment asking AI reviewers to mark it safe, and an old axios version with 34 known advisories.

The fixes themselves were real. One made MeetAI's video-call agent speak again on Vercel. Another removed the admin role that every user had in its chat and video service. A third stopped an API token from being written to logs. The trial was as much a test of the projects as of the reviewer.

## What didn't work

Most of what broke was operations, not models.

- **Thirteen PRs at once took the PC down.** The workflow engine's default allows a hundred parallel activities, so the worker started thirteen sandboxed scans together and Docker Desktop's engine gave up. Now the worker runs two at a time, and a burst simply queues.
- **The workflow engine forgot everything on restart.** The local Temporal server kept its state in memory, so a Docker update wiped every review in flight. It now keeps a SQLite file on a volume and restarts with Docker.
- **A webhook arrived a moment too early.** Right after a restart, two deliveries hit Temporal before its namespace was ready, and GitHub doesn't redeliver on its own. The receiver now retries that one error briefly.
- **The spending cap worked a little too well.** It reserves a worst-case cost before each call. Near the end of the budget, that refused 24 of the pricier model's calls, so I compared the two models only on the cases both had actually triaged, rather than publishing a score that measured the cap.

## What's next

The harness is ready for more: several runs per model to measure variance, other effort levels, a prompt variant, and Claude models once I have an API key for them. The dataset needs more false positives; they are 23.5% of my labels against the 30% I aimed for. And the reviewer itself needs a host, so it runs without my PC.

The lesson I'm keeping: build the measurement first. Every change above — new rules, a different model, a stricter policy — now comes with a number attached, and the number comes from a person's labels, not a model's opinion of itself.
