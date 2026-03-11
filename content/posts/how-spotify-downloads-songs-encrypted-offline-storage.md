---
title: "How Spotify Downloads Songs: Encrypted Offline Storage Explained"
excerpt: "Ever wondered what actually happens when you hit 'Download' on a Spotify playlist? The files on your device aren't MP3s — they're encrypted blobs that are completely useless without Spotify's blessing. Here's exactly how that works."
date: "2026-03-11"
tags: ["ENCRYPTION", "DRM", "SYSTEMS", "REVERSE ENGINEERING", "SPOTIFY"]
---

When you tap "Download" on a Spotify playlist, you probably think you're saving music files to your phone. In a sense you are — but those files are nothing like the MP3s or FLACs sitting on your hard drive. They're encrypted containers, bound to your account, your device, and your current subscription status. If any of those three things change, the files become inert garbage bytes.

This post breaks down the full pipeline — from Spotify's servers to the encrypted blobs on your device — and explains why you can't just copy those files to another device and hit play.

## The Download Is Not What You Think

Let's start with what *doesn't* happen. Spotify does not:

- Save `.mp3` or `.ogg` files to your device
- Store anything resembling a playable audio file in a user-accessible location
- Give you raw audio data at any point in the pipeline

What actually happens is closer to this:

1. Your client requests a **file ID** and **decryption key** from Spotify's backend
2. The encrypted audio stream is downloaded from Spotify's CDN
3. The stream is stored locally in Spotify's **private encrypted cache**
4. On playback, the file is decrypted **in memory**, fed to the audio decoder, and never written to disk in plaintext

> [!definition] Offline Storage — In Spotify's context, "downloading" means caching encrypted audio blobs locally so that playback can proceed without a network connection. The audio is never stored in a format any application other than Spotify can read.

Let's walk through each stage.

## Stage 1: Authentication and License Acquisition

Before any audio data moves, Spotify needs to verify that you're allowed to download a particular track. This happens through a multi-step handshake.

When you request a download, the Spotify client sends an authenticated request to Spotify's **access point (AP)** servers. The request includes:

- Your **session token** (tied to your account and device)
- The **track URI** (e.g., `spotify:track:4iV5W9uYEdYUVa79Axb7Rh`)
- Your **device ID** — a unique fingerprint generated during installation

The server responds with:

- A **file ID** pointing to the encrypted audio on the CDN
- A **decryption key** unique to this track + your session
- A **license** specifying playback constraints (expiry, device binding, quality tier)

```
Client                          Spotify AP Server
  |                                    |
  |  POST /track/download-request      |
  |  { session_token, track_uri,       |
  |    device_id, quality }            |
  | ---------------------------------> |
  |                                    |
  |  { file_id, decrypt_key,           |
  |    license { expires, device,      |
  |              max_plays } }         |
  | <--------------------------------- |
  |                                    |
```

> [!warning] The decryption key is never stored in plaintext on disk. It's encrypted with a device-specific key derived from hardware identifiers before being persisted. If you clone the storage to another device, the key derivation produces a different result, and the stored keys become undecryptable.

## Stage 2: Encrypted Download from CDN

With the file ID in hand, the client fetches the actual audio data from Spotify's CDN — a globally distributed network of edge servers (Spotify uses Google Cloud CDN and their own infrastructure called **Spotify Storage**).

The audio is served in Spotify's proprietary container format. For most tracks, the underlying codec is **Ogg Vorbis** (at 96, 160, or 320 kbps depending on your plan and settings) or **AAC** on some platforms. But you never see the raw Ogg stream. What arrives over the wire is already encrypted.

The encryption scheme works like this:

### The Encryption Layer

Spotify uses **AES-128-CTR** (AES in Counter Mode) for encrypting audio data. Here's why CTR mode specifically:

```
AES-128-CTR Encryption:

Plaintext:   [Block 0] [Block 1] [Block 2] [Block 3] ...
              |          |          |          |
              v          v          v          v
Key + CTR:  AES(K,0)   AES(K,1)   AES(K,2)   AES(K,3)
              |          |          |          |
              v          v          v          v
XOR:        [Cipher 0] [Cipher 1] [Cipher 2] [Cipher 3]
```

