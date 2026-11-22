---
title: End-to-end encryption explained: from key exchange to forward secrecy
description: How end-to-end encryption works: key agreement with X25519, authenticated encryption, verifying keys, forward secrecy and what the server still sees.
date: 2026-11-22
topic: Encryption
---
I'm the main developer of Finvox, an end-to-end encrypted team chat that I build at Quikkred. A question I hear a lot is what "end-to-end" adds on top of the padlock in the browser. This post builds the idea up from first principles: the problem it solves, the pieces of cryptography it's made of, and the parts that are still hard.

## Encrypted in transit is not end-to-end

TLS, the protocol behind HTTPS and the padlock icon, encrypts the connection between your device and a server. It's essential, but the server decrypts everything it receives. A chat service that only uses TLS can read every message. So can anyone who breaches its database, an insider with the right access, or anyone who can compel the company to hand data over.

End-to-end encryption (E2EE) means a message is encrypted on the sender's device and only decrypted on the recipients' devices. The server stores and forwards ciphertext it can't read, because the keys never leave the "ends".

E2EE doesn't replace TLS. You still want TLS to protect your API, your sign-in and everything that isn't a message. E2EE adds a layer inside it that the server can't open.

## Agreeing on a key with someone you've never met

Two devices need a shared secret key, but they can only talk through a server that mustn't learn it. Public-key cryptography solves this.

Each device generates a key pair: a private key that never leaves the device, and a public key it can publish. With Diffie–Hellman key agreement, Alice combines her private key with Bob's public key, Bob combines his private key with Alice's public key, and both arrive at the same shared secret. Someone who sees both public keys can't compute it.

Today this is usually done with X25519, Diffie–Hellman on Curve25519, specified in RFC 7748. Keys are 32 bytes, and the operations are fast enough for any phone.

The raw shared secret isn't used directly as an encryption key. It goes through a key derivation function such as HKDF (RFC 5869), which turns it into uniformly random keys for specific purposes. Node.js can show the whole exchange in a few lines:

```ts
import { generateKeyPairSync, diffieHellman, hkdfSync } from "node:crypto";

const alice = generateKeyPairSync("x25519");
const bob = generateKeyPairSync("x25519");

// Each side combines its own private key with the other side's public key.
const aliceSecret = diffieHellman({ privateKey: alice.privateKey, publicKey: bob.publicKey });
const bobSecret = diffieHellman({ privateKey: bob.privateKey, publicKey: alice.publicKey });
console.log(aliceSecret.equals(bobSecret)); // true

// Derive a 256-bit key for a specific purpose from the shared secret.
const messageKey = Buffer.from(hkdfSync("sha256", aliceSecret, Buffer.alloc(0), "chat message key", 32));
```

This is for illustration. A real product should use an established protocol and a well-reviewed library rather than assembling the pieces by hand.

## Authenticated encryption

Once both sides share a key, each message is encrypted with an AEAD: authenticated encryption with associated data. AES-256-GCM and ChaCha20-Poly1305 (RFC 8439) are the common choices.

An AEAD does two jobs at once. It keeps the message secret, and it attaches a tag that proves the ciphertext hasn't been changed. If anyone flips a single bit on the way, decryption fails instead of producing altered text. The "associated data" is information that isn't secret but mustn't be tampered with, such as the sender's ID or a message number. It's covered by the tag without being encrypted.

Two rules matter in practice:

- **Never reuse a nonce with the same key.** With AES-GCM, a repeated nonce can reveal information about both messages and lets an attacker forge new ones. Protocols avoid this by deriving a fresh key for every message or by using counters.
- **Treat a failed decryption as an attack, not a glitch.** Reject the message. Don't try to show part of it.

## Who am I really talking to?

Key agreement protects you from people who can only watch the traffic. It doesn't protect you from the server itself. A malicious or compromised server could give Alice its own public key while claiming it's Bob's, decrypt her messages, and re-encrypt them for Bob. This is a man-in-the-middle attack, and guarding against it is the main job of an E2EE system beyond the encryption itself.

There are two broad defences:

- **Manual verification.** Signal shows a *safety number* derived from both people's public keys. If two people compare it in person or over a call and it matches, nobody is in the middle. It's strong, but few people do it.
- **Key transparency.** The service publishes every user's public keys in an append-only log that can be audited. Clients check that the key they were given is the one in the log, and that their own entry hasn't been changed behind their back. WhatsApp and Apple's iMessage both offer forms of this, and the IETF has a working group, KEYTRANS, standardising it.

