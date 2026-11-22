---
title: How MLS keeps a group chat end-to-end encrypted
description: A practical introduction to Messaging Layer Security (MLS, RFC 9420): ratchet trees, epochs, commits and welcomes, and what changes when you build a chat on it.
date: 2026-11-22
topic: Encryption
---
I'm the main developer of Finvox, an end-to-end encrypted team chat for web and mobile that I build at Quikkred. Its group conversations are encrypted with MLS, the Messaging Layer Security protocol. This is the explanation I wish I'd had at the start: what problem MLS solves, how it works, and what it means for the code around it. If end-to-end encryption is new to you, start with [End-to-end encryption explained](/blog/end-to-end-encryption-explained).

## Why group encryption is hard

Encrypting a conversation between two people is a well-solved problem. Groups are harder, because every member needs the keys and the membership keeps changing.

The simplest approach is to encrypt each message separately for every other member. That's fine for five people, but every single message then costs work proportional to the size of the group.

A common improvement is *sender keys*. Each member creates a key for the messages they send and shares it with every other member over pairwise encrypted channels. Sending is now cheap, but membership changes aren't. When someone leaves, every remaining member needs a new sender key that the departed member doesn't know, and each new key has to be sent to everyone else. In a 100-person group that's close to 10,000 pairwise messages to remove one person. Recovering after a device is compromised costs the same, so it's expensive to do often.

MLS keeps sending cheap and makes membership changes cheap too.

## The ratchet tree

MLS is an IETF standard, published in July 2023 as RFC 9420. Its central idea is the *ratchet tree*: a binary tree whose leaves are the members of the group.

Nodes in the tree have key pairs. Each member knows the private keys of the nodes on the path from their own leaf up to the root, and none of the others. The secret at the root is therefore known to the whole group, and it feeds the keys for the group's current state.

When a member wants to refresh the group's keys, they generate new secrets for every node on their path to the root. Each new secret is encrypted to the subtree next to that node, so exactly the members who need it can decrypt it with keys they already hold. In a full, balanced tree of *n* members that's about log₂ *n* encryptions: around 7 for a group of 100, and 10 for a group of 1,000.

The encryption to a node's public key uses HPKE (Hybrid Public Key Encryption, RFC 9180), which MLS uses as its building block for public-key encryption.

## Epochs, proposals and commits

An MLS group moves forward in *epochs*. Each epoch has its own secrets, and every key used during the epoch is derived from them.

Changes happen in two steps:

1. A **proposal** suggests a change: add a member, remove a member, or update your own keys.
2. A **commit** applies one or more proposals. The committer refreshes the keys along their path to the root, the group moves to a new epoch, and every member derives the new secrets.

New members don't get the old secrets. Instead, the committer sends them a **welcome** message containing what they need to join the new epoch, encrypted to a *key package* the new member published in advance. A key package is a signed bundle that includes a public key meant for a single use, similar to the prekeys in other messaging protocols.

## Message keys and the secret tree

Ordinary chat messages don't change the epoch. From each epoch's secrets, MLS derives a *secret tree* that gives every member their own hash ratchet. Each message a member sends uses the next key in their chain, and keys are deleted once used. Because each sender has a separate chain, members can send at the same time without coordinating.

## What you get

- **Forward secrecy.** Keys are deleted after use, so an attacker who steals a device's keys today can't decrypt messages they recorded earlier.
- **Post-compromise security.** If a member's keys leak, the attacker is locked out again once that member commits fresh keys.
- **Agreement on membership.** Everyone in an epoch has the same view of who is in the group, so a new member can't be slipped in without appearing in everyone's member list.
- **Efficiency.** Adding a member, removing one or refreshing keys costs about log *n* operations rather than *n* or *n²*.

## What the server still does

End-to-end encryption doesn't make the server disappear. MLS describes two services around the protocol.

The **delivery service** stores key packages and relays messages. Its most important job is putting commits in order, because every member must apply the same commits in the same order. It can't read messages, but it does see metadata, such as who is in which group and when they send.

The **authentication service** ties each member's signing key to a real identity, such as a user account. Members check those credentials before trusting a key, which is what stops the server from adding a member under a false name.

## Lessons from building on it

**Put commits in order on the server.** Two members can commit at the same moment, and both can't win. A simple approach is for the server to accept exactly one commit per epoch and reject the rest. The rejected client then processes the winning commit and retries its own change in the new epoch. The retry path deserves as much testing as the cryptography.

**Every device is a member.** In MLS, a phone and a laptop are two separate leaves. Signing in on a new device means adding that device to every group the user belongs to, and linking it securely in the first place needs its own protocol. In Finvox, new devices are linked with HPKE.

**History doesn't come for free.** A new member, or a new device, can't read messages from before it joined. That is forward secrecy doing its job. If users expect their history on a new phone, you need a separate, deliberate way to hand it over, and it deserves the same care as the protocol itself.

**Keep key packages topped up.** Key packages are meant to be used once. If someone's supply runs out while they're offline, nobody can add them to a group, so clients should upload fresh ones regularly. Many implementations also keep a reusable last-resort key package as a fallback for exactly this case.

**Don't write the cryptography yourself.** Use a maintained, tested implementation such as OpenMLS, and spend your effort on the parts that are yours: storage, ordering, device management and the experience around them.

## Summary

- Pairwise encryption and sender keys make membership changes expensive in large groups.
- MLS arranges members in a ratchet tree, so a key update costs about log *n* encryptions.
- The group moves through epochs: proposals suggest changes, commits apply them, and welcome messages bring in new members.
- MLS gives forward secrecy, post-compromise security and agreement on who is in the group.
- The hard engineering is around the protocol: ordering commits, managing devices, history and key packages.

## Further reading

- [RFC 9420: The Messaging Layer Security (MLS) Protocol](https://www.rfc-editor.org/rfc/rfc9420)
- [RFC 9750: The Messaging Layer Security (MLS) Architecture](https://www.rfc-editor.org/rfc/rfc9750)
- [RFC 9180: Hybrid Public Key Encryption](https://www.rfc-editor.org/rfc/rfc9180)
- [OpenMLS](https://github.com/openmls/openmls)