CTR mode has a critical property for audio streaming: **random access**. Unlike CBC (where you need to decrypt everything sequentially from the start), CTR mode lets you jump to any block and decrypt it independently. This is essential because:

- Users seek to arbitrary positions in a song
- The player needs to start decryption mid-stream without rewinding
- Gapless playback between tracks requires decrypting the end of one track and the start of the next simultaneously

> [!definition] AES-128-CTR — A symmetric encryption mode where a counter value is encrypted with the key to produce a keystream, which is XORed with the plaintext. Each block uses a different counter, enabling parallel and random-access decryption without needing the previous block's ciphertext.

> [!tip] CTR mode also means that the encrypted file is exactly the same size as the plaintext. No padding overhead. This matters when you're storing millions of cached tracks across hundreds of millions of devices.

### The Download Pipeline

The download itself is chunked. Spotify doesn't download the entire file at once — it uses a **chunked streaming protocol** where audio is fetched in pieces (typically 128KB–512KB chunks). Each chunk is independently encrypted with the same key but different counter offsets:

```
Track File Layout (on CDN):

+------------------+
| Header           |  <- Track metadata, encrypted
|  - codec info    |
|  - sample rate   |
|  - duration      |
|  - normalization |
+------------------+
| Chunk 0          |  <- AES-CTR encrypted, counter = 0
|  (128KB)         |
+------------------+
| Chunk 1          |  <- AES-CTR encrypted, counter = N
|  (128KB)         |
+------------------+
| ...              |
+------------------+
| Chunk M          |  <- Last chunk (may be smaller)
+------------------+
```

This chunking is the same mechanism used for streaming — the only difference is that for downloads, all chunks are fetched proactively and stored, rather than fetched on-demand during playback.

## Stage 3: Local Encrypted Storage

Once downloaded, the encrypted chunks are stored in Spotify's local cache. On different platforms, this cache lives in different locations:

| Platform | Typical Cache Path |
|----------|-------------------|
| Android  | `/data/data/com.spotify.music/files/spotifycache/` |
| iOS      | App sandbox, not user-accessible |
| Windows  | `%LocalAppData%\Spotify\Storage\` |
| macOS    | `~/Library/Application Support/Spotify/PersistentCache/Storage/` |
| Linux    | `~/.cache/spotify/Storage/` |

If you navigate to these directories, you'll find files with cryptic names — no `.ogg`, no `.mp3`, no recognizable audio headers. The files are stored in a proprietary format with structure roughly like this:

```
Spotify Cache File Format (approximate):

Offset  Size    Field
------- ------- ----------------------------------------
0x00    4       Magic bytes (file type identifier)
0x04    4       Format version
0x08    16      File ID (matches CDN file ID)
0x18    4       Total chunks
0x1C    4       Chunk size
0x20    8       Total audio length (bytes)
0x28    32      Encrypted key blob
0x48    16      IV / Nonce for key decryption
0x58    N       Encrypted audio data (chunks)
```

> [!warning] The "Encrypted key blob" at offset `0x28` is the track's AES decryption key, but it's itself encrypted using a **device key**. This device key is derived from hardware identifiers (Android ID, iOS keychain, DPAPI on Windows) and is never stored directly. It's computed at runtime. This is the fundamental reason you can't move cache files between devices.

### The Key Hierarchy

This is where it gets interesting. Spotify uses a **multi-layer key hierarchy**:

```
Key Hierarchy:

[Spotify Master Key]         <- Lives on Spotify's servers only
        |
        v
[Account Key]                <- Derived per-user, sent during auth
        |
        v
[Session Key]                <- Rotates periodically, tied to login session
        |
        v
[Track Decryption Key]       <- Per-track, received from AP server
        |
        v