Either way, an app should tell the user when a contact's key changes, because that's when an attack would show up.

## Forward secrecy and the Double Ratchet

Suppose an attacker records encrypted traffic for months and later steals a device's long-term private key. If every message was encrypted under keys derived from that one key, they can now decrypt everything they recorded.

*Forward secrecy* prevents this. Messages are encrypted with short-lived keys that are deleted after use, so a later compromise can't unlock earlier messages.

Signal's Double Ratchet algorithm is the best-known way to achieve this in two-person chats. It combines two ratchets:

- A **symmetric-key ratchet.** After each message, the current chain key goes through a key derivation function that produces the next message key and a new chain key, and the old values are deleted. The step only works forwards, so knowing today's key doesn't reveal yesterday's.
- A **Diffie–Hellman ratchet.** Whenever the conversation changes direction, the sender includes a new ephemeral public key, and a fresh Diffie–Hellman result is mixed into the chain. This gives *post-compromise security*: an attacker who steals the current state loses access again once new key pairs they never saw are in use.

Starting a conversation with someone who's offline needs a separate handshake, using keys the recipient published in advance. Signal's original handshake was X3DH; its newer PQXDH also resists future quantum computers.

Groups make all of this more expensive. I've written a separate post on [how MLS keeps a group chat end-to-end encrypted](/blog/mls-end-to-end-encrypted-group-chat).

## What the server still sees

E2EE protects the content of messages, not everything around them. A typical server still knows:

- who talks to whom, and when
- who is in which group
- message sizes and timing
- IP addresses and device details
- account details, such as a phone number or email address

That metadata can be revealing on its own. Some systems reduce it; Signal's sealed sender, for example, hides who sent a message from the server. None remove it entirely, so when you describe a product as end-to-end encrypted, be precise that it's the content that's protected.

Attachments follow the same principle. A common pattern is to encrypt the file on the device with a random key, upload only the encrypted file, and send the key inside an end-to-end encrypted message. Finvox encrypts attachments end to end as well as messages.

## The hard parts: devices and backups

The cryptography is well understood. The harder questions come from the fact that keys live on devices.

- **More than one device.** Each phone, laptop and browser has its own keys. Adding a device must be approved from a device the user already has, or the server could quietly add one of its own. In Finvox, devices are linked with HPKE (Hybrid Public Key Encryption, RFC 9180), a standard way to encrypt data to a recipient's public key.
- **Losing every device.** If keys only exist on devices, losing all of them means losing access to the history. That is an honest consequence of E2EE, and the product has to explain it.
- **Backups.** Backups are a common weak point. If chat history is backed up unencrypted, or with a key the provider holds, the end-to-end promise stops at the backup. Encrypted backups need a key the user controls, such as a passphrase or a recovery key, and that brings its own recovery problems.
- **The ends themselves.** E2EE can't protect a device that's already compromised, a screenshot, or a recipient who forwards the message.

## Summary

- TLS protects the connection. End-to-end encryption also protects the content from the server.
- Key agreement such as X25519 gives two devices a shared secret, and an AEAD encrypts and authenticates each message.
- Verifying keys, through safety numbers or key transparency, stops the server from placing itself in the middle.
- Ratcheting keys gives forward secrecy and recovery after a compromise.
- Metadata, multiple devices and backups are where real systems need the most care.

## Further reading

- [RFC 7748: Elliptic Curves for Security (X25519)](https://www.rfc-editor.org/rfc/rfc7748)
- [RFC 5869: HMAC-based Extract-and-Expand Key Derivation Function (HKDF)](https://www.rfc-editor.org/rfc/rfc5869)
- [RFC 8439: ChaCha20 and Poly1305 for IETF Protocols](https://www.rfc-editor.org/rfc/rfc8439)
- [The Double Ratchet Algorithm (Signal)](https://signal.org/docs/specifications/doubleratchet/)
- [The PQXDH Key Agreement Protocol (Signal)](https://signal.org/docs/specifications/pqxdh/)
- [RFC 9180: Hybrid Public Key Encryption](https://www.rfc-editor.org/rfc/rfc9180)