[Device-Encrypted Key Blob]  <- Track key encrypted with device key
        |                       (this is what's stored on disk)
        v
[Device Key]                 <- Derived from hardware IDs at runtime
                                (never stored, computed fresh each time)
```

To play a downloaded track offline, the chain works in reverse:

1. Compute the **device key** from hardware identifiers
2. Decrypt the **key blob** stored in the cache file to recover the track key
3. Use the track key with **AES-128-CTR** to decrypt audio chunks on-the-fly
4. Feed decrypted PCM audio to the platform's audio output

If any link in this chain breaks — wrong device, expired session, cancelled subscription — decryption fails and the cached files are useless.

## Stage 4: Playback and DRM Enforcement

When you actually play a downloaded track, the decrypted audio **never touches the filesystem**. The decryption happens in a memory buffer, and the plaintext audio is passed directly to the audio decoder (Ogg Vorbis or AAC decoder) and then to the platform's audio API:

```
Playback Pipeline:

[Encrypted Cache File]
        |
        | read chunks into memory
        v
[In-Memory Decryption]  <- AES-128-CTR with track key
        |
        | plaintext Ogg/AAC frames
        v
[Audio Codec Decoder]   <- Vorbis or AAC decode to PCM
        |
        | raw PCM samples
        v
[Audio Output API]      <- ALSA/PulseAudio/CoreAudio/WASAPI
        |
        v
    [Speakers]
```

> [!tip] This is why Spotify uses relatively little storage compared to what you'd expect. A 3-minute song at 320kbps Ogg Vorbis is about 7.2MB. The encrypted version is the same size (CTR mode, remember — no padding). 1000 downloaded songs ≈ 7.2GB, which matches what users typically see.

### DRM Check-ins

Even in offline mode, Spotify enforces time-limited licenses. Your client must "check in" with Spotify's servers at least once every **30 days** (the exact interval may vary). During this check-in:

- The server verifies your subscription is still active
- Session keys are refreshed
- License expiry timestamps are updated
- Any revoked tracks are flagged for deletion

If you go offline for more than 30 days, **all downloaded tracks stop working** until you reconnect. The client simply refuses to decrypt them because the license timestamps have expired.

```
License Enforcement:

if (current_time > license.expiry_timestamp) {
    // Don't even attempt decryption
    show_error("Go online to refresh your downloads");
    return;
}

if (device_id != license.bound_device) {
    // Device mismatch — key derivation will fail anyway
    invalidate_cache();
    return;
}

if (!subscription_active) {
    // Nuke all cached keys
    wipe_key_store();
    return;
}
```

## The Widevine / FairPlay Layer

On top of all this, Spotify also integrates with platform-level DRM systems:

- **Widevine** on Android and Chrome
- **FairPlay** on iOS and Safari
- **PlayReady** on Windows (in some configurations)

These provide an additional hardware-backed trust layer. On devices with hardware security modules (like ARM TrustZone on mobile), the final decryption can happen in a **Trusted Execution Environment (TEE)** — a secure enclave that even a rooted/jailbroken device can't easily inspect.

```
Trust Layers:

Application Level:   Spotify's own AES encryption
                           |
Platform DRM Level:  Widevine L1/L3, FairPlay
                           |
Hardware Level:      TEE / Secure Enclave / TPM
                           |
Audio Output:        Protected audio path to DAC
```

> [!definition] Trusted Execution Environment (TEE) — A secure area inside the main processor that runs its own operating system in isolation. Code and data inside the TEE cannot be read or tampered with by the normal OS, even with root access. ARM TrustZone and Intel SGX are common implementations.

On **Widevine L1** devices (most modern Android phones), the actual AES decryption of audio happens inside the TEE. The decrypted audio never enters normal application memory — it goes directly from the TEE to the hardware audio pipeline. This is the gold standard of DRM protection.

On **Widevine L3** devices (older or cheaper hardware, and most desktop browsers), the decryption happens in software within the application process. This is less secure and has been broken multiple times by security researchers, but it's a pragmatic trade-off for device compatibility.

## What Happens When You Cancel Your Subscription

This is where the enforcement becomes visible. When your Spotify Premium subscription lapses:

1. On next server check-in, the server returns `subscription_active: false`
2. The client **wipes the local key store** — all device-encrypted key blobs are deleted
3. The encrypted cache files remain on disk (to save re-downloading if you resubscribe) but they are now **undecryptable** — the keys are gone
4. If you resubscribe, fresh keys are fetched from the server and playback resumes

The encrypted audio data is literally worthless without the keys. This is by design — it means Spotify can grant and revoke access to billions of cached files across hundreds of millions of devices without ever needing to delete or re-download the actual audio data. Only the keys need to change.

```
Subscription Cancellation:

BEFORE (Premium):
  Cache File: [encrypted audio] ← decryptable ✓
  Key Store:  [device-encrypted track keys]
  License:    [valid, expires in 29 days]

AFTER (Free):
  Cache File: [encrypted audio] ← same bytes, still there
  Key Store:  [WIPED]
  License:    [revoked]

  Result: Files exist but cannot be decrypted.
          Audio is cryptographic garbage without keys.
```

> This is the core insight of the entire system. Spotify separates the **content** (encrypted audio, large, expensive to transfer) from the **access rights** (keys, tiny, cheap to revoke). You can revoke access to a 7MB song by deleting a 16-byte key.

## The Anti-Piracy Angle

Every layer of this system is designed to make one thing extremely difficult: **extracting playable audio files from the cache**.

Even if you:

- Root your phone and read the cache directory
- Reverse-engineer the cache file format
- Extract the encrypted key blob

You still need the **device key** (derived from hardware IDs at runtime, never stored) to decrypt the key blob and get the actual AES track key. And even if you somehow extract the device key:

- It's different on every device
- It changes if you factory reset
- On Widevine L1 devices, the key derivation happens inside the TEE where you can't observe it

The system isn't unbreakable — no DRM system is. Widevine L3 has been broken. People have intercepted the decrypted audio stream at the ALSA/PulseAudio level on Linux. But the layered approach means that breaking one layer doesn't give you a scalable piracy pipeline. Each device requires independent effort.

> [!warning] To be clear — circumventing DRM systems violates the DMCA (in the US), the EU Copyright Directive, and similar laws in most jurisdictions. This post is educational. Understanding how these systems work is valuable for engineers building similar content protection systems. Don't use this knowledge to steal music. Artists deserve to get paid.

## Why Not Just Use Normal File Encryption?

You might wonder: why this elaborate key hierarchy? Why not just encrypt each file with the user's password?

Because passwords change. Devices get lost. Subscriptions expire and renew. A single user might have downloads on 5 devices. If you encrypted with the password directly:

- Changing your password would invalidate all downloads on all devices
- You'd need to re-download everything
- There's no way to revoke access to a single device without affecting others

The key hierarchy solves all of this. Each layer of indirection provides a **revocation point**:

| Revocation Need | Key Layer Affected | User Impact |
|---|---|---|
| Track removed from catalog | Track decryption key revoked | Only that track stops working |
| Password changed | Session key rotated | Brief re-auth, downloads survive |
| Device lost/stolen | Device key invalidated | Only that device loses access |
| Subscription cancelled | Account key revoked | All downloads on all devices stop |
| Security breach | Master key rotation | Transparent to users (server-side) |

This is elegant systems design. Each failure mode is isolated to the minimum blast radius.

## Summary

The next time Spotify says "Downloaded," remember what it actually means:

1. **AES-128-CTR encrypted audio** fetched from a CDN and stored in a private cache
2. **Per-track decryption keys** encrypted with a device-derived key and stored alongside the audio
3. **Time-limited licenses** that require periodic online check-ins
4. **Platform DRM** (Widevine/FairPlay) providing hardware-backed security on top
5. **Key hierarchy** enabling granular access revocation without re-downloading content

You don't own those files. You own a **temporary, device-bound, revocable license to decrypt them**. The files themselves are just ciphertext — mathematical noise indistinguishable from random data without the right key chain.

That's the real product Spotify sells. Not music files. Access to a decryption pipeline.